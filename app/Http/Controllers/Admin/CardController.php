<?php

namespace App\Http\Controllers\Admin;

use App\Models\Attribute;
use App\Models\Card;
use App\Models\Category;
use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cards = Card::with('product')->orderBy('id','desc')->paginate(3);

        return Inertia::render('Admin/Cards/Index/Index', compact('cards'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::whereDoesntHave('card')->get();

        return Inertia::render('Admin/Cards/Create/Create', compact( 'products'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['name'=>'required','price'=>'required'
            ,'product'=>'required']);

        Card::create([
            'name'=>$request->name,
            'product_id'=>$request->product,
            'price'=>$request->price,
            'old_price'=>$request->old_price,

            'is_active'=>$request->boolean('is_active'),
            'description'=>$request->description

        ]);
        $product = Product::find($request->product);
        $folder = date('Y-m-d');
        if ($request->hasFile('mainImage')) {
            $path = $request->file('mainImage')->store("images/{$folder}", 'public');


            $product->mainImage()->updateOrCreate(
                ['product_id' => $product->id], [
                    'path' => $path,
                    'is_main'=>1
                ]
            );
        }



        $request->session()->flash('success','Карточка добавлена');
        return redirect()->route('cards.index');
    }

    private function getMediaType(string $path): string
    {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $videoExts = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
        return in_array($ext, $videoExts) ? 'video' : 'image';
    }

    public function edit(string $id)
    {
        $cards   = Card::find($id);
        $product = $cards->product;

        // Загружаем атрибуты категории товара
        $categoryAttributes = [];
        if ($product->category_id) {
            $category = Category::with('attributes')->find($product->category_id);
            $categoryAttributes = $category->attributes->map(fn($attr) => [
                'attribute_id'  => $attr->id,
                'name'          => $attr->name,
                'from_category' => true,
            ])->toArray();
        }

        // Загружаем уже сохранённые атрибуты товара
        $product->load('attributes');
        $savedAttributes = $product->attributes->map(fn($attr) => [
            'attribute_id'  => $attr->id,
            'name'          => $attr->name,
            'value'         => $attr->pivot->value ?? '',
            'sort_order'    => $attr->pivot->sort_order,
            'from_category' => false, // уточним ниже
        ])->toArray();

        // Объединяем: атрибуты категории + специфические товара
        // Если атрибут из категории уже сохранён — берём его значение
        $categoryAttributeIds = array_column($categoryAttributes, 'attribute_id');

        // Находим сохранённые значения для атрибутов категории
        $mergedAttributes = array_map(function($catAttr) use ($savedAttributes) {
            $saved = array_filter($savedAttributes, fn($s) => $s['attribute_id'] === $catAttr['attribute_id']);
            $saved = array_values($saved);
            return [
                'attribute_id'  => $catAttr['attribute_id'],
                'name'          => $catAttr['name'],
                'value'         => $saved[0]['value'] ?? '',
                'from_category' => true,
            ];
        }, $categoryAttributes);

        // Специфические атрибуты — те что не из категории
        $specificAttributes = array_filter($savedAttributes, fn($s) =>
        !in_array($s['attribute_id'], $categoryAttributeIds)
        );
        $specificAttributes = array_map(fn($s) => [
            ...$s,
            'from_category' => false,
        ], array_values($specificAttributes));

        // Итоговый список
        $attributes = array_merge($mergedAttributes, $specificAttributes);

        return Inertia::render('Admin/Cards/Edit/Edit', [
            'cards'      => $cards,
            'product'    => $product,
            'attributes' => $attributes, // ← передаём на фронт
            'productImg' => [
                'id'     => $product->id,
                'images' => $product->images()
                    ->orderBy('sort_order')
                    ->get()
                    ->map(fn($img) => [
                        'id'         => $img->id,
                        'url'        => asset("uploads/{$img->path}"),
                        'is_main'    => $img->is_main,
                        'sort_order' => $img->sort_order,
                        'type'       => $this->getMediaType($img->path),
                    ])
                    ->values(),
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name'=>'required',
            'price'=>'required',
            'stock'=>'required',
            'attributes'=>'array',
            'attributes.*.name'=>'required_with:attributes.*.value|string|max:100',
            'attributes.*.value'=>'nullable|string|max:255',
        ]);

        $cards = Card::find($id);
        $product = $cards->product;

        $attributesData = $request->input('attributes', []);

        $cards->update([
            'name'=>$request->name,
            'is_active'=>$request->boolean('is_active'),
            'price'=>$request->price,
            'old_price'=>$request->old_price,
            'description'=>$request->description

        ]);
        $product->update([

            'stock'=>$request->stock

        ]);

        //работа с главным изображением
        $folder = date('Y-m-d');
        if ($request->hasFile('mainImage')) {
            $path = $request->file('mainImage')->store("images/{$folder}", 'public');

            $mainImage = $product->mainImage;  // ← объект или null

            if ($mainImage && $mainImage->path) {
                Storage::disk('public')->delete($mainImage->path);
            }


            $product->mainImage()->updateOrCreate(
                ['product_id' => $product->id], [
                    'path' => $path,
                    'is_main'=>1
                ]
            );
        }

        // Синхронизируем атрибуты товара
        if (count($attributesData) > 0) {
            $syncData = [];

            foreach ($attributesData as $index => $attr) {
                if (!empty($attr['attribute_id'])) {
                    // Существующий атрибут — просто обновляем значение
                    $syncData[$attr['attribute_id']] = [
                        'value'      => $attr['value'] ?? '',
                        'sort_order' => $index + 1,
                    ];
                } else {
                    // Новый специфический атрибут — создаём
                    $attribute = Attribute::firstOrCreate(
                        ['name' => $attr['name']],
                        ['slug' => Str::slug($attr['name'], '-')]
                    );
                    $syncData[$attribute->id] = [
                        'value'      => $attr['value'] ?? '',
                        'sort_order' => $index + 1,
                    ];
                }
            }

            // sync() — синхронизирует pivot таблицу
            // удаляет лишние, добавляет новые, обновляет существующие
            $product->attributes()->sync($syncData);

        } else {
            // Нет атрибутов — очищаем
            $product->attributes()->detach();
        }

        return redirect()->route('cards.index')->with('success','Изменения сохранены');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $cards = Card::find($id);
        $nazvanie = $cards->name;
        $cards->delete();
        return redirect()->route('cards.index')->with('success','Карточка '. "$nazvanie" .' удалена');
    }






    // Загрузка нескольких изображений
    public function uploadImages(Request $request, string $id)
    {
        $request->validate([
            // * означает каждый файл в массиве
            'images.*' => 'file|mimes:jpeg,png,jpg,gif,mp4,mov|max:51200',
            // max: 51200 = 50MB в килобайтах
        ]);

        $product = Product::find($id);
        $folder = date('Y-m-d');

        // Получаем максимальный sort_order чтобы новые шли после существующих
        $maxOrder = $product->images()->max('sort_order') ?? 0;

        $uploaded = [];

        // $request->file('images') возвращает массив файлов
        foreach ($request->file('images') as $index => $file) {
            $path = $file->store("images/{$folder}", 'public');

            $image = $product->images()->create([
                'path'       => $path,
                'sort_order' => $maxOrder + $index + 1,
                'is_main'    => $product->images()->count() === 0 && $index === 0,
                // первое фото становится главным если изображений ещё не было
            ]);

            // Возвращаем данные загруженного файла для обновления UI
            $uploaded[] = [
                'id'         => $image->id,
                'path'       => $image->path,
                'url'        => asset("uploads/{$image->path}"),
                'is_main'    => $image->is_main,
                'sort_order' => $image->sort_order,
                'type'       => $this->getMediaType($image->path),
            ];
        }

        return response()->json($uploaded);
    }

// Удаление одного изображения
    public function deleteImage(string $imageId)
    {
        $image = ProductImage::find($imageId);

        // Удаляем файл с диска
        Storage::disk('public')->delete($image->path);

        $wasMain = $image->is_main;
        $productId = $image->product_id;

        $image->delete();

        // Если удалили главное фото — назначаем главным следующее
        if ($wasMain) {
            $next = ProductImage::where('product_id', $productId)
                ->orderBy('sort_order')
                ->first();

            if ($next) {
                $next->update(['is_main' => true]);
            }
        }

        return response()->json(['success' => true]);
    }

// Обновление порядка и главного фото
    public function updateImageOrder(Request $request, string $id)
    {
        // $request->images = [
        //     { id: 1, sort_order: 1, is_main: true },
        //     { id: 2, sort_order: 2, is_main: false },
        // ]
        foreach ($request->images as $item) {
            ProductImage::where('id', $item['id'])->update([
                'sort_order' => $item['sort_order'],
                'is_main'    => $item['is_main'],
            ]);
        }

        return response()->json(['success' => true]);
    }




}




