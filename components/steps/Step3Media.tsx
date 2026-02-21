"use client";

import React from 'react';
import { usePixelStore } from '../../PixelContext';
import { AD_SERVERS } from '../../constants';
import { useHasMounted } from '../../hooks/useHasMounted';

const Step3Media: React.FC = () => {
  const { state, setMediaPartner } = usePixelStore();
  const hasMounted = useHasMounted();
  const partners = React.useMemo(() => Object.entries(AD_SERVERS), []);

  if (!hasMounted) return null;

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Specify Ad Server / Partner</h3>
        <p className="text-sm text-zinc-500">
          Select the Ad Server or Partner where this pixel will be hosted.
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="max-w-2xl">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-3 block">
            Partner Name
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {partners.map(([key, def]) => {
              const isSelected = state.mediaPartner === key;
              const isDimmed = state.mediaPartner !== '' && !isSelected;

              return (
                <label
                  key={key}
                  className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors cursor-pointer
                    ${isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-zinc-200 bg-white text-zinc-900'}
                    ${isDimmed ? 'opacity-50' : 'hover:border-zinc-300'}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => setMediaPartner(isSelected ? '' : key)}
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
                  />
                  <span className="select-none">{def.name}</span>
                </label>
              );
            })}
          </div>

          {state.mediaPartner && (
            <div className="mt-3 text-[0.8rem] text-emerald-600 font-medium flex items-center gap-1.5">
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