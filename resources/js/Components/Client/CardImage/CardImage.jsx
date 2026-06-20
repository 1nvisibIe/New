// resources/js/Components/CardImage.jsx
import { useState } from 'react'
import { Link } from '@inertiajs/react'
import './CardImage.css'
import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react'

const CART_KEY = 'cart'
const FAV_KEY = 'favorites'

function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || {}
    } catch {
        return {}
    }
}

function readFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAV_KEY)) || []
    } catch {
        return []
    }
}

export function CardImage({ cards }) {
    const [qty, setQty] = useState(() => readCart()[cards.id] || 0)
    const [isFav, setIsFav] = useState(() => readFavorites().includes(cards.id))

    const updateCart = (newQty) => {
        const cart = readCart()
        if (newQty <= 0) {
            delete cart[cards.id]
        } else {
            cart[cards.id] = newQty
        }
        localStorage.setItem(CART_KEY, JSON.stringify(cart))
        window.dispatchEvent(new Event('cart-updated'))
        setQty(newQty)
    }

    const handleAdd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        updateCart(qty + 1)
    }

    const handleInc = (e) => {
        e.preventDefault()
        e.stopPropagation()
        updateCart(qty + 1)
    }

    const handleDec = (e) => {
        e.preventDefault()
        e.stopPropagation()
        updateCart(Math.max(0, qty - 1))
    }

    const handleFav = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const favs = readFavorites()
        const next = isFav ? favs.filter(id => id !== cards.id) : [...favs, cards.id]
        localStorage.setItem(FAV_KEY, JSON.stringify(next))
        window.dispatchEvent(new Event('favorites-updated'))
        setIsFav(!isFav)
    }

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
                    {qty === 0 ? (
                        <button className="btn-cart" onClick={handleAdd}>
                            <ShoppingCart />&nbsp;&nbsp;В корзину
                        </button>
                    ) : (
                        <div className="btn-cart btn-cart--counter">
                            <button className="cnt-btn" onClick={handleDec} aria-label="Уменьшить">
                                <Minus size={14} />
                            </button>
                            <span className="cnt-num">{qty}</span>
                            <button className="cnt-btn" onClick={handleInc} aria-label="Увеличить">
                                <Plus size={14} />
                            </button>
                        </div>
                    )}

                    <button
                        className={`btn-favorite ${isFav ? 'btn-favorite--active' : ''}`}
                        onClick={handleFav}
                        aria-label="В избранное"
                    >
                        <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </Link>
        </div>
    )
}

