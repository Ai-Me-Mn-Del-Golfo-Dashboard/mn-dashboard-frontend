import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Column<T> {
    header: string;
    accessorKey: keyof T;
    cell?: (props: { item: T }) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    initialPageSize?: number;
    pageSizeOptions?: number[];
    showPagination?: boolean;
    showSearch?: boolean;
    searchPlaceholder?: string;
    className?: string;
    onRowClick?: (item: T) => void;
}

function DataTable<T extends Record<string, any>>({
    data: initialData,
    columns,
    initialPageSize = 10,
    pageSizeOptions = [5, 10, 25, 50],
    showPagination = true,
    showSearch = true,
    searchPlaceholder = 'Buscar...',
    className,
    onRowClick,
}: DataTableProps<T>) {
    // State
    const [data, setData] = useState<T[]>(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchQuery, setSearchQuery] = useState('');

    // Derived state
    const filteredData = React.useMemo(() => {
        if (!searchQuery.trim()) return data;

        return data.filter((item) => {
            return Object.values(item).some((value) => {
                if (value === null || value === undefined) return false;
                return String(value)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            });
        });
    }, [data, searchQuery]);

    const sortedData = React.useMemo(() => {
        if (!sortColumn) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (aValue === bValue) return 0;

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            const direction = sortDirection === 'asc' ? 1 : -1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return aValue.localeCompare(bValue) * direction;
            }

            return (aValue > bValue ? 1 : -1) * direction;
        });
    }, [filteredData, sortColumn, sortDirection]);

    const paginatedData = React.useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return sortedData.slice(start, end);
    }, [sortedData, currentPage, pageSize]);

    const totalPages = Math.ceil(sortedData.length / pageSize);

    // Handlers
    const handleSort = (columnKey: keyof T) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handlePageSizeChange = (value: string) => {
        const newPageSize = parseInt(value);
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page on page size change
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    React.useEffect(() => {
        // Update local data when external data changes
        setData(initialData);
    }, [initialData]);

    return (
        <div className={ cn('space-y-4', className) }>
            { showSearch && (
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Input
                            placeholder={ searchPlaceholder }
                            value={ searchQuery }
                            onChange={ handleSearch }
                            className="pl-3"
                        />
                    </div>
                </div>
            ) }

            <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                { columns.map((column, index) => (
                                    <th
                                        key={ index }
                                        className={ cn(
                                            'px-4 py-3 text-left bg-muted text-sm font-medium',
                                            column.sortable &&
                                                'cursor-pointer hover:bg-gray-100',
                                            column.className,
                                        ) }
                                        onClick={ () =>
                                            column.sortable &&
                                            'accessorKey' in column &&
                                            handleSort(column.accessorKey)
                                        }
                                    >
                                        <div className="flex items-center gap-1">
                                            { 'header' in column
                                                ? column.header
                                                : '' }
                                            { 'accessorKey' in column &&
                                                column.sortable &&
                                                sortColumn ===
                                                    column.accessorKey &&
                                                (sortDirection === 'asc' ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )) }
                                        </div>
                                    </th>
                                )) }
                            </tr>
                        </thead>

                        <tbody>
                            { paginatedData.length > 0 ? (
                                paginatedData.map((item, rowIndex) => (
                                    <tr
                                        key={ rowIndex }
                                        className={ cn(
                                            'border-b last:border-b-0 hover:bg-muted transition-colors',
                                            onRowClick && 'cursor-pointer',
                                        ) }
                                        onClick={ () => onRowClick?.(item) }
                                    >
                                        { columns.map((column, colIndex) => (
                                            <td
                                                key={ colIndex }
                                                className={ cn(
                                                    'px-4 py-3 text-sm',
                                                    'className' in column
                                                        ? column.className
                                                        : '',
                                                ) }
                                            >
                                                { 'cell' in column && column.cell
                                                    ? column.cell({ item })
                                                    : 'accessorKey' in column
                                                        ? item[column.accessorKey]
                                                        : null }
                                            </td>
                                        )) }
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={ columns.length }
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        No se encontraron resultados
                                    </td>
                                </tr>
                            ) }
                        </tbody>
                    </table>
                </div>
            </div>

            { showPagination && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Mostrando{ ' ' }
                        { paginatedData.length > 0
                            ? (currentPage - 1) * pageSize + 1
                            : 0 }{ ' ' }
                        a { Math.min(currentPage * pageSize, sortedData.length) }{ ' ' }
                        de { sortedData.length } resultados
                    </div>

                    <div className="flex items-center gap-2">
                        <Select
                            value={ pageSize.toString() }
                            onValueChange={ handlePageSizeChange }
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                { pageSizeOptions.map((size) => (
                                    <SelectItem
                                        key={ size }
                                        value={ size.toString() }
                                    >
                                        { size }
                                    </SelectItem>
                                )) }
                            </SelectContent>
                        </Select>

                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-l-md rounded-r-none"
                                onClick={ () => handlePageChange(1) }
                                disabled={ currentPage === 1 }
                            >
                                <ChevronsLeft className="h-4 w-4" />
                                <span className="sr-only">Primera página</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-none border-l-0"
                                onClick={ () =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={ currentPage === 1 }
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Página anterior</span>
                            </Button>
                            <div className="h-8 px-3 flex items-center justify-center border-t border-b text-sm">
                                { currentPage } / { totalPages || 1 }
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-none border-l-0"
                                onClick={ () =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={
                                    currentPage === totalPages ||
                                    totalPages === 0
                                }
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">
                                    Página siguiente
                                </span>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-r-md rounded-l-none border-l-0"
                                onClick={ () => handlePageChange(totalPages) }
                                disabled={
                                    currentPage === totalPages ||
                                    totalPages === 0
                                }
                            >
                                <ChevronsRight className="h-4 w-4" />
                                <span className="sr-only">Última página</span>
                            </Button>
                        </div>
                    </div>
                </div>
            ) }
        </div>
    );
}

export default DataTable;
