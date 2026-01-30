'use client';

export default function InfinityLogo() {
    return (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none z-0">
            <svg
                viewBox="0 0 800 400"
                className="w-full h-full opacity-[0.08]"
                style={{ filter: 'blur(0.3px)' }}
            >
                <defs>
                    {/* Ultra strong glow for outer aura */}
                    <filter id="ultraGlow">
                        <feGaussianBlur stdDeviation="12" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Strong glow */}
                    <filter id="strongGlow">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Medium glow */}
                    <filter id="mediumGlow">
                        <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Soft glow */}
                    <filter id="softGlow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Perfect mathematical infinity symbol using Bezier curves */}
                <g>
                    {/* Outermost dim rings - layer 1 */}
                    <path
                        d="M 250 200 C 250 120, 280 100, 320 100 C 360 100, 380 120, 380 160 C 380 200, 360 220, 320 220 C 280 220, 250 200, 250 180 M 420 200 C 420 120, 450 100, 490 100 C 530 100, 550 120, 550 160 C 550 200, 530 220, 490 220 C 450 220, 420 200, 420 180"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1.2"
                        opacity="0.3"
                    />

                    {/* Layer 2 */}
                    <path
                        d="M 245 200 C 245 115, 275 95, 320 95 C 365 95, 385 115, 385 160 C 385 205, 365 225, 320 225 C 275 225, 245 205, 245 180 M 415 200 C 415 115, 445 95, 490 95 C 535 95, 555 115, 555 160 C 555 205, 535 225, 490 225 C 445 225, 415 205, 415 180"
                        fill="none"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1.5"
                        opacity="0.35"
                    />

                    {/* Layer 3 */}
                    <path
                        d="M 240 200 C 240 110, 270 90, 320 90 C 370 90, 390 110, 390 160 C 390 210, 370 230, 320 230 C 270 230, 240 210, 240 180 M 410 200 C 410 110, 440 90, 490 90 C 540 90, 560 110, 560 160 C 560 210, 540 230, 490 230 C 440 230, 410 210, 410 180"
                        fill="none"
                        stroke="rgba(255,255,255,0.18)"
                        strokeWidth="1.8"
                        opacity="0.4"
                        filter="url(#softGlow)"
                    />

                    {/* Layer 4 - mid brightness */}
                    <path
                        d="M 235 200 C 235 105, 265 85, 320 85 C 375 85, 395 105, 395 160 C 395 215, 375 235, 320 235 C 265 235, 235 215, 235 180 M 405 200 C 405 105, 435 85, 490 85 C 545 85, 565 105, 565 160 C 565 215, 545 235, 490 235 C 435 235, 405 215, 405 180"
                        fill="none"
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="2"
                        opacity="0.5"
                        filter="url(#softGlow)"
                    />

                    {/* Layer 5 */}
                    <path
                        d="M 230 200 C 230 100, 260 80, 320 80 C 380 80, 400 100, 400 160 C 400 220, 380 240, 320 240 C 260 240, 230 220, 230 180 M 400 200 C 400 100, 430 80, 490 80 C 550 80, 570 100, 570 160 C 570 220, 550 240, 490 240 C 430 240, 400 220, 400 180"
                        fill="none"
                        stroke="rgba(255,255,255,0.35)"
                        strokeWidth="2.3"
                        opacity="0.6"
                        filter="url(#mediumGlow)"
                    />

                    {/* Layer 6 - brighter */}
                    <path
                        d="M 225 200 C 225 95, 255 75, 320 75 C 385 75, 405 95, 405 160 C 405 225, 385 245, 320 245 C 255 245, 225 225, 225 180 M 395 200 C 395 95, 425 75, 490 75 C 555 75, 575 95, 575 160 C 575 225, 555 245, 490 245 C 425 245, 395 225, 395 180"
                        fill="none"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="2.8"
                        opacity="0.7"
                        filter="url(#mediumGlow)"
                    />

                    {/* Layer 7 - very bright */}
                    <path
                        d="M 220 200 C 220 90, 250 70, 320 70 C 390 70, 410 90, 410 160 C 410 230, 390 250, 320 250 C 250 250, 220 230, 220 180 M 390 200 C 390 90, 420 70, 490 70 C 560 70, 580 90, 580 160 C 580 230, 560 250, 490 250 C 420 250, 390 230, 390 180"
                        fill="none"
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth="3.2"
                        opacity="0.8"
                        filter="url(#strongGlow)"
                    />

                    {/* Layer 8 - nearly brightest */}
                    <path
                        d="M 218 200 C 218 88, 248 68, 320 68 C 392 68, 412 88, 412 160 C 412 232, 392 252, 320 252 C 248 252, 218 232, 218 180 M 388 200 C 388 88, 418 68, 490 68 C 562 68, 582 88, 582 160 C 582 232, 562 252, 490 252 C 418 252, 388 232, 388 180"
                        fill="none"
                        stroke="rgba(255,255,255,0.85)"
                        strokeWidth="3.5"
                        opacity="0.9"
                        filter="url(#strongGlow)"
                    />

                    {/* Layer 9 - brightest core */}
                    <path
                        d="M 215 200 C 215 85, 245 65, 320 65 C 395 65, 415 85, 415 160 C 415 235, 395 255, 320 255 C 245 255, 215 235, 215 180 M 385 200 C 385 85, 415 65, 490 65 C 565 65, 585 85, 585 160 C 585 235, 565 255, 490 255 C 415 255, 385 235, 385 180"
                        fill="none"
                        stroke="rgba(255,255,255,1)"
                        strokeWidth="3"
                        opacity="1"
                        filter="url(#ultraGlow)"
                    />

                    {/* Inner brightest line */}
                    <path
                        d="M 217 200 C 217 87, 247 67, 320 67 C 393 67, 413 87, 413 160 C 413 233, 393 253, 320 253 C 247 253, 217 233, 217 180 M 387 200 C 387 87, 417 67, 490 67 C 563 67, 583 87, 583 160 C 583 233, 563 253, 490 253 C 417 253, 387 233, 387 180"
                        fill="none"
                        stroke="rgba(255,255,255,1)"
                        strokeWidth="2"
                        opacity="1"
                        filter="url(#strongGlow)"
                    />

                    {/* Particle dots along the infinity path */}
                    {[...Array(60)].map((_, i) => {
                        const t = i / 60;
                        let x, y;

                        // Left loop particles
                        if (t < 0.5) {
                            const angle = t * 2 * Math.PI * 2;
                            x = 320 + 95 * Math.cos(angle);
                            y = 160 + 95 * Math.sin(angle);
                        }
                        // Right loop particles
                        else {
                            const angle = (t - 0.5) * 2 * Math.PI * 2;
                            x = 490 + 95 * Math.cos(angle);
                            y = 160 + 95 * Math.sin(angle);
                        }

                        const size = Math.random() > 0.6 ? 1.5 : 0.8;
                        const opacity = 0.4 + Math.random() * 0.5;

                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r={size}
                                fill="rgba(255,255,255,1)"
                                opacity={opacity}
                                filter="url(#softGlow)"
                            />
                        );
                    })}

                    {/* Additional scattered particles for depth */}
                    {[...Array(40)].map((_, i) => {
                        const x = 215 + Math.random() * 370;
                        const y = 65 + Math.random() * 190;
                        const size = Math.random() * 0.9 + 0.3;
                        const opacity = Math.random() * 0.35;

                        return (
                            <circle
                                key={`scatter-${i}`}
                                cx={x}
                                cy={y}
                                r={size}
                                fill="rgba(255,255,255,1)"
                                opacity={opacity}
                            />
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}
