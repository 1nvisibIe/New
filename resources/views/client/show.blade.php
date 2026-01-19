@extends('client.layouts.layout')
@section('h1')
    {{$card->name}}
@endsection

@section('content')

    <div class="container ">
        <div class="shrifthleba">
            <ol class="breadcrumb float-sm-left">
                <li class="breadcrumb-item "><a href="{{route('Home')}}" class="hleb">Главная</a></li>
                <li class="breadcrumb-item "><a href="{{route('Catalog')}}" class="hleb">Каталог</a></li>
                <li class="breadcrumb-item  hleb2 active">@yield('h1')</li>
            </ol>
        </div>

    </div>

    <div class="container ">
        <div class="row ">
            <div class="col-12 col-md-5 pe-0 ps-3 pb-3 paddiv d-flex justify-content-start align-items-center">
                <img src="{{$card->product->getimage()}}" class="img-fluid rounded-4 razmerikompvkataloge" alt="">
            </div>
            <div class="col-12 col-md-7 d-flex flex-column justify-content-between  px-2">
                <div>
                    <h1 class="shrift">@yield('h1')</h1>

                    <div class="mt-3">
                        <p>{{$card->description}}</p>

                    </div>
                </div>
                <div class="d-flex container align-items-center gap-1">
                    <div>

{{--                        @if(!empty($card->old_price))--}}

{{--                            <p class="mx-2 mb-0 pb-0 bezskidki">{{$card->old_price}} ₽</p>--}}
{{--                            <p class="mx-2 mb-2 mt-0 pt-0 soskidkoy "> {{$card->price}} ₽</p>--}}

{{--                        @else--}}
{{--                            <div class="d-flex flex-column align-items-start">--}}

{{--                                <p class="mx-2 mb-2 mt-0 pt-0 soskidkoy "> {{$card->price}} ₽</p>--}}
{{--                            </div>--}}
{{--                        @endif--}}
                    </div>
                    <div>
                        <!-- Внутри карточки, после описания -->
                        @if(Auth::check())
                            <div class="mt-4">
                                <label for="rating" class="form-label fw-bold">Ваша оценка</label>
                                <form action="{{ route('cards.rate',$card->product->slug) }}" method="POST" class="d-flex align-items-center">
                                    @csrf

                                    @php
                                        // Получаем текущую оценку пользователя для этой карточки
                                        $currentRating = \App\Models\CardView::where('user_id', \Illuminate\Support\Facades\Auth::id())
                                            ->where('card_id', $card->id)
                                            ->value('rating');
                                    @endphp

                                    <select
                                        name="rating"
                                        id="rating"
                                        class="form-select w-75"
                                    onchange="this.form.submit()"
                                    >
                                    <!-- Сначала вариант "Нет оценки", если оценки нет — он будет выбран -->
                                    <option value="" {{ is_null($currentRating) ? 'selected' : '' }}>
                                        Нет оценки
                                    </option>

                                    <!-- Затем варианты 1–10 -->
                                    @for($i = 1; $i <= 10; $i++)
                                        <option value="{{ $i }}" {{ $currentRating == $i ? 'selected' : '' }}>
                                            {{ $i }} ★{{ str_repeat('★', $i - 1) }}
                                        </option>
                                        @endfor
                                        </select>

                                        <!-- Если оценка уже есть — показываем текст -->
                                        @if($currentRating)
                                            <span class="ms-3 text-muted">
                    (Ваша текущая оценка: <strong>{{ $currentRating }} ★</strong>)
                </span>
                                        @endif
                                </form>
                            </div>
                        @endif


                    </div>
                </div>
            </div>
        </div>
    </div>

    <br><br><br><br><br><br><br>


@endsection
