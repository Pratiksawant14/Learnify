'use client';

import { useEffect, useRef } from 'react';

export default function CosmicBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawStars(); // Redraw stars on resize
        };

        // Seeded random function for consistent star positions
        const seededRandom = (seed: number) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        // Draw stars function
        const drawStars = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const starCount = 800;

            for (let i = 0; i < starCount; i++) {
                // Use seeded random for consistent positions
                const x = seededRandom(i * 2) * canvas.width;
                const y = seededRandom(i * 2 + 1) * canvas.height;
                const size = seededRandom(i * 3);
                const brightness = seededRandom(i * 4);

                // Smaller stars - reduced radius
                const radius = size < 0.8 ? 0.4 + seededRandom(i * 5) * 0.3 : 0.6 + seededRandom(i * 6) * 0.5;
                const opacity = 0.4 + brightness * 0.6;

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);

                // Some stars with blue tint
                const blueTint = seededRandom(i * 7) > 0.85 ? 'rgba(200, 220, 255, ' : 'rgba(255, 255, 255, ';
                ctx.fillStyle = blueTint + opacity + ')';
                ctx.fill();

                // Add subtle glow to slightly larger stars
                if (radius > 0.7) {
                    ctx.shadowBlur = 2;
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        };

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        return () => {
            window.removeEventListener('resize', setCanvasSize);
        };
    }, []);

    return (
        <>
            {/* Base deep space black */}
            <div className="fixed inset-0 bg-[#000814] z-0" />

            {/* Milky Way galaxy streak - diagonal blue glow */}
            <div className="fixed inset-0 z-0 overflow-hidden">
                {/* Main galaxy band - diagonal from top-left to bottom-right */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        background: 'linear-gradient(135deg, transparent 0%, transparent 20%, rgba(30, 58, 138, 0.3) 35%, rgba(37, 99, 235, 0.4) 45%, rgba(59, 130, 246, 0.5) 50%, rgba(37, 99, 235, 0.4) 55%, rgba(30, 58, 138, 0.3) 65%, transparent 80%, transparent 100%)',
                    }}
                />

                {/* Brighter core of the galaxy */}
                <div
                    className="absolute top-1/4 left-1/4 w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 opacity-25"
                    style={{
                        background: 'radial-gradient(ellipse 800px 400px at center, rgba(59, 130, 246, 0.6), rgba(37, 99, 235, 0.3) 40%, transparent 70%)',
                        transform: 'rotate(-45deg) translate(-50%, -50%)',
                    }}
                />

                {/* Additional blue nebula clouds */}
                <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[120px] opacity-50" />

                {/* Deep navy undertones */}
                <div className="absolute inset-0 bg-linear-to-t from-blue-950/15 via-transparent to-transparent opacity-70" />
                <div className="absolute inset-0 bg-linear-to-br from-blue-900/10 via-transparent to-black/20 opacity-50" />
            </div>

            {/* Stars canvas - now fully visible */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 z-0 pointer-events-none"
            />

            {/* Very subtle noise texture */}
            <div
                className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                }}
            />

            {/* Subtle vignette for depth */}
            <div className="fixed inset-0 z-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.3) 100%)',
            }} />
        </>
    );
}
