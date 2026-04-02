"use client";

import React from 'react';
import { usePixelStore } from '../PixelContext';
import Step1GeneratorType from './steps/Step1GeneratorType';
import Step1LiveRampId from './steps/Step1LiveRampId';
import Step2PixelType from './steps/Step2PixelType';
import Step3Media from './steps/Step3Media';
import Step3Site from './steps/Step3Site';
import Step4Advertiser from './steps/Step4Advertiser';
import Step5Summary from './steps/Step5Summary';
import ConnectStep1Advertiser from './steps/ConnectStep1Advertiser';
import ConnectStep2AdServer from './steps/ConnectStep2AdServer';
import ConnectStep3Summary from './steps/ConnectStep3Summary';
import { useHasMounted } from '../hooks/useHasMounted';

const StepNavigator: React.FC = () => {
  const { state, nextStep, prevStep, canAdvance, getTotalSteps } = usePixelStore();
  const hasMounted = useHasMounted();

  // Prevent hydration mismatch by not rendering until mounted on client
  if (!hasMounted) return null;

  const totalSteps = getTotalSteps();

  const renderStep = () => {
    // Step 1 is always generator type selection
    if (state.step === 1) return <Step1GeneratorType />;

    if (state.generatorType === 'CONNECT') {
      switch (state.step) {
        case 2: return <ConnectStep1Advertiser />;
        case 3: return <ConnectStep2AdServer />;
        case 4: return <ConnectStep3Summary />;
        default: return null;
      }
    }

    // LiveRamp flow (original steps shifted by 1)
    switch (state.step) {
      case 2: return <Step1LiveRampId />;
      case 3: return <Step2PixelType />;
      case 4: return state.pixelType === 'MEDIA' ? <Step3Media /> : <Step3Site />;
      case 5: return <Step4Advertiser />;
      case 6: return <Step5Summary />;
      default: return null;
    }
  };

  const isFinalStep = state.step === totalSteps;
  const isBeforeReview = state.step === totalSteps - 1;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm flex flex-col min-h-[500px] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Progress Bar */}
      <div className="h-1 w-full bg-zinc-100 overflow-hidden rounded-t-xl">
        <div 
            className="h-full bg-zinc-900 transition-all duration-500 ease-in-out" 
            style={{ width: `${(state.step / totalSteps) * 100}%` }}
        ></div>
      </div>

      {/* Main Content (Card Header + Content handled by steps) */}
      <div className="flex-1 flex flex-col">
        {renderStep()}
      </div>

      {/* Footer / Actions */}
      {!isFinalStep ? (
        <div className="p-6 pt-0 mt-auto flex items-center justify-between">
            <button
                onClick={prevStep}
                disabled={state.step === 1}
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 h-10 px-4 py-2
                    ${state.step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Back
            </button>

            <button
                onClick={nextStep}
                disabled={!canAdvance}
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 h-10 px-4 py-2 ml-auto
                    ${!canAdvance ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isBeforeReview ? 'Review Configuration' : 'Next Step'}
            </button>
        </div>
      ) : (
          // Final Step Footer
          <div className="p-6 pt-0 mt-auto flex justify-center border-t border-zinc-100 pt-6">
              <button
                onClick={prevStep}
                className="text-sm text-zinc-500 hover:text-zinc-900 hover:underline transition-colors"
              >
                ← Back to edit configuration
              </button>
          </div>
      )}
    </div>
  );
};

export default StepNavigator;