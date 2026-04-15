import React, { createContext, useContext, useState, useEffect } from 'react';
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
    loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
            const { data: participants } = await supabase
                .from('chat_participants')
                .select('conversation_id')
                .eq('user_email', session.user.email);

            if (participants && participants.length > 0) {
                const convIds = participants.map(p => p.conversation_id);

                const { data: convs } = await supabase
                    .from('chat_conversations')
                    .select('*, chat_participants(user_email)')
                    .in('id', convIds)
                    .order('last_message_at', { ascending: false });

                if (convs) {
                    const mapped = convs.map(c => ({
                        ...c,
                        participants: c.chat_participants.map((p: any) => p.user_email)
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
                    setMessages(prev => ({
                        ...prev,
                        [activeConversation.id]: [...(prev[activeConversation.id] || []), payload.new as ChatMessage]
                    }));
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [activeConversation]);

    const startPrivateChat = async (recipientEmail: string) => {
        if (!session?.user?.email) return;

        // Check if exists
        const existing = conversations.find(c =>
            c.type === 'direct' &&
            c.participants.includes(recipientEmail) &&
            c.participants.includes(session.user.email!)
        );

        if (existing) {
            setActiveConversation(existing);
            return;
        }

        // Create new
        const { data: conv } = await supabase
            .from('chat_conversations')
            .insert({ type: 'direct' })
            .select()
            .single();

        if (conv) {
            await supabase.from('chat_participants').insert([
                { conversation_id: conv.id, user_email: session.user.email },
                { conversation_id: conv.id, user_email: recipientEmail }
            ]);

            const newConv: Conversation = {
                ...conv,
                participants: [session.user.email, recipientEmail]
            };
            setConversations(prev => [newConv, ...prev]);
            setActiveConversation(newConv);
        }
    };

    const sendMessage = async (content: string, type: 'text' | 'file' | 'task' = 'text', metadata: any = {}) => {
        if (!activeConversation || !session?.user?.email) return;

        const senderName = teamMembers.find(m => m.email === session.user.email)?.name || 'Usuário';

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
        <ChatContext.Provider value={{ conversations, messages, onlineUsers, activeConversation, setActiveConversation, sendMessage, startPrivateChat, loading }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context;
};
