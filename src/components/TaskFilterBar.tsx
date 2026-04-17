import { Search } from 'lucide-react';
import { useTasks } from '../context/TasksContext';

export const TaskFilterBar = () => {
    const { filters, setFilters, companies, teamMembers } = useTasks();

    return (
        <div className="flex flex-col gap-4 bg-white/80 backdrop-blur-md border border-white/40 p-5 rounded-2xl shadow-sm mb-6 w-full">
            {/* Primeira Linha: Busca */}
            <div className="w-full relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary-500 transition-colors">
                    <Search size={20} className="text-gray-400 group-focus-within:text-primary-500" />
                </div>
                <input 
                    type="text"
                    placeholder="Buscar tarefa pelo nome do chamado..."
                    value={filters.busca}
                    onChange={(e) => setFilters({ ...filters, busca: e.target.value })}
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-700 py-3 pl-12 px-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500/50 transition-all text-sm outline-none shadow-sm"
                />
            </div>

            {/* Segunda Linha: Outros Filtros */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="flex-1 min-w-[140px]">
                    <select value={filters.empresa} onChange={(e) => setFilters({ ...filters, empresa: e.target.value })} className="w-full bg-gray-50/50 border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none text-xs cursor-pointer hover:bg-white transition-colors">
                        <option value="Todas">Empresas (Todas)</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                    <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-full bg-gray-50/50 border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none text-xs cursor-pointer hover:bg-white transition-colors">
                        <option value="Todos">Status (Todos)</option>
                        <option value="Não Iniciado">Não Iniciado</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Cancelado">Cancelado</option>
                        <option value="Atrasado">Atrasado</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                    <select value={filters.prioridade} onChange={(e) => setFilters({ ...filters, prioridade: e.target.value })} className="w-full bg-gray-50/50 border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none text-xs cursor-pointer hover:bg-white transition-colors">
                        <option value="Todas">Prioridades (Todas)</option>
                        <option value="Baixa">Baixa</option>
                        <option value="Média">Média</option>
                        <option value="Alta">Alta</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                    <select value={filters.responsavel} onChange={(e) => setFilters({ ...filters, responsavel: e.target.value })} className="w-full bg-gray-50/50 border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none text-xs cursor-pointer hover:bg-white transition-colors">
                        <option value="Todos">Responsáveis (Todos)</option>
                        {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                    </select>
                </div>
                
                <div className="flex-[1.5] min-w-[280px] flex items-center gap-2 bg-gray-50/50 border border-gray-200 rounded-xl px-3 group focus-within:ring-2 focus-within:ring-primary-500/20 transition-all focus-within:bg-white">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider shrink-0">De</span>
                    <input
                        type="date"
                        value={filters.dataInicio}
                        onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
                        className="w-full bg-transparent text-gray-600 py-2.5 px-1 focus:outline-none text-xs cursor-pointer"
                    />
                    <div className="w-px h-4 bg-gray-200 shrink-0"></div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider shrink-0">Até</span>
                    <input
                        type="date"
                        value={filters.dataFim}
                        onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                        className="w-full bg-transparent text-gray-600 py-2.5 px-1 focus:outline-none text-xs cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};
