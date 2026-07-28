import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../Layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

const s = {
    back: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#757575', textDecoration: 'none', marginBottom: '20px' },
    title: { fontSize: '26px', fontWeight: '700', color: '#1A1A1A', marginBottom: '6px', fontFamily: 'Georgia, serif' },
    sub: { fontSize: '14px', color: '#757575', marginBottom: '32px' },
    label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.06em' },
    input: { width: '100%', padding: '11px 14px', border: '1.5px solid #E0E0E0', borderRadius: '8px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", color: '#1A1A1A', background: '#fff', outline: 'none', boxSizing: 'border-box' },
    error: { fontSize: '12px', color: '#D32F2F', marginTop: '4px' },
    btn: { width: '100%', padding: '13px', background: '#BC002D', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: '8px' },
    link: { color: '#4A90E2', textDecoration: 'none', fontWeight: '500', fontSize: '13px' },
    group: { marginBottom: '18px' },
};

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [focused, setFocused] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    async function submit(e) {
        e.preventDefault();
        setError('');
        setProcessing(true);
        try {
            const data = await login(identifier, password);
            const redirectTo = data.needs_onboarding
                ? '/onboarding'
                : (location.state?.from?.pathname || '/dashboard');
            navigate(redirectTo, { replace: true });
        } catch (err) {
            if (err.response?.status === 403 && err.response.data?.needs_verification) {
                navigate('/verify-otp', {
                    state: { userId: err.response.data.user_id, email: err.response.data.email },
                });
                return;
            }
            setError(err.response?.data?.message || 'Unable to sign in. Please check your credentials.');
        } finally {
            setProcessing(false);
        }
    }

    return (
        <AuthLayout title="Login — Tobira">
            <Link to="/" style={s.back}>← Back to Home</Link>

            <div style={s.title}>Welcome back</div>
            <div style={s.sub}>Sign in to continue your Business Japanese journey</div>

            <form onSubmit={submit}>
                <div style={s.group}>
                    <label style={s.label}>Email or Username</label>
                    <input
                        style={{ ...s.input, borderColor: focused === 'identifier' ? '#4A90E2' : '#E0E0E0' }}
                        type="text"
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                        onFocus={() => setFocused('identifier')}
                        onBlur={() => setFocused(null)}
                        placeholder="you@email.com or username"
                        required
                    />
                </div>

                <div style={s.group}>
                    <label style={s.label}>Password</label>
                    <input
                        style={{ ...s.input, borderColor: focused === 'password' ? '#4A90E2' : '#E0E0E0' }}
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => setFocused('password')}
                        onBlur={() => setFocused(null)}
                        placeholder="••••••••"
                        required
                    />
                </div>

                {error && (
                    <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#D32F2F', marginBottom: '16px' }}>
                        {error}
                    </div>
                )}

                <button type="submit" style={{ ...s.btn, opacity: processing ? .7 : 1 }} disabled={processing}>
                    {processing ? 'Signing in...' : 'Sign In →'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#757575' }}>
                Don't have an account?{' '}
                <Link to="/register" style={s.link}>Create one →</Link>
            </div>
        </AuthLayout>
    );
}
