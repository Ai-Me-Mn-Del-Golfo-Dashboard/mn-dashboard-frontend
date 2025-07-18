import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchExpiredQuotes, fetchQuotesBySalespersonRange } from '@/lib/utils';
import { UserContext } from '@/contexts/userContext';

export default function useExpiredQuotes(
    salespersonCode: number,
    documentDate: Date,
    monthRange: number,
) {
    const { jwtToken } = useContext(UserContext);

    const pastQuotesQuery = useQuery({
        queryKey: ['pastQuotes', salespersonCode, documentDate],
        queryFn: async () => {
            const res = await fetchQuotesBySalespersonRange(
                salespersonCode,
                documentDate,
                jwtToken,
            );

            console.log('Past quotes by salesperson: ', res.results);

            return res.results;
        },
    });

    const expiredQuotesQuery = useQuery({
        queryKey: ['expiredQuotes', salespersonCode, documentDate, monthRange],
        queryFn: async () => {
            let uniqueQuoteIds =
                pastQuotesQuery.data?.map((quote: any) => quote['No_']) || [];

            uniqueQuoteIds = [...new Set(uniqueQuoteIds)];

            if (uniqueQuoteIds.length === 0) return [];

            const res = await fetchExpiredQuotes(
                uniqueQuoteIds,
                documentDate.toISOString(),
                monthRange,
                jwtToken,
            );

            console.log('Expired quotes: ', res.results);

            return res.results;
        },
        enabled: !!pastQuotesQuery.data,
    });

    const expiringTodayQuery = useQuery({
        queryKey: ['expiringQuotesToday', salespersonCode, documentDate],
        queryFn: async () => {
            return expiredQuotesQuery.data?.filter(
                (quote) =>
                    new Date(quote['Next Appointment Date']).toDateString() ===
                    documentDate.toDateString()
            );
        },
        enabled: !!expiredQuotesQuery.data
    });

    return {
        pastQuotesQuery,
        expiredQuotesQuery,
        expiringTodayQuery
    };
}
