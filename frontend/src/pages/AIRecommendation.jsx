import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { BrainCircuit, Award, BookOpen, MessageSquare, TrendingUp, ArrowLeft } from 'lucide-react';

const AIRecommendation = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(location.state?.employee || null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!employee) {
      const fetchEmp = async () => {
        try {
          const res = await api.get('/employees');
          const emp = res.data.find(e => e._id === id);
          if (emp) {
            setEmployee(emp);
          } else {
            setError('Employee not found');
          }
        } catch (err) {
          setError('Failed to fetch employee details');
        }
      };
      fetchEmp();
    }
  }, [id, employee]);

  const getRecommendation = async () => {
    if (!employee) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/ai/recommend', {
        name: employee.name,
        department: employee.department,
        skills: employee.skills,
        performanceScore: employee.performanceScore,
        experience: employee.experience
      });
      setRecommendation(res.data);
    } catch (err) {
      setError(err.message || 'Failed to get AI recommendation');
    } finally {
      setLoading(false);
    }
  };

  if (!employee && !error) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-600 text-center py-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-indigo-50 p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
            <p className="text-indigo-600 font-medium">{employee.department}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-indigo-700">{employee.performanceScore}</div>
            <div className="text-sm text-indigo-500 uppercase tracking-wide font-semibold">Score</div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {employee.skills.map((skill, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              {employee.experience} Years Exp
            </span>
          </div>

          <button 
            onClick={getRecommendation} 
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 transition-all font-semibold"
          >
            <BrainCircuit className={`h-5 w-5 mr-2 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Analyzing Profile with AI...' : 'Generate AI Analysis'}
          </button>
        </div>
      </div>

      {recommendation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4 text-green-600">
              <Award className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-bold text-gray-800">Promotion Recommendation</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{recommendation.promotionRecommendation}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4 text-blue-600">
              <BookOpen className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-bold text-gray-800">Training Suggestions</h3>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {recommendation.trainingSuggestions?.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4 text-orange-500">
              <MessageSquare className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-bold text-gray-800">Constructive Feedback</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{recommendation.feedback}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4 text-purple-600">
              <TrendingUp className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-bold text-gray-800">Ranking Insight</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{recommendation.rankingInsight}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendation;
