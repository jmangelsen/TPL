import React from 'react';
import { Link } from 'react-router-dom';

interface TopoTileProps {
  index: number;
  total?: number;
  title: string;
  eyebrow?: string;
  description: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ElementType;
  className?: string;
  variant?: 'light' | 'dark';
}

export function TopoTile({ 
  index, 
  total = 5, 
  title, 
  eyebrow, 
  description, 
  href, 
  onClick, 
  icon: Icon,
  className = "",
  variant = 'light'
}: TopoTileProps) {
  // Calculate offset. If we have a row of tiles, we want them to look continuous.
  // We use a step size based on the index.
  const step = 100 / (total > 1 ? total - 1 : 1);
  const basePos = index * (step * 0.5); // Spread it out across the 200% width
  
  const content = (
    <div className={`relative h-full border transition-all duration-300 overflow-hidden group ${
      variant === 'dark' 
        ? 'bg-[#0f1a24] border-white/5 hover:border-[#3b82f6]/30' 
        : 'bg-[#0f1a24] border-white/5 hover:border-white/30'
    } ${className}`}>
      {/* Topography Overlay */}
      <div 
        className="topo-tile-bg" 
        style={{ 
          '--topo-x': `${basePos}%`,
          opacity: variant === 'dark' ? 0.15 : 0.03 
        } as React.CSSProperties} 
      />
      
      <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
        {eyebrow && (
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block ${
            variant === 'dark' ? 'text-tpl-monitor-text-secondary' : 'text-slate-400'
          }`}>
            {eyebrow}
          </span>
        )}
        
        {Icon && (
          <div className={`mb-4 md:mb-6 transition-colors ${
            variant === 'dark' ? 'text-tpl-monitor-accent' : 'text-slate-300 group-hover:text-tpl-accent'
          }`}>
            <Icon size={28} md:size={32} strokeWidth={1.5} />
          </div>
        )}
        
        <h3 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 tracking-tight ${
          variant === 'dark' ? 'text-white' : 'text-white'
        }`}>
          {title}
        </h3>
        
        <p className={`text-xs md:text-sm leading-relaxed ${
          variant === 'dark' ? 'text-tpl-monitor-text-secondary' : 'text-slate-300'
        }`}>
          {description}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block h-full">
        {content}
      </Link>
    );
  }
  
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full h-full text-left block">
        {content}
      </button>
    );
  }

  return content;
}
