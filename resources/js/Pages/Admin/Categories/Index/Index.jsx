import Layout from '@/Pages/Admin/Layout/Layout.jsx'
import {Link, router} from '@inertiajs/react'
import {Plus, Pencil, Trash2} from 'lucide-react'
import './Index.css'

export default function Index({categories}) {

    const handleDelete = (id) => {
        if (!confirm('Подтвердите удаление')) return
        router.delete(`/admin/categories/${id}`)
    }

    return (
        <Layout title="Категории">
            <div className="table-wrapper">

                {/* Шапка */}
                <div className="table-header">
                    <h2 className="table-title">Список категорий</h2>
                    <Link href="/admin/categories/create" className="btn-add">
                        <Plus size={16}/>
                        Добавить категорию
                    </Link>
                </div>

                {/* Таблица */}
                {categories.data.length > 0 ? (
                    <div>
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Наименование</th>
                                <th>Родитель</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {categories.data.map(category => (
                                <tr key={category.id}>
                                    <td className="td-id">{category.id}</td>
                                    <td className="td-name">{category.name}</td>

                                    <td className="td-category">
                                        {category.parent
                                                ? category.parent.name
                                                : (category.parent_id ? 'Не найдена' : 'Корневая')
                                        }
                                    </td>

                                    <td>
                                        <div className="actions">
                                            <Link
                                                href={`/admin/categories/${category.id}/edit`}
                                                className="btn-edit"
                                            >
                                                <Pencil size={14}/>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id)}
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
                        Категорий пока нет
                    </div>
                )}

                {/* Пагинация */}
                {categories.links && (
                    <div className="pagination">
                        {categories.links.map((link, i) => (
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
