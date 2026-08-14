import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import ActivityHeatmap from '../../Components/Study/ActivityHeatmap';
import HankoStamp from '../../Components/Study/HankoStamp';
import StreakChain from '../../Components/Study/StreakChain';

const SCENARIOS = ['Job Interview', 'Client Meetings', 'Email Etiquette', 'Telephone Calls', 'Office Daily Use'];
const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

export default function StudentDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [scenarioFilter, setScenarioFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');

    useEffect(() => {
        document.title = 'Dashboard - Tobira';

        api.get('/dashboard')
            .then((res) => setStats(res.data))
            .catch(() => setError('Could not load your dashboard. Please try refreshing.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const params = {};
        if (scenarioFilter) params.scenario_tag = scenarioFilter;
        if (levelFilter) params.jlpt_level = levelFilter;

        api.get('/decks', { params })
            .then((res) => setDecks(res.data.data ?? res.data))
            .catch(() => setError('Could not load decks.'));
    }, [scenarioFilter, levelFilter]);

    async function handleLogout() {
        await logout();
        navigate('/');
    }

    const activityByDate = Object.fromEntries((stats?.activity_heatmap || []).map((d) => [d.date, d.count]));
    const todayIso = new Date().toISOString().slice(0, 10);
    const studiedToday = (activityByDate[todayIso] || 0) > 0;

    return (
        <div className="min-h-screen washi-bg">
            <header className="border-b border-stone-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="font-bold text-stone-900">Tobira <span className="text-[#BC002D] font-japanese text-sm">扉</span></Link>
                    <div className="flex items-center gap-4 text-sm">
                        <Link to="/history" className="text-stone-500 hover:text-stone-900 font-medium">Review History</Link>
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

            {loading && <p className="text-stone-500 text-sm text-center py-10">Loading your progress…</p>}
            {error && <p className="text-red-600 text-sm text-center py-10">{error}</p>}

            {stats && (
                <>
                    {/* HERO: the day's seal, streak chain, and due-today stack */}
                    <section className="max-w-6xl mx-auto px-6 pt-10 pb-8">
                        <div className="flex gap-6">
                            <div className="hidden md:flex items-stretch">
                                <div className="kakejiku-rule text-[10px] text-stone-400 font-japanese py-2">
                                    本日の学習
                                </div>
                            </div>

                            <div className="flex-1 grid md:grid-cols-[auto_1fr_auto] gap-8 items-center">
                                {/* Hanko stamp: today's status */}
                                <div className="flex flex-col items-center gap-2">
                                    <HankoStamp stamped={studiedToday} />
                                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
                                        {studiedToday ? 'Stamped Today' : 'Not Yet Today'}
                                    </span>
                                </div>

                                {/* Greeting + streak chain */}
                                <div>
                                    <h1 className="text-2xl font-bold text-stone-900 mb-1">
                                        Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
                                    </h1>
                                    <p className="text-sm text-stone-500 mb-4">
                                        {stats.streak_days > 0
                                            ? `${stats.streak_days}-day streak — keep the chain going.`
                                            : "Start today's chain with one study session."}
                                    </p>
                                    <StreakChain activityByDate={activityByDate} />
                                </div>

                                {/* Due today: card stack motif + CTA */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative w-20 h-16">
                                        <div className="absolute inset-0 bg-white border border-stone-200 rounded-lg rotate-[-6deg] shadow-sm" />
                                        <div className="absolute inset-0 bg-white border border-stone-200 rounded-lg rotate-[3deg] shadow-sm" />
                                        <div className="absolute inset-0 bg-white border-2 border-[#BC002D] rounded-lg flex items-center justify-center">
                                            <span className="text-xl font-bold text-[#BC002D]">{stats.due_today}</span>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">Due Today</span>
                                    <Link
                                        to="/study"
                                        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all"
                                    >
                                        Study Now →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* OBI SASH: mastery + active decks, indigo band */}
                    <section className="obi-band">
                        <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 divide-x divide-white/15">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{stats.mastery_percentage}%</div>
                                <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold mt-1">Mastery</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{decks.length}</div>
                                <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold mt-1">Active Decks</div>
                            </div>
                        </div>
                    </section>

                    <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
                        <ActivityHeatmap data={stats.activity_heatmap} />

                        <section>
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                <h2 className="text-lg font-bold text-stone-900">Your Decks</h2>
                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={scenarioFilter}
                                        onChange={(e) => setScenarioFilter(e.target.value)}
                                        className="text-xs px-3 py-2 border border-stone-200 rounded-lg bg-white"
                                    >
                                        <option value="">All Scenarios</option>
                                        {SCENARIOS.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <select
                                        value={levelFilter}
                                        onChange={(e) => setLevelFilter(e.target.value)}
                                        className="text-xs px-3 py-2 border border-stone-200 rounded-lg bg-white"
                                    >
                                        <option value="">All Levels</option>
                                        {JLPT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                    {(scenarioFilter || levelFilter) && (
                                        <button
                                            onClick={() => { setScenarioFilter(''); setLevelFilter(''); }}
                                            className="text-xs px-3 py-2 text-stone-500 hover:text-stone-800"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            {!loading && decks.length === 0 && (
                                <p className="text-sm text-stone-500">No decks match these filters.</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {decks.map((deck) => (
                                    <div key={deck.id} className="postcard-tile bg-white border border-stone-200/70 rounded-2xl p-5 relative">
                                        <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-[#BC002D] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                                            {deck.jlpt_level || '—'}
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wide text-[#BC002D]">
                                            {deck.scenario_tag || 'General'}
                                        </span>
                                        <h3 className="font-semibold text-stone-900 mt-1">{deck.title}</h3>
                                        <p className="text-xs text-stone-500 mt-1 mb-3">{deck.cards_count ?? 0} cards</p>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/study?deck_id=${deck.id}`}
                                                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 inline-block"
                                            >
                                                Study this deck →
                                            </Link>
                                            <Link
                                                to={`/quiz?deck_id=${deck.id}`}
                                                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 inline-block"
                                            >
                                                Quiz Me
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                </>
            )}
        </div>
    );
}
