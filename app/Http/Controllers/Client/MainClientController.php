<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MainClientController extends Controller
{
    public function index()
    {
        $cards = Card::orderBy('id','desc')->paginate(8);

        return view('client/index', compact('cards'));
    }

    public function show($slug){

        $product = Product::where('slug', $slug)->firstOrFail();
        $card = $product->card;

        return view('client.show',compact('card'));
    }

    public function catalog()
    {
        $cards = Card::with('product.mainImage')->where('is_active', true)->orderBy('id','desc')->paginate(8);

        return Inertia::render('Client/Index',compact('cards'));
    }
}
