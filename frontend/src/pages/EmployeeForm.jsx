import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import api from '../api/axios';

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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        // Fetch if not in state
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
            setError('Failed to fetch employee details');
          }
        };
        fetchEmp();
      }
    }
  }, [id, isEdit, location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
      } else {
        await api.post('/employees', dataToSend);
      }
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h1>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input type="text" name="department" required value={formData.department} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
            <input type="number" name="experience" required min="0" value={formData.experience} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
          <input type="text" name="skills" required value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Performance Score (1-100)</label>
          <input type="number" name="performanceScore" required min="1" max="100" value={formData.performanceScore} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? 'Saving...' : (isEdit ? 'Update Employee' : 'Add Employee')}
          </button>
          <button type="button" onClick={() => navigate('/employees')} className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
