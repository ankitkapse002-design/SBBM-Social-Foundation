import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, MapPin, Clock, Shield, ArrowRight,
  Sparkles, CheckCircle2
} from 'lucide-react';
import { apiRequest } from '../api';
import { SEO } from '../components/common/SEO';

interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  coverImage: string;
  status: 'upcoming' | 'completed' | 'archived';
}

export const Events: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ success: boolean; data: EventItem[] }>('/public/events')
      .then((res) => {
        if (res.success) setEvents(res.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <SEO
        title="Community Events & Seva Camps"
        description="Upcoming and completed welfare events, healthcare checkup camps, and community festivals organized by SBBM Social Foundation across Nagpur."
        canonicalPath="/events"
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Community Gatherings & Health Camps</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Events & Seva Camps
          </h1>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            Stay updated with upcoming health checkup camps, Gopashtami celebrations, and cultural festivals hosted by SBBM Social Foundation.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex overflow-x-auto no-scrollbar touch-scroll-x sm:flex-wrap items-center sm:justify-center gap-2 border-b border-foundation-borderMuted pb-3 text-xs font-bold scroll-smooth">
          <button
            onClick={() => setFilter('all')}
            className={`shrink-0 sm:shrink min-h-[40px] px-3.5 sm:px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-foundation-forest text-foundation-ivory shadow-xs'
                : 'bg-white text-stone-700 border border-foundation-borderMuted hover:bg-stone-50'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`shrink-0 sm:shrink min-h-[40px] px-3.5 sm:px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${
              filter === 'upcoming'
                ? 'bg-foundation-forest text-foundation-ivory shadow-xs'
                : 'bg-white text-stone-700 border border-foundation-borderMuted hover:bg-stone-50'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`shrink-0 sm:shrink min-h-[40px] px-3.5 sm:px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${
              filter === 'completed'
                ? 'bg-foundation-forest text-foundation-ivory shadow-xs'
                : 'bg-white text-stone-700 border border-foundation-borderMuted hover:bg-stone-50'
            }`}
          >
            Past Gatherings
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-400 text-xs">
            Loading events...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl overflow-hidden border border-foundation-borderMuted shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={evt.coverImage}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        evt.status === 'upcoming'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-600 text-white'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <span className="text-[11px] text-foundation-gold font-bold uppercase">
                      {evt.category}
                    </span>
                    <h3 className="text-lg font-display font-bold text-foundation-charcoal">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="space-y-1.5 pt-2 text-xs text-stone-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-foundation-forest" />
                        <span>Date: <strong>{evt.date}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-foundation-forest" />
                        <span>Time: {evt.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-foundation-forest" />
                        <span>{evt.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-foundation-borderMuted/60 mt-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-foundation-forest hover:text-foundation-forestLight"
                  >
                    <span>Enquire or Volunteer for Event</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
