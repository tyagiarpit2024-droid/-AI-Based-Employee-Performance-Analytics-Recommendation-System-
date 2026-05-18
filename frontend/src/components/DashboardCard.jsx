import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, icon: Icon, trend, trendValue, iconClass }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-sm font-medium text-muted mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`icon-box ${iconClass}`}>
          <Icon size={24} />
        </div>
      </div>
      
      {trendValue && (
        <div className="flex items-center text-sm relative z-10">
          <span className="font-semibold" style={{ color: trend === 'up' ? 'var(--success)' : 'var(--danger)' }}>
            {trend === 'up' ? '+' : '-'}{trendValue}%
          </span>
          <span className="text-muted ml-2">vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardCard;
