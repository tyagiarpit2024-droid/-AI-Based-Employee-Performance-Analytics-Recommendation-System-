import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark">
      {/* Background decoration */}
      <div className="blur-blob" style={{ top: '-20%', right: '-10%', width: '50%', height: '50%', background: 'rgba(99,102,241,0.2)' }}></div>
      <div className="blur-blob" style={{ bottom: '-20%', left: '-10%', width: '50%', height: '50%', background: 'rgba(6,182,212,0.2)', animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 p-4"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center mx-auto bg-gradient-primary mb-6"
              style={{ width: '4rem', height: '4rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(99,102,241,0.3)' }}
            >
              <BrainCircuit size={32} color="white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Join AI Analytics</h2>
            <p className="text-muted">Create your administrative workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <User className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
              <input
                type="text"
                required
                className="glass-input glass-input-icon"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
            </div>

            <div className="relative">
              <Mail className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
              <input
                type="email"
                required
                className="glass-input glass-input-icon"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute top-0 bottom-0 text-muted" style={{ left: '1rem', margin: 'auto' }} size={20} />
              <input
                type="password"
                required
                className="glass-input glass-input-icon"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary mt-2"
            >
              {loading ? (
                <span style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>Creating Account...</span>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-neon font-semibold" style={{ transition: 'color 0.2s' }}>
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
