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
    <div className="min-h-screen bg-foundation-ivory py-10 sm:py-14 md:py-16 font-sans">
      <SEO
        title="Verified Photography & Media Gallery"
        description="Authentic photographic gallery of Vyenkatesh Ashram senior care facilities, daily Annadaan distribution, health camps, Go-Seva, and campus life at Mahuli, Parseoni."
        canonicalPath="/gallery"
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 sm:space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs sm:text-sm font-bold">
            <Image className="w-4 h-4" />
            <span>Visual Archives • SBBM Social Foundation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Photo &amp; Media Gallery
          </h1>
          <p className="text-sm sm:text-base md:text-[17px] text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Witness the tranquil life, verdant gardens, sacred Go-Seva, and uplifting community moments at Anjikar Bagh, Mahuli.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-foundation-borderMuted pb-4 text-sm font-semibold">
          {/* Category Filters */}
          <div className="flex overflow-x-auto no-scrollbar touch-scroll-x sm:flex-wrap items-center gap-2 pb-1 sm:pb-0 scroll-smooth">
            {[
              { id: 'all', label: 'All Photographs' },
              { id: 'ashram', label: 'Ashram Facility & Campus' },
              { id: 'healthcare', label: 'Health Camps & Naturopathy' },
              { id: 'events', label: 'Community Seva & Events' },
              { id: 'leadership', label: "Founder's Vision" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 sm:shrink min-h-[46px] px-4 sm:px-5 py-2.5 rounded-full transition-all whitespace-nowrap cursor-pointer text-sm font-semibold ${
                  selectedCategory === cat.id
                    ? 'bg-foundation-forest text-foundation-ivory shadow font-bold'
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
              className={`min-h-[46px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedType === 'all' ? 'bg-foundation-charcoal text-white' : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('photo')}
              className={`min-h-[46px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                selectedType === 'photo' ? 'bg-foundation-charcoal text-white' : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Photos</span>
            </button>
            <button
              onClick={() => setSelectedType('video')}
              className={`min-h-[46px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                selectedType === 'video' ? 'bg-foundation-charcoal text-white' : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Videos</span>
            </button>
          </div>
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div className="text-center py-16 text-stone-400 text-sm">
            Loading media assets...
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-foundation-borderMuted text-sm text-stone-500">
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
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={asset.mediaUrl}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  <div className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white space-y-1">
                    <span className="text-[11px] uppercase font-bold text-foundation-gold tracking-widest">
                      {asset.category}
                    </span>
                    <h3 className="text-sm font-display font-bold leading-tight line-clamp-2">
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
            onClick={() => setActiveAsset(null)}
          >
            <div
              className="relative max-w-4xl w-full max-h-[90vh] bg-stone-950 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex-1 min-h-0 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activeAsset.mediaUrl}
                  alt={activeAsset.title}
                  className="max-h-[65vh] w-auto max-w-full object-contain mx-auto"
                />

                {/* Prev/Next buttons */}
                {filteredAssets.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                      title="Previous (Left Arrow)"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                      title="Next (Right Arrow)"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setActiveAsset(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 bg-stone-900 border-t border-stone-800 text-white space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm text-stone-400">
                  <span className="uppercase tracking-widest text-[#C5A059] font-bold">
                    {activeAsset.category}
                  </span>
                  {currentIndex >= 0 && (
                    <span>{currentIndex + 1} of {filteredAssets.length}</span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold">
                  {activeAsset.title}
                </h3>
                {activeAsset.caption && (
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pt-1">
                    {activeAsset.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
