import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, PieChart, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { signOut } = useAuth();

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

                <nav className="flex-1 space-y-2">
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
                </nav>

                <button onClick={signOut} className="flex items-center gap-3 px-3 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-auto">
                    <LogOut size={20} />
                    <span className="font-medium">Sair</span>
                </button>
            </aside>
        </>
    );
};
