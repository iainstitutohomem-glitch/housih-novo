import React, { useState } from 'react';
import { Plus, Trash2, Camera, MessageSquare } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

export const TeamManager = () => {
    const { user } = useAuth();
    const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, UNIDADES, SETORES } = useTasks();
    const { startPrivateChat } = useChat();
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
    const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
    const [birthDate, setBirthDate] = useState('');
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
            await addTeamMember(newName, avatarBase64, newEmail, selectedUnits, selectedSectors, newPassword, birthDate);
            alert('Membro registrado na lista da Equipe!');
            setNewName('');
            setNewEmail('');
            setNewPassword('');
            setSelectedUnits([]);
            setSelectedSectors([]);
            setBirthDate('');
            setAvatarBase64('');
            setIsAdding(false);
        }
    };

    const toggleUnit = (unit: string) => {
        setSelectedUnits(prev => prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit]);
    };

    const toggleSector = (sector: string) => {
        setSelectedSectors(prev => prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]);
    };

    return (
        <div className="w-full flex flex-col h-full gap-6">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Unidades (Selecione várias)</label>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-40 overflow-y-auto no-scrollbar grid grid-cols-1 gap-2 pretty-scrollbar-y">
                                        {UNIDADES.map(u => (
                                            <label key={u} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded-lg transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedUnits.includes(u)}
                                                    onChange={() => toggleUnit(u)}
                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="text-sm text-gray-700">{u}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Setores (Selecione vários)</label>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-40 overflow-y-auto no-scrollbar grid grid-cols-1 gap-2 pretty-scrollbar-y">
                                        {SETORES.map(s => (
                                            <label key={s} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded-lg transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedSectors.includes(s)}
                                                    onChange={() => toggleSector(s)}
                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="text-sm text-gray-700">{s}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Senha Provisória</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Data de Nascimento</label>
                                    <input
                                        type="text"
                                        placeholder="DD/MM/AAAA"
                                        value={birthDate}
                                        onChange={e => setBirthDate(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                    />
                                </div>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto no-scrollbar pb-8">
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
                        <div className="flex flex-wrap justify-center gap-1 mt-2">
                            {member.units?.map(u => (
                                <span key={u} className="text-[9px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">{u}</span>
                            ))}
                            {member.sectors?.map(s => (
                                <span key={s} className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{s}</span>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">{member.email}</p>
                        {member.birth_date && <p className="text-[9px] text-gray-300 mt-0.5">B-day: {member.birth_date}</p>}

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
