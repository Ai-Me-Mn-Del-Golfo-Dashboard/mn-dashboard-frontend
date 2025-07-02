import { useContext } from 'react';
import { API_BASE_URL } from '@/lib/constants';

import { UserContext } from '@/contexts/userContext';

export default function useLogout() {
    const { setUser, setJwtToken } = useContext(UserContext);

    async function logout(email, password, code) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, code }),
            });

            if (!res.ok) {
                return {
                    success: false,
                    message: 'Signup failed. Please check your credentials.',
                };
            }

            const data = await res.json();

            setUser(data.payload);
            setJwtToken('');

            localStorage.removeItem('jwt_token');

            return {
                success: true,
                message: 'Login failed. Please check your credentials.',
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Login failed. Please check your credentials.',
            };
        }
    }

    return logout;
}
