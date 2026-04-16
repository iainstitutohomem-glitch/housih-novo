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
    const { filteredTasks, updateTaskStatus, loading, companies, openModal, teamMembers } = useTasks();

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId !== destination.droppableId) {
            updateTaskStatus(draggableId, destination.droppableId);
        }
    };

    if (loading) {
        return <div className="p-8 w-full flex justify-center text-gray-500">Carregando tarefas do Supabase...</div>;
    }

    return (
        <div className="flex flex-col h-full w-full p-6 bg-transparent">
            {/* Inject Global Filters */}
            <TaskFilterBar />

            <div className="flex flex-1 gap-6 overflow-x-auto pb-4">
                <DragDropContext onDragEnd={onDragEnd}>
                    {columns.map((col) => (
                        <Droppable key={col.id} droppableId={col.id}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex flex-col min-w-[280px] lg:min-w-[320px] max-w-[320px] shrink-0 bg-slate-100/50 border border-white/50 rounded-2xl p-4 shadow-sm h-full"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.dot }}></div>
                                            {col.title}
                                        </h3>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${col.color}`}>
                                            {filteredTasks.filter((t) => t.status === col.id).length}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-3 min-h-[150px]">
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
                                                            className={`bg-white p-4 rounded-xl shadow-sm border-gray-100 border-l-4 transition-shadow ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary-500/50' : 'hover:shadow-md cursor-pointer active:cursor-grabbing'}`}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                borderLeftColor: companies.find(c => c.id === task.company_id || c.name === task.title)?.color || '#e5e7eb'
                                                            }}
                                                        >
                                                            <h4 className="font-medium text-gray-800 mb-2">{task.title}</h4>
                                                            <div className="flex justify-between items-center text-xs mt-3">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold border border-primary-200 overflow-hidden">
                                                                        {(() => {
                                                                            const member = teamMembers.find(m => m.name === task.assignee);
                                                                            if (member?.avatar_url) {
                                                                                return <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />;
                                                                            }
                                                                            return task.assignee ? task.assignee.charAt(0).toUpperCase() : '?';
                                                                        })()}
                                                                    </div>
                                                                    <span className="text-gray-600 font-medium truncate max-w-[80px]">{task.assignee || 'Sem resp.'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-1 rounded-md font-medium ${task.priority === 'Alta' ? 'bg-red-50 text-red-600' :
                                                                        task.priority === 'Média' ? 'bg-orange-50 text-orange-600' :
                                                                            'bg-green-50 text-green-600'
                                                                        }`}>
                                                                        {task.priority}
                                                                    </span>
                                                                    {task.due_date && (
                                                                        <span className="text-gray-500 font-medium px-2 py-1 bg-gray-50 rounded-md border border-gray-100 flex items-center gap-1">
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
