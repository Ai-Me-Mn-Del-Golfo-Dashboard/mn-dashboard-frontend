import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Index from './pages/Index';
import Quotations from './pages/Quotations';
import Clients from './pages/Clients';
import NewClients from './pages/NewClients';
import ClientsWithoutQuote from './pages/ClientsWithoutQuote';
import SalesOrders from './pages/SalesOrders';
import ProactiveSales from './pages/ProactiveSales';
import Tasks from './pages/Tasks';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import ProtectedRoute from './components/layout/ProtectedRoute';

import UserContextWrapper from './contexts/userContext';
import Admin from './pages/Admin';
import AdminRoute from './components/layout/AdminRoute';

const queryClient = new QueryClient();

function App() {
    return (
        <UserContextWrapper>
            <QueryClientProvider client={ queryClient }>
                <ThemeProvider>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />

                        <BrowserRouter>
                            <Routes>
                                <Route element={ <ProtectedRoute /> }>
                                    <Route path="/" element={ <Index /> } />

                                    <Route
                                        path="/quotations"
                                        element={ <Quotations /> }
                                    />

                                    <Route
                                        path="/clients"
                                        element={ <Clients /> }
                                    />

                                    <Route
                                        path="/new-clients"
                                        element={ <NewClients /> }
                                    />
                                    <Route
                                        path="/clients-without-quote"
                                        element={ <ClientsWithoutQuote /> }
                                    />
                                    <Route
                                        path="/sales-orders"
                                        element={ <SalesOrders /> }
                                    />
                                    <Route
                                        path="/proactive-sales"
                                        element={ <ProactiveSales /> }
                                    />

                                    <Route path="/tasks" element={ <Tasks /> } />
                                </Route>

                                <Route element={ <AdminRoute /> }>
                                    <Route path="/admin" element={ <Admin /> } />
                                </Route>

                                <Route path="/login" element={ <Login /> } />

                                <Route path="*" element={ <NotFound /> } />
                            </Routes>
                        </BrowserRouter>
                    </TooltipProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </UserContextWrapper>
    );
}

export default App;
