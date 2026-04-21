import React from 'react';
import { Link } from 'react-router-dom';
import { SubscribeForm } from './SubscribeForm';

interface UnderDevelopmentProps {
  title: string;
  description?: string;
}

export const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({ title, description }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      <div className="flex-grow flex items-center justify-center relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #0D0D0D 0%, #171412 40%, #1E1810 70%, #0D0D0D 100%)'
        }} />
        
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="px-4 py-1.5 border border-[#C49A52] text-[#C49A52] text-[11px] uppercase tracking-[0.15em] rounded-sm">
            IN DEVELOPMENT
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#E8E0D4] mt-6 tracking-tight">
            {title}
          </h1>
          
          <p className="text-base text-[#9A8C7A] tracking-[0.05em] mt-3">
            Launching June 1, 2026
          </p>
          
          <div className="w-12 h-px bg-[#C49A52] opacity-40 my-8" />
          
          {description && (
            <p className="text-base text-[#9A8C7A] max-w-[480px] leading-relaxed mb-8">
              {description}
            </p>
          )}
          
          <button 
            onClick={() => {
              // Trigger newsletter signup modal/form
              const event = new CustomEvent('open-newsletter-signup', { detail: { source: 'launch-notify' } });
              window.dispatchEvent(event);
            }}
            className="px-8 py-4 border border-[#C49A52] text-[#C49A52] text-xs font-bold uppercase tracking-widest hover:bg-[#C49A52] hover:text-black transition-colors"
          >
            NOTIFY ME ON LAUNCH →
          </button>
        </div>
      </div>
    </div>
  );
};
