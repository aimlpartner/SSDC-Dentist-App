'use client';

import React from 'react';
import { Star, Quote, MapPin, Globe } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      origin: 'London, United Kingdom',
      type: 'Foreign Dental Tourist',
      treatment: '6 E-Max Porcelain Veneers',
      quote: 'I flew to India to visit the Taj Mahal and fix my smile. The team at Taj White Pearl arranged my Oberoi hotel car, and Dr. Ananya gave me the most radiant, natural veneers I could ever imagine. I saved over £4,000 compared to London Harley Street!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 5,
    },
    {
      id: 2,
      name: 'Mark Reynolds',
      origin: 'Sydney, Australia',
      type: 'Foreign Dental Tourist',
      treatment: 'German Zirconia Implant',
      quote: 'Dr. Aarav Sharma is a genius implantologist. The 3D CBCT guided surgery was 100% painless. I was walking around Agra Fort the very next afternoon! The WhatsApp concierge sent all my appointment reminders effortlessly.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      rating: 5,
    },
    {
      id: 3,
      name: 'Vikram Singhal',
      origin: 'DayalBagh, Agra',
      type: 'Local Agra Resident',
      treatment: 'Taj Pearl Laser Whitening & Cleaning',
      quote: 'As Agra locals, our entire family relies on Taj White Pearl. We can walk in anytime, and the staff treats us with immense warmth and clinical hygiene. Teeth whitening took only 45 minutes before my wedding.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      rating: 5,
    },
  ];

  return (
    <section id="reviews" className="py-16 sm:py-24 px-4 sm:px-8 bg-stone-50 border-b border-stone-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200">
            Real Patient Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Smiles Transformed in Agra
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Read stories from international travelers and Agra residents who chose our hospital for world-class dental excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-stone-700 leading-relaxed italic mb-5">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-stone-200"
                />
                <div>
                  <h4 className="font-serif font-bold text-xs text-stone-900">{rev.name}</h4>
                  <p className="text-[10px] text-amber-800 font-medium">{rev.treatment}</p>
                  <p className="text-[10px] text-stone-500">{rev.origin}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
