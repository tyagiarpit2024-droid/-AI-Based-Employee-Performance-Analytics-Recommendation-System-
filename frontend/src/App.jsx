import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import AIRecommendation from './pages/AIRecommendation';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Register />} />
              
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/employees" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
              <Route path="/employees/new" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
              <Route path="/employees/edit/:id" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
              <Route path="/ai-recommendation/:id" element={<ProtectedRoute><AIRecommendation /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
