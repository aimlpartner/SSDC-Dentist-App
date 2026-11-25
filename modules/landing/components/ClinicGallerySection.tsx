'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

type GalleryCategory = 'All' | 'Chairside Care' | 'Operatory' | 'Consultation';

interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: Exclude<GalleryCategory, 'All'>;
  featured?: boolean;
  objectPosition?: string;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'chair-sapna',
    src: '/images/clinic/dr-sapna-chair.jpg',
    title: 'Chairside Treatment with Dr. Sapna',
    caption: 'Gentle restorative and endodontic care performed under overhead surgical illumination.',
    category: 'Chairside Care',
    featured: true,
    objectPosition: 'object-[50%_58%]',
  },
  {
    id: 'chair-saurabh',
    src: '/images/clinic/dr-saurabh-chair.jpg',
    title: 'Chairside Examination with Dr. Saurabh',
    caption: 'Precision clinical examination and painless chairside care for every patient.',
    category: 'Chairside Care',
    featured: true,
    objectPosition: 'object-[50%_18%]',
  },
  {
    id: 'operatory-suite',
    src: '/images/clinic/operatory.jpg',
    title: 'Twin-Chair Dental Operatory',
    caption: 'Sterile treatment room equipped with overhead lamps and digital delivery units.',
    category: 'Operatory',
    objectPosition: 'object-center',
  },
  {
    id: 'patient-consultation',
    src: '/images/clinic/consultation.jpg',
    title: 'One-on-One Consultation',
    caption: 'Dr. Sapna walking patients through every step of their treatment plan before starting.',
    category: 'Consultation',
    objectPosition: 'object-center',
  },
  {
    id: 'doctors-desk',
    src: '/images/clinic/doctors-together.jpg',
    title: 'Dr. Saurabh & Dr. Sapna',
    caption: 'Co-founders at the SSDC Fatehabad Road consultation desk in Agra.',
    category: 'Consultation',
    objectPosition: 'object-center',
  },
  {
    id: 'reception-area',
    src: '/images/clinic/reception-desk.jpg',
    title: 'Consultation & Reception Desk',
    caption: 'Calm patient lounge at Karim Complex, opposite Pizza Hut, Fatehabad Road.',
    category: 'Operatory',
    objectPosition: 'object-center',
  },
];

const CATEGORIES: GalleryCategory[] = [
  'All',
  'Chairside Care',
  'Operatory',
  'Consultation',
];

export default function ClinicGallerySection() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visiblePhotos =
    activeCategory === 'All'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === activeCategory);

  const handleClose = useCallback(() => setLightboxIndex(null), []);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + visiblePhotos.length) % visiblePhotos.length;
    });
  }, [visiblePhotos.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % visiblePhotos.length;
    });
  }, [visiblePhotos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxIndex, handleClose, handlePrev, handleNext]);

  const activePhoto =
    lightboxIndex !== null ? visiblePhotos[lightboxIndex] : null;

  const chairsidePhotos = GALLERY_PHOTOS.filter((p) => p.featured);
  const clinicSpacePhotos = GALLERY_PHOTOS.filter((p) => !p.featured);

  const renderPhotoFigure = (
    photo: GalleryPhoto,
    idx: number,
    aspectClass: string,
    compact = false
  ) => (
    <motion.figure
      key={photo.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (idx % 4) * 0.05 }}
      onClick={() => setLightboxIndex(idx)}
      className="group cursor-pointer space-y-3"
    >
      <div
        className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80`}
      >
        <img
          src={photo.src}
          alt={photo.title}
          loading="lazy"
          className={`w-full h-full object-cover ${
            photo.objectPosition || 'object-center'
          } group-hover:scale-[1.03] transition-transform duration-700 ease-out`}
        />
        <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/15 transition-colors duration-300 flex items-end justify-end p-4">
          <span className="w-9 h-9 rounded-full bg-white/95 text-stone-950 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center shadow-sm">
            <ArrowUpRight className="w-4 h-4 text-[#7B1123]" />
          </span>
        </div>
      </div>

      <figcaption className="pt-1.5 border-t border-stone-200/80 flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-funky text-xs font-extrabold text-[#D4AF37]">
              0{idx + 1}
            </span>
            <h3
              className={`font-funky font-extrabold ${
                compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
              } text-stone-950 group-hover:text-[#7B1123] transition-colors`}
            >
              {photo.title}
            </h3>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            {photo.caption}
          </p>
        </div>

        {!compact && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 shrink-0 pt-1">
            {photo.category}
          </span>
        )}
      </figcaption>
    </motion.figure>
  );

  return (
    <section
      id="gallery"
      className="py-20 sm:py-28 px-4 sm:px-8 bg-white border-b border-stone-200 scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-14">
        {/* Top Editorial Header & Category Underline Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-6 border-b border-stone-200"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] font-extrabold text-[#7B1123]">
              <span className="w-6 h-[2px] bg-[#D4AF37]" />
              <span>Inside SSDC Agra</span>
            </div>
            <h2 className="font-funky text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-[1.04]">
              Real care in the chair.
            </h2>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
              A look inside our Fatehabad Road operatory suites, chairside treatments, and patient consultations.
            </p>
          </div>

          {/* Minimalist Underline Filter Tabs */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-xs sm:text-sm font-bold">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setLightboxIndex(null);
                }}
                className={`pb-2 transition-all cursor-pointer relative ${
                  activeCategory === cat
                    ? 'text-[#7B1123]'
                    : 'text-stone-400 hover:text-stone-800'
                }`}
              >
                <span>{cat}</span>
                {activeCategory === cat && (
                  <motion.span
                    layoutId="activeGalleryTab"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#7B1123]"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Unboxed Editorial Photography Grid */}
        {activeCategory === 'All' ? (
          <div className="space-y-10 sm:space-y-12">
            {/* Top Spotlight: Real Chairside Patient Care (Portrait Frames) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {chairsidePhotos.map((photo, idx) =>
                renderPhotoFigure(photo, idx, 'aspect-[4/4.2] sm:aspect-[5/5]')
              )}
            </div>

            {/* Supporting Strip: Operatory & Consultation Rooms (Natural Landscape Frames) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {clinicSpacePhotos.map((photo, idx) =>
                renderPhotoFigure(
                  photo,
                  chairsidePhotos.length + idx,
                  'aspect-[4/3]',
                  true
                )
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {visiblePhotos.map((photo, idx) =>
              renderPhotoFigure(
                photo,
                idx,
                photo.featured ? 'aspect-[4/4.2] sm:aspect-[5/5]' : 'aspect-[4/3]'
              )
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Viewer */}
      <AnimatePresence>
        {activePhoto && lightboxIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={activePhoto.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full flex flex-col items-center gap-4"
            >
              {/* Close Button */}
              <div className="w-full flex items-center justify-between text-white">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                  {lightboxIndex + 1} / {visiblePhotos.length} &middot;{' '}
                  {activePhoto.category}
                </span>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close photo viewer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Stage + Prev/Next */}
              <div className="relative w-full flex items-center justify-center">
                {visiblePhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous photo"
                    className="absolute left-2 sm:-left-14 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                <img
                  src={activePhoto.src}
                  alt={activePhoto.title}
                  className="max-h-[72dvh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
                />

                {visiblePhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next photo"
                    className="absolute right-2 sm:-right-14 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Caption */}
              <div className="text-center space-y-1 max-w-xl">
                <h3 className="font-funky font-extrabold text-lg sm:text-xl text-white">
                  {activePhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300">
                  {activePhoto.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
