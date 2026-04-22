import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Zap, Factory, CircleDot } from 'lucide-react';
import { searchFeatures, type SearchResult } from '../../lib/searchIndex';

interface Props {
  onSelect: (result: SearchResult) => void;
}

export function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  
  // Debounce input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(t);
  }, [query]);
  
  const results = useMemo(() => searchFeatures(debounced), [debounced]);
  
  // Flat list of results for keyboard navigation
  const flat = useMemo(
    () => [...results.plants, ...results.substations, ...results.transmission],
    [results]
  );
  
  useEffect(() => { setActiveIdx(0); }, [debounced]);
  
  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  
  // Global shortcut: Cmd+K / Ctrl+K focuses search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 100);
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flat[activeIdx]) pick(flat[activeIdx]);
    } else if (e.key === 'Escape') {
      setExpanded(false);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };
  
  const pick = (r: SearchResult) => {
    onSelect(r);
    setExpanded(false);
    setIsOpen(false);
    setQuery('');
  };
  
  const iconFor = (t: string) => {
    if (t === 'plant') return <Factory size={14} />;
    if (t === 'substation') return <CircleDot size={14} />;
    return <Zap size={14} />;
  };
  
  const colorFor = (t: string) => {
    if (t === 'plant') return '#F59E0B';
    if (t === 'substation') return '#FFFFFF';
    return '#3B82F6';
  };
  
  // Render a result row, tracking flat-index for keyboard highlight
  let flatCursor = 0;
  const renderGroup = (title: string, items: SearchResult[]) => {
    if (items.length === 0) return null;
    return (
      <div>
        <div style={{
          padding: '4px 12px', fontSize: 10, fontWeight: 600,
          color: '#64748B', textTransform: 'uppercase', letterSpacing: 1,
          background: 'rgba(255,255,255,0.02)'
        }}>{title}</div>
        {items.map((r) => {
          const idx = flatCursor++;
          const active = idx === activeIdx;
          return (
            <button
              key={`${r.type}-${r.id}-${idx}`}
              onClick={() => pick(r)}
              onMouseEnter={() => setActiveIdx(idx)}
              style={{
                width: '100%', textAlign: 'left', border: 'none',
                background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                padding: '8px 12px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                color: '#E2E8F0', fontSize: 13
              }}
            >
              <span style={{ color: colorFor(r.type), flexShrink: 0 }}>
                {iconFor(r.type)}
              </span>
              <span style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.label}
                </div>
                {r.sublabel && (
                  <div style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.sublabel}
                  </div>
                )}
              </span>
            </button>
          );
        })}
      </div>
    );
  };
  
  const showDropdown = expanded && isOpen && debounced.length >= 2;
  
  if (!expanded) {
    return (
      <button 
        onClick={() => setExpanded(true)}
        style={{
          position: 'absolute', bottom: 16, left: 230, zIndex: 10,
          width: 40, height: 40, background: '#0a0a0c', border: '1px solid #222',
          borderRadius: 8, color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
        }}
        title="Search infrastructure"
      >
        <Search size={18} color="#fff" />
      </button>
    );
  }
  
  return (
    <div ref={rootRef} style={{
      position: 'absolute', bottom: 16, left: 230, zIndex: 10,
      width: 380, maxWidth: 'calc(100vw - 250px)'
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(11,18,32,0.95)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, padding: '8px 12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
      }}>
        <Search size={16} color="#64748B" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search plants, substations, lines… (⌘K)"
          style={{
            flex: 1, background: 'transparent', border: 'none',
            outline: 'none', color: '#E2E8F0', fontSize: 13
          }}
        />
        <button onClick={() => setExpanded(false)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <X size={14} />
        </button>
      </div>
      
      {showDropdown && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 0, width: '100%', marginBottom: 6,
          background: 'rgba(11,18,32,0.98)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
          maxHeight: 420, overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
          {results.total === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#64748B', fontSize: 13 }}>
              No matches for "{debounced}"
            </div>
          ) : (
            <>
              {renderGroup('Power Plants', results.plants)}
              {renderGroup('Substations', results.substations)}
              {renderGroup('Transmission Lines', results.transmission)}
              <div style={{
                padding: '6px 12px', fontSize: 10, color: '#475569',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', justifyContent: 'space-between'
              }}>
                <span>↑↓ navigate · ↵ select · Esc close</span>
                <span>{results.total} result{results.total === 1 ? '' : 's'}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
