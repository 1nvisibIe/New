@extends('client.layouts.layout')

@section('title')
    Рекомендации
@endsection

@section('h1')
    Рекомендации
@endsection

@section('content')
    <br>
    <div class="container">
        <section class="content-header">
            <div class="col-sm-6">
                <h1>
                    @if(Auth::check())
                        Рекомендации специально для тебя
                    @else
                        Самые популярные фильмы
                    @endif
                </h1>
            </div>
        </section>

        <div>
            @if($recommendations->isEmpty())
                <div class="alert alert-info text-center mt-4">
                    Пока нет рекомендаций. Посмотрите несколько фильмов!
                </div>
            @else
                <div class="row pt-3 px-2 tex">
                    @foreach($recommendations as $card)
                        <div class="col-12 col-sm-6 col-md-4 col-lg-3 p-2 padmin">
                            <a href="{{ route('Catalog.single', ['slug' => $card->product->slug]) }}">
                                <div class="card h-100">
                                    <div class="p-2">
                                        <img
                                            src="{{ $card->product->getimage() ?? asset('images/placeholder.jpg') }}"
                                            class="card-img-top photo-fixed"
                                            alt="{{ $card->name }}"
                                        >
                                    </div>
                                    <div class="card-body d-flex flex-column h-100">
                                        <div class="flex-grow-1">
                                            <p class="card-title">
                                                {{ $card->name }}
                                                @if($card->release_year)
                                                    ({{ $card->release_year }})
                                                @endif
                                            </p>
                                        </div>

{{--                                        @if(!empty($card->old_price))--}}
{{--                                            <div class="d-flex flex-column align-items-start">--}}
{{--                                                <p class="card-body p-0 m-0 bezskidkiCartochka">--}}
{{--                                                    {{ $card->old_price }} ₽--}}
{{--                                                </p>--}}
{{--                                                <p class="card-body p-0 m-0 soskidkoyCartochka">--}}
{{--                                                    {{ $card->price }} ₽--}}
{{--                                                </p>--}}
{{--                                            </div>--}}
{{--                                        @else--}}
{{--                                            <div class="d-flex flex-column align-items-start">--}}
{{--                                                <p class="card-body p-0 m-0 soskidkoyCartochka">--}}
{{--                                                    {{ $card->price }} ₽--}}
{{--                                                </p>--}}
{{--                                            </div>--}}
{{--                                        @endif--}}

                                        <!-- Объяснение — теперь просто свойство объекта -->
                                        @if($card->recommendation_explanation)
                                            <p class="text-muted small mt-2">
                                                {{ $card->recommendation_explanation }}
                                            </p>
                                        @endif
                                    </div>
                                </div>
                            </a>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </div>
    @if(Auth::check())
        <div class="mt-4 text-center">
            <form action="{{ route('recommendations.reset') }}" method="POST" onsubmit="return confirm('Вы уверены? История просмотров будет полностью удалена.');">
                @csrf
                <button type="submit" class="btn btn-danger">
                    Сбросить историю просмотров
                </button>
            </form>
        </div>
    @endif
    <br><br>
@endsection
