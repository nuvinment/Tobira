import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Custom CSS for premium animations, glassmorphism, and ruby adjustments
const CUSTOM_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Noto+Serif+JP:wght@400;500;700&family=DM+Sans:wght@400;500;700&display=swap');

.font-japanese {
    font-family: 'Noto Serif JP', 'Hiragino Mincho ProN', 'MS Mincho', serif;
}

.font-sans-custom {
    font-family: 'Outfit', 'DM Sans', sans-serif;
}

@keyframes orb-float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.08); }
    66% { transform: translate(-20px, 20px) scale(0.96); }
}

@keyframes card-float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-6px) rotate(0.4deg); }
}

@keyframes sound-wave {
    0%, 100% { height: 4px; }
    50% { height: 16px; }
}

@keyframes draw-checkmark {
    0% { stroke-dashoffset: 80; }
    100% { stroke-dashoffset: 0; }
}

@keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(12px); }
    100% { opacity: 1; transform: translateY(0); }
}

.animate-orb-1 {
    animation: orb-float 15s ease-in-out infinite;
}

.animate-orb-2 {
    animation: orb-float 18s ease-in-out infinite-reverse;
}

.animate-card-float {
    animation: card-float 5s ease-in-out infinite;
}

.animate-fade-in-up {
    animation: fade-in-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* 3D Flip Card Styles */
.perspective-1000 {
    perspective: 1000px;
}

.preserve-3d {
    transform-style: preserve-3d;
}

.backface-hidden {
    backface-visibility: hidden;
}

.rotate-y-180 {
    transform: rotateY(180deg);
}

.card-transition {
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Glassmorphism Classes */
.glass-panel {
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.45);
}

.glass-input {
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(0, 0, 0, 0.08);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-input:focus {
    background: rgba(255, 255, 255, 0.95);
    border-color: #BC002D;
    box-shadow: 0 0 0 4px rgba(188, 0, 45, 0.12);
    outline: none;
}

/* Checkmark svg drawing */
.success-checkmark-svg path {
    stroke-dasharray: 80;
    stroke-dashoffset: 80;
    animation: draw-checkmark 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.15s forwards;
}

ruby {
    ruby-position: over;
}

rt {
    font-size: 0.4em;
    color: #78716c;
    letter-spacing: 0.05em;
    padding-bottom: 0.1em;
}

.ruby-large rt {
    font-size: 0.35em;
    letter-spacing: 0.08em;
    color: #a8a29e;
}

.hide-furigana rt {
    display: none !important;
}

/* Scrollbar styling */
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
    background: #F7F5F2;
}
::-webkit-scrollbar-thumb {
    background: #E0DDD9;
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: #BC002D;
}
`;

export default function Welcome() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedScenarioKey, setSelectedScenarioKey] = useState("Client Meetings");
    const [isFlipped, setIsFlipped] = useState(false);
    const [showFurigana, setShowFurigana] = useState(true);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [schedulerFeedback, setSchedulerFeedback] = useState('');
    const [ratingEffect, setRatingEffect] = useState(null);
    
    // Header & Mobile Nav state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // About Us state
    const [activeAboutTab, setActiveAboutTab] = useState("vision");
    
    // Contact form state
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactSubject, setContactSubject] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [contactErrors, setContactErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submittedData, setSubmittedData] = useState({});

    // Inject styles on mount
    useEffect(() => {
        document.title = 'Tobira — Business Japanese Spaced Repetition Platform';
        if (!document.getElementById('tobira-welcome-styles')) {
            const el = document.createElement('style');
            el.id = 'tobira-welcome-styles';
            el.textContent = CUSTOM_CSS;
            document.head.appendChild(el);
        }
    }, []);

    // Showcase Cards mapping
    const showcaseCards = {
        "Job Interviews": {
            scenario: "Job Interviews",
            badgeColor: "bg-red-50 text-red-700 border-red-200",
            badgeText: "面接 · Job Interviews",
            level: "JLPT N3 - N1",
            frontMarkup: <ruby className="ruby-large">自己紹介<rt>じこしょうかい</rt></ruby>,
            romaji: "Jiko Shōkai",
            backText: "Self-introduction",
            explanation: "Crucial first step in any Japanese interview. Must be delivered with proper formal posture and tone.",
            keigoForm: "丁寧語 · Polite Speech",
            sentenceMarkup: <><ruby>面接<rt>めんせつ</rt></ruby>で<ruby>自己紹介<rt>じこしょうかい</rt></ruby>をさせていただきます。</>,
            sentenceTranslation: "I would like to introduce myself at the interview.",
            speechText: "自己紹介"
        },
        "Client Meetings": {
            scenario: "Client Meetings",
            badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
            badgeText: "来客対応 · Client Meetings",
            level: "JLPT N2 - N1",
            frontMarkup: <ruby className="ruby-large">弊社<rt>へいしゃ</rt></ruby>,
            romaji: "Heisha",
            backText: "Our company",
            explanation: "Humble expression used when representing your own firm to external clients or partners.",
            keigoForm: "謙譲語 · Humble",
            sentenceMarkup: <><ruby>弊社<rt>へいしゃ</rt></ruby>は<ruby>新<rt>あたら</rt></ruby>しいサービスをご<ruby>紹介<rt>しょうかい</rt></ruby>いたします。</>,
            sentenceTranslation: "Our company would like to introduce our new service.",
            speechText: "弊社"
        },
        "Email Etiquette": {
            scenario: "Email Etiquette",
            badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
            badgeText: "ビジネスメール · Email",
            level: "JLPT N3 - N2",
            frontMarkup: <ruby className="ruby-large">拝啓<rt>はいけい</rt></ruby>,
            romaji: "Haikei",
            backText: "Dear Sir/Madam",
            explanation: "Formal salutation used at the beginning of business correspondence, paired with '敬具' (Keigu) at the end.",
            keigoForm: "頭語 · Salutation",
            sentenceMarkup: <><ruby>拝啓<rt>はいけい</rt></ruby>、<ruby>貴社<rt>きしゃ</rt></ruby>の<ruby>益々<rt>ますます</rt></ruby>のご<ruby>清栄<rt>せいえい</rt></ruby>をお<ruby>慶<rt>よろこ</rt></ruby>び<ruby>申<rt>もう</rt></ruby>し<ruby>上<rt>あ</rt></ruby>げます。</>,
            sentenceTranslation: "Dear Sir/Madam, we congratulate your company on its continued prosperity.",
            speechText: "拝啓"
        },
        "Telephone Calls": {
            scenario: "Telephone Calls",
            badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
            badgeText: "電話対応 · Telephone",
            level: "JLPT N2 - N1",
            frontMarkup: <><ruby className="ruby-large">少々<rt>しょうしょう</rt></ruby><ruby className="ruby-large">待<rt>ま</rt></ruby>ちください</>,
            romaji: "Shōshō omachi kudasai",
            backText: "Please wait a moment",
            explanation: "Polite phrase used to ask a caller to wait while transferring their call or looking up information.",
            keigoForm: "丁寧語 · Polite Speech",
            sentenceMarkup: <><ruby>担当者<rt>たんとうしゃ</rt></ruby>を<ruby>呼<rt>よ</rt></ruby>びますので、<ruby>少々<rt>しょうしょう</rt></ruby>お<ruby>待<rt>ま</rt></ruby>ちください。</>,
            sentenceTranslation: "I will call the person in charge, so please wait a moment.",
            speechText: "少々お待ちください"
        },
        "Office Daily Use": {
            scenario: "Office Daily Use",
            badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
            badgeText: "社内会話 · Office Daily",
            level: "JLPT N4 - N2",
            frontMarkup: <>お<ruby className="ruby-large">疲<rt>つ</rt></ruby>れ<ruby className="ruby-large">様<rt>さま</rt></ruby>です</>,
            romaji: "Otsukaresama desu",
            backText: "Thank you for your hard work",
            explanation: "Standard daily greeting exchanged between colleagues and superiors to acknowledge effort.",
            keigoForm: "丁寧語 · Polite Speech",
            sentenceMarkup: <><ruby>課長<rt>かちょう</rt></ruby>、<ruby>今日<rt>きょう</rt></ruby>の<ruby>業務<rt>ぎょうむ</rt></ruby>は<ruby>終了<rt>しゅうりょう</rt></ruby>しました。お<ruby>疲<rt>つ</rt></ruby>れ<ruby>様<rt>さま</rt></ruby>です。</>,
            sentenceTranslation: "Section Manager, today's work is finished. Thank you for your hard work.",
            speechText: "お疲れ様です"
        }
    };

    const activeCard = showcaseCards[selectedScenarioKey] || showcaseCards["Client Meetings"];

    // Simulated audio playback
    const playAudio = (text, e) => {
        e.stopPropagation();
        if (isPlayingAudio) return;
        setIsPlayingAudio(true);
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "ja-JP";
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        }
        setTimeout(() => setIsPlayingAudio(false), 1200);
    };

    // Simulated SM-2 Algorithm scheduler feedback
    const handleRatingClick = (rating, label, e) => {
        e.stopPropagation();
        setRatingEffect(rating);
        setTimeout(() => setRatingEffect(null), 800);

        let msg = '';
        switch(rating) {
            case 0:
                msg = "Reset! Card rescheduled for review tomorrow. (Interval: 1 day, Easiness Factor -0.20)";
                break;
            case 1:
                msg = "Hard card! Review scheduled in 2 days. (Interval x1.2, Easiness Factor -0.15)";
                break;
            case 2:
                msg = "Good recall! Scheduled in 6 days. (Interval x2.5, Easiness Factor unchanged)";
                break;
            case 3:
                msg = "Excellent! Review scheduled in 14 days. (Interval x3.2, Easiness Factor +0.15)";
                break;
            default:
                msg = '';
        }
        setSchedulerFeedback(msg);
    };

    // Card front/back toggle
    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
        if (isFlipped) {
            setSchedulerFeedback('');
        }
    };

    // Contact Validation & Submit
    const validateField = (field, val) => {
        let errs = { ...contactErrors };
        if (field === 'name') {
            if (!val || val.trim().length < 2) {
                errs.name = "Name must be at least 2 characters.";
            } else {
                delete errs.name;
            }
        }
        if (field === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!val) {
                errs.email = "Email is required.";
            } else if (!emailRegex.test(val)) {
                errs.email = "Please enter a valid email address.";
            } else {
                delete errs.email;
            }
        }
        if (field === 'subject') {
            if (!val || val.trim().length < 3) {
                errs.subject = "Subject must be at least 3 characters.";
            } else {
                delete errs.subject;
            }
        }
        if (field === 'message') {
            if (!val || val.trim().length < 10) {
                errs.message = "Message must be at least 10 characters.";
            } else {
                delete errs.message;
            }
        }
        setContactErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        
        const isNameValid = validateField('name', contactName);
        const isEmailValid = validateField('email', contactEmail);
        const isSubjectValid = validateField('subject', contactSubject);
        const isMsgValid = validateField('message', contactMessage);

        if (!isNameValid || !isEmailValid || !isSubjectValid || !isMsgValid) {
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setSubmittedData({
                name: contactName,
                email: contactEmail,
                subject: contactSubject,
                message: contactMessage
            });
        }, 1250);
    };

    const scenarios = [
        {
            title: "Job Interviews",
            japanese: "面接",
            romaji: "Mensetsu",
            desc: "Master key formal humble verbs (Kenjōgo) and polite speech (Teineigo) for self-introductions, answering behavioral queries, and project reviews.",
            level: "N3 - N1",
            badgeColor: "bg-red-50 text-red-700 border-red-200"
        },
        {
            title: "Client Meetings",
            japanese: "来客対応",
            romaji: "Raikyaku Taiō",
            desc: "Elevate guest greetings, honorific greetings (Sonkeigo), exchange business cards, serve tea, and run product presentations flawlessly.",
            level: "N2 - N1",
            badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
        },
        {
            title: "Email Etiquette",
            japanese: "ビジネスメール",
            romaji: "Bijinesu Mēru",
            desc: "Learn standard greeting blocks, structured requests, elegant apologies, and sign-offs used daily in corporate communication.",
            level: "N3 - N2",
            badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200"
        },
        {
            title: "Telephone Calls",
            japanese: "電話対応",
            romaji: "Denwa Taiō",
            desc: "Handle incoming calls, transfer calls to department heads, master polite excuses when someone is out, and take detailed messages.",
            level: "N2 - N1",
            badgeColor: "bg-amber-50 text-amber-700 border-amber-200"
        },
        {
            title: "Office Daily Use",
            japanese: "社内会話",
            romaji: "Shanai Kaiwa",
            desc: "Navigate conversations with your boss, report task completion (Hō-Ren-Sō), request feedback, and negotiate leave or work schedules.",
            level: "N4 - N2",
            badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
        }
    ];

    return (
        <>
            <div className="min-h-screen bg-[#F7F5F2] font-sans-custom text-[#2a2a2a] relative">
                
                {/* --- Ambient Background Orbs (fixed, clipped safely) --- */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-10%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-red-100/35 filter blur-[100px] animate-orb-1" />
                    <div className="absolute bottom-[-10%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-emerald-100/30 filter blur-[120px] animate-orb-2" />
                    <div className="absolute top-[40%] left-[30%] w-[35vw] h-[35vw] rounded-full bg-purple-100/20 filter blur-[90px] animate-orb-1" />
                </div>

                {/* --- HEADER NAVBAR --- */}
                <header className="sticky top-0 z-50 bg-[#F7F5F2]/80 backdrop-blur-md border-b border-stone-200/50 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        
                        {/* Logo and App Title */}
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <div className="absolute -inset-1 rounded-full bg-[#BC002D]/10 blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                                <img
                                    src="/tobira-logo.png"
                                    alt="Tobira Logo"
                                    className="relative h-11 w-11 object-contain rounded-full border border-stone-200/30 shadow-sm transition-transform duration-300 hover:rotate-[6deg]"
                                />
                            </div>
                            <div>
                                <div className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-1.5 font-sans-custom">
                                    Tobira <span className="font-japanese font-medium text-sm text-[#BC002D] bg-[#BC002D]/5 px-1.5 py-0.5 rounded border border-[#BC002D]/15">扉</span>
                                </div>
                                <div className="text-[10px] text-stone-500 uppercase tracking-widest leading-none font-semibold">Business Japanese SRS</div>
                            </div>
                        </div>

                        {/* Middle Navigation - Desktop */}
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#about-us" className="text-sm font-medium text-stone-600 hover:text-[#BC002D] transition-colors">About Us</a>
                            <a href="#scenarios" className="text-sm font-medium text-stone-600 hover:text-[#BC002D] transition-colors">Scenarios</a>
                            <a href="#sm2-method" className="text-sm font-medium text-stone-600 hover:text-[#BC002D] transition-colors">SM-2 Algorithm</a>
                            <a href="#features" className="text-sm font-medium text-stone-600 hover:text-[#BC002D] transition-colors">Features</a>
                            <a href="#contact-us" className="text-sm font-medium text-stone-600 hover:text-[#BC002D] transition-colors">Contact Us</a>
                        </nav>

                        {/* Right Buttons - Desktop */}
                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <Link
                                    to={'/dashboard'}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-sm hover:shadow active:scale-[0.98]"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to={'/login'}
                                        className="px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-200/40 transition-all active:scale-[0.98]"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to={'/register'}
                                        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all shadow-md shadow-[#BC002D]/15 hover:shadow-lg hover:shadow-[#BC002D]/25 active:scale-[0.98]"
                                    >
                                        Start Learning
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Hamburger Menu Trigger - Mobile */}
                        <button 
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2.5 rounded-xl text-stone-600 hover:bg-stone-200/40 hover:text-stone-900 active:scale-95 transition-all"
                            title="Open navigation menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* --- MOBILE NAVIGATION DRAWER --- */}
                <div className={`fixed inset-0 z-50 transition-all duration-300 pointer-events-none ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <div 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    />
                    <div className={`absolute top-0 right-0 h-full w-[280px] bg-[#F7F5F2] border-l border-stone-200/80 shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}>
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-2">
                                    <img src="/tobira-logo.png" alt="Tobira Logo" className="h-8 w-8 object-contain" />
                                    <span className="font-bold text-stone-900 font-sans-custom">Tobira <span className="font-japanese text-xs text-[#BC002D]">扉</span></span>
                                </div>
                                <button 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-100 active:scale-95 transition-all"
                                    title="Close navigation menu"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <nav className="flex flex-col gap-3">
                                <a 
                                    href="#about-us" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-base font-semibold text-stone-600 hover:text-[#BC002D] px-3.5 py-2.5 rounded-xl hover:bg-stone-200/30 transition-all font-sans-custom"
                                >
                                    About Us
                                </a>
                                <a 
                                    href="#scenarios" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-base font-semibold text-stone-600 hover:text-[#BC002D] px-3.5 py-2.5 rounded-xl hover:bg-stone-200/30 transition-all font-sans-custom"
                                >
                                    Scenarios
                                </a>
                                <a 
                                    href="#sm2-method" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-base font-semibold text-stone-600 hover:text-[#BC002D] px-3.5 py-2.5 rounded-xl hover:bg-stone-200/30 transition-all font-sans-custom"
                                >
                                    SM-2 Algorithm
                                </a>
                                <a 
                                    href="#features" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-base font-semibold text-stone-600 hover:text-[#BC002D] px-3.5 py-2.5 rounded-xl hover:bg-stone-200/30 transition-all font-sans-custom"
                                >
                                    Features
                                </a>
                                <a 
                                    href="#contact-us" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-base font-semibold text-stone-600 hover:text-[#BC002D] px-3.5 py-2.5 rounded-xl hover:bg-stone-200/30 transition-all font-sans-custom"
                                >
                                    Contact Us
                                </a>
                            </nav>
                        </div>

                        <div className="flex flex-col gap-3 pt-6 border-t border-stone-200">
                            {user ? (
                                <Link
                                    to={'/dashboard'}
                                    className="w-full text-center py-3 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-850 transition-all font-sans-custom"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to={'/login'}
                                        className="w-full text-center py-3 rounded-xl text-sm font-semibold border border-stone-200 text-stone-700 hover:bg-stone-100 transition-all font-sans-custom"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to={'/register'}
                                        className="w-full text-center py-3 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all shadow-md shadow-[#BC002D]/15 font-sans-custom"
                                    >
                                        Start Learning
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- HERO SECTION --- */}
                <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        
                        {/* Hero Left Content */}
                        <div className="lg:col-span-6 flex flex-col space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center justify-center lg:justify-start gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#BC002D] animate-ping" />
                                <span className="text-xs uppercase tracking-widest font-semibold text-[#BC002D] font-sans-custom">Now Open for Students</span>
                            </div>

                            <div className="space-y-4">
                                <h1 id="welcome-hero-title" className="text-4xl md:text-5xl lg:text-6xl font-japanese font-bold text-stone-900 leading-tight">
                                    学びの扉を<br className="hidden sm:inline" />
                                    開こう。
                                </h1>
                                <p className="text-lg md:text-xl font-medium text-stone-850 font-sans-custom">
                                    Master the nuances of Business Japanese with intelligent, scenario-driven Spaced Repetition.
                                </p>
                                <p className="text-sm md:text-base text-stone-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-sans-custom">
                                    Specifically built for professionals. Learn Keigo, Sonkeigo, and Kenjōgo registers mapped to job interviews, client meetings, emails, and phone calls. Powered by the validated SM-2 scheduling algorithm.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                                <Link
                                    to={user ? '/dashboard' : '/register'}
                                    className="px-8 py-4 rounded-2xl text-base font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all shadow-lg shadow-[#BC002D]/20 hover:shadow-xl hover:shadow-[#BC002D]/35 text-center active:scale-[0.98] font-sans-custom"
                                >
                                    {user ? 'Go to Dashboard →' : 'Create Free Account →'}
                                </Link>
                                <a
                                    href="#scenarios"
                                    className="px-8 py-4 rounded-2xl text-base font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 hover:text-stone-950 transition-all text-center shadow-sm active:scale-[0.98] font-sans-custom"
                                >
                                    Explore Scenarios
                                </a>
                            </div>

                            {/* Stat counts */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/60 max-w-md mx-auto lg:mx-0">
                                <div>
                                    <div className="text-2xl font-bold text-stone-900 font-sans-custom">5+</div>
                                    <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold font-sans-custom">Scenarios</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-stone-900 font-sans-custom">100%</div>
                                    <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold font-sans-custom">Keigo Focused</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-stone-900 font-sans-custom">SM-2</div>
                                    <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold font-sans-custom">Algorithm</div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Right Content - Interactive 3D Card Showcase */}
                        <div className="lg:col-span-6 flex flex-col items-center justify-center">
                            
                            {/* Instruction above card */}
                            <div className="mb-4 text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-2 font-sans-custom">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-stone-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 9.152c.582.448 1.148.89 1.676 1.345m-1.676-1.345c-.53-.407-1.125-.806-1.768-1.189m1.768 1.189L12 10.25m6-1.098c-.765-.589-1.666-1.171-2.677-1.722M18 9.152a22.5 22.5 0 00-5.12-2.73M18 9.152c.459.352.883.698 1.267 1.037m0 0c-.394-.339-.893-.728-1.48-1.146m1.48 1.146L12 14.75M12 2.25V6.75m0 0a22.508 22.508 0 00-6.19 3.064m6.19-3.064c.725.353 1.395.716 2 1.07M6 9.152c.571-.439 1.128-.874 1.657-1.302m-1.657 1.302c-.52-.398-1.102-.79-1.733-1.168M6 9.152L12 14.75m-6-1.098c.749-.575 1.63-1.145 2.617-1.688M6 13.652c-.443.34-.852.673-1.218.995m0 0c.365-.322.842-.693 1.411-1.093M4.782 14.647L12 21.75M12 21.75l7.218-7.103m-7.218 7.103V17.25" />
                                </svg>
                                Click flashcard to flip • Toggle furigana
                            </div>

                            {/* Card Container Box */}
                            <div className="w-full max-w-[420px] aspect-[4/3] relative perspective-1000 animate-card-float cursor-pointer group" onClick={handleCardClick}>
                                
                                <div className={`relative w-full h-full preserve-3d card-transition rounded-3xl border border-stone-200/80 shadow-xl shadow-stone-850/5 ${isFlipped ? 'rotate-y-180' : ''}`}>
                                    
                                    {/* --- CARD FRONT --- */}
                                    <div className="absolute inset-0 backface-hidden bg-white rounded-3xl p-8 flex flex-col justify-between overflow-hidden">
                                        
                                        {/* Corner Decorative Borders */}
                                        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-stone-200" />
                                        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-stone-200" />
                                        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-stone-200" />
                                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-stone-200" />

                                        {/* Card Top Badges */}
                                        <div className="flex justify-between items-center z-10">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeCard.badgeColor} border px-2.5 py-1 rounded-full font-sans-custom`}>
                                                {activeCard.badgeText}
                                            </span>
                                            <span className="text-[10px] font-bold text-stone-400 bg-stone-50 border border-stone-150 px-2 py-0.5 rounded-md font-sans-custom">
                                                {activeCard.level}
                                            </span>
                                        </div>

                                        {/* Japanese Word - Center */}
                                        <div className="text-center z-10 py-6">
                                            <div className="relative inline-block">
                                                <span className={`text-5xl font-japanese font-bold text-stone-900 tracking-wide block ${showFurigana ? '' : 'hide-furigana'}`}>
                                                    {activeCard.frontMarkup}
                                                </span>
                                            </div>
                                            <p className="text-xs text-stone-400 mt-4 tracking-widest uppercase font-medium font-sans-custom">[ {activeCard.romaji} ]</p>
                                        </div>

                                        {/* Card Bottom Meta */}
                                        <div className="flex justify-between items-center text-xs text-stone-400 z-10 font-sans-custom">
                                            <span>Keigo Form: {activeCard.keigoForm.split(" · ")[0]}</span>
                                            <span className="flex items-center gap-1 text-[#BC002D] font-semibold group-hover:translate-x-1 transition-transform">
                                                Reveal Meaning ➔
                                            </span>
                                        </div>
                                    </div>

                                    {/* --- CARD BACK --- */}
                                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#1e1e1e] text-white rounded-3xl p-7 flex flex-col justify-between overflow-hidden border border-stone-800">
                                        
                                        {/* Ambient glow in card back */}
                                        <div className="absolute top-[-30px] right-[-30px] w-24 h-24 rounded-full bg-red-900/40 filter blur-xl pointer-events-none" />

                                        {/* Top Badges */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-900/50 px-2.5 py-1 rounded-full font-sans-custom">
                                                {activeCard.keigoForm}
                                            </span>
                                            
                                            {/* Simulated Audio Button */}
                                            <button 
                                                onClick={(e) => playAudio(activeCard.speechText, e)}
                                                className={`p-2 rounded-full border transition-all ${isPlayingAudio ? 'bg-[#BC002D] border-transparent scale-95 shadow-lg shadow-[#BC002D]/35' : 'bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-300 hover:text-white'}`}
                                                title="Listen pronunciation"
                                            >
                                                {isPlayingAudio ? (
                                                    <div className="flex items-center justify-center gap-0.5 h-3.5 w-3.5">
                                                        <span className="w-0.5 bg-white rounded-full animate-sound-wave" style={{ animation: 'sound-wave 0.8s ease infinite' }} />
                                                        <span className="w-0.5 bg-white rounded-full animate-sound-wave" style={{ animation: 'sound-wave 0.8s ease infinite 0.2s' }} />
                                                        <span className="w-0.5 bg-white rounded-full animate-sound-wave" style={{ animation: 'sound-wave 0.8s ease infinite 0.4s' }} />
                                                    </div>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>

                                        {/* Translations and Sentences */}
                                        <div className="space-y-3 my-2 text-left">
                                            <div>
                                                <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider leading-none font-sans-custom">English Meaning</div>
                                                <div className="text-base font-semibold text-stone-100 mt-1 font-sans-custom">{activeCard.backText}</div>
                                                <div className="text-[11px] text-stone-400 font-sans-custom">({activeCard.explanation})</div>
                                            </div>

                                            <div className="pt-2 border-t border-stone-850">
                                                <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider leading-none font-sans-custom">Example Sentence</div>
                                                <div className={`mt-1.5 font-japanese text-sm font-medium leading-relaxed text-stone-200 ${showFurigana ? '' : 'hide-furigana'}`}>
                                                    {activeCard.sentenceMarkup}
                                                </div>
                                                <div className="text-xs text-stone-400 mt-1 italic font-sans-custom">"{activeCard.sentenceTranslation}"</div>
                                            </div>
                                        </div>

                                        {/* Card Rating Buttons ROW */}
                                        <div className="z-15">
                                            <div className="text-[9px] text-stone-500 uppercase font-bold tracking-wider text-center mb-2 font-sans-custom">Self-Rate recall to schedule next review:</div>
                                            <div className="grid grid-cols-4 gap-1.5">
                                                {[
                                                    { label: "Again", rating: 0, color: "hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 text-red-300/80" },
                                                    { label: "Hard", rating: 1, color: "hover:bg-amber-500/10 hover:border-amber-500/50 hover:text-amber-400 text-amber-300/80" },
                                                    { label: "Good", rating: 2, color: "hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-400 text-emerald-300/80" },
                                                    { label: "Easy", rating: 3, color: "hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400 text-blue-300/80" }
                                                ].map((btn) => (
                                                    <button
                                                        key={btn.label}
                                                        onClick={(e) => handleRatingClick(btn.rating, btn.label, e)}
                                                        className={`py-2 px-1 text-center rounded-lg border border-stone-800 bg-stone-900/60 font-semibold text-[10px] tracking-wide transition-all active:scale-[0.95] font-sans-custom ${btn.color} ${ratingEffect === btn.rating ? 'ring-2 ring-white scale-95 border-stone-500 text-white' : ''}`}
                                                    >
                                                        {btn.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Controls Below Card */}
                            <div className="mt-6 flex flex-col items-center gap-3 w-full max-w-[420px]">
                                <div className="flex items-center gap-6">
                                    {/* Furigana Toggle Switch */}
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showFurigana}
                                            onChange={(e) => setShowFurigana(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="relative w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#BC002D]"></div>
                                        <span className="ms-2.5 text-xs font-semibold text-stone-600 uppercase tracking-wider font-sans-custom">Furigana Toggle</span>
                                    </label>
                                </div>

                                {/* Dynamic Spaced Repetition interval mock message */}
                                <div className="h-10 flex items-center justify-center w-full">
                                    {schedulerFeedback ? (
                                        <div className="text-xs font-semibold text-[#BC002D] bg-[#BC002D]/5 px-3 py-1.5 rounded-full border border-[#BC002D]/15 text-center animate-pulse font-sans-custom">
                                            {schedulerFeedback}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-stone-400 italic text-center font-sans-custom">
                                            Flip to back, click a rating, and see the SM-2 algorithm schedule reviews.
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </main>

                {/* --- ABOUT US SECTION --- */}
                <section id="about-us" className="py-24 relative max-w-7xl mx-auto px-6 border-t border-stone-200/50">
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#BC002D] font-sans-custom">About Tobira</span>
                        <h2 className="text-3xl md:text-4xl font-bold font-japanese tracking-tight text-stone-900">
                            Project Genesis & Academic Context
                        </h2>
                        <p className="text-stone-500 text-sm md:text-base font-sans-custom">
                            Discover the motivation behind our platform, the engineering team, and our supervisors.
                        </p>
                    </div>

                    {/* Tab Navigators */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-3xl mx-auto bg-stone-200/40 p-1.5 rounded-2xl border border-stone-200/60 backdrop-blur-sm">
                        {[
                            { id: "vision", label: "Project Vision" },
                            { id: "team", label: "Our Team & Supervisor" },
                            { id: "backstory", label: "Backstory & Motivation" },
                            { id: "system", label: "Technical Overview" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveAboutTab(tab.id)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-95 font-sans-custom ${activeAboutTab === tab.id ? 'bg-[#BC002D] text-white shadow-md shadow-[#BC002D]/15' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Panels */}
                    <div className="max-w-4xl mx-auto">
                        <div className="glass-panel rounded-3xl p-8 md:p-10 shadow-xl shadow-stone-850/5 border border-stone-200/50 min-h-[320px] flex flex-col justify-between transition-all duration-300">
                            
                            {activeAboutTab === 'vision' && (
                                <div className="space-y-6 animate-fade-in-up text-left">
                                    <div className="flex items-center gap-3">
                                        <span className="p-2 bg-[#BC002D]/5 rounded-xl text-[#BC002D]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </span>
                                        <h3 className="text-xl font-bold text-stone-900 font-sans-custom">Project Vision</h3>
                                    </div>
                                    <p className="text-stone-600 text-sm md:text-base leading-relaxed font-sans-custom">
                                        Tobira is a premium full-stack Spaced Repetition (SRS) platform built explicitly for <strong>Business Japanese</strong> learners. Our mission is to bridge the gap between textbook grammar and corporate fluency by helping students master honorific styles (Keigo) in high-context scenarios.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                        <div className="bg-white/60 p-4 rounded-2xl border border-stone-100 flex gap-3 items-start">
                                            <span className="text-[#BC002D] font-bold text-lg mt-0.5 font-japanese">扉</span>
                                            <div>
                                                <h4 className="font-bold text-stone-800 text-sm font-sans-custom">Open the Door (とびら)</h4>
                                                <p className="text-xs text-stone-500 mt-0.5 font-sans-custom">We unlock professional opportunities by providing tailored cards that prepare you for Japanese workplace communications.</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/60 p-4 rounded-2xl border border-stone-100 flex gap-3 items-start">
                                            <span className="text-[#BC002D] font-bold text-lg mt-0.5 font-sans-custom">💡</span>
                                            <div>
                                                <h4 className="font-bold text-stone-800 text-sm font-sans-custom">Spaced Repetition Science</h4>
                                                <p className="text-xs text-stone-500 mt-0.5 font-sans-custom">By integrating the SM-2 algorithm, Tobira tracks your memory retention and schedules reviews precisely when you need them.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeAboutTab === 'team' && (
                                <div className="space-y-6 animate-fade-in-up text-left">
                                    <div className="flex items-center gap-3">
                                        <span className="p-2 bg-[#BC002D]/5 rounded-xl text-[#BC002D]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                            </svg>
                                        </span>
                                        <h3 className="text-xl font-bold text-stone-900 font-sans-custom">Developer & Academic Advisors</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white/80 p-5 rounded-2xl border border-stone-200/50 flex flex-col justify-between">
                                            <div className="space-y-2">
                                                <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider font-sans-custom">Lead Developer</div>
                                                <h4 className="text-base font-bold text-stone-900 font-sans-custom">N.M. Amarasinghe</h4>
                                                <p className="text-xs text-stone-500 font-sans-custom leading-relaxed">
                                                    Registration No: <span className="font-semibold text-stone-800">UOG0623004</span><br />
                                                    Department of Computer Science & Web Engineering.
                                                </p>
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-sans-custom">
                                                <span>Academic Term: May 2026</span>
                                            </div>
                                        </div>

                                        <div className="bg-white/80 p-5 rounded-2xl border border-stone-200/50 flex flex-col justify-between">
                                            <div className="space-y-2">
                                                <div className="text-[10px] text-[#BC002D] font-bold uppercase tracking-wider font-sans-custom">Supervisors</div>
                                                <h4 className="text-base font-bold text-stone-900 font-sans-custom">Ms. Chobodi & Ms. Githmi</h4>
                                                <p className="text-xs text-stone-500 font-sans-custom leading-relaxed">
                                                    Lecturers and Module Instructors of the <strong>Web Programming</strong> module. Under their guidance, Tobira was structured to implement robust MVC practices and custom reusable web components.
                                                </p>
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-sans-custom">
                                                <span>Module: Web Programming</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeAboutTab === 'backstory' && (
                                <div className="space-y-6 animate-fade-in-up text-left">
                                    <div className="flex items-center gap-3">
                                        <span className="p-2 bg-[#BC002D]/5 rounded-xl text-[#BC002D]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                                            </svg>
                                        </span>
                                        <h3 className="text-xl font-bold text-stone-900 font-sans-custom">Backstory & Motivation</h3>
                                    </div>
                                    <p className="text-stone-600 text-sm md:text-base leading-relaxed font-sans-custom">
                                        Business Japanese—specifically <strong>Keigo</strong> (honorific speech)—is highly context-sensitive and challenging for international professionals. Common study methods rely on static text lists. Tobira solves this problem by introducing adaptive active recall.
                                    </p>
                                    <blockquote className="border-l-4 border-[#BC002D] pl-4 italic text-stone-500 text-xs md:text-sm font-sans-custom">
                                        "Tobira was conceived as a companion tool to the Gido Business Japanese Training Platform developed by <strong>Team SCIN</strong>. It is designed to reinforce scenario-based training through daily adaptive flashcard reviews, enabling students to lock in situational Keigo patterns."
                                    </blockquote>
                                </div>
                            )}

                            {activeAboutTab === 'system' && (
                                <div className="space-y-6 animate-fade-in-up text-left">
                                    <div className="flex items-center gap-3">
                                        <span className="p-2 bg-[#BC002D]/5 rounded-xl text-[#BC002D]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                                            </svg>
                                        </span>
                                        <h3 className="text-xl font-bold text-stone-900 font-sans-custom">Technical Overview</h3>
                                    </div>
                                    <p className="text-stone-600 text-sm font-sans-custom">
                                        Designed with an MVC architecture separating the React.js SPA frontend from Laravel's REST API backend.
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                        <div className="bg-white/60 p-3.5 rounded-2xl border border-stone-200/50">
                                            <span className="text-[#BC002D] font-bold text-xl block font-sans-custom">Laravel</span>
                                            <span className="text-[10px] text-stone-400 uppercase font-semibold font-sans-custom">Backend API</span>
                                        </div>
                                        <div className="bg-white/60 p-3.5 rounded-2xl border border-stone-200/50">
                                            <span className="text-[#BC002D] font-bold text-xl block font-sans-custom">React.js</span>
                                            <span className="text-[10px] text-stone-400 uppercase font-semibold font-sans-custom">Frontend SPA</span>
                                        </div>
                                        <div className="bg-white/60 p-3.5 rounded-2xl border border-stone-200/50">
                                            <span className="text-[#BC002D] font-bold text-xl block font-sans-custom">Tailwind</span>
                                            <span className="text-[10px] text-stone-400 uppercase font-semibold font-sans-custom">Styling System</span>
                                        </div>
                                        <div className="bg-white/60 p-3.5 rounded-2xl border border-stone-200/50">
                                            <span className="text-[#BC002D] font-bold text-xl block font-sans-custom">MySQL</span>
                                            <span className="text-[10px] text-stone-400 uppercase font-semibold font-sans-custom">Database Engine</span>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <div className="text-xs font-bold text-stone-700 mb-2 font-sans-custom">Five Reusable Web Components Built In React:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {["FlashCard", "ProgressBar", "ScenarioBadge", "AudioPlayer", "RatingButtons"].map((comp) => (
                                                <span key={comp} className="text-[10px] font-mono font-semibold bg-stone-100/80 text-stone-600 border border-stone-200 px-2 py-0.5 rounded font-sans-custom">
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* --- BUSINESS SCENARIOS SECTION --- */}
                <section id="scenarios" className="bg-[#FAF9F6] border-y border-stone-200/60 py-24 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        
                        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                            <span className="text-xs uppercase tracking-widest font-bold text-[#BC002D] font-sans-custom">Curated Content Library</span>
                            <h2 className="text-3xl md:text-4xl font-bold font-japanese tracking-tight text-stone-900">
                                Scenario-Based Vocabulary & Decks
                            </h2>
                            <p className="text-stone-500 text-sm md:text-base font-sans-custom">
                                Language learning is most effective when learned in situational context. Tobira organizes vocabulary, formal honorifics, and dialogues by professional scenario.
                            </p>
                        </div>

                        {/* Scenario cards grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {scenarios.map((sc, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setSelectedScenarioKey(sc.title);
                                        setIsFlipped(false);
                                        setSchedulerFeedback('');
                                        document.getElementById('welcome-hero-title')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1 cursor-pointer text-left ${selectedScenarioKey === sc.title ? 'border-[#BC002D] ring-2 ring-[#BC002D]/10' : 'border-stone-200/80'}`}
                                >
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${sc.badgeColor} font-sans-custom`}>
                                            {sc.title}
                                        </span>
                                        <span className="text-xs font-semibold text-stone-400 font-sans-custom">{sc.level}</span>
                                    </div>

                                    {/* Japanese Characters */}
                                    <div className="mb-3">
                                        <h3 className="text-2xl font-japanese font-bold text-stone-950 group-hover:text-[#BC002D] transition-colors">
                                            {sc.japanese}
                                        </h3>
                                        <p className="text-xs font-semibold uppercase text-stone-400 tracking-wider mt-0.5 font-sans-custom">[{sc.romaji}]</p>
                                    </div>

                                    <p className="text-stone-500 text-xs md:text-sm leading-relaxed mt-2 font-sans-custom">
                                        {sc.desc}
                                    </p>

                                    {/* Arrow Link simulation */}
                                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-400 group-hover:text-stone-700 transition-colors font-sans-custom">
                                        <span className={selectedScenarioKey === sc.title ? 'text-[#BC002D]' : ''}>
                                            {selectedScenarioKey === sc.title ? 'Currently Showcasing' : 'Preview Flashcard'}
                                        </span>
                                        <span className="group-hover:translate-x-1 transition-transform">➔</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SM-2 SPACED REPETITION SECTION --- */}
                <section id="sm2-method" className="py-24 max-w-7xl mx-auto px-6 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        
                        {/* SM-2 Content */}
                        <div className="lg:col-span-6 space-y-6 text-left">
                            <span className="text-xs uppercase tracking-widest font-bold text-[#BC002D] font-sans-custom">Cognitive Learning Science</span>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 font-japanese">
                                The SM-2 Spaced Repetition System
                            </h2>
                            <p className="text-stone-600 text-sm md:text-base leading-relaxed font-sans-custom">
                                Spaced repetition is a scientifically proven cognitive method that scales your study reviews based on how easily you recall facts. Instead of cramming, you review cards right before you're about to forget them.
                            </p>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#BC002D]/10 flex items-center justify-center font-bold text-sm text-[#BC002D] font-sans-custom">1</div>
                                    <div>
                                        <h4 className="font-semibold text-stone-900 font-sans-custom">Easiness Factor (EF)</h4>
                                        <p className="text-xs text-stone-500 mt-0.5 font-sans-custom">Every card has a difficulty coefficient (starts at 2.50). The easier you recall, the higher the coefficient grows; the harder it is, the lower it shrinks.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#BC002D]/10 flex items-center justify-center font-bold text-sm text-[#BC002D] font-sans-custom">2</div>
                                    <div>
                                        <h4 className="font-semibold text-stone-900 font-sans-custom">Adaptive Intervals</h4>
                                        <p className="text-xs text-stone-500 mt-0.5 font-sans-custom">Subsequent intervals multiply exponentially (Interval = Previous Interval × EF). A card rated "Easy" multiplies rapidly, while "Again" resets review tomorrow.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SM-2 Visual Timeline simulation */}
                        <div className="lg:col-span-6 bg-white border border-stone-200/80 rounded-3xl p-8 shadow-sm">
                            <h3 className="font-bold text-lg text-stone-955 mb-6 flex items-center gap-2 font-sans-custom text-left">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                Simulated Learning Interval Expansion
                            </h3>

                            {/* Spaced repetition timeline graphics */}
                            <div className="relative space-y-6 pl-4 border-l border-stone-200/80 text-left">
                                
                                {/* Session 1 */}
                                <div className="relative">
                                    <span className="absolute left-[-21px] top-[4px] h-2.5 w-2.5 rounded-full bg-[#BC002D]" />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xs font-bold text-stone-900 uppercase font-sans-custom">First Review Session</h4>
                                            <p className="text-[11px] text-stone-500 mt-0.5 font-sans-custom">Studied card "弊社" (Our company).</p>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-sans-custom">Rating: Hard</span>
                                    </div>
                                    <div className="text-[10px] text-[#BC002D] font-semibold mt-1 font-sans-custom font-semibold">Next review: 1 Day</div>
                                </div>

                                {/* Session 2 */}
                                <div className="relative">
                                    <span className="absolute left-[-21px] top-[4px] h-2.5 w-2.5 rounded-full bg-[#BC002D]" />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xs font-bold text-stone-900 uppercase font-sans-custom">Second Review (1 Day Later)</h4>
                                            <p className="text-[11px] text-stone-500 mt-0.5 font-sans-custom">Recalled with moderate difficulty.</p>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-sans-custom">Rating: Good</span>
                                    </div>
                                    <div className="text-[10px] text-emerald-600 font-semibold mt-1 font-sans-custom font-semibold">Interval expanded: 3 Days (Interval x2.5)</div>
                                </div>

                                {/* Session 3 */}
                                <div className="relative">
                                    <span className="absolute left-[-21px] top-[4px] h-2.5 w-2.5 rounded-full bg-[#BC002D]" />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xs font-bold text-stone-900 uppercase font-sans-custom">Third Review (3 Days Later)</h4>
                                            <p className="text-[11px] text-stone-500 mt-0.5 font-sans-custom">Fast recall with excellent accuracy.</p>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 font-sans-custom">Rating: Easy</span>
                                    </div>
                                    <div className="text-[10px] text-blue-600 font-semibold mt-1 font-sans-custom font-semibold">Interval boosted: 10 Days (Interval x2.6 + 0.1 bonus)</div>
                                </div>

                                {/* Session 4 */}
                                <div className="relative">
                                    <span className="absolute left-[-21px] top-[4px] h-2.5 w-2.5 rounded-full bg-stone-300" />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xs font-bold text-stone-400 uppercase font-sans-custom">Fourth Review (10 Days Later)</h4>
                                            <p className="text-[11px] text-stone-400 mt-0.5 font-sans-custom">Long term memory solidified.</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/60 font-sans-custom">Upcoming</span>
                                    </div>
                                    <div className="text-[10px] text-stone-400 mt-1 font-sans-custom">Interval stretches to: 28 Days</div>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

                {/* --- FEATURES GRID SECTION --- */}
                <section id="features" className="bg-stone-900 text-white py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800 via-stone-950 to-stone-950 pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        
                        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                            <span className="text-xs uppercase tracking-widest font-bold text-red-400 font-sans-custom">Packed with Utility</span>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 font-japanese">
                                Engineered for Deep Learning
                            </h2>
                            <p className="text-stone-400 text-sm md:text-base font-sans-custom">
                                Tobira packages powerful web utilities in an elegant Single Page Application, ensuring a seamless user experience for language students and administrators.
                            </p>
                        </div>

                        {/* Feature Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            
                            {/* Feature 1 */}
                            <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-7 flex gap-4">
                                <div className="p-3 bg-[#BC002D]/10 text-[#BC002D] rounded-xl h-fit border border-[#BC002D]/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                    </svg>
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="font-semibold text-lg text-stone-100 font-sans-custom">Pronunciation Audio Playback</h3>
                                    <p className="text-sm text-stone-400 leading-relaxed font-sans-custom">
                                        Listen to high-quality native audio recordings attached to individual cards. Practice Pitch Accent and perfect your formal delivery before presenting to bosses or partners.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-7 flex gap-4">
                                <div className="p-3 bg-[#BC002D]/10 text-[#BC002D] rounded-xl h-fit border border-[#BC002D]/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                                    </svg>
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="font-semibold text-lg text-stone-100 font-sans-custom">Student Progress Heatmap</h3>
                                    <p className="text-sm text-stone-400 leading-relaxed font-sans-custom">
                                        Track your study activity with a Github-style 30-day heatmap calendar, streak counters, cards mastered counts, and overall deck completeness indicators.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-7 flex gap-4">
                                <div className="p-3 bg-[#BC002D]/10 text-[#BC002D] rounded-xl h-fit border border-[#BC002D]/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="font-semibold text-lg text-stone-100 font-sans-custom">CSV and JSON Deck Portability</h3>
                                    <p className="text-sm text-stone-400 leading-relaxed font-sans-custom">
                                        Upload custom vocabulary spreadsheets (CSV/JSON format) to create personal private decks instantly. Validate input patterns and characters dynamically on the server side.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-7 flex gap-4">
                                <div className="p-3 bg-[#BC002D]/10 text-[#BC002D] rounded-xl h-fit border border-[#BC002D]/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="font-semibold text-lg text-stone-100 font-sans-custom">Role-Based Workspaces</h3>
                                    <p className="text-sm text-stone-400 leading-relaxed font-sans-custom">
                                        Tailored workspaces for Admin and Student. Admins handle user moderation, deck uploads, and global site stats, while students focus entirely on reviewing and dashboard analytics.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* --- CONTACT US SECTION --- */}
                <section id="contact-us" className="py-24 relative bg-[#FAF9F6] border-t border-stone-200/60">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                            <span className="text-xs uppercase tracking-widest font-bold text-[#BC002D] font-sans-custom">Get In Touch</span>
                            <h2 className="text-3xl md:text-4xl font-bold font-japanese tracking-tight text-stone-900">
                                Contact & Feedback
                            </h2>
                            <p className="text-stone-500 text-sm md:text-base font-sans-custom">
                                Have questions about the Spaced Repetition engine or want to reach the developer? Drop a message below.
                            </p>
                        </div>

                        <div className="max-w-xl mx-auto">
                            {submitSuccess ? (
                                /* Success Animation Screen */
                                <div className="glass-panel rounded-3xl p-8 text-center space-y-6 shadow-xl border border-stone-200/60 animate-fade-in-up">
                                    <div className="flex justify-center">
                                        <div className="relative h-20 w-20 rounded-full bg-emerald-50 border-4 border-emerald-500/25 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 text-emerald-500 success-checkmark-svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-japanese font-bold text-stone-900">ご意見ありがとうございます！</h3>
                                        <p className="text-stone-500 text-sm font-sans-custom">Thank you for your message. We have successfully received it.</p>
                                    </div>

                                    <div className="bg-white/80 rounded-2xl p-5 border border-stone-200 text-left space-y-2.5 text-xs text-stone-600 font-sans-custom max-w-sm mx-auto shadow-inner">
                                        <div><span className="font-bold text-stone-800">From:</span> {submittedData.name} ({submittedData.email})</div>
                                        <div><span className="font-bold text-stone-800">Subject:</span> {submittedData.subject}</div>
                                        <div className="border-t border-stone-150 pt-2"><span className="font-bold text-stone-800">Message:</span> "{submittedData.message}"</div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setSubmitSuccess(false);
                                            setContactName('');
                                            setContactEmail('');
                                            setContactSubject('');
                                            setContactMessage('');
                                            setContactErrors({});
                                        }}
                                        className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] active:scale-95 transition-all shadow-md shadow-[#BC002D]/15 font-sans-custom animate-pulse"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                /* Interactive Contact Form */
                                <form onSubmit={handleContactSubmit} className="glass-panel rounded-3xl p-8 md:p-10 shadow-xl border border-stone-200/60 space-y-6 text-left">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        
                                        {/* Name Field */}
                                        <div className="space-y-1.5 relative">
                                            <label className="text-xs uppercase font-bold tracking-wider text-stone-500 font-sans-custom">Your Name</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={contactName}
                                                    onChange={(e) => {
                                                        setContactName(e.target.value);
                                                        if(contactErrors.name) validateField('name', e.target.value);
                                                    }}
                                                    onBlur={(e) => validateField('name', e.target.value)}
                                                    className={`w-full px-4 py-3 rounded-xl text-sm font-sans-custom glass-input pr-10 ${contactErrors.name ? 'border-red-500/50 focus:border-red-500 ring-4 ring-red-500/5' : ''}`}
                                                    placeholder="Kenji Sato"
                                                />
                                                {contactName.length >= 2 && !contactErrors.name && (
                                                    <svg className="w-5 h-5 text-emerald-505 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            {contactErrors.name && (
                                                <p className="text-[10px] font-semibold text-red-500 mt-1 absolute left-1 font-sans-custom">{contactErrors.name}</p>
                                            )}
                                        </div>

                                        {/* Email Field */}
                                        <div className="space-y-1.5 relative">
                                            <label className="text-xs uppercase font-bold tracking-wider text-stone-500 font-sans-custom">Email Address</label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={contactEmail}
                                                    onChange={(e) => {
                                                        setContactEmail(e.target.value);
                                                        if(contactErrors.email) validateField('email', e.target.value);
                                                    }}
                                                    onBlur={(e) => validateField('email', e.target.value)}
                                                    className={`w-full px-4 py-3 rounded-xl text-sm font-sans-custom glass-input pr-10 ${contactErrors.email ? 'border-red-500/50 focus:border-red-500 ring-4 ring-red-500/5' : ''}`}
                                                    placeholder="kenji@company.jp"
                                                />
                                                {contactEmail.length > 0 && !contactErrors.email && (
                                                    <svg className="w-5 h-5 text-emerald-505 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            {contactErrors.email && (
                                                <p className="text-[10px] font-semibold text-red-500 mt-1 absolute left-1 font-sans-custom">{contactErrors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Subject Field */}
                                    <div className="space-y-1.5 relative pt-1">
                                        <label className="text-xs uppercase font-bold tracking-wider text-stone-500 font-sans-custom">Subject</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={contactSubject}
                                                onChange={(e) => {
                                                    setContactSubject(e.target.value);
                                                    if(contactErrors.subject) validateField('subject', e.target.value);
                                                }}
                                                onBlur={(e) => validateField('subject', e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl text-sm font-sans-custom glass-input pr-10 ${contactErrors.subject ? 'border-red-500/50 focus:border-red-500 ring-4 ring-red-500/5' : ''}`}
                                                placeholder="Feedback on SM-2 algorithm scheduler"
                                            />
                                            {contactSubject.length >= 3 && !contactErrors.subject && (
                                                <svg className="w-5 h-5 text-emerald-505 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        {contactErrors.subject && (
                                            <p className="text-[10px] font-semibold text-red-500 mt-1 absolute left-1 font-sans-custom">{contactErrors.subject}</p>
                                        )}
                                    </div>

                                    {/* Message Field */}
                                    <div className="space-y-1.5 relative pt-1">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs uppercase font-bold tracking-wider text-stone-500 font-sans-custom">Message Content</label>
                                            <span className="text-[10px] font-semibold text-stone-400 font-sans-custom">{contactMessage.length} / 500 chars</span>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                value={contactMessage}
                                                onChange={(e) => {
                                                    if(e.target.value.length <= 500) {
                                                        setContactMessage(e.target.value);
                                                        if(contactErrors.message) validateField('message', e.target.value);
                                                    }
                                                }}
                                                onBlur={(e) => validateField('message', e.target.value)}
                                                rows={4}
                                                className={`w-full px-4 py-3 rounded-xl text-sm font-sans-custom glass-input pr-10 resize-none ${contactErrors.message ? 'border-red-500/50 focus:border-red-500 ring-4 ring-red-500/5' : ''}`}
                                                placeholder="Write your comments here..."
                                            />
                                            {contactMessage.length >= 10 && !contactErrors.message && (
                                                <svg className="w-5 h-5 text-emerald-505 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        {contactErrors.message && (
                                            <p className="text-[10px] font-semibold text-red-500 mt-1 absolute left-1 font-sans-custom">{contactErrors.message}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 active:scale-[0.98] font-sans-custom ${isSubmitting ? 'bg-[#BC002D]/75 text-white pointer-events-none' : 'bg-[#BC002D] text-white hover:bg-[#A30026] shadow-md shadow-[#BC002D]/15 hover:shadow-lg'}`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    Send Feedback
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </section>

                {/* --- CALL TO ACTION --- */}
                <section className="py-24 relative max-w-4xl mx-auto px-6 text-center space-y-8">
                    <div className="bg-[#BC002D]/5 rounded-3xl p-10 border border-[#BC002D]/15 space-y-6">
                        <h2 className="text-3xl font-bold font-japanese tracking-tight text-stone-900">
                            Ready to Master Japanese Corporate Language?
                        </h2>
                        <p className="text-stone-600 max-w-lg mx-auto text-sm md:text-base font-sans-custom">
                            Start daily flashcard sessions today. Overcome the forgetting curve, understand Sonkeigo/Kenjōgo contexts, and speak like a business professional.
                        </p>
                        
                        <div className="flex justify-center pt-2">
                            <Link
                                to={user ? '/dashboard' : '/register'}
                                className="px-8 py-4 rounded-xl text-base font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all shadow-md shadow-[#BC002D]/15 hover:shadow-lg active:scale-[0.98] font-sans-custom"
                            >
                                {user ? 'Go to Dashboard' : 'Create Free Account'}
                            </Link>
                        </div>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="bg-[#F2EFFB]/30 border-t border-stone-200/60 py-12 text-center text-xs text-stone-500 space-y-4 font-sans-custom">
                    <div className="flex items-center justify-center gap-3">
                        <img src="/tobira-logo.png" alt="Tobira Logo" className="h-6 w-6 object-contain rounded-full opacity-60" />
                        <span className="font-japanese font-semibold tracking-wider text-stone-600">とびら · TOBIRA</span>
                    </div>
                    <p className="max-w-md mx-auto">
                        Developed by N.M. Amarasinghe as a Business Japanese Spaced Repetition Learning Platform.
                    </p>
                    <div className="pt-2 flex justify-center gap-4 text-[10px] text-stone-400 font-sans-custom">
                        <span>Laravel 13</span>
                        <span>•</span>
                        <span>React 18</span>
                        <span>•</span>
                        <span>MySQL 8.0</span>
                    </div>
                    <p className="text-[10px] text-stone-400/80 font-sans-custom">
                        &copy; 2026 Tobira Project. All rights reserved.
                    </p>
                </footer>

            </div>
        </>
    );
}
