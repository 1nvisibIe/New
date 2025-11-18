<?php

use App\Http\Controllers\MyFirstController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/home', [MyFirstController::class, 'index']);

