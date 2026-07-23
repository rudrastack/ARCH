import React from 'react';

/**
 * EditorialHeroSection Component
 * Left-side 50% section featuring full-height editorial photography with luxury typography overlays.
 */
export const EditorialHeroSection = () => {
  return (
    <div className="relative hidden md:flex md:w-1/2 bg-black flex-col justify-between overflow-hidden min-h-[640px]">
      {/* Background High-Fashion Editorial Image */}
      <img
        src="/assets/arks_editorial_hero.png"
        alt="ARKS High Fashion Editorial"
        className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125 opacity-90 transition-transform duration-1000 ease-out hover:scale-105"
      />

      {/* Dark Subtle Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 pointer-events-none" />

      {/* Top Header Branding Overlay */}
      <div className="relative z-10 p-8 lg:p-10 flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <span className="h-px w-8 bg-white/70" />
          <span className="text-white text-xs font-semibold tracking-[0.35em] uppercase font-sans-editorial">
            ARKS MONOCHROME
          </span>
        </div>
        <span className="text-[10px] text-neutral-300 tracking-[0.25em] uppercase border border-white/20 px-2.5 py-1 backdrop-blur-md">
          SS/26
        </span>
      </div>

      {/* Center Floating Editorial Quote / Badge */}
      <div className="relative z-10 p-8 lg:p-10 my-auto text-white space-y-3 max-w-md">
        <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-300 font-light">
          Editorial Access Only
        </p>
        <h2 className="text-3xl lg:text-4xl font-serif-editorial italic font-normal leading-tight tracking-wide text-white">
          "Elegance is not standing out, but being remembered."
        </h2>
      </div>

      {/* Bottom Editorial Caption Footer */}
      <div className="relative z-10 p-8 lg:p-10 flex justify-between items-end text-neutral-400 text-[10px] tracking-[0.2em] uppercase border-t border-white/10">
        <div>
          <span className="block text-white font-medium">Curated Collections</span>
          <span className="text-neutral-400">Paris &bull; Milan &bull; Tokyo</span>
        </div>
        <span className="font-mono text-white/50">01 &mdash; 02</span>
      </div>
    </div>
  );
};
