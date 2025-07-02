import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { UserContext } from '@/contexts/userContext';

export default function AdminRoute() {
    const { user } = useContext(UserContext);

    if (!user || user.role !== 'admin') return <Navigate to="/404" replace />;

    return <Outlet />;
}
