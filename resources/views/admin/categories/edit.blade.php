@extends('admin.layouts.layout')
@section('title')
    Редактирование категории
@endsection
@section('h1')
    Редактирование категории
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
                <h3 class="card-title">Категория  {{$category->name}}</h3>

            </div>
            <form role="form" action="{{route('categories.update',['category' => $category->id])}}" method="post">
                @csrf
                @method('PUT')
                <div class="card-body">

                    <div class="form-group">
                        <label for="name">Название</label>
                        <input type="text" name="name" class="form-control mb-3 @error('name')is-invalid  @enderror"  id="name" value={{$category->name}}>

                        <label for="parent">Родительская категория</label>
                        <select class=" form-control" name="parent" id="parent">

                            @foreach($categories as $cat)
                                @if($category->id!=$cat->id)
                                    <option value="{{$cat->id}}" {{ $category->parent_id == $cat->id ? 'selected' : '' }}>
                                        {{$cat->name}}</option>

                                @endif
                            @endforeach
                                <option value=""{{ Empty($category->parent_id) ? 'selected' : '' }}>Нет</option>

                        </select>
                    </div>


                </div>

                <div class="card-footer">
                    <button type="submit" class="btn btn-primary">Обновить категорию</button>
                </div>
            </form>
            <!-- /.card-footer-->
        </div>
        <!-- /.card -->

    </section>
    <!-- /.content -->

@endsection
