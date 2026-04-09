import React from 'react';
import { usePixelStore } from '../../PixelContext';
import {
  CONNECT_AD_SERVERS,
  CONNECT_AMAZON_ADAPTER_KEY,
  CONNECT_AMAZON_STANDARD_KEY,
  AMAZON_INVENTORIES_GUIDE_PATH,
} from '../../constants';

const ConnectStep2AdServer: React.FC = () => {
  const { state, setConnectAdServer, acknowledgeConnectAmazonWarning } = usePixelStore();
  const showAmazonWarning = state.connectAdServerKey === CONNECT_AMAZON_ADAPTER_KEY && !state.connectAmazonWarningAcknowledged;
  const handleDownloadGuide = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const link = document.createElement('a');
    link.href = AMAZON_INVENTORIES_GUIDE_PATH;
    link.download = 'amazon_ad_inventories.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const warningIframeDoc = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        margin: 0;
        padding: 16px;
        background: #fef2f2;
        color: #7f1d1d;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
        font-size: 14px;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    You are looking to apply Connect to Amazon's FireTV, Display, or OLV inventories. These inventories require the use of their server-to-server (S2S) "Adapter URL" solution instead of the traditional Connect pixel, due to environment limitations and privacy standards. Therefore, the script you will see after acknowledging this message will not look like a traditional Connect pixel. To use it, simply send the Connect Adapter URL to Amazon instructing them on which placements to append it.
  </body>
</html>`;

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Select Ad Server</h3>
        <p className="text-sm text-zinc-500">
          Choose the ad server in which this pixel will be hosted.
        </p>
      </div>

      <div className="p-6 pt-0">
        <div className="space-y-3">
          {CONNECT_AD_SERVERS.map((server) => {
            const isSelected = state.connectAdServerKey === server.key;
            const showAmazonHelp = server.key === CONNECT_AMAZON_ADAPTER_KEY || server.key === CONNECT_AMAZON_STANDARD_KEY;

            return (
              <div
                key={server.key}
                className={`flex items-center gap-3 rounded-lg border p-4 transition-all cursor-pointer
                  ${isSelected
                    ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                onClick={() => setConnectAdServer(server.key)}
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors
                  ${isSelected ? 'border-zinc-900' : 'border-zinc-300'}`}
                >
                  {isSelected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-900" />
                  )}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-zinc-900' : 'text-zinc-700'}`}>
                  {server.displayName}
                </span>

                {showAmazonHelp && (
                  <div className="ml-auto relative group">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={handleDownloadGuide}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600"
                      aria-label="Download Amazon inventory guide"
                    >
                      <span className="text-xs font-bold">?</span>
                    </button>

                    <div className="pointer-events-none absolute right-0 top-7 z-10 hidden w-72 rounded-md border border-zinc-200 bg-white p-3 text-xs leading-relaxed text-zinc-700 shadow-lg group-hover:block">
                      Click to download a guide explaining the differences between Amazon ad inventories.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showAmazonWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="amazon-warning-title"
            className="w-full max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 shadow-xl"
          >
            <h4 id="amazon-warning-title" className="text-lg font-semibold text-red-900">
              FYI
            </h4>
            <iframe
              title="Amazon inventory warning"
              srcDoc={warningIframeDoc}
              className="mt-3 h-44 w-full rounded-md border border-red-200 bg-red-50"
            />

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={acknowledgeConnectAmazonWarning}
                className="inline-flex items-center justify-center rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
              >
                Acknowledged
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectStep2AdServer;
