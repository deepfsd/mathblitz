import React from 'react';
import { WheelPicker } from '../common/WheelPicker';

interface Props {
  digits: number;
  termCount: number;
  onChange: (key: 'addDigits' | 'addTermCount', val: number) => void;
}

export const AdditionForm: React.FC<Props> = ({ digits, termCount, onChange }) => (
  <div className="animate-fade-in">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 block text-center">
      Number Complexity
    </label>
    
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      <WheelPicker 
        label="Digits" 
        value={digits} 
        min={1} 
        max={5} 
        onChange={(v) => onChange('addDigits', v)} 
      />
      
      <div className="flex flex-col items-center justify-center text-slate-300 mb-6 px-1 sm:px-2">
         <span className="material-symbols-outlined text-3xl">|</span>
      </div>

      <WheelPicker 
        label="Total Numbers" 
        value={termCount} 
        min={2} 
        max={5} 
        onChange={(v) => onChange('addTermCount', v)} 
      />
    </div>
  </div>
);