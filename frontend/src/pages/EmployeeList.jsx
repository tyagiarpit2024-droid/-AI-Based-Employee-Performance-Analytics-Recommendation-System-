import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Search, Edit, Trash2, UserPlus, BrainCircuit } from 'lucide-react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (search = '') => {
    setLoading(true);
    try {
      const url = search ? `/employees/search?department=${search}` : '/employees';
      const res = await api.get(url);
      setEmployees(res.data);
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (err) {
        alert('Failed to delete employee');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    fetchEmployees();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Employee Directory</h1>
        
        <div className="flex w-full md:w-auto gap-2">
          <form onSubmit={handleSearch} className="flex relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search department..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          </form>
          {searchTerm && (
            <button onClick={handleClear} className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              Clear
            </button>
          )}
          <Link to="/employees/new" className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 whitespace-nowrap">
            <UserPlus className="h-4 w-4 mr-2" /> Add
          </Link>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="p-4 border-b font-semibold">Name</th>
                <th className="p-4 border-b font-semibold">Department</th>
                <th className="p-4 border-b font-semibold">Skills</th>
                <th className="p-4 border-b font-semibold text-center">Score</th>
                <th className="p-4 border-b font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b font-medium text-gray-800">
                    <div>{emp.name}</div>
                    <div className="text-xs text-gray-500 font-normal">{emp.email}</div>
                  </td>
                  <td className="p-4 border-b text-gray-600">{emp.department}</td>
                  <td className="p-4 border-b">
                    <div className="flex flex-wrap gap-1">
                      {emp.skills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                      {emp.skills.length > 2 && <span className="text-xs text-gray-500">+{emp.skills.length - 2}</span>}
                    </div>
                  </td>
                  <td className="p-4 border-b text-center font-bold text-green-600">{emp.performanceScore}</td>
                  <td className="p-4 border-b">
                    <div className="flex justify-center space-x-3">
                      <button onClick={() => navigate(`/ai-recommendation/${emp._id}`, { state: { employee: emp } })} className="text-indigo-600 hover:text-indigo-900" title="AI Recommend">
                        <BrainCircuit className="h-5 w-5" />
                      </button>
                      <button onClick={() => navigate(`/employees/edit/${emp._id}`, { state: { employee: emp } })} className="text-blue-600 hover:text-blue-900" title="Edit">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(emp._id)} className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
