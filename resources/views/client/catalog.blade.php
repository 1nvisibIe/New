@extends('client.layouts.layout')
@section('title')
    Каталог
@endsection
@section('h1')
    Каталог
@endsection
@section('content')
    <br>
    <div class="container ">
        <section class="content-header">


                    <div class="col-sm-6">
                        <h1>@yield('h1')</h1>
                    </div>


           <!-- /.container-fluid -->
        </section>

        <div class=" d-flex justify-content-center align-items-center">

        </div>

        <div>
            <div class="row pt-3 px-2 tex">
                @foreach($cards as $card)
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 p-2 padmin ">
                        <a href="{{route('Catalog.single',['slug'=>$card->product->slug])}}">
                            <div class="card h-100">
                                <div class="p-2">
                                    <img src="{{$card->product->getimage()}}" class="card-img-top photo-fixed" alt="">
                                </div>
                                <div class="card-body d-flex flex-column h-100">

                                    <div class="flex-grow-1">
                                        <p class="card-title">{{$card->name}}</p>
                                    </div>
{{--                                    @if(!empty($card->old_price))--}}
{{--                                        <div class="d-flex flex-column align-items-start">--}}

{{--                                            <p class="card-body p-0 m-0 bezskidkiCartochka">{{$card->old_price}} ₽</p>--}}
{{--                                            <p class=" card-body p-0 m-0 soskidkoyCartochka "> {{$card->price}} ₽</p>--}}
{{--                                        </div>--}}
{{--                                    @else--}}
{{--                                        <div class="d-flex flex-column align-items-start">--}}

{{--                                            <p class=" card-body p-0 m-0 soskidkoyCartochka "> {{$card->price}} ₽</p>--}}
{{--                                        </div>--}}
{{--                                    @endif--}}
                                </div>
                            </div>
                        </a>
                    </div>
                @endforeach

            </div>
        </div>


    </div>
    <br><br>
@endsection
