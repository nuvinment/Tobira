import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
    },
});

// Attach the stored token (if any) to every outgoing request.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('tobira_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If the token is rejected/expired anywhere, clear it and bounce to login.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('tobira_token');
            localStorage.removeItem('tobira_user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
