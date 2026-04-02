import React from 'react';
import { usePixelStore } from '../../PixelContext';
import { CONNECT_ADVERTISERS } from '../../constants';

const ConnectStep1Advertiser: React.FC = () => {
  const { state, setConnectAdvertiser } = usePixelStore();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = CONNECT_ADVERTISERS.find(a => a.pixelName === e.target.value);
    if (selected) {
      setConnectAdvertiser(selected.displayName, selected.pixelName);
    } else {
      setConnectAdvertiser('', '');
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Select Advertiser</h3>
        <p className="text-sm text-zinc-500">
          Choose the advertiser for which you are generating the Connect pixel.
        </p>
      </div>

      <div className="p-6 pt-0">
        <div className="space-y-2 max-w-md">
          <label htmlFor="connect-advertiser" className="text-sm font-medium leading-none">
            Advertiser
          </label>
          <select
            id="connect-advertiser"
            value={state.connectAdvertiserPixel}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">-- Select an advertiser --</option>
            {CONNECT_ADVERTISERS.map((adv) => (
              <option key={adv.pixelName} value={adv.pixelName}>
                {adv.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default ConnectStep1Advertiser;
