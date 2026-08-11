import { useState, useRef, useEffect } from 'react';
import { useTasks } from '../context/TasksContext';
import { useAuth } from '../context/AuthContext';
import { 
    Plus, Search, CheckCircle2, Clock, 
    Send, X, 
    Shield, Inbox, Send as SendIcon, Hash, Tag, LifeBuoy, AlertTriangle
} from 'lucide-react';

const SUBJECT_OPTIONS = [
    { label: 'Dúvida Geral', icon: <Inbox size={14} /> },
    { label: 'Suporte Técnico', icon: <LifeBuoy size={14} /> },
    { label: 'Reclamação / Feedback', icon: <AlertTriangle size={14} /> },
    { label: 'Solicitação de Acesso', icon: <Shield size={14} /> },
    { label: 'Financeiro / Pagamentos', icon: <Clock size={14} /> },
    { label: 'Outros Assuntos', icon: <Plus size={14} /> }
];

export const TicketManager = () => {
    const { session } = useAuth();
    const { 
        tickets, teamMembers, CORPORATIVO_SECTORS, 
        addTicket, addTicketMessage, updateTicketStatus 
    } = useTasks();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<'aberto' | 'finalizado'>('aberto');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [newTicket, setNewTicket] = useState({
        target_sector: '',
        theme: '',
        subject: '',
        description: ''
    });

    const [messageInput, setMessageInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const currentUser = teamMembers.find(m => m.email?.toLowerCase() === session?.user?.email?.toLowerCase());
    const selectedTicket = tickets.find(t => t.id === selectedTicketId);

    const isMaster = 
        currentUser?.sectors?.includes('Master') || 
        currentUser?.sectors?.includes('Diretoria') || 
        session?.user?.email?.toLowerCase() === 'institutohomem@gmail.com';

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedTicket?.messages]);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTicket.target_sector || !newTicket.subject) return;

        try {
            await addTicket(newTicket);
            setIsCreateModalOpen(false);
            setNewTicket({ target_sector: '', theme: '', subject: '', description: '' });
        } catch (error) {
            alert("Erro ao abrir chamado.");
        }
    };

    const handleSendMessage = async () => {
        if (!selectedTicketId || !messageInput.trim()) return;
        await addTicketMessage(selectedTicketId, messageInput);
        setMessageInput('');
    };

    const filteredTickets = tickets.filter(t => {
        const matchesStatus = t.status === filterStatus;
        const matchesSearch = 
            t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
            t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.protocol?.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (isMaster) return matchesStatus && matchesSearch;
        
        const isOwner = t.sender_id === currentUser?.id;
        const isLeader = currentUser?.role === 'Líder';
        const isTarget = currentUser?.sectors?.includes(t.target_sector) && isLeader;
        
        return matchesStatus && matchesSearch && (isOwner || isTarget);
    });

    return (
        <div className="flex flex-col h-full bg-[#f8fafb] overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-8 py-6 flex-shrink-0 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-8">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Central de Chamados</h2>
                        <p className="text-[10px] text-primary-500 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></span>
                            Housih Corporativo
                        </p>
                    </div>
                    
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                        <button 
                            onClick={() => setFilterStatus('aberto')}
                            className={`px-8 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 ${filterStatus === 'aberto' ? 'bg-white text-primary-600 shadow-lg shadow-primary-100' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            EM ABERTO
                        </button>
                        <button 
                            onClick={() => setFilterStatus('finalizado')}
                            className={`px-8 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 ${filterStatus === 'finalizado' ? 'bg-white text-green-600 shadow-lg shadow-green-100' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            FINALIZADOS
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Protocolo ou Assunto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all w-72"
                        />
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xl shadow-primary-600/30 transition-all active:scale-95"
                    >
                        <Plus size={20} /> NOVO CHAMADO
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* List Pane */}
                <div className="w-96 border-r border-gray-100 overflow-y-auto bg-gray-50/30 custom-scrollbar">
                    {filteredTickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300 p-12 text-center">
                            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mb-4 shadow-sm">
                                <Inbox size={32} className="opacity-20" />
                            </div>
                            <p className="text-sm font-bold text-gray-400">Nenhum chamado</p>
                        </div>
                    ) : (
                        <div className="p-4 space-y-3">
                            {filteredTickets.map(ticket => (
                                <button 
                                    key={ticket.id}
                                    onClick={() => setSelectedTicketId(ticket.id)}
                                    className={`w-full text-left p-5 rounded-3xl transition-all duration-300 group relative overflow-hidden ${
                                        selectedTicketId === ticket.id 
                                        ? 'bg-white shadow-xl shadow-gray-200/50 ring-1 ring-primary-500/10' 
                                        : 'hover:bg-white/60'
                                    }`}
                                >
                                    <div className="flex gap-4 items-start relative z-10">
                                        <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all ${
                                            selectedTicketId === ticket.id ? 'bg-primary-600 text-white scale-105 shadow-lg shadow-primary-200' : 'bg-white text-gray-300 border border-gray-100'
                                        }`}>
                                            <Hash size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${selectedTicketId === ticket.id ? 'text-primary-500' : 'text-gray-400'}`}>
                                                    {ticket.protocol}
                                                </span>
                                                <span className="text-[9px] text-gray-300 font-bold">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="font-bold text-gray-700 truncate text-sm mb-1 uppercase">{ticket.subject}</h4>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[8px] font-bold bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded uppercase">{ticket.theme}</span>
                                                <span className="text-[8px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase">{ticket.target_sector}</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 line-clamp-1 font-medium">{ticket.description}</p>
                                        </div>
                                    </div>
                                    {selectedTicketId === ticket.id && (
                                        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-primary-600"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Pane */}
                <div className="flex-1 flex flex-col bg-white relative">
                    {selectedTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-inner">
                                        <Hash size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-black text-gray-800 text-lg uppercase">{selectedTicket.subject}</h3>
                                            <span className="text-xs font-black text-primary-500 bg-primary-50 px-2 py-1 rounded-lg">
                                                {selectedTicket.protocol}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">
                                            {selectedTicket.theme} • Para <span className="text-gray-800">{selectedTicket.target_sector}</span> • Por <span className="text-primary-600">{selectedTicket.sender?.name}</span>
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {selectedTicket.status === 'aberto' && (
                                        <button 
                                            onClick={() => updateTicketStatus(selectedTicket.id, 'finalizado')}
                                            className="bg-green-50 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 border border-green-100"
                                        >
                                            <CheckCircle2 size={16} /> FINALIZAR PROTOCOLO
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Chat Container */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-gray-50/30 custom-scrollbar">
                                <div className="max-w-3xl mx-auto">
                                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative">
                                        <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary-50 text-primary-600 rounded-xl"><Tag size={18} /></div>
                                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Solicitação Inicial</span>
                                            </div>
                                            <span className="text-[10px] text-gray-300 font-bold">{new Date(selectedTicket.created_at).toLocaleString()}</span>
                                        </div>
                                        <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm font-medium">{selectedTicket.description}</div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="max-w-3xl mx-auto space-y-6">
                                    {(selectedTicket.messages || []).map((msg: any) => (
                                        <div key={msg.id} className={`flex gap-4 ${msg.sender_id === currentUser?.id ? 'flex-row-reverse' : ''}`}>
                                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100 flex-shrink-0">
                                                {msg.sender?.avatar_url ? (
                                                    <img src={msg.sender.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-black text-gray-200 text-xs uppercase">{msg.sender?.name?.charAt(0)}</div>
                                                )}
                                            </div>
                                            <div className={`max-w-[80%] p-5 rounded-[1.5rem] shadow-sm ${msg.sender_id === currentUser?.id ? 'bg-primary-600 text-white rounded-tr-none shadow-primary-600/20' : 'bg-white border border-gray-100 text-gray-600 rounded-tl-none'}`}>
                                                <div className={`text-[10px] font-black mb-1.5 ${msg.sender_id === currentUser?.id ? 'text-primary-100' : 'text-primary-600'}`}>
                                                    {msg.sender?.name}
                                                </div>
                                                <div className="text-sm leading-relaxed">{msg.content}</div>
                                                <div className={`text-[9px] mt-2 font-bold opacity-60`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            {selectedTicket.status === 'aberto' && (
                                <div className="p-8 bg-white border-t border-gray-100">
                                    <div className="max-w-3xl mx-auto flex gap-4">
                                        <div className="flex-1">
                                            <input 
                                                type="text" 
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Escreva sua resposta..."
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-200 transition-all shadow-inner"
                                            />
                                        </div>
                                        <button 
                                            onClick={handleSendMessage}
                                            className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-2xl transition-all active:scale-95 shadow-xl shadow-primary-600/30 flex items-center justify-center"
                                        >
                                            <Send size={24} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/20">
                            <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-xl mb-8 text-primary-100 border border-gray-50 relative">
                                <Hash size={64} />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full border-4 border-white"></div>
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">Central de Atendimento</h3>
                            <p className="max-w-xs text-sm font-medium text-gray-400 leading-relaxed text-center px-4 italic">Selecione um protocolo para iniciar.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-10 border-b border-gray-50 bg-primary-600 text-white flex justify-between items-center relative">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black uppercase tracking-[0.1em]">Novo Chamado</h3>
                                <p className="text-[10px] text-primary-100 font-bold uppercase mt-1">Housih Support Protocol</p>
                            </div>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors relative z-10">
                                <X size={24} />
                            </button>
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                        </div>
                        
                        <form onSubmit={handleCreateTicket} className="p-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Destinar ao Setor</label>
                                    <select 
                                        required
                                        value={newTicket.target_sector}
                                        onChange={(e) => setNewTicket({...newTicket, target_sector: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 py-4 px-5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Selecione o Setor...</option>
                                        {(CORPORATIVO_SECTORS || []).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Assunto (Categoria)</label>
                                    <select 
                                        required
                                        value={newTicket.theme}
                                        onChange={(e) => setNewTicket({...newTicket, theme: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 py-4 px-5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Selecione o Motivo...</option>
                                        {SUBJECT_OPTIONS.map(opt => (
                                            <option key={opt.label} value={opt.label}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Título do Chamado</label>
                                <input 
                                    required
                                    type="text"
                                    placeholder="Ex: Erro no acesso à planilha, Dúvida sobre holerite..."
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 py-4 px-5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição Detalhada</label>
                                <textarea 
                                    required
                                    rows={4}
                                    placeholder="Escreva aqui os detalhes da sua solicitação..."
                                    value={newTicket.description}
                                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 py-5 px-6 rounded-3xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all resize-none shadow-inner"
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary-600/30 transition-all active:scale-95 flex items-center justify-center gap-4 group"
                            >
                                <SendIcon size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                                ABRIR PROTOCOLO AGORA
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
