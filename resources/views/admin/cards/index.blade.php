@extends('admin.layouts.layout')
@section('title')
    Карточки
@endsection
@section('h1')
    Карточки
@endsection
@section('content')

    <!-- Content Wrapper. Contains page content -->

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1>@yield('h1')</h1>
                    </div>
                    <div class="col-sm-6">
                        <ol class="breadcrumb float-sm-right">
                            <li class="breadcrumb-item"><a href="{{route('admin')}}">Главная</a></li>
                            <li class="breadcrumb-item active">@yield('h1')</li>
                        </ol>
                    </div>
                </div>
            </div><!-- /.container-fluid -->
        </section>

        <!-- Main content -->
        <section class="content">

            <!-- Default box -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Список Карточек</h3>

                </div>
                <div class="card-body ">
                    <a href="{{route('cards.create')}}" class="btn btn-primary mb-3">
                        Добавить карточку
                    </a>
                    @if(!empty($cards))
                        <div class="table-responsive ">
                            <table class="table table-bordered table-hover  " style="table-layout: fixed;">
                                <thead class="text-nowrap">
                                <tr>
                                    <th class="text-center" style="width: 35px">#</th>
                                    <th class="text-center" style="width: 200px">Наименование карточки</th>
                                    <th class="text-center" style="width: 180px">Наименование товара</th>
                                    <th class="text-center" style="width: 110px">Цена</th>
                                    <th class="text-center" style="width: 110px">Старая цена</th>
                                    <th class="text-center" style="width: 85px">Наличие</th>
                                    <th class="text-center" style="width: 120px">Актуальность</th>
                                    <th class="text-center">Изображение</th>
                                    <th class="text-center">Описание</th>
                                    <th class="text-center" style="width: 95px">Actions</th>

                                </tr>
                                </thead>
                                <tbody>
                                @foreach($cards as $card)

                                <tr>

                                    <td class="text-center text-nowrap">{{$card->id}}</td>
                                    <td class="text-center">{{$card->name}}</td>
                                    <td class="text-center"> {{$card->product->name}}</td>
                                    <td class="text-center">{{$card->price}}</td>
                                    <td class="text-center">{{$card->old_price}}</td>
                                    <td class="text-center">{{$card->product->stock}}</td>
                                    <td class="text-center">
                                        <i class="{{ $card->is_active ? 'fas fa-check text-success' : 'fas fa-times-circle text-danger' }} fa-lg"></i>
                                    </td>
                                    <td class="text-center">{{Str::limit($card->product->mainImage?->path ?? ($card->product->mainImage ? 'Не найдена' : 'Нет главного изображения'),32,'...')}}
                                        <div class="mt-1 d-flex justify-content-center">
                                            <img src="{{$card->product->getimage()}}" style="width: 75px; height: 50px; object-fit: cover; border-radius:5px" >
                                        </div>
                                    </td>
                                    <td>{{$card->description}}</td>
                                    <td><a href="{{route('cards.edit',['card' => $card->id])}}" class="btn btn-info btn-sm float-left mr-1">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                    <form action="{{route('cards.destroy',['card' => $card->id])}}" method="post" class="float-left">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-danger btn-sm"
                                                onclick="return confirm('Подтвердите удаление')">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </form>
                                    </td>
                                </tr>

                                @endforeach

                                </tbody>
                            </table>
                        </div>
                            @else
                                <p>Карточек пока нет...</p>
                            @endif

                        </div>

                        <!-- /.card-body -->
                <div class="card-footer">
                    {{ $cards->links('pagination::bootstrap-4') }}

                </div>



                        <!-- /.card-footer-->
                </div>
                <!-- /.card -->

        </section>
        <!-- /.content -->

    <!-- /.content-wrapper -->

@endsection
