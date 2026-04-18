'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Heart, ArrowDown } from 'lucide-react';
import type { InvitationConfig } from '../../lib/types';
import { format } from 'date-fns';
import { transformGDriveLink } from '../../lib/utils';

export default function ModernMinimal({ config }: { config: InvitationConfig }) {
  const defaultHero = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  const defaultNews = 'https://images.unsplash.com/photo-1465495910483-0d6083049b10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-200 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center bg-white px-6">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1.5 }}
           className="absolute inset-0 z-0"
        >
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-[20000ms] hover:scale-105"
            style={{ backgroundImage: `url('${transformGDriveLink(config.heroImageUrl || defaultHero)}')`, opacity: 0.15 }}
          />
        </motion.div>

        <div className="relative z-10 text-center space-y-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <p className="text-gray-500 tracking-[0.5em] uppercase text-xs mb-8">Saving the date for</p>
            <h1 className="text-5xl md:text-8xl font-light tracking-tighter mb-4 flex flex-col md:flex-row items-center justify-center gap-4">
              <span>{config.primaryName}</span>
              <span className="text-gray-400 italic font-serif text-3xl md:text-6xl">&</span>
              <span>{config.secondaryName}</span>
            </h1>
            <div className="h-px w-32 bg-black mx-auto my-12 opacity-20" />
            <p className="text-xl md:text-2xl font-light text-gray-700 uppercase tracking-widest">
              {config.date ? format(new Date(config.date), "dd . MM . yyyy") : '2026'}
            </p>
            <p className="text-sm text-gray-400 mt-4 tracking-widest uppercase">{config.location || 'The Modern Gallery'}</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12"
        >
          <ArrowDown className="w-5 h-5 text-gray-300 animate-bounce" />
        </motion.div>
      </section>

      {/* Message Section */}
      <section className="py-32 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm tracking-[0.4em] uppercase text-gray-400 mb-12">The Union</h2>
            <p className="text-3xl md:text-5xl font-serif italic text-gray-800 leading-tight">
              "{config.message || 'We invite you to share in our joy and witness the beginning of our new chapter together. Minimalist in form, maximalist in love.'}"
            </p>
          </motion.div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-32 px-6 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-24">
          <div className="space-y-16">
             <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
             >
                <div className="flex items-center space-x-4 mb-4">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-xs tracking-[0.3em] uppercase text-gray-400">Schedule</span>
                </div>
                <h3 className="text-4xl font-light mb-4">The Celebration</h3>
                <p className="text-gray-600 text-lg">{config.date ? format(new Date(config.date), "EEEE, MMMM do") : 'TBD'}</p>
                <p className="text-gray-600 text-lg">Doors open at {config.date ? format(new Date(config.date), "h:mm a") : 'TBD'}</p>
             </motion.div>

             <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               viewport={{ once: true }}
             >
                <div className="flex items-center space-x-4 mb-4">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-xs tracking-[0.3em] uppercase text-gray-400">Location</span>
                </div>
                <h3 className="text-4xl font-light mb-4">The Venue</h3>
                <p className="text-gray-600 text-lg font-medium">{config.location || 'The Modern Gallery'}</p>
                <p className="text-gray-500">{config.venue || '123 Minimalist Way, Suite 101'}</p>
             </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative flex justify-center items-center"
          >
            {config.imageUrl ? (
              <div 
                className="w-full h-full flex justify-center items-center bg-gray-50 overflow-hidden"
                style={{ 
                    padding: `${config.imageStyle?.paddingY || 0}px ${config.imageStyle?.paddingX || 0}px`
                }}
              >
                <img 
                    src={transformGDriveLink(config.imageUrl)} 
                    alt="Modern Wedding" 
                    className="max-w-full max-h-full w-auto h-auto object-contain shadow-2xl transition-all duration-700 grayscale hover:grayscale-0 mx-auto"
                    style={{ 
                        border: config.imageStyle?.showBorder ? `1px solid ${config.imageStyle.borderColor}` : 'none'
                    }}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1200?text=Minimal+Invitation'; }}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 font-light italic">
                A Moment Frozen in Time
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-light tracking-tighter">Our Journey</h2>
            <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">A simple timeline</p>
          </div>

          <div className="space-y-24">
            {(config.news || []).map((news, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16"
              >
                <div className="md:w-1/4">
                   <span className="text-2xl font-serif italic text-gray-300">{news.date}</span>
                </div>
                <div className="md:w-3/4 pb-8 border-b border-gray-100">
                  <h3 className="text-2xl font-light mb-3">{news.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-light">{news.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Large Image Break */}
      <section className="h-[60vh] w-full relative overflow-hidden grayscale">
         <img 
            src={transformGDriveLink(config.newsImageUrl || defaultNews)} 
            alt="News Image" 
            className="w-full h-full object-cover"
         />
      </section>

      {/* Footer */}
      <footer className="py-32 bg-white text-center">
        <div className="flex flex-col items-center space-y-8">
           <Heart className="w-6 h-6 text-gray-200" />
           <p className="text-4xl font-light tracking-tighter">
             {config.primaryName} <span className="text-gray-300">&</span> {config.secondaryName}
           </p>
           <p className="text-xs text-gray-400 tracking-[0.4em] uppercase">Est. {config.date ? format(new Date(config.date), "yyyy") : '2026'}</p>
           <div className="mt-12 text-[10px] text-gray-400 flex flex-col space-y-2 opacity-50">
             <p>Made with love for our dear family and friends.</p>
             <p className="tracking-[0.1em] uppercase">for business enquiries and custom websites: tytonyxindia@gmail.com</p>
           </div>
        </div>
      </footer>
    </div>
  );
}
