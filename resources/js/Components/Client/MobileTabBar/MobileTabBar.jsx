// resources/js/Components/MobileTabBar.jsx
import { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'
import './MobileTabBar.css'
import { Home, Search, Heart, ShoppingCart, User } from 'lucide-react'

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

function getCartTotal(cart) {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0)
}

const tabs = [
    { key: 'home', label: 'Главная', href: '/', icon: Home },
    { key: 'search', label: 'Поиск', href: '/search', icon: Search },
    { key: 'favorites', label: 'Избранное', href: '/favorites', icon: Heart },
    { key: 'cart', label: 'Корзина', href: '/cart', icon: ShoppingCart },
    { key: 'profile', label: 'Профиль', href: '/profile', icon: User },
]

export function MobileTabBar() {
    const { url } = usePage()
    const [cartTotal, setCartTotal] = useState(() => getCartTotal(readCart()))
    const [favTotal, setFavTotal] = useState(() => readFavorites().length)

    useEffect(() => {
        const syncCart = () => setCartTotal(getCartTotal(readCart()))
        const syncFav = () => setFavTotal(readFavorites().length)
        const syncBoth = () => { syncCart(); syncFav() }

        window.addEventListener('cart-updated', syncCart)
        window.addEventListener('favorites-updated', syncFav)
        window.addEventListener('storage', syncBoth)

        return () => {
            window.removeEventListener('cart-updated', syncCart)
            window.removeEventListener('favorites-updated', syncFav)
            window.removeEventListener('storage', syncBoth)
        }
    }, [])

    const isActive = (href) => url === href || (href !== '/' && url.startsWith(href))

    const badgeFor = (key) => {
        if (key === 'cart') return cartTotal
        if (key === 'favorites') return favTotal
        return 0
    }

    return (
        <nav className="mobile-tabbar">
            {tabs.map(tab => {
                const Icon = tab.icon
                const badge = badgeFor(tab.key)
                const active = isActive(tab.href)

                return (
                    <Link
                        key={tab.key}
                        href={tab.href}
                        className={`mobile-tabbar-item ${active ? 'mobile-tabbar-item--active' : ''}`}
                    >
                        <span className="mobile-tabbar-icon-wrap">
                            <Icon size={20} />
                            {badge > 0 && (
                                <span className="mobile-tabbar-badge">{badge}</span>
                            )}
                        </span>
                        <span className="mobile-tabbar-label">{tab.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
