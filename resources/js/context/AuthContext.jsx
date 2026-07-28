import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('tobira_token');
        if (!token) {
            setLoading(false);
            return;
        }

        api.get('/user')
            .then(({ data }) => {
                setUser(data.user);
                setRole(data.role);
                setNeedsOnboarding(data.needs_onboarding);
            })
            .catch(() => {
                localStorage.removeItem('tobira_token');
                localStorage.removeItem('tobira_user');
            })
            .finally(() => setLoading(false));
    }, []);

    /**
     * Step 1: basic info only. No token yet — account is unverified until
     * the OTP step completes. Returns { user_id, email } for the OTP page.
     */
    const register = async (payload) => {
        const { data } = await api.post('/register', payload);
        return data;
    };

    /**
     * Step 2: OTP verification. This is the real "login moment" — issues
     * the token and marks the account verified.
     */
    const verifyOtp = async (userId, otp) => {
        const { data } = await api.post('/otp/verify', { user_id: userId, otp });
        localStorage.setItem('tobira_token', data.token);
        localStorage.setItem('tobira_user', JSON.stringify(data.user));
        setUser(data.user);
        setNeedsOnboarding(data.needs_onboarding);

        const me = await api.get('/user');
        setRole(me.data.role);

        return data;
    };

    const resendOtp = async (userId) => {
        const { data } = await api.post('/otp/resend', { user_id: userId });
        return data;
    };

    /**
     * Step 3: birthday / level / study purpose, only required the first
     * time. Requires the user to already be authenticated (token from step 2).
     */
    const completeOnboarding = async (payload) => {
        const { data } = await api.post('/onboarding', payload);
        setUser(data.user);
        setNeedsOnboarding(false);
        return data;
    };

    /**
     * Standard login for already-verified users. Accepts email OR username
     * in the same field.
     */
    const login = async (identifier, password) => {
        const { data } = await api.post('/login', { login: identifier, password });
        localStorage.setItem('tobira_token', data.token);
        localStorage.setItem('tobira_user', JSON.stringify(data.user));
        setUser(data.user);
        setNeedsOnboarding(data.needs_onboarding);

        const me = await api.get('/user');
        setRole(me.data.role);

        return data;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch {
            // ignore network errors on logout, clear local state regardless
        }
        localStorage.removeItem('tobira_token');
        localStorage.removeItem('tobira_user');
        setUser(null);
        setRole(null);
        setNeedsOnboarding(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                role,
                loading,
                needsOnboarding,
                register,
                verifyOtp,
                resendOtp,
                completeOnboarding,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}
