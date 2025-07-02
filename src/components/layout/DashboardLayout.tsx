import { ReactNode, useState } from 'react';

import Sidebar from './Sidebar';
import Navbar from './Navbar';

import Chatbot from '@/components/chat/Chatbot';
import { useIsMobile } from '@/hooks/useMobile';

interface DashboardLayoutProps {
    children: ReactNode;
    title: string;
}

function DashboardLayout({ children, title }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const _isMobile = useIsMobile();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="h-screen w-full overflow-hidden flex">
            <Sidebar isOpen={ sidebarOpen } toggleSidebar={ toggleSidebar } />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar title={ title } toggleSidebar={ toggleSidebar } />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background px-6 py-8">
                    <div className="mx-auto max-w-7xl animate-fade-in">
                        { children }
                    </div>
                </main>

                { /* Add Chatbot */ }
                <Chatbot position="bottom-right" />
            </div>
        </div>
    );
}

export default DashboardLayout;
