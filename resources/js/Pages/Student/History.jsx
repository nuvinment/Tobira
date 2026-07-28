import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function History() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = 'Review History — Tobira';

        api.get('/reviews/history')
            .then((res) => setHistory(res.data))
            .catch(() => setError('Could not load your review history.'))
            .finally(() => setLoading(false));
    }, []);

    async function handleLogout() {
        await logout();
        navigate('/');
    }

    const totalCards = history.reduce((sum, h) => sum + h.cards_reviewed, 0);
    const totalSessions = history.length;

    return (
        <div className="min-h-screen washi-bg">
            <header className="border-b border-stone-200/60 bg-white/70 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="font-bold text-stone-900">Tobira <span className="text-[#BC002D] font-japanese text-sm">扉</span></Link>
                    <div className="flex items-center gap-4 text-sm">
                        <Link to="/dashboard" className="text-stone-500 hover:text-stone-900 font-medium">Dashboard</Link>
                        <span className="text-stone-500">{user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
                <div className="kakejiku-rule inline-block text-[10px] text-stone-400 font-japanese mb-2">
                    学習記録
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">Your Review History</h1>
                    <p className="text-sm text-stone-500 mt-1">
                        {totalSessions} session{totalSessions !== 1 ? 's' : ''} · {totalCards} card{totalCards !== 1 ? 's' : ''} reviewed in total
                    </p>
                </div>

                {loading && <p className="text-stone-500 text-sm">Loading…</p>}
                {error && <p className="text-red-600 text-sm">{error}</p>}

                {!loading && history.length === 0 && (
                    <div className="bg-white border border-stone-200/70 rounded-2xl p-8 text-center">
                        <p className="text-sm text-stone-500">You haven't reviewed any cards yet.</p>
                        <Link
                            to="/study"
                            className="inline-block mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all"
                        >
                            Start Studying →
                        </Link>
                    </div>
                )}

                {history.length > 0 && (
                    <div className="bg-white border border-stone-200/70 rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                                <tr>
                                    <th className="text-left px-4 py-3">Date</th>
                                    <th className="text-left px-4 py-3">Deck</th>
                                    <th className="text-right px-4 py-3">Cards Reviewed</th>
                                    <th className="text-right px-4 py-3">Average Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {history.map((h, i) => (
                                    <tr key={`${h.date}-${h.deck_id}-${i}`} className="hover:bg-stone-50/60 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <span className="w-1 h-6 rounded-full bg-[#BC002D]/70" />
                                                <span className="text-stone-700">{h.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-stone-900">{h.deck_title}</td>
                                        <td className="text-right px-4 py-3">{h.cards_reviewed}</td>
                                        <td className="text-right px-4 py-3">
                                            <RatingPill value={h.average_rating} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

function RatingPill({ value }) {
    let color = 'bg-stone-100 text-stone-500';
    if (value >= 2.5) color = 'bg-emerald-50 text-emerald-700';
    else if (value >= 1.5) color = 'bg-amber-50 text-amber-700';
    else color = 'bg-red-50 text-red-600';

    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>{value?.toFixed(2)}</span>;
}
