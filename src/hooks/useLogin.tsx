import { useContext } from 'react';
import { UserContext } from '@/contexts/userContext';

import { API_BASE_URL } from '@/lib/constants';

export default function useLogin() {
    const { setUser, setJwtToken } = useContext(UserContext);

    async function login(email, password) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok)
                return {
                    success: false,
                    message: 'Login failed. Please check your credentials.',
                };

            const data = await res.json();

            setUser(data.payload);
            setJwtToken(data.token);

            localStorage.setItem('jwt_token', data.token);

            return {
                success: true,
                admin: data.payload.role === 'admin',
                message: 'Login successful.',
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Login failed. Please check your credentials.',
            };
        }
    }

    async function jwtLogin(token) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/user/data`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok)
                return {
                    success: false,
                    message: 'Login failed. Please check your credentials.',
                };

            const data = await res.json();
            return data;
        }
        catch (error) {
            return {
                success: false,
                message: 'Login failed. Please check your credentials.',
            };
        }
    }

    return { login, jwtLogin };
}
