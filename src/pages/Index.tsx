import { useContext } from 'react';

import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';

import { UserContext } from '@/contexts/userContext';
import SalespersonDashboard from '@/components/dashboard/SalespersonDashboard';

export default function Dashboard() {
    const { user } = useContext(UserContext);

    return <SalespersonDashboard />;
}
