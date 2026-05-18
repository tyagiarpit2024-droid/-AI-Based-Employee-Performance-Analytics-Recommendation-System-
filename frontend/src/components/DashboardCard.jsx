import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="glass-card p-6 relative overflow-hidden group"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-xl ${colorClass}`}></div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 shadow-inner ${colorClass.replace('bg-', 'text-')}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {trendValue && (
        <div className="flex items-center text-sm">
          <span className={`font-semibold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? '+' : '-'}{trendValue}%
          </span>
          <span className="text-slate-500 ml-2">vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardCard;
