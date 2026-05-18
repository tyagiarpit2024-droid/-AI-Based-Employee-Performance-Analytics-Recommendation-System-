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
    <header className="glass-card m-4 px-6 flex items-center justify-between sticky top-0 z-40" style={{ height: '5rem' }}>
      <div className="md:flex items-center glass-input md:w-72" style={{ display: 'none', padding: '0.5rem 1rem' }}>
        <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
        <input 
          type="text" 
          placeholder="Search everywhere..." 
          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '0.875rem' }}
        />
      </div>

      <div className="flex items-center justify-end w-full md:w-auto">
        <button className="relative btn-icon btn-icon-neutral mr-4">
          <Bell size={20} />
          <span className="absolute bg-neon" style={{ top: '2px', right: '2px', width: '8px', height: '8px', borderRadius: '50%' }}></span>
        </button>

        <div className="flex items-center border-l pl-4">
          <div className="avatar avatar-md bg-gradient-primary mr-3">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="md:block" style={{ display: 'none' }}>
            <p className="text-sm font-semibold text-white" style={{ lineHeight: 1.2 }}>{user?.name}</p>
            <p className="text-xs text-muted">Admin</p>
          </div>
          <button 
            onClick={handleLogout}
            className="btn-icon btn-icon-danger ml-4"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
