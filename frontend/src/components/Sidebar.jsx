import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, BrainCircuit, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', name: 'Overview', icon: LayoutDashboard },
    { path: '/employees', name: 'Employees', icon: Users },
    { path: '/employees/new', name: 'Add Employee', icon: UserPlus },
  ];

  return (
    <div className="w-64 hidden md:flex flex-col glass-card h-[calc(100vh-2rem)] m-4 sticky top-4 overflow-hidden border-r border-slate-700/50">
      <div className="p-6 flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-br from-primary to-neon rounded-lg shadow-lg shadow-primary/30">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          AI Analytics
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'}`} />
              <span className="relative z-10 font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 mx-4 mb-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 text-center">
        <BrainCircuit className="w-8 h-8 text-neon mx-auto mb-2 opacity-80" />
        <h4 className="text-sm font-semibold text-slate-200 mb-1">AI Engine Active</h4>
        <p className="text-xs text-slate-400">OpenRouter integration is running optimally.</p>
      </div>
    </div>
  );
};

export default Sidebar;
