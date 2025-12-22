@extends('admin.layouts.layout')
@section('title')
    Новый товар
@endsection
@section('h1')
    Новый товар
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
                    <h3 class="card-title">Создание товара</h3>

                </div>
                <form role="form" action="{{route('products.store')}}" method="post">
                    @csrf
                    <div class="card-body">

                        <div class="form-group">
                            <label for="sku">SKU</label>
                            <input type="text" name="sku" class="form-control @error('sku')is-invalid  @enderror"  id="sku" placeholder="sku">
                            <label for="name">Наименование</label>
                            <input type="text" name="name" class="form-control @error('name')is-invalid  @enderror"  id="name" placeholder="Наименование">
                            <label for="stock">Наличие</label>
                            <input type="text" name="stock" class="form-control @error('stock')is-invalid  @enderror"  id="stock" placeholder="Наличие">
                            <label for="category">Категория</label>
                            <select class=" form-control" name="category" id="category" >
                                <option value="">— Выберите категорию —</option>
                                @foreach($categories as $cat)

                                    <option value="{{$cat->id}}" >{{$cat->name}}</option>

                                @endforeach
                                <option value="">Нет</option>
                            </select>

                            <label for="price">Себестоимость</label>
                            <input type="text" name="price" class="form-control @error('price')is-invalid  @enderror"  id="price" placeholder="Себестоимость">

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
