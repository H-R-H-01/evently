'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Heart, Cake, Gift } from 'lucide-react';
import type { InvitationConfig } from '../../lib/types';
import { format } from 'date-fns';
import { transformGDriveLink } from '../../lib/utils';

export default function RoyalBirthday({ config }: { config: InvitationConfig }) {
  const defaultHero = 'https://images.unsplash.com/photo-1530103862676-fa8c9d34b68e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  const defaultNews = 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center [clip-path:inset(0_0_0_0)]">
        <div className="fixed inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] scale-105"
            style={{ backgroundImage: `url('${transformGDriveLink(config.heroImageUrl || defaultHero)}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#f8fafc]" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
               <Cake className="w-10 h-10 text-yellow-400" />
            </div>
            <p className="tracking-[0.4em] uppercase text-sm mb-6 drop-shadow-sm font-bold">A Grand Celebration of</p>
            <h1 className="font-playfair text-6xl md:text-9xl mb-8 leading-tight drop-shadow-lg text-white">
              {config.primaryName}
            </h1>
            <div className="w-24 h-px bg-yellow-400 mx-auto mb-8" />
            <p className="font-playfair italic text-2xl md:text-3xl tracking-wide drop-shadow-md">
              Turning another year of magic
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Announcement */}
      <section className="py-32 px-6 relative bg-white">
        <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-[#3b82f6] font-bold tracking-[0.3em] uppercase text-xs mb-8">The Invitation</h2>
              <p className="text-3xl md:text-5xl font-playfair italic text-[#1e293b] leading-tight mb-12">
                "{config.message || 'One more year older, one more year of adventures. I invite you to my grand birthday bash where we celebrate life, laughter, and lifelong friendships.'}"
              </p>
              
              <div className="grid md:grid-cols-2 gap-12 mt-20 text-left">
                  <div className="p-8 bg-gray-50 border border-gray-100 rounded-2xl">
                     <Calendar className="w-8 h-8 text-yellow-500 mb-6" />
                     <h3 className="text-2xl font-bold mb-2">Save the Date</h3>
                     <p className="text-gray-600 italic">{config.date ? format(new Date(config.date), "EEEE, MMMM do, yyyy") : 'TBD'}</p>
                     <p className="text-gray-400 text-sm mt-2">Festivities begin at {config.date ? format(new Date(config.date), "h:mm p") : 'TBD'}</p>
                  </div>
                  <div className="p-8 bg-gray-50 border border-gray-100 rounded-2xl">
                     <MapPin className="w-8 h-8 text-red-500 mb-6" />
                     <h3 className="text-2xl font-bold mb-2">Location</h3>
                     <p className="text-gray-600 font-medium">{config.location || 'The Grand Terrace'}</p>
                     <p className="text-gray-400 text-sm mt-2">{config.venue || '789 Celebration Plaza, Downtown'}</p>
                  </div>
              </div>
            </motion.div>
        </div>
      </section>

      {/* Portrait Section */}
      <section className="py-24 px-6 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="relative aspect-[3/4] group"
             >
                <div className="absolute -inset-4 border-2 border-dashed border-gray-200 rounded-3xl group-hover:rotate-3 transition-transform duration-1000" />
                {config.imageUrl ? (
                    <img 
                        src={transformGDriveLink(config.imageUrl)} 
                        alt="The Birthday Star" 
                        className="w-full h-full object-cover rounded-2xl shadow-2xl relative z-10"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1200?text=Birthday+Photo'; }}
                    />
                ) : (
                    <div className="w-full h-full bg-white flex items-center justify-center rounded-2xl shadow-inner relative z-10">
                        <Gift className="w-20 h-20 text-gray-100" />
                    </div>
                )}
             </motion.div>

             <div className="space-y-12">
                 <div className="text-center lg:text-left">
                    <h2 className="text-4xl md:text-6xl font-playfair mb-6">Birthday Milestones</h2>
                    <p className="text-gray-400 tracking-widest uppercase text-xs">A trip down memory lane</p>
                 </div>
                 
                 <div className="space-y-8">
                    {(config.news || []).map((news, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-6 items-start"
                        >
                            <div className="w-12 h-12 shrink-0 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
                                {idx + 1}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-1">{news.title}</h4>
                                <p className="text-gray-500 leading-relaxed">{news.description}</p>
                                <span className="text-xs text-gray-400 italic mt-2 block">{news.date}</span>
                            </div>
                        </motion.div>
                    ))}
                 </div>
             </div>
        </div>
      </section>

      {/* News Carousel / Grid Break */}
      {(config.newsImageUrl || defaultNews) && (
          <section className="h-[50vh] relative overflow-hidden">
            <img 
                src={transformGDriveLink(config.newsImageUrl || defaultNews)} 
                className="w-full h-full object-cover"
                alt="Celebration"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <p className="text-white text-3xl font-playfair italic">Let's make some noise!</p>
            </div>
          </section>
      )}

      {/* Footer */}
      <footer className="py-24 bg-white text-center">
        <Heart className="w-8 h-8 text-red-500 mx-auto mb-8 animate-pulse" />
        <h2 className="text-4xl font-playfair mb-2">{config.primaryName}</h2>
        <p className="text-gray-400 lowercase tracking-[0.2em] mb-12">Party of the year</p>
        <p className="text-xs text-gray-300 uppercase tracking-widest">Est. {config.date ? format(new Date(config.date), "yyyy") : '2026'}</p>
      </footer>
    </div>
  );
}
