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

        $product = Product::where('slug', $slug)->with(['images' => function ($q) {
            $q->orderBy('sort_order');
        }])->firstOrFail();
        $card = $product->card;
        $card->setRelation('product', $product);

        return Inertia::render('Client/ShowCard/ShowCard',compact('card'));
    }

    public function catalog()
    {
        $cards = Card::with('product')->where('is_active', true)->orderBy('id','desc')->paginate(8);

        return Inertia::render('Client/Index/Index',compact('cards'));
    }
}
