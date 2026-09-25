import React from 'react';
import SmoothScrollSequence from './components/SmoothScrollSequence';
import CreativeNavbar from './components/CreativeNavbar';
import Banner from './components/Banner';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-[#ccff00] selection:text-black font-['Outfit']">
      {/* Intro sequence covering the screen first */}
      <SmoothScrollSequence />

      {/* Black → White transition bridge — sits right after the dark scroll canvas */}
      <div className="w-full h-40 bg-gradient-to-b from-black via-neutral-900/60 to-white pointer-events-none -mt-1" />

      {/* Original Website Content */}
      <CreativeNavbar />
      <main className="bg-white">
        <Banner />
      </main>
    </div>
  );
}
