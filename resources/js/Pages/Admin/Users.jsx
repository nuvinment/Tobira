import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import HankoStamp from '../../Components/Study/HankoStamp';

export default function Users() {
    const { user: currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busyId, setBusyId] = useState(null);

    function load() {
        setLoading(true);
        api.get('/admin/users')
            .then((res) => setUsers(res.data))
            .catch(() => setError('Could not load users.'))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        document.title = 'Manage Users - Tobira';
        load();
    }, []);

    async function handleLogout() {
        await logout();
        navigate('/');
    }

    async function toggleRole(user) {
        const newRole = user.role === 'admin' ? 'student' : 'admin';
        if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;

        setBusyId(user.id);
        setError('');
        try {
            await api.patch(`/admin/users/${user.id}/role`, { role: newRole });
            load();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not update role.');
        } finally {
            setBusyId(null);
        }
    }

    async function deleteUser(user) {
        if (!confirm(`Permanently delete ${user.name}'s account? This cannot be undone.`)) return;

        setBusyId(user.id);
        setError('');
        try {
            await api.delete(`/admin/users/${user.id}`);
            load();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not delete user.');
        } finally {
            setBusyId(null);
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
                            <span className="text-[11px] text-white/60 uppercase tracking-wider">User Management</span>
                        </div>
                    </div>
                    <nav className="flex items-center gap-6 text-sm">
                        <Link to="/admin/dashboard" className="text-white/70 hover:text-white">Dashboard</Link>
                        <Link to="/admin/decks" className="text-white/70 hover:text-white">Manage Decks</Link>
                        <Link to="/admin/analytics" className="text-white/70 hover:text-white">Analytics</Link>
                        <span className="text-white/60">{currentUser?.name}</span>
                        <button onClick={handleLogout} className="px-4 py-2 rounded-lg font-semibold text-white/80 hover:bg-white/10 transition-colors">
                            Log Out
                        </button>
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
                <h1 className="text-2xl font-bold text-stone-900">Manage Users</h1>

                {loading && <p className="text-stone-500 text-sm">Loading users…</p>}
                {error && <p className="text-red-600 text-sm">{error}</p>}

                <div className="bg-white border border-stone-200/70 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                            <tr>
                                <th className="text-left px-4 py-3">Name</th>
                                <th className="text-left px-4 py-3">Email</th>
                                <th className="text-left px-4 py-3">Role</th>
                                <th className="text-left px-4 py-3">Verified</th>
                                <th className="text-right px-4 py-3">Reviews</th>
                                <th className="text-left px-4 py-3">Joined</th>
                                <th className="text-right px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-stone-50/60 transition-colors">
                                    <td className="px-4 py-3 font-medium text-stone-900">
                                        {u.name}
                                        {u.id === currentUser?.id && <span className="ml-2 text-[10px] font-bold text-stone-400 uppercase">You</span>}
                                    </td>
                                    <td className="px-4 py-3 text-stone-600">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-[#29465B]/10 text-[#29465B]' : 'bg-stone-100 text-stone-500'}`}>
                                            {u.role || 'none'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {u.email_verified ? (
                                            <span className="text-emerald-600 text-xs font-semibold">✓ Verified</span>
                                        ) : (
                                            <span className="text-stone-400 text-xs">Pending</span>
                                        )}
                                    </td>
                                    <td className="text-right px-4 py-3">{u.total_reviews}</td>
                                    <td className="px-4 py-3 text-stone-500">{u.joined_at}</td>
                                    <td className="text-right px-4 py-3">
                                        {u.id !== currentUser?.id && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => toggleRole(u)}
                                                    disabled={busyId === u.id}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                                                >
                                                    Make {u.role === 'admin' ? 'Student' : 'Admin'}
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(u)}
                                                    disabled={busyId === u.id}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {!loading && users.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-6 text-center text-stone-500">No users found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
