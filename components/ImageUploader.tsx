
import React, { useRef } from 'react';
import type { ImageData } from '../types';

interface ImageUploaderProps {
  id: string;
  title: string;
  description: string;
  imageData: ImageData | null;
  onImageChange: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, description, imageData, onImageChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-1 text-center">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 text-center">{description}</p>
      <label
        htmlFor={id}
        className="relative flex flex-col items-center justify-center w-full aspect-square bg-white dark:bg-slate-800/80 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-colors duration-300"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {imageData ? (
          <img src={imageData.previewUrl} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
        ) : (
          <div className="text-center p-4">
            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-primary-600 dark:text-primary-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG, WEBP up to 10MB</p>
          </div>
        )}
        <input
          id={id}
          ref={inputRef}
          type="file"
          className="sr-only"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
