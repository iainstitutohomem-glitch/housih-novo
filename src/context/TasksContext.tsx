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
    loading: boolean;
    isModalOpen: boolean;
    editingTask: Task | null;
    openModal: (task?: Task) => void;
    closeModal: () => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
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

    const addTask = async (task: Partial<Task>) => {
        const { data, error } = await supabase.from('tasks').insert([task]).select();
        if (error) alert("Erro ao salvar tarefa: " + error.message);
        else if (data) setTasks([data[0], ...tasks]);
    };

    const updateTask = async (taskId: string, task: Partial<Task>) => {
        const { data, error } = await supabase.from('tasks').update(task).eq('id', taskId).select();
        if (error) alert("Erro: " + error.message);
        else if (data) setTasks(tasks.map(t => t.id === taskId ? data[0] : t));
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

        // Subscrição Realtime para atualizações automáticas
        const taskSubscription = supabase
            .channel('db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchTasks())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => fetchTeam())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, () => fetchCompanies())
            .subscribe();

        return () => {
            supabase.removeChannel(taskSubscription);
        };
    }, [session]);

    return (
        <TasksContext.Provider value={{
            tasks, filteredTasks, filters, setFilters, companies, teamMembers, fetchTasks, updateTaskStatus, addTask, updateTask, deleteTask, loading,
            isModalOpen, editingTask, openModal, closeModal, addCompany, updateCompany, deleteCompany, addTeamMember, updateTeamMember, deleteTeamMember
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
