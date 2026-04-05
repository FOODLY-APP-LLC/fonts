import React from 'react';

export function App() {
    return (
        <>
            <link rel="preconnect" href="https://fonts.foodlyapp.ge" crossOrigin="anonymous" />
            <link
                rel="preload"
                href="https://fonts.foodlyapp.ge/v1/fonts/FiraGO/Roman/FiraGO-Regular.woff2"
                as="font"
                type="font/woff2"
                crossOrigin="anonymous"
            />
            <link rel="stylesheet" href="https://fonts.foodlyapp.ge/v1/fonts.css" />

            <main style={{ fontFamily: "'FiraGO', sans-serif", padding: '2rem' }}>
                <h1 style={{ fontWeight: 700 }}>FOODLY React App</h1>
                <p style={{ fontWeight: 400 }}>Shared brand font loaded from fonts.foodlyapp.ge.</p>
                <p style={{ fontFamily: "'DejaVu Sans', sans-serif", fontWeight: 700 }}>
                    Secondary utility text in DejaVu Sans.
                </p>
            </main>
        </>
    );
}
