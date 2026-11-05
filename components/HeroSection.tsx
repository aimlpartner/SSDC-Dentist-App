'use client';

import React from 'react';
import { 
  Sparkles, 
  PhoneCall, 
  Calendar, 
  ShieldCheck, 
  MapPin, 
  Award, 
  Plane, 
  Star,
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenCallingAgent: () => void;
  onOpenWhatsApp: () => void;
  selectedCurrency: 'USD' | 'INR' | 'GBP' | 'EUR';
}

export default function HeroSection({
  onOpenBooking,
  onOpenCallingAgent,
  onOpenWhatsApp,
  selectedCurrency,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-white to-[#F9F6F0] py-14 sm:py-20 px-4 sm:px-8 border-b border-stone-200/80">
      
      {/* Decorative Taj Mahal Dome & Geometric Inlay Motifs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-stone-200/40 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline, Theme, and CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Taj Agra Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-100/70 border border-amber-300/80 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
              <span>Taj Mahal is White • Your Teeth Deserve the Same Radiant Perfection</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.15]">
              Sculpting Pure Smiles in the City of the{' '}
              <span className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 bg-clip-text text-transparent">
                Taj Mahal
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
              Welcome to <strong>Taj White Pearl Dental Hospital & Luxury Spa</strong>, Agra&apos;s premier dental sanctuary. We combine German 3D implantology and bespoke porcelain smile design with luxury concierge care for foreign dental tourists and fast-track care for local Agra families.
            </p>

            {/* Key Value Propositions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span><strong>Save up to 70%</strong> vs UK / US / Australia</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span><strong>Opposite Taj East Gate Rd</strong>, Agra</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span><strong>24/7 AI Voice Calling Agent</strong> (Priya)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span><strong>Automated WhatsApp & Email</strong> Alerts</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={onOpenBooking}
                className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 hover:from-amber-800 hover:to-black text-white px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-200" />
                <span>Book Online Consultation</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onOpenCallingAgent}
                className="bg-white hover:bg-amber-50 text-stone-900 border border-stone-300 hover:border-amber-400 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Call 24/7 AI Receptionist</span>
              </button>

              <button
                onClick={onOpenWhatsApp}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="text-base">💬</span>
                <span>WhatsApp Bot</span>
              </button>
            </div>

            {/* Foreign vs Local Rapid Guidance */}
            <div className="flex items-center gap-4 pt-3 text-[11px] text-stone-500 border-t border-stone-200/80">
              <span className="flex items-center gap-1 font-medium text-stone-700">
                <Plane className="w-3.5 h-3.5 text-blue-600" />
                Foreign Guests: Delhi Airport VIP transfer & Oberoi Hotel stay
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-stone-700">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                Agra Locals: Same-day walk-in reception
              </span>
            </div>

          </div>

          {/* Right Column: Hero Visual Card with Taj & Smile Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-5 shadow-xl border border-stone-200/90 overflow-hidden">
              
              {/* Marble texture header */}
              <div className="relative h-64 rounded-2xl overflow-hidden mb-4 bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
                  alt="Taj Mahal Agra pristine white marble"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-black/20"></div>
                
                <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider bg-amber-500 text-stone-900 px-2 py-0.5 rounded font-bold">
                      The Taj Smile Standard
                    </span>
                    <h3 className="font-serif font-bold text-lg text-white mt-1">
                      Pristine White As Agra Marble
                    </h3>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-semibold">
                    Taj East Gate, Agra
                  </div>
                </div>
              </div>

              {/* Live Card Widgets */}
              <div className="space-y-3">
                {/* 24/7 AI Calling Agent Widget */}
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <PhoneCall className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-stone-900">
                        AI Voice Receptionist (Priya)
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Instant booking, reschedules & inquiries
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenCallingAgent}
                    className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    Call Now
                  </button>
                </div>

                {/* Treatment Highlights */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                    <span className="text-[10px] text-amber-800 font-bold uppercase">Taj Pearl Whitening</span>
                    <p className="font-serif font-bold text-stone-900 mt-0.5">
                      {selectedCurrency === 'USD' ? '$145' : '₹12,000'}
                    </p>
                    <span className="text-[10px] text-stone-500">45 Mins • 0 Downtime</span>
                  </div>

                  <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                    <span className="text-[10px] text-amber-800 font-bold uppercase">German Zirconia Implant</span>
                    <p className="font-serif font-bold text-stone-900 mt-0.5">
                      {selectedCurrency === 'USD' ? '$520' : '₹42,000'}
                    </p>
                    <span className="text-[10px] text-stone-500">Save 70% vs UK/US</span>
                  </div>
                </div>
              </div>

              {/* Verified Hospital Seal */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1 font-semibold text-stone-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  NABH Accredited Hospital
                </span>
                <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                  ★ 4.97 (1,240+ Smiles)
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
