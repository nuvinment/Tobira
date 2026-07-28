import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardRedirect() {
    const { role } = useAuth();

    if (role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/student/dashboard" replace />;
}
