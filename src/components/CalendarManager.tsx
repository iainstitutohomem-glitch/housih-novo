import { useState, useEffect, useCallback, useRef } from 'react';
import { 
    Calendar as CalendarIcon, 
    ChevronLeft, 
    ChevronRight, 
    Video, 
    Clock, 
    RefreshCw, 
    ExternalLink,
    Sparkles,
    CheckCircle2,
    X,
    MapPin,
    AlignLeft
} from 'lucide-react';
import { 
    format, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    addDays, 
    eachDayOfInterval, 
    isSameDay, 
    isSameMonth, 
    startOfDay, 
    endOfDay,
    addMonths,
    subMonths,
    isPast,
    isAfter,
    differenceInMinutes
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

type ViewMode = 'day' | 'week' | 'month';

export const CalendarManager = () => {
    const { session, signInWithGoogle } = useAuth();
    const [events, setEvents] = useState<GoogleEvent[]>([]);
    const [viewDate, setViewDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<GoogleEvent | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const isAdmin = session?.user?.email === 'institutohomem@gmail.com';
    const providerToken = session?.provider_token;

    // Atualiza o marcador de tempo atual a cada minuto
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const fetchEvents = useCallback(async () => {
        if (!providerToken) return;
        
        setIsLoading(true);
        setError(null);

        try {
            // Busca um intervalo maior para cobrir as trocas de vista
            const start = startOfMonth(viewDate).toISOString();
            const end = endOfMonth(viewDate).toISOString();

            const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime`;
            
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${providerToken}` }
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error("Sessão expirada. Reconecte o Google.");
                throw new Error("Erro ao carregar agenda.");
            }

            const data = await response.json();
            setEvents(data.items || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [viewDate, providerToken]);

    useEffect(() => {
        if (providerToken && isAdmin) fetchEvents();
    }, [fetchEvents, providerToken, isAdmin]);

    if (!isAdmin) return <AccessDenied />;
    if (!providerToken) return <ConnectGoogle onConnect={signInWithGoogle} />;

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-20 lg:pb-0">
            {/* Header / Nav */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <CalendarIcon size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 capitalize">
                            {format(viewDate, 'MMMM yyyy', { locale: ptBR })}
                        </h2>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-orange-400 animate-pulse' : 'bg-green-500'}`} />
                            {isLoading ? 'Sincronizando...' : 'Google Calendar Ativo'}
                        </div>
                    </div>
                </div>

                <div className="flex items-center bg-gray-100 p-1 rounded-2xl">
                    {(['day', 'week', 'month'] as ViewMode[]).map(mode => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                viewMode === mode ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setViewDate(d => addMonths(d, -1))} className="p-2.5 hover:bg-gray-100 rounded-xl bg-gray-50 text-gray-600 transition-all border border-gray-200/50">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setViewDate(new Date())} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary-500 transition-all">Hoje</button>
                    <button onClick={() => setViewDate(d => addMonths(d, 1))} className="p-2.5 hover:bg-gray-100 rounded-xl bg-gray-50 text-gray-600 transition-all border border-gray-200/50">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                {viewMode === 'month' && <MonthView date={viewDate} events={events} onEventClick={setSelectedEvent} />}
                {viewMode === 'week' && <TimeGridView date={viewDate} days={7} events={events} onEventClick={setSelectedEvent} currentTime={currentTime} />}
                {viewMode === 'day' && <TimeGridView date={viewDate} days={1} events={events} onEventClick={setSelectedEvent} currentTime={currentTime} />}
            </div>

            {/* Event Details Modal */}
            {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </div>
    );
};

// --- Sub-Components Para Vistas ---

const MonthView = ({ date, events, onEventClick }: { date: Date, events: GoogleEvent[], onEventClick: (e: GoogleEvent) => void }) => {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));
    const days = eachDayOfInterval({ start, end });

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="grid grid-cols-7 border-b border-gray-100 py-3 bg-gray-50/50">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                    <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{d}</div>
                ))}
            </div>
            <div className="flex-1 grid grid-cols-7 grid-rows-5 sm:grid-rows-6">
                {days.map((day, i) => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.start.dateTime || e.start.date || ''), day));
                    const isOutside = !isSameMonth(day, date);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={i} className={`border-r border-b border-gray-50 p-1 flex flex-col gap-1 min-h-[100px] transition-colors hover:bg-gray-50/30 ${isOutside ? 'opacity-30' : ''}`}>
                            <span className={`text-[10px] font-black p-1.5 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary-600 text-white' : 'text-gray-400'}`}>
                                {format(day, 'd')}
                            </span>
                            <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                                {dayEvents.map(e => {
                                    const isPastEvent = isPast(new Date(e.end?.dateTime || e.end?.date || ''));
                                    return (
                                        <button 
                                            key={e.id}
                                            onClick={() => onEventClick(e)}
                                            className={`w-full text-left px-2 py-1 rounded-lg text-[9px] font-bold truncate border-l-4 transition-all hover:scale-[1.02] ${
                                                isPastEvent ? 'opacity-40 grayscale' : ''
                                            } ${e.hangoutLink ? 'bg-blue-50 text-blue-700 border-l-blue-500' : 'bg-primary-50 text-primary-700 border-l-primary-500'}`}
                                        >
                                            {e.summary}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const TimeGridView = ({ date, days, events, onEventClick, currentTime }: { date: Date, days: number, events: GoogleEvent[], onEventClick: (e: GoogleEvent) => void, currentTime: Date }) => {
    const start = days === 1 ? startOfDay(date) : startOfWeek(date);
    const weekDays = eachDayOfInterval({ start, end: addDays(start, days - 1) });
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll para o horário comercial
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 450; 
    }, []);

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className={`grid border-b border-gray-100 bg-gray-50/50`} style={{ gridTemplateColumns: `60px repeat(${days}, 1fr)` }}>
                <div className="border-r border-gray-100"></div>
                {weekDays.map(day => (
                    <div key={day.toISOString()} className="py-4 text-center">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{format(day, 'EEE', { locale: ptBR })}</div>
                        <div className={`mt-1 text-lg font-black ${isSameDay(day, new Date()) ? 'text-primary-600' : 'text-gray-800'}`}>{format(day, 'd')}</div>
                    </div>
                ))}
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto relative no-scrollbar">
                <div className="relative" style={{ height: '1440px', gridTemplateColumns: `60px repeat(${days}, 1fr)` }}>
                    {/* Time Lines */}
                    {hours.map(h => (
                        <div key={h} className="absolute w-full border-b border-gray-100/50 pointer-events-none" style={{ top: `${h * 60}px`, height: '60px' }}>
                            <span className="absolute -top-3 left-2 text-[9px] font-bold text-gray-300">{h}:00</span>
                        </div>
                    ))}

                    <div className="grid h-full" style={{ gridTemplateColumns: `60px repeat(${days}, 1fr)` }}>
                        <div className="border-r border-gray-100"></div>
                        {weekDays.map(day => {
                            const dayEvents = events.filter(e => isSameDay(new Date(e.start.dateTime || e.start.date || ''), day));
                            const itIsToday = isSameDay(day, new Date());

                            return (
                                <div key={day.toISOString()} className="relative border-r border-gray-50 h-full bg-white/40">
                                    {/* Marcador de Tempo Atual */}
                                    {itIsToday && (
                                        <div 
                                            className="absolute left-0 right-0 z-20 flex items-center group pointer-events-none" 
                                            style={{ top: `${(currentTime.getHours() * 60) + currentTime.getMinutes()}px` }}
                                        >
                                            <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 border-2 border-white shadow-sm" />
                                            <div className="flex-1 border-t-2 border-red-500/80" />
                                        </div>
                                    )}

                                    {dayEvents.map(e => {
                                        const startT = new Date(e.start.dateTime || '');
                                        const endT = new Date(e.end.dateTime || '');
                                        const top = (startT.getHours() * 60) + startT.getMinutes();
                                        const duration = differenceInMinutes(endT, startT);
                                        const isPastE = isPast(endT);

                                        return (
                                            <button 
                                                key={e.id}
                                                onClick={() => onEventClick(e)}
                                                className={`absolute left-1 right-2 p-2 rounded-xl text-left border-l-4 overflow-hidden transition-all hover:z-30 hover:shadow-2xl hover:scale-[1.01] ${
                                                    isPastE ? 'opacity-40 grayscale text-[9px]' : 'text-xs'
                                                } ${e.hangoutLink ? 'bg-blue-50 text-blue-700 border-blue-500' : 'bg-primary-50 text-primary-700 border-primary-500'}`}
                                                style={{ top: `${top}px`, height: `${Math.max(duration, 30)}px` }}
                                            >
                                                <div className="font-black truncate ">{e.summary}</div>
                                                <div className="text-[10px] opacity-70 mt-0.5">{format(startT, 'HH:mm')} - {format(endT, 'HH:mm')}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const EventModal = ({ event, onClose }: { event: GoogleEvent, onClose: () => void }) => {
    const start = new Date(event.start.dateTime || event.start.date || '');
    const end = new Date(event.end.dateTime || event.end.date || '');
    const isPastEvent = isPast(end);

    return (
        <div className="fixed inset-0 z-[30000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className={`p-6 flex justify-between items-start text-white ${event.hangoutLink ? 'bg-blue-600' : 'bg-primary-600'}`}>
                    <div className="pr-8">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded mb-3 w-fit">
                            <Clock size={12} /> {isPastEvent ? 'Finalizado' : 'Em breve'}
                        </div>
                        <h3 className="text-2xl font-black leading-tight">{event.summary}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                            <Clock size={20} className="text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-800">
                                {format(start, "d 'de' MMMM", { locale: ptBR })}
                            </p>
                            <p className="text-xs text-gray-400 font-bold">
                                {format(start, 'HH:mm')} até {format(end, 'HH:mm')}
                            </p>
                        </div>
                    </div>

                    {event.location && (
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                <MapPin size={20} className="text-gray-400" />
                            </div>
                            <div className="text-sm text-gray-600 font-medium">{event.location}</div>
                        </div>
                    )}

                    {event.description && (
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                <AlignLeft size={20} className="text-gray-400" />
                            </div>
                            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</div>
                        </div>
                    )}

                    {event.hangoutLink && (
                        <button 
                            onClick={() => window.open(event.hangoutLink, '_blank')}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1"
                        >
                            <Video size={20} /> Entrar na Reunião
                        </button>
                    )}
                </div>
                
                <div className="px-8 pb-6 text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center">
                    ID: {event.id}
                </div>
            </div>
        </div>
    );
};

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
            <X size={40} className="text-red-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tighter">Acesso Restrito</h2>
        <p className="text-gray-400 max-w-sm text-sm font-medium">Esta aba contém dados estratégicos da agenda e está reservada apenas ao administrador master.</p>
    </div>
);

const ConnectGoogle = ({ onConnect }: { onConnect: () => void }) => (
    <div className="max-w-4xl mx-auto mt-20 p-12 bg-white rounded-[40px] border border-gray-100 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <Sparkles size={300} />
        </div>
        <div className="w-24 h-24 bg-primary-50 rounded-[32px] flex items-center justify-center mb-10 shadow-inner">
            <CalendarIcon size={48} className="text-primary-600" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">Sincronize sua Equipe.</h1>
        <p className="text-gray-500 text-lg mb-12 max-w-2xl leading-relaxed font-medium">
            Ative a integração nativa com o Google Calendar para visualizar prazos, pautas e conferências diretamente no seu fluxo de trabalho.
        </p>
        <button 
            onClick={onConnect}
            className="group relative px-10 py-5 bg-primary-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary-600/30 hover:bg-primary-700 hover:scale-[1.02] transition-all flex items-center gap-4 active:scale-95"
        >
            <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
            Conectar Google Calendar
        </button>
        <div className="mt-12 flex items-center gap-8 text-[11px] font-black text-gray-300 uppercase tracking-widest">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> 256-bit Encrypted</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Read-only Scope</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Real-time Sync</span>
        </div>
    </div>
);
