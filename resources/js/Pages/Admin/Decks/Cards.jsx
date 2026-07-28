import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import HankoStamp from '../../../Components/Study/HankoStamp';

const KEIGO_FORMS = ['Sonkeigo', 'Kenjougo', 'Teineigo', 'Casual'];

const emptyForm = {
    front_text: '',
    back_text: '',
    furigana: '',
    keigo_form: KEIGO_FORMS[0],
    context_sentence: '',
    audio_path: '',
};

export default function DeckCards() {
    const { deckId } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState(emptyForm);
    const [fieldErrors, setFieldErrors] = useState({});
    const [uploadingAudio, setUploadingAudio] = useState(false);
    const [audioError, setAudioError] = useState('');

    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const importInputRef = useRef(null);

    function load() {
        setLoading(true);
        api.get(`/decks/${deckId}`)
            .then((res) => {
                setDeck(res.data);
                setCards(res.data.cards ?? []);
            })
            .catch(() => setError('Could not load this deck.'))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        document.title = 'Manage Cards — Tobira';
        load();
    }, [deckId]);

    async function handleLogout() {
        await logout();
        navigate('/');
    }

    function openCreateForm() {
        setEditingCard(null);
        setForm(emptyForm);
        setFieldErrors({});
        setShowForm(true);
    }

    function openEditForm(card) {
        setEditingCard(card);
        setForm({
            front_text: card.front_text || '',
            back_text: card.back_text || '',
            furigana: card.furigana || '',
            keigo_form: card.keigo_form || KEIGO_FORMS[0],
            context_sentence: card.context_sentence || '',
            audio_path: card.audio_path || '',
        });
        setFieldErrors({});
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingCard(null);
        setForm(emptyForm);
        setFieldErrors({});
    }

    async function handleAudioSelect(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAudio(true);
        setAudioError('');
        try {
            const formData = new FormData();
            formData.append('audio', file);
            const { data } = await api.post('/uploads/audio', formData);
            setForm((f) => ({ ...f, audio_path: data.url }));
        } catch (err) {
            setAudioError(err.response?.data?.message || 'Could not upload audio file.');
        } finally {
            setUploadingAudio(false);
        }
    }

    async function submitCard(e) {
        e.preventDefault();
        setSaving(true);
        setError('');
        setFieldErrors({});
        try {
            if (editingCard) {
                await api.put(`/decks/${deckId}/cards/${editingCard.id}`, form);
            } else {
                await api.post(`/decks/${deckId}/cards`, form);
            }
            closeForm();
            load();
        } catch (err) {
            if (err.response?.status === 422) {
                setFieldErrors(err.response.data.errors || {});
            } else {
                setError('Could not save card.');
            }
        } finally {
            setSaving(false);
        }
    }

    async function deleteCard(card) {
        if (!confirm(`Delete card "${card.front_text}"?`)) return;
        try {
            await api.delete(`/decks/${deckId}/cards/${card.id}`);
            load();
        } catch {
            setError('Could not delete card.');
        }
    }

    async function handleImport(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        setImportResult(null);
        setError('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await api.post(`/decks/${deckId}/cards/import`, formData);
            setImportResult(data);
            load();
        } catch (err) {
            setError(err.response?.data?.message || 'Import failed.');
        } finally {
            setImporting(false);
            if (importInputRef.current) importInputRef.current.value = '';
        }
    }

    async function handleExport(format) {
        try {
            const res = await api.get(`/decks/${deckId}/cards/export`, {
                params: { format },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `${deck?.title || 'deck'}.${format}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            setError('Export failed.');
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
                            <span className="text-[11px] text-white/60 uppercase tracking-wider">Card Management</span>
                        </div>
                    </div>
                    <nav className="flex items-center gap-6 text-sm">
                        <Link to="/admin/decks" className="text-white/70 hover:text-white">← All Decks</Link>
                        <span className="text-white/60">{user?.name}</span>
                        <button onClick={handleLogout} className="px-4 py-2 rounded-lg font-semibold text-white/80 hover:bg-white/10 transition-colors">
                            Log Out
                        </button>
                    </nav>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
                {deck && (
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wide text-[#BC002D]">{deck.scenario_tag}</span>
                        <h1 className="text-2xl font-bold text-stone-900">{deck.title}</h1>
                        <p className="text-sm text-stone-500">{deck.jlpt_level} · {cards.length} cards</p>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={showForm ? closeForm : openCreateForm}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all"
                    >
                        {showForm ? 'Cancel' : '+ New Card'}
                    </button>

                    <label className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all cursor-pointer">
                        {importing ? 'Importing…' : 'Import CSV/JSON'}
                        <input
                            ref={importInputRef}
                            type="file"
                            accept=".csv,.json"
                            onChange={handleImport}
                            disabled={importing}
                            className="hidden"
                        />
                    </label>

                    <button
                        onClick={() => handleExport('csv')}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={() => handleExport('json')}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all"
                    >
                        Export JSON
                    </button>
                </div>

                <p className="text-xs text-stone-400">
                    CSV/JSON columns: front_text, back_text, furigana, keigo_form, context_sentence, audio_path (front_text and back_text are required).
                </p>

                {importResult && (
                    <div className="bg-white border border-stone-200/70 rounded-2xl p-4 text-sm space-y-2">
                        <p className="font-semibold text-stone-800">
                            Import complete: {importResult.created} added, {importResult.skipped} skipped.
                        </p>
                        {importResult.errors?.length > 0 && (
                            <ul className="text-xs text-red-600 list-disc list-inside space-y-0.5">
                                {importResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                        )}
                        <button onClick={() => setImportResult(null)} className="text-xs text-stone-400 hover:underline">Dismiss</button>
                    </div>
                )}

                {error && <p className="text-red-600 text-sm">{error}</p>}

                {showForm && (
                    <form onSubmit={submitCard} className="bg-white border border-stone-200/70 rounded-2xl p-6 space-y-4">
                        <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wide">
                            {editingCard ? `Editing "${editingCard.front_text}"` : 'New Card'}
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">Japanese Term / Phrase</label>
                                <input
                                    required
                                    value={form.front_text}
                                    onChange={(e) => setForm({ ...form, front_text: e.target.value })}
                                    placeholder="お世話になっております"
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm font-japanese focus:outline-none focus:border-[#BC002D]"
                                />
                                {fieldErrors.front_text && <p className="text-xs text-red-600 mt-1">{fieldErrors.front_text[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">Furigana</label>
                                <input
                                    value={form.furigana}
                                    onChange={(e) => setForm({ ...form, furigana: e.target.value })}
                                    placeholder="おせわになっております"
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm font-japanese"
                                />
                                {fieldErrors.furigana && <p className="text-xs text-red-600 mt-1">{fieldErrors.furigana[0]}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">English Meaning</label>
                            <input
                                required
                                value={form.back_text}
                                onChange={(e) => setForm({ ...form, back_text: e.target.value })}
                                placeholder="Thank you for your continued support"
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">Keigo Form</label>
                                <select
                                    value={form.keigo_form}
                                    onChange={(e) => setForm({ ...form, keigo_form: e.target.value })}
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                                >
                                    {KEIGO_FORMS.map((k) => <option key={k} value={k}>{k}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">
                                    Pronunciation Audio (optional)
                                </label>
                                <input
                                    type="file"
                                    accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/x-m4a,.mp3,.wav,.ogg,.m4a"
                                    onChange={handleAudioSelect}
                                    disabled={uploadingAudio}
                                    className="w-full text-sm text-stone-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-stone-100 file:text-stone-700 file:text-sm file:font-semibold hover:file:bg-stone-200"
                                />
                                {uploadingAudio && <p className="text-xs text-stone-500 mt-1">Uploading…</p>}
                                {audioError && <p className="text-xs text-red-600 mt-1">{audioError}</p>}
                                {form.audio_path && !uploadingAudio && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <audio controls src={form.audio_path} className="h-8" />
                                        <button
                                            type="button"
                                            onClick={() => setForm((f) => ({ ...f, audio_path: '' }))}
                                            className="text-xs text-red-600 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">Context Sentence</label>
                            <textarea
                                value={form.context_sentence}
                                onChange={(e) => setForm({ ...form, context_sentence: e.target.value })}
                                rows={2}
                                placeholder="いつもお世話になっております。本日はお時間をいただきありがとうございます。"
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm font-japanese"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={saving || uploadingAudio}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : editingCard ? 'Save Changes' : 'Add Card'}
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

                {loading && <p className="text-stone-500 text-sm">Loading cards…</p>}

                <div className="bg-white border border-stone-200/70 rounded-2xl divide-y divide-stone-100">
                    {cards.map((card) => (
                        <div key={card.id} className="p-4 flex items-center justify-between hover:bg-stone-50/60 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="w-1 h-8 rounded-full bg-[#BC002D]/60" />
                                <div>
                                    <div className="font-japanese font-semibold text-stone-900">{card.front_text}</div>
                                    <div className="text-xs text-stone-500">{card.back_text} · {card.keigo_form}</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditForm(card)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteCard(card)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {!loading && cards.length === 0 && (
                        <div className="p-4 text-sm text-stone-500">No cards yet. Add one above.</div>
                    )}
                </div>
            </main>
        </div>
    );
}
