import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import AnimatedPage from '../components/AnimatedPage';
import { BrainCircuit, Award, BookOpen, MessageSquare, TrendingUp, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AIRecommendation = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(location.state?.employee || null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!employee);

  useEffect(() => {
    if (!employee) {
      const fetchEmp = async () => {
        try {
          const res = await api.get('/employees');
          const emp = res.data.find(e => e._id === id);
          if (emp) {
            setEmployee(emp);
          } else {
            toast.error('Employee not found');
            navigate('/employees');
          }
        } catch (err) {
          toast.error('Failed to fetch employee details');
        } finally {
          setFetching(false);
        }
      };
      fetchEmp();
    }
  }, [id, employee, navigate]);

  const getRecommendation = async () => {
    if (!employee) return;
    setLoading(true);
    try {
      const res = await api.post('/ai/recommend', {
        name: employee.name,
        department: employee.department,
        skills: employee.skills,
        performanceScore: employee.performanceScore,
        experience: employee.experience
      });
      setRecommendation(res.data);
      toast.success('AI Analysis complete!');
    } catch (err) {
      toast.error(err.message || 'Failed to get AI recommendation');
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
          <ArrowLeft size={16} className="mr-2" /> Back to Directory
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden mb-8 relative"
        >
          {/* Decorative background */}
          <div className="absolute bg-primary" style={{ top: 0, right: 0, width: '16rem', height: '16rem', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2, margin: '-5rem -5rem 0 0' }}></div>
          <div className="absolute bg-neon" style={{ bottom: 0, left: 0, width: '16rem', height: '16rem', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2, margin: '0 0 -5rem -5rem' }}></div>
          
          <div className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center">
                <div className="avatar avatar-lg bg-gradient-primary mr-6">
                  {employee.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">{employee.name}</h1>
                  <p className="text-primary font-medium text-lg mt-1">{employee.department}</p>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col items-center md:items-end gap-4">
                <div className="text-center md:text-right">
                  <div className="text-4xl font-black bg-gradient-text">
                    {employee.performanceScore}
                  </div>
                  <div className="text-xs text-muted uppercase tracking-widest font-semibold mt-1">Performance</div>
                </div>
                <div className="md:block border-l mx-4" style={{ display: 'none', height: '2.5rem' }}></div>
                <div className="text-center md:text-right">
                  <div className="text-2xl font-bold text-white">{employee.experience} <span className="text-lg text-muted">Yrs</span></div>
                  <div className="text-xs text-muted uppercase tracking-widest font-semibold mt-1">Experience</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-sm text-muted uppercase tracking-widest font-semibold mb-3">Core Competencies</h3>
              <div className="flex flex-wrap gap-3">
                {employee.skills.map((skill, idx) => (
                  <span key={idx} className="badge badge-neutral p-2 px-4 text-sm" style={{ border: '1px solid var(--surface-border)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={getRecommendation} 
                disabled={loading}
                className="w-full btn-primary py-4 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="mr-3" style={{ animation: 'spin 1s linear infinite' }} />
                    Generating OpenRouter AI Insights...
                  </>
                ) : (
                  <>
                    <BrainCircuit size={24} className="mr-3" />
                    {recommendation ? 'Regenerate AI Analysis' : 'Generate AI Analysis'}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {recommendation && (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8"
            >
              <motion.div variants={item} className="glass-card p-8 relative overflow-hidden" style={{ borderTop: '4px solid var(--success)' }}>
                <div className="absolute" style={{ top: 0, right: 0, width: '8rem', height: '8rem', background: 'var(--success)', opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)', margin: '-2rem -2rem 0 0' }}></div>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="icon-box icon-box-success mr-4">
                    <Award size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Promotion Readiness</h3>
                </div>
                <p className="text-muted text-lg relative z-10">{recommendation.promotionRecommendation}</p>
              </motion.div>

              <motion.div variants={item} className="glass-card p-8 relative overflow-hidden" style={{ borderTop: '4px solid #3b82f6' }}>
                <div className="absolute" style={{ top: 0, right: 0, width: '8rem', height: '8rem', background: '#3b82f6', opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)', margin: '-2rem -2rem 0 0' }}></div>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="icon-box mr-4" style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                    <BookOpen size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Learning Path</h3>
                </div>
                <ul className="flex flex-col gap-3 relative z-10">
                  {recommendation.trainingSuggestions?.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa', marginTop: '0.5rem', marginRight: '0.75rem', flexShrink: 0 }}></span>
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={item} className="glass-card p-8 relative overflow-hidden" style={{ borderTop: '4px solid #f97316' }}>
                <div className="absolute" style={{ top: 0, right: 0, width: '8rem', height: '8rem', background: '#f97316', opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)', margin: '-2rem -2rem 0 0' }}></div>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="icon-box mr-4" style={{ background: 'rgba(249,115,22,0.2)', color: '#fb923c' }}>
                    <MessageSquare size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Manager Feedback</h3>
                </div>
                <p className="text-muted italic relative z-10">"{recommendation.feedback}"</p>
              </motion.div>

              <motion.div variants={item} className="glass-card p-8 relative overflow-hidden" style={{ borderTop: '4px solid #a855f7' }}>
                <div className="absolute" style={{ top: 0, right: 0, width: '8rem', height: '8rem', background: '#a855f7', opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)', margin: '-2rem -2rem 0 0' }}></div>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="icon-box mr-4" style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc' }}>
                    <TrendingUp size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Performance Insight</h3>
                </div>
                <p className="text-muted text-lg relative z-10">{recommendation.rankingInsight}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
};

export default AIRecommendation;
