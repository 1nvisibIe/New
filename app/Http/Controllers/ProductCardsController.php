<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductCardsController extends Controller
{

    public function __construct(Request $request)
    {

    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {




        return Inertia::render('Test', ['message' => 'Это тест React в Laravel!']);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view("ProductCards.create");
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        dd($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return ("ProductCards $id");
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return view("ProductCards.edit",["id"=>$id]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        dump($id);
        dd($request);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


}
