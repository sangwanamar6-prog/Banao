
import React from 'react';
import type { AspectRatio } from '../types';
import { aspectRatios } from '../types';

interface AspectRatioSelectorProps {
  selectedValue: AspectRatio;
  onChange: (value: AspectRatio) => void;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedValue, onChange }) => {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">3. Choose Output Size</h3>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {aspectRatios.map((ratio) => (
          <button
            key={ratio}
            onClick={() => onChange(ratio)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border-2 ${
              selectedValue === ratio
                ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            {ratio}
          </button>
        ))}
      </div>
    </div>
  );
};
