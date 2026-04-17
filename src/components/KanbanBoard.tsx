import { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Calendar } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import { TaskFilterBar } from './TaskFilterBar';

const columns = [
    { id: 'Não Iniciado', title: 'Não Iniciado', color: 'bg-gray-100 text-gray-600', dot: '#9ca3af' },
    { id: 'Em Andamento', title: 'Em Andamento', color: 'bg-amber-100 text-amber-700', dot: '#fbbf24' },
    { id: 'Concluído', title: 'Concluído', color: 'bg-green-100 text-green-700', dot: '#4ade80' },
    { id: 'Cancelado', title: 'Cancelado', color: 'bg-purple-100 text-purple-700', dot: '#c084fc' },
    { id: 'Atrasado', title: 'Atrasado', color: 'bg-red-100 text-red-700', dot: '#ef4444' }
];

export const KanbanBoard = () => {
    const { filteredTasks, updateTaskStatus, loading, companies, openModal, teamMembers, updateTask } = useTasks();
    const [transferringTaskId, setTransferringTaskId] = useState<string | null>(null);
    const leaveTimeoutRef = useRef<any>(null);

    const handleMouseEnter = (taskId: string) => {
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        setTransferringTaskId(taskId);
    };

    const handleMouseLeave = () => {
        leaveTimeoutRef.current = setTimeout(() => {
            setTransferringTaskId(null);
        }, 300); // 300ms de tolerância
    };

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId !== destination.droppableId) {
            updateTaskStatus(draggableId, destination.droppableId);
        }
    };

    const getDateColor = (dateStr: string, status: string) => {
        if (status === 'Concluído') return 'bg-green-50 text-green-600 border-green-200';
        if (status === 'Cancelado') return 'bg-gray-50 text-gray-400 border-gray-100 opacity-60';
        if (!dateStr) return 'bg-gray-50 text-gray-500 border-gray-100';
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const parts = dateStr.split('T')[0].split('-');
        const taskDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

        const diffTime = taskDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'bg-red-50 text-red-600 border-red-200'; // Hoje
        if (diffDays === 1) return 'bg-amber-50 text-amber-600 border-amber-200'; // Amanhã
        if (diffDays < 0) return 'bg-red-100 text-red-800 border-red-300 font-bold'; // Atrasado
        return 'bg-gray-50 text-gray-500 border-gray-100'; // Futuro
    };

    if (loading) {
        return <div className="p-8 w-full flex justify-center text-gray-500">Carregando tarefas do Supabase...</div>;
    }

    return (
        <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
            <div className="px-6 pt-6 flex-shrink-0">
                <TaskFilterBar />
            </div>

            <div className="flex-1 flex gap-6 overflow-x-auto px-6 pb-6 h-full mt-4 no-scrollbar">
                <DragDropContext onDragEnd={onDragEnd}>
                    {columns.map((col) => (
                        <Droppable key={col.id} droppableId={col.id}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex flex-col min-w-[280px] lg:min-w-[320px] max-w-[320px] shrink-0 bg-slate-100/50 border border-white/50 rounded-2xl p-4 shadow-sm h-full max-h-full overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.dot }}></div>
                                            {col.title}
                                        </h3>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${col.color}`}>
                                            {filteredTasks.filter((t) => t.status === col.id).length}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar pr-1 min-h-[500px]">
                                        {filteredTasks
                                            .filter((t) => t.status === col.id)
                                            .map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => openModal(task)}
                                                            className={`bg-white p-4 rounded-xl shadow-sm border-gray-100 border-l-4 transition-all ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary-500/50' : 'hover:shadow-md cursor-pointer'}`}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                borderLeftColor: companies.find(c => c.id === task.company_id || c.name === task.title)?.color || '#e5e7eb'
                                                            }}
                                                        >
                                                            <h4 className="font-medium text-gray-800 mb-2">{task.title}</h4>
                                                            <div className="flex justify-between items-center text-xs mt-3">
                                                                <div 
                                                                    className="flex items-center gap-2 relative group-avatar"
                                                                    onMouseEnter={() => handleMouseEnter(task.id)}
                                                                    onMouseLeave={handleMouseLeave}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <div className="flex -space-x-2 overflow-hidden items-center group/av">
                                                                        {task.assignee && task.assignee.length > 0 ? (
                                                                            task.assignee.slice(0, 3).map((name, i) => {
                                                                                const member = teamMembers.find(m => m.name === name);
                                                                                return (
                                                                                    <div key={i} className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold border-2 border-white overflow-hidden relative transition-transform hover:translate-y-[-2px] z-[1]">
                                                                                        {member?.avatar_url ? (
                                                                                            <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                                                                                        ) : (
                                                                                            <span className="text-[10px]">{name.charAt(0).toUpperCase()}</span>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })
                                                                        ) : (
                                                                            <div className="w-6 h-6 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center border border-dashed border-gray-200">
                                                                                ?
                                                                            </div>
                                                                        )}
                                                                        {task.assignee && task.assignee.length > 3 && (
                                                                            <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold border-2 border-white z-[0]">
                                                                                +{task.assignee.length - 3}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-gray-500 font-medium truncate max-w-[80px] text-[10px]">
                                                                        {task.assignee && task.assignee.length > 0 ? task.assignee[0] + (task.assignee.length > 1 ? ` +${task.assignee.length - 1}` : '') : 'Sem resp.'}
                                                                    </span>
                                                                    
                                                                    {/* Transfer Popover */}
                                                                    {transferringTaskId === task.id && (
                                                                        <>
                                                                            {/* Invisible Bridge to bridge the gap */}
                                                                            <div className="absolute left-0 bottom-full w-full h-4 bg-transparent" />
                                                                            <div className="absolute left-0 bottom-full mb-1 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50 w-52 animate-in fade-in slide-in-from-bottom-2">
                                                                                <p className="text-[10px] font-bold text-gray-400 mb-2 px-1 uppercase tracking-wide">Gerenciar Responsáveis</p>
                                                                                <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                                                                                    {teamMembers.map(m => {
                                                                                        const isSelected = task.assignee?.includes(m.name);
                                                                                        return (
                                                                                            <button 
                                                                                                key={m.id}
                                                                                                onClick={async (e) => {
                                                                                                    e.stopPropagation();
                                                                                                    const next = isSelected 
                                                                                                        ? task.assignee.filter(a => a !== m.name)
                                                                                                        : [...(task.assignee || []), m.name];
                                                                                                    await updateTask(task.id, { assignee: next });
                                                                                                }}
                                                                                                className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left transition-colors ${isSelected ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 text-gray-600'}`}
                                                                                            >
                                                                                                <div className={`w-3 h-3 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary-600 border-primary-600' : 'border-gray-300'}`}>
                                                                                                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                                                                                                </div>
                                                                                                <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                                                                                                    {m.avatar_url ? <img src={m.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                                                                                                </div>
                                                                                                <span className="text-[11px] font-medium truncate">{m.name}</span>
                                                                                            </button>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-1 rounded-md font-medium ${task.priority === 'Alta' ? 'bg-red-50 text-red-600' :
                                                                        task.priority === 'Média' ? 'bg-orange-50 text-orange-600' :
                                                                            'bg-green-50 text-green-600'
                                                                        }`}>
                                                                        {task.priority}
                                                                    </span>
                                                                    {task.due_date && (
                                                                        <span className={`font-medium px-2 py-1 rounded-md border flex items-center gap-1 transition-colors ${getDateColor(task.due_date, task.status)}`}>
                                                                            <Calendar size={12} /> {task.due_date.substring(0, 10).split('-').reverse().join('/')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
            </div>
        </div>
    );
};
