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
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <AnimatedPage>
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-white mb-6 font-medium transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Directory
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden mb-8 relative"
        >
          {/* Decorative background for the profile card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-neon flex items-center justify-center font-bold text-3xl text-white shadow-xl shadow-primary/20 mr-6">
                  {employee.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">{employee.name}</h1>
                  <p className="text-primary font-medium text-lg mt-1">{employee.department}</p>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1">
                <div className="text-center md:text-right">
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon to-primary">
                    {employee.performanceScore}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">Performance</div>
                </div>
                <div className="hidden md:block h-10 w-px bg-slate-700 mx-4"></div>
                <div className="text-center md:text-right">
                  <div className="text-2xl font-bold text-white">{employee.experience} <span className="text-lg text-slate-400">Yrs</span></div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">Experience</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-700/50">
              <h3 className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-3">Core Competencies</h3>
              <div className="flex flex-wrap gap-3">
                {employee.skills.map((skill, idx) => (
                  <span key={idx} className="bg-slate-800/80 border border-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={getRecommendation} 
                disabled={loading}
                className="w-full btn-primary flex justify-center items-center py-4 text-lg group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Generating OpenRouter AI Insights...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
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
              className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12"
            >
              <motion.div variants={item} className="glass-card p-8 border-t-4 border-t-green-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-green-500/20 transition-colors"></div>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="p-3 bg-green-500/20 rounded-xl mr-4">
                    <Award className="h-7 w-7 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Promotion Readiness</h3>
                </div>
                <p className="text-slate-300 leading-relaxed relative z-10 text-lg">{recommendation.promotionRecommendation}</p>
              </motion.div>

              <motion.div variants={item} className="glass-card p-8 border-t-4 border-t-blue-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-colors"></div>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="p-3 bg-blue-500/20 rounded-xl mr-4">
                    <BookOpen className="h-7 w-7 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Learning Path</h3>
                </div>
                <ul className="space-y-3 relative z-10">
                  {recommendation.trainingSuggestions?.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-slate-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={item} className="glass-card p-8 border-t-4 border-t-orange-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-orange-500/20 transition-colors"></div>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="p-3 bg-orange-500/20 rounded-xl mr-4">
                    <MessageSquare className="h-7 w-7 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Manager Feedback</h3>
                </div>
                <p className="text-slate-300 leading-relaxed relative z-10 italic">"{recommendation.feedback}"</p>
              </motion.div>

              <motion.div variants={item} className="glass-card p-8 border-t-4 border-t-purple-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-colors"></div>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="p-3 bg-purple-500/20 rounded-xl mr-4">
                    <TrendingUp className="h-7 w-7 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Performance Insight</h3>
                </div>
                <p className="text-slate-300 leading-relaxed relative z-10 text-lg">{recommendation.rankingInsight}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
};

export default AIRecommendation;
