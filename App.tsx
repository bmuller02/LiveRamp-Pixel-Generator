import React from 'react';
import { PixelProvider, usePixelStore } from './PixelContext';
import StepNavigator from './components/StepNavigator';
import PixelPreview from './components/PixelPreview';

const AppContent: React.FC = () => {
  const { state } = usePixelStore();

  const title = state.generatorType === 'CONNECT'
    ? 'Horizon Connect Pixel'
    : state.generatorType === 'LIVERAMP'
      ? 'Horizon LiveRamp Pixel'
      : 'Horizon Pixel Generator';

  const subtitle = state.generatorType === 'CONNECT'
    ? 'Generate Connect pixels for ad server implementation.'
    : state.generatorType === 'LIVERAMP'
      ? 'Generate 1x1 pixels for Media or Site implementation.'
      : 'Select a pixel type to get started.';

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 flex flex-col">
      
      {/* Sticky Header Preview */}
      <PixelPreview />

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-start md:justify-center">
        
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            {title}
          </h1>
          <p className="mt-3 text-zinc-600 max-w-lg mx-auto">
            {subtitle}
          </p>
        </header>

        {/* Wizard Container */}
        <main className="w-full">
          <StepNavigator />
        </main>

      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <PixelProvider>
      <AppContent />
    </PixelProvider>
  );
};

export default App;