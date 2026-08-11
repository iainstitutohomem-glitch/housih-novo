import { useState, useRef } from 'react';
import { useTasks, DEFAULT_UNIDADES } from '../context/TasksContext';
import { useAuth } from '../context/AuthContext';
import { 
    Send, Trash2, Heart, MessageSquare, 
    Shield, Check, Image as ImageIcon, X, Loader2,
    Smile, Building2
} from 'lucide-react';

const CATEGORIES = ['Geral', 'Aviso', 'Comemoração', 'Dúvida', 'Sucesso'];

const EMOJI_LIST = {
    'Rostos': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠'],
    'Gestos': ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍', '💅', '🤳', '💪', '🦾', '🦵', '🦿', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁', '👅', '👄'],
    'Negócios': ['🚀', '📈', '📉', '📊', '📋', '📁', '📂', '📅', '📆', '📌', '📍', '📎', '📎', '📏', '📐', '✂', '🔒', '🔓', '🔏', '🔑', '🗝', '🔨', '🛠', '⛏', '🔩', '⚙', '🧱', '⛓', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡', '⚔', '🛡'],
    'Símbolos': ['✅', '❌', '⚠️', '💡', '✨', '🔥', '⭐', '🌟', '💥', '💯', '💢', '💬', '💭', '🔔', '🔕', '📢', '📣', '🟢', '🟡', '🔴', '⭐', '🔷', '🔶', '💠', '🌀', '💤'],
    'Objetos': ['🎁', '🎂', '🎈', '🎉', '🎊', '🎀', '🪄', '📢', '📣', '📯', '🎙', '📻', '🎷', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '🪗', '📱', '📲', '☎', '📞', '📠', '🔋', '🔌', '💻', '🖥', '🖨', '⌨', '🖱', '🖲', '💽', '💾', '💿', '📀', '🎥', '🎞', '📽', '🎬', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯', '💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞', '📑', '🔖', '🏷', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹', '✉', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳', '✏', '✒', '🖋', '🖊', '🖌', '🖍', '📝', '💼', '📁', '📂', '🗂', '📅', '📆', '🗒', '🗓', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇', '📏', '📐', '✂', '🗃', '🗄', '🗑', '🔒', '🔓', '🔏', '🔑', '🗝', '🔨', '🪓', '⛏', '⚒', '🛠', '🗡', '⚔', '🔫', '🪃', '🏹', '🛡', '🪚', '🔧', '🪛', '🔩', '⚙', '🗜', '⚖', '🦯', '🔗', '⛓', '🪝', ' Toolbox', '🧲', 'ladder', '⚗', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩺', '🚪', '🛗', '🪞', '🪟', '🛏', '🛋', '🪑', '🚽', '🛢', '🚿', '🛁', '🪤', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🧼', '🧽', '🧯', '🛒', '🚬', '⚰', '🪦', '⚱', '🧿']
};

export const Timeline = () => {
    const { session } = useAuth();
    const { 
        teamMembers, timelinePosts, addTimelinePost, deleteTimelinePost, 
        uploadTimelineImage, toggleLike, addComment, CORPORATIVO_SECTORS, UNIDADES_SECTORS 
    } = useTasks();
    
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Geral');
    const [visibility, setVisibility] = useState<string[]>(['todos']);
    const [filterCategory, setFilterCategory] = useState('Todas');
    const [isSectorSelectorOpen, setIsSectorSelectorOpen] = useState(false);
    const [isUnitSelectorOpen, setIsUnitSelectorOpen] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiCategory, setEmojiCategory] = useState('Rostos');
    
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    
    const [commentTexts, setCommentTexts] = useState<{[key: string]: string}>({});
    const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const userEmail = session?.user?.email?.toLowerCase();
    const currentUser = (teamMembers || []).find(m => m.email?.toLowerCase() === userEmail);
    const isMaster = userEmail === 'institutohomem@gmail.com';

    const allSectors = Array.from(new Set([
        ...(CORPORATIVO_SECTORS || []), 
        ...(UNIDADES_SECTORS || [])
    ])).sort();

    const allUnits = Array.from(new Set([
        ...(DEFAULT_UNIDADES || [])
    ])).sort();

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handlePost = async () => {
        if (!content.trim() && !selectedImage) return;
        
        setIsUploading(true);
        try {
            let imageUrl = undefined;
            if (selectedImage) {
                imageUrl = await uploadTimelineImage(selectedImage);
            }
            const payload: any = {
                content,
                category,
                visibility,
                is_automated: false
            };
            
            if (imageUrl) {
                payload.image_url = imageUrl;
            }

            await addTimelinePost(payload);
            
            setContent('');
            setVisibility(['todos']);
            setSelectedImage(null);
            setImagePreview(null);
            setIsSectorSelectorOpen(false);
            setShowEmojiPicker(false);
        } catch (error: any) {
            console.error("Erro ao processar postagem:", error);
            alert("ERRO NO UPLOAD: " + (error.message || "Verifique sua conexão."));
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddComment = async (postId: string) => {
        const text = commentTexts[postId];
        if (!text?.trim()) return;
        
        await addComment(postId, text);
        setCommentTexts(prev => ({ ...prev, [postId]: '' }));
    };

    const addEmoji = (emoji: string) => {
        setContent(prev => prev + emoji);
    };

    const toggleSector = (sector: string) => {
        if (sector === 'todos') {
            setVisibility(['todos']);
        } else {
            const current = visibility.filter(v => v !== 'todos');
            const next = current.includes(sector) 
                ? current.filter(v => v !== sector) 
                : [...current, sector];
            setVisibility(next.length === 0 ? ['todos'] : next);
        }
    };

    const filteredPosts = (timelinePosts || []).filter(post => {
        if (!post) return false;
        if (filterCategory !== 'Todas' && post.category !== filterCategory) return false;
        if (isMaster) return true;
        
        let postVisibility: string[] = ['todos'];
        try {
            if (Array.isArray(post.visibility)) {
                postVisibility = post.visibility;
            } else if (typeof post.visibility === 'string') {
                postVisibility = JSON.parse(post.visibility);
            }
        } catch (e) {
            postVisibility = ['todos'];
        }

        if (postVisibility.includes('todos')) return true;
        const userSectors = currentUser?.sectors || [];
        const userUnits = currentUser?.units || [];
        const userPermissions = [...(Array.isArray(userSectors) ? userSectors : []), ...(Array.isArray(userUnits) ? userUnits : [])];
        if (postVisibility.some(v => userPermissions.includes(v))) return true;
        if (currentUser && post.author_id === currentUser.id) return true;
        return false;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="flex flex-col h-full bg-[#f8f9fa] overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0">
                <div className="max-w-4xl mx-auto flex justify-center">
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
                        {['Todas', ...CATEGORIES].map(c => (
                            <button
                                key={c}
                                onClick={() => setFilterCategory(c)}
                                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                    filterCategory === c 
                                    ? 'bg-white text-gray-800 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="max-w-2xl mx-auto space-y-6">
                    
                    {/* Create Post Box */}
                    {(currentUser?.role === 'Líder' || isMaster) && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
                            <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 ring-2 ring-gray-50 shadow-sm">
                                {currentUser?.avatar_url ? (
                                    <img src={currentUser.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">
                                        {currentUser?.name?.charAt(0) || userEmail?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-3">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={`Compartilhe algo com a equipe, ${currentUser?.name?.split(' ')[0] || ''}...`}
                                    className="w-full border-none focus:ring-0 text-gray-700 placeholder-gray-400 text-base min-h-[60px] resize-none py-2"
                                />
                                {imagePreview && (
                                    <div className="relative rounded-xl overflow-hidden border border-gray-200 max-h-80">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-gray-50" />
                                        <button onClick={() => { setSelectedImage(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70">
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg">
                                    <ImageIcon size={18} className="text-green-500" />
                                    <span className="text-xs font-bold">Foto</span>
                                </button>
                                
                                <div className="relative">
                                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                        <Smile size={18} className="text-amber-500" />
                                        <span className="text-xs font-bold">Emoji</span>
                                    </button>
                                    {showEmojiPicker && (
                                        <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 shadow-2xl rounded-2xl p-4 z-[100] w-72 h-80 flex flex-col">
                                            <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                                                {Object.keys(EMOJI_LIST).map(cat => (
                                                    <button 
                                                        key={cat} 
                                                        onClick={() => setEmojiCategory(cat)}
                                                        className={`px-3 py-1 rounded-full text-[10px] font-black whitespace-nowrap transition-all ${emojiCategory === cat ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex-1 overflow-y-auto grid grid-cols-6 gap-2 custom-scrollbar p-1">
                                                {EMOJI_LIST[emojiCategory as keyof typeof EMOJI_LIST].map(e => (
                                                    <button key={e} onClick={() => addEmoji(e)} className="text-xl hover:scale-125 transition-transform p-1 rounded-lg hover:bg-gray-50">{e}</button>
                                                ))}
                                            </div>
                                            <button onClick={() => setShowEmojiPicker(false)} className="mt-2 w-full py-2 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-lg hover:bg-gray-100">FECHAR</button>
                                        </div>
                                    )}
                                </div>

                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold text-gray-600 focus:ring-0">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <div className="relative">
                                    <button onClick={() => setIsUnitSelectorOpen(!isUnitSelectorOpen)} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600">
                                        <Building2 size={14} className="text-blue-500" />
                                        {visibility.includes('todos') ? 'UNIDADES (TODAS)' : `UNIDADES (${visibility.filter(v => allUnits.includes(v)).length})`}
                                    </button>
                                    {isUnitSelectorOpen && (
                                        <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-xl z-50 max-h-60 overflow-y-auto p-2">
                                            <button onClick={() => toggleSector('todos')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between ${visibility.includes('todos') ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}>
                                                TODAS AS UNIDADES E SETORES {visibility.includes('todos') && <Check size={14} />}
                                            </button>
                                            <div className="h-[1px] bg-gray-100 my-1" />
                                            {allUnits.map(u => (
                                                <button key={u} onClick={() => toggleSector(u)} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${visibility.includes(u) ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}>
                                                    {u} {visibility.includes(u) && <Check size={14} />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <button onClick={() => setIsSectorSelectorOpen(!isSectorSelectorOpen)} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600">
                                        <Shield size={14} className="text-primary-500" />
                                        {visibility.includes('todos') ? 'SETORES (TODOS)' : `SETORES (${visibility.filter(v => allSectors.includes(v)).length})`}
                                    </button>
                                    {isSectorSelectorOpen && (
                                        <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-xl z-50 max-h-60 overflow-y-auto p-2">
                                            <button onClick={() => toggleSector('todos')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between ${visibility.includes('todos') ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}>
                                                TODAS AS UNIDADES E SETORES {visibility.includes('todos') && <Check size={14} />}
                                            </button>
                                            <div className="h-[1px] bg-gray-100 my-1" />
                                            {allSectors.map(s => (
                                                <button key={s} onClick={() => toggleSector(s)} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${visibility.includes(s) ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}>
                                                    {s} {visibility.includes(s) && <Check size={14} />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button onClick={handlePost} disabled={isUploading} className="bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white px-8 py-2 rounded-xl text-xs font-black flex items-center gap-2">
                                {isUploading ? <Loader2 size={14} className="animate-spin" /> : 'PUBLICAR'} <Send size={14} />
                            </button>
                        </div>
                    </div>
                    )}

                    {/* Posts List */}
                    <div className="space-y-6">
                        {filteredPosts.map(post => {
                            const author = (teamMembers || []).find(m => m.id === post.author_id);
                            const isBirthday = post.category === 'Comemoração' && post.is_automated;
                            
                            return (
                                <div key={post.id} className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${isBirthday ? 'border-l-4 border-l-amber-400' : ''}`}>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                                    {author?.avatar_url ? (
                                                        <img src={author.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-bold text-gray-300 text-xs uppercase">{author?.name?.charAt(0) || '?'}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-sm">{author?.name || 'Sistema'}</h4>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                                        {new Date(post.created_at).toLocaleDateString()} • <span className="text-primary-600">{post.category}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {(isMaster || post.author_id === currentUser?.id || post.author_id === session?.user?.id) && (
                                                <button onClick={() => deleteTimelinePost(post.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                                            )}
                                        </div>

                                        <div className={`text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-4 ${isBirthday ? 'italic font-medium' : ''}`}>{post.content}</div>
                                        {post.image_url && (
                                            <div className="mt-2 mb-4 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                                <img 
                                                    src={post.image_url} 
                                                    alt="Post" 
                                                    className="w-full h-auto max-h-[500px] object-contain"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                                            <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 transition-colors ${post.user_has_liked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}>
                                                <Heart size={18} fill={post.user_has_liked ? 'currentColor' : 'none'} />
                                                <span className="text-xs font-bold">{post.likes_count || 0} Curtidas</span>
                                            </button>
                                            <button onClick={() => setShowComments(prev => ({...prev, [post.id]: !prev[post.id]}))} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600">
                                                <MessageSquare size={18} />
                                                <span className="text-xs font-bold">{post.comments?.length || 0} Comentários</span>
                                            </button>
                                        </div>

                                        {showComments[post.id] && (
                                            <div className="mt-4 pt-4 border-t border-gray-50 space-y-4">
                                                {(post.comments || []).map((comment: any) => (
                                                    <div key={comment.id} className="flex gap-3 animate-in slide-in-from-top-1 duration-200">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-50 flex-shrink-0">
                                                            <img src={comment.author?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || 'U')}`} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 bg-gray-50 rounded-2xl p-3">
                                                            <div className="text-[11px] font-bold text-gray-800">{comment.author?.name}</div>
                                                            <div className="text-sm text-gray-700">{comment.content}</div>
                                                            <div className="text-[9px] text-gray-400 mt-1 font-bold">{new Date(comment.created_at).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={commentTexts[post.id] || ''}
                                                        onChange={(e) => setCommentTexts(prev => ({...prev, [post.id]: e.target.value}))}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                                        placeholder="Escreva um comentário..."
                                                        className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary-500"
                                                    />
                                                    <button onClick={() => handleAddComment(post.id)} className="text-primary-600 p-2 hover:bg-primary-50 rounded-full transition-all">
                                                        <Send size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
