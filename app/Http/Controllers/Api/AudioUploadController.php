<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FileUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AudioUploadController extends Controller
{
    /**
     * Accept an audio file upload, store it on the public disk, and
     * record it in the files table (per proposal section 2.3 "File
     * Management"). Returns the public URL to use as a card's audio_path.
     */
    public function store(Request $request)
    {
        $request->validate([
            'audio' => ['required', 'file', 'mimes:mp3,wav,ogg,m4a,mpga', 'max:10240'], // 10MB
        ]);

        $file = $request->file('audio');
        $storedName = Str::uuid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs('audio', $storedName, 'public');

        $upload = FileUpload::create([
            'user_id' => $request->user()->id,
            'original_name' => $file->getClientOriginalName(),
            'stored_path' => $path,
            'file_type' => 'audio',
            'uploaded_at' => now(),
            'is_valid' => true,
        ]);

        return response()->json([
            'url' => Storage::disk('public')->url($path),
            'file_id' => $upload->id,
        ], 201);
    }
}
