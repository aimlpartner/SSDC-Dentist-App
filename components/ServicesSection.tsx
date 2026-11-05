'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Info
} from 'lucide-react';
import { DENTAL_PROCEDURES, DentalProcedure } from '../lib/dental-logic';

interface ServicesSectionProps {
  onOpenBooking: () => void;
  selectedCurrency: 'USD' | 'INR' | 'GBP' | 'EUR';
}

export default function ServicesSection({
  onOpenBooking,
  selectedCurrency,
}: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProcModal, setSelectedProcModal] = useState<DentalProcedure | null>(null);

  const categories = ['All', 'Cosmetic', 'Surgical & Restorative', 'Endodontics', 'Orthodontics', 'Preventative'];

  const filteredProcedures = activeCategory === 'All'
    ? DENTAL_PROCEDURES
    : DENTAL_PROCEDURES.filter(p => p.category === activeCategory);

  return (
    <section id="treatments" className="py-16 sm:py-24 px-4 sm:px-8 bg-stone-50/70 border-b border-stone-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Pristine Dental Artistry in Agra</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            World-Class Clinical Treatments
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            From the signature 45-minute Taj Pearl Laser Whitening to computer-guided full-arch zirconia restorations, every procedure is performed in our sterilized Agra surgical suites.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Procedures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcedures.map((proc) => (
            <div
              key={proc.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {proc.category}
                  </span>
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {proc.durationMinutes} mins
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-900 transition-colors">
                  {proc.name}
                </h3>
                <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                  {proc.description}
                </p>

                {/* Taj Tourism Suitability Badge */}
                {proc.tajSightseeingFriendly && (
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Comfortable for Taj Mahal visit next morning</span>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Investment</span>
                  <p className="font-serif font-bold text-base text-stone-900">
                    {selectedCurrency === 'USD' ? `$${proc.priceUSD}` : `₹${proc.priceINR.toLocaleString('en-IN')}`}
                    <span className="text-[10px] text-stone-400 font-sans font-normal ml-1">
                      (vs ${proc.ukPriceCompareUSD} UK)
                    </span>
                  </p>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="bg-stone-900 hover:bg-amber-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Book Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
