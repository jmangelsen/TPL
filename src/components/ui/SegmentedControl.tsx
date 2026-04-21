import React from 'react';

interface SegmentedControlProps<T extends string> {
  options: T[];
  labels?: Record<T, string>;
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  scrollableOnMobile?: boolean;
  variant?: 'dark' | 'light';
  disabled?: boolean;
}

export function SegmentedControl<T extends string>({
  options,
  labels,
  value,
  onChange,
  size = 'md',
  scrollableOnMobile = false,
  variant = 'dark',
  disabled = false,
}: SegmentedControlProps<T>) {
  const isDark = variant === 'dark';

  const containerClasses = `
    flex p-1 ${isDark ? 'bg-[#0f1a24] border-[#262523]' : 'bg-[#0f1a24] border-white/5'} border rounded-sm
    ${scrollableOnMobile ? 'overflow-x-auto no-scrollbar max-w-full' : ''}
    ${disabled ? 'opacity-80 pointer-events-none' : ''}
  `;

  const buttonClasses = (isActive: boolean) => `
    px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap rounded-[1px]
    ${isActive 
      ? isDark 
        ? 'bg-[#0f1a24] text-[#171614] border border-white/5 shadow-sm' 
        : 'bg-[#171614] text-[#f9f8f4] border border-[#262523] shadow-sm'
      : isDark
        ? disabled ? 'text-[#5f5b54]' : 'text-[#797876] hover:text-white border border-transparent'
        : disabled ? 'text-slate-400' : 'text-slate-500 hover:text-slate-900 border border-transparent'
    }
    ${disabled ? 'cursor-not-allowed' : ''}
  `;

  return (
    <div className={`relative group ${disabled ? 'cursor-not-allowed' : ''}`}>
      <div className={containerClasses}>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => !disabled && onChange(option)}
            disabled={disabled}
            className={buttonClasses(value === option)}
          >
            {labels ? labels[option] : option}
          </button>
        ))}
      </div>
      {scrollableOnMobile && (
        <>
          <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l ${isDark ? 'from-[#1c1b19]' : 'from-white'} to-transparent pointer-events-none md:hidden`} />
          <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r ${isDark ? 'from-[#1c1b19]' : 'from-white'} to-transparent pointer-events-none md:hidden`} />
        </>
      )}
    </div>
  );
}
