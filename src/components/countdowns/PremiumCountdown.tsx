'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowDown, User } from 'lucide-react';
import type { EventConfig } from '../../lib/types';
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { transformGDriveLink } from '../../lib/utils';
import { useEffect, useState } from 'react';
import { TemplateFooter } from '../TemplateFooter';

export default function PremiumCountdown({ config }: { config: EventConfig }) {
  const targetDate = new Date(config.eventDate);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const totalSeconds = differenceInSeconds(targetDate, now);
  const isPast = totalSeconds <= 0;

  const days = isPast ? 0 : differenceInDays(targetDate, now);
  const hours = isPast ? 0 : differenceInHours(targetDate, now) % 24;
  const minutes = isPast ? 0 : differenceInMinutes(targetDate, now) % 60;
  const seconds = isPast ? 0 : totalSeconds % 60;

  const defaultHero = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="min-h-screen bg-[#0a0b10] text-[#f8fafc] font-sans overflow-x-hidden selection:bg-yellow-400/30">
      {/* Hero with Fixed Background */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center [clip-path:inset(0_0_0_0)]">
         <div className="fixed inset-0 z-0">
            <div 
               className="w-full h-full bg-cover bg-center transition-transform duration-[10000ms] scale-105"
               style={{ backgroundImage: `url('${transformGDriveLink(config.heroImageUrl || defaultHero)}')` }}
            />
            <div className="absolute inset-0 bg-black/60 shadow-inner" />
         </div>

         <div className="relative z-10 text-center space-y-8 max-w-5xl px-6">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1 }}
            >
               <h3 className="text-yellow-400 uppercase tracking-[0.5em] text-xs font-bold mb-4 drop-shadow-sm">The Journey Begins In</h3>
               <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12 drop-shadow-2xl">
                  {config.eventName}
               </h1>

               {/* Large Countdown Grids */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
                  <TimeUnit value={days} label="Days" />
                  <TimeUnit value={hours} label="Hours" />
                  <TimeUnit value={minutes} label="Minutes" />
                  <TimeUnit value={seconds} label="Seconds" />
               </div>
            </motion.div>
         </div>

         <motion.div 
           animate={{ y: [0, 10, 0] }}
           transition={{ repeat: Infinity, duration: 2 }}
           className="absolute bottom-12 z-10"
         >
           <ArrowDown className="text-yellow-400 w-6 h-6" />
         </motion.div>
      </section>

      {/* Details Section */}
      <section className="py-32 px-6 bg-[#0a0b10] relative z-20">
         <div className="max-w-4xl mx-auto text-center space-y-16">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
            >
               <h2 className="text-sm tracking-[0.4em] uppercase text-gray-500 mb-8 border-b border-white/10 pb-4">Event Proclamation</h2>
               <p className="text-4xl md:text-6xl font-light italic leading-tight text-white">
                  "{config.message || 'We are counting down to a moment that will change everything. A celebration of a legacy, a milestone of a lifetime.'}"
               </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 text-left">
               <div className="p-10 bg-white/5 border border-white/10 rounded-3xl hover:border-yellow-400/50 transition-colors">
                  <Calendar className="w-8 h-8 text-yellow-400 mb-6" />
                  <h4 className="text-2xl font-bold mb-2">Save the Date</h4>
                  <p className="text-gray-400">{config.eventDate ? format(new Date(config.eventDate), "EEEE, MMMM do, yyyy") : 'TBD'}</p>
                  <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">{config.timezone}</p>
               </div>
               <div className="p-10 bg-white/5 border border-white/10 rounded-3xl hover:border-yellow-400/50 transition-colors">
                  <MapPin className="w-8 h-8 text-red-400 mb-6" />
                  <h4 className="text-2xl font-bold mb-2">The Gathering</h4>
                  <p className="text-gray-400">{config.location || 'The Grand Estates'}</p>
                  <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">{config.venue || '123 Momentum Drive'}</p>
               </div>
            </div>
         </div>
      </section>

      {/* Info Cards / News */}
      {config.news && config.news.length > 0 && (
         <section className="py-32 px-6 bg-[#05050a] border-t border-white/5">
            <div className="max-w-6xl mx-auto">
               <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                  <div>
                     <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Event <span className="text-yellow-400">Chapters</span></h2>
                     <p className="text-gray-500 mt-4 tracking-widest uppercase text-sm">Follow the sequence of moments</p>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {config.news.map((item, idx) => (
                     <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/[0.03] border border-white/10 p-10 rounded-3xl hover:translate-y-[-10px] transition-transform"
                     >
                        <span className="text-yellow-400 font-mono text-sm tracking-widest block mb-4 italic">{item.date}</span>
                        <h4 className="text-2xl font-bold mb-4 uppercase tracking-tight">{item.title}</h4>
                        <p className="text-gray-500 leading-relaxed font-light">{item.description}</p>
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>
      )}

      {/* Final Countdown Banner */}
      <section className="py-40 px-6 text-center bg-yellow-400 text-black overflow-hidden relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-black/5 whitespace-nowrap select-none">
            {config.eventName}
         </div>
         <div className="relative z-10 flex flex-col items-center gap-8">
            <User className="w-12 h-12" />
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Hosted by {config.userInfo.name}</h2>
            <div className="w-20 h-px bg-black" />
            <p className="text-xs tracking-[0.4em] font-black uppercase italic">Legacy in Progress</p>
         </div>
         <div className="relative z-10 mt-20 text-[10px] text-black/40 flex flex-col items-center space-y-2 uppercase tracking-[0.2em]">
            <p>Made with love for our dear family and friends.</p>
            <p className="font-bold">for business enquiries and custom websites: tytonyxindia@gmail.com</p>
         </div>
      </section>

      <TemplateFooter 
        type="countdown" 
        themeId={config.style?.theme} 
        themeLabel={config.style?.theme ? {
          royal_gold: 'Royal Gold',
          midnight_silver: 'Midnight Silver',
          rose_elegance: 'Rose Elegance',
          ocean_depth: 'Ocean Depth',
          neon_cyber: 'Neon Cyber',
          emerald_forest: 'Emerald Forest'
        }[config.style.theme] : 'Premium Story'} 
      />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number, label: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center group hover:border-yellow-400/30 transition-colors shadow-2xl">
      <AnimatePresence mode="popLayout">
         <motion.span 
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-4xl md:text-7xl font-black tracking-tighter tabular-nums"
         >
            {value.toString().padStart(2, '0')}
         </motion.span>
      </AnimatePresence>
      <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mt-4">{label}</span>
    </div>
  );
}
