@extends('admin.layouts.layout')
@section('title')
    Новая карточка
@endsection
@section('h1')
    Новыая карточка
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
                    <h3 class="card-title">Создание карточки</h3>

                </div>
                <form role="form" action="{{route('cards.store')}}" enctype="multipart/form-data" method="post">
                    @csrf
                    <div class="card-body">

                        <div class="form-group">

                            <label for="name">Наименование</label>
                            <input type="text" name="name" class="form-control @error('name')is-invalid  @enderror"  id="name" placeholder="Наименование">
                            <label for="product">Товар</label>
                            <select class=" form-control" name="product" id="product" {{ $products->isNotEmpty() ? '' : 'disabled' }}>

                                @if($products->isNotEmpty())
                                    <option value="">— Выберите товар —</option>
                                    @foreach($products as $product)

                                            <option value="{{$product->id}}">{{$product->name}}</option>

                                    @endforeach
                                @else
                                        <option value="" selected>Все товары уже имеют карточку (сначала добавьте новый товар)</option>
                                @endif
                            </select>
                            <label for="price">Цена</label>
                            <input type="text" name="price" class="form-control @error('price')is-invalid  @enderror"  id="price" placeholder="Цена">
                            <label for="old_price">Старая цена</label>
                            <input type="text" name="old_price" class="form-control @error('old_price')is-invalid  @enderror"  id="old_price" placeholder="Старая цена">

                            <label for="is_active">Актуальность</label><br>
                            <div class="px-3 mx-3">
                                <input class="form-check-input" type="checkbox" name="is_active" value="1" id="is_active" ><br>
                            </div>
                            <label for="mainImage">Изображение</label>
                            <div class="input-group mb-3">
                                <div class="input-group">
                                    <div class="custom-file">
                                        <input type="file" class="custom-file-input" id="mainImage" name="mainImage">
                                        <label class="custom-file-label" for="mainImage">Изображение</label>
                                    </div>

                                </div>
                            </div>
                            <label for="description">Описание</label>
                            <input type="text" name="description" class="form-control @error('description')is-invalid  @enderror"  id="description" placeholder="Описание">
                        </div>


                    </div>

                <div class="card-footer">
                    <button type="submit" class="btn btn-primary">Сохранить</button>
                </div>
                </form>
                <!-- /.card-footer-->
            </div>
            <!-- /.card -->

        </section>
        <!-- /.content -->

@endsection
