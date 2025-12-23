import React from 'react';
import { usePixelStore } from '../../PixelContext';

const Step2PixelType: React.FC = () => {
  const { state, setPixelType, nextStep } = usePixelStore();

  const handleSelect = (type: 'MEDIA' | 'SITE') => {
    setPixelType(type);
    // Auto-advance for better UX
    setTimeout(() => nextStep(), 150);
  };

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Select Pixel Type</h3>
        <p className="text-sm text-zinc-500">
          Is this pixel for Media (Ad Server) tracking or Site (Event) tracking?
        </p>
      </div>
      
      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Media Selection Card */}
            <div
                onClick={() => handleSelect('MEDIA')}
                className={`rounded-xl border bg-card text-card-foreground shadow-sm cursor-pointer transition-all hover:bg-zinc-50
                    ${state.pixelType === 'MEDIA' ? 'ring-2 ring-zinc-950 border-transparent' : 'border-zinc-200'}`}
            >
                <div className="flex flex-col space-y-1.5 p-6">
                    <div className="text-lg font-semibold leading-none tracking-tight">MEDIA</div>
                    <p className="text-sm text-zinc-500">
                        For Impression/Click tracking within CM360, TTD, or other DSPs.
                    </p>
                </div>
            </div>

            {/* Site Selection Card */}
            <div
                onClick={() => handleSelect('SITE')}
                className={`rounded-xl border bg-card text-card-foreground shadow-sm cursor-pointer transition-all hover:bg-zinc-50
                    ${state.pixelType === 'SITE' ? 'ring-2 ring-zinc-950 border-transparent' : 'border-zinc-200'}`}
            >
                <div className="flex flex-col space-y-1.5 p-6">
                    <div className="text-lg font-semibold leading-none tracking-tight">SITE</div>
                    <p className="text-sm text-zinc-500">
                        For Site-side events like page views, button clicks, or conversions.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Step2PixelType;