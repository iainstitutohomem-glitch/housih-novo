import { createContext, useContext, useState, useEffect, useMemo, useRef, type Dispatch, type SetStateAction, type ReactNode, type FC } from 'react';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface TimelinePost {
    id: string;
    author_id: string;
    author_name?: string;
    author_avatar?: string;
    content: string;
    category?: string;
    visibility: string[];
    is_automated: boolean;
    image_url?: string;
    likes_count?: number;
    user_has_liked?: boolean;
    comments?: any[];
    created_at: string;
}

export interface Board {
    id: string;
    name: string;
    is_default: boolean;
    member_emails?: string[];
}

export interface BoardColumn {
    id: string;
    board_id: string;
    title: string;
    color: string;
    dot_color: string;
    order_index: number;
}

export const UNIDADES = [
    "Corporativo", "Tatuapé", "São José do Rio Preto", "Osasco", "Santos", "Piracicaba", 
    "São Bernardo do Campo", "Presidente Prudente", "Jundiaí", "Faria Lima", 
    "São José dos Campos", "Ribeirão Preto", "Bauru", "Campo Grande", 
    "Curitiba", "Londrina", "Foz do Iguaçu", "Joinville", "Florianópolis", 
    "Balneário Camboriú", "Geral"
];

export const CORPORATIVO_SECTORS = [
    "Arquitetura e Obras", "Atendimento Comercial", "Cobrança", "Comercial", 
    "Comunicação & Marketing", "Financeiro", "Jurídico", 
    "Operações & Projetos Internos", "RH", "Geral"
];

export const UNIDADES_SECTORS = [
    "Recepção", "Administrativo", "Gestor/Assessor", "Enfermagem", "Médicos", "Geral"
];

export const SETORES = Array.from(new Set([...CORPORATIVO_SECTORS, ...UNIDADES_SECTORS]));

export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    company_id: string | null;
    due_date: string;
    checklist: any[];
    observations: string;
    assignee: string[];
    attachments: any[];
    board_id: string | null;
    column_id: string | null;
    order_index: number;
    unit?: string;
    sector?: string;
    created_by?: string;
}

export interface Company {
    id: string;
    name: string;
    color?: string;
    logoBase64?: string;
    site?: string;
    social?: string;
    passwords?: { id: number, service: string, login: string, pass: string }[];
}

export interface TeamMember {
    id: string | number;
    name: string;
    avatar_url?: string;
    email?: string;
    units?: string[];
    sectors?: string[];
    birth_date?: string;
}

export interface Notification {
    id: string;
    recipient_email: string;
    sender_name: string;
    task_id?: string;
    task_title?: string;
    type: 'mention' | 'transfer' | 'chat' | 'ticket';
    message: string;
    read: boolean;
    created_at: string;
}

export interface FilterState {
    empresa: string;
    prioridade: string;
    responsavel: string;
    status: string;
    dataInicio: string;
    dataFim: string;
    busca: string;
}

interface TasksContextType {
    tasks: Task[];
    filteredTasks: Task[];
    filters: FilterState;
    setFilters: Dispatch<SetStateAction<FilterState>>;
    companies: Company[];
    teamMembers: TeamMember[];
    boards: Board[];
    boardColumns: BoardColumn[];
    activeBoardId: string;
    setActiveBoardId: (id: string) => void;
    fetchTasks: (silent?: boolean) => Promise<void>;
    updateTaskStatus: (taskId: string, columnId: string, statusName: string) => Promise<void>;
    addTask: (task: Partial<Task>) => Promise<void>;
    updateTask: (taskId: string, task: Partial<Task>) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    addCompany: (company: Partial<Company>) => Promise<void>;
    updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
    deleteCompany: (id: string) => Promise<void>;
    addTeamMember: (name: string, avatar_url: string, email?: string, units?: string[], sectors?: string[], password?: string, birth_date?: string) => Promise<void>;
    updateTeamMember: (id: string | number, updates: Partial<TeamMember>) => Promise<void>;
    deleteTeamMember: (id: string) => Promise<void>;
    notifications: Notification[];
    fetchNotifications: () => Promise<void>;
    markNotificationAsRead: (id: string) => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    clearAllNotifications: () => Promise<void>;
    createNotification: (notif: Partial<Notification>) => Promise<void>;
    loading: boolean;
    isModalOpen: boolean;
    editingTask: Task | null;
    openModal: (task?: Task) => Promise<void>;
    closeModal: () => void;
    session: any;
    createSharedReport: (title: string, data: any, filters: any) => Promise<string | null>;
    addBoard: (name: string, memberEmails?: string[]) => Promise<void>;
    updateBoard: (id: string, name: string, memberEmails?: string[]) => Promise<void>;
    deleteBoard: (id: string) => Promise<void>;
    addColumn: (boardId: string, column: Partial<BoardColumn>) => Promise<void>;
    updateColumn: (columnId: string, updates: Partial<BoardColumn>) => Promise<void>;
    deleteColumn: (columnId: string) => Promise<void>;
    updateColumnsOrder: (orderedCols: { id: string; order_index: number }[]) => Promise<void>;
    updateTaskOrder: (taskId: string, newOrder: number, columnId?: string, statusName?: string) => Promise<void>;
    UNIDADES: string[];
    SETORES: string[];
    activeUnit: string;
    setActiveUnit: (unit: string) => void;
    timelinePosts: TimelinePost[];
    addTimelinePost: (post: any) => Promise<void>;
    deleteTimelinePost: (id: string) => Promise<void>;
    uploadTimelineImage: (file: File) => Promise<string>;
    toggleLike: (postId: string) => Promise<void>;
    addComment: (postId: string, content: string) => Promise<void>;
    CORPORATIVO_SECTORS: string[];
    UNIDADES_SECTORS: string[];
    tickets: any[];
    fetchTickets: () => Promise<void>;
    addTicket: (ticket: any) => Promise<void>;
    addTicketMessage: (ticketId: string, content: string) => Promise<void>;
    updateTicketStatus: (id: string, status: 'aberto' | 'finalizado') => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { session } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [boards, setBoards] = useState<Board[]>([]);
    const [boardColumns, setBoardColumns] = useState<BoardColumn[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeBoardId, setActiveBoardId] = useState<string>('Todas');
    const [activeUnit, setActiveUnit] = useState<string>('Todas');

    const [timelinePosts, setTimelinePosts] = useState<TimelinePost[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);

    const [filters, setFilters] = useState<FilterState>({
        empresa: 'Todas',
        prioridade: 'Todas',
        responsavel: 'Todos',
        status: 'Todos',
        dataInicio: '',
        dataFim: '',
        busca: ''
    });

    const filteredTasks = useMemo(() => {
        const currentUser = teamMembers.find(m => m.email?.toLowerCase() === session?.user?.email?.toLowerCase());
        const isMaster = 
            currentUser?.sectors?.includes('Master') || 
            currentUser?.sectors?.includes('Diretoria') || 
            session?.user?.email?.toLowerCase() === 'institutohomem@gmail.com';

        return tasks.filter(task => {
            // 1. Filtragem por Unidade Ativa
            const matchesUnit = activeUnit === 'Todas' || task.unit === activeUnit;
            if (!matchesUnit) return false;

            // 2. Filtragem por Quadro Ativo
            const matchesBoard = activeBoardId === 'Todas' || task.board_id === activeBoardId;
            if (!matchesBoard) return false;

            // 3. Permissões de Visualização (Risco Zero de exposição se não for Master)
            if (!isMaster) {
                const userSectors = currentUser?.sectors || [];
                const taskBoard = boards.find(b => b.id === task.board_id);
                const isUserInTaskSector = userSectors.includes(taskBoard?.name || '');
                
                const isAssigned = Array.isArray(task.assignee) && (
                    task.assignee.includes(currentUser?.name || '') || 
                    task.assignee.includes(currentUser?.email || '')
                );

                if (!isUserInTaskSector && !isAssigned) return false;
            }

            // 4. Filtros da barra de ferramentas
            if (filters.empresa !== 'Todas' && task.company_id !== filters.empresa && task.title !== filters.empresa) return false;
            if (filters.prioridade !== 'Todas' && task.priority !== filters.prioridade) return false;
            if (filters.status !== 'Todos' && task.status !== filters.status) return false;
            if (filters.responsavel !== 'Todos' && (!Array.isArray(task.assignee) || !task.assignee.includes(filters.responsavel))) return false;

            if (filters.dataInicio || filters.dataFim) {
                if (!task.due_date) return false;
                const td = task.due_date.substring(0, 10);
                if (filters.dataInicio && td < filters.dataInicio) return false;
                if (filters.dataFim && td > filters.dataFim) return false;
            }
            if (filters.busca && !task.title.toLowerCase().includes(filters.busca.toLowerCase())) return false;
            
            return true;
        });
    }, [tasks, filters, session, teamMembers, activeUnit, activeBoardId, boards]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const openModal = async (task?: Task) => {
        if (task) {
            // OPTIMIZATION: Fetch full task details (description, checklist, etc) only when opening the modal
            // This allows the initial Kanban load to stay light and avoid timeouts.
            const { data, error } = await supabase.from('tasks').select('*').eq('id', task.id).single();
            if (!error && data) {
                // Ensure assignee is always an array
                if (!Array.isArray(data.assignee)) {
                    data.assignee = typeof data.assignee === 'string' ? [data.assignee] : [];
                }
                setEditingTask(data);
            } else {
                setEditingTask(task);
            }
        } else {
            setEditingTask(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const fetchBoards = async () => {
        const { data, error } = await supabase.from('boards').select('*');
        if (!error && data) {
            setBoards(data.sort((a, b) => a.name.localeCompare(b.name)));
            
            // Auto-select first board only if none selected
            if (!activeBoardId && data.length > 0) {
                setActiveBoardId(data[0].id);
            }
        }
    };

    const fetchBoardColumns = async () => {
        const { data, error } = await supabase.from('board_columns').select('*').order('order_index', { ascending: true });
        if (!error && data) setBoardColumns(data);
    };

    const fetchTasks = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            // Automatically update overdue tasks in the database before fetching
            if (!silent) {
                await supabase.rpc('update_overdue_tasks');
            }

            // OPTIMIZATION: Select only necessary fields for Kanban/List views (including unit and sector)
            const { data, error } = await supabase
                .from('tasks')
                .select('id, title, status, priority, company_id, due_date, assignee, board_id, column_id, order_index, unit, sector, created_by')
                .order('order_index', { ascending: true });
            
            if (error) {
                console.error("Fetch tasks error:", error);
                if (!silent) alert("ERRO CRITICAL DE DADOS: " + error.message);
            } else if (data) {
                const updatedData = data.map((t: any) => {
                    if (!Array.isArray(t.assignee)) {
                        t.assignee = typeof t.assignee === 'string' ? [t.assignee] : [];
                    }
                    return t;
                });
                setTasks(updatedData);
            }
        } catch (err) {
            console.error("Critical error in fetchTasks:", err);
        } finally {
            if (!silent) setLoading(false);
        }
    };



    const fetchCompanies = async () => {
        // OPTIMIZATION: Query only lightweight text columns. 
        // Passwords and full social media JSONB are loaded on-demand in CompanyManager.
        const { data, error } = await supabase
            .from('companies')
            .select('id, name, logo_url')
            .order('created_at', { ascending: false });
            
        if (!error && data) {
            setCompanies(data.map((c: any) => ({
                id: c.id,
                name: c.name,
                color: c.logo_url || '#4b5563',
                logoBase64: '',
                site: '',
                social: '',
                passwords: []
            })));
        }
    };

    const updateTaskStatus = async (taskId: string, columnId: string, statusName: string) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, column_id: columnId, status: statusName } : t));
        const { error } = await supabase.from('tasks').update({ column_id: columnId, status: statusName }).eq('id', taskId);
        if (error) {
            console.error("Update task status error:", error);
            alert("Erro ao mover tarefa: " + error.message);
            fetchTasks();
        }
    };

    const fetchNotifications = async () => {
        const email = session?.user?.email;
        if (!email) return;
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('recipient_email', email)
            .order('created_at', { ascending: false });
        if (!error && data) setNotifications(data);
    };

    const markNotificationAsRead = async (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        await supabase.from('notifications').update({ read: true }).eq('id', id);
    };

    const deleteNotification = async (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
        const { error } = await supabase.from('notifications').delete().eq('id', id);
        if (error) console.error("Error deleting notification:", error);
    };

    const clearAllNotifications = async () => {
        const email = session?.user?.email;
        if (!email) return;
        setNotifications([]);
        const { error } = await supabase.from('notifications').delete().eq('recipient_email', email);
        if (error) console.error("Error clearing notifications:", error);
    };

    const createNotification = async (notif: Partial<Notification>) => {
        const sender = teamMembers.find(m => m.email === session?.user?.email)?.name || session?.user?.email || 'Sistema';
        console.log("Creating notification for:", notif.recipient_email, "from:", sender);
        const { error } = await supabase.from('notifications').insert([{
            ...notif,
            sender_name: sender,
        }]);
        if (error) {
            console.error("Supabase Notification Insert Error:", error);
        }
    };

    const addTask = async (task: Partial<Task>) => {
        // Lógica de "Novo no Topo": Encontrar o menor order_index da coluna e subtrair 1000
        const colId = task.column_id;
        const colTasks = tasks.filter(t => t.column_id === colId);
        const minOrder = colTasks.length > 0 ? Math.min(...colTasks.map(t => t.order_index || 0)) : 0;
        const newOrder = minOrder - 1000;

        const { data, error } = await supabase.from('tasks').insert([{ ...task, order_index: newOrder }]).select();
        if (error) alert("Erro ao salvar tarefa: " + error.message);
        else if (data) {
            setTasks([data[0], ...tasks]);

            // Notificar destinatários (todos na lista)
            if (task.assignee && task.assignee.length > 0) {
                for (const assigneeName of task.assignee) {
                    const recipient = teamMembers.find(m => m.name === assigneeName);
                    if (recipient?.email && recipient.email !== session?.user?.email) {
                        await createNotification({
                            recipient_email: recipient.email,
                            task_id: data[0].id,
                            task_title: data[0].title,
                            type: 'transfer',
                            message: `Atribuiu uma nova tarefa a você: "${data[0].title}"`
                        });
                    }
                }
            }
        }
    };

    const updateTask = async (taskId: string, task: Partial<Task>) => {
        const oldTask = tasks.find(t => t.id === taskId);
        const { data, error } = await supabase.from('tasks').update(task).eq('id', taskId).select();
        if (error) alert("Erro: " + error.message);
        else if (data) {
            const updatedTask = data[0];
            setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
            
            // Sync editingTask if it's the one being updated
            if (editingTask?.id === taskId) {
                setEditingTask(updatedTask);
            }

            // 1. Notificar novos responsáveis
            if (task.assignee && task.assignee.length > 0) {
                const oldAssignees = (oldTask?.assignee as any) || [];
                const newAssignees = task.assignee.filter(name => !oldAssignees.includes(name));

                for (const name of newAssignees) {
                    const recipient = teamMembers.find(m => m.name === name);
                    if (recipient?.email && recipient.email !== session?.user?.email) {
                        await createNotification({
                            recipient_email: recipient.email,
                            task_id: taskId,
                            task_title: updatedTask.title,
                            type: 'transfer',
                            message: `transferiu uma tarefa para Você: "${updatedTask.title}"`
                        });
                    }
                }
            }

            // 2. Notificar menções @Nome nas observações
            if (task.observations && task.observations !== oldTask?.observations) {
                const oldObs = (oldTask?.observations || '').toLowerCase();
                const newObs = task.observations.toLowerCase();

                // Se foi um "append" (comentário novo), foca apenas no que foi adicionado
                const addedText = newObs.startsWith(oldObs) ? newObs.slice(oldObs.length) : newObs;

                teamMembers.forEach(async member => {
                    const mentionTag = `@${member.name.toLowerCase()}`;
                    if (addedText.includes(mentionTag)) {
                        if (member.email && member.email.toLowerCase() !== session?.user?.email?.toLowerCase()) {
                            // Pega a última linha e limpa o timestamp e o nome do remetente para o resumo
                            const lastComment = task.observations?.split('\n').pop() || '';
                            const summary = lastComment
                                .replace(/^\[.*?\].*?:\s*/, '') // Remove o prefixo de timestamp e nome
                                .replace(new RegExp(`@${member.name}`, 'gi'), '') // Remove a menção @Nome
                                .trim();

                            await createNotification({
                                recipient_email: member.email,
                                task_id: taskId,
                                task_title: updatedTask.title,
                                type: 'mention',
                                message: summary || `Mencionou você na tarefa: "${updatedTask.title}"`
                            });
                        }
                    }
                });
            }

            // 3. Notificar responsáveis de checklist
            if (task.checklist) {
                const oldChecklist = (oldTask?.checklist as any[]) || [];
                const newChecklist = task.checklist as any[];

                for (const newItem of newChecklist) {
                    const oldItem = oldChecklist.find(c => c.id === newItem.id);
                    const oldNames = oldItem?.assignees || [];
                    const newNames = newItem?.assignees || [];
                    
                    // Novos adicionados
                    const addedNames = newNames.filter((n: string) => !oldNames.includes(n));
                    for (const name of addedNames) {
                        const recipient = teamMembers.find(m => m.name === name);
                        if (recipient?.email && recipient.email !== session?.user?.email) {
                            await createNotification({
                                recipient_email: recipient.email,
                                task_id: taskId,
                                task_title: updatedTask.title,
                                type: 'transfer',
                                message: `adicionou você a um checklist na tarefa: "${updatedTask.title}"`
                            });
                        }
                    }

                    // Mudança de data para quem já era responsável
                    if (oldItem && newItem.due_date !== oldItem.due_date) {
                        const existingNames = newNames.filter((n: string) => oldNames.includes(n));
                        for (const name of existingNames) {
                            const recipient = teamMembers.find(m => m.name === name);
                            if (recipient?.email && recipient.email !== session?.user?.email) {
                                await createNotification({
                                    recipient_email: recipient.email,
                                    task_id: taskId,
                                    task_title: updatedTask.title,
                                    type: 'transfer',
                                    message: `alterou o prazo de um checklist que você é responsável: "${updatedTask.title}"`
                                });
                            }
                        }
                    }
                }
            }
        }
    };

    const deleteTask = async (taskId: string) => {
        const { error } = await supabase.from('tasks').delete().eq('id', taskId);
        if (error) alert("Erro: " + error.message);
        else setTasks(tasks.filter(t => t.id !== taskId));
    };

    const addCompany = async (company: Partial<Company>) => {
        const payload = {
            name: company.name,
            logo_url: company.color || '#4b5563',
            social_media: {
                color: company.color,
                logoBase64: company.logoBase64,
                site: company.site,
                social: company.social,
                passwords: company.passwords
            }
        };
        const { error } = await supabase.from('companies').insert([payload]);
        if (error) {
            console.error("Supabase Raw Error:", error);
            alert(`Erro do Banco de Dados Supabase!\nMensagem: ${error.message}\nCódigo: ${error.code}\nDetalhes: ${error.details || 'Nenhum'}`);
        } else {
            fetchCompanies();
        }
    };

    const updateCompany = async (id: string, company: Partial<Company>) => {
        const payload = {
            name: company.name,
            logo_url: company.color || '#4b5563',
            social_media: {
                color: company.color,
                logoBase64: company.logoBase64,
                site: company.site,
                social: company.social,
                passwords: company.passwords
            }
        };
        const { error } = await supabase.from('companies').update(payload).eq('id', id);
        if (error) alert("Erro: " + error.message);
        else fetchCompanies();
    };

    const deleteCompany = async (id: string) => {
        const { error } = await supabase.from('companies').delete().eq('id', id);
        if (error) alert("Erro ao excluir: " + error.message);
        else fetchCompanies();
    };

    const fetchTeam = async () => {
        // OPTIMIZATION: Do not select `avatar_url` because raw base64 avatars exceed HTTP transfer size.
        // It falls back to default UI-avatars in the frontend mapped list.
        const { data, error } = await supabase
            .from('team_members')
            .select('id, name, email, birth_date, units, sectors');
            
        if (!error && data) {
            setTeamMembers(data.map((m: any) => ({
                ...m,
                avatar_url: m.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`
            })));
        }
    };

    const addTeamMember = async (
        name: string, 
        avatar_url: string, 
        email?: string, 
        units: string[] = [], 
        sectors: string[] = [], 
        password?: string, 
        birth_date?: string
    ) => {
        try {
            let userId = null;
            if (email && password) {
                if (supabaseAdmin) {
                    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                        email,
                        password,
                        email_confirm: true
                    });
                    if (authError) throw new Error('Erro Auth: ' + authError.message);
                    userId = authData.user.id;
                } else {
                    console.warn('supabaseAdmin não disponível. Cadastro realizado apenas no banco de dados.');
                }
            }

            const { error: dbError } = await supabase.from('team_members').insert([{
                id: userId || undefined,
                name,
                avatar_url: avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                email,
                units,
                sectors,
                birth_date
            }]);

            if (dbError) throw new Error('Erro Banco: ' + dbError.message);
            
            alert(supabaseAdmin 
                ? 'Sucesso! Membro cadastrado.' 
                : 'Membro cadastrado no banco com sucesso! (Aviso: A chave administrativa do Supabase não está configurada, então a senha de login não pôde ser criada automaticamente. Crie o login do usuário no console do Supabase).'
            );
            fetchTeam();
        } catch (err: any) {
            alert('FALHA NO CADASTRO: ' + err.message);
        }
    };

    const updateTeamMember = async (id: string | number, updates: Partial<TeamMember>) => {
        const { error } = await supabase.from('team_members').update(updates).eq('id', id);
        if (!error) {
            fetchTeam();
        } else {
            console.error(error);
        }
    };

    const deleteTeamMember = async (id: string) => {
        console.log('Iniciando exclusão sincronizada do ID:', id);
        try {
            const { error: dbError } = await supabase.from('team_members').delete().eq('id', id);
            
            if (!dbError) {
                if (supabaseAdmin) {
                    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
                    if (authError) {
                        console.warn('Membro removido da tabela, mas houve erro ao remover do Auth:', authError.message);
                    }
                    alert('Membro e login removidos com sucesso!');
                } else {
                    alert('Membro excluído da tabela de Equipe! (Aviso: A chave de serviço administrativa do Supabase não está configurada, então o login correspondente deve ser excluído manualmente no painel).');
                }
                fetchTeam();
            } else {
                alert('Erro ao excluir da tabela de Equipe: ' + dbError.message);
            }
        } catch (err: any) {
            alert('Erro ao excluir: ' + err.message);
        }
    };

    const addBoard = async (name: string, memberEmails: string[] = []) => {
        const { data, error } = await supabase.from('boards').insert([{ name }]).select();
        if (error) {
            alert(error.message);
        } else if (data) {
            const boardId = data[0].id;
            if (memberEmails.length > 0) {
                const accessInserts = memberEmails.map(email => ({
                    board_id: boardId,
                    user_email: email
                }));
                await supabase.from('board_access').insert(accessInserts);
            }
            fetchBoards();
        }
    };

    const updateBoard = async (id: string, name: string, memberEmails: string[] = []) => {
        const { error: updateError } = await supabase.from('boards').update({ name }).eq('id', id);
        if (updateError) {
            alert(updateError.message);
            return;
        }

        // Atualiza membros: deleta existentes e reinsere novos
        await supabase.from('board_access').delete().eq('board_id', id);
        if (memberEmails.length > 0) {
            const accessInserts = memberEmails.map(email => ({
                board_id: id,
                user_email: email
            }));
            await supabase.from('board_access').insert(accessInserts);
        }
        
        fetchBoards();
    };

    const deleteBoard = async (id: string) => {
        const { error } = await supabase.from('boards').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchBoards();
    };

    const addColumn = async (boardId: string, column: Partial<BoardColumn>) => {
        const { error } = await supabase.from('board_columns').insert([{ ...column, board_id: boardId }]);
        if (error) alert(error.message);
        else fetchBoardColumns();
    };

    const updateColumn = async (columnId: string, updates: Partial<BoardColumn>) => {
        const { error } = await supabase.from('board_columns').update(updates).eq('id', columnId);
        if (error) alert(error.message);
        else fetchBoardColumns();
    };

    const deleteColumn = async (columnId: string) => {
        const { error } = await supabase.from('board_columns').delete().eq('id', columnId);
        if (error) alert(error.message);
        else fetchBoardColumns();
    };

    const updateColumnsOrder = async (orderedCols: { id: string; order_index: number }[]) => {
        // Optimistic update
        const updatedColumns = boardColumns.map(col => {
            const match = orderedCols.find(o => o.id === col.id);
            if (match) return { ...col, order_index: match.order_index };
            return col;
        }).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        
        setBoardColumns(updatedColumns);

        // Update in database in parallel
        const promises = orderedCols.map(item => 
            supabase.from('board_columns').update({ order_index: item.order_index }).eq('id', item.id)
        );
        
        const results = await Promise.all(promises);
        const error = results.find(r => r.error)?.error;
        
        if (error) {
            console.error("Error updating columns order:", error);
            // Re-fetch to sync if failed
            const { data } = await supabase.from('board_columns').select('*').order('order_index', { ascending: true });
            if (data) setBoardColumns(data);
        }
    };
    
    const updateTaskOrder = async (taskId: string, newOrder: number, columnId?: string, statusName?: string) => {
        // Atualização otimista
        setTasks(prev => prev.map(t => 
            t.id === taskId 
                ? { ...t, order_index: newOrder, ...(columnId ? { column_id: columnId } : {}), ...(statusName ? { status: statusName } : {}) } 
                : t
        ).sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));

        const updates: any = { order_index: newOrder };
        if (columnId) updates.column_id = columnId;
        if (statusName) updates.status = statusName;

        const { error } = await supabase.from('tasks').update(updates).eq('id', taskId);
        if (error) {
            console.error("Error updating task order:", error);
            fetchTasks(true);
        }
    };

    const fetchTimeline = async () => {
        const { data, error } = await supabase
            .from('timeline_posts')
            .select(`
                *,
                author:team_members(name, avatar_url),
                likes:timeline_likes(user_id),
                comments:timeline_comments(
                    *,
                    author:team_members(name, avatar_url)
                )
            `)
            .order('created_at', { ascending: false });
        
        if (!error && data) {
            const userId = session?.user?.id;

            const formatted = data.map((p: any) => ({
                ...p,
                author_name: p.author?.name,
                author_avatar: p.author?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.author?.name || 'Membro')}&background=random`,
                likes_count: p.likes?.length || 0,
                user_has_liked: p.likes?.some((l: any) => l.user_id === userId),
                comments: (p.comments || []).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((c: any) => ({
                    ...c,
                    author_name: c.author?.name,
                    author_avatar: c.author?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.author?.name || 'Membro')}&background=random`
                }))
            }));
            setTimelinePosts(formatted);
        }
    };

    const toggleLike = async (postId: string) => {
        const userId = session?.user?.id;
        if (!userId) return;

        const { data: existing } = await supabase
            .from('timeline_likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existing) {
            await supabase.from('timeline_likes').delete().eq('id', existing.id);
        } else {
            await supabase.from('timeline_likes').insert([{ post_id: postId, user_id: userId }]);
        }
        fetchTimeline();
    };

    const addComment = async (postId: string, content: string) => {
        const userEmail = session?.user?.email?.toLowerCase();
        const currentUser = teamMembers.find(m => m.email?.toLowerCase() === userEmail);
        const authorId = currentUser?.id || session?.user?.id;

        if (!authorId || !content.trim()) return;

        const { error } = await supabase.from('timeline_comments').insert([{
            post_id: postId,
            author_id: authorId,
            content
        }]);

        if (error) alert("Erro ao comentar: " + error.message);
        else fetchTimeline();
    };

    const addTimelinePost = async (post: Partial<TimelinePost>) => {
        let authorId = post.author_id;

        if (!authorId) {
            const userEmail = session?.user?.email?.toLowerCase();
            let member = teamMembers.find(m => m.email?.toLowerCase() === userEmail);
            authorId = member?.id as string;
            if (!authorId && userEmail === 'institutohomem@gmail.com') {
                authorId = session?.user?.id;
            }
        }

        if (!authorId) {
            alert("Erro: Você precisa estar cadastrado na equipe para postar.");
            return;
        }

        const { error } = await supabase.from('timeline_posts').insert([{
            ...post,
            author_id: authorId
        }]);

        if (error) {
            alert("Erro ao postar: " + error.message);
        } else {
            fetchTimeline();
        }
    };

    const uploadTimelineImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `timeline/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('task-attachments')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('task-attachments')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const deleteTimelinePost = async (id: string) => {
        const { error } = await supabase.from('timeline_posts').delete().eq('id', id);
        if (error) alert("Erro ao excluir: " + error.message);
        else fetchTimeline();
    };

    const fetchTickets = async () => {
        const { data, error } = await supabase
            .from('tickets')
            .select(`
                *,
                sender:team_members!sender_id(id, name, avatar_url, sectors),
                messages:ticket_messages(
                    *,
                    sender:team_members!sender_id(id, name, avatar_url)
                )
            `)
            .order('created_at', { ascending: false });
        
        if (!error && data) {
            const formatted = data.map((t: any) => ({
                ...t,
                sender_avatar: t.sender?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.sender?.name || 'Remetente')}&background=random`,
                messages: (t.messages || []).map((m: any) => ({
                    ...m,
                    sender_avatar: m.sender?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.sender?.name || 'Membro')}&background=random`
                }))
            }));
            setTickets(formatted);
        }
    };

    const addTicket = async (ticketData: any) => {
        const currentUser = teamMembers.find(m => m.email?.toLowerCase() === session?.user?.email?.toLowerCase());
        if (!currentUser) return;

        const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const protocol = `${dateStr}-${randomStr}`;

        const { error } = await supabase
            .from('tickets')
            .insert([{
                ...ticketData,
                protocol,
                sender_id: currentUser.id,
                status: 'aberto'
            }]);

        if (error) throw error;

        // Criar Notificação para o Setor Destino
        const membersInSector = teamMembers.filter(m => m.sectors?.includes(ticketData.target_sector));
        for (const member of membersInSector) {
            if (member.email) {
                await supabase.from('notifications').insert([{
                    recipient_email: member.email.toLowerCase(),
                    sender_name: currentUser.name,
                    type: 'ticket',
                    message: `abriu um chamado para o seu setor: ${ticketData.subject}`
                }]);
            }
        }

        await fetchTickets();
    };

    const addTicketMessage = async (ticketId: string, content: string) => {
        const currentUser = teamMembers.find(m => m.email?.toLowerCase() === session?.user?.email?.toLowerCase());
        if (!currentUser) return;

        const { error } = await supabase
            .from('ticket_messages')
            .insert([{
                ticket_id: ticketId,
                sender_id: currentUser.id,
                content
            }]);

        if (error) throw error;

        // Notificar o outro lado
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket) {
            const isSender = ticket.sender_id === currentUser.id;
            if (isSender) {
                const membersInSector = teamMembers.filter(m => m.sectors?.includes(ticket.target_sector) && m.id !== currentUser.id);
                for (const member of membersInSector) {
                    if (member.email) {
                        await supabase.from('notifications').insert([{
                            recipient_email: member.email.toLowerCase(),
                            sender_name: currentUser.name,
                            type: 'ticket',
                            message: `respondeu no chamado: ${ticket.subject}`
                        }]);
                    }
                }
            } else {
                const ticketSender = teamMembers.find(m => m.id === ticket.sender_id);
                if (ticketSender?.email) {
                    await supabase.from('notifications').insert([{
                        recipient_email: ticketSender.email.toLowerCase(),
                        sender_name: currentUser.name,
                        type: 'ticket',
                        message: `respondeu no seu chamado: ${ticket.subject}`
                    }]);
                }
            }
        }

        await fetchTickets();
    };

    const updateTicketStatus = async (id: string, status: 'aberto' | 'finalizado') => {
        const { error } = await supabase
            .from('tickets')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
        await fetchTickets();
    };

    useEffect(() => {
        setFilters(prev => ({ ...prev, status: 'Todos' }));
    }, [activeBoardId]);

    useEffect(() => {
        if (!session) return;

        fetchBoards();
        fetchBoardColumns();
        fetchTasks();
        fetchCompanies();
        fetchTeam();
        fetchNotifications();
        fetchTimeline();
        fetchTickets();

        // Subscrição Realtime para atualizações automáticas
        const taskSubscription = supabase
            .channel('db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchTasks(true))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'board_columns' }, () => fetchBoardColumns())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'boards' }, () => fetchBoards())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => fetchTeam())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, () => fetchCompanies())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'timeline_posts' }, () => fetchTimeline())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => fetchTickets())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'ticket_messages' }, () => fetchTickets())
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `recipient_email=eq.${session.user.email}`
            }, () => fetchNotifications())
            .subscribe();

        return () => {
            supabase.removeChannel(taskSubscription);
        };
    }, [session]);

    const hasCheckedBirthdays = useRef(false);

    useEffect(() => {
        if (!session || teamMembers.length === 0 || hasCheckedBirthdays.current) return;

        const checkBirthdays = async () => {
            hasCheckedBirthdays.current = true;
            const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            
            const birthdayMembers = teamMembers.filter(m => 
                m.birth_date && 
                m.birth_date.startsWith(today) &&
                m.sectors && m.sectors.length > 0 &&
                m.name.toLowerCase() !== 'galudo'
            );
            
            const galudo = teamMembers.find(m => m.name.toLowerCase().includes('galudo'));
            const galudoId = galudo?.id;

            for (const m of birthdayMembers) {
                const todayISO = new Date().toISOString().split('T')[0];
                
                const { data: existing } = await supabase
                    .from('timeline_posts')
                    .select('id')
                    .eq('is_automated', true)
                    .ilike('content', `%${m.name}%`)
                    .gte('created_at', `${todayISO}T00:00:00Z`);

                if ((!existing || existing.length === 0) && galudoId) {
                    const msg = `A Housih parabeniza ${m.name} por mais um ano de vida. Agradecemos por sua dedicação e contribuição à nossa equipe. Desejamos sucesso em seu novo ciclo profissional e pessoal.`;
                    await addTimelinePost({
                        content: msg,
                        category: 'Comemoração',
                        visibility: ['todos'],
                        is_automated: true,
                        author_id: galudoId as string
                    });
                }
            }
        };

        checkBirthdays();
    }, [teamMembers, session]);

    useEffect(() => {
        if (!session || teamMembers.length === 0 || timelinePosts.length === 0) return;
        
        const cleanupGhostBirthdays = async () => {
            const automatedPosts = timelinePosts.filter(p => p.is_automated);
            let shouldRefresh = false;
            
            for (const post of automatedPosts) {
                const belongsToActiveMember = teamMembers.some(m => 
                    m.name && post.content.includes(m.name)
                );
                
                if (!belongsToActiveMember) {
                    await supabase.from('timeline_posts').delete().eq('id', post.id);
                    shouldRefresh = true;
                }
            }
            
            if (shouldRefresh) {
                fetchTimeline();
            }
        };
        
        cleanupGhostBirthdays();
    }, [timelinePosts, teamMembers, session]);

    const createSharedReport = async (title: string, data: any, filters: any) => {
        try {
            const { data: report, error } = await supabase
                .from('shared_reports')
                .insert({
                    title,
                    report_data: data,
                    filters,
                    companies_data: companies,
                    team_data: teamMembers,
                    created_by: session?.user?.id
                })
                .select()
                .single();

            if (error) throw error;
            return report.id;
        } catch (error) {
            console.error('Error creating shared report:', error);
            return null;
        }
    };

    return (
        <TasksContext.Provider value={{
            tasks, filteredTasks, filters, setFilters, companies, teamMembers, fetchTasks, updateTaskStatus, addTask, updateTask, deleteTask, loading,
            isModalOpen, editingTask, openModal, closeModal, addCompany, updateCompany, deleteCompany, addTeamMember, updateTeamMember, deleteTeamMember,
            notifications, fetchNotifications, markNotificationAsRead, deleteNotification, clearAllNotifications, session,
            createSharedReport,
            boards, boardColumns, activeBoardId, setActiveBoardId,
            addBoard, updateBoard, deleteBoard, addColumn, updateColumn, deleteColumn, updateColumnsOrder,
            updateTaskOrder,
            UNIDADES, SETORES, activeUnit, setActiveUnit,
            timelinePosts, addTimelinePost, deleteTimelinePost, uploadTimelineImage, toggleLike, addComment,
            CORPORATIVO_SECTORS, UNIDADES_SECTORS,
            tickets, fetchTickets, addTicket, addTicketMessage, updateTicketStatus,
            createNotification
        }}>
            {children}
        </TasksContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TasksContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
};
