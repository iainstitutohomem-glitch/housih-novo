import { Calendar as CalendarIcon, Clock, Lock, Sparkles, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CalendarManager = () => {
    const { session } = useAuth();
    const isAdmin = session?.user?.email === 'institutohomem@gmail.com';

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Lock size={40} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesso Restrito</h2>
                <p className="text-gray-500 max-w-sm">Esta funcionalidade está em fase de testes e disponível apenas para o administrador master no momento.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl p-8 lg:p-12 text-white shadow-xl shadow-primary-600/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <CalendarIcon size={200} />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles size={14} /> Em Breve: Google Calendar
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                        Gestão de Prazos e Reuniões.
                    </h1>
                    <p className="text-primary-50 text-lg mb-8 leading-relaxed opacity-90">
                        Estamos preparando uma integração completa com o Google Calendar. 
                        Em breve você poderá gerenciar reuniões, prazos e compromissos internos diretamente aqui no sistema, sincronizado com seu celular.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="px-6 py-3 bg-white text-primary-700 rounded-xl font-bold hover:scale-105 transition-all active:scale-95 flex items-center gap-2">
                            Conectar Agenda Google <ExternalLink size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Placeholder Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 min-h-[500px] flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
                        <CalendarIcon size={32} className="text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Visualização da Agenda</h3>
                    <p className="text-gray-500 max-w-xs mt-2">O layout mensal de compromissos aparecerá aqui assim que a conexão for estabelecida.</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 leading-relaxed">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                            <Clock size={18} className="text-primary-600" /> Próximas Pautas
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 opacity-50 grayscale italic">
                                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shrink-0" />
                                <div className="space-y-1">
                                    <div className="h-4 w-32 bg-gray-200 rounded" />
                                    <div className="h-3 w-20 bg-gray-100 rounded" />
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 opacity-50 grayscale italic">
                                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shrink-0" />
                                <div className="space-y-1">
                                    <div className="h-4 w-24 bg-gray-200 rounded" />
                                    <div className="h-3 w-28 bg-gray-100 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary-50 rounded-3xl p-6 border border-primary-100">
                        <h4 className="font-bold text-primary-900 mb-2">Dica Pro</h4>
                        <p className="text-sm text-primary-700 opacity-80 leading-relaxed">
                            Ao conectar sua conta Google, você poderá disparar links do Meet automaticamente para os participantes das tarefas e reuniões do sistema.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};
