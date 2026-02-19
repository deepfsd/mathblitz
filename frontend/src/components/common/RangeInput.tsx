import React from 'react';

interface Props {
  label: string;
  value: number;
  max?: number;
  onChange: (v: number) => void;
}

export const RangeInput: React.FC<Props> = ({ label, value, max = 99, onChange }) => (
  <div className="flex-1 relative group">
    <input
      type="number"
      min="1"
      max={max}
      className="w-full text-center py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-2xl text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
      value={value}
      onChange={(e) => onChange(Math.min(max, Math.max(1, Number(e.target.value))))}
    />
    <div className="absolute inset-x-0 -bottom-6 text-center">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2">
        {label}
      </span>
    </div>
  </div>
);