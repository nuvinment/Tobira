import '../css/app.css';
import '../css/washi.css';
import './bootstrap';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/Routing/ProtectedRoute';

import Welcome from './Pages/Welcome';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import VerifyEmail from './Pages/Auth/VerifyEmail';
import Onboarding from './Pages/Auth/Onboarding';
import StudentDashboard from './Pages/Student/Dashboard';
import Study from './Pages/Student/Study';
import Interview from './Pages/Student/Interview';
import History from './Pages/Student/History';
import Quiz from './Pages/Student/Quiz';
import AdminDashboard from './Pages/Admin/Dashboard';
import AdminDecksIndex from './Pages/Admin/Decks/Index';
import AdminDeckCards from './Pages/Admin/Decks/Cards';
import AdminAnalytics from './Pages/Admin/Analytics';
import AdminUsers from './Pages/Admin/Users';
import DashboardRedirect from './Pages/DashboardRedirect';
import NotFound from './Pages/NotFound';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyEmail />} />

                    <Route
                        path="/onboarding"
                        element={
                            <ProtectedRoute>
                                <Onboarding />
                            </ProtectedRoute>
                        }
                    />

                    {/* /dashboard picks Student or Admin based on role */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardRedirect />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/study"
                        element={
                            <ProtectedRoute>
                                <Study />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/interview"
                        element={
                            <ProtectedRoute>
                                <Interview />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/history"
                        element={
                            <ProtectedRoute>
                                <History />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/quiz"
                        element={
                            <ProtectedRoute>
                                <Quiz />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/student/dashboard"
                        element={
                            <ProtectedRoute role="student">
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/decks"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminDecksIndex />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/decks/:deckId/cards"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminDeckCards />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/analytics"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminAnalytics />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminUsers />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
