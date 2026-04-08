import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Loader2, Download, Maximize2, Square } from 'lucide-react';
import { generateConceptImage } from '../services/gemini';

const ASPECT_RATIOS = [
  { label: '1:1', value: '1:1' },
  { label: '3:4', value: '3:4' },
  { label: '4:3', value: '4:3' },
  { label: '9:16', value: '9:16' },
  { label: '16:9', value: '16:9' },
  { label: '21:9', value: '21:9' }
];

export const ConceptVisualizer = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await generateConceptImage(prompt, aspectRatio);
      setImage(result);
    } catch (error) {
      console.error("Image gen error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-tpl-ink/10 p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tpl-accent mb-4 block">Generative Infrastructure Design</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Concept Visualizer</h2>
          <p className="text-tpl-slate text-sm mt-4 max-w-lg mx-auto leading-relaxed">
            Generate architectural concepts for sustainable, high-density AI data centers. Specify constraints like liquid cooling loops, modular nuclear integration, or urban verticality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Controls */}
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-tpl-steel block">Design Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A modular data center integrated into a vertical urban farm, featuring visible liquid cooling pipes and solar-integrated glass facade."
                className="w-full h-32 bg-tpl-bg border border-tpl-ink/10 p-4 text-xs focus:outline-none focus:border-tpl-accent transition-colors resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-tpl-steel block flex items-center gap-2">
                <Square size={14} />
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`py-2 text-[10px] font-bold border transition-all ${
                      aspectRatio === ratio.value 
                        ? 'bg-tpl-ink text-white border-tpl-ink' 
                        : 'bg-white text-tpl-ink border-tpl-ink/10 hover:border-tpl-ink/30'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-4 bg-tpl-ink text-white text-xs font-bold uppercase tracking-widest hover:bg-tpl-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Synthesizing Concept...
                </>
              ) : (
                <>
                  <ImageIcon size={16} />
                  Generate Visualization
                </>
              )}
            </button>
          </div>

          {/* Preview */}
          <div className="aspect-square bg-tpl-bg border border-tpl-ink/5 flex items-center justify-center relative overflow-hidden group">
            {image ? (
              <>
                <img 
                  src={image} 
                  alt="Generated concept" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-tpl-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="p-3 bg-white text-tpl-ink rounded-full hover:scale-110 transition-transform">
                    <Download size={20} />
                  </button>
                  <button className="p-3 bg-white text-tpl-ink rounded-full hover:scale-110 transition-transform">
                    <Maximize2 size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-10">
                <ImageIcon size={48} className="mx-auto text-tpl-ink/10 mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-tpl-steel opacity-60">
                  Concept Preview Area
                </p>
              </div>
            )}
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <Loader2 size={32} className="animate-spin text-tpl-accent" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-tpl-accent">
                  Rendering Neural Architecture...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
