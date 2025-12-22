<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::orderBy('id')->paginate(3);

        return view('admin.products.index', compact('products'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        return view('admin.products.create', compact('categories'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['sku'=>'required','name'=>'required','price'=>'required'
            ,'stock'=>'required']);

        Product::create([
            'sku'=>$request->sku,
            'slug' => Str::slug($request->name,'-'),
            'name'=>$request->name,
            'price'=>$request->price,
            'stock'=>$request->stock,
            'category_id'=>$request->category



        ]);
        $request->session()->flash('success','Товар добавлен');
        return redirect()->route('products.index');
    }



    public function edit(string $id)
    {
        $products = Product::find($id);
        $categories = Category::all();
        return view('admin.products.edit', compact('products','categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate(['sku'=>'required','name'=>'required','price'=>'required'
            ,'stock'=>'required']);
        $products = Product::find($id);
        $products->update([
            'sku'=>$request->sku,
            'name'=>$request->name,
            'price'=>$request->price,
            'stock'=>$request->stock,
            'category_id'=>$request->category,
            'slug' => Str::slug($request->name,'-')
        ]);
        return redirect()->route('products.index')->with('success','Изменения сохранены');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $products = Product::find($id);
        $nazvanie = $products->name;
        $products->delete();
        return redirect()->route('products.index')->with('success','Товар '. "$nazvanie" .' удален');
    }
}
