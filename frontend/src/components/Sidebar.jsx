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
    <div className="md:flex flex-col glass-card m-4 sticky top-0 overflow-hidden border-r md:w-72" style={{ display: 'none', height: 'calc(100vh - 2rem)' }}>
      <div className="flex items-center p-6 border-b" style={{ paddingBottom: '1.5rem' }}>
        <div className="avatar avatar-sm bg-gradient-primary mr-3" style={{ boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
          <Activity size={20} color="white" />
        </div>
        <span className="text-xl font-bold bg-gradient-text">
          AI Analytics
        </span>
      </div>

      <nav className="flex-1 mt-4 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex items-center p-3 rounded-lg z-10"
              style={{ color: isActive ? 'white' : 'var(--text-muted)' }}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 right-0 top-0 bottom-0 bg-primary opacity-20 border border-primary z-0"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={20} style={{ color: isActive ? 'var(--primary)' : 'inherit', zIndex: 10, marginRight: '0.75rem' }} />
              <span style={{ zIndex: 10, fontWeight: 500 }}>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="m-4 p-4 border border-primary" style={{ background: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <BrainCircuit size={32} color="var(--neon)" style={{ margin: '0 auto 0.5rem auto', opacity: 0.8 }} />
        <h4 className="text-sm font-semibold text-white mb-1">AI Engine Active</h4>
        <p className="text-xs text-muted">OpenRouter integration is running optimally.</p>
      </div>
    </div>
  );
};

export default Sidebar;
