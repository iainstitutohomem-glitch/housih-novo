import { useState, useEffect } from 'react';
import { X, Calendar, Upload, MessageSquare, Plus, CheckCircle2, Circle, Trash2, UserPlus, Download } from 'lucide-react';
import { useTasks } from '../context/TasksContext';

export const TaskModal = () => {
    const { isModalOpen, closeModal, editingTask, addTask, updateTask, deleteTask, companies, teamMembers, session } = useTasks();

    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('Nenhuma');
    const [assignees, setAssignees] = useState<string[]>([]);
    const [status, setStatus] = useState('Não Iniciado');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Média');
    const [observations, setObservations] = useState('');
    const [checklist, setChecklist] = useState<{
        id: number;
        text: string;
        done: boolean;
        due_date?: string | null;
        assignees?: string[];
    }[]>([]);
    const [attachments, setAttachments] = useState<{ name: string, data: string }[]>([]);
    const [newChecklistItem, setNewChecklistItem] = useState('');
    const [mentionSearch, setMentionSearch] = useState('');
    const [showMentionList, setShowMentionList] = useState(false);
    const [activeChecklistMenu, setActiveChecklistMenu] = useState<{ id: number, type: 'date' | 'users' } | null>(null);

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title || '');
            setCompany(editingTask.company_id || 'Nenhuma');
            setAssignees(editingTask.assignee || []);
            setAssignees(editingTask.assignee || []);
            setStatus(editingTask.status || 'Não Iniciado');
            if (editingTask.due_date) {
                const d = new Date(editingTask.due_date);
                const y = d.getUTCFullYear();
                const m = String(d.getUTCMonth() + 1).padStart(2, '0');
                const dd = String(d.getUTCDate()).padStart(2, '0');
                setDueDate(`${y}-${m}-${dd}`);
            } else {
                setDueDate('');
            }
            setPriority(editingTask.priority || 'Média');
            setObservations(editingTask.observations || '');
            setChecklist(editingTask.checklist || []);
            setAttachments(editingTask.attachments || []);
        } else {
            setTitle('');
            setCompany('Nenhuma');
            setAssignees([]);
            setStatus('Não Iniciado');
            setDueDate('');
            setPriority('Média');
            setObservations('');
            setChecklist([]);
            setAttachments([]);
        }
    }, [editingTask, isModalOpen]);

    const handleSave = async () => {
        if (!title.trim()) return;
        const taskData = {
            title,
            company_id: company === 'Nenhuma' ? null : company,
            assignee: assignees,
            status,
            priority,
            due_date: dueDate ? new Date(`${dueDate}T12:00:00`).toISOString() : new Date().toISOString(),
            observations,
            checklist,
            attachments
        };

        if (editingTask) {
            await updateTask(editingTask.id, taskData);
        } else {
            await addTask(taskData);
        }
    };

    const handleSendObservation = async () => {
        if (!observations.trim() || !editingTask) return;

        const timestamp = new Date().toLocaleString('pt-BR');
        const currentUser = teamMembers.find(m => m.email === session?.user?.email)?.name || 'Sistema';
        const newMsg = `\n[${timestamp}] ${currentUser}: ${observations}`;

        const updatedObs = (editingTask.observations || '') + newMsg;

        setObservations(''); // Limpa o campo localmente para a próxima
        await updateTask(editingTask.id, { observations: updatedObs });
    };

    const handleDelete = async () => {
        if (editingTask && window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            await deleteTask(editingTask.id);
            closeModal();
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={closeModal} />
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 border border-white/50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <input
                        type="text"
                        placeholder="Título da Tarefa..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-300 w-full text-gray-800"
                    />
                    <button onClick={closeModal} className="p-2 bg-gray-100/50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors ml-4">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Empresa</label>
                                <select
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                                    <option value="Nenhuma">Nenhuma</option>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Responsáveis</label>
                                <div className="space-y-2 max-h-40 overflow-y-auto p-3 bg-gray-50 border border-gray-200 rounded-xl custom-scrollbar">
                                    {teamMembers && teamMembers.map(member => (
                                        <label key={member.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer group">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                                                checked={assignees.includes(member.name)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setAssignees([...assignees, member.name]);
                                                    } else {
                                                        setAssignees(assignees.filter(a => a !== member.name));
                                                    }
                                                }}
                                            />
                                            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                                                {member.avatar_url ? (
                                                    <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-[10px] font-bold text-primary-600">{member.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-700 group-hover:text-primary-700 font-medium">{member.name}</span>
                                        </label>
                                    ))}
                                    {(!teamMembers || teamMembers.length === 0) && (
                                        <p className="text-xs text-gray-400 italic text-center py-2">Nenhum membro da equipe encontrado.</p>
                                    )}
                                </div>
                                {assignees.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {assignees.map(name => (
                                            <span key={name} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-md text-[10px] font-bold">
                                                {name}
                                                <button onClick={() => setAssignees(assignees.filter(a => a !== name))} className="hover:text-primary-900">
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                                    <option>Não Iniciado</option>
                                    <option>Em Andamento</option>
                                    <option>Concluído</option>
                                    <option>Cancelado</option>
                                    <option>Atrasado</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Data de Entrega</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-10 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prioridade</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                                    <option>Alta</option>
                                    <option>Média</option>
                                    <option>Baixa</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Checklist */}
                    {/* Checklist */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Checklist</label>
                        <div className="space-y-4 mb-3">
                            {checklist.map((item) => {
                                const now = new Date();
                                now.setHours(0, 0, 0, 0);
                                const itemDate = item.due_date ? new Date(item.due_date) : null;
                                if (itemDate) itemDate.setHours(0, 0, 0, 0);
                                
                                const isOverdue = itemDate && itemDate < now && !item.done;
                                const itemAssignees = item.assignees || [];
                                
                                return (
                                    <div key={item.id} className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3 group">
                                            <button onClick={() => setChecklist(checklist.map(c => c.id === item.id ? { ...c, done: !c.done } : c))}>
                                                {item.done ? <CheckCircle2 size={20} className="text-primary-500" /> : <Circle size={20} className="text-gray-300 hover:text-primary-400 transition-colors" />}
                                            </button>
                                            
                                            <input 
                                                type="text"
                                                value={item.text}
                                                onChange={(e) => setChecklist(checklist.map(c => c.id === item.id ? { ...c, text: e.target.value } : c))}
                                                className={`text-sm flex-1 bg-transparent border-none focus:outline-none ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}
                                            />

                                            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-all">
                                                {/* Botão Data */}
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setActiveChecklistMenu(activeChecklistMenu && activeChecklistMenu.id === item.id && activeChecklistMenu.type === 'date' ? null : { id: item.id, type: 'date' })}
                                                        className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${item.due_date ? (isOverdue ? 'text-red-500' : 'text-primary-600 bg-primary-50') : 'text-gray-400'}`}
                                                        title="Definir data"
                                                    >
                                                        <Calendar size={14} />
                                                    </button>
                                                    {activeChecklistMenu && activeChecklistMenu.id === item.id && activeChecklistMenu.type === 'date' && (
                                                        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-[99999] animate-in zoom-in-95 duration-200">
                                                            <input 
                                                                type="date" 
                                                                className="text-xs border-none bg-gray-50 rounded-lg p-1.5 focus:ring-0"
                                                                value={item.due_date || ''}
                                                                onChange={(e) => {
                                                                    setChecklist(checklist.map(c => c.id === item.id ? { ...c, due_date: e.target.value } : c));
                                                                    setActiveChecklistMenu(null);
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Botão Responsáveis */}
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setActiveChecklistMenu(activeChecklistMenu && activeChecklistMenu.id === item.id && activeChecklistMenu.type === 'users' ? null : { id: item.id, type: 'users' })}
                                                        className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${itemAssignees.length > 0 ? 'text-primary-600 bg-primary-50' : 'text-gray-400'}`}
                                                        title="Adicionar responsáveis"
                                                    >
                                                        <UserPlus size={14} />
                                                    </button>
                                                    {activeChecklistMenu && activeChecklistMenu.id === item.id && activeChecklistMenu.type === 'users' && (
                                                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-[99999] animate-in zoom-in-95 duration-200">
                                                            <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                                                                {teamMembers.map(member => (
                                                                    <label key={member.id} className="flex items-center gap-2 p-1.5 hover:bg-primary-50 rounded-lg cursor-pointer transition-colors">
                                                                        <input 
                                                                            type="checkbox"
                                                                            className="w-3 h-3 text-primary-600 rounded"
                                                                            checked={itemAssignees.includes(member.name)}
                                                                            onChange={(e) => {
                                                                                const newAssignees = e.target.checked 
                                                                                    ? [...itemAssignees, member.name]
                                                                                    : itemAssignees.filter(name => name !== member.name);
                                                                                setChecklist(checklist.map(c => c.id === item.id ? { ...c, assignees: newAssignees } : c));
                                                                            }}
                                                                        />
                                                                        <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                                                                            {member.avatar_url ? (
                                                                                <img src={member.avatar_url} className="w-full h-full object-cover" alt="" />
                                                                            ) : (
                                                                                <div className="w-full h-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-600">
                                                                                    {member.name.charAt(0)}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-[11px] font-medium text-gray-700 truncate">{member.name}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => setChecklist(checklist.filter(c => c.id !== item.id))}
                                                    className="text-gray-300 hover:text-red-500 transition-all p-1.5"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Detalhes do item (data e fotos dos responsáveis) */}
                                        {(item.due_date || itemAssignees.length > 0) && (
                                            <div className="flex items-center gap-3 ml-8">
                                                {item.due_date && (
                                                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${isOverdue ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                                        <Calendar size={10} />
                                                        {new Date(item.due_date).toLocaleDateString('pt-BR')}
                                                    </div>
                                                )}
                                                <div className="flex -space-x-1.5 overflow-hidden">
                                                    {itemAssignees.map((name: string) => {
                                                        const member = teamMembers.find(m => m.name === name);
                                                        return (
                                                            <div key={name} className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary-50 text-primary-700 rounded-md text-[10px] font-bold border border-primary-100">
                                                                <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                                                                    {member?.avatar_url ? (
                                                                        <img src={member.avatar_url} className="w-full h-full object-cover" alt="" />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-primary-200 flex items-center justify-center text-[8px] font-bold text-primary-700">
                                                                            {name.charAt(0)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {name}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 group-within:border-primary-200 group-within:bg-white transition-all">
                            <Plus size={18} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Adicionar item..."
                                className="flex-1 bg-transparent border-none text-sm focus:outline-none placeholder-gray-400 text-gray-700"
                                value={newChecklistItem}
                                onChange={(e) => setNewChecklistItem(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newChecklistItem.trim()) {
                                        setChecklist([...checklist, { id: Date.now(), text: newChecklistItem.trim(), done: false, assignees: [], due_date: null }]);
                                        setNewChecklistItem('');
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/* Attachments */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            <Upload size={14} /> Anexos
                        </label>

                        {attachments.length > 0 && (
                            <div className="flex flex-col gap-2 mb-3">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg group/file">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="text-xs truncate text-gray-600 font-medium max-w-[200px]">{file.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = file.data;
                                                    link.download = file.name;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                className="text-gray-400 hover:text-primary-600 transition-colors p-1"
                                                title="Download"
                                            >
                                                <Download size={14} />
                                            </button>
                                            <button 
                                                onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))} 
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                title="Remover"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50/50 transition-colors cursor-pointer group relative">
                            <div className="bg-primary-50 text-primary-500 p-2 rounded-full mb-2 group-hover:bg-primary-100 transition-colors">
                                <Upload size={16} />
                            </div>
                            <p className="text-xs font-medium text-gray-600">Clique para anexar arquivo</p>
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setAttachments([...attachments, { name: file.name, data: reader.result as string }]);
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Observations */}
                    <div className="relative">
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            <MessageSquare size={14} /> Observações (@menções)
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Digite um comentário ou use @ para mencionar alguém..."
                            value={observations}
                            onChange={(e) => {
                                const val = e.target.value;
                                setObservations(val);

                                const cursor = e.target.selectionStart;
                                const lastAt = val.lastIndexOf('@', cursor - 1);

                                if (lastAt !== -1 && lastAt >= (val.lastIndexOf(' ', cursor - 1))) {
                                    const search = val.substring(lastAt + 1, cursor);
                                    setMentionSearch(search);
                                    setShowMentionList(true);
                                } else {
                                    setShowMentionList(false);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && observations.trim() && editingTask) {
                                    e.preventDefault();
                                    handleSendObservation();
                                }
                            }}
                            className="w-full bg-gray-50/50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none text-sm pr-12"
                        ></textarea>

                        {editingTask && (
                            <button
                                onClick={handleSendObservation}
                                disabled={!observations.trim()}
                                className="absolute bottom-3 right-3 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Enviar comentário"
                            >
                                <MessageSquare size={16} />
                            </button>
                        )}

                        {editingTask && editingTask.observations && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 max-h-40 overflow-y-auto space-y-2">
                                {editingTask.observations.split('\n').filter(line => line.trim()).map((line, idx) => (
                                    <div key={idx} className="text-xs text-gray-600 border-b border-white pb-1">
                                        {line}
                                    </div>
                                ))}
                            </div>
                        )}

                        {showMentionList && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[10000] animate-in slide-in-from-bottom-2 duration-200">
                                <div className="p-2 border-b border-gray-50 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mencionar Equipe</div>
                                <div className="max-h-48 overflow-y-auto">
                                    {teamMembers.filter(m => m.name.toLowerCase().includes(mentionSearch.toLowerCase())).length > 0 ? (
                                        teamMembers
                                            .filter(m => m.name.toLowerCase().includes(mentionSearch.toLowerCase()))
                                            .map(member => (
                                                <button
                                                    key={member.id}
                                                    onClick={() => {
                                                        const lastAt = observations.lastIndexOf('@', observations.length);
                                                        const newVal = observations.substring(0, lastAt) + '@' + member.name + ' ';
                                                        setObservations(newVal);
                                                        setShowMentionList(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50 text-left transition-colors group"
                                                >
                                                    <img src={member.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                                                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{member.name}</span>
                                                </button>
                                            ))
                                    ) : (
                                        <div className="p-4 text-xs text-gray-400 text-center italic">Nenhum membro encontrado...</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4 bg-gray-50/50 rounded-b-2xl">
                    {editingTask ? (
                        <button onClick={handleDelete} className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full sm:w-auto">
                            <Trash2 size={16} /> Excluir
                        </button>
                    ) : <div></div>}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button onClick={closeModal} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors w-full sm:w-auto order-last sm:order-first">
                            Cancelar
                        </button>
                        {editingTask && status !== 'Concluído' && (
                            <button
                                onClick={async () => {
                                    setStatus('Concluído');
                                    const taskData = {
                                        title,
                                        company_id: company === 'Nenhuma' ? null : company,
                                        assignee: assignees,
                                        status: 'Concluído',
                                        priority,
                                        due_date: dueDate ? new Date(`${dueDate}T12:00:00`).toISOString() : new Date().toISOString(),
                                        observations,
                                        checklist,
                                        attachments
                                    };
                                    await updateTask(editingTask.id, taskData);
                                    closeModal();
                                }}
                                className="px-5 py-2.5 text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                <CheckCircle2 size={16} /> Finalizar Tarefa
                            </button>
                        )}
                        <button onClick={handleSave} className="px-5 py-2.5 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm shadow-primary-600/30 transition-all active:scale-95 w-full sm:w-auto">
                            {editingTask ? 'Salvar Alterações' : 'Salvar Tarefa'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
