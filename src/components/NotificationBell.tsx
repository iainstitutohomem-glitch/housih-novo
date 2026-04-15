import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, Calendar, User } from 'lucide-react';
import { useTasks } from '../context/TasksContext';

export const NotificationBell = () => {
    const { notifications, markNotificationAsRead, clearAllNotifications } = useTasks();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-xl transition-all relative ${isOpen ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white animate-bounce-subtle">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            Notificações
                            <span className="text-xs font-normal text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                                {notifications.length} total
                            </span>
                        </h3>
                        {notifications.length > 0 && (
                            <button
                                onClick={clearAllNotifications}
                                className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                            >
                                <Trash2 size={12} /> Limpar tudo
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                                <Bell size={40} className="mb-2 text-gray-300" />
                                <p className="text-sm font-medium">Tudo limpo por aqui!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 hover:bg-primary-50/30 transition-colors relative group ${!notif.read ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'transfer' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                                {notif.type === 'transfer' ? <User size={18} /> : <Bell size={18} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                                                        {notif.type === 'transfer' ? 'Transferência' : 'Menção'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-medium">
                                                        {formatTime(notif.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-800 leading-snug">
                                                    <span className="font-bold">{notif.sender_name}</span> {notif.message}
                                                </p>
                                                {notif.task_title && (
                                                    <div className="mt-2 text-xs flex items-center gap-1.5 text-gray-500 bg-gray-100/50 w-fit px-2 py-1 rounded-lg">
                                                        <Calendar size={12} />
                                                        <span className="truncate max-w-[200px]">{notif.task_title}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {!notif.read && (
                                            <button
                                                onClick={() => markNotificationAsRead(notif.id)}
                                                className="absolute top-4 right-4 p-1.5 bg-white rounded-full shadow-sm text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
                                                title="Marcar como lida"
                                            >
                                                <Check size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 bg-gray-50/50 text-center border-t border-gray-100">
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">housih. notificações</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
