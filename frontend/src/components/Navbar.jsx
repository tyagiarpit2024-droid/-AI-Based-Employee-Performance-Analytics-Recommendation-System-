import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users, UserPlus, BarChart } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex-shrink-0 flex items-center font-bold text-xl tracking-wider">
              <BarChart className="mr-2" /> AI Analytics
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                <LayoutDashboard className="mr-1 h-4 w-4" /> Dashboard
              </Link>
              <Link to="/employees" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                <Users className="mr-1 h-4 w-4" /> Employees
              </Link>
              <Link to="/employees/new" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                <UserPlus className="mr-1 h-4 w-4" /> Add Employee
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="hidden md:block mr-4 font-medium">Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-indigo-700 hover:bg-indigo-800 transition-colors"
            >
              <LogOut className="mr-1 h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
