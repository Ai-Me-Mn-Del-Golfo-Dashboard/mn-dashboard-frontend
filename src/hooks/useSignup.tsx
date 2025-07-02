import { useContext } from 'react';
import { API_BASE_URL } from '@/lib/constants';

import { UserContext } from '@/contexts/userContext';

export default function useSignup() {
    const { setUser, setJwtToken } = useContext(UserContext);

    async function signup(email, password, code) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/create`, {
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
            setJwtToken(data.token);

            localStorage.setItem('jwt_token', data.token);

            return {
                success: true,
                admin: data.payload.role === 'admin',
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

    return signup;
}
