// resources/js/Components/CartButton.jsx
import { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import './CartButton.css'
import { ShoppingCart } from 'lucide-react'

const CART_KEY = 'cart'

function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || {}
    } catch {
        return {}
    }
}

function getTotal(cart) {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0)
}

export function CartButton() {
    const [total, setTotal] = useState(() => getTotal(readCart()))

    useEffect(() => {
        const sync = () => setTotal(getTotal(readCart()))

        window.addEventListener('cart-updated', sync)
        window.addEventListener('storage', sync)

        return () => {
            window.removeEventListener('cart-updated', sync)
            window.removeEventListener('storage', sync)
        }
    }, [])

    return (
        <Link href="/cart" className="header-action-btn" aria-label="Корзина">
            <span className="header-action-icon-wrap">
                <ShoppingCart size={20} />
                {total > 0 && (
                    <span className="header-action-badge">{total}</span>
                )}
            </span>
            <span className="header-action-label">Корзина</span>
        </Link>
    )
}
