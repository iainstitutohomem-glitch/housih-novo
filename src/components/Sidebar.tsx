import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, PieChart, Users, LogOut, Plus, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useTasks } from '../context/TasksContext';
import { NewGroupModal } from './Chat/NewGroupModal';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { signOut } = useAuth();
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

    const navItems = [
        { to: '/dashboard', icon: <PieChart size={20} />, label: 'Visão Geral' },
        { to: '/kanban', icon: <LayoutDashboard size={20} />, label: 'Kanban' },
        { to: '/companies', icon: <Building2 size={20} />, label: 'Empresas' },
        { to: '/team', icon: <Users size={20} />, label: 'Equipe' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 w-64 bg-white/70 backdrop-blur-md border-r border-gray-200/50 flex flex-col pt-8 pb-6 px-4 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 
                transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center justify-between px-2 mb-10 mt-2">
                    <img src="/logo.png" alt="Housih Logo" className="h-6 object-contain" />
                    <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => {
                                if (window.innerWidth < 1024) onClose();
                            }}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-primary-50 text-primary-600 font-medium'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}

                    <div className="pt-8 px-2 space-y-6">
                        <TeamPresenceSidebar />

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Grupos
                                </h3>
                                <button
                                    onClick={() => setIsGroupModalOpen(true)}
                                    className="p-1 hover:bg-primary-50 text-primary-600 rounded-md transition-colors"
                                    title="Criar Novo Grupo"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <GroupList />
                        </div>
                    </div>
                </nav>

                <button onClick={signOut} className="flex items-center gap-3 px-3 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-8 shrink-0">
                    <LogOut size={20} />
                    <span className="font-medium">Sair</span>
                </button>
            </aside>

            <NewGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
        </>
    );
};

const GroupList = () => {
    const { conversations, setActiveConversation, activeConversation } = useChat();
    const groups = conversations.filter(c => c.type === 'group');

    if (groups.length === 0) {
        return <p className="text-[10px] text-gray-400 italic px-2">Nenhum grupo ativo</p>;
    }

    return (
        <div className="space-y-1">
            {groups.map(group => (
                <button
                    key={group.id}
                    onClick={() => setActiveConversation(group)}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors group text-left ${activeConversation?.id === group.id ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                >
                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeConversation?.id === group.id ? 'bg-primary-100' : 'bg-gray-100 group-hover:bg-primary-100'
                        }`}>
                        <MessageSquare size={16} className={activeConversation?.id === group.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'} />
                    </div>
                    <span className="text-xs font-medium truncate">{group.name}</span>
                </button>
            ))}
        </div>
    );
};

const TeamPresenceSidebar = () => {
    const { teamMembers } = useTasks();
    const { onlineUsers, startPrivateChat, activeConversation } = useChat();
    const { session } = useAuth();

    // Filtra membros que têm email cadastrado
    const eligibleMembers = teamMembers.filter(m => m.email && m.email !== session?.user?.email);

    return (
        <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                Equipe Online
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            </h3>
            <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {eligibleMembers.map((member) => (
                    <button
                        key={member.id}
                        onClick={() => member.email && startPrivateChat(member.email)}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors group text-left ${
                            (activeConversation?.type === 'direct' && 
                             activeConversation.participants.some(p => p.toLowerCase() === member.email?.toLowerCase()))
                             ? 'bg-primary-50' : 'hover:bg-gray-50'
                        }`}
                    >
                        <div className="relative shrink-0">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs uppercase overflow-hidden">
                                {member.avatar_url ? (
                                    <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    member.name.charAt(0)
                                )}
                            </div>
                            {Array.from(onlineUsers).some((u: string) => u.toLowerCase() === member.email?.toLowerCase()) && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 text-gray-800">
                            <p className="text-xs font-medium truncate group-hover:text-primary-600 transition-colors">{member.name}</p>
                            <p className="text-[9px] text-gray-400 truncate">
                                {Array.from(onlineUsers).some((u: string) => u.toLowerCase() === member.email?.toLowerCase()) ? 'Disponível' : 'Offline'}
                            </p>
                        </div>
                        <MessageSquare size={14} className="text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
            </div>
        </div>
    );
};
