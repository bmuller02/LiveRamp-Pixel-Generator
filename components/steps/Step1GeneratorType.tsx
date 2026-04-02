import React from 'react';
import { usePixelStore } from '../../PixelContext';
import { GeneratorType } from '../../types';

const options: { value: GeneratorType; label: string; description: string }[] = [
  {
    value: 'LIVERAMP',
    label: 'LiveRamp Pixel',
    description: 'Generate 1x1 pixels for Media or Site implementation.',
  },
  {
    value: 'CONNECT',
    label: 'Connect Pixel',
    description: 'Generate Connect pixels for ad server implementation.',
  },
];

const Step1GeneratorType: React.FC = () => {
  const { state, setGeneratorType } = usePixelStore();

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Select Pixel Type</h3>
        <p className="text-sm text-zinc-500">
          Choose the type of pixel you would like to generate.
        </p>
      </div>

      <div className="p-6 pt-0">
        <div className="grid gap-3">
          {options.map((opt) => {
            const isSelected = state.generatorType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setGeneratorType(opt.value)}
                className={`flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-all
                  ${isSelected
                    ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                    : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
              >
                <span className="font-semibold text-sm">{opt.label}</span>
                <span className={`text-xs ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Step1GeneratorType;
