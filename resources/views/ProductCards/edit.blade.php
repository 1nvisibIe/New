<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

<form action="{{route("ProductCards.update",["ProductCard"=>$id])}}" method="post">
    @csrf
    @method('PUT')
    <input type="text" name="title">
    <button type="submit">Подтвердить данные формы</button>
</form>
</body>
</html>
