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

const NovaTarefaButton = () => {
  const { openModal } = useTasks();
  return (
    <button
      onClick={() => openModal()}
      className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-primary-600/20 transition-all active:scale-95"
    >
      + Nova Tarefa
    </button>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-primary-600 font-medium tracking-wider">Acessando sistema...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 font-sans overflow-hidden w-full">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 border-b border-gray-200/50 bg-white/40 backdrop-blur-sm flex items-center px-8 justify-between z-10 shrink-0">
          <h1 className="text-2xl font-semibold text-gray-800">
            {location.pathname === '/kanban' ? 'Quadro Kanban' :
              location.pathname === '/companies' ? 'Gestão de Empresas' :
                location.pathname === '/team' ? 'Nossa Equipe' : 'Visão Geral'}
          </h1>
          <NovaTarefaButton />
        </header>

        <div className="flex-1 overflow-auto p-8 relative z-0">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <TasksProvider>
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
      </TasksProvider>
    </AuthProvider>
  );
}

export default App;
