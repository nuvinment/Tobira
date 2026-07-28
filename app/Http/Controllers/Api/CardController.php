<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Deck;
use App\Models\FileUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CardController extends Controller
{
    /**
     * Matches any string containing at least one Hiragana, Katakana, or
     * Kanji character. Used to validate front_text / furigana fields as
     * described in proposal section 2.3 ("Form Handling & Validation").
     */
    protected const JAPANESE_CHAR_REGEX = '/[\x{3040}-\x{30FF}\x{4E00}-\x{9FFF}]/u';

    protected const IMPORT_EXPORT_COLUMNS = ['front_text', 'back_text', 'furigana', 'keigo_form', 'context_sentence', 'audio_path'];

    public function index(Request $request, Deck $deck)
    {
        $this->authorizeView($request, $deck);

        return $deck->cards()->paginate(50);
    }

    public function store(Request $request, Deck $deck)
    {
        $this->authorizeOwnerOrAdmin($request, $deck);

        $validated = $this->validateCard($request);
        $validated['deck_id'] = $deck->id;

        $card = Card::create($validated);

        return response()->json($card, 201);
    }

    public function show(Request $request, Deck $deck, Card $card)
    {
        $this->authorizeView($request, $deck);
        $this->assertBelongsToDeck($deck, $card);

        return $card;
    }

    public function update(Request $request, Deck $deck, Card $card)
    {
        $this->authorizeOwnerOrAdmin($request, $deck);
        $this->assertBelongsToDeck($deck, $card);

        $validated = $this->validateCard($request, partial: true);

        $card->update($validated);

        return $card;
    }

    public function destroy(Request $request, Deck $deck, Card $card)
    {
        $this->authorizeOwnerOrAdmin($request, $deck);
        $this->assertBelongsToDeck($deck, $card);

        $card->delete();

        return response()->json(status: 204);
    }

    /**
     * Bulk-import cards from a CSV or JSON file. Expected columns/keys:
     * front_text, back_text, furigana, keigo_form, context_sentence, audio_path.
     * front_text and back_text are required; the rest are optional.
     */
    public function import(Request $request, Deck $deck)
    {
        $this->authorizeOwnerOrAdmin($request, $deck);

        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt,json', 'max:2048'],
        ]);

        $file = $request->file('file');
        $extension = strtolower($file->getClientOriginalExtension());

        $rows = $extension === 'json'
            ? (json_decode(file_get_contents($file->getRealPath()), true) ?? [])
            : $this->parseCsv($file->getRealPath());

        $created = 0;
        $skipped = 0;
        $errors = [];

        foreach ($rows as $i => $row) {
            $validator = Validator::make($row, [
                'front_text' => ['required', 'string', 'max:255'],
                'back_text' => ['required', 'string', 'max:255'],
                'furigana' => ['nullable', 'string', 'max:255'],
                'keigo_form' => ['nullable', 'string', 'max:100'],
                'context_sentence' => ['nullable', 'string', 'max:1000'],
                'audio_path' => ['nullable', 'string', 'max:500'],
            ]);

            if ($validator->fails()) {
                $skipped++;
                $errors[] = 'Row '.($i + 1).': '.implode(' ', $validator->errors()->all());
                continue;
            }

            Card::create(array_merge($validator->validated(), ['deck_id' => $deck->id]));
            $created++;
        }

        FileUpload::create([
            'user_id' => $request->user()->id,
            'original_name' => $file->getClientOriginalName(),
            'stored_path' => '', // not persisted to disk, processed in-memory then discarded
            'file_type' => $extension === 'json' ? 'json' : 'csv',
            'uploaded_at' => now(),
            'is_valid' => $skipped === 0,
        ]);

        return response()->json([
            'created' => $created,
            'skipped' => $skipped,
            'errors' => $errors,
        ]);
    }

    /**
     * Export all cards in a deck as CSV or JSON for offline use / sharing,
     * per proposal section 2.1 "File Import and Export".
     */
    public function export(Request $request, Deck $deck)
    {
        $this->authorizeView($request, $deck);

        $format = $request->query('format', 'csv');
        $cards = $deck->cards;
        $filename = Str::slug($deck->title) ?: 'deck';

        if ($format === 'json') {
            $payload = $cards->map(fn ($card) => collect($card)->only(self::IMPORT_EXPORT_COLUMNS))->values();

            return response()->json($payload)
                ->header('Content-Disposition', "attachment; filename=\"{$filename}.json\"");
        }

        $columns = self::IMPORT_EXPORT_COLUMNS;

        return response()->streamDownload(function () use ($cards, $columns) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $columns);
            foreach ($cards as $card) {
                fputcsv($handle, array_map(fn ($col) => $card->{$col}, $columns));
            }
            fclose($handle);
        }, "{$filename}.csv", ['Content-Type' => 'text/csv']);
    }

    protected function parseCsv(string $path): array
    {
        $rows = [];
        $handle = fopen($path, 'r');
        $header = fgetcsv($handle);

        if (! $header) {
            fclose($handle);
            return [];
        }

        $header = array_map('trim', $header);

        while (($line = fgetcsv($handle)) !== false) {
            if (count($line) !== count($header)) {
                continue; // skip malformed rows rather than crash the import
            }
            $rows[] = array_combine($header, $line);
        }

        fclose($handle);

        return $rows;
    }

    protected function validateCard(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'front_text' => [$required, 'string', 'max:255', 'regex:'.self::JAPANESE_CHAR_REGEX],
            'back_text' => [$required, 'string', 'max:255'],
            'furigana' => ['nullable', 'string', 'max:255', 'regex:'.self::JAPANESE_CHAR_REGEX],
            'keigo_form' => ['nullable', 'string', 'max:100'],
            'context_sentence' => ['nullable', 'string', 'max:1000'],
            'audio_path' => ['nullable', 'string', 'max:500'],
        ], [
            'front_text.regex' => 'The Japanese term must contain at least one hiragana, katakana, or kanji character.',
            'furigana.regex' => 'Furigana must be written in hiragana or katakana.',
        ]);
    }

    protected function assertBelongsToDeck(Deck $deck, Card $card): void
    {
        if ($card->deck_id !== $deck->id) {
            abort(404);
        }
    }

    protected function authorizeView(Request $request, Deck $deck): void
    {
        $user = $request->user();

        if (! $deck->is_public && $deck->user_id !== $user->id && ! $user->hasRole('admin')) {
            abort(403, 'You do not have access to this deck.');
        }
    }

    protected function authorizeOwnerOrAdmin(Request $request, Deck $deck): void
    {
        $user = $request->user();

        if ($deck->user_id !== $user->id && ! $user->hasRole('admin')) {
            abort(403, 'You do not have permission to modify this deck.');
        }
    }
}
