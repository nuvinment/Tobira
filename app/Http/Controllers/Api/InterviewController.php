<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deck;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class InterviewController extends Controller
{
    /**
     * Stateless chat turn for the AI mock-interview feature. The frontend
     * keeps the full conversation history and resends it each call (same
     * pattern as any stateless LLM chat integration) along with the
     * person's newest message. We inject vocabulary from the relevant
     * deck into the system prompt so the interviewer naturally uses the
     * same phrases the student has been drilling with SM-2.
     */
    public function respond(Request $request)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'history' => ['array'],
            'history.*.role' => ['required_with:history', 'in:user,model'],
            'history.*.text' => ['required_with:history', 'string'],
            'deck_id' => ['nullable', 'integer', 'exists:decks,id'],
        ]);

        $apiKey = config('services.gemini.key');
        $model = config('services.gemini.model', 'gemini-2.5-flash');

        if (! $apiKey) {
            return response()->json([
                'message' => 'The AI interview feature is not configured yet (missing GEMINI_API_KEY).',
            ], 503);
        }

        $vocabHint = $this->buildVocabHint($validated['deck_id'] ?? null);

        $systemInstruction = <<<PROMPT
あなたは日本の企業の採用面接官です。就職の面接練習のロールプレイをしてください。

ルール:
- 必ず日本語のみで話してください。英語は使わないでください。
- 一度に一つの質問だけをしてください。短く、自然な話し言葉にしてください（2〜3文程度）。
- 丁寧語・敬語を使ってください。
- 相手の日本語に軽い文法や言葉遣いの間違いがあれば、面接の流れを止めずに、自然に言い換えて優しく示してください。
- 相手が自己紹介、志望動機、長所・短所などを話したら、それに対する自然な反応をしてから次の質問に進んでください。
- 面接は5〜7個の質問程度で終えて、最後に丁寧にお礼を言って締めくくってください。

以下は今回の面接でよく使われる語彙です。自然な範囲でこれらの表現を使ってください:
{$vocabHint}
PROMPT;

        $contents = [];
        foreach ($validated['history'] ?? [] as $turn) {
            $contents[] = [
                'role' => $turn['role'],
                'parts' => [['text' => $turn['text']]],
            ];
        }
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $validated['message']]],
        ];

        $response = Http::withHeaders([
            'x-goog-api-key' => $apiKey,
            'Content-Type' => 'application/json',
        ])->post(
            "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent",
            [
                'contents' => $contents,
                'systemInstruction' => [
                    'parts' => [['text' => $systemInstruction]],
                ],
                'generationConfig' => [
                    'temperature' => 0.8,
                    'maxOutputTokens' => 300,
                ],
            ]
        );

        if ($response->failed()) {
            return response()->json([
                'message' => 'The AI interviewer is unavailable right now. Please try again shortly.',
                'debug' => config('app.debug') ? $response->json() : null,
            ], 502);
        }

        $reply = data_get($response->json(), 'candidates.0.content.parts.0.text');

        if (! $reply) {
            return response()->json([
                'message' => 'The AI interviewer did not return a response. Please try again.',
            ], 502);
        }

        return response()->json(['reply' => trim($reply)]);
    }

    protected function buildVocabHint(?int $deckId): string
    {
        $query = Deck::query();

        if ($deckId) {
            $query->where('id', $deckId);
        } else {
            $query->where('scenario_tag', 'Job Interview');
        }

        $deck = $query->with('cards')->first();

        if (! $deck || $deck->cards->isEmpty()) {
            return '自己紹介、志望動機、長所と短所、御社、弊社';
        }

        return $deck->cards
            ->map(fn ($card) => "{$card->front_text}（{$card->back_text}）")
            ->implode('、');
    }
}
