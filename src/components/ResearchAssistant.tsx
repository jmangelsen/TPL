import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, User, Loader2, MessageSquare, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { chatWithAssistant } from '../services/gemini';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const ResearchAssistant = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !isSubscribed) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(input, messages);
      const modelMessage: Message = { role: 'model', parts: [{ text: response || 'No response' }] };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Error connecting to research assistant. Please try again." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-tpl-ink text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group"
      >
        <MessageSquare size={24} />
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-tpl-ink text-white text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Research Assistant
        </span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 md:right-8 w-[calc(100vw-2rem)] md:w-[400px] h-[600px] max-h-[calc(100vh-8rem)] bg-tpl-bg border border-tpl-ink/10 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-tpl-ink text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-tpl-accent flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest">TPL Assistant</h3>
                  <p className="text-[8px] opacity-60 uppercase tracking-widest">Infrastructure Intelligence</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-60 transition-opacity">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!isSubscribed ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                  <div className="w-16 h-16 bg-tpl-ink/5 flex items-center justify-center rounded-full">
                    <Lock size={32} className="text-tpl-ink/20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Intelligence Restricted</h3>
                    <p className="text-tpl-slate text-xs leading-relaxed">
                      The Research Assistant is a subscriber-only tool for deep infrastructure analysis.
                    </p>
                  </div>
                  <Link 
                    to="/intelligence"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 bg-tpl-ink text-white text-[10px] font-bold uppercase tracking-widest hover:bg-tpl-accent transition-colors"
                  >
                    Access Intelligence
                  </Link>
                </div>
              ) : (
                <>
                  {messages.length === 0 && (
                    <div className="text-center py-10">
                      <Bot size={40} className="mx-auto text-tpl-ink/20 mb-4" />
                      <p className="text-tpl-slate text-xs leading-relaxed max-w-[200px] mx-auto">
                        Ask me about grid resilience, water constraints, or data center permitting.
                      </p>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-tpl-ink text-white' : 'bg-tpl-accent text-white'}`}>
                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={`max-w-[80%] p-4 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-tpl-ink/5' : 'bg-white border border-tpl-ink/5'}`}>
                        <div className="markdown-body">
                          <Markdown>{msg.parts[0].text}</Markdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-tpl-accent text-white flex items-center justify-center shrink-0">
                        <Bot size={16} />
                      </div>
                      <div className="p-4 bg-white border border-tpl-ink/5">
                        <Loader2 size={16} className="animate-spin text-tpl-accent" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-tpl-ink/5 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isSubscribed ? "Query infrastructure data..." : "Subscription required..."}
                  disabled={!isSubscribed}
                  className="flex-1 bg-tpl-bg border border-tpl-ink/10 px-4 py-2 text-xs focus:outline-none focus:border-tpl-accent transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !isSubscribed}
                  className="w-10 h-10 bg-tpl-ink text-white flex items-center justify-center hover:bg-tpl-accent transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
