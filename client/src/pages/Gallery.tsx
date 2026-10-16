import React, { useEffect, useState } from 'react';
import {
  Image, Video, Sparkles, X, ChevronRight,
  Maximize2, Eye, Shield
} from 'lucide-react';
import { apiRequest } from '../api';

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

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs font-semibold">
            <Image className="w-3.5 h-3.5" />
            <span>Visual Archives of Vyenkatesh Ashram</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Photo & Media Gallery
          </h1>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            Witness the tranquil life, verdant gardens, sacred Go-Seva, and uplifting community moments at Anjikar Bagh, Mahuli.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-foundation-borderMuted pb-4 text-xs font-bold">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Media' },
              { id: 'ashram', label: 'Ashram & Premises' },
              { id: 'goseva', label: 'Go-Seva Kendra' },
              { id: 'naturopathy', label: 'Naturopathy & Yoga' },
              { id: 'events', label: 'Camps & Gatherings' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full transition-all ${
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                selectedType === 'all' ? 'bg-foundation-charcoal text-white' : 'bg-white text-stone-600 border'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('photo')}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center space-x-1 ${
                selectedType === 'photo' ? 'bg-foundation-charcoal text-white' : 'bg-white text-stone-600 border'
              }`}
            >
              <Image className="w-3 h-3" />
              <span>Photos</span>
            </button>
            <button
              onClick={() => setSelectedType('video')}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center space-x-1 ${
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

        {/* Lightbox Modal */}
        {activeAsset && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveAsset(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-foundation-forestDark rounded-3xl overflow-hidden border border-foundation-gold/40 shadow-2xl text-foundation-ivory"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveAsset(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activeAsset.mediaUrl}
                  alt={activeAsset.title}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="p-6 space-y-2">
                <span className="text-xs uppercase text-foundation-gold font-bold">
                  {activeAsset.category} • Vyenkatesh Ashram
                </span>
                <h2 className="text-xl font-display font-bold text-foundation-sandstone">
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
