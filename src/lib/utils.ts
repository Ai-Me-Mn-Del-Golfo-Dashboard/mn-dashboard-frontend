import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { API_BASE_URL } from './constants';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function fetchQuotesBySalesperson(
    salespersonCode: number,
    documentDate: Date,
    code: string,
) {
    const url = `${API_BASE_URL}/quotes?salespersonCode=${salespersonCode}&date=${documentDate.toISOString()}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${code}`,
            },
        });

        const json = await response.json();

        if (!response.ok) throw new Error('Failed to fetch quotes');
        return json;
    }
    catch (error) {
        console.error('Error fetching quotes:', error);
        return { quotes: [] };
    }
}

export async function fetchQuotesBySalespersonRange(
    salespersonCode: number,
    documentDate: Date,
    code: string,
) {
    const url = `${API_BASE_URL}/quotes/range?salespersonCode=${salespersonCode}&date=${documentDate.toISOString()}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${code}`,
            },
        });

        const json = await response.json();

        if (!response.ok) throw new Error('Failed to fetch quotes');
        return json;
    }
    catch (error) {
        console.error('Error fetching quotes:', error);
        return { quotes: [] };
    }
}

export async function fetchCustomersBySalesperson(
    salespersonCode: number,
    date: Date,
    code: string,
) {
    const url = `${API_BASE_URL}/customers/salesperson?salespersonCode=${salespersonCode}&date=${date.toISOString()}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${code}`,
            },
        });

        const json = await response.json();

        if (!response.ok) throw new Error('Failed to fetch customers');
        return json;
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        return { customers: [] };
    }
}

export async function fetchPayingCustomers(uniqueIds: string[], code: string) {
    const url = `${API_BASE_URL}/customers/invoice?customerNo=${uniqueIds.join(',')}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${code}`,
            },
        });

        const json = await response.json();

        if (!response.ok) throw new Error('Failed to fetch customers');
        return json;
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        return { customers: [] };
    }
}

export async function fetchExpiredQuotes(
    quoteNumbers: string[],
    date: string,
    monthRange: number,
    code: string,
) {
    const url = `${API_BASE_URL}/quotes/expired?quoteNumbers=${quoteNumbers.join(',')}&date=${date}&monthRange=${monthRange}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${code}`,
            },
        });

        const json = await response.json();

        if (!response.ok) throw new Error('Failed to fetch customers');
        return json;
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        return { customers: [] };
    }
}
