<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::with('parent')->orderBy('id','desc')->paginate(3);

        return view('admin.categories.index', compact('categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();

        return view('admin.categories.create', compact('categories'));

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['name'=>'required']);

        Category::create([
            'name'=>$request->name,
            'slug' => Str::slug($request->name,'-')

        ]);
        $request->session()->flash('success','Категория добавлена');
        return redirect()->route('categories.index');
    }



    public function edit(string $id)
    {
       $categories = Category::all();
       $category = Category::find($id);
       return view('admin.categories.edit', compact('category','categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate(['name'=>'required']);
        $category = Category::find($id);
        $category->update([
            'name'=>$request->name,
            'slug' => Str::slug($request->name,'-'),
            'parent_id'=>$request->parent
        ]);
        return redirect()->route('categories.index')->with('success','Изменения сохранены');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::find($id);
        $nazvanie = $category->name;
        $category->delete();
        return redirect()->route('categories.index')->with('success','Категория '. "$nazvanie" .' удалена');
    }
}
