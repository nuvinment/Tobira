# Tobira 扉 - Business Japanese Spaced Repetition Learning Platform

Tobira is a full-stack web application that helps learners master Business
Japanese — keigo, workplace vocabulary, and interview phrases — using the
SM-2 spaced repetition algorithm, flashcards, quizzes, and a voice-enabled
AI mock-interview feature.

## Features

- **Flashcard study engine** using the SM-2 spaced repetition algorithm
  (Again / Hard / Good / Easy self-rating, automatic scheduling)
- **Business Japanese content library** organised by workplace scenario
  (Job Interview, Client Meetings, Email Etiquette, Telephone Calls, Office
  Daily Use), JLPT level, and keigo register
- **Furigana toggle**, **audio pronunciation upload and playback**
- **CSV/JSON deck import and export**
- **Quiz mode** — multiple-choice self-testing on cards already studied
- **Personal review history** — a log of past study sessions
- **30-day activity heatmap** and streak tracking
- **AI-powered mock interview practice** (Job Interview deck) with
  speech-to-text and text-to-speech, powered by Google's Gemini API
- **Admin panel** — deck/card management, user management (role
  promotion/demotion), platform analytics (daily active users, deck
  engagement, most-failed cards, per-student progress)
- **Role-based authentication** (Student / Admin) with email OTP
  verification
- Full **REST API** backend with a decoupled React single-page frontend

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13 (PHP), REST API |
| Frontend | React 18, React Router |
| Styling | Tailwind CSS |
| Database | MySQL |
| Authentication | Laravel Sanctum (token-based), Spatie Laravel-Permission (roles) |
| AI Interview | Google Gemini API |
| Testing | PHPUnit |

> **Note on authentication:** the original proposal specified Laravel
> Breeze for authentication. Because the frontend was rebuilt as a
> decoupled single-page application (rather than server-rendered Blade/
> Inertia views), Breeze's session-based scaffolding was replaced with
> Laravel Sanctum token authentication plus a custom OTP email-verification
> step. Spatie Laravel-Permission is still used exactly as originally
> specified for role management. This is a deliberate architecture
> decision made necessary by the SPA rebuild, not an omission.

## Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+ and npm
- MySQL 8.0+
- A Gemini API key (free tier) if you want the AI interview feature to work

## Installation

1. **Clone/copy the project**, then install PHP dependencies:
   ```bash
   composer install
   ```

2. **Install JavaScript dependencies:**
   ```bash
   npm install
   ```
   (if you hit a peer-dependency conflict between `vite` and
   `@vitejs/plugin-react`, run `npm install --legacy-peer-deps` instead)

3. **Set up your environment file:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure `.env`** with your database credentials:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=tobira
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   Create the `tobira` database in phpMyAdmin (or via `mysql` CLI) before
   the next step — migrations create tables, not the database itself.

   Also set `APP_URL` to match wherever you'll run the server, e.g.:
   ```
   APP_URL=http://127.0.0.1:8000
   ```

   For mail (OTP delivery) and the AI interview feature, add:
   ```
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your@gmail.com
   MAIL_PASSWORD=your-16-char-app-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS="your@gmail.com"

   GEMINI_API_KEY=your-gemini-api-key
   ```

5. **Run database migrations and seed roles + sample content:**
   ```bash
   php artisan migrate
   php artisan db:seed
   php artisan db:seed --class=DeckCardSeeder
   ```

6. **Link storage** (required for uploaded audio files to be publicly
   accessible):
   ```bash
   php artisan storage:link
   ```

7. **Start the backend:**
   ```bash
   php artisan serve
   ```

8. **In a second terminal, start the frontend build:**
   ```bash
   npm run dev
   ```

9. Visit `http://127.0.0.1:8000` in your browser.

## Creating an Admin Account

There is no self-service admin registration. Register normally as a
student, then promote your own account via `php artisan tinker`:

```php
$user = App\Models\User::where('email', 'you@example.com')->first();
$user->syncRoles(['admin']);
```

Or, once at least one admin exists, promote further accounts from
**Admin → Manage Users** in the app itself.

## Running Tests

```bash
php artisan test
```

Tests run against an in-memory SQLite database (configured in
`phpunit.xml`) and never touch your real MySQL data. If tests fail with
`could not find driver`, enable the `pdo_sqlite` extension in your
`php.ini` and re-run.

## Project Structure (high level)

```
app/Http/Controllers/Api/   REST API controllers
app/Models/                 Eloquent models (User, Deck, Card, Review, ...)
app/Services/               ReviewSchedulerService (SM-2 algorithm)
database/migrations/        Schema
database/seeders/           RoleSeeder, DeckCardSeeder (sample content)
resources/js/Pages/         React page components (Student/, Admin/, Auth/)
resources/js/Components/    Reusable components (FlashCard, RatingButtons, ...)
routes/api.php              All REST API routes
tests/Unit, tests/Feature/  PHPUnit test suite
```

## License

Academic project — Web Programming module coursework.
