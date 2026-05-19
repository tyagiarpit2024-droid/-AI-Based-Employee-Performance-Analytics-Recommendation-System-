import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import api from '../api/axios';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, FileText, AlertCircle, Save, X, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const ComplaintForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    description: '',
    category: '',
    location: '',
    status: 'Pending'
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit && !location.state?.complaint);

  useEffect(() => {
    if (isEdit) {
      if (location.state?.complaint) {
        setFormData(location.state.complaint);
      } else {
        const fetchComp = async () => {
          try {
            const res = await api.get('/complaints');
            const comp = res.data.find(c => c._id === id);
            if (comp) setFormData(comp);
          } catch (err) {
            toast.error('Failed to fetch complaint details');
            navigate('/complaints');
          } finally {
            setFetching(false);
          }
        };
        fetchComp();
      }
    }
  }, [id, isEdit, location.state, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/complaints/${id}`, formData);
        toast.success('Complaint updated successfully');
      } else {
        await api.post('/complaints', formData);
        toast.success('Complaint registered successfully');
      }
      navigate('/complaints');
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
                {isEdit ? 'Update Complaint' : 'Register New Complaint'}
              </h1>
              <p className="text-muted mt-1">
                {isEdit ? 'Update details or status of the issue.' : 'Provide details of the issue to register it.'}
              </p>
            </div>
            <div className="icon-box icon-box-primary">
              <FileText size={24} />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted mb-1" style={{ display: 'block' }}>Reporter Name</label>
                <div className="relative">
                  <User className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="glass-input glass-input-icon" placeholder="John Doe" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted mb-1" style={{ display: 'block' }}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="glass-input glass-input-icon" placeholder="john@example.com" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted mb-1" style={{ display: 'block' }}>Complaint Title</label>
              <div className="relative">
                <AlertCircle className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
                <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Water Pipeline Leakage" className="glass-input glass-input-icon" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted mb-1" style={{ display: 'block' }}>Category</label>
                <div className="relative">
                  <FileText className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
                  <input type="text" name="category" required value={formData.category} onChange={handleChange} className="glass-input glass-input-icon" placeholder="Water Supply, Roads, Electricity..." />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted mb-1" style={{ display: 'block' }}>Location / Area</label>
                <div className="relative">
                  <MapPin className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
                  <input type="text" name="location" required value={formData.location} onChange={handleChange} className="glass-input glass-input-icon" placeholder="Sector 14, Main Market" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted mb-1" style={{ display: 'block' }}>Description</label>
              <textarea 
                name="description" 
                required 
                value={formData.description} 
                onChange={handleChange} 
                className="glass-input" 
                rows="4" 
                placeholder="Provide detailed information about the issue..."
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>

            {isEdit && (
              <div>
                <label className="text-sm font-medium text-muted mb-1" style={{ display: 'block' }}>Current Status</label>
                <div className="relative">
                  <Activity className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange} 
                    className="glass-input glass-input-icon"
                    style={{ appearance: 'none' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t mt-2">
              <button type="submit" disabled={loading} className="flex-1 btn-primary">
                {loading ? (
                  <span style={{ animation: 'pulse 2s infinite' }}>Saving...</span>
                ) : (
                  <>
                    <Save size={20} className="mr-2" />
                    {isEdit ? 'Update Complaint' : 'Register Complaint'}
                  </>
                )}
              </button>
              <button type="button" onClick={() => navigate('/complaints')} className="flex-1 btn-secondary">
                <X size={20} className="mr-2" /> Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default ComplaintForm;
