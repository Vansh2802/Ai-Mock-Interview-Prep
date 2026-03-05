import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, History, LogOut, User, Briefcase, Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'History', icon: History, path: '/history' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#1A1A1A] flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#141414] border-r border-black/5 dark:border-white/5 flex flex-col transition-colors duration-300">
        <div className="p-6 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2 text-[#5A5A40] dark:text-[#A8A880]">
            <Briefcase className="w-6 h-6" />
            <span className="font-serif text-xl font-bold">InterviewPro</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                location.pathname === item.path
                  ? "bg-[#5A5A40] text-white dark:bg-[#A8A880] dark:text-[#1A1A1A]"
                  : "text-[#1A1A1A]/60 dark:text-[#F5F5F0]/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#1A1A1A] dark:hover:text-[#F5F5F0]"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-black/5 dark:border-white/5 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#1A1A1A]/60 dark:text-[#F5F5F0]/60 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-5 h-5" />
                <span className="font-medium">Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-5 h-5" />
                <span className="font-medium">Light Mode</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#5A5A40]/10 dark:bg-[#A8A880]/10 flex items-center justify-center text-[#5A5A40] dark:text-[#A8A880]">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1A1A] dark:text-[#F5F5F0] truncate">{user?.name}</p>
              <p className="text-xs text-[#1A1A1A]/40 dark:text-[#F5F5F0]/40 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
