import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Link, X, User, Circle, Image as ImageIcon, FileText } from 'lucide-react';
import { useChat, ChatMessage } from '../../context/ChatContext';
import { useTasks } from '../../context/TasksContext';
import { useAuth } from '../../context/AuthContext';

export const ChatDrawer = () => {
    const { activeConversation, setActiveConversation, messages, sendMessage, onlineUsers } = useChat();
    const { teamMembers, openModal, tasks } = useTasks();
    const { session } = useAuth();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeMsgs = activeConversation ? messages[activeConversation.id] || [] : [];

    const recipientEmail = activeConversation?.participants.find(p => p !== session?.user?.email);
    const recipient = teamMembers.find(m => m.email === recipientEmail);
    const isOnline = recipientEmail ? onlineUsers.has(recipientEmail) : false;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeMsgs]);

    if (!activeConversation) return null;

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        await sendMessage(input.trim());
        setInput('');
    };

    const handleTaskMention = (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) openModal(task);
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-[10000] animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-primary-600 rounded-t-2xl text-white">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                            {recipient?.avatar_url ? (
                                <img src={recipient.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} />
                            )}
                        </div>
                        {isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-primary-600"></div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm leading-tight">{recipient?.name || 'Chat'}</h3>
                        <p className="text-[10px] opacity-80">{isOnline ? 'Online agora' : 'Offline'}</p>
                    </div>
                </div>
                <button onClick={() => setActiveConversation(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/50">
                {activeMsgs.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 text-center px-8">
                        <div className="p-4 bg-gray-100 rounded-full mb-4 text-gray-400">
                            <Send size={32} />
                        </div>
                        <p className="text-xs font-medium">Inicie o papo! Suas conversações são seguras e privadas.</p>
                    </div>
                )}

                {activeMsgs.map((msg, idx) => {
                    const isMe = msg.sender_email === session?.user?.email;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                                }`}>
                                {!isMe && <p className="text-[10px] font-bold mb-1 opacity-70">{msg.sender_name}</p>}

                                {msg.type === 'text' && <p className="leading-relaxed">{msg.content}</p>}

                                {msg.type === 'task' && (
                                    <button
                                        onClick={() => handleTaskMention(msg.task_id!)}
                                        className={`flex items-center gap-2 p-2 rounded-lg mt-1 transition-colors border ${isMe ? 'bg-primary-700 border-primary-500 hover:bg-primary-800' : 'bg-primary-50 border-primary-100 hover:bg-primary-100 text-primary-700'
                                            }`}
                                    >
                                        <Link size={14} />
                                        <span className="text-xs font-medium">Tarefa: {msg.content}</span>
                                    </button>
                                )}

                                <p className={`text-[9px] mt-1 text-right opacity-60 ${isMe ? 'text-white' : 'text-gray-400'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500/50 transition-all">
                    <button type="button" className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                        <Paperclip size={20} />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Mensagem..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};
