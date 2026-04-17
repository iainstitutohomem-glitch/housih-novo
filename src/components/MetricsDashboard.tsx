import { useMemo } from 'react';
import { useTasks } from '../context/TasksContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TaskFilterBar } from './TaskFilterBar';
import { Eye, Copy, Check, X, Share2 } from 'lucide-react';
import { useState } from 'react';


const STATUS_COLORS: Record<string, string> = {
    'Concluído': '#4ade80',  // Green
    'Não Iniciado': '#9ca3af', // Gray
    'Em Andamento': '#fbbf24', // Yellow/Orange
    'Cancelado': '#c084fc',   // Purple
    'Atrasado': '#ef4444'     // Red
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[10px] font-bold"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export const MetricsDashboard = () => {
    const { filteredTasks, companies, teamMembers, createSharedReport } = useTasks();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [reportTitle, setReportTitle] = useState('Relatório de Performance');
    const [generatedLink, setGeneratedLink] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCreateReport = async () => {
        setIsGenerating(true);
        const reportId = await createSharedReport(reportTitle, filteredTasks, {});
        if (reportId) {
            setGeneratedLink(`${window.location.origin}/shared/${reportId}`);
        }
        setIsGenerating(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(t => t.status === 'Concluído').length;
    const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const statusData = useMemo(() => {
        const counts: Record<string, number> = {};
        filteredTasks.forEach(t => counts[t.status] = (counts[t.status] || 0) + 1);
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    }, [filteredTasks]);

    const companyData = useMemo(() => {
        const counts: Record<string, number> = {};
        filteredTasks.forEach(t => {
            const companyName = companies.find(c => c.id === t.company_id)?.name || 'Nenhuma';
            counts[companyName] = (counts[companyName] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    }, [filteredTasks, companies]);

    return (
        <div className="flex-1 w-full space-y-6 text-gray-800 font-sans pb-8">
            {/* Share Modal */}
            {isShareModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <Share2 className="text-primary-600" size={24} /> Criar Link Público
                            </h3>
                            <button onClick={() => { setIsShareModalOpen(false); setGeneratedLink(''); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            {!generatedLink ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Título do Relatório</label>
                                        <input 
                                            type="text" 
                                            value={reportTitle}
                                            onChange={(e) => setReportTitle(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                            placeholder="Ex: Entrega Março - Cliente X"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleCreateReport}
                                        disabled={isGenerating}
                                        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary-600/20 transition-all flex items-center justify-center gap-3"
                                    >
                                        {isGenerating ? 'Gerando Link...' : 'Gerar Snapshot Agora'}
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-4 animate-in slide-in-from-bottom-4">
                                    <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
                                        <Check className="text-green-500" size={24} />
                                        <p className="text-xs font-bold text-green-700">Relatório Estático gerado com sucesso!</p>
                                    </div>
                                    <div className="relative group">
                                        <input 
                                            readOnly 
                                            value={generatedLink}
                                            className="w-full bg-gray-50 border border-gray-200 py-4 px-4 rounded-xl text-xs font-medium text-gray-500 overflow-hidden pr-24"
                                        />
                                        <button 
                                            onClick={copyToClipboard}
                                            className="absolute right-2 top-2 bottom-2 px-4 bg-white border border-gray-200 rounded-lg text-xs font-black text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                        >
                                            {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                            {isCopied ? 'Copiado' : 'Copiar'}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 text-center italic">Este link é público e não expira. Compartilhe com cuidado.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* 1. Progress Bar */}
            <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                <div className="w-48 text-xl font-bold leading-tight text-gray-800">
                    Tarefas<br />Concluídas
                </div>
                <div className="flex-1 w-full flex items-center gap-4">
                    <span className="text-xl font-medium text-gray-700">{completionPercentage}%</span>
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg relative overflow-hidden inset-shadow-sm border border-gray-200">
                        <div
                            className="absolute top-0 left-0 h-full bg-[#4ade80] transition-all duration-1000 ease-out shadow-sm"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                    <div className="w-px h-10 bg-gray-200 mx-2"></div>
                    <span className="text-xl font-medium text-gray-400">100%</span>
                </div>
            </div>

            {/* 2. Global Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <TaskFilterBar />
                </div>
                <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex-shrink-0 bg-white border border-gray-200 hover:border-primary-500 hover:text-primary-600 text-gray-600 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-sm transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <Eye size={18} /> Visualização
                </button>
            </div>

            {/* 3. Status Summary Chart (Horizontal) */}
            <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-sm">
                <div className="space-y-3">
                    {Object.entries(STATUS_COLORS).map(([status, color]) => {
                        const count = filteredTasks.filter(t => t.status === status).length;
                        const percentage = totalTasks === 0 ? 0 : (count / totalTasks) * 100;
                        const label = status === 'Concluído' ? 'Finalizado' : status === 'Atrasado' ? 'Em atraso' : status;

                        return (
                            <div key={status} className="flex items-center gap-4 group">
                                <div
                                    className="w-32 py-1.5 px-3 rounded text-white text-xs font-bold shadow-sm transition-transform group-hover:scale-105"
                                    style={{ backgroundColor: color }}
                                >
                                    {label}
                                </div>
                                <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden border border-gray-200/50">
                                    <div
                                        className="h-full transition-all duration-1000 ease-out"
                                        style={{ backgroundColor: color, width: `${percentage}%` }}
                                    />
                                </div>
                                <div className="w-12 text-right font-bold text-gray-700 tabular-nums">
                                    {count}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center font-black text-gray-900 uppercase tracking-tighter text-sm">
                    <div className="flex gap-20 w-full">
                        <span className="flex-1 text-left">Total geral</span>
                        <span className="w-24 text-center">{totalTasks}</span>
                        <span className="w-12 text-right">{totalTasks}</span>
                    </div>
                </div>
            </div>

            {/* 4. Donut Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Chart */}
                <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center min-h-[450px] sm:h-80">
                    <div className="w-full sm:w-1/2 h-64 sm:h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Pie
                                    data={statusData}
                                    cx="50%" cy="50%"
                                    innerRadius="60%" outerRadius="90%"
                                    stroke="#fff"
                                    strokeWidth={3}
                                    dataKey="value"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                >
                                {statusData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#ccc'} />
                                ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex-1 w-full sm:pl-4 flex flex-col gap-3 justify-center mt-4 sm:mt-0">
                        {statusData.length === 0 && <p className="text-gray-400 text-sm">Nenhum dado.</p>}
                        {Object.entries(STATUS_COLORS).map(([status, color]) => {
                            if (!statusData.find((d: any) => d.name === status)) return null;
                            return (
                                <div key={status} className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                                    <span className="text-sm font-medium text-gray-700">
                                        {status} ({((statusData.find(d => d.name === status)?.value || 0) / totalTasks * 100).toFixed(0)}%)
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Company Chart */}
                <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center min-h-[450px] sm:h-80">
                    <div className="w-full sm:w-1/2 h-64 sm:h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Pie
                                    data={companyData}
                                    cx="50%" cy="50%"
                                    innerRadius="60%" outerRadius="90%"
                                    stroke="#fff"
                                    strokeWidth={3}
                                    dataKey="value"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                >
                                {companyData.map((entry: any, index: number) => {
                                    const c = companies.find((co: any) => co.id === entry.name || co.name === entry.name);
                                    return <Cell key={`cell-${index}`} fill={c?.color || '#ccc'} />
                                })}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex-1 w-full sm:pl-4 flex flex-col gap-2 justify-center max-h-[100%] overflow-y-auto mt-4 sm:mt-0 pr-2">
                        {companyData.length === 0 && <p className="text-gray-400 text-sm">Nenhum dado.</p>}
                        {companyData.map((c: any) => {
                            const comp = companies.find((co: any) => co.name === c.name);
                            return (
                                <div key={c.name} className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: comp?.color || '#ccc' }} />
                                    <span className="text-sm font-medium text-gray-700 truncate">
                                        {c.name} ({((c.value / totalTasks) * 100).toFixed(0)}%)
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* 4. Table view */}
            <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50/80 text-gray-600 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold border-r border-gray-100">Empresa</th>
                                <th className="px-6 py-4 font-semibold">Tarefa</th>
                                <th className="px-6 py-4 font-semibold">Responsável</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Prioridade</th>
                                <th className="px-6 py-4 font-semibold">Data Final</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTasks.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Nenhuma tarefa encontrada.</td></tr>
                            ) : filteredTasks.map(task => {
                                const comp = companies.find(c => c.id === task.company_id);
                                return (
                                    <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="w-48 p-0 border-r border-gray-50">
                                            <div
                                                className="h-full w-full px-6 py-4 font-medium text-white shadow-sm"
                                                style={{ backgroundColor: comp?.color || '#4b5563' }}
                                            >
                                                {comp?.name || 'Nenhuma'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 font-medium">{task.title}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {task.assignee && task.assignee.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {task.assignee.map((name, i) => {
                                                        const member = teamMembers.find(m => m.name === name);
                                                        return (
                                                            <div key={i} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full text-[11px] font-medium border border-gray-200 shadow-sm">
                                                                <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                                                                    {member?.avatar_url ? (
                                                                        <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <span className="text-[9px] font-bold">{name.charAt(0).toUpperCase()}</span>
                                                                    )}
                                                                </div>
                                                                {name}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Sem resp.</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[task.status] }}></span>
                                                <span style={{ color: STATUS_COLORS[task.status] }}>{task.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide
                                            ${task.priority === 'Alta' ? 'bg-red-50 text-red-600' :
                                                    task.priority === 'Média' ? 'bg-orange-50 text-orange-600' :
                                                        'bg-green-50 text-green-600'}`}
                                            >
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : '-'}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
