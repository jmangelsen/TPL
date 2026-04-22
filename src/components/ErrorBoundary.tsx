import React, { Component, ErrorInfo, ReactNode } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const recentlyLogged = new Set<string>();
let sessionErrorCount = 0;
const SESSION_MAX = 20;

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    if (sessionErrorCount >= SESSION_MAX) return;
    sessionErrorCount++;
    
    const msgLower = error.message.toLowerCase();
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (msgLower.includes('firestore') || msgLower.includes('auth') || msgLower.includes('payment') || msgLower.includes('crash')) {
      severity = 'critical';
    } else if (msgLower.includes('undefined') || msgLower.includes('not a function') || msgLower.includes('cannot read')) {
      severity = 'high';
    } else if (msgLower.includes('network') || msgLower.includes('fetch') || msgLower.includes('timeout') || msgLower.includes('404') || msgLower.includes('500')) {
      severity = 'medium';
    }

    const pathname = new URL(window.location.href).pathname;
    const raw = `${error.message}|${pathname}`.toLowerCase();
    let h = 0;
    for (let i = 0; i < raw.length; i++) {
      h = Math.imul(31, h) + raw.charCodeAt(i) | 0;
    }
    const dedupKey = `e_${Math.abs(h).toString(36)}`;

    // Rate limit: identical errors trigger max once per minute
    if (recentlyLogged.has(dedupKey)) return;
    recentlyLogged.add(dedupKey);
    setTimeout(() => recentlyLogged.delete(dedupKey), 60000);

    const errorsRef = collection(db, 'site_errors');
    const q = query(errorsRef, where('dedupKey', '==', dedupKey));

    getDocs(q).then(snapshot => {
      if (!snapshot.empty) {
        // Exists, update it
        const existingDoc = snapshot.docs[0];
        const currentCount = existingDoc.data().occurrenceCount || 1;
        const now = new Date().toISOString();
        
        updateDoc(doc(db, 'site_errors', existingDoc.id), {
          occurrenceCount: currentCount + 1,
          lastSeenAt: now,
          status: 'pending',
          resolvedAt: null,
          resolvedBy: null,
          resolutionNote: null
        }).catch(err => console.error("Failed to update error in Firestore:", err));
      } else {
        const now = new Date().toISOString();
        // Log new error to Firestore
        addDoc(errorsRef, {
          message: error.message,
          stack: error.stack,
          timestamp: now,
          firstSeenAt: now,
          lastSeenAt: now,
          url: window.location.href,
          severity,
          dedupKey,
          occurrenceCount: 1,
          status: 'pending',
          resolvedAt: null,
          resolvedBy: null,
          resolutionNote: null
        }).catch(err => console.error("Failed to log error to Firestore:", err));
      }
    }).catch(err => console.error("Failed to query existing errors:", err));
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1a2633] flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-bold tracking-tight uppercase">Something went wrong</h1>
            <p className="text-slate-300 font-serif italic">
              The application encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-tpl-ink text-tpl-bg font-bold uppercase tracking-widest hover:bg-tpl-accent transition-all"
            >
              Reload Application
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 p-4 bg-tpl-ink/5 text-left text-[10px] overflow-auto max-h-48 border border-white/10">
                {this.state.error?.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
