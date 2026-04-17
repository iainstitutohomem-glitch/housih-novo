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
import { Sparkles } from 'lucide-react';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

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

        <div className="flex-1 flex flex-col overflow-hidden relative z-0">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
          {children}
        </div>
        <ChatDrawer />
        <AIChatDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
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
