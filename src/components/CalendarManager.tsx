import { useState, useEffect, useCallback } from 'react';
import { 
    Calendar as CalendarIcon, 
    ChevronLeft, 
    ChevronRight, 
    Video, 
    Clock, 
    Plus, 
    RefreshCw, 
    ExternalLink,
    Sparkles,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface GoogleEvent {
    id: string;
    summary: string;
    description?: string;
    start: { dateTime?: string; date?: string };
    end: { dateTime?: string; date?: string };
    hangoutLink?: string;
    location?: string;
}

export const CalendarManager = () => {
    const { session, signInWithGoogle } = useAuth();
    const [events, setEvents] = useState<GoogleEvent[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isAdmin = session?.user?.email === 'institutohomem@gmail.com';
    const providerToken = session?.provider_token;

    const fetchEvents = useCallback(async () => {
        if (!providerToken) return;
        
        setIsLoading(true);
        setError(null);

        try {
            // Define o intervalo do mês atual
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

            const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfMonth}&timeMax=${endOfMonth}&singleEvents=true&orderBy=startTime`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${providerToken}`,
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Sua sessão do Google expirou. Por favor, conecte novamente.");
                }
                throw new Error("Falha ao buscar eventos do Google.");
            }

            const data = await response.json();
            setEvents(data.items || []);
        } catch (err: any) {
            console.error("Calendar Error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [currentDate, providerToken]);

    useEffect(() => {
        if (providerToken && isAdmin) {
            fetchEvents();
        }
    }, [fetchEvents, providerToken, isAdmin]);

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <CalendarIcon size={40} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesso Restrito</h2>
                <p className="text-gray-500 max-w-sm">Esta funcionalidade está disponível apenas para o administrador master.</p>
            </div>
        );
    }

    if (!providerToken) {
        return (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-xl flex flex-col items-center text-center max-w-4xl mx-auto mt-10">
                <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mb-8 animate-bounce transition-all">
                    <CalendarIcon size={40} className="text-primary-600" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Conecte sua Agenda Google</h1>
                <p className="text-gray-600 text-lg mb-10 max-w-2xl leading-relaxed">
                    Para visualizar suas pautas e compromissos internos, precisamos de permissão para ler sua agenda do Google. 
                    Tudo é feito de forma segura e os dados não são armazenados em nosso servidor.
                </p>
                <button 
                    onClick={() => signInWithGoogle()}
                    className="group relative px-8 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary-600/20 hover:bg-primary-700 hover:-translate-y-1 transition-all flex items-center gap-3"
                >
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                    CONECTAR AGORA
                </button>
                <div className="mt-8 flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Seguro</div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Privado</div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Sincronizado</div>
                </div>
            </div>
        );
    }

    // Lógica da Grade do Calendário
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    
    // Dias do mês anterior para preencher a grade
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header / Nav */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                            {isLoading ? 'Sincronizando...' : 'Sincronizado com Google'}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                        className="p-3 hover:bg-gray-100 rounded-xl bg-gray-50 text-gray-600 transition-all border border-gray-200/50"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        onClick={() => setCurrentDate(new Date())}
                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary-500 hover:text-primary-600 transition-all"
                    >
                        Hoje
                    </button>
                    <button 
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                        className="p-3 hover:bg-gray-100 rounded-xl bg-gray-50 text-gray-600 transition-all border border-gray-200/50"
                    >
                        <ChevronRight size={20} />
                    </button>
                    
                    <button 
                        onClick={() => window.open('https://calendar.google.com', '_blank')}
                        className="p-3 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-all border border-primary-100 ml-2"
                        title="Abrir no Google"
                    >
                        <ExternalLink size={20} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-700 font-medium">
                    <AlertCircle size={20} />
                    {error}
                    <button onClick={() => fetchEvents()} className="ml-auto underline text-sm">Tentar novamente</button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendário Principal */}
                <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-2 sm:p-4">
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
                            <div key={day} className="py-2 text-center text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 h-[600px]">
                        {days.map((day, idx) => {
                            const isToday = day && 
                                day === new Date().getDate() && 
                                currentDate.getMonth() === new Date().getMonth() && 
                                currentDate.getFullYear() === new Date().getFullYear();
                            
                            const dayEvents = day ? events.filter(e => {
                                const eDate = new Date(e.start.dateTime || e.start.date || '');
                                return eDate.getDate() === day;
                            }) : [];

                            return (
                                <div 
                                    key={idx} 
                                    className={`
                                        relative group rounded-xl sm:rounded-2xl border transition-all p-1 sm:p-2 flex flex-col gap-1 overflow-hidden
                                        ${day ? 'bg-white hover:border-primary-200' : 'bg-gray-50/50 border-transparent'}
                                        ${isToday ? 'border-primary-500 ring-2 ring-primary-500/10 shadow-lg shadow-primary-500/5' : 'border-gray-50'}
                                    `}
                                >
                                    {day && (
                                        <>
                                            <span className={`text-[10px] sm:text-xs font-black mb-1 ${isToday ? 'text-primary-600' : 'text-gray-400'}`}>
                                                {day < 10 ? `0${day}` : day}
                                            </span>
                                            <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                                                {dayEvents.slice(0, 4).map(event => (
                                                    <div 
                                                        key={event.id}
                                                        className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg text-[8px] sm:text-[10px] font-bold truncate transition-colors ${
                                                            event.hangoutLink 
                                                            ? 'bg-blue-50 text-blue-700 border border-blue-100 border-l-4 border-l-blue-400' 
                                                            : 'bg-primary-50 text-primary-700 border border-primary-100 border-l-4 border-l-primary-400'
                                                        }`}
                                                        title={event.summary}
                                                    >
                                                        {event.summary}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 4 && (
                                                    <div className="text-[8px] sm:text-[10px] font-black text-gray-300 pl-2">
                                                        + {dayEvents.length - 4} mais
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar com Próximas Pautas */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col h-full max-h-[660px]">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center justify-between">
                            Próximas Pautas
                            <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-md flex items-center justify-center text-[10px]">{events.length}</span>
                        </h3>
                        
                        <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar flex-1">
                            {isLoading && events.length === 0 ? (
                                [1,2,3].map(i => <div key={i} className="h-24 bg-gray-50 rounded-2xl animate-pulse" />)
                            ) : events.length === 0 ? (
                                <div className="text-center py-12 px-4 italic text-gray-400 text-xs">
                                    Nenhuma pauta encontrada para este período.
                                </div>
                            ) : (
                                events.map((event) => {
                                    const startTime = event.start.dateTime 
                                        ? new Date(event.start.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                        : 'Todo dia';
                                    const startDate = new Date(event.start.dateTime || event.start.date || '').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

                                    return (
                                        <div key={event.id} className="group p-4 bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-primary-100/30 border border-transparent hover:border-primary-100 rounded-3xl transition-all">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-lg uppercase tracking-widest">{startDate}</span>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                                    <Clock size={12} /> {startTime}
                                                </div>
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-800 mb-3 group-hover:text-primary-700 transition-colors">{event.summary}</h4>
                                            
                                            {event.hangoutLink && (
                                                <button 
                                                    onClick={() => window.open(event.hangoutLink, '_blank')}
                                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                                                >
                                                    <Video size={16} /> Entrar na Reunião
                                                </button>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div className="bg-primary-600 text-white p-6 rounded-3xl shadow-xl shadow-primary-600/20 relative overflow-hidden group">
                        <Plus size={80} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold mb-2 flex items-center gap-2">Nova Pauta?</h4>
                        <p className="text-[10px] opacity-80 leading-relaxed mb-4">Adicione uma nova reunião diretamente no seu Google Calendar e ela aparecerá aqui instantaneamente.</p>
                        <button 
                            onClick={() => window.open('https://calendar.google.com/calendar/u/0/r/eventedit', '_blank')}
                            className="w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        >
                            Acrescentar no Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
