import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 glass-card mx-4 mt-4 px-6 flex items-center justify-between sticky top-4 z-40">
      {/* Search Bar (Visual Only for TopBar) */}
      <div className="hidden md:flex items-center w-96 bg-slate-900/50 border border-slate-700/50 rounded-full px-4 py-2 text-slate-300 focus-within:ring-2 ring-primary transition-all">
        <Search className="w-5 h-5 text-slate-500 mr-2" />
        <input 
          type="text" 
          placeholder="Search everywhere..." 
          className="bg-transparent border-none outline-none w-full text-sm placeholder-slate-500"
        />
      </div>

      <div className="flex items-center space-x-6 ml-auto">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-neon rounded-full animate-ping"></span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-neon rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3 border-l border-slate-700 pl-6">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-neon flex items-center justify-center font-bold text-white shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-200 leading-tight">{user?.name}</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
          <button 
            onClick={handleLogout}
            className="ml-4 p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
