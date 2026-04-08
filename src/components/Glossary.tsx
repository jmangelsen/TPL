import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, BookOpen } from 'lucide-react';
import { glossaryTerms, GlossaryTerm } from '../data/glossary';

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Glossary: React.FC<GlossaryProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(glossaryTerms.map(t => t.category));
    return Array.from(cats);
  }, []);

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory ? term.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-tpl-ink/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:max-w-md bg-tpl-bg z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-4 md:p-6 border-b border-tpl-ink/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-tpl-accent" />
                <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight">Glossary of Terms</h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 md:p-2 hover:bg-tpl-ink/5 rounded-full transition-colors"
                aria-label="Close glossary"
              >
                <X size={24} className="md:w-5 md:h-5" />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tpl-steel" size={18} />
                <input
                  type="text"
                  placeholder="Search terms or definitions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 md:py-3 bg-white border border-tpl-ink/10 focus:outline-none focus:border-tpl-accent transition-colors text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-4 py-2 md:px-3 md:py-1 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    !activeCategory ? 'bg-tpl-ink text-tpl-bg border-tpl-ink' : 'border-tpl-ink/10 text-tpl-steel hover:border-tpl-ink/30'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 md:px-3 md:py-1 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      activeCategory === cat ? 'bg-tpl-ink text-tpl-bg border-tpl-ink' : 'border-tpl-ink/10 text-tpl-steel hover:border-tpl-ink/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
              {filteredTerms.length > 0 ? (
                filteredTerms.map((term, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-tpl-accent px-1.5 py-0.5 bg-tpl-accent/5">
                        {term.category}
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold mb-2 group-hover:text-tpl-accent transition-colors">
                      {term.term}
                    </h3>
                    <p className="text-tpl-slate text-sm leading-relaxed">
                      {term.definition}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-tpl-steel text-sm italic">No terms found matching your search.</p>
                </div>
              )}
            </div>

            <div className="p-4 md:p-6 border-t border-tpl-ink/10 bg-tpl-ink/5">
              <p className="text-[10px] text-tpl-steel uppercase tracking-widest text-center">
                The Physical Layer Research Database
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
