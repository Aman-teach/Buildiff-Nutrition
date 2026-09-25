import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  Star,
  Zap,
  Package,
  FlaskConical
} from 'lucide-react';

// Customer review quotes
const reviews = [
  {
    quote: "Buildiff's whey protein is genuinely the cleanest formula I've tried. Zero bloat, incredible mixability, and the taste is unreal.",
    author: "Arjun S.",
    tag: "Verified Buyer"
  },
  {
    quote: "Got my pre-workout and resistance bands in 2 days. The packaging is premium and the product quality speaks for itself.",
    author: "Priya R.",
    tag: "Repeat Customer"
  },
  {
    quote: "Finally a gym store that knows what they're doing. No fake supplements, no cheap equipment — just the real stuff.",
    author: "Rahul M.",
    tag: "5-Star Review"
  }
];

// Product categories showcase
const productCategories = [
  {
    id: 'protein',
    tag: 'Protein',
    title: 'Whey, Plant & Mass Gainers — clinical-grade formulas',
    image: '/gym-power-zone.jpg',
    count: '40+ Products'
  },
  {
    id: 'equipment',
    tag: 'Equipment',
    title: 'Barbells, Dumbbells, Resistance Bands & more',
    image: '/gym-cardio-zone.jpg',
    count: '60+ Products'
  },
  {
    id: 'nutrition',
    tag: 'Nutrition',
    title: 'Pre-workouts, Creatine, BCAAs & Recovery stacks',
    image: '/gym-bento-center.jpg',
    count: '55+ Products'
  }
];

export default function Banner() {
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [activeCatIdx, setActiveCatIdx] = useState(0);

  const prevReview = () =>
    setActiveReviewIdx((p) => (p === 0 ? reviews.length - 1 : p - 1));
  const nextReview = () =>
    setActiveReviewIdx((p) => (p === reviews.length - 1 ? 0 : p + 1));

  const prevCat = () =>
    setActiveCatIdx((p) => (p === 0 ? productCategories.length - 2 : p - 1));
  const nextCat = () =>
    setActiveCatIdx((p) => (p >= productCategories.length - 2 ? 0 : p + 1));

  return (
    <div
      id="home"
      className="w-full bg-white text-neutral-900 font-['Outfit'] selection:bg-[#ccff00] selection:text-black"
    >
      {/* =====================================================================
          SECTION 1 — HERO BENTO
          ===================================================================== */}
      <section className="relative min-h-[90vh] flex flex-col justify-between pt-24 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full bg-white">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none opacity-60" />
        {/* Lime glow hint */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[550px] h-[350px] bg-gradient-to-br from-[#ccff00]/15 via-transparent to-transparent rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Headline */}
        <div className="relative z-10 max-w-3xl pt-4 sm:pt-10 mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-300 bg-neutral-100 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00] animate-pulse" />
            Gym Store · Supplements · Equipment
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-neutral-950 uppercase leading-[1.02] mb-6 sm:mb-8"
          >
            Fuel the<br />
            <span className="text-[#ccff00] drop-shadow-[0_0_40px_rgba(204,255,0,0.4)]">
              Difference.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base sm:text-lg text-neutral-500 max-w-lg mb-8 leading-relaxed font-normal"
          >
            Premium supplements, gym equipment &amp; nutrition — all in one store. Zero fillers, clinical dosages, pan-India delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center gap-3.5 sm:gap-4"
          >
            {/* Primary CTA */}
            <a
              id="hero-shop-now-btn"
              href="#products"
              className="inline-flex items-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-black text-sm sm:text-base tracking-wide transition-all duration-300 shadow-[0_10px_25px_rgba(204,255,0,0.35)] hover:scale-105 cursor-pointer group"
            >
              <span>Shop Now</span>
              <span className="w-6 h-6 rounded-full bg-black text-[#ccff00] flex items-center justify-center text-xs group-hover:rotate-45 transition-transform">
                ↗
              </span>
            </a>

            {/* Secondary CTA */}
            <a
              id="hero-browse-btn"
              href="#categories"
              className="inline-flex items-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <span>Browse Categories</span>
            </a>
          </motion.div>
        </div>

        {/* Three Bottom Bento Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 w-full mt-auto"
        >
          {/* Card 1 — 25,000+ Happy Customers */}
          <div className="md:col-span-4 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300">
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="flex -space-x-3 overflow-hidden">
                  <img
                    className="inline-block h-10 w-10 sm:h-11 sm:w-11 rounded-full ring-2 ring-white object-cover grayscale"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                    alt="Customer"
                  />
                  <img
                    className="inline-block h-10 w-10 sm:h-11 sm:w-11 rounded-full ring-2 ring-white object-cover grayscale"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                    alt="Customer"
                  />
                  <img
                    className="inline-block h-10 w-10 sm:h-11 sm:w-11 rounded-full ring-2 ring-white object-cover grayscale"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
                    alt="Customer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3 h-3 fill-[#ccff00] text-[#ccff00]" />
                    ))}
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-black leading-none">25,000+</h4>
                  <p className="text-[11px] sm:text-xs text-neutral-500 font-medium">happy customers</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                Athletes, beginners &amp; professionals across India trust Buildiff for their supplement and equipment needs.
              </p>
            </div>
          </div>

          {/* Card 2 — Scrolling Review Quotes */}
          <div className="md:col-span-4 bg-[#111113] border border-neutral-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between text-white shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between gap-3 mb-4">
              <button
                onClick={prevReview}
                aria-label="Previous review"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors shrink-0 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <AnimatePresence mode="wait">
                <motion.p
                  key={activeReviewIdx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium text-center px-1"
                >
                  "{reviews[activeReviewIdx].quote}"
                </motion.p>
              </AnimatePresence>

              <button
                onClick={nextReview}
                aria-label="Next review"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors shrink-0 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold border-t border-white/10 pt-3">
              <span className="text-neutral-300">{reviews[activeReviewIdx].author}</span>
              <span className="text-[#ccff00] font-bold">{reviews[activeReviewIdx].tag}</span>
            </div>
          </div>

          {/* Card 3 — Free Shipping Offer */}
          <div className="md:col-span-4 bg-[#ccff00] text-black rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_12px_35px_rgba(204,255,0,0.35)] relative group cursor-pointer hover:scale-[1.02] transition-all duration-300">
            <div className="flex justify-end">
              <span className="w-9 h-9 rounded-full bg-black text-[#ccff00] flex items-center justify-center text-base group-hover:scale-110 group-hover:rotate-45 transition-all duration-300">
                ↗
              </span>
            </div>
            <div className="mt-6 sm:mt-8">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-5 h-5 text-black/70" />
                <span className="text-xs font-black uppercase tracking-widest text-black/70">Free Delivery</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight mb-2">
                Orders above ₹999 ship free
              </h3>
              <p className="text-xs sm:text-sm text-black/80 font-semibold">
                Pan-India express delivery in 48 hours
              </p>
            </div>
          </div>
        </motion.div>
      </section>


      {/* =====================================================================
          SECTION 2 — PRODUCT CATEGORIES SHOWCASE
          ===================================================================== */}
      <section
        id="categories"
        className="w-full bg-[#f8f9fa] border-y border-neutral-200/70 text-black py-20 sm:py-28 px-4 sm:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left: Heading & CTA */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-black/30 text-xs font-bold uppercase tracking-wider text-black mb-6">
                Product Range
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-[2.8rem] font-black text-black uppercase leading-[1.1] tracking-tight mb-4">
                Everything you need to train harder &amp; recover faster.
              </h2>
              <p className="text-sm sm:text-base text-neutral-500 leading-relaxed mb-8 max-w-sm">
                From pharma-grade whey protein and creatine to barbells, knee sleeves, and lifting belts — Buildiff stocks it all.
              </p>

              <a
                id="categories-view-all-btn"
                href="#products"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-black text-white hover:bg-neutral-800 font-bold text-sm tracking-wide transition-all duration-300 group cursor-pointer shadow-lg hover:scale-105"
              >
                <span>View All Products</span>
                <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs group-hover:rotate-45 transition-transform">
                  ↗
                </span>
              </a>
            </div>

            {/* Right: Category Cards + Nav */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                {/* Category Card 1 */}
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-[380px] sm:h-[460px] rounded-3xl overflow-hidden group shadow-xl bg-neutral-900 cursor-pointer"
                >
                  <img
                    src={productCategories[activeCatIdx].image}
                    alt={productCategories[activeCatIdx].tag}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />
                  <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
                    <span className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-black tracking-wide shadow-md uppercase">
                      {productCategories[activeCatIdx].tag}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-[#ccff00] text-black text-[10px] font-black tracking-wide shadow-md uppercase">
                      {productCategories[activeCatIdx].count}
                    </span>
                  </div>
                  <div className="absolute bottom-5 inset-x-5 z-10 flex items-end justify-between gap-3 text-white">
                    <p className="text-base sm:text-lg font-bold leading-snug drop-shadow-md">
                      {productCategories[activeCatIdx].title}
                    </p>
                    <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-sm shrink-0 group-hover:bg-[#ccff00] group-hover:text-black transition-colors">
                      ↗
                    </span>
                  </div>
                </motion.div>

                {/* Category Card 2 */}
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-[380px] sm:h-[460px] rounded-3xl overflow-hidden group shadow-xl bg-neutral-900 cursor-pointer"
                >
                  <img
                    src={productCategories[(activeCatIdx + 1) % productCategories.length].image}
                    alt={productCategories[(activeCatIdx + 1) % productCategories.length].tag}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />
                  <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
                    <span className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-black tracking-wide shadow-md uppercase">
                      {productCategories[(activeCatIdx + 1) % productCategories.length].tag}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-[#ccff00] text-black text-[10px] font-black tracking-wide shadow-md uppercase">
                      {productCategories[(activeCatIdx + 1) % productCategories.length].count}
                    </span>
                  </div>
                  <div className="absolute bottom-5 inset-x-5 z-10 flex items-end justify-between gap-3 text-white">
                    <p className="text-base sm:text-lg font-bold leading-snug drop-shadow-md">
                      {productCategories[(activeCatIdx + 1) % productCategories.length].title}
                    </p>
                    <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-sm shrink-0 group-hover:bg-[#ccff00] group-hover:text-black transition-colors">
                      ↗
                    </span>
                  </div>
                </motion.div>

              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  id="cat-carousel-prev"
                  onClick={prevCat}
                  aria-label="Previous category"
                  className="w-11 h-11 rounded-full border border-black/30 hover:border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  id="cat-carousel-next"
                  onClick={nextCat}
                  aria-label="Next category"
                  className="w-11 h-11 rounded-full border border-black/30 hover:border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================================
          SECTION 3 — DARK STORE FEATURE BENTO GRID
          ===================================================================== */}
      <section id="brands" className="w-full bg-white py-20 sm:py-28 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto bg-[#0c0c0e] rounded-[40px] sm:rounded-[48px] p-6 sm:p-10 lg:p-12 border border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.14)] text-white">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">

            {/* COL 1 — Store Trust Pillars */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-4 sm:gap-5">

              {/* Card: Lab Certified */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-[#18181b] border border-white/5 rounded-3xl p-6 sm:p-7 flex items-center gap-5 transition-all shadow-md group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white shrink-0 group-hover:text-[#ccff00] transition-colors">
                  <FlaskConical className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-white/95 leading-snug">
                    100% Lab Certified
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">FSSAI &amp; GMP tested, every batch</p>
                </div>
              </motion.div>

              {/* Card: Zero Fillers */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-[#18181b] border border-white/5 rounded-3xl p-6 sm:p-7 flex items-center gap-5 transition-all shadow-md group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white shrink-0 group-hover:text-[#ccff00] transition-colors">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-white/95 leading-snug">
                    Zero Fillers
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">100% active ingredients only</p>
                </div>
              </motion.div>

              {/* Split Row: 100+ Brands & Protein Range */}
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-[#18181b] border border-white/5 rounded-3xl p-6 flex items-baseline gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span className="text-5xl sm:text-6xl font-black text-white leading-none">100</span>
                  <span className="text-xs font-semibold text-neutral-400 leading-tight">+<br />Brands</span>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-[#18181b] border border-white/5 rounded-3xl p-5 flex flex-col items-start justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Package className="w-6 h-6 text-neutral-400" />
                  <p className="text-xs sm:text-sm font-semibold text-white/90 leading-tight">
                    Supplements &amp; Equipment
                  </p>
                </motion.div>
              </div>

            </div>


            {/* COL 2 — Hero Product Visual */}
            <div className="lg:col-span-4 relative min-h-[420px] sm:min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="/gym-bento-center.jpg"
                alt="Buildiff Store Products"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] group-hover:bg-black/40 transition-colors" />

              {/* Neon .B brand mark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-44 h-44 bg-[#ccff00]/20 rounded-full blur-2xl" />
                  <div className="relative flex items-baseline select-none">
                    <span className="text-[#ccff00] text-7xl sm:text-9xl font-black leading-none drop-shadow-[0_0_35px_rgba(204,255,0,0.65)]">
                      .
                    </span>
                    <span className="text-[#ccff00] text-7xl sm:text-9xl font-black leading-none tracking-tight drop-shadow-[0_0_35px_rgba(204,255,0,0.65)]">
                      B
                    </span>
                  </div>
                </div>
              </div>
            </div>


            {/* COL 3 — Delivery & Trust Stats */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-4 sm:gap-5">

              {/* Split Row: Fast Delivery & Easy Returns */}
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-[#18181b] border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-3 transition-all shadow-md group cursor-pointer"
                >
                  <Truck className="w-8 h-8 text-white group-hover:text-[#ccff00] transition-colors" />
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">48h Delivery</span>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-[#18181b] border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-3 transition-all shadow-md group cursor-pointer"
                >
                  <Zap className="w-8 h-8 text-white group-hover:text-[#ccff00] transition-colors" />
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Flash Sales</span>
                </motion.div>
              </div>

              {/* Card: Pre-workout & Stacks */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-[#18181b] border border-white/5 rounded-3xl p-6 sm:p-7 flex items-center gap-5 transition-all shadow-md group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white shrink-0 group-hover:text-[#ccff00] transition-colors">
                  {/* Energy bolt custom icon */}
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-white/95 leading-snug">
                    Pre-workout &amp; Supplement Stacks
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">Bundled for max results</p>
                </div>
              </motion.div>

              {/* Split Row: Easy Returns & 4.9 Stars */}
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-[#18181b] border border-white/5 rounded-3xl p-5 flex flex-col items-start justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-neutral-400" />
                  <p className="text-xs sm:text-sm font-semibold text-white/90 leading-snug">
                    Easy<br />Returns
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-[#18181b] border border-white/5 rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all shadow-md group cursor-pointer"
                >
                  <span className="text-3xl sm:text-4xl font-black text-white group-hover:text-[#ccff00] transition-colors">
                    4.9★
                  </span>
                  <span className="text-[11px] font-semibold text-neutral-400 mt-1">Store Rating</span>
                </motion.div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================================
          FOOTER
          ===================================================================== */}
      <footer className="w-full bg-white border-t border-neutral-200 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[#ccff00] text-2xl font-black">.</span>
            <span className="font-black text-neutral-900 text-lg uppercase tracking-tight">BUILDIFF</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase ml-1">STORE</span>
          </div>
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Buildiff Nutrition & Fitness Store. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs font-semibold text-neutral-500">
            <a href="#categories" className="hover:text-black transition-colors">Products</a>
            <a href="#brands" className="hover:text-black transition-colors">Brands</a>
            <a href="#deals" className="hover:text-black transition-colors">Deals</a>
            <a href="#home" className="hover:text-black transition-colors">↑ Top</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
