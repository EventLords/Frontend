import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'gradient' | 'outline';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className = '',
}) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-200';
  
  const variants = {
    default: 'bg-white shadow-card hover:shadow-card-hover',
    gradient: 'bg-gradient-to-br from-unify-mint to-white shadow-card',
    outline: 'bg-white border-2 border-unify-purple/20 hover:border-unify-purple',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-unify-navy">{value}</p>
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-unify-mint flex items-center justify-center">
            <Icon className="text-unify-purple" size={24} />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
