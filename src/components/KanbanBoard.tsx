import React, { useState, useRef, useMemo, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Calendar } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import { HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TaskFilterBar } from './TaskFilterBar';

const SECTOR_DESCRIPTIONS: Record<string, string> = {
    'Arquitetura e Obras': 'Projetos arquitetônicos, reformas, manutenção física e obras das unidades.',
    'Atendimento Comercial': 'Suporte ao cliente, dúvidas, acompanhamento de contratos e vendas.',
    'Cobrança': 'Tratativas de atrasos, renegociações, emissão de 2ª via e inadimplência.',
    'Comercial': 'Novos negócios, propostas comerciais, parcerias e metas de vendas.',
    'Comunicação & Marketing': 'Redes sociais, campanhas, materiais gráficos, eventos e comunicados.',
    'Financeiro': 'Pagamentos, recebimentos, notas fiscais, reembolsos e fluxo de caixa.',
    'Jurídico': 'Análise de contratos, processos judiciais, dúvidas legais e notificações.',
    'Operações & Projetos Internos': 'Processos internos, melhoria contínua, auditorias e implantações.',
    'RH': 'Folha de pagamento, benefícios, férias, recrutamento, admissões e clima.'
};

export const KanbanBoard = () => {
    const [hoveredSector, setHoveredSector] = useState<{name: string, rect: DOMRect} | null>(null);
    const { 
        filteredTasks, loading, companies, 
        openModal, teamMembers, updateTask,
        boards, boardColumns, activeBoardId, setActiveBoardId,
        activeParentBoardId, setActiveParentBoardId,
        updateTaskOrder, activeUnit, setActiveUnit, UNIDADES
    } = useTasks();

    const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
    const { session } = useAuth();

    const [transferringTaskId, setTransferringTaskId] = useState<string | null>(null);
    const leaveTimeoutRef = useRef<any>(null);
    const unitScrollRef = useRef<HTMLDivElement>(null);
    const parentBoardScrollRef = useRef<HTMLDivElement>(null);

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (ref.current) {
            ref.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
        }
    };

    // Separate boards into parent boards (no parent_board_id) and sub-boards (with parent_board_id)
    const currentUser = useMemo(() => teamMembers.find(m => m.email?.toLowerCase() === session?.user?.email?.toLowerCase()), [teamMembers, session]);
    
    const parentBoards = useMemo(() => {
        let pBoards = boards.filter(b => !b.parent_board_id);
        const userUnits = currentUser?.units || [];
        const isUserCorporativo = userUnits.includes('Corporativo');
        
        const unitBoards = ['Recepção', 'Administrativo', 'Enfermagem', 'Comercial', 'Médico'];
        const corporativoBoards = ['Arquitetura e Obras', 'Atendimento Comercial', 'Cobrança', 'Comercial', 'Comunicação & Marketing', 'Financeiro', 'Jurídico', 'Operações & Projetos Internos', 'RH', 'TI', 'Controladoria'];

        if (!isUserCorporativo && currentUser) {
            // Usuário de unidade vê apenas quadros da unidade
            pBoards = pBoards.filter(b => unitBoards.includes(b.name));
        } else if (isUserCorporativo) {
            if (activeUnit && activeUnit !== 'Corporativo') {
                // Corporativo filtrando uma unidade específica
                pBoards = pBoards.filter(b => unitBoards.includes(b.name));
            } else {
                // Corporativo vendo 'Corporativo'
                pBoards = pBoards.filter(b => corporativoBoards.includes(b.name));
            }
        }
        return pBoards;
    }, [boards, currentUser, activeUnit]);
    const subBoardsOf = (parentId: string) => boards.filter(b => b.parent_board_id === parentId);

    const userUnits = useMemo(() => {
        const isMaster = 
            currentUser?.sectors?.includes('Master') || 
            currentUser?.sectors?.includes('Diretoria') || 
            session?.user?.email?.toLowerCase() === 'institutohomem@gmail.com';
            
        const isCorporativo = currentUser?.units?.includes('Corporativo');

        if (isMaster || isCorporativo || !currentUser) {
            return UNIDADES;
        }

        const myUnits = currentUser.units || [];
        return UNIDADES.filter(u => myUnits.includes(u));
    }, [UNIDADES, currentUser, session]);

    // Determine the active sub-boards for the selected parent
    const activeSubBoards = useMemo(() => {
        if (!activeParentBoardId || activeParentBoardId === 'Todas') return [];
        return subBoardsOf(activeParentBoardId);
    }, [boards, activeParentBoardId]);

    const hasSubBoards = activeSubBoards.length > 0;

    // Determine current board (the one whose columns/tasks we show)
    const currentBoard = useMemo(() => {
        // If we selected a sub-board directly
        if (activeBoardId && activeBoardId !== 'Todas') {
            return boards.find(b => b.id === activeBoardId);
        }
        return null;
    }, [boards, activeBoardId]);

    const hasOpenedTaskFromUrl = useRef(false);

    useEffect(() => {
        if (!hasOpenedTaskFromUrl.current && filteredTasks.length > 0) {
            const searchParams = new URLSearchParams(window.location.search);
            const taskId = searchParams.get('task');
            if (taskId) {
                const taskToOpen = filteredTasks.find(t => t.id === taskId);
                if (taskToOpen) {
                    openModal(taskToOpen);
                    hasOpenedTaskFromUrl.current = true;
                    window.history.replaceState(null, '', '/kanban');
                }
            }
        }
    }, [filteredTasks, openModal]);

    // On mount: auto-select first parent board based on user sector
    useEffect(() => {
        // Wait until teamMembers are loaded so we can find the currentUser
        if (parentBoards.length > 0 && teamMembers.length > 0 && activeParentBoardId === 'Todas') {
            let defaultParent = parentBoards.find(b => b.is_default) || parentBoards[0];
            
            if (currentUser && currentUser.sectors && currentUser.sectors.length > 0) {
                // Try to find a parent board that matches any of the user's sectors
                const sectorBoard = parentBoards.find(b => currentUser.sectors!.includes(b.name));
                if (sectorBoard) {
                    defaultParent = sectorBoard;
                }
            }
            
            handleSelectParent(defaultParent.id);
        }
    }, [parentBoards, teamMembers, session, activeParentBoardId, currentUser]);

    const handleSelectParent = (parentId: string) => {
        setActiveParentBoardId(parentId);
        // Check if this parent has sub-boards
        const subs = boards.filter(b => b.parent_board_id === parentId);
        if (subs.length > 0) {
            setActiveBoardId(subs[0].id);
        } else {
            setActiveBoardId(parentId);
        }
    };

    const handleSelectSubBoard = (subId: string) => {
        setActiveBoardId(subId);
    };

    // When boards load and active parent changes, auto-select first sub-board
    useEffect(() => {
        if (activeParentBoardId && activeParentBoardId !== 'Todas') {
            const subs = boards.filter(b => b.parent_board_id === activeParentBoardId);
            if (subs.length > 0) {
                // Only auto-select if current activeBoardId is not already a sub of this parent
                const currentIsSubOfParent = subs.some(s => s.id === activeBoardId);
                if (!currentIsSubOfParent) {
                    setActiveBoardId(subs[0].id);
                }
            } else {
                // No sub-boards: parent IS the active board
                if (activeBoardId !== activeParentBoardId) {
                    setActiveBoardId(activeParentBoardId);
                }
            }
        }
    }, [boards, activeParentBoardId]);

    const currentColumns = useMemo(() => {
        if (!currentBoard) return [];
        return boardColumns.filter(col => col.board_id === currentBoard.id);
    }, [boardColumns, currentBoard]);

    const handleMouseEnter = (taskId: string) => {
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        setTransferringTaskId(taskId);
    };

    const handleMouseLeave = () => {
        leaveTimeoutRef.current = setTimeout(() => setTransferringTaskId(null), 300);
    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;
        const destColId = destination.droppableId;
        const destColumn = currentColumns.find(c => c.id === destColId);
        if (!destColumn) return;

        const tasksInDest = filteredTasks
            .filter(t => t.column_id === destColId || (t.board_id === destColumn.board_id && t.status === destColumn.title))
            .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

        let newOrder: number;
        if (tasksInDest.length === 0) {
            newOrder = 0;
        } else if (destination.index === 0) {
            newOrder = (tasksInDest[0].order_index || 0) - 1000;
        } else if (destination.index >= tasksInDest.length) {
            newOrder = (tasksInDest[tasksInDest.length - 1].order_index || 0) + 1000;
        } else {
            const prevTask = tasksInDest[destination.index - 1];
            const nextTask = tasksInDest[destination.index];
            newOrder = ((prevTask.order_index || 0) + (nextTask.order_index || 0)) / 2;
        }

        if (source.droppableId !== destination.droppableId) {
            await updateTaskOrder(draggableId, newOrder, destColumn.id, destColumn.title);
        } else {
            if (source.index !== destination.index) {
                await updateTaskOrder(draggableId, newOrder);
            }
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
        const diffDays = Math.round((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'bg-red-50 text-red-600 border-red-200';
        if (diffDays === 1) return 'bg-amber-50 text-amber-600 border-amber-200';
        if (diffDays < 0) return 'bg-red-100 text-red-800 border-red-300 font-bold';
        return 'bg-gray-50 text-gray-500 border-gray-100';
    };

    if (loading) {
        return <div className="p-8 w-full flex justify-center text-gray-500">Carregando tarefas do Supabase...</div>;
    }

    return (
        <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
            <div className="px-6 pt-4 flex-shrink-0">
                <div className="flex justify-end mb-2">
                    <button
                        onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-600 transition-colors bg-white/50 px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm"
                    >
                        {isFiltersExpanded ? (
                            <>
                                <span>Ocultar Filtros</span>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            </>
                        ) : (
                            <>
                                <span>Mostrar Filtros</span>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </>
                        )}
                    </button>
                </div>

                <div className={`flex flex-col gap-3 transition-all duration-300 ease-in-out ${isFiltersExpanded ? 'max-h-[500px] opacity-100 mb-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>

                    {/* Filtro de Unidades */}
                    <div className="flex items-center gap-3 bg-white/50 p-2 rounded-2xl border border-white/50 shadow-sm relative group">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap pl-2 border-r border-gray-200 pr-3">Unidade</span>
                        <button 
                            onClick={() => scroll(unitScrollRef, 'left')}
                            className="absolute left-[85px] z-10 bg-white/80 hover:bg-white p-1 rounded-full shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div ref={unitScrollRef} className="flex gap-2 overflow-x-auto no-scrollbar py-1 flex-1 relative">
                            {userUnits.map(unit => (
                                <button
                                    key={unit}
                                    onClick={() => setActiveUnit(unit)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                                        activeUnit === unit
                                        ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200'
                                        : 'bg-white text-gray-500 border-gray-100 hover:border-primary-200 hover:text-primary-600'
                                    }`}
                                >
                                    {unit}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => scroll(unitScrollRef, 'right')}
                            className="absolute right-2 z-10 bg-white/80 hover:bg-white p-1 rounded-full shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    {/* Filtro de Quadros Principais (Setores) */}
                    <div className="relative group">
                        <button 
                            onClick={() => scroll(parentBoardScrollRef, 'left')}
                            className="absolute left-[-10px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div ref={parentBoardScrollRef} className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                            {parentBoards.map(b => (
                                <button
                                    key={b.id}
                                    onMouseEnter={(e) => setHoveredSector({ name: b.name, rect: e.currentTarget.getBoundingClientRect() })}
                                    onMouseLeave={() => setHoveredSector(null)}
                                    onClick={() => handleSelectParent(b.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm whitespace-nowrap ${
                                        activeParentBoardId === b.id
                                        ? 'bg-gray-800 text-white'
                                        : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                                    }`}
                                >
                                    {b.name}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => scroll(parentBoardScrollRef, 'right')}
                            className="absolute right-[-10px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    {/* Subquadros — segunda linha, aparece só se o setor tiver filhos */}
                    {hasSubBoards && (
                        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 pl-4 border-l-4 border-primary-200 animate-in slide-in-from-top-1 duration-200">
                            {activeSubBoards.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => handleSelectSubBoard(sub.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border ${
                                        activeBoardId === sub.id
                                        ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                                    }`}
                                >
                                    {sub.name}
                                </button>
                            ))}
                        </div>
                    )}
                    <TaskFilterBar />
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-x-auto px-6 pb-6 h-full mt-2 pretty-scrollbar">
                <DragDropContext onDragEnd={onDragEnd}>
                    {currentColumns.map((col) => {
                        const tasksInCol = filteredTasks
                            .filter((t) => t.column_id === col.id)
                            .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

                        return (
                            <Droppable key={col.id} droppableId={col.id}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex flex-col min-w-[280px] lg:min-w-[320px] max-w-[320px] shrink-0 bg-slate-100/50 border border-white/50 rounded-2xl p-4 shadow-sm h-full max-h-full overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.dot_color || '#ccc' }}></div>
                                                {col.title}
                                            </h3>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${col.color || 'bg-gray-100 text-gray-600'}`}>
                                                {tasksInCol.length}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-3 flex-1 overflow-y-auto pretty-scrollbar pr-1">
                                            {tasksInCol.map((task, index) => (
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
                                                            <h4 className="font-medium text-gray-800 mb-1">{task.title}</h4>
                                                            {task.created_by && (
                                                                <p className="text-[10px] text-gray-400 mb-2 font-medium">
                                                                    Solicitado por: <span className="text-gray-500">{teamMembers.find(m => m.email === task.created_by)?.name || task.created_by.split('@')[0]}</span>
                                                                </p>
                                                            )}
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
                                                                            <div className="w-6 h-6 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center border border-dashed border-gray-200">?</div>
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
                        );
                    })}
                </DragDropContext>
            </div>
            
            {/* Global Tooltip for Sectors */}
            {hoveredSector && (
                <div 
                    className="fixed z-[9999] w-64 bg-gray-800 text-white text-[11px] font-medium leading-relaxed p-2.5 rounded-xl shadow-xl pointer-events-none animate-in fade-in zoom-in-95 duration-150"
                    style={{
                        top: hoveredSector.rect.bottom + 8,
                        left: hoveredSector.rect.left + (hoveredSector.rect.width / 2),
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div className="flex items-start gap-2">
                        <HelpCircle size={14} className="text-primary-400 mt-0.5 flex-shrink-0" />
                        <span>
                            {SECTOR_DESCRIPTIONS[hoveredSector.name] || 'Clique para visualizar os quadros e tarefas deste setor.'}
                        </span>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-gray-800"></div>
                </div>
            )}
        </div>
    );
};
