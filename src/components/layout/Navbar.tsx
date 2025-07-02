import { Menu, Settings, Sun, Moon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme/ThemeProvider';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useIsMobile } from '@/hooks/useMobile';
import { useContext } from 'react';
import { UserContext } from '@/contexts/userContext';

interface NavbarProps {
    title: string;
    toggleSidebar: () => void;
}

function Navbar({ title, toggleSidebar }: NavbarProps) {
    const isMobile = useIsMobile();
    const { theme, toggleTheme } = useTheme();

    const { user } = useContext(UserContext);

    return (
        <header className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={ toggleSidebar }
                    className="md:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                </Button>

                <h1 className="text-xl font-medium dark:text-white">{ title }</h1>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={ toggleTheme }>
                    { theme === 'light' ? (
                        <Moon className="h-5 w-5" />
                    ) : (
                        <Sun className="h-5 w-5" />
                    ) }
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Perfil</DropdownMenuItem>
                        <DropdownMenuItem>Configuración</DropdownMenuItem>
                        <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="ml-2 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                        VS
                    </div>
                    { !isMobile && (
                        <span className="text-sm font-medium dark:text-white">
                            Vendedor
                        </span>
                    ) }
                </div>
            </div>
        </header>
    );
}

export default Navbar;
