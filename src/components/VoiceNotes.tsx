import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Loader2, FileText, Trash2, Copy, Check } from 'lucide-react';
import { transcribeAudio } from '../services/gemini';

export const VoiceNotes = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsTranscribing(true);
          try {
            const text = await transcribeAudio(base64Audio);
            setTranscription(text || "No transcription available.");
          } catch (error) {
            console.error("Transcription error:", error);
            setTranscription("Error transcribing audio. Please try again.");
          } finally {
            setIsTranscribing(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const copyToClipboard = () => {
    if (transcription) {
      navigator.clipboard.writeText(transcription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-tpl-bg border border-tpl-ink/10 p-8 md:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tpl-accent mb-4 block">Field Research Tools</span>
          <h2 className="text-3xl font-bold tracking-tight">Voice Research Notes</h2>
          <p className="text-tpl-slate text-sm mt-4 leading-relaxed">
            Record field observations or research thoughts. Our AI will transcribe and format them into structured research notes.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Recording Button */}
          <div className="relative">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
                isRecording 
                  ? 'bg-red-500 text-white scale-110 animate-pulse' 
                  : 'bg-tpl-ink text-white hover:bg-tpl-accent'
              } disabled:opacity-50`}
            >
              {isRecording ? <Square size={32} /> : <Mic size={32} />}
            </button>
            {isRecording && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  Recording...
                </span>
              </div>
            )}
          </div>

          {/* Transcription Area */}
          <AnimatePresence mode="wait">
            {isTranscribing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col items-center gap-4 py-12"
              >
                <Loader2 size={32} className="animate-spin text-tpl-accent" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-tpl-accent">
                  Transcribing Research Note...
                </p>
              </motion.div>
            ) : transcription ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-4"
              >
                <div className="flex items-center justify-between border-b border-tpl-ink/10 pb-4">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-tpl-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Transcription Result</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-tpl-ink/5 transition-colors text-tpl-steel hover:text-tpl-ink"
                    >
                      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                    <button 
                      onClick={() => setTranscription(null)}
                      className="p-2 hover:bg-tpl-ink/5 transition-colors text-tpl-steel hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="bg-white border border-tpl-ink/5 p-6 text-sm leading-relaxed text-tpl-slate whitespace-pre-wrap font-serif italic">
                  {transcription}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
