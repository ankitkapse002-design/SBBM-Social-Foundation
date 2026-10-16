import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Shield, CheckCircle2, Heart, ArrowRight,
  Sparkles, Phone, Compass
} from 'lucide-react';
import { apiRequest } from '../api';

interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  operationalStatus: string;
  image: string;
}

export const Services: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ success: boolean; data: ServiceItem[] }>('/public/services')
      .then((res) => {
        if (res.success) {
          setServices(res.data);
          if (slug) {
            const found = res.data.find((s) => s.slug === slug || s.id === slug);
            if (found) setSelectedService(found);
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (slug && selectedService) {
    return (
      <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
          <Link
            to="/services"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-foundation-forest hover:underline"
          >
            <span>← Back to All Services</span>
          </Link>

          <div className="bg-white rounded-3xl overflow-hidden border border-foundation-borderMuted shadow-soft">
            <div className="h-72 sm:h-96 relative">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs uppercase tracking-widest text-foundation-gold font-bold">
                  SBBM Foundation Initiative
                </span>
                <h1 className="text-2xl sm:text-4xl font-display font-bold text-foundation-sandstone">
                  {selectedService.title}
                </h1>
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-6">
              <div className="space-y-3">
                <h2 className="text-xl font-display font-bold text-foundation-charcoal">
                  Program Overview
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {selectedService.fullDesc}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-base font-display font-bold text-foundation-forest">
                  Key Beneficiary Features & Scope
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedService.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-stone-700 bg-foundation-warmGray p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-foundation-forest flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-foundation-borderMuted flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-stone-500">
                  <p>Operational at: <strong>Vyenkatesh Ashram, Mahuli (Nagpur)</strong></p>
                  <p>Inquiries: <strong>+91 98908 98081</strong></p>
                </div>

                <div className="flex space-x-3">
                  <Link
                    to="/contact"
                    className="px-5 py-2.5 bg-foundation-forest text-foundation-ivory text-xs font-bold rounded-full shadow hover:bg-foundation-forestLight"
                  >
                    Enquire Regarding this Program
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Community Care & Welfare Initiatives</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-charcoal">
            Our Initiatives & Services
          </h1>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            Delivering dignified elderly residential care, humane cow welfare at Go-Seva Kendra, naturopathy routines, and rural education programs.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-400 text-xs">
            Loading services...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-3xl overflow-hidden border border-foundation-borderMuted shadow-soft hover:shadow-soft-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={srv.image}
                      alt={srv.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-foundation-forest/90 text-foundation-ivory text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {srv.operationalStatus === 'active' ? 'Operational' : 'Program'}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-display font-bold text-foundation-charcoal group-hover:text-foundation-forest transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {srv.shortDesc}
                    </p>

                    <div className="space-y-1 pt-1">
                      {srv.benefits.slice(0, 2).map((b, bi) => (
                        <p key={bi} className="text-[11px] text-stone-500 flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-foundation-forest flex-shrink-0" />
                          <span>{b}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={`/services/${srv.slug}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-foundation-forest hover:text-foundation-forestLight"
                  >
                    <span>Read Full Details & Benefits</span>
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
