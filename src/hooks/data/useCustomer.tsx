import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchCustomersBySalesperson, fetchPayingCustomers } from '@/lib/utils';
import { UserContext } from '@/contexts/userContext';

export default function useCustomerData(
    salespersonCode: number,
    documentDate: Date,
) {
    const { jwtToken } = useContext(UserContext);

    const customersQuery = useQuery({
        queryKey: ['customers', salespersonCode, documentDate],
        queryFn: async () => {
            const res = await fetchCustomersBySalesperson(
                salespersonCode,
                documentDate,
                jwtToken,
            );
            return res.results;
        },
    });

    // Step 2: Fetch paying customers after getting customer list
    const payingCustomersQuery = useQuery({
        queryKey: ['payingCustomers', salespersonCode, documentDate],
        queryFn: async () => {
            const customers = customersQuery.data || [];

            const uniqueCustomerIds: string[] = [
                ...new Set<string>(
                    customers.map((customer: any) => customer['No_']),
                ),
            ];

            const payingRes = await fetchPayingCustomers(
                uniqueCustomerIds,
                jwtToken,
            );

            const filtered = [
                ...new Set(
                    payingRes.results.map(
                        (customer: any) => customer['Customer No_'],
                    ),
                ),
            ];

            return filtered;
        },
        enabled: !!customersQuery.data, // dependent query
    });

    return {
        customersQuery,
        payingCustomersQuery,
    };
}
