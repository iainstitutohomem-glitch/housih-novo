import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
    const navigate = useNavigate();
    const { session } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Prevenir acesso à login se já estiver autenticado
    React.useEffect(() => {
        if (session) {
            navigate('/dashboard', { replace: true });
        }
    }, [session, navigate]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        let error;

        if (isSignUp) {
            if (!name.trim()) {
                setErrorMsg('O nome é obrigatório para cadastro na Equipe.');
                setLoading(false);
                return;
            }

            const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password });
            error = signUpError;
            if (!error && authData.user) {
                // Injetar o usuário automaticamente na aba Equipe do CRM!
                const { error: teamError } = await supabase.from('team_members').insert([{
                    name,
                    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
                }]);

                if (teamError) {
                    console.error("Erro ao inserir na Equipe:", teamError);
                    alert('Conta criada, mas houve um erro ao adicionar seu nome à Equipe: ' + teamError.message);
                } else {
                    alert('Conta registrada! Seu nome já foi adicionado à Equipe.');
                }
            }
        } else {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            error = signInError;
        }

        if (error) {
            setErrorMsg(error.message);
        } else {
            navigate('/dashboard');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex-1 bg-gradient-to-br from-gray-50 to-primary-50/30 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-orange-400/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-4">
                    <img src="/logo.png" alt="Housih Logo" className="h-7 object-contain drop-shadow-sm" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Acesse sua conta
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 font-medium">
                    housih. - Soluções Inteligentes
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-white">
                    {errorMsg && (
                        <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center">
                            {errorMsg}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleAuth}>
                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Seu Nome (Aparecerá no CRM)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        required={isSignUp}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all"
                                    />
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Lembrar de mim
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                                    Esqueceu a senha?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Processando...' : (isSignUp ? 'Criar Conta' : 'Entrar no Sistema')}
                            </button>
                        </div>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-500">
                                {isSignUp ? 'Já possui conta?' : 'Ainda não é cadastrado?'}
                            </span>{' '}
                            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-primary-600 hover:text-primary-500 border-b border-transparent hover:border-primary-500 transition-colors">
                                {isSignUp ? 'Entrar agora' : 'Criar minha conta'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
