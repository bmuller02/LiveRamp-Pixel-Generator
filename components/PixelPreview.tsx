"use client";

import React, { useEffect, useState } from 'react';
import { usePixelStore } from '../PixelContext';
import { generatePixelString } from '../utils';
import { useHasMounted } from '../hooks/useHasMounted';

// Simple SVG Icons
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

const PixelPreview: React.FC = () => {
  const { getConstructedState, state } = usePixelStore();
  const hasMounted = useHasMounted();
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const pixelState = getConstructedState();

  useEffect(() => {
    if (pixelState) {
      setUrl(generatePixelString(pixelState));
     } else if (state.liveRampId && state.liveRampId.length === 6) {
       setUrl(`<img src="https://di.rlcdn.com/${state.liveRampId}.gif?pdata=..."/>`);
    } else {
       setUrl(`<img src="https://di.rlcdn.com/[ID].gif?pdata=..."/>`);
    }
  }, [pixelState, state.liveRampId]);

  const handleCopy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasMounted) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200 shadow-sm supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* URL Display */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 overflow-hidden">
            <span className="hidden sm:inline-block text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
              Preview
            </span>
            <div className="flex-1 bg-zinc-100/50 border border-zinc-200 rounded px-3 py-1.5 overflow-x-auto no-scrollbar">
              <code className="text-sm font-mono text-emerald-600 whitespace-nowrap">
                {url}
              </code>
            </div>
        </div>

        {/* Copy Button */}
        <button 
            onClick={handleCopy}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all active:scale-95 border
              ${copied 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300'
              }`}
            title="Copy Pixel URL"
        >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>

      </div>
    </div>
  );
};

export default PixelPreview;