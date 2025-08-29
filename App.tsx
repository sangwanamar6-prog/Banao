
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { Spinner } from './components/Spinner';
import type { ImageData, AspectRatio } from './types';
import { aspectRatios } from './types';
import { generateSwappedImage } from './services/geminiService';
import { useTheme } from './hooks/useTheme';

const fileToImageData = (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const previewUrl = URL.createObjectURL(file);
      const [header, data] = result.split(',');
      if (!header || !data) {
        reject(new Error('Invalid file format'));
        return;
      }
      const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
      resolve({ base64: data, mimeType, previewUrl });
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [personImage, setPersonImage] = useState<ImageData | null>(null);
  const [styleImage, setStyleImage] = useState<ImageData | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>(aspectRatios[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (file: File, setImage: React.Dispatch<React.SetStateAction<ImageData | null>>) => {
    try {
      const data = await fileToImageData(file);
      setImage(data);
    } catch (err) {
      setError('Failed to load image. Please try another file.');
      console.error(err);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!personImage || !styleImage) {
      setError('Please upload both images before generating.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await generateSwappedImage(
        personImage.base64,
        personImage.mimeType,
        styleImage.base64,
        styleImage.mimeType,
        selectedAspectRatio
      );
      if (resultBase64) {
        setGeneratedImage(`data:image/png;base64,${resultBase64}`);
      } else {
        setError('The AI could not generate an image from the provided inputs. Please try again with different images.');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Generation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [personImage, styleImage, selectedAspectRatio]);

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'BanaO_generated_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200`}>
      <div className="relative isolate min-h-screen">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
          <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 dark:opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        
        <Header theme={theme} toggleTheme={toggleTheme} />
        
        <main className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <ImageUploader
                id="person-image"
                title="1. Upload Person Image"
                description="Select the photo of the person you want to feature."
                imageData={personImage}
                onImageChange={(file) => handleImageChange(file, setPersonImage)}
              />
              <ImageUploader
                id="style-image"
                title="2. Upload Style Image"
                description="Select the photo with clothes, an item, or a vehicle."
                imageData={styleImage}
                onImageChange={(file) => handleImageChange(file, setStyleImage)}
              />
            </div>
            
            <AspectRatioSelector
              selectedValue={selectedAspectRatio}
              onChange={setSelectedAspectRatio}
            />
            
            <button
              onClick={handleGenerate}
              disabled={isLoading || !personImage || !styleImage}
              className="w-full max-w-sm flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800"
            >
              {isLoading && <Spinner />}
              {isLoading ? 'Generating Magic...' : '✨ Generate Image'}
            </button>

            {error && (
              <div className="mt-4 p-4 w-full max-w-2xl bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg text-center">
                <p><strong>Oops!</strong> {error}</p>
              </div>
            )}
            
            {generatedImage && !isLoading && (
              <div className="w-full max-w-2xl flex flex-col items-center gap-6 mt-8 p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-center text-primary-700 dark:text-primary-400">Your Creation is Ready!</h3>
                <img src={generatedImage} alt="Generated result" className="rounded-lg shadow-md w-full object-contain" />
                <button
                  onClick={handleDownload}
                  className="w-full max-w-sm px-8 py-3 bg-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
                >
                  Download 4K Image
                </button>
              </div>
            )}
            
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
