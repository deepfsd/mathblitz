import React from 'react';

interface Props {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
}

export const Badge: React.FC<Props> = ({ children, variant = 'primary' }) => {
  const base = "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors";
  const variants = {
    primary: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
    outline: "bg-transparent text-slate-500 border-slate-200 dark:text-slate-400 dark:border-slate-700",
    ghost: "bg-transparent text-slate-400 border-transparent dark:text-slate-500"
  };

  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
};