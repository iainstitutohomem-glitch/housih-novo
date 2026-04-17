import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import { GoogleGenAI } from '@google/genai';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const AIChatDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { tasks, companies, teamMembers } = useTasks();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Olá! Sou seu Assistente Housih. Como posso ajudar com a análise do seu CRM hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const getSystemContext = () => {
        const data = {
            resumo_crm: {
                total_tarefas: tasks.length,
                status: {
                    concluidas: tasks.filter(t => t.status === 'Concluído').length,
                    atrasadas: tasks.filter(t => t.status === 'Atrasado').length,
                    em_andamento: tasks.filter(t => t.status === 'Em Andamento').length,
                    nao_iniciadas: tasks.filter(t => t.status === 'Não Iniciado').length,
                },
                empresas: companies.map(c => ({ id: c.id, nome: c.name, cor: c.color })),
                membros: teamMembers.map(m => ({ id: m.id, nome: m.name })),
                tarefas_detalhadas: tasks.map(t => ({
                    titulo: t.title,
                    empresa: companies.find(c => c.id === t.company_id)?.name || 'Nenhuma',
                    responsavel: Array.isArray(t.assignee) ? t.assignee.join(', ') : t.assignee,
                    status: t.status,
                    prioridade: t.priority,
                    data_entrega: t.due_date ? t.due_date.substring(0, 10) : 'Sem data'
                }))
            }
        };

        return `Você é o Assistente Housih, um analista de dados especialista em produtividade e CRM. 
        Seu objetivo é analisar os dados abaixo e fornecer insights acionáveis, resumos precisos e responder perguntas sobre o estado do projeto.
        
        REGRAS:
        1. Seja direto e profissional, mas amigável.
        2. Use tabelas ou listas sempre que for mostrar muitos dados.
        3. Identifique gargalos (como muitos atrasos ou uma pessoa sobrecarregada).
        4. Se não souber de algo baseado nos dados, diga que não tem essa informação.
        
        DADOS ATUAIS DO CRM:
        ${JSON.stringify(data, null, 2)}
        `;
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
                throw new Error('Chave de API do Gemini não configurada.');
            }

            const ai = new GoogleGenAI({ apiKey });
            
            const history = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

            const chat = ai.chats.create({
                model: "gemini-2.5-flash-latest",
                history: [
                    { role: 'user', parts: [{ text: getSystemContext() }] },
                    { role: 'model', parts: [{ text: 'Entendido. Estou pronto para analisar seus dados do CRM Housih. O que deseja saber?' }] },
                    ...history.slice(1) // Pular a saudação inicial
                ],
            });

            const result = await chat.sendMessage({ message: userMsg });
            const text = result.text || '';

            setMessages(prev => [...prev, { role: 'assistant', content: text }]);
        } catch (error: any) {
            console.error("Erro AI:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: `Ops! Ocorreu um erro ao falar com a IA: ${error.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-4 border-b bg-gradient-to-r from-primary-600 to-primary-500 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-none">Assistente IA</h2>
                            <p className="text-[10px] text-primary-100 mt-1 uppercase tracking-widest font-bold">Housih Intelligence</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar"
                >
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                msg.role === 'user' ? 'bg-primary-100 text-primary-700' : 'bg-white text-primary-600 shadow-sm border border-gray-100'
                            }`}>
                                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                            </div>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-primary-600 text-white rounded-tr-none' 
                                : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
                            }`}>
                                <div className="whitespace-pre-wrap prose prose-sm max-w-none">
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white text-primary-600 shadow-sm border border-gray-100 flex items-center justify-center">
                                <Loader2 size={18} className="animate-spin" />
                            </div>
                            <div className="bg-white text-gray-400 shadow-sm border border-gray-100 p-3 rounded-2xl rounded-tl-none text-xs italic">
                                Analisando dados do sistema...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Pergunte algo sobre suas tarefas..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="absolute right-2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:scale-90"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-2">
                        O Assistente IA analisa apenas os dados atuais do seu CRM.
                    </p>
                </div>
            </div>
        </div>
    );
};
