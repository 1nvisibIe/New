<?php

use App\Http\Controllers\MyFirstController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/home', [MyFirstController::class, 'index']);

Route::get('/home/gg', [MyFirstController::class, 'index']);

Route::get('/home/gg/g', [MyFirstController::class, 'index']);

Route::get('/home/gg/g/g', [MyFirstController::class, 'index']);
