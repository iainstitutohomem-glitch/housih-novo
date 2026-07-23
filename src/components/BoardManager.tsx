import { useState, useRef, useEffect } from 'react';
import { useTasks } from '../context/TasksContext';
import type { BoardColumn } from '../context/TasksContext';
import { Plus, Trash2, GripVertical, Save, X, Settings2, Pencil, ChevronRight } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export const BoardManager = () => {
    const { 
        boards, boardColumns, addBoard, updateBoard, deleteBoard, 
        addColumn, updateColumn, deleteColumn, updateColumnsOrder 
    } = useTasks();
    const [selectedBoardId, setSelectedBoardId] = useState<string | null>(boards[0]?.id || null);
    const [newBoardName, setNewBoardName] = useState('');
    const [isAddingBoard, setIsAddingBoard] = useState(false);
    const [addingSubForParent, setAddingSubForParent] = useState<string | null>(null);
    const [newSubBoardName, setNewSubBoardName] = useState('');

    // Board name editing state
    const [isEditingBoardName, setIsEditingBoardName] = useState(false);
    const [editBoardNameValue, setEditBoardNameValue] = useState('');

    // Separate into parent boards and sub-boards
    const parentBoards = boards.filter(b => !b.parent_board_id);
    const subBoardsOf = (parentId: string) => boards.filter(b => b.parent_board_id === parentId);

    const selectedBoard = boards.find(b => b.id === selectedBoardId);
    const columns = boardColumns.filter(c => c.board_id === selectedBoardId);

    useEffect(() => {
        if (!selectedBoardId && boards.length > 0) {
            setSelectedBoardId(boards[0].id);
        }
    }, [boards, selectedBoardId]);

    const handleAddBoard = async () => {
        if (!newBoardName.trim()) return;
        await addBoard(newBoardName);
        setNewBoardName('');
        setIsAddingBoard(false);
    };

    const handleAddSubBoard = async (parentId: string) => {
        if (!newSubBoardName.trim()) return;
        await addBoard(newSubBoardName.trim(), [], parentId);
        setNewSubBoardName('');
        setAddingSubForParent(null);
    };

    const handleAddColumn = async () => {
        if (!selectedBoardId) return;
        await addColumn(selectedBoardId, {
            title: 'Nova Coluna',
            order_index: columns.length,
            color: 'bg-gray-100 text-gray-600',
            dot_color: '#9ca3af'
        });
    };

    const handleSelectBoard = (boardId: string) => {
        setSelectedBoardId(boardId);
        setIsEditingBoardName(false);
    };

    const handleStartEditingBoardName = () => {
        if (selectedBoard) {
            setEditBoardNameValue(selectedBoard.name);
            setIsEditingBoardName(true);
        }
    };

    const handleSaveBoardName = async () => {
        if (!selectedBoardId || !editBoardNameValue.trim()) {
            setIsEditingBoardName(false);
            return;
        }
        await updateBoard(selectedBoardId, editBoardNameValue.trim());
        setIsEditingBoardName(false);
    };

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return;
        const { source, destination } = result;
        if (source.index === destination.index) return;

        const sortedCols = [...columns].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        const [removed] = sortedCols.splice(source.index, 1);
        sortedCols.splice(destination.index, 0, removed);

        const updates = sortedCols.map((col, index) => ({
            id: col.id,
            order_index: index
        }));

        await updateColumnsOrder(updates);
    };

    return (
        <div className="flex-1 w-full max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Settings2 className="text-primary-500" />
                        Configurações de Quadros
                    </h1>
                    <p className="text-gray-500 text-sm">Crie e personalize seus fluxos de trabalho (Kanban)</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Board List — hierarchical view */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm p-4 h-fit">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Quadros</h2>
                            <button 
                                onClick={() => setIsAddingBoard(true)}
                                className="p-1.5 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        {isAddingBoard && (
                            <div className="mb-4 flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={newBoardName}
                                    onChange={(e) => setNewBoardName(e.target.value)}
                                    placeholder="Nome do quadro principal..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddBoard()}
                                />
                                <button onClick={handleAddBoard} className="text-primary-600 p-1.5"><Save size={18} /></button>
                                <button onClick={() => setIsAddingBoard(false)} className="text-gray-400 p-1.5"><X size={18} /></button>
                            </div>
                        )}

                        <div className="space-y-1">
                            {parentBoards.map(board => {
                                const subs = subBoardsOf(board.id);
                                const isParentSelected = selectedBoardId === board.id;
                                const isAnySubSelected = subs.some(s => s.id === selectedBoardId);

                                return (
                                    <div key={board.id}>
                                        {/* Parent Board Row */}
                                        <div className="group flex items-center gap-1">
                                            <button
                                                onClick={() => handleSelectBoard(board.id)}
                                                className={`flex-1 text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                                                    isParentSelected 
                                                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                                }`}
                                            >
                                                {subs.length > 0 && (
                                                    <ChevronRight size={14} className={`shrink-0 text-gray-400 transition-transform ${(isParentSelected || isAnySubSelected) ? 'rotate-90' : ''}`} />
                                                )}
                                                <span className="truncate">{board.name}</span>
                                                {board.is_default && <span className="ml-auto text-[8px] bg-gray-100 px-1 py-0.5 rounded text-gray-400">PADRÃO</span>}
                                            </button>
                                            {/* Add sub-board button */}
                                            <button
                                                onClick={() => { setAddingSubForParent(board.id); setNewSubBoardName(''); }}
                                                title="Adicionar subquadro"
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-primary-500 transition-all rounded-lg hover:bg-primary-50"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            {!board.is_default && (
                                                <button 
                                                    onClick={() => window.confirm('Excluir este quadro e TODOS os seus subquadros e tarefas?') && deleteBoard(board.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Add sub-board input */}
                                        {addingSubForParent === board.id && (
                                            <div className="ml-6 mt-1 mb-2 flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={newSubBoardName}
                                                    onChange={e => setNewSubBoardName(e.target.value)}
                                                    placeholder="Nome do subquadro..."
                                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                    onKeyDown={e => { if (e.key === 'Enter') handleAddSubBoard(board.id); if (e.key === 'Escape') setAddingSubForParent(null); }}
                                                />
                                                <button onClick={() => handleAddSubBoard(board.id)} className="text-primary-600 p-1.5"><Save size={16} /></button>
                                                <button onClick={() => setAddingSubForParent(null)} className="text-gray-400 p-1.5"><X size={16} /></button>
                                            </div>
                                        )}

                                        {/* Sub-boards */}
                                        {subs.length > 0 && (
                                            <div className="ml-6 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                                                {subs.map(sub => (
                                                    <div key={sub.id} className="group/sub flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleSelectBoard(sub.id)}
                                                            className={`flex-1 text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                                                selectedBoardId === sub.id
                                                                ? 'bg-primary-50 text-primary-700'
                                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                                            }`}
                                                        >
                                                            {sub.name}
                                                        </button>
                                                        <button 
                                                            onClick={() => window.confirm(`Excluir subquadro "${sub.name}" e todas as suas tarefas?`) && deleteBoard(sub.id)}
                                                            className="opacity-0 group-hover/sub:opacity-100 p-1.5 text-gray-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Column Editor */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedBoard ? (
                        <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex-1 mr-4">
                                    {isEditingBoardName ? (
                                        <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                                            <input 
                                                autoFocus
                                                type="text" 
                                                value={editBoardNameValue}
                                                onChange={(e) => setEditBoardNameValue(e.target.value)}
                                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-base font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 max-w-xs sm:max-w-md w-full"
                                                onKeyDown={(e) => e.key === 'Enter' && handleSaveBoardName()}
                                            />
                                            <button onClick={handleSaveBoardName} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Salvar nome">
                                                <Save size={16} />
                                            </button>
                                            <button onClick={() => setIsEditingBoardName(false)} className="p-1.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-colors" title="Cancelar">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {selectedBoard.parent_board_id && (
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {boards.find(b => b.id === selectedBoard.parent_board_id)?.name} /
                                                </span>
                                            )}
                                            <h3 className="text-lg font-bold text-gray-800">{selectedBoard.name}</h3>
                                            <button 
                                                onClick={handleStartEditingBoardName}
                                                className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-all"
                                                title="Editar nome do quadro"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">Personalize as colunas e cores deste fluxo</p>
                                </div>
                                <button 
                                    onClick={handleAddColumn}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-200 hover:scale-105 transition-transform"
                                >
                                    <Plus size={18} /> Add Coluna
                                </button>
                            </div>

                            <div className="space-y-3">
                                {columns.length === 0 && (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-gray-400 text-sm">Nenhuma coluna definida.</p>
                                    </div>
                                )}
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="columns" type="column">
                                        {(provided) => (
                                            <div 
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="space-y-3"
                                            >
                                                {columns.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((col, index) => (
                                                    <Draggable key={col.id} draggableId={col.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={snapshot.isDragging ? 'shadow-lg rounded-xl overflow-hidden' : ''}
                                                                style={provided.draggableProps.style}
                                                            >
                                                                <ColumnItem 
                                                                    column={col} 
                                                                    onUpdate={(upd) => updateColumn(col.id, upd)}
                                                                    onDelete={() => deleteColumn(col.id)}
                                                                    dragHandleProps={provided.dragHandleProps}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/50 backdrop-blur-md border border-dashed border-gray-300 rounded-2xl p-12 text-center h-full flex flex-col justify-center items-center">
                            <Settings2 size={48} className="text-gray-200 mb-4" />
                            <p className="text-gray-400">Selecione um quadro à esquerda para editar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ColumnItem = ({ 
    column, onUpdate, onDelete, dragHandleProps 
}: { 
    column: BoardColumn, onUpdate: (u: any) => void, onDelete: () => void, dragHandleProps: any 
}) => {
    const [title, setTitle] = useState(column.title);
    const colorInputRef = useRef<HTMLInputElement>(null);

    const handleTitleChange = (newTitle: string) => setTitle(newTitle);
    const handleSave = () => onUpdate({ title });

    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ dot_color: e.target.value });
    };

    const colors = [
        { bg: 'bg-gray-100 text-gray-600', dot: '#9ca3af' },
        { bg: 'bg-amber-100 text-amber-700', dot: '#fbbf24' },
        { bg: 'bg-green-100 text-green-700', dot: '#4ade80' },
        { bg: 'bg-purple-100 text-purple-700', dot: '#c084fc' },
        { bg: 'bg-red-100 text-red-700', dot: '#ef4444' },
        { bg: 'bg-blue-100 text-blue-700', dot: '#3b82f6' },
        { bg: 'bg-rose-100 text-rose-700', dot: '#f43f5e' },
    ];

    return (
        <div className="flex items-center gap-4 bg-white border border-gray-100 p-3 rounded-xl hover:shadow-md transition-all group">
            <div 
                {...dragHandleProps}
                className="cursor-grab text-gray-300 hover:text-gray-500 shrink-0"
            >
                <GripVertical size={20} />
            </div>
            
            <div className="w-4 h-4 rounded-full shrink-0 shadow-inner" style={{ backgroundColor: column.dot_color }}></div>
            
            <div className="flex-1">
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    onBlur={handleSave}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 outline-none"
                />
            </div>

            <div className="flex items-center gap-1.5 pr-2 border-r border-gray-100 mr-1">
                <input 
                    type="color"
                    ref={colorInputRef}
                    onChange={handleCustomColorChange}
                    className="sr-only"
                    value={column.dot_color || '#9ca3af'}
                />
                <button
                    onClick={() => colorInputRef.current?.click()}
                    title="Cor personalizada"
                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                    <Pencil size={16} />
                </button>
            </div>

            <div className="flex items-center gap-1">
                {colors.map((c, i) => (
                    <button 
                        key={i}
                        onClick={() => onUpdate({ color: c.bg, dot_color: c.dot })}
                        className={`w-5 h-5 rounded-md border-2 transition-transform hover:scale-110 ${column.dot_color === c.dot ? 'border-primary-500' : 'border-transparent'}`}
                        style={{ backgroundColor: c.dot }}
                    />
                ))}
            </div>

            <button 
                onClick={() => window.confirm('Remover esta coluna?') && onDelete()}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
};
