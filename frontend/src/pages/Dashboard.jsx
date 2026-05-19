import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Clock, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import DashboardCard from '../components/DashboardCard';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <div className="spinner spinner-lg"></div>
    </div>
  );

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

  const categoryCount = {};
  complaints.forEach(c => {
    categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
  });
  const categoryData = Object.keys(categoryCount).map(key => ({ name: key, value: categoryCount[key] }));

  const recentComplaints = [...complaints].slice(0, 5);
  const COLORS = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#ec4899'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3">
          <p className="font-medium text-white">{label || payload[0].name}</p>
          <p className="font-bold text-primary">{payload[0].value} complaints</p>
        </div>
      );
    }
    return null;
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AnimatedPage className="pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Dashboard</h1>
          <p className="text-muted mt-1">Smart city complaint monitoring</p>
        </div>
        <Link to="/complaints/new" className="btn-primary flex items-center">
          <FileText size={20} className="mr-2" /> Register Complaint
        </Link>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={item}>
          <DashboardCard title="Total Complaints" value={totalComplaints} icon={FileText} iconClass="icon-box-primary" />
        </motion.div>
        <motion.div variants={item}>
          <DashboardCard title="Pending" value={pendingComplaints} icon={Clock} iconClass="icon-box-warning" />
        </motion.div>
        <motion.div variants={item}>
          <DashboardCard title="Resolved" value={resolvedComplaints} icon={CheckCircle} iconClass="icon-box-success" />
        </motion.div>
        <motion.div variants={item}>
          <DashboardCard title="Categories" value={Object.keys(categoryCount).length} icon={AlertTriangle} iconClass="icon-box-purple" />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 glass-card p-6 flex flex-col"
        >
          <h2 className="text-lg font-bold text-white mb-6">Complaint Categories</h2>
          <div style={{ height: '16rem', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60}
                  outerRadius={90} 
                  paddingAngle={5}
                  dataKey="value" 
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {categoryData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length], marginRight: '0.5rem' }}></div>
                <span className="text-sm text-muted">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Complaints */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Recent Complaints</h2>
            <Link to="/complaints" className="text-sm text-primary flex items-center" style={{ textDecoration: 'none' }}>
              View all <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Title & Location</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th className="text-center">AI Analysis</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((comp, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (idx * 0.1) }}
                    key={comp._id}
                  >
                    <td>
                      <div>
                        <p className="font-medium text-white">{comp.title}</p>
                        <p className="text-xs text-muted">{comp.location}</p>
                      </div>
                    </td>
                    <td>{comp.category}</td>
                    <td>
                      <span className={`badge ${comp.status === 'Resolved' ? 'badge-success' : comp.status === 'Pending' ? 'badge-warning' : 'badge-neutral'}`}>
                        {comp.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <Link 
                        to={`/ai-analysis/${comp._id}`} 
                        state={{ complaint: comp }} 
                        className="btn-icon btn-icon-primary"
                        title="AI Triage"
                      >
                        <FileText size={16} />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
                {recentComplaints.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">No complaints found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Dashboard;
