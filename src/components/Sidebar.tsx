import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, PieChart, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
    const { signOut } = useAuth();

    const navItems = [
        { to: '/dashboard', icon: <PieChart size={20} />, label: 'Visão Geral' },
        { to: '/kanban', icon: <LayoutDashboard size={20} />, label: 'Kanban' },
        { to: '/companies', icon: <Building2 size={20} />, label: 'Empresas' },
        { to: '/team', icon: <Users size={20} />, label: 'Equipe' },
    ];

    return (
        <aside className="w-64 h-screen bg-white/70 backdrop-blur-md border-r border-gray-200/50 flex flex-col pt-8 pb-6 px-4 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
            <div className="flex items-center px-2 mb-10 mt-2">
                <img src="/logo.png" alt="Housih Logo" className="h-6 object-contain" />
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
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
    );
};
