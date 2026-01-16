
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FlaskConical, 
  ClipboardCheck, 
  Bell, 
  UserCircle,
  ChevronLeft,
  ChevronRight,
  PiggyBank
} from 'lucide-react';
import Dashboard from './views/Dashboard';
import Academy from './views/Academy';
import OptionsLab from './views/OptionsLab';
import Assignments from './views/Assignments';
import RetirementCalculator from './views/RetirementCalculator';
import FloatingAI from './components/FloatingAI';

const TIAN_AVATAR = "https://yt3.googleusercontent.com/nDtRiMCLFt8YctXzJVUr2ZJ0d43GW_x9CRScw1C_pVqFkxh1fxu0dXqy7kk6ws-0jtmgChQLsw=s900-c-k-c0x00ffffff-no-rj";

const SidebarLink: React.FC<{ to: string, icon: React.ReactNode, label: string, active: boolean, collapsed: boolean }> = ({ to, icon, label, active, collapsed }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-emerald-500/10 text-emerald-400 border-r-4 border-emerald-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' 
        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
    } ${collapsed ? 'justify-center space-x-0' : ''}`}
  >
    <div className={`${active ? 'scale-110' : ''} transition-transform`}>
      {icon}
    </div>
    {!collapsed && <span className="font-bold text-sm tracking-tight">{label}</span>}
  </Link>
);

const MobileNavLink: React.FC<{ to: string, icon: React.ReactNode, label: string, active: boolean }> = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
      active ? 'text-emerald-400' : 'text-slate-500'
    }`}
  >
    <div className={`${active ? 'scale-110' : 'scale-100'} transition-transform mb-1`}>
      {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
    </div>
    <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
  </Link>
);

const Navbar = () => (
  <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-white text-[10px]">T</div>
        <span className="text-sm font-black tracking-tighter bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent uppercase">
          Tian Academy
        </span>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="hidden md:block px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[9px] text-slate-500 font-black uppercase tracking-widest">
        MVP Terminal v1.0
      </div>
      <button className="relative p-2 text-slate-500 hover:text-white transition-colors">
        <Bell size={18} />
        <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
      </button>
      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-all overflow-hidden">
         <img src={TIAN_AVATAR} alt="Tian" className="w-full h-full object-cover" />
      </div>
    </div>
  </header>
);

const MobileNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 px-2 py-1 pb-safe flex items-center justify-around z-50">
      <MobileNavLink to="/" icon={<LayoutDashboard />} label="儀表板" active={currentPath === '/'} />
      <MobileNavLink to="/academy" icon={<BookOpen />} label="學院" active={currentPath.startsWith('/academy')} />
      <MobileNavLink to="/lab" icon={<FlaskConical />} label="實驗室" active={currentPath === '/lab'} />
      <MobileNavLink to="/calculator" icon={<PiggyBank />} label="計算機" active={currentPath === '/calculator'} />
      <MobileNavLink to="/assignments" icon={<ClipboardCheck />} label="作業" active={currentPath === '/assignments'} />
    </nav>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse sidebar when viewing a lesson
  useEffect(() => {
    const isLessonDetail = currentPath.includes('/academy/lesson/');
    if (isLessonDetail && !isCollapsed) {
      setIsCollapsed(true);
    }
  }, [currentPath]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col h-screen border-r border-slate-800 bg-slate-950 sticky top-0 transition-all duration-500 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 z-40`}>
        <div className="p-4 h-full flex flex-col">
          <div className="mt-8 space-y-1">
            <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="首頁儀表板" active={currentPath === '/'} collapsed={isCollapsed} />
            <SidebarLink to="/academy" icon={<BookOpen size={20} />} label="複利學院" active={currentPath.startsWith('/academy')} collapsed={isCollapsed} />
            <SidebarLink to="/lab" icon={<FlaskConical size={20} />} label="策略實驗室" active={currentPath === '/lab'} collapsed={isCollapsed} />
            <SidebarLink to="/calculator" icon={<PiggyBank size={20} />} label="退休計算機" active={currentPath === '/calculator'} collapsed={isCollapsed} />
            <SidebarLink to="/assignments" icon={<ClipboardCheck size={20} />} label="實戰與作業" active={currentPath === '/assignments'} collapsed={isCollapsed} />
          </div>
          
          <div className="mt-auto space-y-4">
            {!isCollapsed && (
              <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-[0.2em] font-black mb-1">教育模式</p>
                <p className="text-[10px] text-slate-600 font-medium">非即時報價，僅供模擬教學使用。請遵守天哥複利心法。</p>
              </div>
            )}
            
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center p-3 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-500 hover:text-white hover:border-slate-600 transition-all group"
            >
              {isCollapsed ? <ChevronRight size={18} className="group-hover:scale-110" /> : <ChevronLeft size={18} className="group-hover:scale-110" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-12 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent)]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/academy/*" element={<Academy />} />
            <Route path="/lab" element={<OptionsLab />} />
            <Route path="/calculator" element={<RetirementCalculator />} />
            <Route path="/assignments" element={<Assignments />} />
          </Routes>
        </main>
        <FloatingAI />
        <MobileNav />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <MainLayout />
    </HashRouter>
  );
};

export default App;
