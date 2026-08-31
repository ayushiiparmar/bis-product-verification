'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { Stepper } from '../components/Stepper';
import { ImageUploader } from '../components/ImageUploader';
import { ImagePreview } from '../components/ImagePreview';
import { LoadingState } from '../components/LoadingState';
import { ResultCard } from '../components/ResultCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { HistoryView } from '../components/HistoryView';
import { AboutView } from '../components/AboutView';
import { FooterTrust } from '../components/FooterTrust';
import { AppState, ActiveTab, ImageFileInfo, AnalysisData, HistoryItem } from '../types';
import { analyzeProduct } from '../services/api';

const LOCAL_STORAGE_HISTORY_KEY = 'nexvision_session_history';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [appState, setAppState] = useState<AppState>('upload');
  const [selectedImage, setSelectedImage] = useState<ImageFileInfo | null>(null);
  const [textQuery, setTextQuery] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [errorText, setErrorText] = useState<string>('');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);

  // Load history from session storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (stored) {
        setHistoryList(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save history to session storage
  const saveHistory = (items: HistoryItem[]) => {
    setHistoryList(items);
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  };

  // Interactive mouse glow background matching Stitch design
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleImageSelected = useCallback((info: ImageFileInfo, query?: string) => {
    setSelectedImage(info);
    if (query !== undefined) {
      setTextQuery(query);
    }
    setErrorText('');
    setAppState('preview');
  }, []);

  const handleUploadError = useCallback((msg: string) => {
    setErrorText(msg);
    setAppState('error');
  }, []);

  // Handler for analyzing image (and optional query)
  const handleAnalyze = useCallback(
    async (queryToUse?: string, forceImage?: ImageFileInfo | null) => {
      const img = forceImage !== undefined ? forceImage : selectedImage;
      const activeQuery = queryToUse !== undefined ? queryToUse : textQuery;

      if (!img && !activeQuery.trim()) {
        setErrorText('Please select a product image or enter a text query.');
        setAppState('error');
        return;
      }

      if (queryToUse !== undefined) {
        setTextQuery(queryToUse);
      }

      setAppState('analyzing');
      setErrorText('');

      try {
        const response = await analyzeProduct({
          imageFile: img?.file || null,
          query: activeQuery,
        });

        if (response.success && response.data) {
          setAnalysisResult(response.data);
          setAppState('results');

          // Record in session history
          const newHistoryItem: HistoryItem = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            imageInfo: img
              ? {
                  name: img.name,
                  previewUrl: img.previewUrl,
                  sizeFormatted: img.sizeFormatted,
                  extension: img.extension,
                }
              : null,
            query: activeQuery || undefined,
            data: response.data,
          };

          saveHistory([newHistoryItem, ...historyList.slice(0, 19)]);
        } else {
          throw new Error(response.error || 'Failed to process inquiry');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
        setErrorText(msg);
        setAppState('error');
      }
    },
    [selectedImage, textQuery, historyList]
  );

  // Handler for direct text query submission from home screen
  const handleQueryOnlySubmit = useCallback(
    (query: string) => {
      setTextQuery(query);
      handleAnalyze(query, null);
    },
    [handleAnalyze]
  );

  const handleReset = useCallback(() => {
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(null);
    setTextQuery('');
    setAnalysisResult(null);
    setErrorText('');
    setAppState('upload');
    setActiveTab('home');
  }, [selectedImage]);

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setAnalysisResult(item.data);
    setTextQuery(item.query || '');
    if (item.imageInfo) {
      setSelectedImage({
        file: new File([], item.imageInfo.name),
        previewUrl: item.imageInfo.previewUrl,
        name: item.imageInfo.name,
        sizeFormatted: item.imageInfo.sizeFormatted || 'N/A',
        extension: item.imageInfo.extension || 'IMAGE',
      });
    } else {
      setSelectedImage(null);
    }
    setAppState('results');
    setActiveTab('home');
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  const getStepperStep = (): 1 | 2 | 3 => {
    if (appState === 'upload') return 1;
    if (appState === 'preview' || appState === 'analyzing') return 2;
    return 3;
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-gradient-to-br from-[#f0f3ff] via-[#f8fafc] to-[#fcfaff]">
      {/* Dynamic Ambient Glow Behind Content */}
      <div
        className="fixed w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full pointer-events-none z-0 blur-[130px] opacity-25 bg-gradient-to-tr from-primary-container via-secondary-container to-tertiary-container transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
        }}
      />

      {/* Decorative Background Orbs */}
      <div className="absolute top-24 left-12 w-72 h-72 bg-primary-fixed-dim/20 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />
      <div
        className="absolute bottom-20 right-12 w-96 h-96 bg-secondary-fixed-dim/20 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse"
        style={{ animationDelay: '1.5s' }}
      />

      {/* Navigation Bar with Tabs */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'home' && appState === 'results') {
            // Keep results if already loaded, else normal home
          }
        }}
        historyCount={historyList.length}
      />

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 pt-6 sm:pt-10 pb-16 flex flex-col items-center justify-start z-10">
        {/* Tab Routing View */}
        {activeTab === 'history' ? (
          <HistoryView
            history={historyList}
            onSelectHistoryItem={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
            onNavigateHome={() => setActiveTab('home')}
          />
        ) : activeTab === 'about' ? (
          <AboutView onNavigateHome={() => setActiveTab('home')} />
        ) : (
          /* Home View (Upload -> Preview -> Analyzing -> Results) */
          <>
            <Stepper currentStep={getStepperStep()} />

            <div className="w-full flex flex-col items-center transition-all duration-300">
              {appState === 'upload' && (
                <ImageUploader
                  onImageSelected={handleImageSelected}
                  onQueryOnlySubmit={handleQueryOnlySubmit}
                  onError={handleUploadError}
                  initialQuery={textQuery}
                />
              )}

              {appState === 'preview' && selectedImage && (
                <ImagePreview
                  imageInfo={selectedImage}
                  initialQuery={textQuery}
                  onChangeImage={handleReset}
                  onAnalyze={(q) => handleAnalyze(q, selectedImage)}
                />
              )}

              {appState === 'analyzing' && (
                <LoadingState imageInfo={selectedImage} query={textQuery} />
              )}

              {appState === 'results' && analysisResult && (
                <ResultCard
                  data={analysisResult}
                  imageInfo={selectedImage}
                  query={textQuery}
                  onReset={handleReset}
                />
              )}

              {appState === 'error' && (
                <ErrorMessage
                  message={errorText}
                  onRetry={() => handleAnalyze()}
                  onReset={handleReset}
                />
              )}
            </div>
          </>
        )}

        {/* Trust & Privacy Security Capsule */}
        <FooterTrust />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2.5 bg-white/90 backdrop-blur-xl border-t border-outline-variant/20 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => {
            setActiveTab('home');
            if (appState !== 'upload' && appState !== 'results') {
              handleReset();
            }
          }}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-full transition-colors ${
            activeTab === 'home'
              ? 'bg-primary-container text-white font-bold'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-full transition-colors ${
            activeTab === 'history'
              ? 'bg-primary-container text-white font-bold'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[22px]">history</span>
            {historyList.length > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-primary text-white rounded-full text-[8px] flex items-center justify-center font-bold">
                {historyList.length}
              </span>
            )}
          </div>
          <span className="text-[10px]">History</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-full transition-colors ${
            activeTab === 'about'
              ? 'bg-primary-container text-white font-bold'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">info</span>
          <span className="text-[10px]">About</span>
        </button>
      </nav>
    </div>
  );
}
