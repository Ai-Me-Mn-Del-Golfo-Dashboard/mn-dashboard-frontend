import { useState, createContext, PropsWithChildren, useEffect } from 'react';
import useLogin from '@/hooks/useLogin';

import LoadingScreen from '@/components/loading';

interface User {
    role: string;
    code: number;
    email: string;
    id: string;
}

export const UserContext = createContext({
    user: null as User | null,
    jwtToken: '',
    setJwtToken: (_token: string) => {},
    setUser: (_user: User) => {},
});

export default function UserContextWrapper({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);

    const [jwtToken, setJwtToken] = useState('');

    const [isLoading, setLoading] = useState(true);

    const { jwtLogin } = useLogin();

    function firstLoad() {
        const token = localStorage.getItem('jwt_token');

        if (!token) {
            setLoading(false);
            return;
        }

        (async function cachedLogin() {
            const cachedUser = await jwtLogin(token);

            if (cachedUser.success === false) {
                localStorage.removeItem('jwt_token');
                setLoading(false);

                return;
            }

            setUser(cachedUser);
            setJwtToken(token);
            setLoading(false);
        })();
    }

    useEffect(firstLoad, []);

    return (
        <UserContext.Provider
            value={ {
                user,
                jwtToken,
                setUser,
                setJwtToken,
            } }
        >
            { isLoading ? (
                <div className="bg-foreground h-screen w-screen flex items-center justify-center">
                    <LoadingScreen text="Cargando usario..." />
                </div>
            ) : (
                <>{ children }</>
            ) }
        </UserContext.Provider>
    );
}
