import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Camera, FileText, XCircle } from 'lucide-react';
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
        try {
            const dataUrl = await toPng(reportRef.current, { 
                backgroundColor: '#f9fafb', 
                cacheBust: true,
                pixelRatio: 3, // High-definition
                style: {
                    borderRadius: '0', // Ensure clean edges for export
                    transform: 'scale(1)',
                }
            });
            const link = document.createElement('a');
            link.download = `Relatório_Housih_${report?.title || id?.slice(0, 8)}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Export failed', err);
        }
    };

    const exportToPDF = async () => {
        if (!reportRef.current) return;
        try {
            const dataUrl = await toPng(reportRef.current, { 
                backgroundColor: '#f9fafb', 
                cacheBust: true,
                pixelRatio: 2 // Slightly lower for PDF to avoid massive files, still very sharp
            });
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pdf.save(`Relatório_Housih_${report?.title || id?.slice(0, 8)}.pdf`);
        } catch (err) {
            console.error('PDF export failed', err);
        }
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

    const companyData = tasks.reduce((acc: any, task: any) => {
        const companyName = companies.find((c: any) => c.id === task.company_id)?.name || 'Nenhuma';
        const found = acc.find((d: any) => d.name === companyName);
        if (found) found.value++;
        else acc.push({ name: companyName, value: 1 });
        return acc;
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 font-sans p-4 lg:p-8 pb-24 no-scrollbar">
            {/* Subtle Controls */}
            <div className="fixed bottom-6 right-6 flex gap-2 z-50 animate-in fade-in slide-in-from-bottom-4">
                <button onClick={exportToImage} className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all shadow-xl hover:border-primary-500 hover:text-primary-600 active:scale-95">
                    <Camera size={18} /> Salvar JPEG
                </button>
                <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-xl shadow-primary-600/20 active:scale-95">
                    <FileText size={18} /> Salvar PDF
                </button>
            </div>

            <div ref={reportRef} className="max-w-full space-y-6">
                {/* Header matching site style */}
                <div className="bg-white/40 backdrop-blur-md border-b border-gray-200/50 -mx-4 lg:-mx-8 -mt-4 lg:-mt-8 mb-8 px-4 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <img src="/logo.png" alt="Housih" className="h-6" />
                        <div className="h-6 w-px bg-gray-200" />
                        <h1 className="text-xl lg:text-2xl font-semibold text-gray-800 tracking-tight">
                            {report.title}
                        </h1>
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white/60 px-3 py-1.5 rounded-lg border border-white/40">
                        Snapshot: {new Date(report.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                </div>

                {/* 1. Progress Bar - Matching Dashboard */}
                <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                    <div className="w-48 text-xl font-bold leading-tight text-gray-800">
                        Progresso de Entregas
                    </div>
                    <div className="flex-1 w-full flex items-center gap-4">
                        <div className="flex-1 h-4 bg-gray-100/50 rounded-full overflow-hidden border border-gray-200/20">
                            <div 
                                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(249,115,22,0.3)]"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                        <span className="text-2xl font-black text-primary-600 w-16 text-right tabular-nums">{completionPercentage}%</span>
                    </div>
                </div>

                {/* 3. Status Summary Chart (Horizontal Bars) - EXACTLY MATCHING SITE */}
                <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                        <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs">Resumo por Status</h3>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(STATUS_COLORS).map(([status, color]) => {
                            const count = tasks.filter((t: any) => t.status === status).length;
                            const percentage = totalTasks === 0 ? 0 : (count / totalTasks) * 100;
                            const label = status === 'Concluído' ? 'Finalizado' : status === 'Atrasado' ? 'Em atraso' : status;

                            if (count === 0) return null;

                            return (
                                <div key={status} className="flex items-center gap-4 group">
                                    <div
                                        className="w-32 py-1.5 px-3 rounded text-white text-xs font-bold shadow-sm"
                                        style={{ backgroundColor: color }}
                                    >
                                        {label}
                                    </div>
                                    <div className="flex-1 h-3 bg-gray-100/50 rounded-sm overflow-hidden border border-gray-200/20">
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
                            <span className="w-12 text-right">{totalTasks}</span>
                        </div>
                    </div>
                </div>

                {/* 4. Donut Charts - Matching Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center h-80">
                        <div className="w-full sm:w-1/2 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={statusData} cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" stroke="#fff" strokeWidth={3} dataKey="value" labelLine={false} label={renderCustomizedLabel}>
                                        {statusData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#ccc'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 w-full sm:pl-4 flex flex-col gap-3 justify-center">
                            {statusData.map((d: any) => (
                                <div key={d.name} className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: STATUS_COLORS[d.name] }} />
                                    <span className="text-sm font-medium text-gray-700">{d.name} ({((d.value / totalTasks) * 100).toFixed(0)}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center h-80">
                        <div className="w-full sm:w-1/2 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={companyData} cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" stroke="#fff" strokeWidth={3} dataKey="value" labelLine={false} label={renderCustomizedLabel}>
                                        {companyData.map((entry: any, index: number) => {
                                             const c = companies.find((co: any) => co.name === entry.name);
                                            return <Cell key={`cell-${index}`} fill={c?.color || '#ccc'} />;
                                        })}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 w-full sm:pl-4 flex flex-col gap-2 justify-center max-h-[100%] overflow-y-auto">
                             {companyData.map((c: any) => {
                                 const comp = companies.find((co: any) => co.name === c.name);
                                 return (
                                     <div key={c.name} className="flex items-center gap-3">
                                         <div className="w-4 h-4 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: comp?.color || '#ccc' }} />
                                         <span className="text-sm font-medium text-gray-700 truncate">
                                             {c.name} ({((c.value / totalTasks) * 100).toFixed(0)}%)
                                         </span>
                                     </div>
                                 );
                             })}
                        </div>
                    </div>
                </div>

                {/* 5. Table - EXACTLY MATCHING DASHBOARD */}
                <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50/80 text-gray-600 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold border-r border-gray-100">Empresa</th>
                                    <th className="px-6 py-4 font-semibold">Tarefa</th>
                                    <th className="px-6 py-4 font-semibold">Responsáveis</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Prioridade</th>
                                    <th className="px-6 py-4 font-semibold">Data Final</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white/40">
                                {tasks.map((task: any) => {
                                    const comp = companies.find((c: any) => c.id === task.company_id || c.name === task.company_name);
                                    return (
                                        <tr key={task.id} className="hover:bg-white/60 transition-colors group">
                                            <td className="w-48 p-0 border-r border-gray-100/50">
                                                <div 
                                                    className="h-full w-full px-6 py-4 font-bold text-white shadow-sm"
                                                    style={{ backgroundColor: comp?.color || '#4b5563' }}
                                                >
                                                    {comp?.name || '---'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 border-r border-gray-100/50">
                                                <span className="font-bold text-gray-800">{task.title}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {task.assignee?.map((name: string, i: number) => {
                                                        const m = team.find((t: any) => t.name === name);
                                                        return (
                                                            <div key={i} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full text-[11px] font-medium border border-gray-200 shadow-sm">
                                                                <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                                                                    {m?.avatar_url ? <img src={m.avatar_url} className="w-full h-full object-cover" /> : <span className="text-[9px] font-bold">{name.charAt(0).toUpperCase()}</span>}
                                                                </div>
                                                                {name}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[task.status] }} />
                                                    <span style={{ color: STATUS_COLORS[task.status] }}>{task.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                                    task.priority === 'Alta' ? 'bg-red-50 text-red-600' :
                                                    task.priority === 'Média' ? 'bg-orange-50 text-orange-600' :
                                                    'bg-green-50 text-green-600'
                                                }`}>
                                                    {task.priority || 'Média'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 tabular-nums font-medium">
                                                {task.due_date ? new Date(task.due_date).toLocaleDateString() : '---'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
