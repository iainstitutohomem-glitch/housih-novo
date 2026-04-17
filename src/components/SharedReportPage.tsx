import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Camera, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const STATUS_COLORS: Record<string, string> = {
    'Concluído': '#4ade80',
    'Não Iniciado': '#9ca3af',
    'Em Andamento': '#fbbf24',
    'Cancelado': '#c084fc',
    'Atrasado': '#ef4444'
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

export const SharedReportPage = () => {
    const { id } = useParams();
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchReport = async () => {
            const { data } = await supabase
                .from('shared_reports')
                .select('*')
                .eq('id', id)
                .single();

            if (data) setReport(data);
            setLoading(false);
        };
        fetchReport();
    }, [id]);

    const exportToImage = async () => {
        if (!reportRef.current) return;
        const dataUrl = await toPng(reportRef.current, { backgroundColor: '#f9fafb', cacheBust: true });
        const link = document.createElement('a');
        link.download = `Relatório_Housih_${id?.slice(0, 8)}.png`;
        link.href = dataUrl;
        link.click();
    };

    const exportToPDF = async () => {
        if (!reportRef.current) return;
        const dataUrl = await toPng(reportRef.current, { backgroundColor: '#f9fafb', cacheBust: true });
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Relatório_Housih_${id?.slice(0, 8)}.pdf`);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-rotate" />
            <p className="font-medium text-gray-500">Gerando visualização do relatório...</p>
        </div>
    );

    if (!report) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
            <XCircle size={48} className="text-red-400" />
            <p className="font-bold text-gray-800">Relatório não encontrado</p>
            <p className="text-gray-500">Este link pode ter expirado ou estar incorreto.</p>
        </div>
    );

    const tasks = report.report_data || [];
    const companies = report.companies_data || [];
    const team = report.team_data || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t: any) => t.status === 'Concluído').length;
    const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const statusData = tasks.reduce((acc: any, task: any) => {
        const found = acc.find((d: any) => d.name === task.status);
        if (found) found.value++;
        else acc.push({ name: task.status, value: 1 });
        return acc;
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 no-scrollbar py-8 px-4">
            {/* Action Bar */}
            <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Housih" className="h-6" />
                    <div className="h-4 w-px bg-gray-200" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 py-1 bg-gray-50 rounded-lg">Relatório Gerencial</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={exportToImage} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all">
                        <Camera size={16} /> JPEG
                    </button>
                    <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary-600/20">
                        <FileText size={16} /> PDF
                    </button>
                </div>
            </div>

            {/* Main Content for Export */}
            <div ref={reportRef} className="max-w-6xl mx-auto bg-gray-50 p-8 rounded-3xl shadow-xl overflow-hidden no-scrollbar">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">{report.title}</h1>
                        <p className="text-gray-500 font-medium">Relatório gerado em {new Date(report.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Final</p>
                            <p className="text-2xl font-black text-primary-600">{completionPercentage}% Concluído</p>
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin-slow flex items-center justify-center">
                            <CheckCircle2 className="text-primary-500" size={24} />
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white shadow-sm flex items-center gap-8">
                        <div className="w-48 h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={statusData} cx="50%" cy="50%" innerRadius="55%" outerRadius="85%" strokeWidth={3} stroke="#fff" dataKey="value" labelLine={false} label={renderCustomizedLabel}>
                                        {statusData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#ccc'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-4">
                            {Object.entries(STATUS_COLORS).map(([status, color]) => {
                                const count = tasks.filter((t: any) => t.status === status).length;
                                if (count === 0) return null;
                                return (
                                    <div key={status} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                            <span className="text-sm font-bold text-gray-700">{status}</span>
                                        </div>
                                        <span className="text-sm font-black text-gray-400 group-hover:text-gray-900 transition-colors">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white shadow-sm flex flex-col justify-center">
                         <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total de Tarefas</p>
                                <p className="text-4xl font-black text-gray-900 leading-none">{totalTasks}</p>
                            </div>
                            <div className="p-6 bg-green-50 rounded-2xl border border-green-100 text-center">
                                <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Entregas</p>
                                <p className="text-4xl font-black text-green-600 leading-none">{completedTasks}</p>
                            </div>
                         </div>
                         <div className="mt-6 p-6 bg-primary-50 rounded-2xl border border-primary-100">
                             <div className="flex justify-between items-center mb-2">
                                 <span className="text-xs font-bold text-primary-700">Produtividade Global</span>
                                 <span className="text-xs font-black text-primary-900">{completionPercentage}%</span>
                             </div>
                             <div className="h-2 w-full bg-primary-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-primary-600 transition-all duration-1000" style={{ width: `${completionPercentage}%` }} />
                             </div>
                         </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-sm overflow-hidden no-scrollbar">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                <tr>
                                    <th className="px-8 py-5 border-r border-gray-100">Empresa</th>
                                    <th className="px-8 py-5">Tarefa</th>
                                    <th className="px-8 py-5">Responsável</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Entrega</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                                {tasks.map((task: any) => {
                                    const comp = companies.find((c: any) => c.id === task.company_id);
                                    return (
                                        <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="w-56 p-0 border-r border-gray-50">
                                                <div className="px-8 py-5 flex items-center gap-3">
                                                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: comp?.color || '#ccc' }} />
                                                    <span className="font-bold">{comp?.name || 'Nenhuma'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 font-bold text-gray-900">{task.title}</td>
                                            <td className="px-8 py-5">
                                                <div className="flex -space-x-2">
                                                    {task.assignee?.map((name: string, i: number) => {
                                                        const m = team.find((t: any) => t.name === name);
                                                        return (
                                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden" title={name}>
                                                                {m?.avatar_url ? (
                                                                    <img src={m.avatar_url} className="w-full h-full object-cover" alt="" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-200">{name.charAt(0)}</div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[task.status] }} />
                                                    <span className="text-xs font-bold" style={{ color: STATUS_COLORS[task.status] }}>{task.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-gray-400 tabular-nums">
                                                {task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : '-'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-400 flex items-center justify-center gap-2 text-xs font-medium">
                    <CheckCircle2 size={14} />
                    Este documento é uma representação estática e fidedigna do status do projeto em {new Date(report.created_at).toLocaleTimeString('pt-BR')} do dia {new Date(report.created_at).toLocaleDateString()}.
                </div>
            </div>
        </div>
    );
};
