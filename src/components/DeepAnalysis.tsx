import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Loader2, ChevronRight, X, FileText, Sparkles, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { performDeepAnalysis } from '../services/gemini';

export const DeepAnalysis = ({ content, title, isSubscribed, user }: { content: string, title: string, isSubscribed: boolean, user: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!isSubscribed) return;
    setIsOpen(true);
    if (analysis || isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await performDeepAnalysis(content);
      setAnalysis(result || "Analysis unavailable.");
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysis("Error performing deep analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSubscribed) {
    return (
      <Link
        to="/intelligence"
        className="flex items-center gap-3 px-6 py-3 bg-tpl-ink/5 text-tpl-ink/40 text-[10px] font-bold uppercase tracking-widest border border-tpl-ink/10 hover:bg-tpl-ink hover:text-white transition-all group"
      >
        <Lock size={16} className="group-hover:scale-110 transition-transform" />
        <span>Deep Analysis Restricted</span>
        <Sparkles size={14} className="opacity-20" />
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={handleAnalyze}
        className="flex items-center gap-3 px-6 py-3 bg-tpl-ink text-white text-[10px] font-bold uppercase tracking-widest hover:bg-tpl-accent transition-colors group"
      >
        <Brain size={16} className="group-hover:scale-110 transition-transform" />
        <span>Perform Deep Analysis</span>
        <Sparkles size={14} className="text-tpl-accent opacity-60" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-tpl-ink/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[80vh] bg-tpl-bg border border-tpl-ink/10 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 md:p-8 bg-tpl-ink text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-tpl-accent flex items-center justify-center">
                    <Brain size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest">Deep Infrastructure Analysis</h3>
                    <p className="text-[10px] opacity-60 uppercase tracking-widest">High-Thinking Mode // {title}</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:opacity-60 transition-opacity">
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-6 py-20">
                    <Loader2 size={48} className="animate-spin text-tpl-accent" />
                    <div className="text-center space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-tpl-accent">Synthesizing Secondary Constraints...</p>
                      <p className="text-tpl-slate text-xs opacity-60">This may take a moment as the model performs deep reasoning.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* Original Context Summary */}
                    <div className="p-6 bg-tpl-ink/5 border-l-4 border-tpl-accent">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText size={16} className="text-tpl-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Original Context</span>
                      </div>
                      <p className="text-xs text-tpl-slate leading-relaxed italic">
                        Analyzing the physical constraints and infrastructure burdens of {title}.
                      </p>
                    </div>

                    {/* Analysis Result */}
                    <div className="markdown-body prose prose-sm max-w-none">
                      <Markdown>{analysis || ''}</Markdown>
                    </div>
                    
                    <div className="pt-12 border-t border-tpl-ink/5 flex justify-end">
                      <button 
                        onClick={() => setIsOpen(false)}
                        className="px-8 py-4 bg-tpl-ink text-white text-[10px] font-bold uppercase tracking-widest hover:bg-tpl-accent transition-colors"
                      >
                        Close Analysis
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
