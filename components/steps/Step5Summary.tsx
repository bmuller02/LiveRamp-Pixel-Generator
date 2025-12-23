"use client";

import React from 'react';
import { usePixelStore } from '../../PixelContext';
import DownloadButton from '../DownloadButton';
import { generateFileName, generatePixelString } from '../../utils';
import { useHasMounted } from '../../hooks/useHasMounted';

const Step5Summary: React.FC = () => {
  const { getConstructedState, state } = usePixelStore();
  const hasMounted = useHasMounted();
  const pixelState = getConstructedState();

  if (!hasMounted) return null;

  if (!pixelState) {
    return (
        <div className="p-6 text-red-500 font-medium">
            Error: State is incomplete.
        </div>
    );
  }

  const fileName = generateFileName(pixelState);
  const pixelString = generatePixelString(pixelState);

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Review & Download</h3>
        <p className="text-sm text-zinc-500">
          Your pixel is ready. Please review the details below.
        </p>
      </div>

      <div className="p-6 pt-0 space-y-6">
        {/* Summary Card */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Advertiser</span>
                    <div className="font-medium text-zinc-900 mt-0.5">{state.advertiserName}</div>
                </div>
                <div>
                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">LiveRamp ID</span>
                    <div className="font-mono font-medium text-zinc-900 mt-0.5">{state.liveRampId}</div>
                </div>
                <div>
                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Type</span>
                    <div className="font-medium text-zinc-900 mt-0.5">{state.pixelType}</div>
                </div>
                <div>
                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Context</span>
                    <div className="font-medium text-zinc-900 mt-0.5">
                         {state.pixelType === 'MEDIA' ? state.mediaPartner : `${state.siteEvent.type} / ${state.siteEvent.name}`}
                    </div>
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-zinc-200/60">
                <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2 block">Final Filename</span>
                <code className="block w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-mono text-zinc-700 break-all">
                    {fileName}
                </code>
            </div>
        </div>

        <div>
           <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2 block">Pixel Code</span>
           <code className="block w-full rounded-md border border-zinc-900 bg-zinc-950 px-4 py-3 text-xs font-mono text-emerald-400 break-all leading-relaxed shadow-sm">
            {pixelString}
           </code>
        </div>
        
        <div className="pt-2">
            <DownloadButton pixelState={pixelState} />
        </div>
      </div>
    </>
  );
};

export default Step5Summary;