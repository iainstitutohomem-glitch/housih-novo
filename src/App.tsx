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
import { BoardManager } from './components/BoardManager';
import { CalendarManager } from './components/CalendarManager';
import { Timeline } from './components/Timeline';
import { TicketManager } from './components/TicketManager';
import { Plus, Menu, MessageSquare } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { ChatDrawer } from './components/Chat/ChatDrawer';
import { ChatProvider, useChat } from './context/ChatContext';
import { AIChatDrawer } from './components/AIChatDrawer';
import { Sparkles, Eye, Share2, X, Check, Copy, LogOut } from 'lucide-react';
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
  const { session, signOut } = useAuth();
  const { createSharedReport, filteredTasks, teamMembers } = useTasks();
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
      case '/kanban': return 'Quadro de Tarefas';
      case '/companies': return 'Gestão de Empresas';
      case '/team': return 'Nossa Equipe';
      case '/boards': return 'Config. de Quadros';
      case '/agenda': return 'Agenda';
      case '/timeline': return 'Quadro de Avisos';
      case '/tickets': return 'Central de Chamados';
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
            <div className="hidden lg:flex items-center mr-2">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm hover:scale-110 transition-all cursor-help" title={session?.user?.email}>
                    <img 
                        src={teamMembers.find(m => m.email?.toLowerCase() === session?.user?.email?.toLowerCase())?.avatar_url || session?.user?.user_metadata?.avatar_url || session?.user?.user_metadata?.picture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <NotificationBell />
            <button 
              onClick={signOut}
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Sair do Sistema"
            >
              <LogOut size={20} />
            </button>
            <NovaTarefaButton />
          </div>
        </header>

        <div className={`flex-1 flex flex-col relative z-0 no-scrollbar ${location.pathname === '/kanban' ? 'overflow-hidden' : 'overflow-y-auto p-4 lg:p-8 pb-12'}`}>
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
          {children}
        </div>
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
                        <Route path="/boards" element={<BoardManager />} />
                        <Route path="/agenda" element={<CalendarManager />} />
                        <Route path="/timeline" element={<Timeline />} />
                        <Route path="/tickets" element={<TicketManager />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
            <ChatDrawerPortal />
          </BrowserRouter>
        </ChatProvider>
      </TasksProvider>
    </AuthProvider>
  );
}

import React, { Component } from 'react';
import type { ErrorInfo } from 'react';

class ChatErrorBoundary extends Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ChatDrawer Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-4 right-4 w-96 p-6 bg-red-50 border-2 border-red-500 rounded-xl z-[10000] shadow-2xl">
          <h2 className="text-red-700 font-black mb-2">Erro Fatal no Chat!</h2>
          <p className="text-xs text-red-600 mb-4">{this.state.error?.toString()}</p>
          <pre className="text-[9px] bg-red-100 p-2 rounded overflow-auto max-h-48 text-red-800">
            {this.state.error?.stack}
          </pre>
          <button onClick={() => this.setState({hasError: false})} className="mt-4 w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700">Tentar Novamente</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ChatDrawerPortal = () => {
  const { isChatOpen, setIsChatOpen, totalUnreadCount } = useChat();
  const { session } = useAuth();
  if (!session) return null;

  return (
    <ChatErrorBoundary>
      {isChatOpen && <ChatDrawer />}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary-700 hover:scale-110 transition-all duration-300 z-[9999] group active:scale-95 border-4 border-white"
          title="Abrir Chat"
        >
          <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
          {totalUnreadCount > 0 ? (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-sm">
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </div>
          ) : (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </button>
      )}
    </ChatErrorBoundary>
  );
};

export default App;
