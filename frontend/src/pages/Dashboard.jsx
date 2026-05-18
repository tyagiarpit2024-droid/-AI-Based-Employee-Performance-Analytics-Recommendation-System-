import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Award, Briefcase, ChevronRight } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import DashboardCard from '../components/DashboardCard';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  const totalEmployees = employees.length;
  const avgPerformance = totalEmployees > 0 
    ? (employees.reduce((acc, curr) => acc + curr.performanceScore, 0) / totalEmployees).toFixed(1) 
    : 0;

  const deptCount = {};
  employees.forEach(emp => {
    deptCount[emp.department] = (deptCount[emp.department] || 0) + 1;
  });
  const deptData = Object.keys(deptCount).map(key => ({ name: key, value: deptCount[key] }));

  const topPerformers = [...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 5);
  const COLORS = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#ec4899'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-slate-600/50">
          <p className="text-white font-medium">{label || payload[0].name}</p>
          <p className="text-primary font-bold">{payload[0].value} employees</p>
        </div>
      );
    }
    return null;
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AnimatedPage className="pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">AI-powered insights for your workforce</p>
        </div>
        <Link to="/employees/new" className="btn-primary flex items-center">
          <Users className="w-5 h-5 mr-2" /> Add Employee
        </Link>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={item}>
          <DashboardCard title="Total Employees" value={totalEmployees} icon={Users} colorClass="bg-blue-500" trend="up" trendValue="12" />
        </motion.div>
        <motion.div variants={item}>
          <DashboardCard title="Avg Performance" value={`${avgPerformance}%`} icon={TrendingUp} colorClass="bg-green-500" trend="up" trendValue="4.2" />
        </motion.div>
        <motion.div variants={item}>
          <DashboardCard title="Departments" value={Object.keys(deptCount).length} icon={Briefcase} colorClass="bg-purple-500" />
        </motion.div>
        <motion.div variants={item}>
          <DashboardCard title="Top Score" value={topPerformers[0]?.performanceScore || 0} icon={Award} colorClass="bg-yellow-500" />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 glass-card p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6">Department Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={deptData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60}
                  outerRadius={90} 
                  paddingAngle={5}
                  dataKey="value" 
                  stroke="none"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {deptData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm text-slate-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Performers */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Top Performers</h2>
            <Link to="/employees" className="text-sm text-primary hover:text-neon flex items-center transition-colors">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="pb-3 font-semibold text-slate-400 text-sm">Employee</th>
                  <th className="pb-3 font-semibold text-slate-400 text-sm">Department</th>
                  <th className="pb-3 font-semibold text-slate-400 text-sm text-right">Score</th>
                  <th className="pb-3 font-semibold text-slate-400 text-sm text-center">AI Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {topPerformers.map((emp, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (idx * 0.1) }}
                    key={emp._id} 
                    className="group hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-primary mr-3">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white group-hover:text-primary transition-colors">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-300">{emp.department}</td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        {emp.performanceScore}%
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <Link 
                        to={`/ai-recommendation/${emp._id}`} 
                        state={{ employee: emp }} 
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                        title="Analyze Profile"
                      >
                        <Award className="w-4 h-4" />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Dashboard;
