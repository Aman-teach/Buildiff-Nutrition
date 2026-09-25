import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Zap, Menu, X, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

const navItems = [
  { id: 'supplements', label: 'Supplements', href: '#products' },
  { id: 'equipment', label: 'Equipment', href: '#products' },
  { id: 'brands', label: 'Top Brands', href: '#brands' },
  { id: 'deals', label: 'Best Deals', href: '#deals', badge: 'SALE' },
];

export default function CreativeNavbar({ onCartClick, cartCount = 2 }) {
  const [activeTab, setActiveTab] = useState('home');
  const [hoveredTab, setHoveredTab] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [count, setCount] = useState(cartCount);
  const navRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('touchstart', handleOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isMobileMenuOpen]);

  // Close menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <header className="fixed top-2 sm:top-5 inset-x-2 sm:inset-x-0 z-50 flex justify-center px-1 sm:px-4">
        <motion.nav
          ref={navRef}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="w-full max-w-5xl relative flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-2xl bg-black/90 border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.85)]"
        >
          {/* Brand Logo matching .TITAN aesthetic */}
          <a href="#home" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:border-[#ccff00] transition-all duration-300 group-hover:scale-105 bg-black shrink-0">
              <img
                src="/logo.jpg"
                alt="Buildiff Nutrition"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-black tracking-tight text-white text-base sm:text-xl uppercase font-['Outfit'] flex items-center">
                <span className="text-[#ccff00] mr-0.5 text-2xl leading-none">.</span>BUILDIFF
              </span>
              <span className="hidden sm:inline-block text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                STORE
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <div 
            className="hidden md:flex items-center gap-1 relative"
            onMouseLeave={() => setHoveredTab(null)}
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  onMouseEnter={() => setHoveredTab(item.id)}
                  className={`relative px-3.5 lg:px-4 py-2 text-xs lg:text-sm font-semibold tracking-wide transition-colors duration-200 z-10 flex items-center gap-1.5 ${
                    isActive ? 'text-black font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {/* Hover Pill Background */}
                  {hoveredTab === item.id && !isActive && (
                    <motion.div
                      layoutId="hover-pill"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                      className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    />
                  )}

                  {/* Active Indicator Glow Pill (Clean White or Electric Lime) */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.55 }}
                      className="absolute inset-0 bg-white text-black rounded-full -z-10 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    />
                  )}

                  <span>{item.label}</span>

                  {/* Deal Tag in Electric Lime */}
                  {item.badge && (
                    <span className="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-[#ccff00] text-black shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>

          {/* Right Actions: Free Trial Pill & Cart Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Try For Free CTA matching .TITAN header button */}
            <a
              href="#deals"
              className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-black tracking-wide uppercase transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:scale-105 cursor-pointer"
            >
              <span>Shop Now</span>
              <span className="text-xs">↗</span>
            </a>

            {/* Cart Icon Button with Micro-interactions */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                setCount((prev) => prev + 1);
                if (onCartClick) onCartClick();
              }}
              className="relative p-2 sm:p-2.5 rounded-full bg-neutral-900 border border-white/20 text-slate-200 hover:text-white hover:border-[#ccff00] transition-all shadow-[0_4px_16px_rgba(0,0,0,0.5)] group touch-manipulation cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-rotate-6 text-white group-hover:text-[#ccff00]" />

              {/* Cart Counter Bubble (Electric Lime) */}
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.5, y: -4 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -top-1 -right-1 min-w-[18px] sm:min-w-[20px] h-4 sm:h-5 px-1 rounded-full bg-[#ccff00] text-black text-[10px] sm:text-[11px] font-black flex items-center justify-center border-2 border-black shadow-[0_0_10px_rgba(204,255,0,0.6)]"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-full bg-white/5 border border-white/10 touch-manipulation active:scale-95 transition-transform"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Dropdown Menu Card */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 p-3 sm:p-4 rounded-2xl bg-neutral-950/98 backdrop-blur-3xl border border-white/20 flex flex-col gap-1.5 md:hidden shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 max-h-[75vh] overflow-y-auto"
              >
                {/* Top Info Strip */}
                <div className="flex items-center justify-between px-3 py-1.5 mb-1 text-[11px] text-slate-400 border-b border-white/10 font-medium">
                  <span className="flex items-center gap-1.5 text-slate-200 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" /> 100% Lab Certified
                  </span>
                  <span className="text-white font-semibold">Pan-India Express</span>
                </div>

                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                      activeTab === item.id
                        ? 'bg-white/15 text-white border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                        : 'text-slate-300 hover:bg-white/5 active:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-black font-extrabold uppercase">
                        {item.badge}
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    )}
                  </a>
                ))}

                {/* Mobile Cart Action inside Drawer */}
                <div
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onCartClick) onCartClick();
                  }}
                  className="mt-2 p-3 rounded-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-white text-black">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        My Shopping Cart
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {count} items ready for checkout
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                    Open Cart
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </header>
    </>
  );
}
