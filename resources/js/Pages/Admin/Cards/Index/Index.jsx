import Layout from '@/Pages/Admin/Layout/Layout.jsx'
import {Link, router} from '@inertiajs/react'
import {Plus, Pencil, Trash2, X, Check} from 'lucide-react'
import './Index.css'

export default function Index({cards}) {

    const handleDelete = (id) => {
        if (!confirm('Подтвердите удаление')) return
        router.delete(`/admin/cards/${id}`)
    }

    return (
        <Layout title="Карточки">
            <div className="table-wrap">

                {/* Шапка */}
                <div className="table-header">
                    <h2 className="table-title">Список карточек</h2>
                    <Link href="/admin/cards/create" className="btn-add">
                        <Plus size={16}/>
                        Добавить карточку
                    </Link>
                </div>

                {/* Таблица */}
                {cards.data.length > 0 ? (
                    <div>
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Наименование карточки</th>
                                <th>Наименование товара</th>
                                <th>Цена</th>
                                <th>Старая цена</th>
                                <th>Наличие</th>
                                <th>Актуальность</th>
                                <th>Изображение</th>
                                <th>Описание</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cards.data.map(card => (
                                <tr key={card.id}>
                                    <td className="td-id">{card.id}</td>
                                    <td className="td-name">{card.name}</td>
                                    <td className="td-name">{card.product.name}</td>
                                    <td className="td-name">{card.price}</td>
                                    <td className="td-price">{card.old_price}</td>
                                    <td>
                                            <span
                                                className={`badge ${card.product.stock > 0 ? 'badge-green' : 'badge-red'}`}>
                                                {card.product.stock > 0 ? `${card.product.stock} шт.` : 'Нет в наличии'}
                                            </span>
                                    </td>
                                    <td className={"td-active"}>

                                        {card.is_active ? <Check color="#13812f"/> : <X color="#f24545"/>}

                                    </td>
                                    <td className="td-image">
                                        <img
                                            src={card.product.image_url}
                                            alt={card.name}
                                            className="product-img"
                                        />
                                    </td>
                                    <td className="td-name">{card.description}</td>
                                    <td>
                                        <div className="actions">
                                            <Link
                                                href={`/admin/cards/${card.id}/edit`}
                                                className="btn-edit"
                                            >
                                                <Pencil size={14}/>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(card.id)}
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
                        Карточек пока нет
                    </div>
                )}

                {/* Пагинация */}
                {cards.links && (
                    <div className="pagination">
                        {cards.links.map((link, i) => (
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
