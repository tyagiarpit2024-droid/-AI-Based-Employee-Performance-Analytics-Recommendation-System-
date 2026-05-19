import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import AnimatedPage from '../components/AnimatedPage';
import { BrainCircuit, AlertTriangle, Building, MessageSquare, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AIAnalysis = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(location.state?.complaint || null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!complaint);

  useEffect(() => {
    if (!complaint) {
      const fetchComp = async () => {
        try {
          const res = await api.get('/complaints');
          const comp = res.data.find(c => c._id === id);
          if (comp) {
            setComplaint(comp);
          } else {
            toast.error('Complaint not found');
            navigate('/complaints');
          }
        } catch (err) {
          toast.error('Failed to fetch details');
        } finally {
          setFetching(false);
        }
      };
      fetchComp();
    }
  }, [id, complaint, navigate]);

  const getAnalysis = async () => {
    if (!complaint) return;
    setLoading(true);
    try {
      const res = await api.post('/ai/recommend', {
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        location: complaint.location
      });
      setAnalysis(res.data);
      toast.success('AI Triage complete!');
    } catch (err) {
      toast.error(err.message || 'Failed to get AI analysis');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex h-full items-center justify-center">
      <div className="spinner spinner-lg"></div>
    </div>
  );

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <AnimatedPage>
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-muted mb-6 font-medium" style={{ transition: 'color 0.2s' }}>
          <ArrowLeft size={16} className="mr-2" /> Back to Registry
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden mb-8 relative"
        >
          <div className="absolute bg-primary" style={{ top: 0, right: 0, width: '16rem', height: '16rem', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2, margin: '-5rem -5rem 0 0' }}></div>
          
          <div className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <span className={`badge mb-3 ${complaint.status === 'Resolved' ? 'badge-success' : complaint.status === 'Pending' ? 'badge-warning' : 'badge-neutral'}`}>
                  Status: {complaint.status}
                </span>
                <h1 className="text-3xl font-bold text-white tracking-tight">{complaint.title}</h1>
                <p className="text-muted mt-2 max-w-2xl">{complaint.description}</p>
              </div>
              
              <div className="flex flex-row md:flex-col gap-4 text-sm whitespace-nowrap">
                <div className="glass-card p-3 px-4 border border-primary bg-dark">
                  <span className="text-muted block text-xs">Category</span>
                  <span className="text-white font-semibold">{complaint.category}</span>
                </div>
                <div className="glass-card p-3 px-4 border border-neon bg-dark">
                  <span className="text-muted block text-xs">Location</span>
                  <span className="text-white font-semibold">{complaint.location}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={getAnalysis} 
                disabled={loading}
                className="w-full btn-primary py-4 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="mr-3" style={{ animation: 'spin 1s linear infinite' }} />
                    Analyzing Complaint via OpenRouter AI...
                  </>
                ) : (
                  <>
                    <BrainCircuit size={24} className="mr-3" />
                    {analysis ? 'Regenerate Triage Analysis' : 'Run AI Triage'}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {analysis && (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8"
            >
              <motion.div variants={item} className="glass-card p-8 relative overflow-hidden" style={{ borderTop: `4px solid ${analysis.priority === 'High' ? 'var(--danger)' : analysis.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'}` }}>
                <div className="flex items-center mb-4 relative z-10">
                  <div className={`icon-box mr-4 ${analysis.priority === 'High' ? 'icon-box-danger' : analysis.priority === 'Medium' ? 'icon-box-warning' : 'icon-box-success'}`}>
                    <AlertTriangle size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Priority Level</h3>
                </div>
                <div className="text-3xl font-black mb-2" style={{ color: analysis.priority === 'High' ? 'var(--danger)' : analysis.priority === 'Medium' ? 'var(--warning)' : 'var(--success)' }}>
                  {analysis.priority}
                </div>
                <p className="text-muted text-sm relative z-10">Auto-detected urgency based on description content.</p>
              </motion.div>

              <motion.div variants={item} className="glass-card p-8 relative overflow-hidden" style={{ borderTop: '4px solid #3b82f6' }}>
                <div className="flex items-center mb-4 relative z-10">
                  <div className="icon-box mr-4" style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                    <Building size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Routing Department</h3>
                </div>
                <div className="text-2xl font-bold text-white mb-2">{analysis.department}</div>
                <p className="text-muted text-sm">Suggested administrative department to resolve this issue.</p>
              </motion.div>

              <motion.div variants={item} className="glass-card p-8 relative overflow-hidden" style={{ borderTop: '4px solid #a855f7' }}>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="icon-box mr-4" style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc' }}>
                    <FileText size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Executive Summary</h3>
                </div>
                <p className="text-white text-lg relative z-10 leading-relaxed">{analysis.summary}</p>
              </motion.div>

              <motion.div variants={item} className="glass-card p-8 relative overflow-hidden" style={{ borderTop: '4px solid #10b981' }}>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="icon-box mr-4" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
                    <MessageSquare size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Auto Response Draft</h3>
                </div>
                <p className="text-muted italic relative z-10">"{analysis.response}"</p>
                <div className="mt-4 pt-4 border-t flex justify-end">
                  <button className="text-sm font-semibold text-success hover:underline">Copy Response</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
};

export default AIAnalysis;
