<?php

use Illuminate\Support\Facades\Route;

// Everything is now a client-rendered SPA. Laravel's only job on the web
// side is to serve the app shell (resources/views/app.blade.php) for any
// non-API, non-asset path, and let React Router handle the rest.
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*')->name('spa');
