import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { UserContext } from '@/contexts/userContext';

export default function ProtectedRoute() {
    const { user } = useContext(UserContext);

    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />;
}
