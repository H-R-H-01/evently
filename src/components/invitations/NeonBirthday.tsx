'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Music, Zap, User } from 'lucide-react';
import type { InvitationConfig } from '../../lib/types';
import { format } from 'date-fns';
import { transformGDriveLink } from '../../lib/utils';

export default function NeonBirthday({ config }: { config: InvitationConfig }) {
  const defaultHero = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  
  return (
    <div className="min-h-screen bg-[#050510] text-[#f8fafc] font-sans selection:bg-[#ff00ff]/30 overflow-x-hidden">
      {/* Dynamic Glow Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-[#ff00ff]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] bg-[#00ffff]/10 blur-[100px] rounded-full animate-pulse [animation-delay:1s]" />
      </div>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center p-6 bg-transparent overflow-hidden">
        <motion.div
           initial={{ opacity: 0, scale: 1.1 }}
           animate={{ opacity: 0.4, scale: 1 }}
           transition={{ duration: 2 }}
           className="absolute inset-0 z-0"
        >
          <img 
            src={transformGDriveLink(config.heroImageUrl || defaultHero)} 
            className="w-full h-full object-cover"
            alt="Club Background"
          />
        </motion.div>

        <div className="relative z-10 text-center space-y-12 max-w-5xl">
          <motion.div
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ type: "spring", stiffness: 100, damping: 15 }}
             className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#ff00ff]/50 bg-[#ff00ff]/10 backdrop-blur-md text-[#ff00ff] text-sm uppercase font-black tracking-widest"
          >
             <Zap className="w-4 h-4 fill-current" />
             Level Up
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic mb-4 px-4 break-words">
               {config.primaryName}<span className="text-[#ff00ff]">'</span>S <br className="hidden md:block"/>
               <span className="text-transparent border-b-8 border-white pb-2 block md:inline-block mt-4 md:mt-0" style={{ WebkitTextStroke: '2px white' }}>Bash</span>
            </h1>
            
            <div className="flex flex-wrap justify-center gap-12 mt-16 text-xl tracking-[0.4em] font-light">
                <span className="text-white">{config.date ? format(new Date(config.date), "dd . MM") : '2026'}</span>
                <span className="text-white/20">/</span>
                <span className="text-[#00ffff]">{config.location || 'THE CLUBROOM'}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Message and Vibe */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl md:text-6xl font-black uppercase mb-16 leading-none tracking-tighter">
                "{config.message || 'Prepare for a night of pure energy and neon lights. We are taking the celebration to the max.'}"
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                  <div className="group relative p-12 bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-[#ff00ff]/50 transition-colors">
                     <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-[#ff00ff]/10 transition-colors">
                        <Music className="w-32 h-32" />
                     </div>
                     <h3 className="text-[#ff00ff] text-xs font-black tracking-widest uppercase mb-4">The Schedule</h3>
                     <p className="text-3xl font-bold mb-2">{config.date ? format(new Date(config.date), "EEEE, MMMM do") : 'TBD'}</p>
                     <p className="text-white/40 uppercase tracking-widest text-sm">Doors open at {config.date ? format(new Date(config.date), "h:mm p") : 'TBD'}</p>
                  </div>

                  <div className="group relative p-12 bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-[#00ffff]/50 transition-colors">
                     <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-[#00ffff]/10 transition-colors">
                        <MapPin className="w-32 h-32" />
                     </div>
                     <h3 className="text-[#00ffff] text-xs font-black tracking-widest uppercase mb-4">The Venue</h3>
                     <p className="text-3xl font-bold mb-2">{config.location || 'THE CLUBROOM'}</p>
                     <p className="text-white/40 uppercase tracking-widest text-sm">{config.venue || 'VIP Entrance, Central District'}</p>
                  </div>
              </div>
            </motion.div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
             <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 1 }}
               viewport={{ once: true }}
               className="relative group h-[700px] rounded-[3rem] overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-t from-[#ff00ff]/40 to-transparent z-10 mix-blend-overlay" />
                {config.imageUrl ? (
                    <img 
                        src={transformGDriveLink(config.imageUrl)} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                        alt="Birthday Star"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1200?text=Neon+Birthday'; }}
                    />
                ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <User className="w-20 h-20 text-white/10" />
                    </div>
                )}
             </motion.div>

             <div className="space-y-16">
                 <div>
                    <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter">Event <br/> <span className="text-[#00ffff]">Flow</span></h2>
                 </div>

                 <div className="space-y-12">
                     {(config.news || []).map((news, idx) => (
                         <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group flex gap-8 items-center border-b border-white/5 pb-8 hover:border-[#ff00ff]/30 transition-colors"
                         >
                            <span className="text-5xl font-black text-white/10 group-hover:text-[#ff00ff]/20 transition-colors">0{idx + 1}</span>
                            <div>
                                <h4 className="text-2xl font-bold uppercase tracking-wide group-hover:text-[#ff00ff] transition-colors">{news.title}</h4>
                                <p className="text-white/40 mt-2 font-medium tracking-wide uppercase text-xs">{news.description}</p>
                                <span className="text-[#00ffff] block mt-2 font-mono text-sm tracking-widest">{news.date}</span>
                            </div>
                         </motion.div>
                     ))}
                 </div>
             </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-40 bg-black text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-[20vw] font-black text-white/[0.02] whitespace-nowrap select-none italic tracking-tighter">
            {config.primaryName} • {config.primaryName} • {config.primaryName}
        </div>
        <div className="relative z-10 flex flex-col items-center gap-12">
            <div className="w-16 h-16 rounded-3xl bg-[#ff00ff]/20 flex items-center justify-center text-[#ff00ff]">
                <Zap className="w-8 h-8 fill-current" />
            </div>
            <p className="text-7xl font-black italic uppercase tracking-tighter">The Night is Young</p>
            <p className="text-[#00ffff] tracking-[1em] uppercase text-xs">Est. {config.date ? format(new Date(config.date), "yyyy") : '2026'}</p>
            <div className="mt-12 text-[10px] text-white/40 flex flex-col space-y-2 uppercase tracking-[0.1em]">
               <p>Made with love for our dear family and friends.</p>
               <p className="text-[#00ffff]/60">for business enquiries and custom websites: tytonyxindia@gmail.com</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
