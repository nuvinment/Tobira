import { useState, useEffect, useRef } from 'react';

/* ─── keyframe injection ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Serif+JP:wght@400;700&display=swap');

@keyframes floatLogo {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-10px) rotate(1.5deg); }
    66%      { transform: translateY(-5px) rotate(-1deg); }
}
@keyframes pulseRing {
    0%   { transform: scale(0.92); opacity: 0.6; }
    50%  { transform: scale(1.12); opacity: 0.15; }
    100% { transform: scale(0.92); opacity: 0.6; }
}
@keyframes pulseRing2 {
    0%   { transform: scale(0.85); opacity: 0.4; }
    50%  { transform: scale(1.22); opacity: 0.08; }
    100% { transform: scale(0.85); opacity: 0.4; }
}
@keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmerText {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
}
@keyframes orbFloat1 {
    0%,100% { transform: translate(0,0); }
    50%     { transform: translate(30px,-40px); }
}
@keyframes orbFloat2 {
    0%,100% { transform: translate(0,0); }
    50%     { transform: translate(-20px,35px); }
}
@keyframes badgePop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.15); }
    100% { transform: scale(1); }
}
@keyframes subtitleFade {
    from { opacity:0; letter-spacing: .3em; }
    to   { opacity:1; letter-spacing: .08em; }
}
@keyframes borderSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}
`;

function injectStyles() {
    if (document.getElementById('auth-layout-styles')) return;
    const el = document.createElement('style');
    el.id = 'auth-layout-styles';
    el.textContent = CSS;
    document.head.appendChild(el);
}

const BADGES = [
    { label: 'N5→N1', color: '#e74c3c' },
    { label: 'Keigo',  color: '#e67e22' },
    { label: 'Sonkeigo', color: '#8e44ad' },
    { label: 'Kenjōgo', color: '#2980b9' },
    { label: 'SRS',    color: '#27ae60' },
];

function Badge({ label, color, delay }) {
    const [hovered, setHovered] = useState(false);
    return (
        <span
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: '6px 14px',
                borderRadius: '99px',
                border: `1.5px solid ${hovered ? color : '#2a2a2a'}`,
                color: hovered ? color : '#555',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '.04em',
                cursor: 'default',
                transition: 'all .25s ease',
                background: hovered ? `${color}18` : 'transparent',
                animation: hovered ? 'badgePop .3s ease' : 'none',
                animationDelay: `${delay}ms`,
                userSelect: 'none',
                boxShadow: hovered ? `0 0 12px ${color}44` : 'none',
            }}
        >
            {label}
        </span>
    );
}

export default function AuthLayout({ title, children }) {
    const [isMobile, setIsMobile] = useState(false);
    const [logoHovered, setLogoHovered] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        injectStyles();
        if (title) document.title = title;
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        // stagger mount for entrance animations
        const t = setTimeout(() => setMounted(true), 80);
        return () => { window.removeEventListener('resize', check); clearTimeout(t); };
    }, []);

    return (
        <>
            <div style={{
                minHeight: '100vh',
                background: '#F7F5F2',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                fontFamily: "'DM Sans', sans-serif",
            }}>

                {/* ═══════════ LEFT PANEL ═══════════ */}
                <div style={{
                    width: isMobile ? '100%' : '460px',
                    minHeight: isMobile ? 'auto' : '100vh',
                    background: 'linear-gradient(160deg, #0f0f0f 0%, #1a1a1a 60%, #111 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isMobile ? '40px 28px' : '56px 48px',
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden',
                }}>

                    {/* ── Ambient orbs ── */}
                    <div style={{
                        position: 'absolute', top: '-60px', left: '-60px',
                        width: '280px', height: '280px',
                        background: 'radial-gradient(circle, #c0392b33 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'orbFloat1 8s ease-in-out infinite',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-80px', right: '-40px',
                        width: '320px', height: '320px',
                        background: 'radial-gradient(circle, #27ae6022 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'orbFloat2 11s ease-in-out infinite',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        width: '200px', height: '200px',
                        background: 'radial-gradient(circle, #8e44ad11 0%, transparent 70%)',
                        transform: 'translate(-50%,-50%)',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                    }} />

                    {/* ── Thin top accent line ── */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #c0392b, #e67e22, #f1c40f, #27ae60, #2980b9, #8e44ad)',
                        backgroundSize: '300% 100%',
                        animation: 'shimmerText 4s linear infinite',
                    }} />

                    {/* ── Logo block ── */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: isMobile ? '28px' : '52px',
                        opacity: mounted ? 1 : 0,
                        animation: mounted ? 'fadeSlideUp .7s ease both' : 'none',
                    }}>

                        {/* Pulse rings behind logo */}
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <div style={{
                                position: 'absolute', inset: '-20px',
                                borderRadius: '50%',
                                border: '2px solid rgba(192,57,43,0.5)',
                                animation: 'pulseRing 2.8s ease-in-out infinite',
                                pointerEvents: 'none',
                            }} />
                            <div style={{
                                position: 'absolute', inset: '-36px',
                                borderRadius: '50%',
                                border: '1.5px solid rgba(192,57,43,0.2)',
                                animation: 'pulseRing2 2.8s ease-in-out infinite',
                                pointerEvents: 'none',
                            }} />

                            {/* Logo image */}
                            <img
                                src="/tobira-logo.png"
                                alt="Tobira Logo"
                                onMouseEnter={() => setLogoHovered(true)}
                                onMouseLeave={() => setLogoHovered(false)}
                                style={{
                                    width: isMobile ? '130px' : '190px',
                                    height: isMobile ? '130px' : '190px',
                                    objectFit: 'contain',
                                    display: 'block',
                                    animation: 'floatLogo 6s ease-in-out infinite',
                                    filter: logoHovered
                                        ? 'drop-shadow(0 0 28px rgba(192,57,43,0.8)) drop-shadow(0 8px 24px rgba(0,0,0,0.6)) brightness(1.1)'
                                        : 'drop-shadow(0 6px 18px rgba(0,0,0,0.5))',
                                    transition: 'filter .35s ease, transform .35s ease',
                                    transform: logoHovered ? 'scale(1.07)' : 'scale(1)',
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                }}
                            />
                        </div>

                        {/* Subtitle under logo */}
                        <div style={{
                            marginTop: '22px',
                            fontSize: isMobile ? '13px' : '14px',
                            color: '#f0c040',
                            fontFamily: "'Noto Serif JP', serif",
                            letterSpacing: '.08em',
                            animation: 'subtitleFade 1.2s ease both',
                            animationDelay: '.4s',
                            opacity: mounted ? 1 : 0,
                        }}>
                            扉 · Business Japanese Learning
                        </div>
                    </div>

                    {/* ── Tagline block – desktop only ── */}
                    {!isMobile && (
                        <div style={{
                            textAlign: 'center',
                            opacity: mounted ? 1 : 0,
                            animation: mounted ? 'fadeSlideUp .8s ease both' : 'none',
                            animationDelay: '.25s',
                        }}>

                            {/* Japanese quote */}
                            <div style={{
                                fontSize: '26px',
                                color: '#fff',
                                fontFamily: "'Noto Serif JP', serif",
                                lineHeight: '1.7',
                                marginBottom: '16px',
                                background: 'linear-gradient(90deg,#fff,#f0c040,#fff)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'shimmerText 4s linear infinite',
                            }}>
                                「学びの扉を開こう」
                            </div>

                            {/* English tagline */}
                            <div style={{
                                fontSize: '15px',
                                color: '#888',
                                lineHeight: '1.9',
                                letterSpacing: '.02em',
                            }}>
                                Open the door to Business Japanese.<br />
                                Master keigo. Advance your career.
                            </div>

                            {/* Divider */}
                            <div style={{
                                width: '48px', height: '2px',
                                background: 'linear-gradient(90deg,transparent,#c0392b,transparent)',
                                margin: '28px auto',
                                borderRadius: '99px',
                            }} />

                            {/* Badges */}
                            <div style={{
                                display: 'flex', gap: '10px',
                                flexWrap: 'wrap', justifyContent: 'center',
                            }}>
                                {BADGES.map((b, i) => (
                                    <Badge key={b.label} label={b.label} color={b.color} delay={i * 60} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Bottom version tag ── */}
                    {!isMobile && (
                        <div style={{
                            position: 'absolute', bottom: '20px',
                            fontSize: '11px', color: '#333',
                            letterSpacing: '.06em',
                        }}>
                            TOBIRA · v1.0
                        </div>
                    )}
                </div>

                {/* ═══════════ RIGHT PANEL ═══════════ */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'center',
                    padding: isMobile ? '24px 16px' : '32px',
                    overflowY: 'auto',
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: isMobile ? '100%' : '460px',
                    }}>
                        {children}
                    </div>
                </div>

            </div>
        </>
    );
}