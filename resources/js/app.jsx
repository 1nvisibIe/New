// resources/js/app.jsx
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });

        const page = pages[`./Pages/${name}.jsx`];
        if (!page) {
            console.error(`Компонент "${name}" не найден! Ищу: ./Pages/${name}.jsx`);
            return () => <div style={{color: 'red', padding: '50px', fontSize: '2rem'}}>
                Компонент "{name}" не найден. Проверь имя файла!
            </div>;
        }
        return page;
    },

    setup({ el, App, props }) {
        hydrateRoot(el, <App {...props} />)
    },
});
