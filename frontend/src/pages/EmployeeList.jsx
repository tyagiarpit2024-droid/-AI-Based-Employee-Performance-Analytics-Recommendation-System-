import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Search, Edit, Trash2, UserPlus, BrainCircuit, Users } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (search = '') => {
    setLoading(true);
    try {
      const url = search ? `/employees/search?department=${search}` : '/employees';
      const res = await api.get(url);
      setEmployees(res.data);
    } catch (err) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
        toast.success('Employee deleted successfully');
      } catch (err) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    fetchEmployees();
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AnimatedPage>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <Users className="w-8 h-8 mr-3 text-primary" />
            Employee Directory
          </h1>
          <p className="text-slate-400 mt-1">Manage and analyze your workforce</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <form onSubmit={handleSearch} className="flex relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search department..."
              className="glass-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 text-slate-400 h-5 w-5" />
          </form>
          {searchTerm && (
            <button onClick={handleClear} className="btn-secondary">
              Clear
            </button>
          )}
          <Link to="/employees/new" className="btn-primary flex items-center whitespace-nowrap">
            <UserPlus className="h-4 w-4 mr-2" /> Add New
          </Link>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-300 text-sm border-b border-slate-700/50">
                  <th className="p-4 font-semibold">Employee</th>
                  <th className="p-4 font-semibold">Department</th>
                  <th className="p-4 font-semibold">Skills</th>
                  <th className="p-4 font-semibold text-center">Score</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={container}
                initial="hidden"
                animate="show"
                className="divide-y divide-slate-800/50"
              >
                {employees.map((emp) => (
                  <motion.tr variants={item} key={emp._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-neon flex items-center justify-center font-bold text-white shadow-lg mr-3">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white group-hover:text-primary transition-colors">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {emp.department}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {emp.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md border border-primary/20">
                            {skill}
                          </span>
                        ))}
                        {emp.skills.length > 3 && (
                          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                            +{emp.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                        emp.performanceScore >= 80 ? 'border-green-500/20 text-green-400' :
                        emp.performanceScore >= 60 ? 'border-yellow-500/20 text-yellow-400' :
                        'border-red-500/20 text-red-400'
                      } font-bold text-sm bg-slate-900/50 shadow-inner`}>
                        {emp.performanceScore}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => navigate(`/ai-recommendation/${emp._id}`, { state: { employee: emp } })} 
                          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 group-hover:shadow-lg shadow-primary/20" 
                          title="AI Analysis"
                        >
                          <BrainCircuit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => navigate(`/employees/edit/${emp._id}`, { state: { employee: emp } })} 
                          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300" 
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(emp._id)} 
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300" 
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                        <Users className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-slate-400 text-lg">No employees found.</p>
                      <p className="text-slate-500 text-sm mt-1">Try adjusting your search or add a new employee.</p>
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default EmployeeList;
