<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'student']);

        // Create default admin account
        $admin = User::firstOrCreate(
            ['email' => 'admin@tobira.com'],
            [
                'name'          => 'Tobira Admin',
                'username'      => 'admin',
                'password'      => Hash::make('Admin@1234'),
                'birthday'      => '1990-01-01',
                'study_purpose' => 'Career',
                'level'         => 'Advanced',
                'email_verified'=> true,
                'email_verified_at' => now(),
            ]
        );

        $admin->assignRole('admin');
    }
}