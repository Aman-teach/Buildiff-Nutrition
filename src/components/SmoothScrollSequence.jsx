import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Sparkles, ShieldCheck } from 'lucide-react';

/* =========================================================================
   BUILDIFF MASTER CINEMATIC TIMELINE (EP1 + EP2 + EP3)
   =========================================================================
   - Total Frames: 707
     * EP 1: Frames 1 - 300    (Exterior -> Doorway Entrance -> Aisle)
     * EP 2: Frames 301 - 600  (Deep Vault Walkthrough -> Counter & Shelves)
     * EP 3: Frames 601 - 707  (Athlete Presentation -> Tub Showcase -> Flex)
   
   - Door Rush Pacing:
     On the very first scroll gesture (progress 0.00 -> 0.025, ~120px scroll),
     the camera rapidly rushes from Frame 1 to Frame 68 (centered in doorway)!
   
   - LERP Easing:
     Current frame smoothly interpolates toward target frame at 60/120fps.
   ========================================================================= */

const SEQUENCE_CONFIG = {
  totalFrames: 707,
  containerHeight: '850vh', // Generous scroll runway for physical, luxurious pacing
  lerpFactor: 0.086,        // Silky smooth damping without latency
  canvasWidth: 1920,
  canvasHeight: 1080,
  doorFrame: 68,            // Camera centered in the middle of open entrance doors

  stages: [
    {
      progress: 0.000,
      frame: 1,
      episode: 'EPISODE 01',
      title: 'FLAGSHIP STOREFRONT',
      subtitle: 'Buildiff Nutrition Headquarters',
    },
    // On the first scroll gesture, directly surge straight into the door!
    {
      progress: 0.025,
      frame: 68,
      episode: 'EPISODE 01',
      title: 'THE THRESHOLD',
      subtitle: 'Camera in Middle of the Door',
    },
    {
      progress: 0.380,
      frame: 300,
      episode: 'EPISODE 01',
      title: 'PERFORMANCE VAULT',
      subtitle: 'Exploring Supplement Aisles',
    },
    {
      progress: 0.720,
      frame: 600,
      episode: 'EPISODE 02',
      title: 'THE FORMULATION DESK',
      subtitle: 'Inspecting The Gold Standard',
    },
    {
      progress: 0.930,
      frame: 707,
      episode: 'EPISODE 03',
      title: 'FUEL THE DIFFERENCE',
      subtitle: 'Clinically Proven Excellence',
    },
    {
      progress: 1.000,
      frame: 707,
      episode: 'EPISODE 03',
      title: 'WELCOME TO BUILDIFF',
      subtitle: 'Explore The Catalog Below',
    },
  ],
};

// Map any global frame (1 to 707) to its respective episode folder & file
function getFrameUrl(globalFrame) {
  const g = Math.max(1, Math.min(SEQUENCE_CONFIG.totalFrames, Math.round(globalFrame)));
  if (g <= 300) {
    const local = g;
    return `/ep1 buildiff/ezgif-frame-${local.toString().padStart(3, '0')}.png`;
  } else if (g <= 600) {
    const local = g - 300;
    return `/ep2 buildiff/ezgif-frame-${local.toString().padStart(3, '0')}.png`;
  } else {
    const local = g - 600;
    return `/ep3 buildiff/ezgif-frame-${local.toString().padStart(3, '0')}.png`;
  }
}

// Helper: Calculate interpolated frame for any scroll progress (0.0 to 1.0)
function calculateFrameForProgress(progress, stages) {
  const p = Math.max(0, Math.min(1, progress));
  for (let i = 0; i < stages.length - 1; i++) {
    const current = stages[i];
    const next = stages[i + 1];
    if (p >= current.progress && p <= next.progress) {
      const segmentRatio = (p - current.progress) / (next.progress - current.progress);
      return current.frame + segmentRatio * (next.frame - current.frame);
    }
  }
  return stages[stages.length - 1].frame;
}

// Helper: Get active chapter information based on current frame
function getActiveStageInfo(currentFrame, stages) {
  let active = stages[0];
  for (let i = 0; i < stages.length; i++) {
    if (currentFrame >= stages[i].frame) {
      active = stages[i];
    }
  }
  return active;
}

export default function SmoothScrollSequence() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  // Animation interpolation state
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const lastDrawnFrameRef = useRef(-1);

  // UI state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(SEQUENCE_CONFIG.stages[0]);
  const [showProductTag, setShowProductTag] = useState(false);

  // High-performance image cache
  const imagesRef = useRef(new Map());

  // -------------------------------------------------------------
  // 1. DYNAMIC HIGH-PERFORMANCE PRELOADER
  // -------------------------------------------------------------
  // Loads priority frames first, then dynamically prefetches a window
  // around the current frame so RAM stays lean and scrolling stays fluid.
  const loadImage = useCallback((frameIdx) => {
    if (frameIdx < 1 || frameIdx > SEQUENCE_CONFIG.totalFrames) return null;
    if (imagesRef.current.has(frameIdx)) {
      return imagesRef.current.get(frameIdx);
    }

    const img = new Image();
    img.src = getFrameUrl(frameIdx);
    imagesRef.current.set(frameIdx, img);
    return img;
  }, []);

  // Preload immediate critical milestones
  useEffect(() => {
    // 1. Initial storefront
    loadImage(1);
    // 2. Door entrance frames (rapid first scroll)
    for (let i = 2; i <= 75; i++) {
      loadImage(i);
    }
    // 3. Episode boundaries for instant handoff
    loadImage(300);
    loadImage(301);
    loadImage(600);
    loadImage(601);
    loadImage(707);

    // 4. Background streamer: gradually load the rest without locking the main thread
    let currentPreloadIdx = 76;
    let idleHandler;

    const preloadChunk = () => {
      const chunkSize = 8;
      for (let c = 0; c < chunkSize && currentPreloadIdx <= SEQUENCE_CONFIG.totalFrames; c++) {
        loadImage(currentPreloadIdx);
        currentPreloadIdx++;
      }
      if (currentPreloadIdx <= SEQUENCE_CONFIG.totalFrames) {
        idleHandler = window.requestIdleCallback
          ? window.requestIdleCallback(preloadChunk)
          : setTimeout(preloadChunk, 40);
      }
    };

    idleHandler = window.requestIdleCallback
      ? window.requestIdleCallback(preloadChunk)
      : setTimeout(preloadChunk, 150);

    return () => {
      if (window.cancelIdleCallback && idleHandler) {
        window.cancelIdleCallback(idleHandler);
      } else {
        clearTimeout(idleHandler);
      }
    };
  }, [loadImage]);

  // -------------------------------------------------------------
  // 2. BUTTER-SMOOTH LERP RENDERING LOOP
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: false });

    // Set fixed 1080p canvas resolution once
    canvas.width = SEQUENCE_CONFIG.canvasWidth;
    canvas.height = SEQUENCE_CONFIG.canvasHeight;

    const renderFrame = (img) => {
      if (!img || !img.complete || img.naturalWidth === 0) return false;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      return true;
    };

    // Find closest loaded neighbor if target frame is still streaming
    const findClosestLoadedImg = (targetIdx) => {
      const direct = imagesRef.current.get(targetIdx);
      if (direct?.complete && direct?.naturalWidth > 0) return direct;

      // Scan outwards (up to 20 frames away)
      for (let offset = 1; offset <= 20; offset++) {
        const lower = targetIdx - offset;
        const higher = targetIdx + offset;
        const lowerImg = imagesRef.current.get(lower);
        if (lowerImg?.complete && lowerImg?.naturalWidth > 0) return lowerImg;
        const higherImg = imagesRef.current.get(higher);
        if (higherImg?.complete && higherImg?.naturalWidth > 0) return higherImg;
      }
      return null;
    };

    let lastHudUpdate = 0;

    const animate = () => {
      // Linear Interpolation (LERP) easing
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.005) {
        currentFrameRef.current += diff * SEQUENCE_CONFIG.lerpFactor;
      } else {
        currentFrameRef.current = target;
      }

      const frameToDraw = Math.max(1, Math.min(SEQUENCE_CONFIG.totalFrames, Math.round(currentFrameRef.current)));

      // Dynamic sliding window prefetch: keep 25 frames ahead loaded
      for (let i = 1; i <= 25; i++) {
        loadImage(frameToDraw + i);
      }

      // Draw only when frame changes to preserve GPU cycles
      if (frameToDraw !== lastDrawnFrameRef.current) {
        const directImg = imagesRef.current.get(frameToDraw) || loadImage(frameToDraw);
        let drewSuccessfully = renderFrame(directImg);

        if (!drewSuccessfully) {
          // Fallback to nearest loaded frame to guarantee ZERO flicker
          const fallback = findClosestLoadedImg(frameToDraw);
          if (fallback) {
            renderFrame(fallback);
          }
        }

        lastDrawnFrameRef.current = frameToDraw;

        // Throttle React state updates
        const now = performance.now();
        if (now - lastHudUpdate > 50) {
          setActiveStage(getActiveStageInfo(frameToDraw, SEQUENCE_CONFIG.stages));
          setShowProductTag(frameToDraw >= 620 && frameToDraw <= 707);
          lastHudUpdate = now;
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    // Initial render for frame 1
    const initialImg = loadImage(1);
    if (initialImg) {
      if (initialImg.complete) {
        renderFrame(initialImg);
        lastDrawnFrameRef.current = 1;
      } else {
        initialImg.onload = () => {
          renderFrame(initialImg);
          lastDrawnFrameRef.current = 1;
        };
      }
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loadImage]);

  // -------------------------------------------------------------
  // 3. SCROLL PROGRESSION LISTENER
  // -------------------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      const scrollDistance = -rect.top;
      const maxScroll = rect.height - window.innerHeight;

      if (maxScroll <= 0) return;

      const progress = Math.max(0, Math.min(1, scrollDistance / maxScroll));
      setScrollProgress(progress);

      // Compute frame from structured timeline
      const mappedFrame = calculateFrameForProgress(progress, SEQUENCE_CONFIG.stages);
      targetFrameRef.current = mappedFrame;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Quick skip function to enter the store directly
  const handleSkipToStore = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const targetScrollY = window.scrollY + rect.bottom - window.innerHeight;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  // Determine which episode badge is active
  const currentGlobalFrame = Math.round(currentFrameRef.current);
  const currentEpNumber = currentGlobalFrame <= 300 ? 1 : currentGlobalFrame <= 600 ? 2 : 3;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black z-30"
      style={{ height: SEQUENCE_CONFIG.containerHeight }}
    >
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen flex justify-center items-center overflow-hidden bg-black select-none">
        
        {/* Subtle Ambient Radial Backlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_75%)] pointer-events-none" />

        {/* 1080p High-Precision Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none will-change-transform"
        />

        {/* Master Progress Bar (Electric Lime to Pure White) */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/10 z-40">
          <div
            className="h-full bg-gradient-to-r from-white via-[#ccff00] to-[#b8e600] transition-[width] duration-75 ease-out shadow-[0_0_12px_rgba(204,255,0,0.9)]"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>

        {/* Top HUD: Current Episode & Frame Indicator (Stacked neatly in top-left) */}
        <div className="absolute top-4 sm:top-5 left-3 sm:left-6 z-40 pointer-events-none flex flex-col items-start gap-1.5">
          {/* Episode Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-black/85 backdrop-blur-md text-[10px] sm:text-xs font-mono tracking-widest text-slate-200 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse shadow-[0_0_8px_#ccff00]" />
            <span>EP 0{currentEpNumber}</span>
            <span className="text-white/30">•</span>
            <span className="text-slate-400">FRAME {currentGlobalFrame.toString().padStart(3, '0')}/707</span>
          </div>

          {/* Chapter Subtitle (Electric Lime Compact Luxury Tag) */}
          <div className="hidden lg:flex flex-col text-left px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 shadow-lg">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#ccff00] font-bold">
              {activeStage.title}
            </span>
            <span className="text-[10px] text-slate-300 font-light tracking-wide">
              {activeStage.subtitle}
            </span>
          </div>
        </div>

        {/* Top Right: Episode Progression Pill & Skip Button */}
        <div className="absolute top-5 sm:top-6 right-4 sm:right-10 z-40 flex items-center gap-2 sm:gap-3">
          {/* 3-Episode Segment Pill Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-md">
            {[1, 2, 3].map((ep) => (
              <div
                key={ep}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentEpNumber === ep
                    ? 'w-7 bg-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.85)]'
                    : currentEpNumber > ep
                    ? 'w-3 bg-white/60'
                    : 'w-3 bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleSkipToStore}
            className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 bg-black/80 hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] backdrop-blur-md text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] cursor-pointer"
          >
            <span>Skip to Store</span>
            <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Interactive Floating Product Tag in EPISODE 3 (Athlete Presentation) */}
        <AnimatePresence>
          {showProductTag && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-24 sm:bottom-12 right-4 sm:right-12 z-40 max-w-xs sm:max-w-sm p-4 rounded-2xl bg-black/90 border border-white/20 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] text-left"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#ccff00]/20 text-[#ccff00] text-[10px] font-bold tracking-wider uppercase border border-[#ccff00]/40">
                  Featured Formula
                </span>
                <div className="flex items-center gap-1 text-[11px] text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>100% Authentic</span>
                </div>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Gold Standard 100% Whey
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 mb-3 leading-relaxed">
                24g Pure Whey Protein • 5.5g BCAAs • Extreme Purity & Fast Muscle Synthesis.
              </p>
              <button
                onClick={handleSkipToStore}
                className="w-full py-2.5 px-3 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-black text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(204,255,0,0.45)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore In Store</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Scroll Cue (Fades out once user begins scrolling) */}
        <AnimatePresence>
          {scrollProgress < 0.015 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none text-center"
            >
              <span className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-slate-300 font-medium mb-2.5">
                Scroll to Enter Store
              </span>
              <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center p-1 bg-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1 h-1.5 bg-[#ccff00] rounded-full shadow-[0_0_8px_#ccff00]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Vignette Gradient — deep black shadow keeps the video cinematic */}
        <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}


