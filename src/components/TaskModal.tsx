import { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import TurndownService from 'turndown';
import { X, Calendar, Upload, MessageSquare, Plus, CheckCircle2, Circle, Trash2, UserPlus, Download, Paperclip, HelpCircle, Activity, Link } from 'lucide-react';
import { useTasks } from '../context/TasksContext';

export const TaskModal = () => {
    const { 
        isModalOpen, closeModal, editingTask, addTask, updateTask, deleteTask, 
        companies, teamMembers, session, boards, boardColumns, activeBoardId,
        UNIDADES, CORPORATIVO_SECTORS, UNIDADES_SECTORS
    } = useTasks();

    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('Nenhuma');
    const [assignees, setAssignees] = useState<string[]>([]);
    const [status, setStatus] = useState('Não Iniciado');
    const [boardId, setBoardId] = useState<string | null>(null);
    const [columnId, setColumnId] = useState<string | null>(null);
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Média');
    const [unit, setUnit] = useState('Corporativo');
    const [sector, setSector] = useState('Comercial');
    const [observations, setObservations] = useState('');
    const [observationsHistory, setObservationsHistory] = useState('');
    const [checklist, setChecklist] = useState<{
        id: number;
        text: string;
        done: boolean;
        due_date?: string | null;
        assignees?: string[];
        sub_items?: { id: number, text: string, done: boolean }[];
    }[]>([]);
    const [editingChecklistItemId, setEditingChecklistItemId] = useState<number | null>(null);
    const [attachments, setAttachments] = useState<{ name: string, data: string }[]>([]);
    const [newChecklistItem, setNewChecklistItem] = useState('');
    const [mentionSearch, setMentionSearch] = useState('');
    const [showMentionList, setShowMentionList] = useState(false);
    const [activeChecklistMenu, setActiveChecklistMenu] = useState<{ id: number, type: 'date' | 'users' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showActivityDetails, setShowActivityDetails] = useState(false);
    const [leftWidth, setLeftWidth] = useState(65);
    const [isLg, setIsLg] = useState(true);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingCommentText, setEditingCommentText] = useState('');
    const isDraggingRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentUser = teamMembers.find(m => m.email === session?.user?.email)?.name || 'Sistema';

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        if (newLeftWidth >= 30 && newLeftWidth <= 80) {
            setLeftWidth(newLeftWidth);
        }
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDraggingRef.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsLg(window.innerWidth >= 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, []);

    const prevTaskIdRef = useRef<string | null>(null);
    const obsTextareaRef = useRef<HTMLTextAreaElement>(null);

    const insertMarkdown = (syntax: 'bold' | 'italic' | 'list' | 'link' | 'heading') => {
        if (!obsTextareaRef.current) return;
        
        const textarea = obsTextareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        
        let replacement = '';
        if (syntax === 'bold') {
            replacement = `**${text.substring(start, end) || 'texto'}**`;
        } else if (syntax === 'italic') {
            replacement = `*${text.substring(start, end) || 'texto'}*`;
        } else if (syntax === 'list') {
            replacement = `\n- ${text.substring(start, end) || 'item'}`;
        } else if (syntax === 'link') {
            replacement = `[${text.substring(start, end) || 'link'}](url)`;
        } else if (syntax === 'heading') {
            replacement = `\n### ${text.substring(start, end) || 'Título'}`;
        }
        
        const newVal = text.substring(0, start) + replacement + text.substring(end);
        setObservations(newVal);
        
        // Reset focus and selection
        setTimeout(() => {
            textarea.focus();
            const offset = syntax === 'bold' ? 2 : syntax === 'italic' ? 1 : syntax === 'list' ? 3 : syntax === 'heading' ? 5 : 1;
            const newCursorPos = start + offset + (text.substring(start, end).length || (syntax === 'bold' ? 5 : syntax === 'italic' ? 5 : syntax === 'list' ? 4 : syntax === 'heading' ? 6 : 4));
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const parsedHistory = useMemo(() => {
        if (!observationsHistory) return [];
        
        const lines = observationsHistory.split('\n');
        const items: {
            id: number;
            lineIndices: number[];
            timestamp: string;
            author: string;
            content: string;
            avatarUrl: string | null;
            isComment: boolean;
        }[] = [];
        let currentItem: typeof items[number] | null = null;

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            // Try to parse as header with colon
            const matchWithColon = trimmedLine.match(/^\[(.*?)\]\s*(.*?):\s*(.*)$/);
            if (matchWithColon) {
                if (currentItem) items.push(currentItem);
                
                const timestamp = matchWithColon[1];
                const author = matchWithColon[2];
                const content = matchWithColon[3];
                const member = teamMembers.find(m => m.name.toLowerCase() === author.toLowerCase());
                const isSystemAction = author === 'Sistema' || 
                    content.includes('alterou') || 
                    content.includes('moveu') || 
                    content.includes('adicionou') || 
                    content.includes('excluiu') || 
                    content.includes('finalizou') || 
                    content.includes('criou');

                currentItem = {
                    id: index,
                    lineIndices: [index],
                    timestamp,
                    author,
                    content,
                    avatarUrl: member?.avatar_url || null,
                    isComment: !isSystemAction
                };
                return;
            }

            // Try to parse as header without colon
            const matchWithoutColon = trimmedLine.match(/^\[(.*?)\]\s*(\S+\s+\S+)\s+(.*)$/);
            if (matchWithoutColon) {
                if (currentItem) items.push(currentItem);
                
                const timestamp = matchWithoutColon[1];
                const author = matchWithoutColon[2];
                const content = matchWithoutColon[3];
                const member = teamMembers.find(m => m.name.toLowerCase() === author.toLowerCase());

                currentItem = {
                    id: index,
                    lineIndices: [index],
                    timestamp,
                    author,
                    content,
                    avatarUrl: member?.avatar_url || null,
                    isComment: false
                };
                return;
            }

            // If it is a continuation line of a previous item
            if (currentItem) {
                currentItem.content += '\n' + trimmedLine;
                currentItem.lineIndices.push(index);
            } else {
                // Standalone fallback
                items.push({
                    id: index,
                    lineIndices: [index],
                    timestamp: '',
                    author: 'Sistema',
                    content: trimmedLine,
                    avatarUrl: null,
                    isComment: false
                });
            }
        });

        if (currentItem) {
            items.push(currentItem);
        }

        return items;
    }, [observationsHistory, teamMembers]);

    // Efeito para auto-ajuste da altura do textarea de observações
    useEffect(() => {
        if (obsTextareaRef.current) {
            obsTextareaRef.current.style.height = 'auto';
            obsTextareaRef.current.style.height = `${obsTextareaRef.current.scrollHeight}px`;
        }
    }, [observations]);

    // Efeito para carregar os dados da tarefa apenas quando abrir o modal ou mudar de tarefa
    useEffect(() => {
        // Se o modal não estiver aberto, limpamos tudo e resetamos o rastreador
        if (!isModalOpen) {
            prevTaskIdRef.current = null;
            setTitle('');
            setCompany('Nenhuma');
            setAssignees([]);
            setStatus('Não Iniciado');
            setDueDate('');
            setPriority('Média');
            setUnit('Corporativo');
            setSector('Comercial');
            setObservations('');
            setObservationsHistory('');
            setChecklist([]);
            setAttachments([]);
            return;
        }

        // Só carregamos os dados se for uma tarefa REALMENTE diferente (ID mudou) ou se nada foi carregado ainda
        const currentId = editingTask?.id || 'new';
        if (currentId !== prevTaskIdRef.current) {
            prevTaskIdRef.current = currentId;

            if (editingTask) {
                setTitle(editingTask.title || '');
                setCompany(editingTask.company_id || 'Nenhuma');
                setAssignees(editingTask.assignee || []);
                setStatus(editingTask.status || 'Não Iniciado');
                setBoardId(editingTask.board_id);
                setColumnId(editingTask.column_id);
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
                setUnit(editingTask.unit || 'Corporativo');
                setSector(editingTask.sector || 'Comercial');
                setObservations(''); // Limpa o campo de digitação para novos comentários
                setObservationsHistory(editingTask.observations || '');
                setChecklist(editingTask.checklist || []);
                setAttachments(editingTask.attachments || []);
            } else {
                // Nova tarefa
                setTitle('');
                const defBoard = activeBoardId !== 'Todas' ? activeBoardId : (boards.find(b => b.is_default)?.id || boards[0]?.id || null);
                setBoardId(defBoard);
                const defCol = boardColumns.find(c => c.board_id === defBoard)?.id || null;
                setColumnId(defCol);
                setUnit('Corporativo');
                setSector('Comercial');
                setObservations('');
                setObservationsHistory('');
            }
        }
    }, [editingTask, isModalOpen, boards, activeBoardId]);

    // Efeito para auto-ajustar o Setor quando a Unidade muda
    useEffect(() => {
        if (!isModalOpen) return;
        const availableSectors = unit === 'Corporativo' ? CORPORATIVO_SECTORS : UNIDADES_SECTORS;
        if (!availableSectors.includes(sector)) {
            setSector(availableSectors[0]);
        }
    }, [unit, isModalOpen, CORPORATIVO_SECTORS, UNIDADES_SECTORS, sector]);

    // Efeito para auto-ajustar o Quadro quando o Setor muda
    useEffect(() => {
        if (!isModalOpen) return;
        const parent = boards.find(pb => pb.name === sector && !pb.parent_board_id);
        let availableBoards = [];
        if (!parent) {
            availableBoards = boards.filter(b => !b.parent_board_id);
        } else {
            const subs = boards.filter(sb => sb.parent_board_id === parent.id);
            if (subs.length > 0) availableBoards = subs;
            else availableBoards = [parent];
        }

        if (availableBoards.length > 0 && !availableBoards.find(b => b.id === boardId)) {
            const newBoardId = availableBoards[0].id;
            setBoardId(newBoardId);
            const cols = boardColumns.filter(c => c.board_id === newBoardId);
            if (cols.length > 0) {
                setColumnId(cols[0].id);
            }
        }
    }, [sector, boards, isModalOpen, boardColumns, boardId]);

    const handleSave = async () => {
        if (!title.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const taskData = {
                title,
                company_id: company === 'Nenhuma' ? null : company,
                assignee: assignees,
                status,
                board_id: boardId,
                column_id: columnId,
                priority,
                unit,
                sector,
                created_by: editingTask ? editingTask.created_by : (session?.user?.email || 'Sistema'),
                due_date: dueDate ? new Date(`${dueDate}T12:00:00`).toISOString() : new Date().toISOString(),
                observations: observationsHistory + (observations.trim() ? `\n[${new Date().toLocaleString('pt-BR')}] ${teamMembers.find(m => m.email === session?.user?.email)?.name || 'Sistema'}: ${observations.trim()}` : ''),
                checklist,
                attachments
            };

            if (editingTask) {
                await updateTask(editingTask.id, taskData);
            } else {
                await addTask(taskData);
            }
            closeModal();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBoardChange = (newId: string) => {
        setBoardId(newId);
        const firstCol = boardColumns.find(c => c.board_id === newId);
        if (firstCol) {
            setColumnId(firstCol.id);
            setStatus(firstCol.title);
        }
    };

    const handleColumnChange = (newColId: string) => {
        setColumnId(newColId);
        const col = boardColumns.find(c => c.id === newColId);
        if (col) setStatus(col.title);
    };

    const handleSendObservation = async () => {
        if (!observations.trim()) return;

        const timestamp = new Date().toLocaleString('pt-BR');
        const currentUser = teamMembers.find(m => m.email === session?.user?.email)?.name || 'Sistema';
        const newMsg = `\n[${timestamp}] ${currentUser}: ${observations}`;

        const updatedObs = (observationsHistory || '') + newMsg;

        setObservationsHistory(updatedObs);
        setObservations(''); // Limpa o campo localmente para a próxima

        if (editingTask) {
            await updateTask(editingTask.id, { observations: updatedObs });
        }
    };

    const handleEditComment = async (itemId: number, newText: string) => {
        if (!newText.trim()) return;
        
        const itemToEdit = parsedHistory.find(item => item.id === itemId);
        if (!itemToEdit) return;
        
        const lines = observationsHistory.split('\n');
        const headerLine = lines[itemToEdit.lineIndices[0]];
        const matchWithColon = headerLine.match(/^\[(.*?)\]\s*(.*?):\s*(.*)$/);
        
        if (matchWithColon) {
            const timestamp = matchWithColon[1];
            const author = matchWithColon[2];
            
            // Format the edited comment
            const newCommentStr = `[${timestamp}] ${author}: ${newText.trim()}`;
            
            // Replace the range of lines corresponding to the old comment
            const startIdx = itemToEdit.lineIndices[0];
            const deleteCount = itemToEdit.lineIndices.length;
            
            lines.splice(startIdx, deleteCount, newCommentStr);
            
            const updatedObs = lines.join('\n');
            setObservationsHistory(updatedObs);
            setEditingCommentId(null);
            setEditingCommentText('');
            
            if (editingTask) {
                await updateTask(editingTask.id, { observations: updatedObs });
            }
        }
    };
 
    const handleDeleteComment = async (itemId: number) => {
        if (!window.confirm('Deseja realmente excluir este comentário?')) return;
        
        const itemToDelete = parsedHistory.find(item => item.id === itemId);
        if (!itemToDelete) return;
        
        const lines = observationsHistory.split('\n');
        const startIdx = itemToDelete.lineIndices[0];
        const deleteCount = itemToDelete.lineIndices.length;
        
        lines.splice(startIdx, deleteCount);
        
        const updatedObs = lines.join('\n');
        setObservationsHistory(updatedObs);
        
        if (editingTask) {
            await updateTask(editingTask.id, { observations: updatedObs });
        }
    };

    const handleDelete = async () => {
        if (editingTask && window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            await deleteTask(editingTask.id);
            closeModal();
        }
    };

    if (!isModalOpen) return null;

    const availableSectors = unit === 'Corporativo' ? CORPORATIVO_SECTORS : UNIDADES_SECTORS;

    const availableBoards = boards.filter(b => {
        const parent = boards.find(pb => pb.name === sector && !pb.parent_board_id);
        if (!parent) return !b.parent_board_id;
        const subs = boards.filter(sb => sb.parent_board_id === parent.id);
        if (subs.length > 0) return b.parent_board_id === parent.id;
        return b.id === parent.id;
    });

    const availableMembers = teamMembers.filter(m => m.sectors?.includes(sector) || m.role === 'master');

    const availableColumns = boardColumns.filter(c => c.board_id === boardId);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={closeModal} />
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-10 border border-white/50 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                    <div className="flex flex-col w-full">
                        <input
                            type="text"
                            placeholder="Título da Tarefa..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-300 w-full text-gray-800"
                        />
                        {editingTask?.created_by && (
                            <span className="text-xs text-gray-400 mt-1 px-4 font-medium">
                                Solicitado por: <span className="text-gray-500">{teamMembers.find(m => m.email === editingTask.created_by)?.name || editingTask.created_by.split('@')[0]}</span>
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {editingTask && (
                            <button 
                                onClick={() => {
                                    const url = `${window.location.origin}/kanban?task=${editingTask.id}`;
                                    navigator.clipboard.writeText(url);
                                    alert('Link da tarefa copiado para a área de transferência!');
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors text-xs font-bold"
                                title="Copiar Link da Tarefa"
                            >
                                <Link size={16} />
                                <span className="hidden sm:inline">Copiar Link</span>
                            </button>
                        )}
                        <button onClick={closeModal} className="p-2 bg-gray-100/50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors ml-2">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Grid Body */}
                <div className={`flex-1 pretty-scrollbar-y ${isLg ? 'flex flex-col overflow-hidden p-0' : 'p-6 overflow-y-auto'}`}>
                    <div ref={containerRef} className={`flex ${isLg ? 'flex-row overflow-hidden gap-0 flex-1 min-h-0' : 'flex-col gap-8'}`}>
                        {/* Coluna da Esquerda (Principal) */}
                        <div 
                            className={`space-y-6 pretty-scrollbar-y ${isLg ? 'overflow-y-auto pt-6 pb-6 pl-6 pr-4 flex-shrink-0 min-h-0' : 'w-full'}`}
                            style={{ width: isLg ? `${leftWidth}%` : '100%' }}
                        >
                            {/* Metadados originais divididos em sub-colunas */}
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Unidade</label>
                                            <select
                                                value={unit}
                                                onChange={(e) => setUnit(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                                                {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Setor</label>
                                            <select
                                                value={sector}
                                                onChange={(e) => setSector(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                                                {availableSectors.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quadro</label>
                                            <select
                                                value={boardId || ''}
                                                onChange={(e) => handleBoardChange(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                                                <option value="" disabled>Selecionar...</option>
                                                {availableBoards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Etapa (Coluna)</label>
                                            <select
                                                value={columnId || ''}
                                                onChange={(e) => handleColumnChange(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                                                <option value="" disabled>Selecionar...</option>
                                                {availableColumns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Responsáveis</label>
                                        <div className="space-y-2 max-h-40 overflow-y-auto p-3 bg-gray-50 border border-gray-200 rounded-xl pretty-scrollbar-y">
                                            {availableMembers.map(member => (
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
                                            {availableMembers.length === 0 && (
                                                <p className="text-xs text-gray-400 italic text-center py-2">Nenhum membro da equipe encontrado neste setor.</p>
                                            )}
                                        </div>
                                        {assignees.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {assignees.map(name => (
                                                    <span key={name} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-md text-[10px] font-bold">
                                                        {name}
                                                        <button type="button" onClick={() => setAssignees(assignees.filter(a => a !== name))} className="hover:text-primary-900">
                                                            <X size={10} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
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
                                                                type="button"
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
                                                                type="button"
                                                                onClick={() => setActiveChecklistMenu(activeChecklistMenu && activeChecklistMenu.id === item.id && activeChecklistMenu.type === 'users' ? null : { id: item.id, type: 'users' })}
                                                                className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${itemAssignees.length > 0 ? 'text-primary-600 bg-primary-50' : 'text-gray-400'}`}
                                                                title="Adicionar responsáveis"
                                                            >
                                                                <UserPlus size={14} />
                                                            </button>
                                                            {activeChecklistMenu && activeChecklistMenu.id === item.id && activeChecklistMenu.type === 'users' && (
                                                                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-[99999] animate-in zoom-in-95 duration-200">
                                                                    <div className="max-h-40 overflow-y-auto space-y-1 pretty-scrollbar-y">
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
                                                            type="button"
                                                            onClick={() => setEditingChecklistItemId(item.id)}
                                                            className="text-gray-300 hover:text-primary-500 transition-all p-1.5"
                                                            title="Detalhes Avançados (Sub-tarefas)"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setChecklist(checklist.filter(c => c.id !== item.id))}
                                                            className="text-gray-300 hover:text-red-500 transition-all p-1.5"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Detalhes do item (data, responsáveis e sub-tarefas) */}
                                                {(item.due_date || itemAssignees.length > 0 || (item.sub_items && item.sub_items.length > 0)) && (
                                                    <div className="flex flex-col gap-2 ml-8 mt-1">
                                                        <div className="flex items-center gap-3">
                                                            {item.due_date && (
                                                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${isOverdue ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                                                    <Calendar size={10} />
                                                                    {new Date(item.due_date).toLocaleDateString('pt-BR')}
                                                                </div>
                                                            )}
                                                            {itemAssignees.length > 0 && (
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
                                                            )}
                                                        </div>
                                                        {item.sub_items && item.sub_items.length > 0 && (
                                                            <div className="flex flex-col gap-1.5 mt-1 border-l-2 border-gray-100 pl-3">
                                                                {item.sub_items.map(sub => (
                                                                    <div key={sub.id} className="flex items-center gap-2 group/sub">
                                                                        <button onClick={() => {
                                                                            setChecklist(checklist.map(c => c.id === item.id ? { ...c, sub_items: c.sub_items?.map(s => s.id === sub.id ? { ...s, done: !s.done } : s) } : c));
                                                                        }}>
                                                                            {sub.done ? <CheckCircle2 size={12} className="text-primary-500" /> : <Circle size={12} className="text-gray-300 hover:text-primary-400" />}
                                                                        </button>
                                                                        <span className={`text-[11px] ${sub.done ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                                                            {sub.text}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
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

                            {/* Anexos */}
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
                                                        type="button"
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
                                                        type="button"
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
                        </div>

                        {/* Divisória Arrastável (Resizer Bar) */}
                        {isLg && (
                            <div 
                                onMouseDown={handleMouseDown}
                                className="w-1.5 hover:w-2 hover:bg-primary-500/50 bg-gray-100 hover:cursor-col-resize select-none flex items-center justify-center border-l border-r border-gray-200/30 transition-all self-stretch relative z-20 flex-shrink-0"
                                title="Arraste para redimensionar"
                            >
                                <div className="w-[2px] h-10 bg-gray-300 group-hover:bg-primary-600 rounded-full transition-colors" />
                            </div>
                        )}

                        {/* Coluna da Direita (Lateral) */}
                        <div 
                            className={`space-y-6 pretty-scrollbar-y ${isLg ? 'overflow-y-auto pt-6 pb-6 pl-4 pr-6 flex-1 min-h-0' : 'w-full'}`}
                        >
                            {/* Comentários e Atividade (Trello Style) */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-semibold text-gray-800 flex items-center gap-2">
                                        <MessageSquare size={14} className="text-gray-500" />
                                        Comentários e atividade
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowActivityDetails(!showActivityDetails)}
                                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                                    >
                                        {showActivityDetails ? 'Ocultar detalhes' : 'Mostrar detalhes'}
                                    </button>
                                </div>

                                {/* Editor */}
                                <div className="space-y-3">
                                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                                        {/* Barra de Formatação */}
                                        <div className="flex items-center justify-between px-2.5 py-1.5 bg-gray-50 border-b border-gray-150 text-gray-500 select-none text-[11px]">
                                            <div className="flex items-center gap-1">
                                                <button 
                                                    type="button"
                                                    onClick={() => insertMarkdown('heading')}
                                                    className="p-1 hover:bg-gray-200 rounded font-bold transition-colors flex items-center gap-0.5" 
                                                    title="Tamanho do texto"
                                                >
                                                    <span>Tt</span>
                                                    <Plus size={8} className="opacity-70" />
                                                </button>
                                                <div className="h-3 w-[1px] bg-gray-300 mx-0.5" />
                                                <button 
                                                    type="button"
                                                    onClick={() => insertMarkdown('bold')}
                                                    className="p-1 hover:bg-gray-200 rounded font-extrabold transition-colors px-1.5" 
                                                    title="Negrito"
                                                >
                                                    B
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => insertMarkdown('italic')}
                                                    className="p-1 hover:bg-gray-200 rounded italic font-serif transition-colors px-1.5" 
                                                    title="Itálico"
                                                >
                                                    I
                                                </button>
                                                <button 
                                                    type="button"
                                                    className="p-1 hover:bg-gray-200 rounded transition-colors px-1" 
                                                    title="Mais formatações"
                                                >
                                                    ...
                                                </button>
                                                <div className="h-3 w-[1px] bg-gray-300 mx-0.5" />
                                                <button 
                                                    type="button"
                                                    onClick={() => insertMarkdown('list')}
                                                    className="p-1 hover:bg-gray-200 rounded transition-colors flex items-center gap-0.5" 
                                                    title="Lista com marcadores"
                                                >
                                                    <span className="font-mono text-[10px] leading-none">•=</span>
                                                    <Plus size={8} className="opacity-70" />
                                                </button>
                                                <button 
                                                    type="button"
                                                    className="p-1 hover:bg-gray-200 rounded transition-colors flex items-center gap-0.5" 
                                                    title="Adicionar item"
                                                >
                                                    <span>+</span>
                                                    <Plus size={8} className="opacity-70" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button 
                                                    type="button"
                                                    onClick={() => insertMarkdown('link')}
                                                    className="p-1 hover:bg-gray-200 rounded transition-colors" 
                                                    title="Link"
                                                >
                                                    <Paperclip size={12} className="rotate-45" />
                                                </button>
                                                <button 
                                                    type="button"
                                                    className="p-1 hover:bg-gray-200 rounded transition-colors" 
                                                    title="Ajuda de Markdown"
                                                >
                                                    <HelpCircle size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Textarea */}
                                        <textarea
                                            ref={obsTextareaRef}
                                            rows={3}
                                            placeholder="Escrever um comentário..."
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
                                            onPaste={(e) => {
                                                const html = e.clipboardData.getData('text/html');
                                                if (html) {
                                                    e.preventDefault();
                                                    const turndownService = new TurndownService();
                                                    const markdown = turndownService.turndown(html);
                                                    
                                                    // Insert markdown at cursor position
                                                    const start = e.currentTarget.selectionStart;
                                                    const end = e.currentTarget.selectionEnd;
                                                    const currentVal = observations;
                                                    const newVal = currentVal.substring(0, start) + markdown + currentVal.substring(end);
                                                    
                                                    setObservations(newVal);
                                                    
                                                    // Update cursor position after state update
                                                    setTimeout(() => {
                                                        if (obsTextareaRef.current) {
                                                            obsTextareaRef.current.selectionStart = start + markdown.length;
                                                            obsTextareaRef.current.selectionEnd = start + markdown.length;
                                                        }
                                                    }, 0);
                                                }
                                            }}
                                            className="w-full bg-transparent text-xs text-gray-700 py-2.5 px-3 focus:outline-none focus:ring-0 resize-none min-h-[70px] border-none"
                                        />
                                    </div>

                                    {/* Botões do Editor */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={handleSendObservation}
                                            disabled={!observations.trim()}
                                            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-1.5 px-4 rounded-lg transition-all text-xs"
                                        >
                                            Salvar
                                        </button>
                                    </div>
                                </div>

                                {/* Mencionador Popover */}
                                {showMentionList && (
                                    <div className="absolute w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[10000] animate-in slide-in-from-bottom-2 duration-200">
                                        <div className="p-2 border-b border-gray-50 bg-gray-50/50 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Mencionar Equipe</div>
                                        <div className="max-h-32 overflow-y-auto pretty-scrollbar-y">
                                            {teamMembers.filter(m => m.name.toLowerCase().includes(mentionSearch.toLowerCase())).length > 0 ? (
                                                teamMembers
                                                    .filter(m => m.name.toLowerCase().includes(mentionSearch.toLowerCase()))
                                                    .map(member => (
                                                        <button
                                                            key={member.id}
                                                            type="button"
                                                            onClick={() => {
                                                                const lastAt = observations.lastIndexOf('@', observations.length);
                                                                const newVal = observations.substring(0, lastAt) + '@' + member.name + ' ';
                                                                setObservations(newVal);
                                                                setShowMentionList(false);
                                                            }}
                                                            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-primary-50 text-left transition-colors group"
                                                        >
                                                            <img src={member.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                                                            <span className="text-xs font-medium text-gray-700 group-hover:text-primary-700">{member.name}</span>
                                                        </button>
                                                    ))
                                            ) : (
                                                <div className="p-3 text-[10px] text-gray-400 text-center italic">Nenhum membro encontrado...</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Lista de Comentários / Feed */}
                                {parsedHistory.length > 0 && (
                                    <div className="space-y-3 overflow-y-auto pr-1 pretty-scrollbar-y pt-2 flex-1 min-h-0">
                                        {parsedHistory.map((item) => {
                                            if (item.isComment) {
                                                return (
                                                    <div key={item.id} className="flex gap-2 items-start group animate-in fade-in duration-200">
                                                        {/* Avatar */}
                                                        <div className="w-7 h-7 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white shadow-sm mt-0.5">
                                                            {item.avatarUrl ? (
                                                                <img src={item.avatarUrl} alt={item.author} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-[9px] font-bold text-primary-700">{item.author.charAt(0).toUpperCase()}</span>
                                                            )}
                                                        </div>
                                                        {/* Conteúdo do Comentário */}
                                                        <div className="flex-1 min-w-0 space-y-0.5">
                                                            <div className="flex items-baseline gap-1.5">
                                                                <span className="text-xs font-semibold text-gray-800">{item.author}</span>
                                                                <span className="text-[9px] text-gray-400 hover:underline cursor-pointer">
                                                                    {item.timestamp}
                                                                </span>
                                                            </div>
                                                            {editingCommentId === item.id ? (
                                                                <div className="space-y-2 mt-1 w-full max-w-md">
                                                                    <textarea
                                                                        value={editingCommentText}
                                                                        onChange={(e) => setEditingCommentText(e.target.value)}
                                                                        className="w-full bg-white border border-gray-200 text-xs text-gray-700 py-1.5 px-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none min-h-[60px]"
                                                                        rows={2}
                                                                        autoFocus
                                                                    />
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleEditComment(item.id, editingCommentText)}
                                                                            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] transition-all"
                                                                        >
                                                                            Salvar
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setEditingCommentId(null);
                                                                                setEditingCommentText('');
                                                                            }}
                                                                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-1 px-3 rounded-lg text-[10px] transition-all"
                                                                        >
                                                                            Cancelar
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="bg-gray-100 border border-gray-150/50 text-gray-800 text-[11px] py-1.5 px-2.5 rounded-xl rounded-tl-none inline-block max-w-full leading-relaxed shadow-sm break-words">
                                                                    <ReactMarkdown 
                                                                        components={{
                                                                            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-bold" />
                                                                        }}
                                                                    >
                                                                        {(() => {
                                                                            let text = item.content || '';
                                                                            // Force single newlines to break by adding two spaces
                                                                            text = text.replace(/\n/g, '  \n');
                                                                            // Force multiple empty lines to render using zero-width space
                                                                            while (text.includes('\n\n')) {
                                                                                text = text.replace(/\n\n/g, '\n\u200B\n');
                                                                            }
                                                                            return text;
                                                                        })()}
                                                                    </ReactMarkdown>
                                                                </div>
                                                            )}
                                                            {/* Reaction + Responder row */}
                                                            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 pl-0.5">
                                                                <button type="button" className="hover:text-gray-650 transition-colors flex items-center gap-0.5">
                                                                    <span>😊</span>
                                                                    <Plus size={8} />
                                                                </button>
                                                                <span>•</span>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setObservations(prev => (prev.trim() ? prev + ' ' : '') + `@${item.author} `);
                                                                        obsTextareaRef.current?.focus();
                                                                    }}
                                                                    className="hover:text-primary-650 hover:underline font-bold"
                                                                >
                                                                    Responder
                                                                </button>
                                                                {item.author.toLowerCase() === currentUser.toLowerCase() && editingCommentId !== item.id && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <button 
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setEditingCommentId(item.id);
                                                                                setEditingCommentText(item.content);
                                                                            }}
                                                                            className="hover:text-primary-650 hover:underline font-bold"
                                                                        >
                                                                            Editar
                                                                        </button>
                                                                        <span>•</span>
                                                                        <button 
                                                                            type="button"
                                                                            onClick={() => handleDeleteComment(item.id)}
                                                                            className="hover:text-red-650 hover:underline font-bold text-red-500/80"
                                                                        >
                                                                            Excluir
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            } else {
                                                if (!showActivityDetails) return null;
                                                return (
                                                    <div key={item.id} className="flex gap-2 items-start text-[10px] text-gray-500 pl-1 animate-in fade-in duration-200">
                                                        {/* Icon / Mini Avatar */}
                                                        <div className="w-7 h-7 rounded-full bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm mt-0.5">
                                                            {item.avatarUrl ? (
                                                                <img src={item.avatarUrl} alt={item.author} className="w-full h-full object-cover opacity-60" />
                                                            ) : (
                                                                <Activity size={10} className="text-gray-450" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0 py-0.5 break-words">
                                                            <p className="leading-relaxed">
                                                                <span className="font-semibold text-gray-700">{item.author}</span> {item.content}
                                                            </p>
                                                            <span className="text-[8px] text-gray-400 hover:underline cursor-pointer block mt-0.5">
                                                                {item.timestamp}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4 bg-gray-50/50 rounded-b-2xl shrink-0">
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
                                disabled={isSubmitting}
                                onClick={async () => {
                                    if (isSubmitting) return;
                                    setIsSubmitting(true);
                                    try {
                                        // Busca o ID da coluna de Concluído deste quadro
                                        const concluidoCol = boardColumns.find(c => c.board_id === boardId && c.title.toLowerCase().includes('concluído'));
                                        const finalColId = concluidoCol ? concluidoCol.id : columnId;

                                        setStatus('Concluído');
                                        const taskData = {
                                            title,
                                            company_id: company === 'Nenhuma' ? null : company,
                                            assignee: assignees,
                                            status: 'Concluído',
                                            column_id: finalColId,
                                            priority,
                                            due_date: dueDate ? new Date(`${dueDate}T12:00:00`).toISOString() : new Date().toISOString(),
                                            observations,
                                            checklist,
                                            attachments
                                        };
                                        await updateTask(editingTask.id, taskData);
                                        closeModal();
                                    } finally {
                                        setIsSubmitting(false);
                                    }
                                }}
                                className="px-5 py-2.5 text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
                            >
                                <CheckCircle2 size={16} /> Finalizar Tarefa
                            </button>
                        )}
                        <button 
                            onClick={handleSave} 
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm shadow-primary-600/30 transition-all active:scale-95 w-full sm:w-auto disabled:opacity-50"
                        >
                            {isSubmitting ? 'Salvando...' : (editingTask ? 'Salvar Alterações' : 'Salvar Tarefa')}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Modal de Detalhes do Checklist */}
            {editingChecklistItemId !== null && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setEditingChecklistItemId(null)}>
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        {(() => {
                            const item = checklist.find(c => c.id === editingChecklistItemId);
                            if (!item) return null;
                            const isOverdue = item.due_date ? new Date(item.due_date) < new Date(new Date().setHours(0,0,0,0)) && !item.done : false;
                            
                            return (
                                <>
                                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                                        <h3 className="text-lg font-black text-gray-800 tracking-tight">Detalhes do Checklist</h3>
                                        <button onClick={() => setEditingChecklistItemId(null)} className="p-2 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-600 shadow-sm border border-transparent hover:border-gray-100">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="p-6 overflow-y-auto pretty-scrollbar-y flex-1 space-y-6">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Descrição da Tarefa</label>
                                            <input 
                                                type="text" 
                                                value={item.text} 
                                                onChange={e => setChecklist(checklist.map(c => c.id === item.id ? { ...c, text: e.target.value } : c))}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Data Limite</label>
                                                <input 
                                                    type="date" 
                                                    value={item.due_date || ''}
                                                    onChange={e => setChecklist(checklist.map(c => c.id === item.id ? { ...c, due_date: e.target.value } : c))}
                                                    className={`w-full bg-gray-50 border text-sm py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all ${isOverdue ? 'border-red-300 text-red-600' : 'border-gray-200 text-gray-700'}`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Responsáveis</label>
                                                <div className="relative group/users">
                                                    <div className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm py-2.5 px-4 rounded-xl flex items-center justify-between cursor-pointer">
                                                        <span className="truncate">{item.assignees && item.assignees.length > 0 ? item.assignees.join(', ') : 'Nenhum'}</span>
                                                        <UserPlus size={16} className="text-gray-400" />
                                                    </div>
                                                    <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-[99999] hidden group-hover/users:block">
                                                        <div className="max-h-40 overflow-y-auto space-y-1 pretty-scrollbar-y">
                                                            {teamMembers.map(member => (
                                                                <label key={member.id} className="flex items-center gap-2 p-2 hover:bg-primary-50 rounded-lg cursor-pointer transition-colors">
                                                                    <input 
                                                                        type="checkbox"
                                                                        className="w-4 h-4 text-primary-600 rounded"
                                                                        checked={(item.assignees || []).includes(member.name)}
                                                                        onChange={(e) => {
                                                                            const newAssignees = e.target.checked 
                                                                                ? [...(item.assignees || []), member.name]
                                                                                : (item.assignees || []).filter(name => name !== member.name);
                                                                            setChecklist(checklist.map(c => c.id === item.id ? { ...c, assignees: newAssignees } : c));
                                                                        }}
                                                                    />
                                                                    <span className="text-xs font-medium text-gray-700">{member.name}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Sub-tarefas</label>
                                            </div>
                                            <div className="space-y-2 mb-3">
                                                {item.sub_items && item.sub_items.length > 0 ? item.sub_items.map(sub => (
                                                    <div key={sub.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl group/sub">
                                                        <button onClick={() => setChecklist(checklist.map(c => c.id === item.id ? { ...c, sub_items: c.sub_items?.map(s => s.id === sub.id ? { ...s, done: !s.done } : s) } : c))}>
                                                            {sub.done ? <CheckCircle2 size={18} className="text-primary-500" /> : <Circle size={18} className="text-gray-300 hover:text-primary-400" />}
                                                        </button>
                                                        <input 
                                                            type="text" 
                                                            value={sub.text}
                                                            onChange={e => setChecklist(checklist.map(c => c.id === item.id ? { ...c, sub_items: c.sub_items?.map(s => s.id === sub.id ? { ...s, text: e.target.value } : s) } : c))}
                                                            className={`flex-1 bg-transparent border-none focus:outline-none text-sm ${sub.done ? 'line-through text-gray-400' : 'text-gray-700'}`}
                                                        />
                                                        <button 
                                                            onClick={() => setChecklist(checklist.map(c => c.id === item.id ? { ...c, sub_items: c.sub_items?.filter(s => s.id !== sub.id) } : c))}
                                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover/sub:opacity-100 transition-all p-1"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                )) : (
                                                    <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                        <p className="text-xs text-gray-400 font-medium">Nenhuma sub-tarefa criada</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 p-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 focus-within:border-primary-300 focus-within:bg-white transition-all">
                                                <Plus size={16} className="text-gray-400" />
                                                <input 
                                                    type="text" 
                                                    placeholder="Adicionar sub-tarefa..."
                                                    className="flex-1 bg-transparent border-none text-sm focus:outline-none text-gray-600"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                            const text = e.currentTarget.value.trim();
                                                            const newSub = { id: Date.now(), text, done: false };
                                                            setChecklist(checklist.map(c => c.id === item.id ? { ...c, sub_items: [...(c.sub_items || []), newSub] } : c));
                                                            e.currentTarget.value = '';
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                                        <button 
                                            onClick={() => setEditingChecklistItemId(null)}
                                            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-black shadow-lg shadow-primary-600/30 transition-all active:scale-95"
                                        >
                                            Concluído
                                        </button>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};
