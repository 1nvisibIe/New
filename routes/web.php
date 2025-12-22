<?php

use App\Http\Controllers\Admin\MainController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CardController;

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;

Route::get('/', function () {
    return view('welcome');}
)->name('Home');


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


Route::group(['prefix'=>'admin'],function(){
    Route::get('/',[MainController::class,'index2'])->name('admin');

    Route::resource('/categories',CategoryController::class);
    Route::resource('/products',ProductController::class);
    Route::resource('/cards',CardController::class);
});

Route::get('/register',[UserController::class,'create'])->name('register.create');
Route::post('/register',[UserController::class,'store'])->name('register.store');

Route::get('/login',[UserController::class,'loginForm'])->name('login.create');
Route::post('/login',[UserController::class,'login'])->name('login');
Route::get('/logout',[UserController::class,'logout'])->name('logout');
