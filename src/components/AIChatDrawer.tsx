import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const AIChatDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { tasks, companies, teamMembers } = useTasks();
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Olá! Sou seu Assistente Housih. Como posso ajudar com a análise do seu **Sistema** hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [retryStatus, setRetryStatus] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Identificação do Usuário
    const currentUser = teamMembers.find(m => m.email?.toLowerCase() === user?.email?.toLowerCase());
    const userName = currentUser?.name || user?.user_metadata?.full_name || 'Usuário';

    // Carregar Histórico Persistente
    useEffect(() => {
        if (!isOpen || !user) return;

        const fetchHistory = async () => {
            const { data, error } = await supabase
                .from('ai_chat_history')
                .select('role, content')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (!error && data && data.length > 0) {
                setMessages(data as Message[]);
            }
        };

        fetchHistory();
    }, [isOpen, user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const getSystemContext = () => {
        // Otimização de Alta Densidade: Converter objetos em strings compactas
        // para economizar tokens e permitir análise de 100% das tarefas.
        const compactedTasks = tasks.map(t => {
            const empresa = companies.find(c => c.id === t.company_id)?.name || 'N/A';
            const resp = Array.isArray(t.assignee) ? t.assignee.join(',') : t.assignee;
            const data = t.due_date ? t.due_date.substring(0, 10) : 'S/D';
            return `${t.title} | ${empresa} | ${resp} | ${t.status} | ${t.priority} | ${data}`;
        }).join('\n');

        const dataResumo = {
            total: tasks.length,
            status: {
                concluidas: tasks.filter((t: any) => t.status === 'Concluído').length,
                atrasadas: tasks.filter((t: any) => t.status === 'Atrasado').length,
                em_andamento: tasks.filter((t: any) => t.status === 'Em Andamento').length,
                nao_iniciadas: tasks.filter((t: any) => t.status === 'Não Iniciado').length,
            }
        };

        return `Você é o Assistente Housih, um analista de dados especialista em gestão.
        Seu objetivo é analisar os dados abaixo e fornecer insights acionáveis e resumos precisos para o(a) **${userName}**.

        REGRAS CRÍTICAS DE RESPOSTA:
        1. ANALISE TODOS OS DADOS. Não limite sua análise interna.
        2. SILÊNCIO TÉCNICO: Jamais mencione o número de tarefas que está processando ou limites de dados.
        3. RESUMO MACRO: **PROIBIDO** gerar tabelas ou listas longas detalhando tarefas individuais (Título, Empresa, Status, Entrega).
        4. SÍNTESE: Em vez de listar tarefas, agrupe-as. Ex: "Houve 5 tarefas concluídas em Meta ADS" em vez de criar uma tabela com as 5.
        5. FOCO EM INSIGHTS: Fale sobre tendências, gargalos e o que precisa ser feito.
        6. NUNCA use o termo "CRM". Refira-se ao projeto como "Sistema Housih".
        7. Use negrito (**texto**) para nomes e métricas importantes.

        RESUMO GERAL:
        ${JSON.stringify(dataResumo)}

        LISTA COMPLETA DE TAREFAS (Título | Empresa | Responsável | Status | Prioridade | Entrega):
        ${compactedTasks}
        `;
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');
        setMessages((prev: Message[]) => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        // Salvar Mensagem do Usuário no Banco
        if (user) {
            await supabase.from('ai_chat_history').insert([
                { user_id: user.id, role: 'user', content: userMsg }
            ]);
        }

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
                throw new Error('Chave de API do Gemini não configurada.');
            }

            const ai = new GoogleGenAI({ apiKey });
            
            // Limitar o histórico enviado para a IA para as últimas 25 mensagens
            // Isso evita erros de "High Demand" por excesso de tokens e sobrecarga do servidor
            const historyLimit = 25;
            const historyToProcess = messages.length > historyLimit ? messages.slice(-historyLimit) : messages;

            const history = historyToProcess.map((m: Message) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

            const models = [
                "gemini-3.1-flash", 
                "gemini-3.1-flash-lite", 
                "gemini-3-flash", 
                "gemini-2.5-flash", 
                "gemini-1.5-flash-latest", 
                "gemini-1.5-flash"
            ];
            
            let text = "";
            let success = false;

            for (const modelId of models) {
                let attempts = 0;
                const maxAttempts = 2; // Tenta cada modelo 2 vezes com espera

                while (attempts < maxAttempts) {
                    try {
                        setRetryStatus(null);
                        const chat = ai.chats.create({
                            model: modelId,
                            history: [
                                { role: 'user', parts: [{ text: getSystemContext() }] },
                                { role: 'model', parts: [{ text: 'Entendido. Estou pronto para analisar seus dados do Sistema Housih. O que deseja saber?' }] },
                                ...history.slice(1)
                            ],
                        });

                        const result = await chat.sendMessage({ message: userMsg });
                        text = result.text || '';
                        success = true;
                        break;
                    } catch (err: any) {
                        attempts++;
                        console.error(`Falha no modelo ${modelId} (Tentativa ${attempts}):`, err);
                        
                        const is404 = err.status === 404 || (err.message && err.message.includes('404'));
                        const isRetryable = err.status === 503 || err.status === 429 || 
                                          (err.message && (err.message.includes('503') || err.message.includes('429')));
                        
                        if (is404) break; 

                        if (isRetryable) {
                            setRetryStatus(`Google ocupado... tentando novamente em alguns segundos.`);
                            // Espera exponencial: 2s na primeira falha, 4s na segunda
                            await new Promise(resolve => setTimeout(resolve, attempts * 2000));
                            continue;
                        }
                        
                        throw err; 
                    }
                }
                if (success) break;
            }


            if (success) {
                setMessages((prev: Message[]) => [...prev, { role: 'assistant', content: text }]);
                
                // Salvar Resposta da IA no Banco
                if (user) {
                    await supabase.from('ai_chat_history').insert([
                        { user_id: user.id, role: 'assistant', content: text }
                    ]);
                }
            } else {
                throw new Error("O Google AI está com demanda muito alta no momento. Por favor, tente novamente em alguns instantes.");
            }
        } catch (error: any) {
            console.error("Erro AI:", error);
            const errorMsg = error.message || 'Erro desconhecido';
            setMessages((prev: Message[]) => [...prev, { role: 'assistant', content: `Ops! ${errorMsg}` }]);
        } finally {
            setLoading(false);
            setRetryStatus(null);
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
                                <div className="prose prose-sm max-w-none prose-p:leading-relaxed dark:prose-invert">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white text-primary-600 shadow-sm border border-gray-100 flex items-center justify-center">
                                    <Loader2 size={18} className="animate-spin" />
                                </div>
                                <div className="bg-white text-gray-400 shadow-sm border border-gray-100 p-3 rounded-2xl rounded-tl-none text-xs italic">
                                    Analisando dados do sistema...
                                </div>
                            </div>
                            {retryStatus && (
                                <div className="ml-11 text-[10px] text-primary-500 font-medium animate-pulse">
                                    {retryStatus}
                                </div>
                            )}
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
                        O Assistente IA analisa apenas os dados atuais do seu Sistema.
                    </p>
                </div>
            </div>
        </div>
    );
};
