import React, { useRef, useEffect, useMemo, useCallback } from 'react';

let audioCtx: AudioContext | null = null;

const playIOSClick = () => {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.015); 

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.015); 

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.015);

    if (navigator.vibrate) {
      navigator.vibrate(2);
    }
  } catch (e) {}
};

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
}

export const WheelPicker: React.FC<Props> = ({ label, value, min, max, onChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);
  
  const ITEM_HEIGHT = 48;

  const range = useMemo(() => {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }, [min, max]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;
    
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const newValue = range[index];
    
    if (newValue !== undefined && newValue !== value) {
      onChange(newValue);
      if (!isInitialMount.current) {
        playIOSClick();
      }
    }
  }, [range, value, onChange]);

  useEffect(() => {
    if (scrollRef.current) {
      const index = range.indexOf(value);
      scrollRef.current.scrollTop = index * ITEM_HEIGHT;
      const timer = setTimeout(() => { isInitialMount.current = false; }, 150);
      return () => clearTimeout(timer);
    }
  }, []); 

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startY.current = e.clientY;
    startScrollTop.current = scrollRef.current.scrollTop;
    scrollRef.current.style.scrollSnapType = 'none';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    const distanceMoved = e.clientY - startY.current;
    scrollRef.current.scrollTop = startScrollTop.current - distanceMoved;
  };

  const handlePointerUpOrLeave = () => {
    if (!isDragging.current || !scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.scrollSnapType = 'y mandatory';
  };

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative h-[144px] w-28 overflow-hidden bg-slate-50 rounded-2xl border border-slate-200 shadow-inner group">
        <div className="absolute top-1/2 left-0 w-full h-[48px] -translate-y-1/2 border-y-2 border-indigo-500 bg-indigo-50/30 pointer-events-none z-10 box-border shadow-[0_0_15px_rgba(99,102,241,0.1)]" />
        <div className="absolute top-0 left-0 w-full h-[48px] bg-gradient-to-b from-slate-50 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-full h-[48px] bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-10" />

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrLeave}
          onPointerLeave={handlePointerUpOrLeave}
          className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar py-[48px] scroll-smooth cursor-grab active:cursor-grabbing"
        >
          {range.map((num) => (
            <div 
              key={num}
              className={`h-[48px] flex items-center justify-center font-black text-2xl snap-center transition-all duration-150 ${
                value === num 
                  ? 'text-indigo-600 scale-110 opacity-100' 
                  : 'text-slate-400 scale-90 opacity-40'
              }`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3 text-center">
        {label}
      </span>
    </div>
  );
};