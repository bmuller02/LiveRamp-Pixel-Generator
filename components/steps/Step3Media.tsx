"use client";

import React, { useState, useEffect } from 'react';
import { usePixelStore } from '../../PixelContext';
import { usePartnerSearch } from '../../hooks/usePartnerSearch';
import { AD_SERVERS, FALLBACK_ERROR } from '../../constants';
import { useHasMounted } from '../../hooks/useHasMounted';

const Step3Media: React.FC = () => {
  const { state, setMediaPartner } = usePixelStore();
  const hasMounted = useHasMounted();
  
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (state.mediaPartner && AD_SERVERS[state.mediaPartner]) {
      setQuery(AD_SERVERS[state.mediaPartner].name);
    }
  }, []);

  const results = usePartnerSearch(query);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(true);
    setMediaPartner('');
  };

  const handleSelect = (name: string) => {
    const foundEntry = Object.entries(AD_SERVERS).find(([, def]) => def.name === name);
    if (foundEntry) {
      const [key] = foundEntry;
      setMediaPartner(key);
      setQuery(name);
      setIsTyping(false);
    }
  };

  if (!hasMounted) return null;

  const isError = results.length === 1 && results[0] === FALLBACK_ERROR;

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Select Ad Server</h3>
        <p className="text-sm text-zinc-500">
          Search for the DSP or Ad Server where this pixel will be implemented.
        </p>
      </div>

      <div className="p-6 pt-0">
        <div className="relative max-w-md">
            <label htmlFor="partner-search" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                Partner Name
            </label>
            
            <div className="relative" cmdk-input-wrapper="">
                <svg
                    className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                    id="partner-search"
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search partners (e.g. CM360)..."
                    autoComplete="off"
                    className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 pl-9 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
                        ${isError ? 'border-red-300 focus-visible:ring-red-500' : 'border-zinc-200'}`}
                />
            </div>

            {/* Popover Results */}
            {isTyping && query.length > 0 && (
                <div className="absolute z-50 w-full mt-1 rounded-md border border-zinc-200 bg-white shadow-md animate-in fade-in-0 zoom-in-95">
                    <div className="p-1">
                        {isError ? (
                             <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-3 text-sm text-red-600 bg-red-50">
                                {results[0]}
                             </div>
                        ) : (
                            results.map((name) => (
                                <div
                                    key={name}
                                    onClick={() => handleSelect(name)}
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
                                >
                                    {name}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            
            {/* Success State */}
            {!isTyping && state.mediaPartner && (
                 <div className="mt-2 text-[0.8rem] text-emerald-600 font-medium flex items-center gap-1.5">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Selected: {AD_SERVERS[state.mediaPartner]?.name}
                </div>
            )}
        </div>
      </div>
    </>
  );
};

export default Step3Media;