import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthLayout from '../../Layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

const s = {
    title: { fontSize: '26px', fontWeight: '700', color: '#1A1A1A', marginBottom: '6px', fontFamily: 'Georgia, serif' },
    sub: { fontSize: '14px', color: '#757575', marginBottom: '32px' },
    otpRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
    otpBox: { width: '48px', height: '56px', textAlign: 'center', fontSize: '22px', fontWeight: '600', border: '1.5px solid #E0E0E0', borderRadius: '8px', outline: 'none', fontFamily: "'DM Sans', sans-serif" },
    btn: { width: '100%', padding: '13px', background: '#BC002D', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: '8px' },
    link: { color: '#4A90E2', textDecoration: 'none', fontWeight: '500', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' },
    error: { background: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#D32F2F', marginBottom: '16px' },
    success: { background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#2E7D32', marginBottom: '16px' },
};

export default function VerifyEmail() {
    const { verifyOtp, resendOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, email } = location.state || {};

    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const inputsRef = useRef([]);

    useEffect(() => {
        document.title = 'Verify Email - Tobira';
        if (!userId) {
            navigate('/register', { replace: true });
        }
    }, [userId, navigate]);

    function handleChange(index, value) {
        if (!/^\d*$/.test(value)) return;
        const next = [...digits];
        next[index] = value.slice(-1);
        setDigits(next);
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index, e) {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    }

    async function submit(e) {
        e.preventDefault();
        setError('');
        setNotice('');
        const otp = digits.join('');
        if (otp.length !== 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }
        setProcessing(true);
        try {
            const data = await verifyOtp(userId, otp);
            navigate(data.needs_onboarding ? '/onboarding' : '/dashboard', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    }

    async function handleResend() {
        setError('');
        setNotice('');
        try {
            await resendOtp(userId);
            setNotice('A new code has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not resend code.');
        }
    }

    return (
        <AuthLayout title="Verify Email — Tobira">
            <div style={s.title}>Check your email</div>
            <div style={s.sub}>
                We sent a 6-digit code to {email ? <strong>{email}</strong> : 'your email'}. Enter it below to verify your account.
            </div>

            <form onSubmit={submit}>
                <div style={s.otpRow}>
                    {digits.map((d, i) => (
                        <input
                            key={i}
                            ref={(el) => (inputsRef.current[i] = el)}
                            style={s.otpBox}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={d}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                        />
                    ))}
                </div>

                {error && <div style={s.error}>{error}</div>}
                {notice && <div style={s.success}>{notice}</div>}

                <button type="submit" style={{ ...s.btn, opacity: processing ? .7 : 1 }} disabled={processing}>
                    {processing ? 'Verifying...' : 'Verify →'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#757575' }}>
                Didn't get a code?{' '}
                <button onClick={handleResend} style={s.link}>Resend →</button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px' }}>
                <Link to="/register" style={s.link}>Back to registration</Link>
            </div>
        </AuthLayout>
    );
}
