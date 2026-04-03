'use client';

import { Sparkles, HourglassIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeTiles({ onSelect }: { onSelect: (b: 'countdown' | 'invitation') => void }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#05050a] p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[80%] right-[0%] w-[40%] h-[40%] bg-[#4db8ff]/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 z-10"
      >
        <p className="tracking-[0.3em] uppercase text-[#94a3b8] text-sm mb-4 font-inter">Welcome to Evently</p>
        <h1 className="text-5xl sm:text-7xl font-playfair text-[#f8fafc] tracking-wide mb-6">
          Forge Your <span className="text-[#d4af37]">Moments</span>
        </h1>
        <p className="text-[#94a3b8] max-w-xl mx-auto font-light leading-relaxed">
          Create breathtaking, enterprise-grade experiences for your most important events. Choose your builder below.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl z-10">
        
        {/* Countdown Builder Tile */}
        <motion.button
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('countdown')}
          className="group relative h-80 flex flex-col items-center justify-center p-8 bg-[#0a0b10] border border-[#1a1d2e] hover:border-[#d4af37]/50 rounded-2xl overflow-hidden transition-all shadow-xl hover:shadow-[0_20px_40px_rgba(212,175,55,0.1)] text-left w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 rounded-full bg-[#13151f] border border-[#1a1d2e] flex items-center justify-center mb-8 group-hover:border-[#d4af37]/50 group-hover:bg-[#d4af37]/10 transition-colors">
            <HourglassIcon className="w-8 h-8 text-[#94a3b8] group-hover:text-[#ffd700] transition-colors" />
          </div>
          <h2 className="text-3xl font-playfair text-[#f8fafc] mb-3 group-hover:text-[#ffd700] transition-colors">
            Countdown Builder
          </h2>
          <p className="text-[#64748b] font-light text-center px-4">
            A majestic live clock experience. Perfect for building suspense leading up to your grand occasion.
          </p>
        </motion.button>

        {/* Invitation Builder Tile */}
        <motion.button
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('invitation')}
          className="group relative h-80 flex flex-col items-center justify-center p-8 bg-[#0a0b10] border border-[#1a1d2e] hover:border-[#4db8ff]/50 rounded-2xl overflow-hidden transition-all shadow-xl hover:shadow-[0_20px_40px_rgba(77,184,255,0.1)] text-left w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#4db8ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 rounded-full bg-[#13151f] border border-[#1a1d2e] flex items-center justify-center mb-8 group-hover:border-[#4db8ff]/50 group-hover:bg-[#4db8ff]/10 transition-colors">
            <Sparkles className="w-8 h-8 text-[#94a3b8] group-hover:text-[#4db8ff] transition-colors" />
          </div>
          <h2 className="text-3xl font-playfair text-[#f8fafc] mb-3 group-hover:text-[#4db8ff] transition-colors">
            StoryScroll Invitations
          </h2>
          <p className="text-[#64748b] font-light text-center px-4">
            An absolutely stunning parallax journey. Embed your images and 3D effects into an immersive vertical scroll.
          </p>
        </motion.button>

      </div>
    </div>
  );
}
