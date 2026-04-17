import React, { useState } from 'react';
import { Building2, Plus, Trash2, Edit, Camera, Globe, Lock, Key } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import type { Company } from '../context/TasksContext';

const PRESET_COLORS = [
    '#2563eb', // Blue
    '#ec4899', // Pink
    '#f59e0b', // Orange
    '#9333ea', // Purple
    '#16a34a', // Green
    '#38bdf8', // Light Blue
    '#dc2626', // Red
    '#4b5563', // Gray
    '#6366f1'  // Indigo
];

export const CompanyManager = () => {
    const { companies, addCompany, updateCompany, deleteCompany } = useTasks();

    const [isAdding, setIsAdding] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);

    const [formName, setFormName] = useState('');
    const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
    const [formLogo, setFormLogo] = useState('');
    const [formSite, setFormSite] = useState('');
    const [formSocial, setFormSocial] = useState('');
    const [formPasswords, setFormPasswords] = useState<{ id: number, service: string, login: string, pass: string }[]>([]);

    const openForm = (company?: Company) => {
        if (company) {
            setEditingCompany(company);
            setFormName(company.name || '');
            setFormColor(company.color || PRESET_COLORS[0]);
            setFormLogo(company.logoBase64 || '');
            setFormSite(company.site || '');
            setFormSocial(company.social || '');
            setFormPasswords(company.passwords || []);
        } else {
            setEditingCompany(null);
            setFormName('');
            setFormColor(PRESET_COLORS[0]);
            setFormLogo('');
            setFormSite('');
            setFormSocial('');
            setFormPasswords([]);
        }
        setIsAdding(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormLogo(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!formName.trim()) return;
        const payload = {
            name: formName,
            color: formColor,
            logoBase64: formLogo,
            site: formSite,
            social: formSocial,
            passwords: formPasswords
        };

        if (editingCompany) {
            await updateCompany(editingCompany.id, payload);
        } else {
            await addCompany(payload);
        }
        setIsAdding(false);
    };

    return (
        <div className="w-full flex flex-col h-full gap-6">
            <div className="flex justify-between items-center bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Empresas e Clientes</h2>
                    <p className="text-sm text-gray-500 mt-1">Gerencie os clientes vinculados às tarefas, cores, logins e senhas.</p>
                </div>
                <button
                    onClick={() => openForm()}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all"
                >
                    <Plus size={18} /> Nova Empresa
                </button>
            </div>

            {isAdding && (
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-white/40 shadow-xl animate-in fade-in slide-in-from-top-4 space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-4">{editingCompany ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}</h3>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Logo Upload */}
                        <div className="flex flex-col items-center gap-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Logo</label>
                            <div
                                className="w-32 h-32 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 relative group cursor-pointer shadow-sm transition-all"
                                style={{ borderColor: formColor }}
                            >
                                {formLogo ? (
                                    <img src={formLogo} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera size={32} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-medium">Trocar Info</span>
                                </div>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        {/* Basic Data */}
                        <div className="flex-1 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nome da empresa</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Instituto Vida..."
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"><Globe size={14} className="inline mr-1" /> Site / Domínio</label>
                                    <input
                                        type="text"
                                        placeholder="www.empresa.com.br"
                                        value={formSite}
                                        onChange={e => setFormSite(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">@ Redes Sociais</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: @empresa"
                                        value={formSocial}
                                        onChange={e => setFormSocial(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="pt-4 border-t border-gray-100">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cor de Identificação (Kanban & Tags)</label>
                        <div className="flex gap-3 flex-wrap">
                            {PRESET_COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setFormColor(c)}
                                    className={`w-10 h-10 rounded-full border-2 transition-transform shadow-sm ${formColor === c ? 'border-gray-800 scale-125 z-10' : 'border-transparent hover:scale-110'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Passwords vault */}
                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <Lock size={16} /> Cofre de Senhas e Acessos
                            </label>
                            <button
                                onClick={() => setFormPasswords([...formPasswords, { id: Date.now(), service: '', login: '', pass: '' }])}
                                className="text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg"
                            >
                                + Adicionar Acesso
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formPasswords.map((pwd, idx) => (
                                <div key={pwd.id} className="flex gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <input type="text" placeholder="Serviço (Ex: HostGator)" value={pwd.service} onChange={(e) => {
                                            const v = [...formPasswords]; v[idx].service = e.target.value; setFormPasswords(v);
                                        }} className="w-full bg-white border border-gray-200 text-sm py-2 px-3 rounded-lg focus:outline-none" />
                                        <input type="text" placeholder="Login / Email" value={pwd.login} onChange={(e) => {
                                            const v = [...formPasswords]; v[idx].login = e.target.value; setFormPasswords(v);
                                        }} className="w-full bg-white border border-gray-200 text-sm py-2 px-3 rounded-lg focus:outline-none" />
                                        <input type="password" placeholder="Senha" value={pwd.pass} onChange={(e) => {
                                            const v = [...formPasswords]; v[idx].pass = e.target.value; setFormPasswords(v);
                                        }} className="w-full bg-white border border-gray-200 text-sm py-2 px-3 rounded-lg focus:outline-none" />
                                    </div>
                                    <button onClick={() => setFormPasswords(formPasswords.filter(p => p.id !== pwd.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {formPasswords.length === 0 && <p className="text-sm text-gray-400 italic py-2">Nenhum acesso cadastrado.</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                        <button onClick={() => setIsAdding(false)} className="text-gray-500 px-5 hover:text-gray-800 font-medium transition-colors">
                            Cancelar
                        </button>
                        <button onClick={handleSave} className="bg-primary-600 text-white px-8 py-2.5 rounded-xl font-medium shadow-sm hover:bg-primary-700 transition-colors active:scale-95">
                            Salvar Dados
                        </button>
                    </div>
                </div>
            )}

            {!isAdding && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-8">
                    {companies.map(company => (
                        <div key={company.id} className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group relative">
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => openForm(company)}
                                    className="p-2 text-primary-500 bg-primary-50 hover:bg-primary-100 rounded-full transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => { if (window.confirm('Tem certeza que deseja excluir esta empresa?')) deleteCompany(company.id.toString()); }}
                                    className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div
                                className="w-16 h-16 rounded-2xl text-white flex items-center justify-center font-bold text-2xl mb-4 border border-white shadow-sm overflow-hidden"
                                style={{ backgroundColor: company.color || '#4b5563' }}
                            >
                                {company.logoBase64 ? (
                                    <img src={company.logoBase64} alt={company.name} className="w-full h-full object-cover" />
                                ) : (
                                    company.name.charAt(0).toUpperCase()
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-1">{company.name}</h3>
                            <div className="flex gap-4 mt-3">
                                {company.site && (
                                    <span className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors cursor-pointer">
                                        <Globe size={14} /> Site Conf.
                                    </span>
                                )}
                                {company.passwords && company.passwords.length > 0 && (
                                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Key size={14} className="text-amber-500" /> {company.passwords.length} Senhas
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {companies.length === 0 && (
                        <div className="col-span-full py-16 text-center">
                            <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-600">Nenhuma empresa encontrada</h3>
                            <p className="text-gray-400 mt-1">Comece clicando em Nova Empresa no topo superior.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
