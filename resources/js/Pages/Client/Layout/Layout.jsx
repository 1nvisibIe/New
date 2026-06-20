// resources/js/Components/Client/Layout.jsx
import { Link } from '@inertiajs/react'
import './Layout.css'
import {CartButton} from "@/Components/Client/CartButton/CartButton.jsx";
import { FavoriteButton } from '@/Components/Client/FavoriteButton/FavoriteButton.jsx'
// resources/js/Components/Client/Layout.jsx
import { MobileTabBar } from '@/Components/Client/MobileTabBar/MobileTabBar.jsx'

const menuItems = [
    {
        label: 'Главная',
        href: '/',
        showInHeader: false,
    },
    {
        label: 'Каталог',
        href: '/category',
        showInHeader: false,
    },
    {
        label: 'Доставка',
        href: '/delivery',
        showInHeader: true,
    },
    {
        label: 'Контакты',
        href: '/contacts',
        showInHeader: true,
    },
]

export default function Layout({ children }) {
    return (
        <div className="site-layout">

            {/* Header */}
            <header className="site-header">
                <div className="site-header-inner">
                    <Link href="/" className="site-logo">
                        ЗОЛУШКАМ.NET
                    </Link>

                    <nav className="site-nav">
                        {menuItems.map(item => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`site-nav-link ${item.showInHeader ? '' : 'site-nav-link--secondary'}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="site-header-actions">
                        <FavoriteButton />
                        <CartButton />
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="site-main">
                {children}
            </main>

            {/* Footer */}
            <footer className="site-footer">
                <div className="site-footer-inner">
                    <span className="site-footer-text">
                        © {new Date().getFullYear()} ЗОЛУШКАМ.NET Все права защищены.
                    </span>
                </div>
            </footer>

            {/* Нижний таб-бар — виден только на мобильных */}
            <MobileTabBar />

        </div>
    )
}
