import { Link, usePage } from '@inertiajs/react'
import { LayoutDashboard, Package, Tag, CreditCard, Menu, ChevronDown} from 'lucide-react'
import { useState } from 'react'
import './Layout.css'

const menuItems = [
    {
        label: 'Главная',
        icon: LayoutDashboard,
        href: '/admin',
    },
    {
        label: 'Товары',
        icon: Package,
        children: [
            { label: 'Список товаров', href: '/admin/products' },
            { label: 'Новый товар', href: '/admin/products/create' },
        ],
    },
    {
        label: 'Категории',
        icon: Tag,
        children: [
            { label: 'Список категорий', href: '/admin/categories' },
            { label: 'Новая категория', href: '/admin/categories/create' },
        ],
    },
    {
        label: 'Карточки',
        icon: CreditCard,
        children: [
            { label: 'Список карточек', href: '/admin/cards' },
            { label: 'Новая карточка', href: '/admin/cards/create' },
        ],
    },
]


export default function Layout({ children, title }) {
    const { url,props } = usePage()
    const flash = props.flash
    const [openGroups, setOpenGroups] = useState(() => {
        try {
            const saved = localStorage.getItem('adminOpenGroups')
            return saved ? JSON.parse(saved) : {}
        } catch {
            return {}
        }
    })
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const toggleGroup = (label) => {
        setOpenGroups(prev => {
            const next = { ...prev, [label]: !prev[label] }
            localStorage.setItem('adminOpenGroups', JSON.stringify(next))
            return next
        })
    }

    // Точное совпадение для одиночных пунктов
    const isExactActive = (href) => url === href

    // Активен ли дочерний элемент
    const isChildActive = (href) => url === href

    // Активна ли группа (любой дочерний активен)
    const isGroupActive = (children) => children.some(c => isChildActive(c.href))

    return (
        <div className="admin-wrapper">
            {/* Flash сообщения */}
            {flash?.success && (
                <div className="flash flash-success">{flash.success}</div>
            )}
            {flash?.error && (
                <div className="flash flash-error">{flash.error}</div>
            )}
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>

                {/* Логотип */}
                <div className="sidebar-logo">
                    <span>ЗОЛУШКАМ.NET</span>
                </div>

                {/* Навигация */}
                <nav className="sidebar-nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon

                        // Без подменю
                        if (!item.children) {
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`nav-element ${isExactActive(item.href) ? 'active' : ''}`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            )
                        }

                        // С подменю
                        const groupActive = isGroupActive(item.children)
                        const groupOpen = openGroups[item.label] ?? groupActive
                        return (
                            <div key={item.label}>
                                <button
                                    onClick={() => toggleGroup(item.label)}
                                    className={`nav-element ${groupActive ? 'parent-active' : ''}`}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`nav-arrow ${groupOpen ? 'rotated' : ''}`}
                                    />
                                </button>

                                <div className={`nav-submenu ${groupOpen ? 'open' : ''}`}>
                                    {item.children.map(child => (
                                        <Link key={child.label}
                                              href={child.href}
                                              className={`nav-child ${isChildActive(child.href) ? 'active' : ''}`}
                                        >
                                            <span className="nav-dot"/>
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>

                            </div>
                        )
                    })}
                </nav>
            </aside>

            {/* Правая часть */}
            <div className="admin-content">
                <header className="admin-header">
                    <button onClick={() => setSidebarOpen(p => !p)} className="menu-btn">
                        <Menu size={22} />
                    </button>
                    <h1 className="admin-title">{title}</h1>
                    <a href="/" target="_blank" className="site-link">
                        Перейти на сайт
                    </a>
                </header>

                <main className="admin-main">
                    {children}
                </main>
            </div>
        </div>
    )
}
