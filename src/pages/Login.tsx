import { useState, type FormEvent } from 'react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import LoadingScreen from '@/components/loading';

import { useNavigate } from 'react-router-dom';
import useLogin from '@/hooks/useLogin';
import useSignup from '@/hooks/useSignup';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useLogin();
    const signup = useSignup();

    const [isLoading, setLoading] = useState(false);
    const [isLogin, updateLogin] = useState(true);

    const [salespersonCode, updateSalespersonCode] = useState(0);
    const [email, updateEmail] = useState('');

    const [password, setPassword] = useState('');
    const [state, updateState] = useState<{ message?: string }>({});

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        let result;

        if (isLogin) {
            result = await login(email, password);
        }
        else {
            const number = Number.parseInt(formData.get('number') as string);

            result = await signup(email, password, number);
        }

        if (result.success) {
            if (result.admin) navigate('/admin');
            else navigate('/');
        }
        else {
            updateState(result);
            setLoading(false);
        }
    }

    if (isLoading) return <LoadingScreen text="Cargando usario..." />;

    return (
        <Card className="flex flex-col gap-5 w-full max-w-md mx-auto my-40 p-5">
            <h1 className="text-xl font-bold">Login</h1>

            <form onSubmit={ handleLogin } className="flex flex-col gap-4">
                <div className="space-y-4">
                    { !isLogin && (
                        <div className="space-y-2">
                            <Label htmlFor="email">Número</Label>

                            <Input
                                id="number"
                                name="number"
                                type="number"
                                required
                                value={ salespersonCode }
                                onChange={ (e) =>
                                    updateSalespersonCode(
                                        Number.parseInt(e.target.value),
                                    )
                                }
                                placeholder="example@example.com"
                            />
                        </div>
                    ) }

                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={ email }
                            onChange={ (e) => updateEmail(e.target.value) }
                            placeholder="example@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>

                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={ password }
                            onChange={ (e) => setPassword(e.target.value) }
                            placeholder="Contraseña"
                        />
                    </div>

                    { state?.message && (
                        <div className="flex items-center space-x-2 text-red-500">
                            <Badge />
                            <span className="text-sm">{ state.message }</span>
                        </div>
                    ) }
                </div>

                <div>
                    <Button
                        className="w-full"
                        type="submit"
                        disabled={ isLoading }
                    >
                        { isLoading ? 'Logging in...' : 'Log in' }
                    </Button>
                </div>

                <div className="text-center">
                    <Button
                        variant="link"
                        className="text-sm"
                        onClick={ () => updateLogin(!isLogin) }
                    >
                        { isLogin
                            ? '¿No tienes una cuenta? Regístrate aquí'
                            : '¿Ya tienes una cuenta? Inicia sesión aquí' }
                    </Button>
                </div>
            </form>
        </Card>
    );
}
