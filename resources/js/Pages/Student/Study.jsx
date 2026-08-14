import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import FlashCard from '../../Components/Study/FlashCard';
import ProgressBar from '../../Components/Study/ProgressBar';
import ScenarioBadge from '../../Components/Study/ScenarioBadge';
import RatingButtons from '../../Components/Study/RatingButtons';
import HankoStamp from '../../Components/Study/HankoStamp';

export default function Study() {
    const [searchParams] = useSearchParams();
    const deckId = searchParams.get('deck_id');
    const navigate = useNavigate();

    const [cards, setCards] = useState([]);
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [totalStudied, setTotalStudied] = useState(0);
    const [deckInfo, setDeckInfo] = useState(null);

    useEffect(() => {
        document.title = 'Study - Tobira';
        setLoading(true);

        const dueRequest = api.get('/reviews/due', { params: deckId ? { deck_id: deckId } : {} });
        const deckRequest = deckId ? api.get(`/decks/${deckId}`) : Promise.resolve(null);

        Promise.all([dueRequest, deckRequest])
            .then(([dueRes, deckRes]) => {
                setCards(dueRes.data);
                if (deckRes) setDeckInfo(deckRes.data);
            })
            .catch(() => setError('Could not load cards to study.'))
            .finally(() => setLoading(false));
    }, [deckId]);

    const currentCard = cards[index];
    const isDone = !loading && cards.length > 0 && index >= cards.length;
    const isEmpty = !loading && cards.length === 0;

    async function handleRate(rating) {
        if (!currentCard || submitting) return;
        setSubmitting(true);
        try {
            await api.post('/reviews', { card_id: currentCard.id, rating });
            setTotalStudied((n) => n + 1);
            setFlipped(false);
            if (currentCard.deck && !deckInfo) setDeckInfo(currentCard.deck);
            setIndex((i) => i + 1);
        } catch {
            setError('Could not save your rating. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    const effectiveDeck = deckInfo || currentCard?.deck || null;
    const isJobInterviewDeck = effectiveDeck?.scenario_tag === 'Job Interview';

    const practiceInterviewButton = isJobInterviewDeck && (
        <Link
            to={`/interview${effectiveDeck?.id ? `?deck_id=${effectiveDeck.id}` : ''}`}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-all"
        >
            Practice a Live Interview →
        </Link>
    );

    return (
        <div className="min-h-screen washi-bg flex flex-col">
            <header className="border-b border-stone-200/60 bg-white/70 backdrop-blur-md">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/dashboard" className="text-sm font-semibold text-stone-500 hover:text-stone-900">
                        ← Exit Session
                    </Link>
                    {currentCard && (
                        <ScenarioBadge scenario={currentCard.deck?.scenario_tag} jlptLevel={null} />
                    )}
                </div>
            </header>

            <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 flex flex-col gap-8">
                {loading && <p className="text-center text-stone-500 text-sm">Loading your cards…</p>}
                {error && <p className="text-center text-red-600 text-sm">{error}</p>}

                {isEmpty && (
                    <div className="text-center py-16 space-y-4">
                        <div className="flex justify-center">
                            <HankoStamp stamped kanji="済" size={72} />
                        </div>
                        <h2 className="text-xl font-semibold text-stone-800">Nothing due right now</h2>
                        <p className="text-sm text-stone-500 max-w-sm mx-auto">
                            You're all caught up on this deck. Come back later, or practice what you've already learned.
                        </p>
                        <div className="flex flex-col items-center gap-3 mt-4">
                            {practiceInterviewButton}
                            <Link
                                to="/dashboard"
                                className="px-6 py-3 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                )}

                {isDone && (
                    <div className="text-center py-16 space-y-4">
                        <div className="flex justify-center">
                            <HankoStamp stamped kanji="完" size={72} />
                        </div>
                        <h2 className="text-xl font-semibold text-stone-800">Session complete</h2>
                        <p className="text-sm text-stone-500">You reviewed {totalStudied} card{totalStudied !== 1 ? 's' : ''} this session.</p>

                        <div className="flex flex-col items-center gap-3 mt-4">
                            {practiceInterviewButton}
                            <Link
                                to="/dashboard"
                                className="px-6 py-3 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                )}

                {currentCard && !isDone && (
                    <>
                        <ProgressBar current={index} total={cards.length} />

                        <FlashCard
                            card={currentCard}
                            flipped={flipped}
                            onFlip={() => setFlipped((f) => !f)}
                        />

                        <div className="max-w-lg w-full mx-auto">
                            {flipped ? (
                                <RatingButtons onRate={handleRate} disabled={submitting} />
                            ) : (
                                <p className="text-center text-sm text-stone-400">
                                    Flip the card to reveal the answer and rate your recall.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
