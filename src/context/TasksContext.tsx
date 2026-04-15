import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

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
    assignee: string;
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
}

export interface Notification {
    id: string;
    recipient_email: string;
    sender_name: string;
    task_id: string;
    task_title: string;
    type: 'mention' | 'transfer';
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
}

interface TasksContextType {
    tasks: Task[];
    filteredTasks: Task[];
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    companies: Company[];
    teamMembers: TeamMember[];
    fetchTasks: () => Promise<void>;
    updateTaskStatus: (taskId: string, newStatus: string) => Promise<void>;
    addTask: (task: Partial<Task>) => Promise<void>;
    updateTask: (taskId: string, task: Partial<Task>) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    addCompany: (company: Partial<Company>) => Promise<void>;
    updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
    deleteCompany: (id: string) => Promise<void>;
    addTeamMember: (name: string, avatar_url: string, email?: string) => Promise<void>;
    updateTeamMember: (id: string | number, updates: Partial<TeamMember>) => Promise<void>;
    deleteTeamMember: (id: string) => Promise<void>;
    notifications: Notification[];
    fetchNotifications: () => Promise<void>;
    markNotificationAsRead: (id: string) => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    clearAllNotifications: () => Promise<void>;
    loading: boolean;
    isModalOpen: boolean;
    editingTask: Task | null;
    openModal: (task?: Task) => void;
    closeModal: () => void;
    session: any;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState<FilterState>({
        empresa: 'Todas',
        prioridade: 'Todas',
        responsavel: 'Todos',
        status: 'Todos',
        dataInicio: '',
        dataFim: ''
    });

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (filters.empresa !== 'Todas' && task.company_id !== filters.empresa && task.title !== filters.empresa) return false;
            if (filters.prioridade !== 'Todas' && task.priority !== filters.prioridade) return false;
            if (filters.status !== 'Todos' && task.status !== filters.status) return false;
            if (filters.responsavel !== 'Todos' && task.assignee !== filters.responsavel) return false;

            if (filters.dataInicio || filters.dataFim) {
                if (!task.due_date) return false;
                const td = task.due_date.substring(0, 10);
                if (filters.dataInicio && td < filters.dataInicio) return false;
                if (filters.dataFim && td > filters.dataFim) return false;
            }
            return true;
        });
    }, [tasks, filters]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const openModal = (task?: Task) => {
        setEditingTask(task || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const fetchTasks = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error("Fetch tasks error:", error);
            alert("Erro ao buscar tarefas: " + error.message);
        } else if (data) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            const updatedData = data.map((t: any) => {
                if (t.due_date && t.status !== 'Concluído' && t.status !== 'Cancelado') {
                    const dueDate = new Date(t.due_date);
                    dueDate.setHours(0, 0, 0, 0);

                    if (dueDate < now && t.status !== 'Atrasado') {
                        t.status = 'Atrasado';
                        supabase.from('tasks').update({ status: 'Atrasado' }).eq('id', t.id).then();
                    } else if (dueDate >= now && t.status === 'Atrasado') {
                        // Resgata tarefas que foram marcadas como atrasadas erroneamente
                        t.status = 'Não Iniciado';
                        supabase.from('tasks').update({ status: 'Não Iniciado' }).eq('id', t.id).then();
                    }
                }
                return t;
            });
            setTasks(updatedData);
        }
        setLoading(false);
    };

    const fetchCompanies = async () => {
        const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
        if (!error && data) {
            setCompanies(data.map((c: any) => ({
                id: c.id,
                name: c.name,
                color: c.social_media?.color || c.logo_url || '#4b5563',
                logoBase64: c.social_media?.logoBase64 || '',
                site: c.social_media?.site || '',
                social: c.social_media?.social || '',
                passwords: c.social_media?.passwords || []
            })));
        }
    };

    const updateTaskStatus = async (taskId: string, newStatus: string) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
        if (error) {
            console.error("Update task error:", error);
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
        const { data, error } = await supabase.from('tasks').insert([task]).select();
        if (error) alert("Erro ao salvar tarefa: " + error.message);
        else if (data) {
            setTasks([data[0], ...tasks]);

            // Notificar destinatário se houver um responsável definido
            if (task.assignee) {
                const recipient = teamMembers.find(m => m.name === task.assignee);
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
    };

    const updateTask = async (taskId: string, task: Partial<Task>) => {
        const oldTask = tasks.find(t => t.id === taskId);
        const { data, error } = await supabase.from('tasks').update(task).eq('id', taskId).select();
        if (error) alert("Erro: " + error.message);
        else if (data) {
            const updatedTask = data[0];
            setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));

            // 1. Notificar transferência se mudou o responsável
            if (task.assignee && task.assignee !== oldTask?.assignee) {
                const recipient = teamMembers.find(m => m.name === task.assignee);
                if (recipient?.email && recipient.email !== session?.user?.email) {
                    await createNotification({
                        recipient_email: recipient.email,
                        task_id: taskId,
                        task_title: updatedTask.title,
                        type: 'transfer',
                        message: `Transferiu uma tarefa para você: "${updatedTask.title}"`
                    });
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
        const { data, error } = await supabase.from('team_members').select('*');
        if (!error && data) {
            setTeamMembers(data);
        }
    };

    const addTeamMember = async (name: string, avatar_url: string, email?: string) => {
        const { data, error } = await supabase.from('team_members').insert([{
            name,
            avatar_url: avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            email
        }]).select();

        if (error) {
            console.error(error);
        } else if (data) {
            fetchTeam();
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
        const { error } = await supabase.from('team_members').delete().eq('id', id);
        if (error) {
            setTeamMembers(teamMembers.filter(m => m.id !== id));
        } else {
            fetchTeam();
        }
    };

    const { session } = useAuth();

    useEffect(() => {
        if (!session) return;

        fetchTasks();
        fetchCompanies();
        fetchTeam();
        fetchNotifications();

        // Subscrição Realtime para atualizações automáticas
        const taskSubscription = supabase
            .channel('db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchTasks())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => fetchTeam())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, () => fetchCompanies())
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

    return (
        <TasksContext.Provider value={{
            tasks, filteredTasks, filters, setFilters, companies, teamMembers, fetchTasks, updateTaskStatus, addTask, updateTask, deleteTask, loading,
            isModalOpen, editingTask, openModal, closeModal, addCompany, updateCompany, deleteCompany, addTeamMember, updateTeamMember, deleteTeamMember,
            notifications, fetchNotifications, markNotificationAsRead, deleteNotification, clearAllNotifications, session
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
