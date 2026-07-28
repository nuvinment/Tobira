<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FileUpload extends Model
{
    use HasFactory;

    protected $table = 'files';

    protected $fillable = [
        'user_id',
        'original_name',
        'stored_path',
        'file_type',
        'uploaded_at',
        'is_valid',
    ];

    protected function casts(): array
    {
        return [
            'uploaded_at' => 'datetime',
            'is_valid' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
