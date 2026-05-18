import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import api from '../api/axios';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Award, TrendingUp, Cpu, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit && !location.state?.employee);

  useEffect(() => {
    if (isEdit) {
      if (location.state?.employee) {
        const emp = location.state.employee;
        setFormData({
          name: emp.name,
          email: emp.email,
          department: emp.department,
          skills: emp.skills.join(', '),
          performanceScore: emp.performanceScore,
          experience: emp.experience
        });
      } else {
        const fetchEmp = async () => {
          try {
            const res = await api.get('/employees');
            const emp = res.data.find(e => e._id === id);
            if (emp) {
              setFormData({
                name: emp.name,
                email: emp.email,
                department: emp.department,
                skills: emp.skills.join(', '),
                performanceScore: emp.performanceScore,
                experience: emp.experience
              });
            }
          } catch (err) {
            toast.error('Failed to fetch employee details');
            navigate('/employees');
          } finally {
            setFetching(false);
          }
        };
        fetchEmp();
      }
    }
  }, [id, isEdit, location.state, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      performanceScore: Number(formData.performanceScore),
      experience: Number(formData.experience)
    };

    try {
      if (isEdit) {
        await api.put(`/employees/${id}`, dataToSend);
        toast.success('Employee updated successfully');
      } else {
        await api.post('/employees', dataToSend);
        toast.success('Employee added successfully');
      }
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex h-full items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <AnimatedPage>
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="bg-slate-900/50 p-6 border-b border-slate-700/50 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isEdit ? 'Edit Employee Profile' : 'Add New Employee'}
              </h1>
              <p className="text-slate-400 mt-1">
                {isEdit ? 'Update existing employee details and metrics.' : 'Create a new employee record.'}
              </p>
            </div>
            <div className="p-3 bg-primary/20 rounded-xl">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="glass-input pl-12" placeholder="John Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="glass-input pl-12" placeholder="john@company.com" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Department</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                  <input type="text" name="department" required value={formData.department} onChange={handleChange} className="glass-input pl-12" placeholder="Engineering" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Experience (Years)</label>
                <div className="relative">
                  <TrendingUp className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                  <input type="number" name="experience" required min="0" value={formData.experience} onChange={handleChange} className="glass-input pl-12" placeholder="5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Skills (comma separated)</label>
              <div className="relative">
                <Cpu className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                <input type="text" name="skills" required value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python, AWS" className="glass-input pl-12" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Performance Score (1-100)</label>
              <div className="relative">
                <Award className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                <input type="number" name="performanceScore" required min="1" max="100" value={formData.performanceScore} onChange={handleChange} className="glass-input pl-12" placeholder="85" />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-700/50 mt-8">
              <button type="submit" disabled={loading} className="flex-1 btn-primary flex justify-center items-center">
                {loading ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {isEdit ? 'Update Employee' : 'Create Employee'}
                  </>
                )}
              </button>
              <button type="button" onClick={() => navigate('/employees')} className="flex-1 btn-secondary flex justify-center items-center">
                <X className="w-5 h-5 mr-2" /> Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default EmployeeForm;
