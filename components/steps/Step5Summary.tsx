"use client";

import React from 'react';
import * as XLSX from 'xlsx';
import { usePixelStore } from '../../PixelContext';
import DownloadButton from '../DownloadButton';
import { generateFileName, generatePixelString, generateHardcodeFileName, generateHardcodePixelRows } from '../../utils';
import { useHasMounted } from '../../hooks/useHasMounted';
import { AD_SERVERS, HARD_CODE_PARTNER_KEY } from '../../constants';

const Step5Summary: React.FC = () => {
  const { getConstructedState, state } = usePixelStore();
  const hasMounted = useHasMounted();
  const pixelState = getConstructedState();
    const isHardcode = state.pixelType === 'MEDIA' && state.mediaPartner === HARD_CODE_PARTNER_KEY;

  if (!hasMounted) return null;

  if (!pixelState) {
    return (
        <div className="p-6 text-red-500 font-medium">
            Error: State is incomplete.
        </div>
    );
  }

    const fileName = isHardcode
        ? generateHardcodeFileName(state.advertiserName)
        : generateFileName(pixelState);
    const pixelString = isHardcode ? '' : generatePixelString(pixelState);
    const partnerLabel = state.pixelType === 'MEDIA'
        ? (AD_SERVERS[state.mediaPartner]?.name ?? state.mediaPartner)
        : `${state.siteEvent.type} / ${state.siteEvent.name}`;

    const handleDownloadExcel = () => {
        const pixels = generateHardcodePixelRows(state.liveRampId, state.hardcodeRows);
        const rows = state.hardcodeRows.map((row, index) => ({
            'Advertiser ID': row.advertiserID,
            'Campaign ID': row.campaignID,
            'Site ID': row.siteID,
            'Creative ID': row.creativeID,
            'Placement ID': row.placementID,
            Pixel: pixels[index] ?? '',
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows, {
            header: ['Advertiser ID', 'Campaign ID', 'Site ID', 'Creative ID', 'Placement ID', 'Pixel'],
        });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pixels');
        const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = generateHardcodeFileName(state.advertiserName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

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
                         {partnerLabel}
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

          {!isHardcode && (
             <div>
                 <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2 block">Pixel Code</span>
                 <code className="block w-full rounded-md border border-zinc-900 bg-zinc-950 px-4 py-3 text-xs font-mono text-emerald-400 break-all leading-relaxed shadow-sm">
                  {pixelString}
                 </code>
             </div>
          )}
        
                <div className="pt-2 space-y-6">
                        {isHardcode ? (
                            <button
                                type="button"
                                onClick={handleDownloadExcel}
                                className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white bg-emerald-600 text-white hover:bg-emerald-700 h-11 px-8 shadow-sm"
                            >
                                Download .xlsx File
                            </button>
                        ) : (
                            <DownloadButton pixelState={pixelState} />
                        )}

            <div className="rounded-md bg-blue-50 p-4 border border-blue-100">
                <p className="text-sm text-blue-800 mb-3">
                    If you plan to implement this pixel you've just created, you MUST email a copy to the Platform Solutions team. Click the button below to get this email started.
                </p>
                <a
                    href="mailto:platformsolutions@horizonmedia.com?subject=New%20LiveRamp%20pixel%20created%20from%20generator&body=Hi%20Platform%20Solutions%20team%2C%0D%0A%0D%0APlease%20see%20attached%20for%20a%20new%20LiveRamp%20pixel%20I've%20created%20using%20the%20generator."
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-100 h-10 px-4 py-2 w-full sm:w-auto shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Email Platform Solutions
                </a>
            </div>
        </div>
      </div>
    </>
  );
};

export default Step5Summary;