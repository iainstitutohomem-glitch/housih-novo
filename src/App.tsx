import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { Login } from './components/Login';
import { CompanyManager } from './components/CompanyManager';
import { MetricsDashboard } from './components/MetricsDashboard';
import { useTasks, TasksProvider } from './context/TasksContext';
import { TaskModal } from './components/TaskModal';
import { TeamManager } from './components/TeamManager';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationBell } from './components/NotificationBell';
import { Plus, Menu } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { ChatDrawer } from './components/Chat/ChatDrawer';
import { ChatProvider } from './context/ChatContext';
import { AIChatDrawer } from './components/AIChatDrawer';
import { Sparkles, Eye, Share2, X, Check, Copy } from 'lucide-react';
import { SharedReportPage } from './components/SharedReportPage';

const NovaTarefaButton = () => {
  const { openModal } = useTasks();
  return (
    <button
      onClick={() => openModal()}
      className="bg-primary-600 hover:bg-primary-700 text-white p-2.5 sm:px-5 sm:py-2.5 rounded-xl font-medium shadow-sm shadow-primary-600/20 transition-all active:scale-95 flex items-center gap-2"
    >
      <Plus size={20} />
      <span className="hidden sm:inline">Nova Tarefa</span>
    </button>
  );
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-primary-600 font-medium tracking-wider">Acessando sistema...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { createSharedReport, filteredTasks } = useTasks();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('Relatório de Performance');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCreateReport = async () => {
      setIsGenerating(true);
      const reportId = await createSharedReport(reportTitle, filteredTasks, {});
      if (reportId) {
          setGeneratedLink(`${window.location.origin}/shared/${reportId}`);
      }
      setIsGenerating(false);
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  const getTitle = () => {
    switch (location.pathname) {
      case '/kanban': return 'Quadro Kanban';
      case '/companies': return 'Gestão de Empresas';
      case '/team': return 'Nossa Equipe';
      default: return 'Visão Geral';
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 font-sans overflow-hidden w-full">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 lg:h-20 border-b border-gray-200/50 bg-white/40 backdrop-blur-sm flex items-center px-4 lg:px-8 justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl lg:text-2xl font-semibold text-gray-800 truncate">
              {getTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {location.pathname === '/dashboard' && (
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:border-primary-500 hover:text-primary-600 transition-all active:scale-95"
              >
                <Eye size={16} /> Visualizar
              </button>
            )}
            <button 
              onClick={() => setIsAIOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-all active:scale-95"
            >
              <Sparkles size={16} />
              <span className="hidden md:inline text-[10px] uppercase tracking-wider">IA Assistente</span>
            </button>
            <NotificationBell />
            <NovaTarefaButton />
          </div>
        </header>

        <div className={`flex-1 flex flex-col relative z-0 no-scrollbar ${location.pathname === '/kanban' ? 'overflow-hidden' : 'overflow-y-auto p-4 lg:p-8 pb-12'}`}>
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
          {children}
        </div>
        <ChatDrawer />
        <AIChatDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

        {/* Share Modal */}
        {isShareModalOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <Share2 className="text-primary-600" size={24} /> Criar Relatório
                        </h3>
                        <button onClick={() => { setIsShareModalOpen(false); setGeneratedLink(''); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>
                    
                    <div className="p-8 space-y-6">
                        {!generatedLink ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Título do Relatório</label>
                                    <input 
                                        type="text" 
                                        value={reportTitle}
                                        onChange={(e) => setReportTitle(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                        placeholder="Ex: Entrega Março - Cliente X"
                                    />
                                </div>
                                <button 
                                    onClick={handleCreateReport}
                                    disabled={isGenerating}
                                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary-600/20 transition-all flex items-center justify-center gap-3"
                                >
                                    {isGenerating ? 'Gerando Link...' : 'GERAR RELATÓRIO AGORA'}
                                </button>
                            </>
                        ) : (
                            <div className="space-y-4 animate-in slide-in-from-bottom-4">
                                <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
                                    <Check className="text-green-500" size={24} />
                                    <p className="text-xs font-bold text-green-700">Relatório Estático gerado com sucesso!</p>
                                </div>
                                <div className="relative group">
                                    <input 
                                        readOnly 
                                        value={generatedLink}
                                        className="w-full bg-gray-50 border border-gray-200 py-4 px-4 rounded-xl text-xs font-medium text-gray-500 overflow-hidden pr-24"
                                    />
                                    <button 
                                        onClick={copyToClipboard}
                                        className="absolute right-2 top-2 bottom-2 px-4 bg-white border border-gray-200 rounded-lg text-xs font-black text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                    >
                                        {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                        {isCopied ? 'Copiado' : 'Copiar'}
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 text-center italic">Este link é público e não expira. Compartilhe com cuidado.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <ChatProvider>
          <TaskModal />
          <BrowserRouter>
            <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 font-sans overflow-hidden">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/shared/:id" element={<SharedReportPage />} />
                <Route path="*" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<MetricsDashboard />} />
                        <Route path="/kanban" element={<KanbanBoard />} />
                        <Route path="/companies" element={<CompanyManager />} />
                        <Route path="/team" element={<TeamManager />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </BrowserRouter>
        </ChatProvider>
      </TasksProvider>
    </AuthProvider>
  );
}

export default App;
