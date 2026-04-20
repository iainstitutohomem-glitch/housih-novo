import { useState } from 'react';
import { useTasks } from '../context/TasksContext';
import type { BoardColumn } from '../context/TasksContext';
import { Plus, Trash2, GripVertical, Save, X, Settings2 } from 'lucide-react';

export const BoardManager = () => {
    const { 
        boards, boardColumns, addBoard, deleteBoard, 
        addColumn, updateColumn, deleteColumn 
    } = useTasks();
    const [selectedBoardId, setSelectedBoardId] = useState<string | null>(boards[0]?.id || null);
    const [newBoardName, setNewBoardName] = useState('');
    const [isAddingBoard, setIsAddingBoard] = useState(false);

    const selectedBoard = boards.find(b => b.id === selectedBoardId);
    const columns = boardColumns.filter(c => c.board_id === selectedBoardId);

    const handleAddBoard = async () => {
        if (!newBoardName.trim()) return;
        await addBoard(newBoardName);
        setNewBoardName('');
        setIsAddingBoard(false);
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
                {/* Board List */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm p-4 h-fit">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Meus Quadros</h2>
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
                                    placeholder="Nome do quadro..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddBoard()}
                                />
                                <button onClick={handleAddBoard} className="text-primary-600 p-1.5"><Save size={18} /></button>
                                <button onClick={() => setIsAddingBoard(false)} className="text-gray-400 p-1.5"><X size={18} /></button>
                            </div>
                        )}

                        <div className="space-y-2">
                            {boards.map(board => (
                                <div key={board.id} className="group flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedBoardId(board.id)}
                                        className={`flex-1 text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                            selectedBoardId === board.id 
                                            ? 'bg-primary-50 text-primary-700 shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                        }`}
                                    >
                                        {board.name}
                                        {board.is_default && <span className="ml-2 text-[8px] bg-gray-100 px-1 py-0.5 rounded text-gray-400">PADRÃO</span>}
                                    </button>
                                    {!board.is_default && (
                                        <button 
                                            onClick={() => window.confirm('Excluir este quadro e TODAS as suas tarefas?') && deleteBoard(board.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column Editor */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedBoard ? (
                        <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{selectedBoard.name}</h3>
                                    <p className="text-xs text-gray-400">Personalize as colunas e cores deste fluxo</p>
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
                                {columns.map((col) => (
                                    <ColumnItem 
                                        key={col.id} 
                                        column={col} 
                                        onUpdate={(upd) => updateColumn(col.id, upd)}
                                        onDelete={() => deleteColumn(col.id)}
                                    />
                                ))}
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

const ColumnItem = ({ column, onUpdate, onDelete }: { column: BoardColumn, onUpdate: (u: any) => void, onDelete: () => void }) => {
    const [title, setTitle] = useState(column.title);

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
    };

    const handleSave = () => {
        onUpdate({ title });
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
            <div className="cursor-grab text-gray-300 hover:text-gray-500 shrink-0">
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
