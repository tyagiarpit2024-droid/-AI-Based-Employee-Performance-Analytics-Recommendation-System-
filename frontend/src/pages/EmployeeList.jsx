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
            <Users size={32} className="text-primary mr-3" />
            Employee Directory
          </h1>
          <p className="text-muted mt-1">Manage and analyze your workforce</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3 flex-wrap">
          <form onSubmit={handleSearch} className="flex relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search department..."
              className="glass-input glass-input-icon"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute top-0 bottom-0 text-muted" style={{ left: '0.75rem', margin: 'auto' }} size={20} />
          </form>
          {searchTerm && (
            <button onClick={handleClear} className="btn-secondary">
              Clear
            </button>
          )}
          <Link to="/employees/new" className="btn-primary flex items-center" style={{ whiteSpace: 'nowrap' }}>
            <UserPlus size={16} className="mr-2" /> Add New
          </Link>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center" style={{ height: '16rem' }}>
            <div className="spinner spinner-lg"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Skills</th>
                  <th className="text-center">Score</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={container}
                initial="hidden"
                animate="show"
              >
                {employees.map((emp) => (
                  <motion.tr variants={item} key={emp._id}>
                    <td>
                      <div className="flex items-center">
                        <div className="avatar avatar-md bg-gradient-primary mr-3">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{emp.name}</p>
                          <p className="text-xs text-muted">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">
                        {emp.department}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {emp.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="badge badge-primary">
                            {skill}
                          </span>
                        ))}
                        {emp.skills.length > 3 && (
                          <span className="badge badge-neutral">
                            +{emp.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '3rem', height: '3rem', borderRadius: '50%', fontWeight: 'bold', fontSize: '0.875rem',
                        background: 'rgba(15,23,42,0.5)',
                        border: `4px solid ${emp.performanceScore >= 80 ? 'rgba(16,185,129,0.2)' : emp.performanceScore >= 60 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`,
                        color: emp.performanceScore >= 80 ? 'var(--success)' : emp.performanceScore >= 60 ? 'var(--warning)' : 'var(--danger)'
                      }}>
                        {emp.performanceScore}
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => navigate(`/ai-recommendation/${emp._id}`, { state: { employee: emp } })} 
                          className="btn-icon btn-icon-primary" 
                          title="AI Analysis"
                        >
                          <BrainCircuit size={20} />
                        </button>
                        <button 
                          onClick={() => navigate(`/employees/edit/${emp._id}`, { state: { employee: emp } })} 
                          className="btn-icon btn-icon-neutral" 
                          title="Edit"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete(emp._id)} 
                          className="btn-icon btn-icon-danger" 
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <div className="avatar avatar-lg bg-surface mb-4">
                          <Users size={32} color="var(--text-muted)" />
                        </div>
                        <p className="text-muted text-lg">No employees found.</p>
                        <p className="text-muted text-sm mt-1">Try adjusting your search or add a new employee.</p>
                      </div>
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
