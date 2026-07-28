<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'birthday',
        'study_purpose',
        'level',
        'google_id',
        'otp',
        'otp_expires_at',
        'email_verified',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'otp_expires_at'    => 'datetime',
            'email_verified'    => 'boolean',
            'birthday'          => 'date',
            'password'          => 'hashed',
        ];
    }

    public function decks(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Deck::class);
    }

    public function reviews(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function studySessions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(StudySession::class);
    }

    public function files(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(FileUpload::class);
    }
}