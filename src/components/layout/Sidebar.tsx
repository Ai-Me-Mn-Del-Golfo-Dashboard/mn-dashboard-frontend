import { useEffect, useState, ElementType } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
    BarChart2,
    FileText,
    ChevronLeft,
    ChevronRight,
    Home,
    ListTodo,
    Users,
    X,
    UserPlus,
    FileMinus,
    TrendingUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useMobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/components/theme/ThemeProvider';

import { useToast } from '@/hooks/useToast';

import { cn } from '@/lib/utils';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

interface NavItem {
    label: string;
    icon: ElementType;
    href: string;
}

const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        icon: Home,
        href: '/',
    },
    {
        label: 'Cotizaciones',
        icon: FileText,
        href: '/quotations',
    },
    {
        label: 'Clientes',
        icon: Users,
        href: '/clients',
    },
    {
        label: 'Clientes Nuevos',
        icon: UserPlus,
        href: '/new-clients',
    },
    {
        label: 'Sin Cotización',
        icon: FileMinus,
        href: '/clients-without-quote',
    },
    {
        label: 'Ventas Proactivas',
        icon: TrendingUp,
        href: '/proactive-sales',
    },
    {
        label: 'Ventas (VSP)',
        icon: BarChart2,
        href: '/sales-orders',
    },
    {
        label: 'Tareas',
        icon: ListTodo,
        href: '/tasks',
    },
];

function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
    const location = useLocation();
    const isMobile = useIsMobile();
    const { theme } = useTheme();
    const { toast } = useToast();
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (isMobile && isOpen) {
            toggleSidebar();
        }
    }, [location.pathname, isMobile]);

    const handleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        if (!isCollapsed) {
            toast({
                title: 'Sidebar collapsed',
                description: 'Click the arrow button to expand it again',
            });
        }
    };

    return (
        <>
            { isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
                    onClick={ toggleSidebar }
                />
            ) }

            <aside
                className={ cn(
                    'h-screen border-r z-50 flex flex-col transition-all duration-300 ease-in-out',
                    theme === 'dark'
                        ? 'bg-gray-900 border-gray-800 text-white'
                        : 'bg-sidebar border-sidebar-border',
                    isMobile ? 'fixed left-0 top-0' : 'relative',
                    isMobile && !isOpen && '-translate-x-full',
                    isCollapsed ? 'w-16' : 'w-64',
                ) }
            >
                <div
                    className={ cn(
                        'h-16 flex items-center justify-between px-6 border-b',
                        theme === 'dark'
                            ? 'border-gray-800'
                            : 'border-sidebar-border',
                    ) }
                >
                    { !isCollapsed && (
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-white font-semibold">
                                    SC
                                </span>
                            </div>
                            <div className="font-semibold">Sales Dashboard</div>
                        </div>
                    ) }

                    { isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={ toggleSidebar }
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close sidebar</span>
                        </Button>
                    ) }

                    { !isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={ handleCollapse }
                            className={ cn(isCollapsed && 'mx-auto') }
                            title={
                                isCollapsed
                                    ? 'Expand sidebar'
                                    : 'Collapse sidebar'
                            }
                        >
                            { isCollapsed ? (
                                <ChevronRight className="h-5 w-5" />
                            ) : (
                                <ChevronLeft className="h-5 w-5" />
                            ) }
                            <span className="sr-only">
                                { isCollapsed
                                    ? 'Expand sidebar'
                                    : 'Collapse sidebar' }
                            </span>
                        </Button>
                    ) }
                </div>

                <ScrollArea className="flex-1 px-3 py-4">
                    <nav className="space-y-1">
                        { navItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={ item.href }
                                    to={ item.href }
                                    className={ cn(
                                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                                        isActive
                                            ? theme === 'dark'
                                                ? 'bg-gray-800 text-primary font-medium'
                                                : 'bg-sidebar-accent text-primary font-medium'
                                            : theme === 'dark'
                                                ? 'text-gray-300 hover:bg-gray-800'
                                                : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                                        isCollapsed && 'justify-center px-2',
                                    ) }
                                    title={ isCollapsed ? item.label : undefined }
                                >
                                    <item.icon
                                        className={ cn(
                                            'h-5 w-5',
                                            isActive && 'text-primary',
                                        ) }
                                    />
                                    { !isCollapsed && <span>{ item.label }</span> }
                                </Link>
                            );
                        }) }
                    </nav>
                </ScrollArea>

                { !isCollapsed && (
                    <div className="p-4 mt-auto">
                        <div
                            className={ cn(
                                'rounded-lg p-4',
                                theme === 'dark'
                                    ? 'bg-gray-800'
                                    : 'bg-sidebar-accent',
                            ) }
                        >
                            <h4 className="font-medium text-sm mb-2">
                                Próxima Meta
                            </h4>
                            <div
                                className={ cn(
                                    'text-xs',
                                    theme === 'dark'
                                        ? 'text-gray-400'
                                        : 'text-muted-foreground',
                                ) }
                            >
                                Te faltan 4 cotizaciones para completar tu meta
                                diaria
                            </div>
                        </div>
                    </div>
                ) }
            </aside>
        </>
    );
}

export default Sidebar;
