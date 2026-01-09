<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Card;
use Illuminate\Http\Request;

class SearchController extends Controller
{
public function index(Request $request){
    $request->validate([
        's' => 'required',
    ]);
    $s= $request->s;
    $cards=Card::where('name','like',"%{$s}%")->with('product')->get();
    return view('client.search',compact('cards','s'));
}
}
