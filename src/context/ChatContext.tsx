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
}

interface ChatContextType {
    conversations: Conversation[];
    messages: Record<string, ChatMessage[]>;
    onlineUsers: Set<string>;
    activeConversation: Conversation | null;
    setActiveConversation: (conv: Conversation | null) => void;
    sendMessage: (content: string, type?: 'text' | 'file' | 'task', metadata?: any) => Promise<void>;
    startPrivateChat: (recipientEmail: string) => Promise<void>;
    createGroup: (name: string, participantEmails: string[]) => Promise<void>;
    loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { session } = useAuth();
    const { teamMembers } = useTasks();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
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
                    .select('*, chat_participants(user_email)')
                    .in('id', convIds)
                    .order('last_message_at', { ascending: false });

                if (cError) console.error("Error fetching conversations:", cError);

                if (convs) {
                    const mapped = convs.map(c => ({
                        ...c,
                        participants: c.chat_participants.map((p: any) => p.user_email as string)
                    }));
                    setConversations(mapped);
                }
            }
            setLoading(false);
        };

        fetchConversations();

        // Subscribe to new conversations or last_message updates
        const channel = supabase
            .channel('chat-convs')
            .on('postgres_changes' as any, { event: '*', table: 'chat_conversations' }, () => fetchConversations())
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [session]);

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
        if (!session?.user?.email) return;

        const newId = crypto.randomUUID();
        const { error: cError } = await supabase
            .from('chat_conversations')
            .insert({ id: newId, type: 'group', name })

        if (!cError) {
            const participants = [
                { conversation_id: newId, user_email: userEmail.toLowerCase() },
                ...participantEmails.map(email => ({ conversation_id: newId, user_email: email.toLowerCase() }))
            ];

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
            }
        }
    };

    const sendMessage = async (content: string, type: 'text' | 'file' | 'task' = 'text', metadata: any = {}) => {
        if (!activeConversation || !session?.user?.email) return;

        const senderName = teamMembers.find(m => m.email?.toLowerCase() === session.user.email?.toLowerCase())?.name || 'Usuário';

        const { error } = await supabase.from('chat_messages').insert({
            conversation_id: activeConversation.id,
            sender_email: session.user.email,
            sender_name: senderName,
            content,
            type,
            ...metadata
        });

        if (!error) {
            await supabase.from('chat_conversations')
                .update({ last_message_at: new Date().toISOString() })
                .eq('id', activeConversation.id);
        }
    };

    return (
        <ChatContext.Provider value={{ conversations, messages, onlineUsers, activeConversation, setActiveConversation, sendMessage, startPrivateChat, createGroup, loading }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context;
};
