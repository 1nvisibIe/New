@extends('admin.layouts.layout')
@section('title')
    Редактирование карточки
@endsection
@section('h1')
    Редактирование карточки
@endsection
@section('content')

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
                <h3 class="card-title">Карточка  {{$cards->name}}</h3>

            </div>
            <form role="form" action="{{route('cards.update',['card' => $cards->id])}}" enctype="multipart/form-data" method="post">
                @csrf
                @method('PUT')
                <div class="card-body">

                    <div class="form-group">

                        <label for="name">Наименование карточки</label>
                        <input type="text" name="name" class="form-control @error('name')is-invalid  @enderror"  id="name" value="{{$cards->name}}">
                        <label for="price">Цена</label>
                        <input type="text" name="price" class="form-control @error('price')is-invalid  @enderror"  id="price" value="{{$cards->price}}">
                        <label for="old_price">Старая цена </label>
                        <input type="text" name="old_price" class="form-control @error('old_price')is-invalid  @enderror"  id="old_price" value="{{$cards->old_price}}">
                        <label for="stock">Наличие</label>
                        <input type="text" name="stock" class="form-control @error('stock')is-invalid  @enderror"  id="stock" value="{{$product->stock}}">

                            <label for="is_active">Актуальность</label><br>
                            <div class="px-3 mx-3">
                                <input class="form-check-input" type="checkbox" name="is_active" value="1"
                                   id="is_active" {{ $cards->is_active ? 'checked' : '' }}><br>
                            </div>

                        <label for="mainImage">Изображение</label>
                        <div class="input-group mb-3">
                            <div class="input-group">
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="mainImage" name="mainImage">
                                    <label class="custom-file-label" for="mainImage">Изображение</label>
                                </div>
                            </div>
                            <div class="mt-3 ">
                                <img src="{{$product->getimage()}}" style="width: 200px; height: 200px; object-fit: cover; border-radius:15px" >
                            </div>
                        </div>
                        <label for="description">Описание</label>
                        <input type="text" name="description" class="form-control @error('description')is-invalid  @enderror"  id="description" value="{{$cards->description}}">
                    </div>
                </div>

                <div class="card-footer">
                    <button type="submit" class="btn btn-primary">Обновить карточку</button>
                </div>
            </form>
            <!-- /.card-footer-->
        </div>
        <!-- /.card -->

    </section>
    <!-- /.content -->

@endsection
