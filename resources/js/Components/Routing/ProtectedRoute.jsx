import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Wrap a route element to require authentication (and optionally a
 * specific role). Usage:
 *   <ProtectedRoute><StudentDashboard /></ProtectedRoute>
 *   <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, role = null }) {
    const { user, role: userRole, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-stone-500 text-sm">
                Loading…
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && userRole !== role) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
