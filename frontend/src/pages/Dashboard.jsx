import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Award, Briefcase } from 'lucide-react';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;
  if (error) return <div className="text-red-600 text-center py-10">{error}</div>;

  // Analytics Calculations
  const totalEmployees = employees.length;
  const avgPerformance = totalEmployees > 0 
    ? (employees.reduce((acc, curr) => acc + curr.performanceScore, 0) / totalEmployees).toFixed(1) 
    : 0;

  // Department Stats
  const deptCount = {};
  employees.forEach(emp => {
    deptCount[emp.department] = (deptCount[emp.department] || 0) + 1;
  });
  const deptData = Object.keys(deptCount).map(key => ({ name: key, value: deptCount[key] }));

  // Top Performers
  const topPerformers = [...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 5);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Users className="w-8 h-8"/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Employees</p>
            <p className="text-2xl font-bold text-gray-800">{totalEmployees}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full text-green-600"><TrendingUp className="w-8 h-8"/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Avg Performance</p>
            <p className="text-2xl font-bold text-gray-800">{avgPerformance}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-full text-purple-600"><Briefcase className="w-8 h-8"/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Departments</p>
            <p className="text-2xl font-bold text-gray-800">{Object.keys(deptCount).length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 rounded-full text-yellow-600"><Award className="w-8 h-8"/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Top Score</p>
            <p className="text-2xl font-bold text-gray-800">{topPerformers[0]?.performanceScore || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Department Distribution</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Performers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Department</th>
                  <th className="p-3 border-b text-center">Score</th>
                  <th className="p-3 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map(emp => (
                  <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-b font-medium text-gray-800">{emp.name}</td>
                    <td className="p-3 border-b text-gray-600">{emp.department}</td>
                    <td className="p-3 border-b text-center font-bold text-green-600">{emp.performanceScore}</td>
                    <td className="p-3 border-b text-center">
                      <Link to={`/ai-recommendation/${emp._id}`} state={{ employee: emp }} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Analyze
                      </Link>
                    </td>
                  </tr>
                ))}
                {topPerformers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">No employees found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
