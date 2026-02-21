import React from 'react';
import { PixelProvider } from './PixelContext';
import StepNavigator from './components/StepNavigator';
import PixelPreview from './components/PixelPreview';

const App: React.FC = () => {
  return (
    <PixelProvider>
      <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 flex flex-col">
        
        {/* Sticky Header Preview */}
        <PixelPreview />

        {/* Main Content Area */}
        <div className="flex-1 w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-start md:justify-center">
          
          <header className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Horizon LiveRamp Pixel
            </h1>
            <p className="mt-3 text-zinc-600 max-w-lg mx-auto">
              Generate 1x1 pixels for Media or Site implementation.
            </p>
          </header>

          {/* Wizard Container */}
          <main className="w-full">
            <StepNavigator />
          </main>

        </div>
      </div>
    </PixelProvider>
  );
};

export default App;