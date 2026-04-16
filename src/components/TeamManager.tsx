import { useState } from 'react';
import { Plus, Trash2, Camera } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { MessageSquare } from 'lucide-react';

export const TeamManager = () => {
    const { user } = useAuth();
    const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useTasks();
    const { startPrivateChat } = useChat();
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [avatarBase64, setAvatarBase64] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdd = async () => {
        if (newName.trim()) {
            await addTeamMember(newName, avatarBase64, newEmail);
            alert('Membro registrado na lista da Equipe! Para ativar o login com a senha que você definiu, certifique-se de cadastrar este mesmo e-mail na aba "Authentication" do seu Supabase.');
            setNewName('');
            setNewEmail('');
            setNewPassword('');
            setAvatarBase64('');
            setIsAdding(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col h-full gap-6">
            <div className="flex justify-between items-center bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Equipe</h2>
                    <p className="text-sm text-gray-500 mt-1">Gerencie os membros da equipe e os responsáveis pelas tarefas</p>
                </div>
                <div className="flex gap-3">
                    {user?.email === 'institutohomem@gmail.com' && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all"
                        >
                            <Plus size={18} /> Novo Membro
                        </button>
                    )}
                </div>
            </div>

            {isAdding && (
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm animate-in fade-in slide-in-from-top-4 space-y-4">
                    <h3 className="font-semibold text-gray-800">Cadastrar Novo Membro</h3>
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 relative group cursor-pointer">
                                {avatarBase64 ? (
                                    <img src={avatarBase64} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera size={32} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
                                )}
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            <span className="text-xs text-gray-500">Adicionar Foto</span>
                        </div>
                        <div className="flex-1 w-full space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nome Completo</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: João Silva"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">E-mail de Login</label>
                                    <input
                                        type="email"
                                        placeholder="joao@empresa.com"
                                        value={newEmail}
                                        onChange={e => setNewEmail(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Senha Provisória</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full max-w-md bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Dica: O membro poderá alterar esta senha no primeiro login.</p>
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button onClick={handleAdd} className="bg-gray-800 text-white px-6 py-2.5 rounded-xl hover:bg-gray-700 transition-colors shadow-sm">
                                    Salvar Membro e Gerar Acesso
                                </button>
                                <button onClick={() => setIsAdding(false)} className="text-gray-500 px-4 hover:text-gray-800 transition-colors">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto pb-8">
                {teamMembers.map(member => (
                    <div key={member.id} className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow group relative flex flex-col items-center text-center">
                        {user?.email === 'institutohomem@gmail.com' && (
                            <button
                                onClick={() => { if (window.confirm('Tem certeza que deseja remover este membro da equipe?')) deleteTeamMember(member.id.toString()); }}
                                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center font-bold text-2xl text-primary-700 mb-4 border-4 border-white shadow-sm overflow-hidden relative group/avatar">
                            {member.avatar_url ? (
                                <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                member.name.charAt(0).toUpperCase()
                            )}

                            {/* Option to change photo if it's the current user OR if user is the Master Admin */}
                            {(user?.email === member.email || user?.email === 'institutohomem@gmail.com') && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                                    <Camera size={24} className="text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = async () => {
                                                    await updateTeamMember(member.id, { avatar_url: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{user?.email === member.email ? 'Você' : 'Membro da Equipe'}</p>

                        {member.email && user?.email !== member.email && (
                            <button
                                onClick={() => startPrivateChat(member.email!)}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all text-xs font-bold border border-primary-100"
                            >
                                <MessageSquare size={14} /> Iniciar Chat
                            </button>
                        )}
                    </div>
                ))}
                {teamMembers.length === 0 && !isAdding && (
                    <div className="col-span-full py-12 text-center text-gray-400">
                        Nenhum membro cadastrado. Cadastre para adicioná-los como responsáveis!
                    </div>
                )}
            </div>
        </div>
    );
};
