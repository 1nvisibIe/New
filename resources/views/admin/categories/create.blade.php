@extends('admin.layouts.layout')
@section('title')
    Новая Категория
@endsection
@section('h1')
    Новая Категория
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
                    <h3 class="card-title">Создание категорий</h3>

                </div>
                <form role="form" action="{{route('categories.store')}}" method="post">
                    @csrf
                    <div class="card-body">

                        <div class="form-group">
                            <label for="name">Название</label>
                            <input type="text" name="name" class="form-control @error('name')is-invalid  @enderror"  id="name" placeholder="Название">
                        </div>

                        <label for="parent">Родительская категория</label>
                        <select class=" form-control" name="parent" id="parent">
                            <option value="">— Выберите категорию —</option>
                            @foreach($categories as $cat)

                                <option value="{{$cat->id}}" >{{$cat->name}}</option>

                            @endforeach
                            <option value="">Нет</option>

                        </select>
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
