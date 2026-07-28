import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [focused, setFocused] = useState(null);

    function setField(key, value) {
        setForm(prev => ({ ...prev, [key]: value }));
    }

    async function submit(e) {
        e.preventDefault();
        setErrors({});
        setProcessing(true);
        try {
            const data = await register(form);
            navigate('/verify-otp', { state: { userId: data.user_id, email: data.email } });
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                setErrors({ general: 'Something went wrong. Please try again.' });
            }
        } finally {
            setProcessing(false);
        }
    }

    const fields = [
        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Kenji Sato' },
        { key: 'username', label: 'Username', type: 'text', placeholder: 'kenji_sato' },
        { key: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com' },
        { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
        { key: 'password_confirmation', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
    ];

    return (
        <AuthLayout title="Create Account — Tobira">
            <Link to="/" style={s.back}>← Back to Home</Link>

            <div style={s.title}>Create your account</div>
            <div style={s.sub}>Start mastering Business Japanese today</div>

            <form onSubmit={submit}>
                {fields.map(f => (
                    <div style={s.group} key={f.key}>
                        <label style={s.label}>{f.label}</label>
                        <input
                            style={{ ...s.input, borderColor: focused === f.key ? '#4A90E2' : '#E0E0E0' }}
                            type={f.type}
                            value={form[f.key]}
                            onChange={e => setField(f.key, e.target.value)}
                            onFocus={() => setFocused(f.key)}
                            onBlur={() => setFocused(null)}
                            placeholder={f.placeholder}
                            required
                        />
                        {errors[f.key] && <div style={s.error}>{errors[f.key][0]}</div>}
                    </div>
                ))}

                {errors.general && (
                    <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#D32F2F', marginBottom: '16px' }}>
                        {errors.general}
                    </div>
                )}

                <button type="submit" style={{ ...s.btn, opacity: processing ? .7 : 1 }} disabled={processing}>
                    {processing ? 'Creating account...' : 'Create Account →'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#757575' }}>
                Already have an account?{' '}
                <Link to="/login" style={s.link}>Sign in →</Link>
            </div>
        </AuthLayout>
    );
}
