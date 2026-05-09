@extends('admin.layouts.layout')
@section('title')
    Товары
@endsection
@section('h1')
    Товары
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
                    <h3 class="card-title">Список Товаров</h3>

                </div>
                <div class="card-body">
                    <a href="{{route('products.create')}}" class="btn btn-primary mb-3">
                        Добавить товар
                    </a>
                    @if(!empty($products))
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover text-nowrap">
                                <thead>
                                <tr>
                                    <th style="width: 30px">#</th>
                                    <th>SKU</th>
                                    <th>Наименование</th>
                                    <th>Slug</th>
                                    <th>Категория</th>
                                    <th>Наличие</th>
                                    <th>Себестоимость</th>
                                    <th>Actions</th>

                                </tr>
                                </thead>
                                <tbody>
                                @foreach($products as $product)

                                <tr>
                                    <td>{{$product->id}}</td>
                                    <td>{{$product->sku}}</td>
                                    <td>{{$product->name}}</td>
                                    <td>{{$product->slug}}</td>
                                    <td>{{ $product->category?->name ?? ($product->category ? 'Не найдена' : 'Нет категории') }}</td>
                                    <td>{{$product->stock}}</td>
                                    <td>{{$product->price}}</td>

                                    <td><a href="{{route('products.edit',['product' => $product->id])}}" class="btn btn-info btn-sm float-left mr-1">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                    <form action="{{route('products.destroy',['product' => $product->id])}}" method="post" class="float-left">
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
                                <p>Товаров пока нет...</p>
                            @endif

                        </div>

                        <!-- /.card-body -->
                <div class="card-footer">
                    {{ $products->links('pagination::bootstrap-4') }}

                </div>



                        <!-- /.card-footer-->
                </div>
                <!-- /.card -->

        </section>
        <!-- /.content -->

    <!-- /.content-wrapper -->

@endsection
