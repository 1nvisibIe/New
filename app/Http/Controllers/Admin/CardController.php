<?php

namespace App\Http\Controllers\Admin;

use App\Models\Card;
use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cards = Card::with('product.mainImage')->orderBy('id','desc')->paginate(3);

        return Inertia::render('Admin/Cards/Index/Index', compact('cards'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::whereDoesntHave('card')->get();

        return Inertia::render('Admin/Cards/Create/Create', compact( 'products'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['name'=>'required','price'=>'required'
            ,'product'=>'required']);

        Card::create([
            'name'=>$request->name,
            'product_id'=>$request->product,
            'price'=>$request->price,
            'old_price'=>$request->old_price,

            'is_active'=>$request->boolean('is_active'),
            'description'=>$request->description

        ]);
        $product = Product::find($request->product);
        $folder = date('Y-m-d');
        if ($request->hasFile('mainImage')) {
            $path = $request->file('mainImage')->store("images/{$folder}", 'public');


            $product->mainImage()->updateOrCreate(
                ['product_id' => $product->id], [
                    'path' => $path,
                    'is_main'=>1
                ]
            );
        }



        $request->session()->flash('success','Карточка добавлена');
        return redirect()->route('cards.index');
    }



    public function edit(string $id)
    {
        $cards = Card::find($id);
        $product = $cards->product;
        return Inertia::render('Admin/Cards/Edit/Edit', compact('cards','product'));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate(['name'=>'required','price'=>'required','stock'=>'required']);
        $cards = Card::find($id);
        $product = $cards->product;
        $cards->update([
            'name'=>$request->name,
            'is_active'=>$request->boolean('is_active'),
            'price'=>$request->price,
            'old_price'=>$request->old_price,
            'description'=>$request->description


        ]);
        $product->update([

            'stock'=>$request->stock

        ]);


        $folder = date('Y-m-d');
        if ($request->hasFile('mainImage')) {
            $path = $request->file('mainImage')->store("images/{$folder}", 'public');

            $mainImage = $product->mainImage;  // ← объект или null

            if ($mainImage && $mainImage->path) {
                Storage::disk('public')->delete($mainImage->path);
            }


            $product->mainImage()->updateOrCreate(
                ['product_id' => $product->id], [
                    'path' => $path,
                    'is_main'=>1
                ]
            );
        }

        return redirect()->route('cards.index')->with('success','Изменения сохранены');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $cards = Card::find($id);
        $nazvanie = $cards->name;
        $cards->delete();
        return redirect()->route('cards.index')->with('success','Карточка '. "$nazvanie" .' удалена');
    }
}
