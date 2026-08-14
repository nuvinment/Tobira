import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import HankoStamp from '../../Components/Study/HankoStamp';

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function buildQuestions(cards) {
    const allAnswers = cards.map((c) => c.back_text);

    return shuffle(cards).map((card) => {
        const distractorPool = allAnswers.filter((a) => a !== card.back_text);
        const distractors = shuffle([...new Set(distractorPool)]).slice(0, 3);
        const options = shuffle([card.back_text, ...distractors]);

        return { card, options, correctAnswer: card.back_text };
    });
}

export default function Quiz() {
    const [searchParams] = useSearchParams();
    const deckId = searchParams.get('deck_id');

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);

    useEffect(() => {
        document.title = 'Quiz - Tobira';
        setLoading(true);
        api.get('/quiz/cards', { params: deckId ? { deck_id: deckId } : {} })
            .then((res) => {
                setCards(res.data);
                setQuestions(buildQuestions(res.data));
            })
            .catch(() => setError('Could not load quiz cards.'))
            .finally(() => setLoading(false));
    }, [deckId]);

    const current = questions[index];
    const isDone = questions.length > 0 && index >= questions.length;
    const tooFewCards = !loading && cards.length < 2;
    const passed = isDone && score / questions.length >= 0.7;

    function handleSelect(option) {
        if (answered) return;
        setSelected(option);
        setAnswered(true);
        if (option === current.correctAnswer) setScore((s) => s + 1);
    }

    function handleNext() {
        setSelected(null);
        setAnswered(false);
        setIndex((i) => i + 1);
    }

    function handleRetry() {
        setQuestions(buildQuestions(cards));
        setIndex(0);
        setScore(0);
        setSelected(null);
        setAnswered(false);
    }

    const scenario = current?.card?.deck?.scenario_tag;

    return (
        <div className="min-h-screen washi-bg flex flex-col">
            <header className="border-b border-stone-200/60 bg-white/70 backdrop-blur-md">
                <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/dashboard" className="text-sm font-semibold text-stone-500 hover:text-stone-900">
                        ← Exit Quiz
                    </Link>
                    {scenario && (
                        <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-[#FCE8EC] text-[#BC002D]">
                            {scenario}
                        </span>
                    )}
                </div>
            </header>

            <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-10 flex flex-col gap-8">
                {loading && <p className="text-center text-stone-500 text-sm">Loading quiz…</p>}
                {error && <p className="text-center text-red-600 text-sm">{error}</p>}

                {tooFewCards && (
                    <div className="text-center py-16 space-y-4">
                        <div className="flex justify-center">
                            <HankoStamp stamped={false} kanji="?" size={72} />
                        </div>
                        <h2 className="text-xl font-semibold text-stone-800">Not enough completed cards yet</h2>
                        <p className="text-sm text-stone-500 max-w-sm mx-auto">
                            Study at least 2 cards in this deck first, then come back to test yourself.
                        </p>
                        <Link
                            to="/study"
                            className="inline-block mt-4 px-6 py-3 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all"
                        >
                            Go Study
                        </Link>
                    </div>
                )}

                {isDone && (
                    <div className="text-center py-16 space-y-4">
                        <div className="flex justify-center">
                            <HankoStamp stamped={passed} kanji={passed ? '合' : '否'} size={88} />
                        </div>
                        <h2 className="text-xl font-semibold text-stone-800">Quiz complete</h2>
                        <p className="text-3xl font-bold text-stone-900">{score} / {questions.length}</p>
                        <p className="text-sm text-stone-500">
                            {Math.round((score / questions.length) * 100)}% correct
                            {passed ? ' — passing mark reached' : ' — 70% needed to pass'}
                        </p>
                        <div className="flex justify-center gap-3 mt-4">
                            <button
                                onClick={handleRetry}
                                className="px-6 py-3 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-all"
                            >
                                Retry Quiz
                            </button>
                            <Link
                                to="/dashboard"
                                className="px-6 py-3 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                )}

                {current && !isDone && (
                    <>
                        <div className="text-xs text-stone-400 text-center">
                            Question {index + 1} of {questions.length} · Score: {score}
                        </div>

                        <div className="bg-white border border-stone-200/70 rounded-2xl p-10 text-center">
                            <div className="font-japanese text-4xl font-medium text-stone-900">{current.card.front_text}</div>
                            {current.card.furigana && (
                                <div className="font-japanese text-sm text-stone-400 mt-2">{current.card.furigana}</div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {current.options.map((option) => {
                                let style = 'bg-white border-stone-200 text-stone-800 hover:border-stone-400';
                                if (answered && option === current.correctAnswer) {
                                    style = 'bg-emerald-50 border-emerald-400 text-emerald-800';
                                } else if (answered && option === selected) {
                                    style = 'bg-red-50 border-red-400 text-red-700';
                                }

                                return (
                                    <button
                                        key={option}
                                        onClick={() => handleSelect(option)}
                                        disabled={answered}
                                        className={`text-left px-5 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${style}`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>

                        {answered && (
                            <button
                                onClick={handleNext}
                                className="px-6 py-3 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all self-center"
                            >
                                {index + 1 < questions.length ? 'Next Question →' : 'See Results →'}
                            </button>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
