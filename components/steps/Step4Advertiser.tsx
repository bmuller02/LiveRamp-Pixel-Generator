import React from 'react';
import { usePixelStore } from '../../PixelContext';

const Step4Advertiser: React.FC = () => {
  const { state, setAdvertiserName } = usePixelStore();

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Advertiser Name</h3>
        <p className="text-sm text-zinc-500">
          This is used for file naming; It does not influence the pixel script.
        </p>
      </div>

      <div className="p-6 pt-0">
        <div className="space-y-2 max-w-md">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Advertiser / Brand Name
            </label>
            <input
                type="text"
                value={state.advertiserName}
                onChange={(e) => setAdvertiserName(e.target.value)}
                placeholder="e.g. Nike, Honda"
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
        </div>
      </div>
    </>
  );
};

export default Step4Advertiser;