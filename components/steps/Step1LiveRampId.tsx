import React from 'react';
import { usePixelStore } from '../../PixelContext';

const Step1LiveRampId: React.FC = () => {
  const { state, setLiveRampId } = usePixelStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and max 6 chars
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setLiveRampId(val);
  };

  const isValid = /^\d{6}$/.test(state.liveRampId);

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Enter LiveRamp ID</h3>
        <p className="text-sm text-zinc-500">
          Please enter the account-specific and site/media-specific 6-digit configuration ID provided by LiveRamp.
          If you're not sure, you can reach out to the Platform Solutions team for help.
        </p>
      </div>
      
      <div className="p-6 pt-0">
        <div className="grid w-full max-w-sm items-center gap-2">
            <label htmlFor="lrid" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                LiveRamp ID
            </label>
            <input
              id="lrid"
              type="text"
              value={state.liveRampId}
              onChange={handleChange}
              className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono tracking-widest
                ${!isValid && state.liveRampId.length > 0 
                    ? 'border-red-300 focus-visible:ring-red-500' 
                    : 'border-zinc-200'}`}
              placeholder="000000"
              autoFocus
            />
            {!isValid && state.liveRampId.length > 0 && (
                <p className="text-[0.8rem] text-red-500 font-medium">
                    ID must be exactly 6 digits.
                </p>
            )}
        </div>
      </div>
    </>
  );
};

export default Step1LiveRampId;