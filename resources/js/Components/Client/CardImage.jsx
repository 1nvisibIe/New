import {Link, router} from '@inertiajs/react'
import './CardImage.css'
import {Heart} from 'lucide-react';
import { ShoppingCart } from 'lucide-react';

export function CardImage({cards}) {
    return (
        <div className="card-item">
            <Link href={`/catalog/${cards.product.slug}`}>
                {/* Фото */}
                <div className="card-image">
                    <img
                        src={cards.product.image_url}
                        alt={cards.name}
                    />
                </div>

                {/* Тело */}
                <div className="van-card-body">
                    <div className="card-price">
                        <span className="price-current">{cards.price} ₽</span>
                        {cards.old_price && (
                            <span className="price-old">{cards.old_price} ₽</span>
                        )}
                    </div>
                    <h3 className="card-title">{cards.name}</h3>

                </div>

                {/* Кнопки */}
                <div className="card-actions">
                    <button className="btn-cart"><ShoppingCart /> Корзина</button>
                    <button className="btn-favorite"><Heart/></button>
                </div>
            </Link>
        </div>
    )
}
