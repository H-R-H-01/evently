'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, Heart, Sparkles, Star } from 'lucide-react';
import type { InvitationConfig } from '../lib/types';
import { format } from 'date-fns';
import { transformGDriveLink } from '../lib/utils';
import RoyalWedding from './invitations/RoyalWedding';

function StarElement({ progress, index }: { progress: any, index: number }) {
  // Fix "Rules of Hooks" by moving useTransform into a component that renders individually
  const y = useTransform(progress, [0, 1], [0, -Math.random() * 1000 - 500]);
  const x = `${Math.random() * 100}%`;
  const top = `${Math.random() * 100}%`;
  
  return (
    <motion.div
      style={{ y, x, top }}
      className="absolute opacity-40"
    >
      <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]" />
    </motion.div>
  );
}

export default function InvitationView({ config }: { config: InvitationConfig }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const isSimple = config.themeId === 'simple';
  const isRomantic = config.themeId === 'romantic_clouds';
  const isStarfall = config.themeId === 'golden_starfall';
  const isRoyal = config.themeId === 'royal_wedding';

  // Parallax transforms for fixed elements
  const y1 = useTransform(smoothProgress, [0, 1], [0, -500]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, -200]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [1, 1, 0, 0]);

  return (
    <div ref={containerRef} className={`relative min-h-screen overflow-x-hidden ${isSimple ? 'bg-white text-gray-900' : isRoyal ? 'bg-[#fdfcf6] text-[#2d2a26]' : 'bg-[#05050a] text-white'}`}>
      {isRoyal ? (
        <RoyalWedding config={config} />
      ) : isSimple ? (
        <div className="flex flex-col items-center p-8 md:p-20 relative">
          <div className="max-w-2xl w-full text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-playfair">{config.title || 'Invitation'}</h1>
            <div className="text-2xl md:text-4xl font-playfair font-bold">
              {config.primaryName}
              {config.secondaryName && ` & ${config.secondaryName}`}
            </div>
            <div className="flex items-center justify-center gap-2 text-xl italic outline-none">
              <Calendar className="w-6 h-6" />
              {config.date ? format(new Date(config.date), "PPPP p") : 'Date to be announced'}
            </div>
            {config.imageUrl ? (
              <div className="pt-10">
                <img 
                  src={transformGDriveLink(config.imageUrl)} 
                  alt="Invitation" 
                  className="w-full rounded-lg shadow-2xl"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1200?text=Your+Invitation'; }}
                />
              </div>
            ) : (
              <div className="pt-10 h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
                Paste image URL to preview
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Parallax Background Elements */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
            
            {isRomantic && (
              <>
                <motion.div style={{ y: y1 }} className="absolute top-20 left-[10%] opacity-20">
                  <Heart className="w-32 h-32 text-pink-500 fill-pink-500 blur-sm" />
                </motion.div>
                <motion.div style={{ y: y2 }} className="absolute top-[40%] right-[15%] opacity-10">
                  <Heart className="w-64 h-64 text-red-500 fill-red-500 blur-md" />
                </motion.div>
                <motion.div style={{ y: y1, rotate: 45 }} className="absolute bottom-[20%] left-[20%] opacity-15">
                  <Sparkles className="w-24 h-24 text-white blur-[2px]" />
                </motion.div>
              </>
            )}

            {isStarfall && (
              <>
                {[...Array(20)].map((_, i) => (
                  <StarElement key={i} index={i} progress={smoothProgress} />
                ))}
                <motion.div style={{ y: y2 }} className="absolute top-1/4 right-1/4 opacity-30">
                  <Star className="w-40 h-40 text-yellow-200 fill-yellow-200 blur-sm" />
                </motion.div>
              </>
            )}
          </div>

          {/* Intro Section */}
          <section className="relative h-screen flex flex-col items-center justify-center text-center p-6 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              style={{ opacity }}
            >
              <p className="tracking-[0.4em] uppercase text-sm mb-6 text-[#94a3b8]">A Grand Journey Awaits</p>
              <h1 className="text-5xl md:text-8xl font-playfair mb-8 leading-tight">
                {config.title}
              </h1>
            </motion.div>
          </section>

          {/* Transition Section */}
          <section className="relative h-screen flex flex-col items-center justify-center p-6 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="text-center"
            >
              <div className="text-3xl md:text-6xl font-playfair text-[#4db8ff] mb-4">Celebrating</div>
              <div className="text-6xl md:text-9xl font-playfair font-bold tracking-wider">
                {config.primaryName}
              </div>
              {config.secondaryName && (
                <>
                  <div className="text-3xl md:text-5xl font-playfair my-4 italic opacity-60">&</div>
                  <div className="text-6xl md:text-9xl font-playfair font-bold tracking-wider">
                    {config.secondaryName}
                  </div>
                </>
              )}
            </motion.div>
          </section>

          {/* Date Section */}
          <section className="relative h-screen flex flex-col items-center justify-center p-6 z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <Calendar className="w-16 h-16 text-[#4db8ff]" />
              <div className="text-4xl md:text-6xl font-playfair text-center">
                {format(new Date(config.date), "MMMM do, yyyy")}
              </div>
              <div className="text-2xl font-light opacity-70">
                at {format(new Date(config.date), "h:mm a")}
              </div>
            </motion.div>
          </section>

          {/* Final Invitation Section */}
          <section className="relative min-h-screen flex flex-col items-center justify-center p-6 md:p-20 z-10 bg-gradient-to-t from-black to-transparent">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, type: "spring", bounce: 0.3 }}
              className="max-w-4xl w-full"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-playfair tracking-[0.2em] uppercase mb-4">The Official Proclamation</h2>
                <div className="h-px w-20 mx-auto bg-[#4db8ff]" />
              </div>
              
              <div className="relative group">
                {config.imageStyle?.showBorder && (
                  <div 
                    className="absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"
                    style={{ backgroundColor: config.imageStyle.borderColor || '#4db8ff' }}
                   />
                )}
                {config.imageUrl ? (
                  <div 
                    className={`relative bg-[#0a0b10] rounded-xl overflow-hidden shadow-2xl flex justify-center`}
                    style={{ 
                      border: config.imageStyle?.showBorder ? `1px solid ${config.imageStyle.borderColor}33` : 'none',
                      padding: `${config.imageStyle?.paddingY || 0}px ${config.imageStyle?.paddingX || 0}px`
                    }}
                  >
                    <img 
                      src={transformGDriveLink(config.imageUrl)} 
                      alt="Final Invitation" 
                      className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1200?text=Invitation+Scroll'; }}
                    />
                  </div>
                ) : (
                  <div className="relative bg-[#0a0b10] border border-white/10 rounded-xl h-96 flex items-center justify-center text-[#94a3b8]">
                    Your invitation will appear here
                  </div>
                )}
              </div>

              <div className="mt-20 text-center text-sm tracking-widest opacity-40 uppercase pb-10">
                Journey crafted with Evently
              </div>
            </motion.div>
          </section>
        </>
      )}
    </div>
  );
}
