import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  hoverable?: boolean;
  glow?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  selected = false,
  hoverable = false,
  glow = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-xl p-5 transition-all duration-200';
  
  const stateClasses = selected
    ? 'bg-[#11192e] border-2 border-indigo-500 shadow-lg shadow-indigo-500/15'
    : hoverable
    ? 'bg-[#0f172a] hover:bg-[#131d33] border border-slate-800 hover:border-slate-700 shadow-sm hover:shadow-indigo-500/10'
    : 'bg-[#0f172a] border border-slate-800/80 shadow-card-subtle';

  const glowClass = glow ? 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-indigo-500/5 before:to-purple-500/5 before:pointer-events-none' : '';

  return (
    <div className={`${baseClasses} ${stateClasses} ${glowClass} ${className}`} {...props}>
      {children}
    </div>
  );
};
