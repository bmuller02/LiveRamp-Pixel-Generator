import React from 'react';
import { usePixelStore } from '../../PixelContext';

const Step3Site: React.FC = () => {
  const { state, setSiteEvent } = usePixelStore();
    const isEventTypeSelected = state.siteEvent.type !== '';
    const eventNameOptions = React.useMemo(() => {
        switch (state.siteEvent.type) {
            case 'view':
                return ['{{page name macro}}'];
            case 'click':
                return ['{{button click macro}}'];
            case 'custom':
                return [];
            default:
                return [];
        }
    }, [state.siteEvent.type]);
    const isPresetName = eventNameOptions.includes(state.siteEvent.name);
    const eventNameValue = isPresetName ? state.siteEvent.name : 'custom';
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextType = e.target.value;
        setSiteEvent('type', nextType);
        setSiteEvent('name', '');
    };

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Configure Site Pixel Parameters</h3>
        <p className="text-sm text-zinc-500">
          Define the pdata key:value pairs that will comprise this pixel's query string.
        </p>
      </div>

      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Type */}
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Event Type
                </label>
                <div className="relative">
                                         <select
                                                value={state.siteEvent.type}
                                                onChange={handleTypeChange}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    >
                                                <option value="" disabled>
                                                    Select event type
                                                </option>
                        <option value="view">view</option>
                        <option value="click">click</option>
                        <option value="custom">custom</option>
                    </select>
                    {/* Chevron Down */}
                    <div className="pointer-events-none absolute right-3 top-3 opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
            </div>

            {/* Event Name */}
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Event Name
                </label>
                <div className="relative space-y-2">
                    {isEventTypeSelected ? (
                        <>
                            <select
                                value={eventNameValue}
                                onChange={(e) => setSiteEvent('name', e.target.value === 'custom' ? '' : e.target.value)}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                            >
                                {eventNameOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                                <option value="custom">custom</option>
                            </select>
                            <div className="pointer-events-none absolute right-3 top-3 opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-10 w-full items-center rounded-md border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm text-zinc-400">
                            First select Event Type
                        </div>
                    )}

                    {isEventTypeSelected && eventNameValue === 'custom' && (
                        <input
                            type="text"
                            value={state.siteEvent.name}
                            onChange={(e) => setSiteEvent('name', e.target.value)}
                            placeholder="Enter custom event name"
                            className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    )}
                </div>
            </div>

            {/* Event Value */}
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Event Value (Optional)
                </label>
                <p className="text-sm text-gray-500">
                  Alphanumeric characters and underscores only. If you want a dynamic value (e.g. product ID, purchase value, etc.) surround the text with double curly braces like {`{{product_id}}`}.
                </p>
                <input
                    type="text"
                    value={state.siteEvent.value}
                    onChange={(e) => setSiteEvent('value', e.target.value)}
                    placeholder="e.g. 23, true, high_intent"
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>
        </div>
      </div>
    </>
  );
};

export default Step3Site;