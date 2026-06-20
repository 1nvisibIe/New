// resources/js/Components/FavoriteButton.jsx
import { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import '../CartButton/CartButton.css'
import { Heart } from 'lucide-react'

const FAV_KEY = 'favorites'

function readFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAV_KEY)) || []
    } catch {
        return []
    }
}

export function FavoriteButton() {
    const [total, setTotal] = useState(() => readFavorites().length)

    useEffect(() => {
        const sync = () => setTotal(readFavorites().length)

        window.addEventListener('favorites-updated', sync)
        window.addEventListener('storage', sync)

        return () => {
            window.removeEventListener('favorites-updated', sync)
            window.removeEventListener('storage', sync)
        }
    }, [])

    return (
        <Link href="/favorites" className="header-action-btn" aria-label="Избранное">
            <span className="header-action-icon-wrap">
                <Heart size={20} />
                {total > 0 && (
                    <span className="header-action-badge">{total}</span>
                )}
            </span>
            <span className="header-action-label">Избранное</span>
        </Link>
    )
}
