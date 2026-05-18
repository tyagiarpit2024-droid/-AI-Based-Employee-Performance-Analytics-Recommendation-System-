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
      <div className="spinner spinner-lg"></div>
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
          <div className="p-6 border-b flex justify-between items-center" style={{ background: 'rgba(15,23,42,0.5)' }}>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isEdit ? 'Edit Employee Profile' : 'Add New Employee'}
              </h1>
              <p className="text-muted mt-1">
                {isEdit ? 'Update existing employee details and metrics.' : 'Create a new employee record.'}
              </p>
            </div>
            <div className="icon-box icon-box-primary">
              <User size={24} />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted mb-1" style={{ display: 'block' }}>Full Name</label>
                <div className="relative">
                  <User className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="glass-input glass-input-icon" placeholder="John Doe" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted mb-1" style={{ display: 'block' }}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="glass-input glass-input-icon" placeholder="john@company.com" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted mb-1" style={{ display: 'block' }}>Department</label>
                <div className="relative">
                  <Briefcase className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
                  <input type="text" name="department" required value={formData.department} onChange={handleChange} className="glass-input glass-input-icon" placeholder="Engineering" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted mb-1" style={{ display: 'block' }}>Experience (Years)</label>
                <div className="relative">
                  <TrendingUp className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
                  <input type="number" name="experience" required min="0" value={formData.experience} onChange={handleChange} className="glass-input glass-input-icon" placeholder="5" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted mb-1" style={{ display: 'block' }}>Skills (comma separated)</label>
              <div className="relative">
                <Cpu className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
                <input type="text" name="skills" required value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python, AWS" className="glass-input glass-input-icon" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted mb-1" style={{ display: 'block' }}>Performance Score (1-100)</label>
              <div className="relative">
                <Award className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
                <input type="number" name="performanceScore" required min="1" max="100" value={formData.performanceScore} onChange={handleChange} className="glass-input glass-input-icon" placeholder="85" />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t mt-4">
              <button type="submit" disabled={loading} className="flex-1 btn-primary">
                {loading ? (
                  <span style={{ animation: 'pulse 2s infinite' }}>Saving...</span>
                ) : (
                  <>
                    <Save size={20} className="mr-2" />
                    {isEdit ? 'Update Employee' : 'Create Employee'}
                  </>
                )}
              </button>
              <button type="button" onClick={() => navigate('/employees')} className="flex-1 btn-secondary">
                <X size={20} className="mr-2" /> Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default EmployeeForm;
