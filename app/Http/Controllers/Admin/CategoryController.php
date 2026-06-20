<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::with('parent')->orderBy('id','desc')->paginate(3);

        return Inertia::render('Admin/Categories/Index/Index', compact('categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();

        return Inertia::render('Admin/Categories/Create/Create', compact('categories'));

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'               => 'required',
            // Валидируем каждый элемент массива атрибутов
            'attributes'         => 'array',
            'attributes.*.name'  => 'required|string|max:100',
        ]);

        $category = Category::create([
            'name'=>$request->name,
            'slug' => Str::slug($request->name,'-'),
            'parent_id'=>$request->parent? : null
        ]);

        if ($request->filled('attributes')) {
            foreach ($request->attributes as $index => $attr) {
                // Находим или создаём атрибут по имени
                // firstOrCreate — ищет запись, если нет — создаёт
                // Это нужно чтобы не дублировать атрибуты с одинаковым именем
                $attribute = Attribute::firstOrCreate(
                    ['name' => $attr['name']],  // ищем по имени
                    [
                        'slug'       => Str::slug($attr['name'], '-'),
                        'sort_order' => $index + 1,
                    ]
                );

                // Привязываем атрибут к категории через pivot таблицу
                // attach() — добавляет запись в category_attribute
                // второй аргумент — данные для pivot таблицы
                $category->attributes()->attach($attribute->id, [
                    'sort_order' => $index + 1,
                ]);
            }
        }

        $request->session()->flash('success','Категория добавлена');
        return redirect()->route('categories.index');
    }



    public function edit(string $id)
    {
       $categories = Category::all();
       $category = Category::with('attributes')->find($id);
       return Inertia::render('Admin/Categories/Edit/Edit', compact('category','categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name'              => 'required',
            'attributes'        => 'array',
            'attributes.*.name' => 'required|string|max:100',
        ]);

        $category = Category::with('attributes')->find($id);

        // Сохраняем ДО update — после update $request->attributes недоступен
        $attributesData = $request->input('attributes', []);

        $category->update([
            'name'      => $request->name,
            'slug'      => Str::slug($request->name, '-'),
            'parent_id' => $request->parent ?: null,
        ]);

        if (count($attributesData) > 0) {
            $keepIds = [];

            foreach ($attributesData as $index => $attr) {
                if (!empty($attr['id'])) {
                    // Существующий атрибут — обновляем имя
                    $attribute = Attribute::find($attr['id']);
                    if ($attribute) {
                        $attribute->update([
                            'name' => $attr['name'],
                            'slug' => Str::slug($attr['name'], '-'),
                        ]);

                        // Обновляем sort_order в pivot таблице
                        $category->attributes()->updateExistingPivot($attribute->id, [
                            'sort_order' => $index + 1,
                        ]);

                        $keepIds[] = $attribute->id;
                    }
                } else {
                    // Новый атрибут — создаём и привязываем
                    $attribute = Attribute::firstOrCreate(
                        ['name' => $attr['name']],
                        ['slug' => Str::slug($attr['name'], '-')]
                    );

                    $category->attributes()->syncWithoutDetaching([
                        $attribute->id => ['sort_order' => $index + 1]
                    ]);

                    $keepIds[] = $attribute->id;
                }
            }

            // Отвязываем атрибуты которых нет в keepIds
            $currentIds = $category->attributes->pluck('id');
            $toDetach   = $currentIds->diff($keepIds)->values();

            if ($toDetach->isNotEmpty()) {
                foreach ($toDetach as $attributeId) {
                    // Отвязываем от текущей категории
                    $category->attributes()->detach($attributeId);

                    $attr = Attribute::find($attributeId);
                    if ($attr) {
                        // Проверяем используется ли атрибут где-то ещё
                        $usedInCategories = $attr->categories()->count();
                        $usedInProducts   = $attr->products()->count();

                        // Если нигде не используется — удаляем совсем
                        if ($usedInCategories === 0 && $usedInProducts === 0) {
                            $attr->delete();
                        }
                    }
                }
            }

        } else {
            // Все атрибуты удалены — получаем их перед отвязкой
            $allIds = $category->attributes->pluck('id');
            $category->attributes()->detach();

            // Проверяем каждый — не используется ли где-то ещё
            foreach ($allIds as $attributeId) {
                $attr = Attribute::find($attributeId);
                if ($attr) {
                    $usedInCategories = $attr->categories()->count();
                    $usedInProducts   = $attr->products()->count();

                    if ($usedInCategories === 0 && $usedInProducts === 0) {
                        $attr->delete();
                    }
                }
            }
        }

        return redirect()
            ->route('categories.index')
            ->with('success', 'Изменения сохранены');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::find($id);

        // Считаем зависимости
        $productsCount  = $category->products()->count();
        $childrenCount  = $category->children()->count();

        // Если есть зависимости — запрещаем удаление и объясняем почему
        if ($productsCount > 0 || $childrenCount > 0) {
            $messages = [];

            if ($productsCount > 0) {
                $messages[] = "привязано товаров: {$productsCount}";
            }
            if ($childrenCount > 0) {
                $messages[] = "подкатегорий: {$childrenCount}";
            }

            $warning = implode(', ', $messages);

            return redirect()
                ->route('categories.index')
                ->with('error', "Нельзя удалить категорию «{$category->name}» — {$warning}. Сначала удалите или перенесите их.");
        }

        // Зависимостей нет — удаляем
        $name = $category->name;
        $category->delete();


        return redirect()->route('categories.index')->with('success', "Категория «{$name}» удалена");
    }
}
