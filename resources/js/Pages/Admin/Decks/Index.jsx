import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import HankoStamp from '../../../Components/Study/HankoStamp';

const SCENARIOS = ['Job Interview', 'Client Meetings', 'Email Etiquette', 'Telephone Calls', 'Office Daily Use'];
const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

const emptyForm = {
    title: '',
    scenario_tag: SCENARIOS[0],
    jlpt_level: JLPT_LEVELS[0],
    is_public: true,
    description: '',
};

export default function DecksIndex() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingDeck, setEditingDeck] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(emptyForm);

    function loadDecks() {
        setLoading(true);
        api.get('/decks')
            .then((res) => setDecks(res.data.data ?? res.data))
            .catch(() => setError('Could not load decks.'))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        document.title = 'Manage Decks — Tobira';
        loadDecks();
    }, []);

    async function handleLogout() {
        await logout();
        navigate('/');
    }

    function openCreateForm() {
        setEditingDeck(null);
        setForm(emptyForm);
        setShowForm(true);
    }

    function openEditForm(deck) {
        setEditingDeck(deck);
        setForm({
            title: deck.title,
            scenario_tag: deck.scenario_tag || SCENARIOS[0],
            jlpt_level: deck.jlpt_level || JLPT_LEVELS[0],
            is_public: !!deck.is_public,
            description: deck.description || '',
        });
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingDeck(null);
        setForm(emptyForm);
    }

    async function submitDeck(e) {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (editingDeck) {
                await api.put(`/decks/${editingDeck.id}`, form);
            } else {
                await api.post('/decks', form);
            }
            closeForm();
            loadDecks();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not save deck.');
        } finally {
            setSaving(false);
        }
    }

    async function deleteDeck(deck) {
        if (!confirm(`Delete "${deck.title}"? This also deletes all its cards.`)) return;
        try {
            await api.delete(`/decks/${deck.id}`);
            loadDecks();
        } catch {
            setError('Could not delete deck.');
        }
    }

    return (
        <div className="min-h-screen washi-bg">
            <header className="obi-band">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <HankoStamp stamped kanji="管" size={40} />
                        <div>
                            <Link to="/" className="font-bold text-white block leading-tight">Tobira</Link>
                            <span className="text-[11px] text-white/60 uppercase tracking-wider">Deck Management</span>
                        </div>
                    </div>
                    <nav className="flex items-center gap-6 text-sm">
                        <Link to="/admin/dashboard" className="text-white/70 hover:text-white">Dashboard</Link>
                        <span className="text-white/60">{user?.name}</span>
                        <button onClick={handleLogout} className="px-4 py-2 rounded-lg font-semibold text-white/80 hover:bg-white/10 transition-colors">
                            Log Out
                        </button>
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-stone-900">Manage Decks</h1>
                    <button
                        onClick={showForm ? closeForm : openCreateForm}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all"
                    >
                        {showForm ? 'Cancel' : '+ New Deck'}
                    </button>
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                {showForm && (
                    <form onSubmit={submitDeck} className="bg-white border border-stone-200/70 rounded-2xl p-6 space-y-4">
                        <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wide">
                            {editingDeck ? `Editing "${editingDeck.title}"` : 'New Deck'}
                        </h2>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">Title</label>
                            <input
                                required
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Client Meeting Essentials"
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#BC002D]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">Scenario</label>
                                <select
                                    value={form.scenario_tag}
                                    onChange={(e) => setForm({ ...form, scenario_tag: e.target.value })}
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                                >
                                    {SCENARIOS.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">JLPT Level</label>
                                <select
                                    value={form.jlpt_level}
                                    onChange={(e) => setForm({ ...form, jlpt_level: e.target.value })}
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                                >
                                    {JLPT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                            />
                        </div>

                        <label className="flex items-center gap-2 text-sm text-stone-600">
                            <input
                                type="checkbox"
                                checked={form.is_public}
                                onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
                            />
                            Public (visible to all students)
                        </label>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : editingDeck ? 'Save Changes' : 'Create Deck'}
                            </button>
                            <button
                                type="button"
                                onClick={closeForm}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {loading && <p className="text-stone-500 text-sm">Loading decks…</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {decks.map((deck) => (
                        <div key={deck.id} className="postcard-tile bg-white border border-stone-200/70 rounded-2xl p-5 relative">
                            <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-[#BC002D] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                                {deck.jlpt_level || '—'}
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold uppercase tracking-wide text-[#BC002D]">{deck.scenario_tag || 'General'}</span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${deck.is_public ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                                    {deck.is_public ? 'Public' : 'Private'}
                                </span>
                            </div>
                            <h3 className="font-semibold text-stone-900">{deck.title}</h3>
                            {deck.description && <p className="text-xs text-stone-500 mt-1">{deck.description}</p>}
                            <p className="text-xs text-stone-500 mt-1 mb-4">{deck.jlpt_level} · {deck.cards_count ?? 0} cards</p>
                            <div className="flex gap-2">
                                <Link
                                    to={`/admin/decks/${deck.id}/cards`}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200"
                                >
                                    Manage Cards
                                </Link>
                                <button
                                    onClick={() => openEditForm(deck)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteDeck(deck)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {!loading && decks.length === 0 && (
                        <p className="text-sm text-stone-500">No decks yet. Create one above.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
