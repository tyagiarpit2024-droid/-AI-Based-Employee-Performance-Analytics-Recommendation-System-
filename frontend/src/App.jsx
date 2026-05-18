import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import AIRecommendation from './pages/AIRecommendation';
import { AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) return children;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
        <Route path="/employees/new" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
        <Route path="/employees/edit/:id" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
        <Route path="/ai-recommendation/:id" element={<ProtectedRoute><AIRecommendation /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AnimatedRoutes />
        </Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)'
            }
          }}
        />
      </Router>
    </AuthProvider>
  );
};

export default App;
