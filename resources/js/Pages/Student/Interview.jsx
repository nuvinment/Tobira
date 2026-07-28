import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';

export default function Interview() {
    const [searchParams] = useSearchParams();
    const deckId = searchParams.get('deck_id');

    const [messages, setMessages] = useState([]); // { role: 'user' | 'model', text }
    const [textInput, setTextInput] = useState('');
    const [listening, setListening] = useState(false);
    const [thinking, setThinking] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(true);
    const [error, setError] = useState('');
    const [started, setStarted] = useState(false);

    const recognitionRef = useRef(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        document.title = 'AI Interview Practice — Tobira';

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSpeechSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setTextInput(transcript);
            setListening(false);
        };
        recognition.onerror = () => setListening(false);
        recognition.onend = () => setListening(false);

        recognitionRef.current = recognition;
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, thinking]);

    function speak(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        const voices = window.speechSynthesis.getVoices();
        const jaVoice = voices.find((v) => v.lang === 'ja-JP');
        if (jaVoice) utterance.voice = jaVoice;
        window.speechSynthesis.speak(utterance);
    }

    async function sendMessage(text) {
        const trimmed = text.trim();
        if (!trimmed || thinking) return;

        const newHistory = [...messages, { role: 'user', text: trimmed }];
        setMessages(newHistory);
        setTextInput('');
        setThinking(true);
        setError('');

        try {
            const { data } = await api.post('/interview/respond', {
                message: trimmed,
                history: messages,
                deck_id: deckId || undefined,
            });
            setMessages([...newHistory, { role: 'model', text: data.reply }]);
            speak(data.reply);
        } catch (err) {
            setError(err.response?.data?.message || 'The interviewer is unavailable right now.');
        } finally {
            setThinking(false);
        }
    }

    function startInterview() {
        setStarted(true);
        sendMessage('面接を始めてください。');
    }

    function toggleListening() {
        if (!recognitionRef.current) return;
        if (listening) {
            recognitionRef.current.stop();
            setListening(false);
        } else {
            setTextInput('');
            recognitionRef.current.start();
            setListening(true);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        sendMessage(textInput);
    }

    return (
        <div className="min-h-screen washi-bg flex flex-col">
            <header className="border-b border-stone-200/60 bg-white/70 backdrop-blur-md">
                <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/dashboard" className="text-sm font-semibold text-stone-500 hover:text-stone-900">
                        ← Exit Interview
                    </Link>
                    <span className="text-sm font-semibold text-stone-700">AI Interview Practice</span>
                </div>
            </header>

            <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-8 flex flex-col">
                {!speechSupported && (
                    <div className="mb-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        Voice input isn't supported in this browser. Try Chrome or Edge for microphone support — you can still type your answers below.
                    </div>
                )}

                {!started && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                        <div className="text-4xl font-japanese text-[#BC002D]">面接練習</div>
                        <h1 className="text-xl font-bold text-stone-900">Ready for your mock interview?</h1>
                        <p className="text-sm text-stone-500 max-w-sm">
                            The AI interviewer will ask you questions in Japanese, one at a time. Answer by speaking (microphone) or typing — entirely in Japanese.
                        </p>
                        <button
                            onClick={startInterview}
                            className="mt-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all"
                        >
                            Start Interview →
                        </button>
                    </div>
                )}

                {started && (
                    <>
                        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-japanese leading-relaxed ${
                                            m.role === 'user'
                                                ? 'bg-[#BC002D] text-white rounded-br-sm'
                                                : 'bg-white border border-stone-200 text-stone-800 rounded-bl-sm'
                                        }`}
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {thinking && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-stone-200 text-stone-400 text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm">
                                        面接官が入力しています…
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

                        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2 border-t border-stone-200">
                            <button
                                type="button"
                                onClick={toggleListening}
                                disabled={!speechSupported || thinking}
                                title={speechSupported ? 'Speak your answer' : 'Voice input not supported'}
                                className={`w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${
                                    listening ? 'bg-[#BC002D] text-white animate-pulse' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                } disabled:opacity-40`}
                            >
                                <MicIcon />
                            </button>
                            <input
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="日本語で答えてください…"
                                className="flex-1 px-4 py-2.5 border border-stone-200 rounded-full text-sm font-japanese focus:outline-none focus:border-[#BC002D]"
                            />
                            <button
                                type="submit"
                                disabled={thinking || !textInput.trim()}
                                className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all disabled:opacity-40"
                            >
                                Send
                            </button>
                        </form>
                    </>
                )}
            </main>
        </div>
    );
}

function MicIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
    );
}
