import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../Layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

const s = {
    title: { fontSize: '26px', fontWeight: '700', color: '#1A1A1A', marginBottom: '6px', fontFamily: 'Georgia, serif' },
    sub: { fontSize: '14px', color: '#757575', marginBottom: '32px' },
    label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.06em' },
    input: { width: '100%', padding: '11px 14px', border: '1.5px solid #E0E0E0', borderRadius: '8px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", color: '#1A1A1A', background: '#fff', outline: 'none', boxSizing: 'border-box' },
    group: { marginBottom: '18px' },
    pillRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    pill: (active) => ({
        padding: '8px 16px',
        borderRadius: '999px',
        border: active ? '1.5px solid #BC002D' : '1.5px solid #E0E0E0',
        background: active ? '#FCE8EC' : '#fff',
        color: active ? '#BC002D' : '#555',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    }),
    btn: { width: '100%', padding: '13px', background: '#BC002D', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: '8px' },
    error: { background: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#D32F2F', marginBottom: '16px' },
};

const PURPOSES = ['Career', 'JLPT Exam', 'Travel', 'Academic', 'General Interest'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function Onboarding() {
    const { completeOnboarding } = useAuth();
    const navigate = useNavigate();

    const [birthday, setBirthday] = useState('');
    const [studyPurpose, setStudyPurpose] = useState('');
    const [level, setLevel] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    async function submit(e) {
        e.preventDefault();
        setError('');

        if (!birthday || !studyPurpose || !level) {
            setError('Please fill in all fields.');
            return;
        }

        setProcessing(true);
        try {
            await completeOnboarding({ birthday, study_purpose: studyPurpose, level });
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setProcessing(false);
        }
    }

    return (
        <AuthLayout title="Tell us about you — Tobira">
            <div style={s.title}>Almost there</div>
            <div style={s.sub}>A few quick details to personalize your study plan</div>

            <form onSubmit={submit}>
                <div style={s.group}>
                    <label style={s.label}>Birthday</label>
                    <input
                        style={s.input}
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        required
                    />
                </div>

                <div style={s.group}>
                    <label style={s.label}>Japanese Level</label>
                    <div style={s.pillRow}>
                        {LEVELS.map((lvl) => (
                            <button
                                type="button"
                                key={lvl}
                                style={s.pill(level === lvl)}
                                onClick={() => setLevel(lvl)}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={s.group}>
                    <label style={s.label}>Study Purpose</label>
                    <div style={s.pillRow}>
                        {PURPOSES.map((p) => (
                            <button
                                type="button"
                                key={p}
                                style={s.pill(studyPurpose === p)}
                                onClick={() => setStudyPurpose(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <div style={s.error}>{error}</div>}

                <button type="submit" style={{ ...s.btn, opacity: processing ? .7 : 1 }} disabled={processing}>
                    {processing ? 'Saving...' : 'Finish Setup →'}
                </button>
            </form>
        </AuthLayout>
    );
}
