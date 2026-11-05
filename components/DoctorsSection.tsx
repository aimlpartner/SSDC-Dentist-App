'use client';

import React from 'react';
import { 
  Star, 
  Award, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { Doctor } from '../lib/types';

interface DoctorsSectionProps {
  doctors: Doctor[];
  onOpenBooking: () => void;
  selectedCurrency: 'USD' | 'INR' | 'GBP' | 'EUR';
}

export default function DoctorsSection({
  doctors,
  onOpenBooking,
  selectedCurrency,
}: DoctorsSectionProps) {
  return (
    <section id="specialists" className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-b border-stone-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>Master Clinicians & Smile Architects</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Meet Our Agra Dental Specialists
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Our hospital is led by internationally certified surgeons and cosmetic smile architects who deliver gentle, microscopic precision for patients from over 40 countries.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {doctors.filter(d => d.active).map((doc) => (
            <div
              key={doc.id}
              className="bg-stone-50/80 rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-stone-400 font-normal">({doc.reviewCount} verified reviews)</span>
                    </div>
                    <h3 className="font-serif font-bold text-xl text-stone-900">{doc.name}</h3>
                    <p className="text-xs font-semibold text-amber-800 mt-0.5">{doc.specialty}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{doc.qualification}</p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-5">
                  {doc.bio}
                </p>

                {/* Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3.5 rounded-2xl border border-stone-200/80 mb-5">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Experience</span>
                    <span className="font-semibold text-stone-800">{doc.experienceYears} Years</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">OPD Consultation</span>
                    <span className="font-semibold text-stone-800">
                      {selectedCurrency === 'USD' ? `$${doc.consultationFeeUSD}` : `₹${doc.consultationFeeINR}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Location</span>
                    <span className="font-semibold text-stone-800">{doc.roomNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Working Hours</span>
                    <span className="font-semibold text-stone-800">{doc.availableHours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 hover:from-amber-800 hover:to-black text-white font-semibold py-2.5 rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  <span>Book Consultation with {doc.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
