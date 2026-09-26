import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Sparkles, ShieldCheck } from 'lucide-react';

/* =========================================================================
   BUILDIFF MASTER CINEMATIC TIMELINE (EP1 + EP2 + EP3)
   =========================================================================
   - 707 Lightweight High-Resolution WebP Frames
   - Guaranteed Frame Painting & Responsive 60/120fps LERP Tracking
   ========================================================================= */

const SEQUENCE_CONFIG = {
  totalFrames: 707,
  containerHeight: '600vh', // Responsive luxurious scroll runway
  lerpFactor: 0.25,         // Fast, instantaneous, zero-drag tracking
  canvasWidth: 1920,
  canvasHeight: 1080,

  stages: [
    {
      progress: 0.000,
      frame: 1,
      episode: 'EPISODE 01',
      title: 'FLAGSHIP STOREFRONT',
      subtitle: 'Buildiff Nutrition Headquarters',
    },
    {
      progress: 0.040,
      frame: 68,
      episode: 'EPISODE 01',
      title: 'THE THRESHOLD',
      subtitle: 'Entering The Experience',
    },
    {
      progress: 0.400,
      frame: 300,
      episode: 'EPISODE 01',
      title: 'PERFORMANCE VAULT',
      subtitle: 'Exploring Supplement Aisles',
    },
    {
      progress: 0.740,
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

function getFrameUrl(globalFrame) {
  const g = Math.max(1, Math.min(SEQUENCE_CONFIG.totalFrames, Math.round(globalFrame)));
  if (g <= 300) {
    const local = g;
    return `/ep1 buildiff/ezgif-frame-${local.toString().padStart(3, '0')}.webp`;
  } else if (g <= 600) {
    const local = g - 300;
    return `/ep2 buildiff/ezgif-frame-${local.toString().padStart(3, '0')}.webp`;
  } else {
    const local = g - 600;
    return `/ep3 buildiff/ezgif-frame-${local.toString().padStart(3, '0')}.webp`;
  }
}

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
  const progressBarRef = useRef(null);
  const frameTextRef = useRef(null);
  const epTextRef = useRef(null);
  const requestRef = useRef(null);
  const isLoopRunningRef = useRef(false);
  const isVisibleRef = useRef(true);

  // Animation interpolation state
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const lastDrawnExactFrameRef = useRef(-1);

  // UI state
  const [activeStage, setActiveStage] = useState(SEQUENCE_CONFIG.stages[0]);
  const [showProductTag, setShowProductTag] = useState(false);
  const [showScrollPrompt, setShowScrollPrompt] = useState(true);
  const [currentEpNumber, setCurrentEpNumber] = useState(1);

  // Image cache
  const imagesRef = useRef(new Map());

  // -------------------------------------------------------------
  // 1. FAST ASYNC WEBP PRELOADER
  // -------------------------------------------------------------
  const loadImage = useCallback((frameIdx) => {
    if (frameIdx < 1 || frameIdx > SEQUENCE_CONFIG.totalFrames) return null;
    
    if (imagesRef.current.has(frameIdx)) {
      return imagesRef.current.get(frameIdx);
    }

    const img = new Image();
    img.decoding = 'async';
    img.src = getFrameUrl(frameIdx);
    imagesRef.current.set(frameIdx, img);
    
    img.onload = () => {
      // If canvas needs this frame, wake the loop to render it
      const currentTarget = Math.round(currentFrameRef.current);
      if (Math.abs(currentTarget - frameIdx) <= 2) {
        startRenderLoop();
      }
    };

    return img;
  }, []);

  // Preload frames around a specific frame position
  const prefetchWindow = useCallback((centerFrame) => {
    const start = Math.max(1, centerFrame - 30);
    const end = Math.min(SEQUENCE_CONFIG.totalFrames, centerFrame + 60);
    for (let i = start; i <= end; i++) {
      loadImage(i);
    }
  }, [loadImage]);

  // Eager preloader: streams all 707 frames into memory
  useEffect(() => {
    // 1. Load first 80 frames immediately
    for (let i = 1; i <= 80; i++) {
      loadImage(i);
    }

    // 2. High-speed progressive preloader in background
    let nextIdx = 81;
    let timerId;

    const loadNextBatch = () => {
      const batchSize = 16;
      for (let i = 0; i < batchSize && nextIdx <= SEQUENCE_CONFIG.totalFrames; i++) {
        loadImage(nextIdx++);
      }
      if (nextIdx <= SEQUENCE_CONFIG.totalFrames) {
        timerId = setTimeout(loadNextBatch, 16);
      }
    };

    timerId = setTimeout(loadNextBatch, 80);

    return () => clearTimeout(timerId);
  }, [loadImage]);

  // -------------------------------------------------------------
  // 2. 60/120 FPS GUARANTEED CANVAS RENDER LOOP
  // -------------------------------------------------------------
  const renderFrameToCanvas = useCallback((context, canvas, targetIdx) => {
    // 1. Try exact requested frame
    let img = imagesRef.current.get(targetIdx);
    if (!img) {
      img = loadImage(targetIdx);
    }

    if (img && img.complete && img.naturalWidth > 0) {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      lastDrawnExactFrameRef.current = targetIdx;
      return true;
    }

    // 2. Nearest loaded fallback (scan outwards up to 60 frames)
    for (let offset = 1; offset <= 60; offset++) {
      const lower = imagesRef.current.get(targetIdx - offset);
      if (lower && lower.complete && lower.naturalWidth > 0) {
        context.drawImage(lower, 0, 0, canvas.width, canvas.height);
        return false; // Rendered fallback, exact frame not yet drawn
      }
      const higher = imagesRef.current.get(targetIdx + offset);
      if (higher && higher.complete && higher.naturalWidth > 0) {
        context.drawImage(higher, 0, 0, canvas.width, canvas.height);
        return false;
      }
    }

    return false;
  }, [loadImage]);

  const startRenderLoop = useCallback(() => {
    if (isLoopRunningRef.current || !isVisibleRef.current) return;
    isLoopRunningRef.current = true;

    let lastHudUpdate = 0;

    const tick = () => {
      const canvas = canvasRef.current;
      if (!canvas || !isVisibleRef.current) {
        isLoopRunningRef.current = false;
        return;
      }

      const context = canvas.getContext('2d', { alpha: false });
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      // Ultra-smooth responsive LERP
      if (Math.abs(diff) > 0.005) {
        currentFrameRef.current += diff * SEQUENCE_CONFIG.lerpFactor;
      } else {
        currentFrameRef.current = target;
      }

      const frameToDraw = Math.max(1, Math.min(SEQUENCE_CONFIG.totalFrames, Math.round(currentFrameRef.current)));

      // Render frame
      renderFrameToCanvas(context, canvas, frameToDraw);

      // Direct DOM update for frame counter
      if (frameTextRef.current) {
        frameTextRef.current.textContent = `FRAME ${frameToDraw.toString().padStart(3, '0')}/707`;
      }

      // Throttled UI stage updates
      const now = performance.now();
      if (now - lastHudUpdate > 50) {
        const ep = frameToDraw <= 300 ? 1 : frameToDraw <= 600 ? 2 : 3;
        setCurrentEpNumber(ep);
        if (epTextRef.current) {
          epTextRef.current.textContent = `EP 0${ep}`;
        }

        setActiveStage(getActiveStageInfo(frameToDraw, SEQUENCE_CONFIG.stages));
        setShowProductTag(frameToDraw >= 620 && frameToDraw <= 707);
        lastHudUpdate = now;
      }

      // Loop continues if target not reached OR if exact frame hasn't been painted yet
      const isSettled = Math.abs(target - currentFrameRef.current) < 0.01 && frameToDraw === lastDrawnExactFrameRef.current;

      if (!isSettled && isVisibleRef.current) {
        requestRef.current = requestAnimationFrame(tick);
      } else {
        isLoopRunningRef.current = false;
      }
    };

    requestRef.current = requestAnimationFrame(tick);
  }, [renderFrameToCanvas]);

  // Setup Canvas & Initial Frame 1
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = SEQUENCE_CONFIG.canvasWidth;
    canvas.height = SEQUENCE_CONFIG.canvasHeight;
    const context = canvas.getContext('2d', { alpha: false });

    const img1 = loadImage(1);
    if (img1) {
      if (img1.complete && img1.naturalWidth > 0) {
        context.drawImage(img1, 0, 0, canvas.width, canvas.height);
        lastDrawnExactFrameRef.current = 1;
      } else {
        img1.onload = () => {
          context.drawImage(img1, 0, 0, canvas.width, canvas.height);
          lastDrawnExactFrameRef.current = 1;
        };
      }
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loadImage]);

  // -------------------------------------------------------------
  // 3. INTERSECTION OBSERVER
  // -------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            startRenderLoop();
          } else {
            if (requestRef.current) {
              cancelAnimationFrame(requestRef.current);
              isLoopRunningRef.current = false;
            }
          }
        });
      },
      { rootMargin: '300px 0px 300px 0px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [startRenderLoop]);

  // -------------------------------------------------------------
  // 4. SCROLL PROGRESSION LISTENER
  // -------------------------------------------------------------
  useEffect(() => {
    let lastPrefetchedCenter = 1;

    const handleScroll = () => {
      if (!containerRef.current || !isVisibleRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollDistance = -rect.top;
      const maxScroll = rect.height - window.innerHeight;

      if (maxScroll <= 0) return;

      const progress = Math.max(0, Math.min(1, scrollDistance / maxScroll));

      // Direct GPU Transform for master progress bar
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      if (progress > 0.015 && showScrollPrompt) {
        setShowScrollPrompt(false);
      } else if (progress <= 0.005 && !showScrollPrompt) {
        setShowScrollPrompt(true);
      }

      // Compute frame target
      const mappedFrame = calculateFrameForProgress(progress, SEQUENCE_CONFIG.stages);
      targetFrameRef.current = mappedFrame;

      // Prefetch upcoming frames
      const roundedTarget = Math.round(mappedFrame);
      if (Math.abs(roundedTarget - lastPrefetchedCenter) >= 3) {
        prefetchWindow(roundedTarget);
        lastPrefetchedCenter = roundedTarget;
      }

      // Wake render loop
      startRenderLoop();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefetchWindow, startRenderLoop, showScrollPrompt]);

  // Fast skip to store
  const handleSkipToStore = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const targetScrollY = window.scrollY + rect.bottom - window.innerHeight + 10;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black z-30"
      style={{ height: SEQUENCE_CONFIG.containerHeight }}
    >
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen flex justify-center items-center overflow-hidden bg-black select-none">

        {/* Ambient Radial Backlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_75%)] pointer-events-none" />

        {/* 1080p High-Precision Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none will-change-transform"
        />

        {/* Master Progress Bar (Hardware Accelerated ScaleX) */}
        <div className="absolute top-0 left-0 w-full h-[2.5px] bg-white/10 z-40">
          <div
            ref={progressBarRef}
            className="h-full w-full bg-gradient-to-r from-white via-[#ccff00] to-[#b8e600] origin-left shadow-[0_0_12px_rgba(204,255,0,0.9)] will-change-transform"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Top HUD: Current Episode & Frame Indicator */}
        <div className="absolute top-4 sm:top-5 left-3 sm:left-6 z-40 pointer-events-none flex flex-col items-start gap-1.5">
          {/* Episode Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-black/85 backdrop-blur-md text-[10px] sm:text-xs font-mono tracking-widest text-slate-200 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse shadow-[0_0_8px_#ccff00]" />
            <span ref={epTextRef}>EP 0{currentEpNumber}</span>
            <span className="text-white/30">•</span>
            <span ref={frameTextRef} className="text-slate-400">FRAME 001/707</span>
          </div>

          {/* Chapter Subtitle */}
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

        {/* Interactive Floating Product Tag in EPISODE 3 */}
        <AnimatePresence>
          {showProductTag && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.35 }}
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

        {/* Bottom Scroll Cue */}
        <AnimatePresence>
          {showScrollPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
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

        {/* Bottom Vignette Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
