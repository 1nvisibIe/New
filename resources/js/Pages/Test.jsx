// resources/js/Pages/Test.jsx
import { useState } from 'react';

export default function Test({ message }) {
    const [count, setCount] = useState(0);

    return (

        <div style={{ padding: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h1 style={{ color: '#dc3545', fontSize: '3.5rem' }}>ТЕСТ РАБОТАЕТ!</h1>
            <h1 style={{ color: '#dc3545', fontSize: '3.5rem' }}>SSR ТЕСТ</h1>
            <p style={{ fontSize: '1.8rem' }}>Сообщение от Laravel: {message}</p>

            <div style={{ marginTop: '30px' }}>
                <p style={{ fontSize: '1.5rem' }}>Счётчик: {count}</p>
                <button
                    onClick={() => setCount(count + 1)}
                    style={{ padding: '15px 30px', fontSize: '1.2rem', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    +1
                </button>
            </div>

        </div>

    );
}
