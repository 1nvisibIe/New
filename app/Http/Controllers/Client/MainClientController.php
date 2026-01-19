<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\CardView;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MainClientController extends Controller
{
    public function index()
    {
        $cards = Card::with('product')->orderBy('id','desc')->paginate(8);

        return view('client.index', compact('cards'));
    }

    public function show($slug){

        $product = Product::where('slug', $slug)->firstOrFail();
        $card = $product->card;

        if (Auth::check()) {
            CardView::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'card_id' => $card->id,
                ],
                [
                    'viewed_at' => now(),
                ]
            );
        }

        return view('client.show',compact('card'));
    }

    public function catalog()
    {
        $cards = Card::with('product')->orderBy('id','asc')->get();

        return view('client.catalog',compact('cards'));
    }
}
