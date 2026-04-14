import { useTasks } from '../context/TasksContext';

export const TaskFilterBar = () => {
    const { filters, setFilters, companies, teamMembers } = useTasks();

    return (
        <div className="flex flex-wrap gap-4 bg-white/80 backdrop-blur-md border border-white/40 p-4 rounded-2xl shadow-sm mb-6 w-full">
            <div className="flex-1 min-w-[150px]">
                <select value={filters.empresa} onChange={(e) => setFilters({ ...filters, empresa: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none text-sm cursor-pointer hover:bg-gray-100 transition-colors">
                    <option value="Todas">Empresas (Todas)</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div className="flex-1 min-w-[150px]">
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none text-sm cursor-pointer hover:bg-gray-100 transition-colors">
                    <option value="Todos">Status (Todos)</option>
                    <option value="Não Iniciado">Não Iniciado</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Atrasado">Atrasado</option>
                </select>
            </div>
            <div className="flex-1 min-w-[150px]">
                <select value={filters.prioridade} onChange={(e) => setFilters({ ...filters, prioridade: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none text-sm cursor-pointer hover:bg-gray-100 transition-colors">
                    <option value="Todas">Prioridades (Todas)</option>
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                </select>
            </div>
            <div className="flex-1 min-w-[150px]">
                <select value={filters.responsavel} onChange={(e) => setFilters({ ...filters, responsavel: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none text-sm cursor-pointer hover:bg-gray-100 transition-colors">
                    <option value="Todos">Responsáveis (Todos)</option>
                    {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
            </div>
            <div className="flex-[1.5] min-w-[300px] flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 group focus-within:ring-2 focus-within:ring-primary-500/30 transition-all">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider shrink-0">De</span>
                <input
                    type="date"
                    value={filters.dataInicio}
                    onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
                    className="w-full bg-transparent text-gray-600 py-2.5 px-1 focus:outline-none text-xs cursor-pointer min-w-[110px]"
                />
                <div className="w-px h-4 bg-gray-200 shrink-0"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider shrink-0">Até</span>
                <input
                    type="date"
                    value={filters.dataFim}
                    onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                    className="w-full bg-transparent text-gray-600 py-2.5 px-1 focus:outline-none text-xs cursor-pointer min-w-[110px]"
                />
            </div>
        </div>
    );
};
