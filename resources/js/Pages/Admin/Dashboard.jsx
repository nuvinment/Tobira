import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import HankoStamp from '../../Components/Study/HankoStamp';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [decks, setDecks] = useState([]);
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = 'Admin Dashboard - Tobira';

        Promise.all([api.get('/decks'), api.get('/admin/overview')])
            .then(([decksRes, overviewRes]) => {
                setDecks(decksRes.data.data ?? decksRes.data);
                setOverview(overviewRes.data);
            })
            .catch(() => setError('Could not load dashboard data.'))
            .finally(() => setLoading(false));
    }, []);

    async function handleLogout() {
        await logout();
        navigate('/');
    }

    return (
        <div className="min-h-screen washi-bg">
            <header className="obi-band">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <HankoStamp stamped kanji="管" size={44} />
                        <div>
                            <Link to="/" className="font-bold text-white block leading-tight">Tobira</Link>
                            <span className="text-[11px] text-white/60 uppercase tracking-wider">Administration</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <Link to="/admin/decks" className="text-white/70 hover:text-white font-medium">Manage Decks</Link>
                        <Link to="/admin/users" className="text-white/70 hover:text-white font-medium">Manage Users</Link>
                        <Link to="/admin/analytics" className="text-white/70 hover:text-white font-medium">Analytics</Link>
                        <span className="text-white/60">{user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg font-semibold text-white/80 hover:bg-white/10 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
                <h1 className="text-2xl font-bold text-stone-900">Overview</h1>

                {loading && <p className="text-stone-500 text-sm">Loading…</p>}
                {error && <p className="text-red-600 text-sm">{error}</p>}

                {overview && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <LedgerCard label="Total Users" value={overview.total_users} sub={`${overview.total_students} students · ${overview.total_admins} admins`} />
                        <LedgerCard label="Total Decks" value={overview.total_decks} />
                        <LedgerCard label="Total Cards" value={overview.total_cards} />
                        <LedgerCard label="Reviews Today" value={overview.reviews_today} sub={`${overview.active_today} active students`} />
                    </div>
                )}

                <div className="flex gap-3">
                    <Link
                        to="/admin/users"
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-all"
                    >
                        Manage Users →
                    </Link>
                    <Link
                        to="/admin/analytics"
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-all"
                    >
                        View Analytics →
                    </Link>
                </div>

                <section>
                    <h2 className="text-lg font-bold text-stone-900 mb-4">All Decks ({decks.length})</h2>
                    <div className="bg-white border border-stone-200/70 rounded-2xl divide-y divide-stone-100">
                        {decks.map((deck) => (
                            <div key={deck.id} className="p-4 flex items-center justify-between hover:bg-stone-50/60 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="w-1 h-8 rounded-full bg-[#BC002D]" />
                                    <div>
                                        <div className="font-semibold text-stone-900">{deck.title}</div>
                                        <div className="text-xs text-stone-500">
                                            {deck.scenario_tag || 'General'} · {deck.jlpt_level || '—'} · {deck.cards_count ?? 0} cards
                                            {deck.owner?.name && <> · by {deck.owner.name}</>}
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${deck.is_public ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                                    {deck.is_public ? 'Public' : 'Private'}
                                </span>
                            </div>
                        ))}
                        {!loading && decks.length === 0 && (
                            <div className="p-4 text-sm text-stone-500">No decks created yet.</div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

function LedgerCard({ label, value, sub }) {
    return (
        <div className="bg-white border border-stone-200/70 rounded-xl p-5 shadow-sm border-l-4 border-l-[#29465B]">
            <div className="text-2xl font-bold text-stone-900">{value}</div>
            <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mt-1">{label}</div>
            {sub && <div className="text-xs text-stone-400 mt-1">{sub}</div>}
        </div>
    );
}
