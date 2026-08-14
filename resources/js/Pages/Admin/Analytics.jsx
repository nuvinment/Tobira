import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import HankoStamp from '../../Components/Study/HankoStamp';

export default function Analytics() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dau, setDau] = useState([]);
    const [engagement, setEngagement] = useState([]);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = 'Analytics - Tobira';
        Promise.all([
            api.get('/admin/analytics/daily-active-users'),
            api.get('/admin/analytics/deck-engagement'),
            api.get('/admin/analytics/user-progress'),
        ])
            .then(([dauRes, engagementRes, progressRes]) => {
                setDau(dauRes.data);
                setEngagement(engagementRes.data);
                setProgress(progressRes.data);
            })
            .catch(() => setError('Could not load analytics.'))
            .finally(() => setLoading(false));
    }, []);

    async function handleLogout() {
        await logout();
        navigate('/');
    }

    const totalActiveToday = dau.length > 0 ? dau[dau.length - 1].active_users : 0;
    const maxDau = Math.max(1, ...dau.map((d) => d.active_users));

    return (
        <div className="min-h-screen washi-bg">
            <header className="obi-band">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <HankoStamp stamped kanji="管" size={40} />
                        <div>
                            <Link to="/" className="font-bold text-white block leading-tight">Tobira</Link>
                            <span className="text-[11px] text-white/60 uppercase tracking-wider">Analytics</span>
                        </div>
                    </div>
                    <nav className="flex items-center gap-6 text-sm">
                        <Link to="/admin/dashboard" className="text-white/70 hover:text-white">Dashboard</Link>
                        <Link to="/admin/decks" className="text-white/70 hover:text-white">Manage Decks</Link>
                        <span className="text-white/60">{user?.name}</span>
                        <button onClick={handleLogout} className="px-4 py-2 rounded-lg font-semibold text-white/80 hover:bg-white/10 transition-colors">
                            Log Out
                        </button>
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
                <h1 className="text-2xl font-bold text-stone-900">Platform Analytics</h1>

                {loading && <p className="text-stone-500 text-sm">Loading analytics…</p>}
                {error && <p className="text-red-600 text-sm">{error}</p>}

                {!loading && !error && (
                    <>
                        <section>
                            <div className="flex items-baseline justify-between mb-4">
                                <h2 className="text-lg font-bold text-stone-900">Daily Active Users</h2>
                                <span className="text-sm text-stone-500">Today: {totalActiveToday}</span>
                            </div>
                            <div className="bg-white border border-stone-200/70 rounded-2xl p-6 border-l-4 border-l-[#29465B]">
                                {dau.length === 0 ? (
                                    <p className="text-sm text-stone-500">No study activity recorded yet.</p>
                                ) : (
                                    <div className="flex items-end gap-1 h-32">
                                        {dau.map((d) => (
                                            <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                                <div
                                                    className="w-full bg-[#BC002D]/80 rounded-t hover:bg-[#BC002D] transition-colors"
                                                    style={{ height: `${(d.active_users / maxDau) * 100}%`, minHeight: d.active_users > 0 ? '4px' : '0' }}
                                                    title={`${d.date}: ${d.active_users} active`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-stone-400 mt-2">Last 30 days</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-stone-900 mb-4">Deck Engagement & Most-Failed Cards</h2>
                            <div className="space-y-4">
                                {engagement.map((deck) => (
                                    <div key={deck.deck_id} className="bg-white border border-stone-200/70 rounded-2xl p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-wide text-[#BC002D]">{deck.scenario_tag}</span>
                                                <h3 className="font-semibold text-stone-900">{deck.title}</h3>
                                            </div>
                                            <div className="flex gap-6 text-sm text-stone-500 text-right">
                                                <div>
                                                    <div className="font-bold text-stone-900">{deck.total_reviews}</div>
                                                    <div className="text-xs">reviews</div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-stone-900">{deck.average_rating ?? '—'}</div>
                                                    <div className="text-xs">avg rating</div>
                                                </div>
                                            </div>
                                        </div>
                                        {deck.most_failed_cards.length > 0 ? (
                                            <div className="border-t border-stone-100 pt-3">
                                                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Most Failed</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {deck.most_failed_cards.map((c) => (
                                                        <span key={c.card_id} className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-japanese">
                                                            {c.front_text} ({c.fail_count}×)
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-stone-400">No failed cards yet.</p>
                                        )}
                                    </div>
                                ))}
                                {engagement.length === 0 && <p className="text-sm text-stone-500">No decks yet.</p>}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-stone-900 mb-4">Student Progress Summary</h2>
                            <div className="bg-white border border-stone-200/70 rounded-2xl overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                                        <tr>
                                            <th className="text-left px-4 py-3">Student</th>
                                            <th className="text-right px-4 py-3">Streak</th>
                                            <th className="text-right px-4 py-3">Cards Reviewed</th>
                                            <th className="text-right px-4 py-3">Mastery %</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {progress.map((p) => (
                                            <tr key={p.user_id} className="hover:bg-stone-50/60 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-stone-900">{p.name}</div>
                                                    <div className="text-xs text-stone-400">{p.email}</div>
                                                </td>
                                                <td className="text-right px-4 py-3">{p.streak_days} days</td>
                                                <td className="text-right px-4 py-3">{p.total_cards_reviewed}</td>
                                                <td className="text-right px-4 py-3">{p.mastery_percentage}%</td>
                                            </tr>
                                        ))}
                                        {progress.length === 0 && (
                                            <tr><td colSpan={4} className="px-4 py-6 text-center text-stone-500">No students yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}
