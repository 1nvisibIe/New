<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use function Termwind\render;

class MainController extends Controller
{
    public function index2()
    {
        return Inertia::render('Admin/Main/Main');
    }
}
