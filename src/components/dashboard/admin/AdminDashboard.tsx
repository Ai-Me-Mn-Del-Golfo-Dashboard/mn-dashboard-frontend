import { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CalendarIcon } from 'lucide-react';

import SummaryView from './SummaryView';
import SalespersonView from './SalespersonView';

import DashboardLayout from '@/components/layout/DashboardLayout';

import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectContent,
    SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { UserContext } from '@/contexts/userContext';

export default function AdminDashboard() {
    const { user } = useContext(UserContext);

    const [salespersonCode, setSalespersonCode] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    const code = searchParams.get('code')
        ? parseInt(searchParams.get('code'))
        : null;

    function handleFilterChange() {
        const params = new URLSearchParams();

        if (salespersonCode) params.set('code', salespersonCode);
        if (startDate) params.set('start_date', startDate);
        if (endDate) params.set('end_date', endDate);
        if (location) params.set('location', location);

        setSearchParams(params);
    }

    function handleClear() {
        setSalespersonCode('');
        setStartDate('');
        setEndDate('');
        setLocation('');

        const params = new URLSearchParams();
        setSearchParams(params);
    }

    return (
        <DashboardLayout title="Dashboard">
            <div className="bg-border shadow-sm rounded-2xl p-6 space-y-6">
                <h2 className="text-xl font-semibold">Filters</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300">
                            Salesperson Code
                        </label>
                        <Input
                            placeholder="e.g. 3023"
                            value={ salespersonCode }
                            onChange={ (e) => setSalespersonCode(e.target.value) }
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-300">
                            Start Date
                        </label>
                        <div className="relative mt-1">
                            <Input
                                type="date"
                                value={ startDate }
                                onChange={ (e) => setStartDate(e.target.value) }
                                className="pr-10"
                            />

                            <CalendarIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-300">
                            End Date
                        </label>

                        <div className="relative mt-1">
                            <Input
                                type="date"
                                value={ endDate }
                                onChange={ (e) => setEndDate(e.target.value) }
                                className="pr-10"
                            />
                            <CalendarIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-300">
                            Location
                        </label>

                        <div className="relative mt-1 w-full">
                            <Select
                                value={ location }
                                onValueChange={ (e) => setLocation(e) }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a location" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">
                                        All Locations
                                    </SelectItem>

                                    <SelectItem value="New York">
                                        New York
                                    </SelectItem>

                                    <SelectItem value="Chicago">
                                        Chicago
                                    </SelectItem>

                                    <SelectItem value="Austin">
                                        Austin
                                    </SelectItem>

                                    <SelectItem value="San Francisco">
                                        San Francisco
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                    <Button variant="ghost" onClick={ handleClear }>
                        Clear
                    </Button>

                    <Button onClick={ handleFilterChange }>Apply</Button>
                </div>
            </div>

            <div className="mt-10">
                { code ? <SalespersonView /> : <SummaryView /> }
            </div>
        </DashboardLayout>
    );
}
