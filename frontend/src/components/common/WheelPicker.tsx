import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';

let audioCtx: AudioContext | null = null;

const playIOSClick = () => {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();

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

    if (navigator.vibrate) navigator.vibrate(2);
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
  const [localValue, setLocalValue] = useState(value);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);
  const ITEM_HEIGHT = 48;

  const range = useMemo(() => Array.from({ length: max - min + 1 }, (_, i) => min + i), [min, max]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const index = Math.round(scrollRef.current.scrollTop / ITEM_HEIGHT);
    const newValue = range[index];
    
    if (newValue !== undefined && newValue !== localValue) {
      setLocalValue(newValue);
      if (!isInitialMount.current) playIOSClick();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => onChange(newValue), 150);
    }
  }, [range, localValue, onChange]);

  useEffect(() => {
    if (value !== localValue && !isDragging.current) {
      setLocalValue(value);
      if (scrollRef.current) {
        const index = range.indexOf(value);
        scrollRef.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
      }
    }
  }, [value, range]);

  useEffect(() => {
    if (scrollRef.current) {
      const index = range.indexOf(value);
      scrollRef.current.scrollTop = index * ITEM_HEIGHT;
      const timer = setTimeout(() => { isInitialMount.current = false; }, 150);
      return () => clearTimeout(timer);
    }
  }, []); 

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || !scrollRef.current) return; 
    scrollRef.current.setPointerCapture(e.pointerId);
    isDragging.current = true;
    hasDragged.current = false;
    startY.current = e.clientY;
    startScrollTop.current = scrollRef.current.scrollTop;
    scrollRef.current.style.scrollSnapType = 'none';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || !isDragging.current || !scrollRef.current) return;
    const distanceMoved = e.clientY - startY.current;
    if (Math.abs(distanceMoved) > 3) hasDragged.current = true; 
    scrollRef.current.scrollTop = startScrollTop.current - distanceMoved;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || !isDragging.current || !scrollRef.current) return;
    scrollRef.current.releasePointerCapture(e.pointerId);
    isDragging.current = false;
    scrollRef.current.style.scrollSnapType = 'y mandatory';
  };

  const handleItemClick = (num: number) => {
    if (hasDragged.current || !scrollRef.current) return; 
    const index = range.indexOf(num);
    scrollRef.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative h-[144px] w-24 md:w-28 overflow-hidden bg-slate-50 dark:bg-surface-darker rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner group">
        <div className="absolute top-1/2 left-0 w-full h-[48px] -translate-y-1/2 border-y-2 border-primary bg-primary/10 pointer-events-none z-10 box-border" />
        <div className="absolute top-0 left-0 w-full h-[48px] bg-gradient-to-b from-slate-50 dark:from-surface-darker to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-full h-[48px] bg-gradient-to-t from-slate-50 dark:from-surface-darker to-transparent pointer-events-none z-10" />

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'pan-y' }}
          className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar py-[48px] scroll-smooth desktop-grab"
        >
          {range.map((num) => (
            <div 
              key={num}
              onClick={() => handleItemClick(num)} 
              className={`h-[48px] flex items-center justify-center font-black text-2xl snap-center transition-all duration-75 cursor-pointer ${
                localValue === num 
                  ? 'text-primary scale-110 opacity-100' 
                  : 'text-slate-400 dark:text-slate-500 scale-90 opacity-40 hover:opacity-60'
              }`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-3 text-center">
        {label}
      </span>
    </div>
  );
};