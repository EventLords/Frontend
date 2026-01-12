import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'outline' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200';
  
  const variants = {
    default: 'bg-white shadow-card hover:shadow-card-hover',
    gradient: 'bg-gradient-to-br from-unify-mint to-white shadow-card',
    outline: 'bg-white border-2 border-gray-200 hover:border-unify-purple',
    elevated: 'bg-white shadow-lg hover:shadow-xl',
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
