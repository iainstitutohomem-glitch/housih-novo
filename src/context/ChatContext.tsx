import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useTasks } from './TasksContext';

export interface ChatMessage {
    id: string;
    conversation_id: string;
    sender_email: string;
    sender_name: string;
    content: string;
    type: 'text' | 'file' | 'task';
    file_url?: string;
    file_name?: string;
    task_id?: string;
    created_at: string;
}

export interface Conversation {
    id: string;
    name?: string;
    type: 'direct' | 'group';
    last_message_at: string;
    participants: string[];
    unread_count?: number;
}

interface ChatContextType {
    conversations: Conversation[];
    messages: Record<string, ChatMessage[]>;
    onlineUsers: Set<string>;
    isChatOpen: boolean;
    setIsChatOpen: (open: boolean) => void;
    activeConversation: Conversation | null;
    setActiveConversation: (conv: Conversation | null) => void;
    sendMessage: (content: string, type?: 'text' | 'file' | 'task', metadata?: any) => Promise<void>;
    startPrivateChat: (recipientEmail: string) => Promise<void>;
    createGroup: (name: string, participantEmails: string[]) => Promise<void>;
    deleteGroup: (id: string) => Promise<void>;
    uploadFile: (file: File) => Promise<{ url: string; name: string }>;
    loading: boolean;
    totalUnreadCount: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { session } = useAuth();
    const { teamMembers, createNotification } = useTasks();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);

    // 1. Presence Tracking
    useEffect(() => {
        if (!session?.user?.email) return;

        const channel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: session.user.email,
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const online = new Set(Object.keys(state));
                setOnlineUsers(online);
            })
            .on('presence', { event: 'join' }, ({ key }) => {
                setOnlineUsers((prev) => new Set([...prev, key]));
            })
            .on('presence', { event: 'leave' }, ({ key }) => {
                setOnlineUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(key);
                    return newSet;
                });
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ online_at: new Date().toISOString() });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [session]);

    // 2. Fetch Conversations
    useEffect(() => {
        if (!session?.user?.email) return;

        const fetchConversations = async () => {
            setLoading(true);
            const userEmail = session?.user?.email;
            if (!userEmail) {
                setLoading(false);
                return;
            }

            // Busca os IDs das conversas das quais o usuário participa (case-insensitive)
            const { data: participants, error: pError } = await supabase
                .from('chat_participants')
                .select('conversation_id')
                .ilike('user_email', userEmail);

            if (pError) console.error("Error fetching participants:", pError);

            if (participants && participants.length > 0) {
                const convIds = participants.map(p => p.conversation_id);

                const { data: convs, error: cError } = await supabase
                    .from('chat_conversations')
                    .select('*, chat_participants(user_email, unread_count)')
                    .in('id', convIds)
                    .order('last_message_at', { ascending: false });

                if (cError) console.error("Error fetching conversations:", cError);

                if (convs) {
                    const mapped = convs.map(c => {
                        const myParticipantInfo = c.chat_participants.find((p: any) => p.user_email?.toLowerCase() === userEmail.toLowerCase());
                        const unreadCount = myParticipantInfo?.unread_count || 0;
                        return {
                            ...c,
                            participants: c.chat_participants.map((p: any) => p.user_email as string),
                            unread_count: unreadCount
                        };
                    });
                    setConversations(mapped.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()));
                }
            }
            setLoading(false);
        };

        fetchConversations();

        // Subscribe to new conversations or last_message updates
        const channel = supabase
            .channel('chat-convs')
            .on('postgres_changes' as any, { event: '*', table: 'chat_conversations' }, () => fetchConversations())
            .on('postgres_changes' as any, { event: '*', table: 'chat_participants', filter: `user_email=eq.${session.user.email.toLowerCase()}` }, () => fetchConversations())
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [session]);

    // 2b. Reset unread count when opening a conversation
    useEffect(() => {
        if (activeConversation && activeConversation.unread_count && activeConversation.unread_count > 0 && session?.user?.email) {
            supabase.rpc('reset_chat_unread', { 
                p_conversation_id: activeConversation.id, 
                p_user_email: session.user.email 
            }).then(({ error }) => {
                if (!error) {
                    setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, unread_count: 0 } : c));
                    setActiveConversation(prev => prev ? { ...prev, unread_count: 0 } : prev);
                } else {
                    console.error("Erro ao resetar unread:", error);
                }
            });
        }
    }, [activeConversation, session?.user?.email]);

    // 3. Fetch Messages for Active Conversation
    useEffect(() => {
        if (!activeConversation) return;

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('conversation_id', activeConversation.id)
                .order('created_at', { ascending: true });

            if (data) {
                setMessages(prev => ({ ...prev, [activeConversation.id]: data }));
            }
        };

        fetchMessages();

        const channel = supabase
            .channel(`msgs-${activeConversation.id}`)
            .on('postgres_changes' as any,
                { event: 'INSERT', table: 'chat_messages', filter: `conversation_id=eq.${activeConversation.id}` },
                (payload: any) => {
                    if (activeConversation && payload.new) {
                        setMessages(prev => {
                            const currentMsgs = prev[activeConversation.id] || [];
                            return {
                                ...prev,
                                [activeConversation.id]: [...currentMsgs, payload.new as ChatMessage]
                            };
                        });
                        
                        // Local update to push conversation to top when receiving message
                        setConversations(prev => {
                            const updated = prev.map(c => c.id === activeConversation.id ? { ...c, last_message_at: new Date().toISOString() } : c);
                            return updated.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [activeConversation]);

    const startPrivateChat = async (recipientEmail: string) => {
        const userEmail = session?.user?.email;
        if (!userEmail) return;

        setIsChatOpen(true);

        // Check if exists
        const existing = conversations.find(c =>
            c.type === 'direct' &&
            c.participants.some((p: string) => p.toLowerCase() === recipientEmail.toLowerCase()) &&
            c.participants.some((p: string) => p.toLowerCase() === userEmail.toLowerCase())
        );

        if (existing) {
            setActiveConversation(existing);
            return;
        }

        // Create new
        const newId = crypto.randomUUID();
        const { error: cError } = await supabase
            .from('chat_conversations')
            .insert({ id: newId, type: 'direct' });

        if (!cError) {
            // Inserimos os participantes (e-mail do receptor sempre em lowercase para normalizar)
            const { error: pError } = await supabase.from('chat_participants').insert([
                { conversation_id: newId, user_email: userEmail.toLowerCase() },
                { conversation_id: newId, user_email: recipientEmail.toLowerCase() }
            ]);

            if (pError) {
                console.error("Participant insert error:", pError);
                return;
            }

            const newConv: Conversation = {
                id: newId,
                type: 'direct',
                last_message_at: new Date().toISOString(),
                participants: [userEmail.toLowerCase(), recipientEmail.toLowerCase()]
            };
            setConversations(prev => [newConv, ...prev]);
            setActiveConversation(newConv);
        } else {
            console.error("Conversation creation error:", cError);
        }
    };

    const createGroup = async (name: string, participantEmails: string[]) => {
        const userEmail = session?.user?.email;
        if (!userEmail) return;

        const newId = crypto.randomUUID();
        const { error: cError } = await supabase
            .from('chat_conversations')
            .insert({ id: newId, type: 'group', name })

        if (!cError) {
            // Garantir que não haja e-mails duplicados (ex: se o usuário se selecionar na lista)
            const uniqueEmails = Array.from(new Set([
                userEmail.toLowerCase(),
                ...participantEmails.map(email => email.toLowerCase())
            ]));

            const participants = uniqueEmails.map(email => ({ 
                conversation_id: newId, 
                user_email: email 
            }));

            const { error: pError } = await supabase.from('chat_participants').insert(participants);

            if (!pError) {
                const newConv: Conversation = {
                    id: newId,
                    type: 'group',
                    name,
                    last_message_at: new Date().toISOString(),
                    participants: [userEmail.toLowerCase(), ...participantEmails.map(e => e.toLowerCase())]
                };
                setConversations(prev => [newConv, ...prev]);
                setActiveConversation(newConv);
            } else {
                console.error("Error inserting participants:", pError);
                alert("Erro ao adicionar participantes: " + pError.message);
            }
        } else {
            console.error("Error creating group conversation:", cError);
            alert("Erro ao criar conversa do grupo: " + cError.message);
        }
    };

    const deleteGroup = async (id: string) => {
        const { error } = await supabase
            .from('chat_conversations')
            .delete()
            .eq('id', id);

        if (!error) {
            setConversations(prev => prev.filter(c => c.id !== id));
            if (activeConversation?.id === id) {
                setActiveConversation(null);
            }
        } else {
            console.error("Error deleting group:", error);
            alert("Erro ao excluir grupo: Verifique se você tem permissão.");
        }
    };

    const sendMessage = async (content: string, type: 'text' | 'file' | 'task' = 'text', metadata: any = {}) => {
        const userEmail = session?.user?.email;
        if (!activeConversation || !userEmail) {
            console.error("Tentativa de envio sem conversa ativa ou sessão.");
            return;
        }

        const senderName = teamMembers.find(m => m.email?.toLowerCase() === userEmail.toLowerCase())?.name || 'Usuário';

        // 1. Criação da mensagem otimista para feedback instantâneo
        const optimisticMsg: ChatMessage = {
            id: `temp-${Date.now()}`,
            conversation_id: activeConversation.id,
            sender_email: userEmail,
            sender_name: senderName,
            content,
            type,
            created_at: new Date().toISOString(),
            ...metadata
        };

        // Adiciona localmente antes mesmo de ir pro banco
        setMessages(prev => ({
            ...prev,
            [activeConversation.id]: [...(prev[activeConversation.id] || []), optimisticMsg]
        }));

        // 2. Envio pro Supabase
        const { error } = await supabase.from('chat_messages').insert({
            conversation_id: activeConversation.id,
            sender_email: userEmail,
            sender_name: senderName,
            content,
            type,
            ...metadata
        });

        if (error) {
            console.error("Erro ao salvar mensagem no Supabase:", error);
            // Remove a mensagem otimista em caso de erro real
            setMessages(prev => ({
                ...prev,
                [activeConversation.id]: (prev[activeConversation.id] || []).filter(m => m.id !== optimisticMsg.id)
            }));
            alert("Erro ao enviar mensagem: " + error.message);
        } else {
            console.log("Mensagem enviada com sucesso!");
            
            // Push locally immediately
            setConversations(prev => {
                const updated = prev.map(c => c.id === activeConversation.id ? { ...c, last_message_at: new Date().toISOString() } : c);
                return updated.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
            });

            await supabase.from('chat_conversations')
                .update({ last_message_at: new Date().toISOString() })
                .eq('id', activeConversation.id);

            // Dispara notificação para os participantes
            const safeParticipants = (activeConversation.participants || []).map(p => p ? p.toLowerCase() : '');
            safeParticipants.forEach(async (participantEmail) => {
                if (participantEmail && participantEmail !== userEmail.toLowerCase()) {
                    let notifMessage = 'enviou uma nova mensagem para você.';
                    if (activeConversation.type === 'group') {
                        notifMessage = `enviou uma mensagem no grupo ${activeConversation.name || 'Equipe'}.`;
                    }
                    
                    await createNotification({
                        recipient_email: participantEmail,
                        type: 'chat',
                        message: notifMessage
                    });
                }
            });
        }
    };

    const uploadFile = async (file: File): Promise<{ url: string; name: string }> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${session?.user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('chat-files')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('chat-files')
            .getPublicUrl(filePath);

        return { url: data.publicUrl, name: file.name };
    };

    const totalUnreadCount = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

    return (
        <ChatContext.Provider value={{ 
            conversations, 
            messages, 
            onlineUsers, 
            isChatOpen,
            setIsChatOpen,
            activeConversation, 
            setActiveConversation, 
            sendMessage, 
            startPrivateChat, 
            createGroup, 
            deleteGroup,
            uploadFile, 
            loading,
            totalUnreadCount
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context;
};
