import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Search, Edit, Trash2, FilePlus, BrainCircuit, FileText } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async (search = '') => {
    setLoading(true);
    try {
      const url = search ? `/complaints/search?location=${search}` : '/complaints';
      const res = await api.get(url);
      setComplaints(res.data);
    } catch (err) {
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await api.delete(`/complaints/${id}`);
        setComplaints(complaints.filter(c => c._id !== id));
        toast.success('Complaint deleted successfully');
      } catch (err) {
        toast.error('Failed to delete complaint');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaints(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    fetchComplaints();
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
            <FileText size={32} className="text-primary mr-3" />
            Complaint Registry
          </h1>
          <p className="text-muted mt-1">Manage and track all registered issues</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3 flex-wrap">
          <form onSubmit={handleSearch} className="flex relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search by location..."
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
          <Link to="/complaints/new" className="btn-primary flex items-center" style={{ whiteSpace: 'nowrap' }}>
            <FilePlus size={16} className="mr-2" /> New Complaint
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
                  <th>Title & Date</th>
                  <th>Reporter</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={container}
                initial="hidden"
                animate="show"
              >
                {complaints.map((comp) => (
                  <motion.tr variants={item} key={comp._id}>
                    <td>
                      <div>
                        <p className="font-medium text-white">{comp.title}</p>
                        <p className="text-xs text-muted">{new Date(comp.createdAt).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="text-sm text-white">{comp.name}</p>
                        <p className="text-xs text-muted">{comp.email}</p>
                      </div>
                    </td>
                    <td><span className="badge badge-neutral">{comp.category}</span></td>
                    <td><span className="text-sm">{comp.location}</span></td>
                    <td>
                      <span className={`badge ${comp.status === 'Resolved' ? 'badge-success' : comp.status === 'Pending' ? 'badge-warning' : 'badge-neutral'}`}>
                        {comp.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => navigate(`/ai-analysis/${comp._id}`, { state: { complaint: comp } })} 
                          className="btn-icon btn-icon-primary" 
                          title="AI Triage"
                        >
                          <BrainCircuit size={20} />
                        </button>
                        <button 
                          onClick={() => navigate(`/complaints/edit/${comp._id}`, { state: { complaint: comp } })} 
                          className="btn-icon btn-icon-neutral" 
                          title="Edit"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete(comp._id)} 
                          className="btn-icon btn-icon-danger" 
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <div className="avatar avatar-lg bg-surface mb-4">
                          <FileText size={32} color="var(--text-muted)" />
                        </div>
                        <p className="text-muted text-lg">No complaints found.</p>
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

export default ComplaintList;
