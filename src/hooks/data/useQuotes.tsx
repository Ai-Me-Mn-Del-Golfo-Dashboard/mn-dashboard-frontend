import { UserContext } from '@/contexts/userContext';
import { fetchQuotesBySalesperson } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export default function useQuotes(salespersonCode: number, documentDate: Date) {
    const { jwtToken } = useContext(UserContext);

    return useQuery({
        queryKey: ['quotes', salespersonCode, documentDate],
        queryFn: async () => {
            const res = await fetchQuotesBySalesperson(
                salespersonCode,
                documentDate,
                jwtToken,
            );

            console.log('Quotes by salesperson: ', res.results);

            return res.results;
        },
    });
}
