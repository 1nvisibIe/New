import Layout from '@/Pages/Admin/Layout/Layout.jsx'
import {Link, router} from '@inertiajs/react'
import {Plus, Pencil, Trash2} from 'lucide-react'
import './Index.css'

export default function Index({products}) {

    const handleDelete = (id) => {
        if (!confirm('Подтвердите удаление')) return
        router.delete(`/admin/products/${id}`)
    }

    return (
        <Layout title="Товары">
            <div className="table-wrap">

                {/* Шапка */}
                <div className="table-header">
                    <h2 className="table-title">Список товаров</h2>
                    <Link href="/admin/products/create" className="btn-add">
                        <Plus size={16}/>
                        Добавить товар
                    </Link>
                </div>

                {/* Таблица */}
                {products.data.length > 0 ? (
                    <div>
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>SKU</th>
                                <th>Наименование</th>
                                <th>Категория</th>
                                <th>Наличие</th>
                                <th>Себестоимость</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.data.map(product => (
                                <tr key={product.id}>
                                    <td className="td-id">{product.id}</td>
                                    <td className="td-sku">{product.sku}</td>
                                    <td className="td-name">{product.name}</td>
                                    <td className="td-category">
                                        {product.category?.name ??'Нет категории'}
                                    </td>
                                    <td>
                                            <span
                                                className={`badge ${product.stock > 0 ? 'badge-green' : 'badge-red'}`}>
                                                {product.stock > 0 ? `${product.stock} шт.` : 'Нет в наличии'}
                                            </span>
                                    </td>
                                    <td className="td-price">{product.price} ₽</td>
                                    <td>
                                        <div className="actions">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="btn-edit"
                                            >
                                                <Pencil size={14}/>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="btn-delete"
                                            >
                                                <Trash2 size={14}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="table-empty">
                        Товаров пока нет
                    </div>
                )}

                {/* Пагинация */}
                {products.links && (
                    <div className="pagination">
                        {products.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`page-link ${
                                    link.active ? 'active' :
                                        link.url ? 'available' : 'disabled'
                                }`}
                                dangerouslySetInnerHTML={{__html: link.label}}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}
