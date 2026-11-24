'use client';

import React from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from 'motion/react';
import { ArrowRight, Phone, MessageSquare } from 'lucide-react';

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
}: HeroSectionProps) {
  // Subtle Mouse Parallax for Architectural Surroundings
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 55, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 55, damping: 22 });

  const leftArchX = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const leftArchY = useTransform(springY, [-0.5, 0.5], [-10, 10]);

  const rightArchX = useTransform(springX, [-0.5, 0.5], [14, -14]);
  const rightArchY = useTransform(springY, [-0.5, 0.5], [10, -10]);

  const medallionX = useTransform(springX, [-0.5, 0.5], [20, -20]);
  const medallionY = useTransform(springY, [-0.5, 0.5], [-16, 16]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative bg-white border-b border-stone-200 h-[calc(100dvh-81px)] min-h-[540px] w-full overflow-hidden flex items-center justify-center px-6 sm:px-12 select-none"
    >
      {/* Subtle Ambient Mughal Arch Outline Backdrop (Clean, Zero Clutter) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 1440 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="720" cy="400" r="420" fill="url(#centerGlow)" />

        <motion.path
          d="M 480 800 L 480 340 C 480 200 615 130 720 75 C 825 130 960 200 960 340 L 960 800"
          stroke="#D4AF37"
          strokeOpacity="0.24"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />
      </svg>

      {/* ===================================================================== */}
      {/* LEFT SURROUNDING VISUAL: Clean Sculpted Taj Arch + Smile Medallion    */}
      {/* (Zero Text, Zero Cartoon Clip-Art, Zero Wireframe Spiders)            */}
      {/* ===================================================================== */}
      <motion.div
        style={{ x: leftArchX, y: leftArchY }}
        initial={{ opacity: 0, scale: 0.92, x: -36 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="hidden lg:block absolute left-8 xl:left-16 2xl:left-24 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
      >
        <div className="relative w-[220px] xl:w-[260px] h-[340px] xl:h-[395px]">
          {/* Single Fine Gold Offset Hairline Arch */}
          <svg
            className="absolute -top-2.5 -left-2.5 w-full h-full overflow-visible"
            viewBox="0 0 260 400"
            fill="none"
          >
            <path
              d="M 10 390 L 10 155 C 10 75 85 35 130 8 C 175 35 250 75 250 155 L 250 390 Z"
              stroke="#D4AF37"
              strokeOpacity="0.55"
              strokeWidth="1.2"
            />
          </svg>

          {/* Sculpted Mughal Pointed Arch Image Cutout */}
          <svg className="w-full h-full drop-shadow-xl" viewBox="0 0 260 400">
            <defs>
              <clipPath id="leftTajArchClip">
                <path d="M 12 388 L 12 155 C 12 75 85 35 130 8 C 175 35 248 75 248 155 L 248 388 Q 248 394 242 394 L 18 394 Q 12 394 12 388 Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#leftTajArchClip)">
              <image
                href="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85"
                width="260"
                height="400"
                preserveAspectRatio="xMidYMid slice"
              />
            </g>
          </svg>

          {/* Clean Circular Clinic Consultation Medallion */}
          <motion.div
            style={{ x: medallionX, y: medallionY }}
            className="absolute -bottom-5 -right-8 w-24 xl:w-28 h-24 xl:h-28 rounded-full overflow-hidden border-4 border-white shadow-xl"
          >
            <img
              src="/images/clinic/consultation.jpg"
              alt="SSDC Agra consultation"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ===================================================================== */}
      {/* RIGHT SURROUNDING VISUAL: Clean Sculpted Operatory Arch + Agra View   */}
      {/* ===================================================================== */}
      <motion.div
        style={{ x: rightArchX, y: rightArchY }}
        initial={{ opacity: 0, scale: 0.92, x: 36 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.08 }}
        className="hidden lg:block absolute right-8 xl:right-16 2xl:right-24 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
      >
        <div className="relative w-[220px] xl:w-[260px] h-[340px] xl:h-[395px]">
          {/* Single Fine Maroon Offset Hairline Arch */}
          <svg
            className="absolute -top-2.5 -right-2.5 w-full h-full overflow-visible"
            viewBox="0 0 260 400"
            fill="none"
          >
            <path
              d="M 10 390 L 10 155 C 10 75 85 35 130 8 C 175 35 250 75 250 155 L 250 390 Z"
              stroke="#7B1123"
              strokeOpacity="0.35"
              strokeWidth="1.2"
            />
          </svg>

          {/* Sculpted Mughal Pointed Arch Image Cutout */}
          <svg className="w-full h-full drop-shadow-xl" viewBox="0 0 260 400">
            <defs>
              <clipPath id="rightClinicArchClip">
                <path d="M 12 388 L 12 155 C 12 75 85 35 130 8 C 175 35 248 75 248 155 L 248 388 Q 248 394 242 394 L 18 394 Q 12 394 12 388 Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#rightClinicArchClip)">
              <image
                href="/images/clinic/operatory.jpg"
                width="260"
                height="400"
                preserveAspectRatio="xMidYMid slice"
              />
            </g>
          </svg>

          {/* Clean Circular Chairside Care Medallion */}
          <motion.div
            style={{ x: medallionX, y: medallionY }}
            className="absolute -bottom-5 -left-8 w-24 xl:w-28 h-24 xl:h-28 rounded-full overflow-hidden border-4 border-white shadow-xl"
          >
            <img
              src="/images/clinic/dr-saurabh-chair.jpg"
              alt="SSDC Agra chairside care"
              className="w-full h-full object-cover object-top"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ===================================================================== */}
      {/* CENTER STAGE: Calm Headline & Clear Action Hierarchy                  */}
      {/* ===================================================================== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-20 max-w-xl xl:max-w-2xl mx-auto text-center space-y-6"
      >
        {/* Minimalist Kicker */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.26em] font-extrabold text-[#7B1123]"
        >
          <span className="w-7 h-[2px] bg-[#D4AF37]" />
          <span>SSDC Agra</span>
          <span className="w-7 h-[2px] bg-[#D4AF37]" />
        </motion.div>

        {/* Main Headline in Urbanist */}
        <motion.h1
          variants={itemVariants}
          className="font-funky text-4xl sm:text-6xl xl:text-[4.4rem] font-extrabold text-stone-950 leading-[0.98] tracking-tight"
        >
          World-class smiles crafted in{' '}
          <span className="text-[#7B1123] relative inline-block">
            Agra marble.
            <svg
              className="absolute -bottom-1.5 left-0 w-full h-2 text-[#D4AF37]"
              viewBox="0 0 300 10"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M2 7.5C80 2 180 2 298 7.5"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </motion.h1>

        {/* Concise Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-stone-600 text-sm sm:text-lg leading-relaxed max-w-lg mx-auto font-medium"
        >
          Microscopic painless dentistry, 45-min laser whitening, and German implants opposite the Taj Mahal.
        </motion.p>

        {/* Clear 2-Button + Subtle Link Action Row (Zero Clutter, Zero AI Labels) */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenBooking}
            className="bg-[#7B1123] hover:bg-[#580B18] text-white px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <span>Book Consultation</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </motion.button>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenCallingAgent}
            className="bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 hover:border-[#7B1123] px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#7B1123]" />
            <span>Call Reception</span>
          </motion.button>

          <button
            onClick={onOpenWhatsApp}
            className="text-stone-600 hover:text-emerald-700 px-2 py-2 text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
