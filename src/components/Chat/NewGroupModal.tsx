import React, { useState, type FC } from 'react';
import { X, Users, CheckSquare, Square } from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import { useChat } from '../../context/ChatContext';

interface NewGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NewGroupModal: FC<NewGroupModalProps> = ({ isOpen, onClose }) => {
    const { teamMembers } = useTasks();
    const { createGroup } = useChat();
    const [name, setName] = useState('');
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

    if (!isOpen) return null;

    const toggleMember = (email: string) => {
        setSelectedEmails(prev =>
            prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
        );
    };

    const handleCreate = async () => {
        if (!name.trim() || selectedEmails.length === 0) return;
        await createGroup(name.trim(), selectedEmails);
        setName('');
        setSelectedEmails([]);
        onClose();
    };

    // Filtra apenas membros com email
    const eligibleMembers = teamMembers.filter(m => m.email);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[20000] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary-600 text-white">
                    <div className="flex items-center gap-3">
                        <Users size={24} />
                        <h2 className="text-xl font-bold">Novo Grupo</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nome do Grupo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Equipe de MKT, Projeto X..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Selecionar Integrantes ({selectedEmails.length})</label>
                        <div className="space-y-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar text-gray-800">
                            {eligibleMembers.map((member) => (
                                <button
                                    key={member.id}
                                    onClick={() => toggleMember(member.email!)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedEmails.includes(member.email!)
                                        ? 'bg-primary-50 border-primary-100'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="shrink-0">
                                        {selectedEmails.includes(member.email!)
                                            ? <CheckSquare className="text-primary-600" size={20} />
                                            : <Square className="text-gray-300" size={20} />
                                        }
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs uppercase overflow-hidden">
                                        {member.avatar_url ? (
                                            <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            member.name.charAt(0)
                                        )}
                                    </div>
                                    <span className="text-sm font-medium">{member.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!name.trim() || selectedEmails.length === 0}
                        className="flex-1 px-4 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:grayscale"
                    >
                        Criar Grupo
                    </button>
                </div>
            </div>
        </div>
    );
};
