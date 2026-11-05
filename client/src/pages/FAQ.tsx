import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle, Search, ChevronDown, ChevronUp,
  Phone, ArrowRight, ShieldCheck
} from 'lucide-react';
import { apiRequest } from '../api';
import { SEO } from '../components/common/SEO';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  orderIndex: number;
}

export const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ success: boolean; data: FAQItem[] }>('/public/faqs')
      .then((res) => {
        if (res.success) setFaqs(res.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const matchCat = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchQuery =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const faqJsonLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((f) => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.answer,
      },
    })),
  } : undefined;

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <SEO
        title="Frequently Asked Questions (FAQ) | Verified Answers"
        description="Clear, honest answers about SBBM Social Foundation, elder resident admissions at Vyenkatesh Ashram, daily Annadaan meals, Go-Seva, visiting hours, and 80G tax benefits."
        canonicalPath="/faq"
        jsonLd={faqJsonLd}
      />
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Questions & Honest Guidance</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Frequently Asked Questions
          </h1>
          <p className="text-xs md:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Find verified information regarding admissions, foundation facilities, visiting hours, Go-Seva, and donations.
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. admission, address, cows, donations)..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-foundation-borderMuted shadow-soft-sm text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-foundation-forest"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
            {[
              { id: 'all', label: 'All FAQs' },
              { id: 'admission', label: 'Admission & Eligibility' },
              { id: 'ashram_life', label: 'Facility Life & Visiting' },
              { id: 'donations', label: 'Donations & Seva' },
              { id: 'membership', label: 'Membership' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-foundation-forest text-foundation-ivory'
                    : 'bg-white text-stone-700 border border-foundation-borderMuted hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQ list */}
        {isLoading ? (
          <div className="text-center py-12 text-stone-400 text-xs">
            Loading FAQs...
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-foundation-borderMuted text-xs text-stone-500">
            No FAQs found matching your search. Call our helpline at +91 98908 98081 for immediate assistance.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-foundation-borderMuted shadow-soft-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between text-xs md:text-sm font-bold text-foundation-charcoal hover:text-foundation-forest transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-foundation-forest flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 flex-shrink-0 ml-2" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-stone-600 leading-relaxed border-t border-foundation-borderMuted/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Have more questions card */}
        <div className="bg-gradient-to-r from-foundation-forest to-foundation-forestDark text-foundation-ivory rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-display font-bold text-foundation-sandstone">
              Still have questions?
            </h3>
            <p className="text-xs text-stone-300">
              Speak directly with our coordinator or schedule a visit.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="tel:+919890898081"
              className="px-5 py-2.5 bg-foundation-gold hover:bg-yellow-500 text-foundation-forestDark font-bold text-xs rounded-full shadow transition-all flex items-center space-x-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+91 98908 98081</span>
            </a>
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-full border border-white/20 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
