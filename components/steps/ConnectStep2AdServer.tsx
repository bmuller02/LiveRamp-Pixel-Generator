import React from 'react';
import { usePixelStore } from '../../PixelContext';
import { CONNECT_AD_SERVERS } from '../../constants';

const ConnectStep2AdServer: React.FC = () => {
  const { state, setConnectAdServer } = usePixelStore();

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
            const isDisabled = state.connectAdServerKey !== '' && !isSelected;

            return (
              <label
                key={server.key}
                className={`flex items-center gap-3 rounded-lg border p-4 transition-all cursor-pointer
                  ${isSelected
                    ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                    : isDisabled
                      ? 'border-zinc-100 bg-zinc-50/50 opacity-50 cursor-not-allowed'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    return;
                  }
                  setConnectAdServer(server.key);
                }}
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors
                  ${isSelected ? 'border-zinc-900' : 'border-zinc-300'}`}
                >
                  {isSelected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-900" />
                  )}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-zinc-900' : isDisabled ? 'text-zinc-400' : 'text-zinc-700'}`}>
                  {server.displayName}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ConnectStep2AdServer;
