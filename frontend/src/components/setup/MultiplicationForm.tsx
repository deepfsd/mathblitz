import React from 'react';
import { WheelPicker } from '../common/WheelPicker';

interface Props {
  startTable: number;
  endTable: number;
  onChange: (key: 'startTable' | 'endTable', val: number) => void;
}

export const MultiplicationForm: React.FC<Props> = ({ startTable, endTable, onChange }) => (
  <div className="animate-fade-in">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 block text-center">
      Multiplication Tables
    </label>
    <div className="flex items-center justify-center gap-6">
      <WheelPicker 
        label="Start" 
        value={startTable} 
        min={1} 
        max={20} 
        onChange={(v) => onChange('startTable', v)} 
      />
      <span className="text-slate-300 font-black text-xl italic mb-6">to</span>
      <WheelPicker 
        label="End" 
        value={endTable} 
        min={1} 
        max={50} 
        onChange={(v) => onChange('endTable', v)} 
      />
    </div>
  </div>
);