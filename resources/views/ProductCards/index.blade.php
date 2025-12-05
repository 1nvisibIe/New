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

<h1>Список товаров</h1>

<ul>
    <li>
        <a href="{{route('ProductCards.show',['ProductCard' => 1])}}">Товар 1</a>
        <a href="{{route('ProductCards.edit',['ProductCard' => 1])}}">Редактировать Товар 1</a>
    </li>

    <li>
        <a href="{{route('ProductCards.show',['ProductCard' => 2])}}">Товар 2</a>
        <a href="{{route('ProductCards.edit',['ProductCard' => 2])}}">Редактировать Товар 2</a>
    </li>

    <li>
        <a href="{{route('ProductCards.show',['ProductCard' => 3])}}">Товар 3</a>
        <a href="{{route('ProductCards.edit',['ProductCard' => 3])}}">Редактировать Товар 3</a>

    </li>

</ul>


</body>
</html>
