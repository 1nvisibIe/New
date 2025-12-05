<?php

use App\Http\Controllers\Admin\MainController;
use App\Http\Controllers\MyFirstController;
use App\Http\Controllers\ProductCardsController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('HomePage');

Route::get('/home', [MyFirstController::class, 'index']);

Route::match(['GET', 'POST'], '/contact', function () {
    if (!empty($_POST)) {
        dump($_GET);
        dump($_POST);
    }
    return view('contact');
});
//
//Route::get('/contact', function (){
//    return view('contact');
//});
//
//Route::post('/send-email', function (){
//    dump($_POST);
//    return "Send email";
//});
//Route::redirect('/contact', '/HomePage',301);

Route::fallback(function () {
    return redirect()->route('HomePage');
});

Route::resource('ProductCards', ProductCardsController::class);

Route::get('/admin',[MainController::class,'index2']);
