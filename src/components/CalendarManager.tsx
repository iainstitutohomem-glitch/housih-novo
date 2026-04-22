import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
    Calendar as CalendarIcon, 
    ChevronLeft, 
    ChevronRight, 
    Video, 
    Sparkles,
    CheckCircle2,
    X,
    AlignLeft,
    Plus,
    Users,
    AlertCircle,
    MapPin,
    Eye,
    Bell,
    Clock,
    Layout
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
    addMonths,
    isPast,
    differenceInMinutes,
    addMinutes,
    isWithinInterval
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import { supabase } from '../lib/supabase';

interface GoogleEvent {
    id: string;
    summary: string;
    description?: string;
    start: { dateTime?: string; date?: string };
    end: { dateTime?: string; date?: string };
    hangoutLink?: string;
    location?: string;
    owner_email?: string; // Virtual field for team events
}

type ViewMode = 'day' | 'week' | 'month';

export const CalendarManager = () => {
    const { session, signInWithGoogle } = useAuth();
    const { teamMembers } = useTasks();
    const [localEvents, setLocalEvents] = useState<GoogleEvent[]>([]);
    const [teamEvents, setTeamEvents] = useState<GoogleEvent[]>([]);
    const [viewDate, setViewDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<GoogleEvent | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const providerToken = session?.provider_token;
    const userEmail = session?.user?.email;

    // Sincroniza eventos locais para o cache do Supabase para que outros vejam
    const syncToCache = async (events: GoogleEvent[]) => {
        if (!userEmail || !session?.user?.id) return;

        const cacheData = events.map(e => ({
            id: e.id,
            user_id: session.user.id,
            summary: e.summary,
            description: e.description || '',
            start_time: e.start.dateTime || e.start.date,
            end_time: e.end.dateTime || e.end.date,
            hangout_link: e.hangoutLink || '',
            location: e.location || '',
            owner_email: userEmail,
            updated_at: new Date().toISOString()
        }));

        if (cacheData.length > 0) {
            await supabase.from('team_events_cache').upsert(cacheData);
        }
    };

    // Busca eventos da equipe (cache)
    const fetchTeamEvents = useCallback(async () => {
        const { data, error } = await supabase
            .from('team_events_cache')
            .select('*')
            .neq('owner_email', userEmail || '');

        if (!error && data) {
            const formatted: GoogleEvent[] = data.map(d => ({
                id: d.id,
                summary: d.summary,
                description: d.description,
                start: { dateTime: d.start_time },
                end: { dateTime: d.end_time },
                hangoutLink: d.hangout_link,
                location: d.location,
                owner_email: d.owner_email
            }));
            setTeamEvents(formatted);
        }
    }, [userEmail]);

    // Busca eventos pessoais (Google Live)
    const fetchLocalEvents = useCallback(async () => {
        if (!providerToken) return;
        
        setIsLoading(true);
        try {
            const start = startOfMonth(viewDate).toISOString();
            const end = endOfMonth(viewDate).toISOString();

            const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime`;
            
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${providerToken}` }
            });

            if (response.ok) {
                const data = await response.json();
                const fetched = data.items || [];
                setLocalEvents(fetched);
                syncToCache(fetched); // Sincroniza com o time
            }
        } catch (err) {
            console.error("Calendar fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [viewDate, providerToken, userEmail]);

    useEffect(() => {
        if (providerToken) {
            fetchLocalEvents();
            fetchTeamEvents();
        }
    }, [fetchLocalEvents, fetchTeamEvents, providerToken]);

    // Mescla eventos locais e da equipe
    const allEvents = useMemo(() => {
        // Marcamos os eventos locais com o email do usuário logado
        const localWithEmail = localEvents.map(e => ({ ...e, owner_email: userEmail }));
        return [...localWithEmail, ...teamEvents];
    }, [localEvents, teamEvents, userEmail]);

    // Atualiza o marcador de tempo atual
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    if (!providerToken) return <ConnectGoogle onConnect={signInWithGoogle} />;

    return (
        <div className="h-full flex flex-col space-y-4 lg:space-y-6 animate-in fade-in duration-500 pb-20 lg:pb-0">
            {/* Header */}
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
                            {isLoading ? 'Sincronizando Equipe...' : 'Rede Housih Conectada'}
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
                    <button 
                        onClick={() => setIsBookingModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 mr-2"
                    >
                        <Plus size={16} /> Nova Pauta
                    </button>
                    <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                        <button onClick={() => setViewDate(d => addMonths(d, -1))} className="p-2 hover:bg-white rounded-lg text-gray-400 transition-all">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={() => setViewDate(new Date())} className="px-3 py-1 text-[9px] font-black uppercase text-gray-500">Hoje</button>
                        <button onClick={() => setViewDate(d => addMonths(d, 1))} className="p-2 hover:bg-white rounded-lg text-gray-400 transition-all">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </header>

            {/* View Area */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                {viewMode === 'month' && <MonthView date={viewDate} events={allEvents} onEventClick={setSelectedEvent} team={teamMembers} />}
                {(viewMode === 'week' || viewMode === 'day') && (
                    <TimeGridView 
                        date={viewDate} 
                        days={viewMode === 'week' ? 7 : 1} 
                        events={allEvents} 
                        onEventClick={setSelectedEvent} 
                        currentTime={currentTime} 
                        team={teamMembers}
                    />
                )}
            </div>

            {/* Modals */}
            {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} team={teamMembers} />}
            {isBookingModalOpen && (
                <BookingModal 
                    onClose={() => setIsBookingModalOpen(false)} 
                    team={teamMembers} 
                    providerToken={providerToken}
                    allEvents={allEvents}
                    onSuccess={fetchLocalEvents}
                />
            )}
        </div>
    );
};

// --- Sub-Components ---

const MonthView = ({ date, events, onEventClick, team }: { date: Date, events: GoogleEvent[], onEventClick: (e: GoogleEvent) => void, team: any[] }) => {
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
            <div className="flex-1 grid grid-cols-7">
                {days.map((day, i) => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.start.dateTime || e.start.date || ''), day));
                    const isOutside = !isSameMonth(day, date);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={i} className={`border-r border-b border-gray-50 p-1 flex flex-col gap-1 min-h-[120px] transition-colors hover:bg-gray-50/30 ${isOutside ? 'opacity-30 grayscale' : ''}`}>
                            <span className={`text-[10px] font-black p-1.5 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary-600 text-white' : 'text-gray-400'}`}>
                                {format(day, 'd')}
                            </span>
                            <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar pb-2">
                                {dayEvents.map(e => {
                                    const member = team.find(m => m.email?.toLowerCase() === e.owner_email?.toLowerCase());
                                    const isPastEvent = isPast(new Date(e.end?.dateTime || e.end?.date || ''));
                                    return (
                                        <button 
                                            key={e.id}
                                            onClick={() => onEventClick(e)}
                                            className={`w-full flex items-center gap-1.5 text-left pl-1.5 pr-1 py-1 rounded-lg text-[9px] font-bold border-l-4 transition-all hover:scale-[1.02] group ${
                                                isPastEvent ? 'opacity-40 grayscale' : ''
                                            } ${e.hangoutLink ? 'bg-blue-50 text-blue-700 border-l-blue-500' : 'bg-primary-50 text-primary-700 border-l-primary-500'}`}
                                        >
                                            {member?.avatar_url && (
                                                <img src={member.avatar_url} className="w-4 h-4 rounded-full border border-white shrink-0 shadow-sm" alt="" />
                                            )}
                                            <span className="truncate flex-1">{e.summary}</span>
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

const TimeGridView = ({ date, days, events, onEventClick, currentTime, team }: { date: Date, days: number, events: GoogleEvent[], onEventClick: (e: GoogleEvent) => void, currentTime: Date, team: any[] }) => {
    const start = days === 1 ? startOfDay(date) : startOfWeek(date);
    const weekDays = eachDayOfInterval({ start, end: addDays(start, days - 1) });
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const scrollRef = useRef<HTMLDivElement>(null);

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
                <div className="relative" style={{ height: '1440px' }} >
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
                                        const startT = new Date(e.start.dateTime || e.start.date || '');
                                        const endT = new Date(e.end.dateTime || e.end.date || '');
                                        const top = (startT.getHours() * 60) + startT.getMinutes();
                                        const duration = differenceInMinutes(endT, startT);
                                        const isPastE = isPast(endT);
                                        const member = team.find(m => m.email?.toLowerCase() === e.owner_email?.toLowerCase());

                                        return (
                                            <button 
                                                key={e.id}
                                                onClick={() => onEventClick(e)}
                                                className={`absolute left-1 right-2 p-2 rounded-xl text-left border-l-4 overflow-hidden transition-all hover:z-30 hover:shadow-2xl hover:scale-[1.01] ${
                                                    isPastE ? 'opacity-40 grayscale text-[9px]' : 'text-xs'
                                                } ${e.hangoutLink ? 'bg-blue-50 text-blue-700 border-blue-500' : 'bg-primary-50 text-primary-700 border-primary-500'}`}
                                                style={{ top: `${top}px`, height: `${Math.max(duration, 30)}px` }}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    {member?.avatar_url && (
                                                        <img src={member.avatar_url} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" />
                                                    )}
                                                    <div className="font-black truncate flex-1">{e.summary}</div>
                                                </div>
                                                <div className="text-[10px] opacity-70">{format(startT, 'HH:mm')} - {format(endT, 'HH:mm')}</div>
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

// --- Modals ---

const EventModal = ({ event, onClose, team }: { event: GoogleEvent, onClose: () => void, team: any[] }) => {
    const start = new Date(event.start.dateTime || event.start.date || '');
    const end = new Date(event.end.dateTime || event.end.date || '');
    const isPastEvent = isPast(end);
    const member = team.find(m => m.email?.toLowerCase() === event.owner_email?.toLowerCase());

    return (
        <div className="fixed inset-0 z-[30000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                <div className={`p-8 flex justify-between items-start text-white bg-gradient-to-br ${event.hangoutLink ? 'from-blue-600 to-blue-500' : 'from-primary-600 to-primary-500'}`}>
                    <div className="pr-8">
                        <div className="flex items-center gap-3 mb-6">
                            {member?.avatar_url && (
                                <img src={member.avatar_url} className="w-12 h-12 rounded-2xl border-2 border-white/20 shadow-xl" />
                            )}
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-0.5">Proprietário</div>
                                <div className="text-sm font-bold">{member?.name || event.owner_email || 'Externo'}</div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-black leading-tight tracking-tight">{event.summary}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-2xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Início</div>
                            <div className="font-black text-gray-800">{format(start, "HH:mm")}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fim</div>
                            <div className="font-black text-gray-800">{format(end, "HH:mm")}</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                            <CalendarIcon size={20} className="text-primary-600" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-800 uppercase tracking-tight">
                                {format(start, "EEEE, d 'de' MMMM", { locale: ptBR })}
                            </p>
                            <p className="text-xs text-gray-400 font-bold">{isPastEvent ? 'Reunião Finalizada' : 'Em andamento'}</p>
                        </div>
                    </div>

                    {event.description && (
                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <AlignLeft size={14} /> Pauta da Reunião
                            </div>
                            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">{event.description}</div>
                        </div>
                    )}

                    {event.hangoutLink && !isPastEvent && (
                        <button 
                            onClick={() => window.open(event.hangoutLink, '_blank')}
                            className="w-full flex items-center justify-center gap-4 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1"
                        >
                            <Video size={20} /> Participar via Google Meet
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const BookingModal = ({ onClose, team, providerToken, allEvents, onSuccess }: { onClose: () => void, team: any[], providerToken: string, allEvents: GoogleEvent[], onSuccess: () => void }) => {
    const [title, setTitle] = useState('');
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [startTime, setStartTime] = useState(format(addMinutes(new Date(), 30), 'HH:00'));
    const [endTime, setEndTime] = useState(format(addMinutes(new Date(), 90), 'HH:00'));
    const [description, setDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [externalEmails, setExternalEmails] = useState('');
    const [location, setLocation] = useState('');
    const [visibility, setVisibility] = useState('default'); 
    const [transparency, setTransparency] = useState('opaque'); 
    const [reminderMinutes, setReminderMinutes] = useState(30);
    const [bookingType, setBookingType] = useState('event'); 
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const conflicts = useMemo(() => {
        const startDt = new Date(`${selectedDate}T${startTime}:00`);
        const endDt = new Date(`${selectedDate}T${endTime}:00`);
        return allEvents.filter(e => {
            const eStart = new Date(e.start.dateTime || e.start.date || '');
            const eEnd = new Date(e.end.dateTime || e.end.date || '');
            const isParticipating = selectedMembers.some(email => e.owner_email?.toLowerCase() === email.toLowerCase());
            return isParticipating && (
                isWithinInterval(startDt, { start: eStart, end: eEnd }) ||
                isWithinInterval(endDt, { start: eStart, end: eEnd }) ||
                (startDt < eStart && endDt > eEnd)
            );
        });
    }, [selectedDate, startTime, endTime, selectedMembers, allEvents]);

    const handleSave = async () => {
        if (!title) return;
        setIsSaving(true);
        setError(null);
        try {
            const attendees = [
                ...selectedMembers.map(email => ({ email })),
                ...externalEmails.split(',').map(e => ({ email: e.trim() })).filter(e => e.email)
            ];
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const eventData = {
                summary: title,
                description,
                start: { dateTime: `${selectedDate}T${startTime}:00`, timeZone: userTimeZone },
                end: { dateTime: `${selectedDate}T${endTime}:00`, timeZone: userTimeZone },
                location,
                visibility,
                transparency,
                reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: reminderMinutes }] },
                attendees,
                conferenceData: { createRequest: { requestId: `housih-${Date.now()}`, conferenceSolutionKey: { type: 'hangoutsMeet' } } }
            };
            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${providerToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Erro ao criar evento.");
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[40000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                {/* Header Compacto */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl">
                        {(['event', 'task', 'slot'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setBookingType(type)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    bookingType === type ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {type === 'event' ? 'Evento' : type === 'task' ? 'Tarefa' : 'Agenda'}
                            </button>
                        ))}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 p-8 overflow-y-auto no-scrollbar space-y-8">
                    {/* Título - Impactante e Profissional */}
                    <input 
                        type="text" 
                        placeholder="Adicionar título" 
                        className="w-full px-0 py-1 bg-transparent border-b-2 border-gray-100 focus:border-primary-500 outline-none text-3xl font-black text-gray-900 transition-all placeholder:text-gray-200"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        autoFocus
                    />

                    {/* Blocos de Informação */}
                    <div className="space-y-6">
                        {/* Data e Hora Row */}
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center text-gray-400 shrink-0">
                                <Clock size={20} />
                            </div>
                            <div className="flex-1 flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <input type="date" className="bg-transparent font-bold text-sm outline-none text-gray-700" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                                <span className="text-gray-300">|</span>
                                <div className="flex items-center gap-2">
                                    <input type="time" className="bg-transparent font-bold text-sm outline-none text-gray-700" value={startTime} onChange={e => setStartTime(e.target.value)} />
                                    <span className="text-gray-400 font-medium">até</span>
                                    <input type="time" className="bg-transparent font-bold text-sm outline-none text-gray-700" value={endTime} onChange={e => setEndTime(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Localização Row */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center text-gray-400 shrink-0">
                                <MapPin size={20} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Adicionar local ou link" 
                                className="flex-1 bg-white border-b border-gray-100 py-2 focus:border-primary-500 outline-none text-sm font-bold text-gray-700 placeholder:text-gray-300"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                            />
                        </div>

                        {/* Configurações (Visibilidade & Status) */}
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center text-gray-400 shrink-0">
                                <Eye size={20} />
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">Visibilidade</label>
                                    <select 
                                        value={visibility}
                                        onChange={e => setVisibility(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary-500/10"
                                    >
                                        <option value="default">Padrão</option>
                                        <option value="public">Pública</option>
                                        <option value="private">Privada</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">No meu Google</label>
                                    <select 
                                        value={transparency}
                                        onChange={e => setTransparency(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary-500/10"
                                    >
                                        <option value="opaque">Ocupado</option>
                                        <option value="transparent">Disponível</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Lembrete Row */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center text-gray-400 shrink-0">
                                <Bell size={20} />
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                 Avisar
                                 <select 
                                    value={reminderMinutes}
                                    onChange={e => setReminderMinutes(Number(e.target.value))}
                                    className="bg-gray-100 px-2 py-1 rounded-lg border-none font-black text-primary-600"
                                 >
                                    <option value={15}>15 min</option>
                                    <option value={30}>30 min</option>
                                    <option value={60}>1 hora</option>
                                    <option value={1440}>1 dia</option>
                                 </select>
                                 antes do início
                            </div>
                        </div>

                        {/* Convidados Row */}
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center text-gray-400 shrink-0 mt-1">
                                <Users size={20} />
                            </div>
                            <div className="flex-1 space-y-4">
                                <textarea 
                                    placeholder="Convidados externos (e-mail)..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-medium focus:ring-4 focus:ring-primary-500/10 min-h-[50px] outline-none"
                                    value={externalEmails}
                                    onChange={e => setExternalEmails(e.target.value)}
                                />
                                <div className="flex flex-wrap gap-2">
                                    {team.filter(m => m.email).map(member => (
                                        <button 
                                            key={member.id}
                                            onClick={() => setSelectedMembers(prev => prev.includes(member.email) ? prev.filter(e => e !== member.email) : [...prev, member.email])}
                                            className={`flex items-center gap-1.5 pl-1 pr-3 py-1 rounded-full border-2 transition-all ${
                                                selectedMembers.includes(member.email) ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                            }`}
                                        >
                                            <div className="w-5 h-5 rounded-full overflow-hidden border-2 border-white">
                                                <img src={member.avatar_url} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <span className="text-[10px] font-black">{member.name.split(' ')[0]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Descrição Row */}
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center text-gray-400 shrink-0 mt-1">
                                <AlignLeft size={20} />
                            </div>
                            <textarea 
                                placeholder="Adicionar detalhes da reunião..."
                                className="flex-1 bg-white border border-gray-100 p-4 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none text-sm font-medium text-gray-600 min-h-[100px] transition-all"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Conflitos */}
                    {conflicts.length > 0 && (
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
                            <AlertCircle className="text-orange-600 shrink-0 mt-0.5" size={18} />
                            <p className="text-[10px] font-bold text-orange-800 leading-tight">
                                <span className="block font-black uppercase mb-1">Atenção</span>
                                Conflitos de horário detectados para: {conflicts.map(e => e.owner_email?.split('@')[0]).join(', ')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Fixo */}
                <div className="p-6 border-t border-gray-100 bg-white">
                    {error && <p className="text-red-500 text-[10px] font-black mb-4 flex items-center gap-2 uppercase tracking-widest"><X size={12}/> {error}</p>}
                    <button 
                        onClick={handleSave}
                        disabled={isSaving || !title}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-600/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        {isSaving ? <Sparkles className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                        {isSaving ? 'Reservando...' : 'Confirmar Pauta Estratégica'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ConnectGoogle = ({ onConnect }: { onConnect: () => void }) => (
    <div className="max-w-4xl mx-auto mt-20 p-12 bg-white rounded-[40px] border border-gray-100 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <Sparkles size={300} />
        </div>
        <div className="w-24 h-24 bg-primary-50 rounded-[32px] flex items-center justify-center mb-10 shadow-inner text-primary-600">
            <CalendarIcon size={48} />
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">Agenda Colaborativa Housih.</h1>
        <p className="text-gray-500 text-lg mb-12 max-w-2xl leading-relaxed font-medium">
            Conecte seu Google Calendar para visualizar prazos, pautas de toda a equipe e agendar reuniões com um clique.
        </p>
        <button 
            onClick={onConnect}
            className="group relative px-10 py-5 bg-primary-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary-600/30 hover:bg-primary-700 hover:scale-[1.02] transition-all flex items-center gap-4 active:scale-95"
        >
            <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
            Ativar Modo Colaborativo
        </button>
    </div>
);
