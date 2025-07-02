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

            console.log(res.results, 'pastQuotesQuery results');

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

            console.log(res.results, 'expiredQuotesQuery results');

            return res.results;
        },
        enabled: !!pastQuotesQuery.data,
    });

    return {
        pastQuotesQuery,
        expiredQuotesQuery,
    };
}
