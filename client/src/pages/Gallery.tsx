import React, { useEffect, useState, useCallback } from 'react';
import {
  Image, Video, Sparkles, X, ChevronRight, ChevronLeft,
  Maximize2, Eye, Shield
} from 'lucide-react';
import { apiRequest } from '../api';
import { SEO } from '../components/common/SEO';

interface GalleryAsset {
  id: string;
  title: string;
  caption: string;
  type: 'photo' | 'video';
  category: string;
  mediaUrl: string;
  status: string;
}

export const Gallery: React.FC = () => {
  const [assets, setAssets] = useState<GalleryAsset[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'photo' | 'video'>('all');
  const [activeAsset, setActiveAsset] = useState<GalleryAsset | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ success: boolean; data: GalleryAsset[] }>('/public/gallery')
      .then((res) => {
        if (res.success) setAssets(res.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredAssets = assets.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchType = selectedType === 'all' || item.type === selectedType;
    return matchCat && matchType;
  });

  const currentIndex = activeAsset ? filteredAssets.findIndex(a => a.id === activeAsset.id) : -1;

  const handleNext = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < filteredAssets.length - 1) {
      setActiveAsset(filteredAssets[currentIndex + 1]);
    } else if (currentIndex === filteredAssets.length - 1) {
      setActiveAsset(filteredAssets[0]);
    }
  }, [currentIndex, filteredAssets]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setActiveAsset(filteredAssets[currentIndex - 1]);
    } else if (currentIndex === 0) {
      setActiveAsset(filteredAssets[filteredAssets.length - 1]);
    }
  }, [currentIndex, filteredAssets]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeAsset) return;
      if (e.key === 'Escape') {
        setActiveAsset(null);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAsset, handleNext, handlePrev]);

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <SEO
        title="Verified Photography & Media Gallery"
        description="Authentic photographic gallery of Vyenkatesh Ashram senior care, daily Annadaan distribution, health camps, Go-Seva, and campus life at Mahuli, Parseoni."
        canonicalPath="/gallery"
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs font-semibold">
            <Image className="w-3.5 h-3.5" />
            <span>Visual Archives • SBBM Social Foundation</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Photo & Media Gallery
          </h1>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            Witness the tranquil life, verdant gardens, sacred Go-Seva, and uplifting community moments at Anjikar Bagh, Mahuli.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-foundation-borderMuted pb-4 text-xs font-bold">
          {/* Category Filters */}
          <div className="flex overflow-x-auto no-scrollbar touch-scroll-x sm:flex-wrap items-center gap-2 pb-1 sm:pb-0 scroll-smooth">
            {[
              { id: 'all', label: 'All Photographs' },
              { id: 'ashram', label: 'Ashram Facility & Campus' },
              { id: 'elders', label: 'Resident Elders ("Aai-Baba")' },
              { id: 'healthcare', label: 'Health Camps & Naturopathy' },
              { id: 'events', label: 'Camps & Community Seva' },
              { id: 'leadership', label: 'Founders & Leadership' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 sm:shrink min-h-[40px] px-3.5 sm:px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-foundation-forest text-foundation-ivory shadow'
                    : 'bg-white text-stone-700 border border-foundation-borderMuted hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Type Filters */}
          <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                selectedType === 'all' ? 'bg-foundation-charcoal text-white' : 'bg-white text-stone-600 border'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('photo')}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs transition-all flex items-center space-x-1 cursor-pointer ${
                selectedType === 'photo' ? 'bg-foundation-charcoal text-white' : 'bg-white text-stone-600 border'
              }`}
            >
              <Image className="w-3 h-3" />
              <span>Photos</span>
            </button>
            <button
              onClick={() => setSelectedType('video')}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs transition-all flex items-center space-x-1 cursor-pointer ${
                selectedType === 'video' ? 'bg-foundation-charcoal text-white' : 'bg-white text-stone-600 border'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>Videos</span>
            </button>
          </div>
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-stone-400 text-xs">
            Loading media assets...
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-foundation-borderMuted text-xs text-stone-500">
            No media items found for this selection.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => setActiveAsset(asset)}
                className="cursor-pointer group relative rounded-2xl overflow-hidden border border-foundation-borderMuted shadow-soft hover:shadow-soft-lg transition-all bg-stone-900"
              >
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={asset.mediaUrl}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white space-y-1">
                    <span className="text-[10px] uppercase font-bold text-foundation-gold tracking-widest">
                      {asset.category}
                    </span>
                    <h3 className="text-xs font-display font-bold leading-tight">
                      {asset.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal with Keyboard & Prev/Next Navigation */}
        {activeAsset && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
            onClick={() => setActiveAsset(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-stone-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-700 shadow-2xl text-stone-100 max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveAsset(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-black/70 hover:bg-black text-white p-2.5 rounded-full transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close Preview (Esc)"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev Button */}
              {filteredAssets.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black text-white p-2.5 rounded-full transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Previous Image"
                  title="Previous (Left Arrow)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Next Button */}
              {filteredAssets.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black text-white p-2.5 rounded-full transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Next Image"
                  title="Next (Right Arrow)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              <div className="flex-1 bg-black flex items-center justify-center overflow-hidden relative min-h-[200px]">
                <img
                  src={activeAsset.mediaUrl}
                  alt={activeAsset.title}
                  className="max-h-[55vh] sm:max-h-[70vh] w-auto max-w-full object-contain transition-all"
                />
              </div>

              <div className="p-4 sm:p-6 space-y-1.5 sm:space-y-2 bg-stone-900 border-t border-stone-800 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs uppercase text-amber-400 font-bold tracking-wider">
                    {activeAsset.category} • SBBM Social Foundation Archives
                  </span>
                  {currentIndex >= 0 && (
                    <span className="text-[10.5px] font-mono text-stone-400 font-semibold">
                      {currentIndex + 1} of {filteredAssets.length}
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white">
                  {activeAsset.title}
                </h2>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {activeAsset.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
