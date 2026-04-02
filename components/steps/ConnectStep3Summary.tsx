import React from 'react';
import { usePixelStore } from '../../PixelContext';
import { CONNECT_AD_SERVERS } from '../../constants';
import { generateConnectFileName } from '../../utils';
import { useHasMounted } from '../../hooks/useHasMounted';

const ConnectStep3Summary: React.FC = () => {
  const { state, getConnectPixelUrl } = usePixelStore();
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  const adServer = CONNECT_AD_SERVERS.find(s => s.key === state.connectAdServerKey);
  const pixelUrl = getConnectPixelUrl();
  const fileName = generateConnectFileName(state.connectAdvertiserPixel, adServer?.displayName ?? '');

  const handleDownload = () => {
    const blob = new Blob([pixelUrl], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
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
          Your Connect pixel is ready. Please review the details below.
        </p>
      </div>

      <div className="p-6 pt-0 space-y-6">
        {/* Summary Card */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div>
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Advertiser</span>
              <div className="font-medium text-zinc-900 mt-0.5">{state.connectAdvertiserDisplay}</div>
            </div>
            <div>
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Ad Server</span>
              <div className="font-medium text-zinc-900 mt-0.5">{adServer?.displayName ?? ''}</div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-200/60">
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2 block">Final Filename</span>
            <code className="block w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-mono text-zinc-700 break-all">
              {fileName}
            </code>
          </div>
        </div>

        {/* Pixel Code Preview */}
        <div>
          <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2 block">Pixel Code</span>
          <code className="block w-full rounded-md border border-zinc-900 bg-zinc-950 px-4 py-3 text-xs font-mono text-emerald-400 break-all leading-relaxed shadow-sm">
            {pixelUrl}
          </code>
        </div>

        <div className="pt-2 space-y-6">
          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white bg-emerald-600 text-white hover:bg-emerald-700 h-11 px-8 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download .txt File
          </button>

          {/* Email Notice */}
          <div className="rounded-md bg-blue-50 p-4 border border-blue-100">
            <p className="text-sm text-blue-800 mb-3">
              If you plan to implement this pixel you've just created, you MUST email a copy to the Platform Solutions team. Click the button below to get this email started.
            </p>
            <a
              href="mailto:platformsolutions@horizonmedia.com?subject=New%20Connect%20pixel%20created%20from%20generator&body=Hi%20Platform%20Solutions%20team%2C%0D%0A%0D%0APlease%20see%20attached%20for%20a%20new%20Connect%20pixel%20I've%20created%20using%20the%20generator."
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

export default ConnectStep3Summary;
