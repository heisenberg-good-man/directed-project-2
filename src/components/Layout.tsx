import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Truck, LayoutDashboard, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useFreightStore } from '@/store/useFreightStore';

const navItems = [
  { to: '/', label: '首页', icon: Home },
  { to: '/freight', label: '货运管理', icon: Truck }
];

export default function Layout() {
  const location = useLocation();
  const init = useFreightStore(s => s.init);

  useEffect(() => {
    init();
  }, [init]);

  const getPageTitle = () => {
    if (location.pathname === '/') return '数据概览';
    if (location.pathname.startsWith('/freight')) return '货运管理';
    return '';
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-60 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Package size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wide">智运物流</h1>
            <p className="text-[11px] text-slate-400">Freight Management</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                )
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-[11px] text-slate-500">© 2026 智运物流系统</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={20} className="text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
              调
            </div>
            <span className="text-sm text-slate-700">调度员</span>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
