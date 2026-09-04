import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Camera, MessageSquare, Pencil, X, Save, Search, Filter, AlertTriangle, Users } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import type { TeamMember } from '../context/TasksContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { supabase } from '../lib/supabase';

export const TeamManager = () => {
    const { user } = useAuth();
    const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, UNIDADES, SETORES, addUnit, deleteUnit, addSector, deleteSector } = useTasks();
    const { startPrivateChat } = useChat();
    const currentUser = teamMembers.find(m => m.email?.toLowerCase() === user?.email?.toLowerCase());
    const isMaster = 
        currentUser?.sectors?.includes('Master') || 
        currentUser?.sectors?.includes('Diretoria') || 
        user?.email?.toLowerCase() === 'institutohomem@gmail.com';

    // ── Search & Filter State ──
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUnitFilter, setSelectedUnitFilter] = useState('Todas');
    const [selectedSectorFilter, setSelectedSectorFilter] = useState('Todos');
    const [onlyDuplicatesFilter, setOnlyDuplicatesFilter] = useState(false);

    // List of all sectors for filter
    const ALL_SECTORS = useMemo(() => {
        const set = new Set<string>(['Recepção', 'Administrativo', 'Gestor/Assessor', 'Enfermagem', 'Médico', 'Comercial', 'Operações & Projetos Internos', 'RH', 'TI', 'Financeiro', 'Jurídico', 'Cobrança', 'Comunicação & Marketing', 'Controladoria', 'DP', 'Geral', ...SETORES]);
        teamMembers.forEach(m => {
            if (Array.isArray(m.sectors)) m.sectors.forEach(s => s && set.add(s));
            else if (typeof m.sectors === 'string' && m.sectors) set.add(m.sectors);
        });
        return Array.from(set).sort();
    }, [SETORES, teamMembers]);

    // Duplicate detection sets
    const duplicateEmailsSet = useMemo(() => {
        const counts = new Map<string, number>();
        teamMembers.forEach(m => {
            const email = (m.email || '').toLowerCase().trim();
            if (email) counts.set(email, (counts.get(email) || 0) + 1);
        });
        const dups = new Set<string>();
        counts.forEach((cnt, email) => { if (cnt > 1) dups.add(email); });
        return dups;
    }, [teamMembers]);

    const duplicateNamesSet = useMemo(() => {
        const counts = new Map<string, number>();
        teamMembers.forEach(m => {
            const name = (m.name || '').toLowerCase().trim();
            if (name) counts.set(name, (counts.get(name) || 0) + 1);
        });
        const dups = new Set<string>();
        counts.forEach((cnt, name) => { if (cnt > 1) dups.add(name); });
        return dups;
    }, [teamMembers]);

    const totalDuplicatesCount = duplicateEmailsSet.size + duplicateNamesSet.size;

    // Filtered members list
    const filteredMembers = useMemo(() => {
        return teamMembers.filter(member => {
            const memberUnits = Array.isArray(member.units) ? member.units : [member.units || ''];
            const memberSectors = Array.isArray(member.sectors) ? member.sectors : [member.sectors || ''];

            // 1. Filter by Unit
            if (selectedUnitFilter !== 'Todas' && !memberUnits.includes(selectedUnitFilter)) {
                return false;
            }

            // 2. Filter by Sector
            if (selectedSectorFilter !== 'Todos' && !memberSectors.includes(selectedSectorFilter)) {
                return false;
            }

            // 3. Filter Duplicates Only
            const email = (member.email || '').toLowerCase().trim();
            const name = (member.name || '').toLowerCase().trim();
            const isDup = duplicateEmailsSet.has(email) || duplicateNamesSet.has(name);
            if (onlyDuplicatesFilter && !isDup) {
                return false;
            }

            // 4. Search Query (Name, Email, Unit, Sector)
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const nameMatch = member.name?.toLowerCase().includes(q);
                const emailMatch = member.email?.toLowerCase().includes(q);
                const unitMatch = memberUnits.some(u => u.toLowerCase().includes(q));
                const sectorMatch = memberSectors.some(s => s.toLowerCase().includes(q));
                if (!nameMatch && !emailMatch && !unitMatch && !sectorMatch) return false;
            }

            return true;
        });
    }, [teamMembers, selectedUnitFilter, selectedSectorFilter, onlyDuplicatesFilter, searchQuery, duplicateEmailsSet, duplicateNamesSet]);

    // ── Add new member state ──
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
    const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
    const [birthDate, setBirthDate] = useState('');
    const [avatarBase64, setAvatarBase64] = useState<string>('');
    const [newRole, setNewRole] = useState<string>('Membro');

    // ── Manage Units state ──
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [newUnitName, setNewUnitName] = useState('');

    // ── Manage Sectors state ──
    const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
    const [newSectorName, setNewSectorName] = useState('');

    // ── Edit member state ──
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [editName, setEditName] = useState('');
    const [editBirthDate, setEditBirthDate] = useState('');
    const [editUnits, setEditUnits] = useState<string[]>([]);
    const [editSectors, setEditSectors] = useState<string[]>([]);
    const [editAvatar, setEditAvatar] = useState('');
    const [editRole, setEditRole] = useState<string>('Membro');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview imediato na interface
        const reader = new FileReader();
        reader.onloadend = () => setter(reader.result as string);
        reader.readAsDataURL(file);

        // Upload para Supabase Storage
        try {
            const ext = file.name.split('.').pop() || 'jpg';
            const fileName = `avatars/avatar_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('task-attachments')
                .upload(fileName, file, { upsert: true });

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('task-attachments')
                    .getPublicUrl(fileName);
                setter(publicUrl);
            }
        } catch (err) {
            console.error("Erro ao subir avatar para storage:", err);
        }
    };

    // ── Add handlers ──
    const handleAdd = async () => {
        if (newName.trim()) {
            await addTeamMember(newName, avatarBase64, newEmail, selectedUnits, selectedSectors, newRole, newPassword, birthDate);
            alert('Membro registrado na lista da Equipe!');
            setNewName(''); setNewEmail(''); setNewPassword('');
            setSelectedUnits([]); setSelectedSectors([]);
            setBirthDate(''); setAvatarBase64(''); setNewRole('Membro');
            setIsAdding(false);
        }
    };

    const toggleUnit = (unit: string) =>
        setSelectedUnits(prev => prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit]);

    const toggleSector = (sector: string) =>
        setSelectedSectors(prev => prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]);

    const handleAddUnit = async () => {
        if (newUnitName.trim()) {
            await addUnit(newUnitName.trim());
            setNewUnitName('');
        }
    };

    const handleDeleteUnit = async (unit: string) => {
        if (confirm(`Tem certeza que deseja excluir a unidade ${unit}?`)) {
            await deleteUnit(unit);
        }
    };

    const handleAddSector = async () => {
        if (newSectorName.trim()) {
            await addSector(newSectorName.trim());
            setNewSectorName('');
        }
    };

    const handleDeleteSector = async (sector: string) => {
        if (confirm(`Tem certeza que deseja excluir o setor ${sector}?`)) {
            await deleteSector(sector);
        }
    };

    // ── Edit handlers ──
    const openEdit = (member: TeamMember) => {
        setEditingMember(member);
        setEditName(member.name || '');
        setEditBirthDate(member.birth_date || '');
        setEditUnits(member.units || []);
        setEditSectors(member.sectors || []);
        setEditAvatar(member.avatar_url || '');
        setEditRole(member.role || 'Membro');
        setIsAdding(false);
    };

    const closeEdit = () => setEditingMember(null);

    const handleSaveEdit = async () => {
        if (!editingMember) return;
        await updateTeamMember(editingMember.id, {
            name: editName,
            birth_date: editBirthDate,
            units: editUnits,
            sectors: editSectors,
            role: editRole,
            ...(editAvatar !== editingMember.avatar_url ? { avatar_url: editAvatar } : {})
        });
        closeEdit();
    };

    const toggleEditUnit = (unit: string) =>
        setEditUnits(prev => prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit]);

    const toggleEditSector = (sector: string) =>
        setEditSectors(prev => prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]);

    return (
        <div className="w-full flex flex-col h-full gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Equipe</h2>
                        <span className="bg-primary-50 text-primary-700 border border-primary-200/60 px-3 py-1 rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                            {teamMembers.length} {teamMembers.length === 1 ? 'membro cadastrado' : 'membros cadastrados'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Gerencie os membros da equipe e os responsáveis pelas tarefas</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    {isMaster && (
                        <>
                            <button
                                onClick={() => { setIsUnitModalOpen(!isUnitModalOpen); setIsSectorModalOpen(false); setIsAdding(false); closeEdit(); }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all text-sm ${isUnitModalOpen ? 'bg-primary-100 text-primary-700 font-bold' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                Gerenciar Unidades
                            </button>
                            <button
                                onClick={() => { setIsSectorModalOpen(!isSectorModalOpen); setIsUnitModalOpen(false); setIsAdding(false); closeEdit(); }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all text-sm ${isSectorModalOpen ? 'bg-primary-100 text-primary-700 font-bold' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                Gerenciar Setores
                            </button>
                            <button
                                onClick={() => { setIsAdding(true); setIsUnitModalOpen(false); setIsSectorModalOpen(false); closeEdit(); }}
                                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all text-sm"
                            >
                                <Plus size={18} /> Novo Membro
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, e-mail, unidade ou setor..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    {/* Unit Filter */}
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs text-gray-700">
                        <Filter size={14} className="text-gray-400" />
                        <span className="font-semibold text-gray-500 hidden sm:inline">Unidade:</span>
                        <select
                            value={selectedUnitFilter}
                            onChange={e => setSelectedUnitFilter(e.target.value)}
                            className="bg-transparent font-medium focus:outline-none cursor-pointer"
                        >
                            <option value="Todas">Todas as Unidades ({UNIDADES.length})</option>
                            <option value="Corporativo">Corporativo</option>
                            {UNIDADES.filter(u => u !== 'Corporativo').map(u => (
                                <option key={u} value={u}>{u}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sector Filter */}
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs text-gray-700">
                        <span className="font-semibold text-gray-500 hidden sm:inline">Setor:</span>
                        <select
                            value={selectedSectorFilter}
                            onChange={e => setSelectedSectorFilter(e.target.value)}
                            className="bg-transparent font-medium focus:outline-none cursor-pointer"
                        >
                            <option value="Todos">Todos os Setores</option>
                            {ALL_SECTORS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Duplicates Toggle Button */}
                    {totalDuplicatesCount > 0 && (
                        <button
                            onClick={() => setOnlyDuplicatesFilter(!onlyDuplicatesFilter)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${onlyDuplicatesFilter ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'}`}
                            title="Filtrar contatos duplicados"
                        >
                            <AlertTriangle size={14} />
                            <span>{onlyDuplicatesFilter ? 'Exibindo Duplicados' : `Duplicados (${totalDuplicatesCount})`}</span>
                        </button>
                    )}

                    {/* Counter of filtered results */}
                    <div className="bg-primary-50 text-primary-700 border border-primary-100 px-3 py-2 rounded-xl text-xs font-bold shadow-xs whitespace-nowrap">
                        {filteredMembers.length} {filteredMembers.length === 1 ? 'membro' : 'membros'}
                    </div>
                </div>
            </div>

            {/* Manage Units */}
            {isUnitModalOpen && isMaster && (
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm animate-in fade-in slide-in-from-top-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Gerenciar Unidades</h3>
                        <button onClick={() => setIsUnitModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"><X size={20} /></button>
                    </div>
                    
                    <div className="flex gap-2">
                        <input type="text" placeholder="Nome da nova unidade" value={newUnitName} onChange={e => setNewUnitName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddUnit()}
                            className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                        <button onClick={handleAddUnit} className="bg-gray-800 text-white px-6 py-2.5 rounded-xl hover:bg-gray-700 transition-colors shadow-sm whitespace-nowrap">
                            Adicionar Unidade
                        </button>
                    </div>

                    <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
                        <div className="max-h-60 overflow-y-auto no-scrollbar">
                            {UNIDADES.map(unit => (
                                <div key={unit} className="flex justify-between items-center px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                                    <span className="font-medium text-gray-700">{unit}</span>
                                    {unit !== 'Corporativo' && (
                                        <button onClick={() => handleDeleteUnit(unit)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Excluir unidade">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Manage Sectors */}
            {isSectorModalOpen && isMaster && (
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm animate-in fade-in slide-in-from-top-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Gerenciar Setores</h3>
                        <button onClick={() => setIsSectorModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"><X size={20} /></button>
                    </div>
                    
                    <div className="flex gap-2">
                        <input type="text" placeholder="Nome do novo setor (ex: DP, Jurídico...)" value={newSectorName} onChange={e => setNewSectorName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddSector()}
                            className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                        <button onClick={handleAddSector} className="bg-primary-600 text-white px-6 py-2.5 rounded-xl hover:bg-primary-700 transition-colors shadow-sm whitespace-nowrap font-medium">
                            Adicionar Setor
                        </button>
                    </div>

                    <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
                        <div className="max-h-60 overflow-y-auto pretty-scrollbar-y">
                            {SETORES.map(sector => (
                                <div key={sector} className="flex justify-between items-center px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                                    <span className="font-medium text-gray-700">{sector}</span>
                                    {sector !== 'Geral' && (
                                        <button onClick={() => handleDeleteSector(sector)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Excluir setor">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Add new member form */}
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
                                <input type="file" accept="image/*" onChange={e => handleFileChange(e, setAvatarBase64)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            <span className="text-xs text-gray-500">Adicionar Foto</span>
                        </div>
                        <div className="flex-1 w-full space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nome Completo</label>
                                    <input type="text" placeholder="Ex: João Silva" value={newName} onChange={e => setNewName(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">E-mail de Login</label>
                                    <input type="email" placeholder="joao@empresa.com" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Unidades (Selecione várias)</label>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-40 overflow-y-auto no-scrollbar grid grid-cols-1 gap-2 pretty-scrollbar-y">
                                        {UNIDADES.map(u => (
                                             <label key={u} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded-lg transition-colors">
                                                 <input type="checkbox" checked={selectedUnits.includes(u)} onChange={() => toggleUnit(u)}
                                                     className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                                 <span className="text-sm text-gray-700">{u}</span>
                                             </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Setores (Selecione vários)</label>
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const name = prompt('Nome do novo setor:');
                                                if (name && name.trim()) {
                                                    await addSector(name.trim());
                                                    toggleSector(name.trim());
                                                }
                                            }}
                                            className="text-[11px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 hover:underline"
                                        >
                                            <Plus size={13} /> Novo Setor
                                        </button>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-40 overflow-y-auto no-scrollbar grid grid-cols-1 gap-2 pretty-scrollbar-y">
                                        {SETORES.map(s => (
                                            <label key={s} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded-lg transition-colors">
                                                <input type="checkbox" checked={selectedSectors.includes(s)} onChange={() => toggleSector(s)}
                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                                <span className="text-sm text-gray-700">{s}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Papel</label>
                                    <select value={newRole} onChange={e => setNewRole(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                                        <option value="Membro">Membro Normal</option>
                                        <option value="Líder">Líder de Setor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Senha Provisória</label>
                                    <input type="password" placeholder="Mínimo 6 caracteres" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Data de Nascimento</label>
                                    <input type="text" placeholder="DD/MM/AAAA" value={birthDate} onChange={e => setBirthDate(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={handleAdd} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all">
                                    <Plus size={18} /> Confirmar Cadastro
                                </button>
                                <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-gray-700 px-4">Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit member modal/drawer */}
            {editingMember && (
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm animate-in fade-in slide-in-from-top-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">
                            Editar Membro: <span className="text-primary-600 font-bold">{editingMember.name}</span>
                        </h3>
                        <button onClick={closeEdit} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"><X size={20} /></button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {/* Avatar */}
                        <div className="flex flex-col items-center gap-2 shrink-0">
                            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md relative group cursor-pointer">
                                {editAvatar ? (
                                    <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold text-primary-600">{editName.charAt(0).toUpperCase()}</span>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={22} className="text-white" />
                                </div>
                                <input type="file" accept="image/*" onChange={e => handleFileChange(e, setEditAvatar)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            <span className="text-xs text-gray-400">Trocar foto</span>
                        </div>

                        <div className="flex-1 w-full space-y-4">
                            {/* Name, Role & Birth Date */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nome Completo</label>
                                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Papel</label>
                                        <select value={editRole} onChange={e => setEditRole(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                                            <option value="Membro">Membro Normal</option>
                                            <option value="Líder">Líder de Setor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Data de Nascimento</label>
                                        <input type="text" placeholder="DD/MM/AAAA" value={editBirthDate} onChange={e => setEditBirthDate(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                                    </div>
                                </div>
                            </div>

                            {/* Units & Sectors */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Unidades</label>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-44 overflow-y-auto pretty-scrollbar-y space-y-1">
                                        {UNIDADES.map(u => (
                                            <label key={u} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded-lg transition-colors">
                                                <input type="checkbox" checked={editUnits.includes(u)} onChange={() => toggleEditUnit(u)}
                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                                <span className="text-sm text-gray-700">{u}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Setores</label>
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const name = prompt('Nome do novo setor:');
                                                if (name && name.trim()) {
                                                    await addSector(name.trim());
                                                    toggleEditSector(name.trim());
                                                }
                                            }}
                                            className="text-[11px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 hover:underline"
                                        >
                                            <Plus size={13} /> Novo Setor
                                        </button>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-44 overflow-y-auto pretty-scrollbar-y space-y-1">
                                        {SETORES.map(s => (
                                            <label key={s} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded-lg transition-colors">
                                                <input type="checkbox" checked={editSectors.includes(s)} onChange={() => toggleEditSector(s)}
                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                                <span className="text-sm text-gray-700">{s}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                                <button onClick={handleSaveEdit} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all">
                                    <Save size={16} /> Salvar Alterações
                                </button>
                                <button onClick={closeEdit} className="text-gray-500 px-4 hover:text-gray-800 transition-colors">Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Member cards grid */}
            {filteredMembers.length === 0 ? (
                <div className="bg-white/60 backdrop-blur-sm p-12 rounded-2xl border border-white/50 text-center flex flex-col items-center justify-center gap-3">
                    <Users size={48} className="text-gray-300" />
                    <p className="text-gray-500 font-medium text-sm">Nenhum membro encontrado com os filtros selecionados.</p>
                    {(searchQuery || selectedUnitFilter !== 'Todas' || selectedSectorFilter !== 'Todos' || onlyDuplicatesFilter) && (
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedUnitFilter('Todas'); setSelectedSectorFilter('Todos'); setOnlyDuplicatesFilter(false); }}
                            className="text-xs text-primary-600 font-bold hover:underline mt-1"
                        >
                            Limpar Filtros
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto no-scrollbar pb-8">
                    {filteredMembers.map(member => {
                        const email = (member.email || '').toLowerCase().trim();
                        const name = (member.name || '').toLowerCase().trim();
                        const isDup = (email && duplicateEmailsSet.has(email)) || (name && duplicateNamesSet.has(name));

                        return (
                            <div key={member.id} className={`bg-white/60 backdrop-blur-sm p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group relative flex flex-col items-center text-center ${isDup ? 'border-red-300 ring-2 ring-red-400/30' : 'border-white/50'}`}>
                                {/* Duplicate Badge */}
                                {isDup && (
                                    <div className="absolute top-4 left-4 bg-red-100 text-red-700 border border-red-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs" title="Este contato possui e-mail ou nome duplicado no sistema">
                                        <AlertTriangle size={11} /> Duplicado
                                    </div>
                                )}

                                {/* Edit & Delete buttons — top right */}
                                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {isMaster && (
                                        <button
                                            onClick={() => openEdit(member)}
                                            className="p-2 text-primary-500 bg-primary-50 hover:bg-primary-100 rounded-full transition-colors shadow-sm"
                                            title="Editar membro"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                    )}
                                    {isMaster && (
                                        <button
                                            onClick={() => { if (window.confirm('Tem certeza que deseja remover este membro da equipe?')) deleteTeamMember(member.id.toString()); }}
                                            className="p-2 text-red-400 bg-red-50 hover:bg-red-100 rounded-full transition-colors shadow-sm"
                                            title="Remover membro"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>

                                {/* Avatar with hover to change photo */}
                                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center font-bold text-2xl text-primary-700 mb-4 border-4 border-white shadow-sm overflow-hidden relative group/avatar">
                                    {member.avatar_url ? (
                                        <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        member.name.charAt(0).toUpperCase()
                                    )}
                                    {(user?.email === member.email || isMaster) && (
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
                                <p className="text-xs font-bold text-primary-600 mt-1">{member.role === 'Líder' ? 'Líder de Setor' : (member.email === 'institutohomem@gmail.com' ? 'Administrador' : 'Membro da Equipe')}</p>

                                <div className="flex flex-wrap justify-center gap-1 mt-2">
                                    {member.units?.map(u => (
                                        <span key={u} className="text-[9px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">{u}</span>
                                    ))}
                                    {member.sectors?.map(s => (
                                        <span key={s} className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{s}</span>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">{member.email}</p>
                                {member.birth_date && <p className="text-[9px] text-gray-300 mt-0.5">🎂 {member.birth_date}</p>}

                                {member.email && user?.email !== member.email && (
                                    <button
                                        onClick={() => startPrivateChat(member.email!)}
                                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all text-xs font-bold border border-primary-100"
                                    >
                                        <MessageSquare size={14} /> Iniciar Chat
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
