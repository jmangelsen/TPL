import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlanCardProps {
  name: string;
  price: string;
  priceUnit: string;
  description: string;
  features: string[];
  ctaLabel: string;
  tier: string;
  highlight?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  name,
  price,
  priceUnit,
  description,
  features,
  ctaLabel,
  tier,
  highlight,
}) => {
  return (
    <div
      className={`relative flex flex-col p-8 bg-white/50 border transition-all duration-300 ${
        highlight
          ? 'border-tpl-ink shadow-xl scale-[1.02] md:scale-[1.05] z-10 bg-white'
          : 'border-tpl-ink/10 hover:border-tpl-ink/30'
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tpl-ink text-tpl-bg text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1">
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-tpl-slate text-sm">{priceUnit}</span>
        </div>
        <p className="text-tpl-slate text-sm leading-relaxed min-h-[40px]">
          {description}
        </p>
      </div>

      <div className="flex-grow mb-8">
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-tpl-slate">
              <Check size={16} className="text-tpl-ink mt-0.5 shrink-0" />
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        to={`/signup?tier=${tier}`}
        className={`w-full py-4 text-center text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 ${
          highlight
            ? 'bg-tpl-ink text-tpl-bg hover:bg-tpl-slate hover:shadow-lg active:scale-[0.98]'
            : 'bg-transparent border border-tpl-ink text-tpl-ink hover:bg-tpl-ink/5 active:scale-[0.98]'
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
};
