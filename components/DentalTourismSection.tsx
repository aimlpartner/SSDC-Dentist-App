'use client';

import React, { useState } from 'react';
import { 
  Plane, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Hotel, 
  Compass, 
  Calendar, 
  ArrowRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { DENTAL_PROCEDURES, calculateDentalTourismSavings } from '../lib/dental-logic';

interface DentalTourismSectionProps {
  onOpenBooking: () => void;
  selectedCurrency: 'USD' | 'INR' | 'GBP' | 'EUR';
}

export default function DentalTourismSection({
  onOpenBooking,
  selectedCurrency,
}: DentalTourismSectionProps) {
  const [selectedProcId, setSelectedProcId] = useState('proc-implants');
  const [quantity, setQuantity] = useState(2);
  const [compareCountry, setCompareCountry] = useState<'UK' | 'US'>('UK');

  const savings = calculateDentalTourismSavings(selectedProcId, quantity, compareCountry);
  const selectedProc = DENTAL_PROCEDURES.find(p => p.id === selectedProcId) || DENTAL_PROCEDURES[0];

  return (
    <section id="tourism" className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-b border-stone-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-3.5 py-1 rounded-full text-xs font-semibold">
            <Plane className="w-3.5 h-3.5 text-blue-600" />
            <span>International Dental Tourism in Agra, India</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Combine the Wonder of the World with a World-Class Smile
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            International patients from the UK, USA, Australia, and Europe travel to Agra to receive identical German zirconia implants and porcelain veneers while saving thousands of dollars—all with luxury 5-star hotel concierge and Taj Mahal sunrise tours.
          </p>
        </div>

        {/* 4-Day Dental Vacation Itinerary */}
        <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
          <h3 className="font-serif font-bold text-xl text-stone-900 mb-6 text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
            <Compass className="w-5 h-5 text-amber-700" />
            <span>The 4-Day Taj Smile & Vacation Timeline</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs relative">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mb-2 inline-block">
                Day 1 • Arrival & Scan
              </span>
              <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">VIP Arrival in Agra</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Private chauffeur pickup from Delhi (IGI) or Agra Cantt. Check in to your luxury hotel (Oberoi Amarvilas or ITC Mughal). Evening 3D digital CBCT facial scan at our clinic suite.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs relative">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mb-2 inline-block">
                Day 2 • Treatment Day
              </span>
              <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">Gentle Smile Artistry</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Painless laser preparation, computer-guided implant placement, or veneer impressions with Dr. Aarav & Dr. Ananya. Relax in the evening with sunset views of the Taj Mahal from Mehtab Bagh.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs relative">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mb-2 inline-block">
                Day 3 • Taj Mahal Wonder
              </span>
              <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">Sunrise at Taj Mahal</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Zero-downtime recovery allows comfortable morning sightseeing. Experience the sunrise light glowing across the white marble—the perfect backdrop for your newly brightened smile!
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs relative">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mb-2 inline-block">
                Day 4 • Final Fit & Departure
              </span>
              <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">Radiant Return Home</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Final seating, bite adjustment, and digital warranty passport issued. Depart for Delhi with a dazzling new smile and unforgettable memories of Agra.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Dental Tourism Savings Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-wider bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-semibold border border-amber-400/30">
              Interactive Tourism Savings Calculator
            </span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-stone-100">
              How Much Will You Save Traveling to Agra?
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Select your procedure and home country to compare real clinical costs. Even after factoring in luxury flights and 5-star Agra accommodation, patients regularly save 50% to 70%!
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block text-stone-300 mb-1">Select Dental Procedure</label>
                <select
                  value={selectedProcId}
                  onChange={(e) => setSelectedProcId(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-2.5 text-xs"
                >
                  {DENTAL_PROCEDURES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Quantity (Units / Teeth)</label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Compare Against</label>
                  <select
                    value={compareCountry}
                    onChange={(e) => setCompareCountry(e.target.value as 'UK' | 'US')}
                    className="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-2 text-xs"
                  >
                    <option value="UK">United Kingdom (NHS / Private)</option>
                    <option value="US">United States (Private Dental)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-6 bg-stone-800/80 rounded-2xl p-6 border border-amber-500/30 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-700 pb-3">
              <span className="text-xs text-stone-300 font-medium">Comparison for {quantity}x {selectedProc.name}</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-700">
                {savings.savingsPercentage}% Net Savings
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-700">
                <span className="text-[11px] text-stone-400 block">{compareCountry} Estimated Cost</span>
                <p className="font-serif font-bold text-xl text-stone-300 mt-1 line-through">
                  ${savings.homeMarketTotalUSD.toLocaleString()} USD
                </p>
                <span className="text-[10px] text-stone-500">Without Agra travel package</span>
              </div>

              <div className="bg-amber-950/60 p-4 rounded-xl border border-amber-500/40">
                <span className="text-[11px] text-amber-300 block">Taj White Pearl (Agra)</span>
                <p className="font-serif font-bold text-2xl text-amber-400 mt-1">
                  ${savings.clinicTotalUSD.toLocaleString()} USD
                </p>
                <span className="text-[10px] text-amber-200/80">Identical German materials</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-between font-medium">
              <span>Your Estimated Pocket Savings:</span>
              <span className="font-serif font-bold text-lg text-emerald-400">
                +${savings.savingsUSD.toLocaleString()} USD
              </span>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Book Your Taj Smile Package Today</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
