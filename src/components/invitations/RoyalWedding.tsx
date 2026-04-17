'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Heart, Clock } from 'lucide-react';
import type { InvitationConfig } from '../../lib/types';
import { format } from 'date-fns';
import { transformGDriveLink } from '../../lib/utils';

export default function RoyalWedding({ config }: { config: InvitationConfig }) {
  const defaultHero = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  const defaultNews = 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen bg-[#fdfcf6] text-[#2d2a26] font-sans selection:bg-[#c5a059]/30 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center [clip-path:inset(0_0_0_0)]">
        <div className="fixed inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] scale-110"
            style={{ backgroundImage: `url('${transformGDriveLink(config.heroImageUrl || defaultHero)}')` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <span className="text-[#c5a059] font-sans tracking-[0.3em] uppercase text-sm mb-6 block drop-shadow-sm">
              The Wedding Of
            </span>
            <h1 className="font-playfair text-6xl md:text-8xl lg:text-9xl mb-8 leading-tight drop-shadow-lg">
              {config.primaryName} <span className="text-[#c5a059]">&</span> {config.secondaryName}
            </h1>
            <div className="w-24 h-px bg-[#c5a059] mx-auto mb-8" />
            <p className="font-playfair italic text-xl md:text-2xl tracking-wide drop-shadow-md">
              {config.date ? format(new Date(config.date), "MMMM do, yyyy") : 'TBD'} • {config.location || 'The Gilded Palace'}
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-px h-12 bg-[#c5a059]/50 mx-auto" />
        </motion.div>
      </section>

      {/* Invitation Section */}
      <section className="py-24 px-6 bg-[#fdfcf6] text-[#1a1a1a] overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 border border-[#c5a059]/20 translate-x-4 translate-y-4" />
            
            <div className="relative z-10 bg-white shadow-[0_10px_30px_-10px_rgba(197,160,89,0.2)]">
                {config.imageUrl ? (
                    <div 
                        className="overflow-hidden flex justify-center items-center"
                        style={{ 
                            padding: `${config.imageStyle?.paddingY ?? 0}px ${config.imageStyle?.paddingX ?? 0}px`
                        }}
                    >
                        <img 
                            src={transformGDriveLink(config.imageUrl)} 
                            alt="Invitation" 
                            className="w-full h-auto block"
                            style={{ 
                                border: config.imageStyle?.showBorder ? `1px solid ${config.imageStyle.borderColor}` : 'none'
                             }}
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1200?text=Invitation'; }}
                        />
                    </div>
                ) : (
                    <div className="h-96 flex items-center justify-center bg-gray-50 text-gray-400">
                        Space for Invitation Card
                    </div>
                )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-8"
          >
            <h2 className="font-playfair text-4xl md:text-5xl border-b border-[#c5a059]/30 pb-4">
              A Royal Invitation
            </h2>
            <p className="font-sans text-lg leading-relaxed text-[#1a1a1a]/80 italic">
              "{config.message || 'Together with our families, we invite you to witness a promise of a lifetime. Join us as we celebrate the union of two souls in a setting fit for royalty.'}"
            </p>
            
            <div className="space-y-6 pt-4">
              <div className="flex items-start space-x-4">
                <Calendar className="w-6 h-6 text-[#c5a059] mt-1" />
                <div>
                  <h3 className="font-playfair text-xl">When</h3>
                  <p className="font-sans text-[#1a1a1a]/70">{config.date ? format(new Date(config.date), "EEEE, MMMM do, yyyy") : 'Date TBD'}</p>
                  <p className="font-sans text-[#1a1a1a]/70">Ceremony starts at {config.date ? format(new Date(config.date), "h:mm a") : 'Time TBD'}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-[#c5a059] mt-1" />
                <div>
                  <h3 className="font-playfair text-xl">Where</h3>
                  <p className="font-sans text-[#1a1a1a]/70">{config.location || 'The Gilded Palace Grand Ballroom'}</p>
                  <p className="font-sans text-[#1a1a1a]/70">{config.venue || '123 Serenity Drive, Royal Estates'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* News/Timeline Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-4xl md:text-5xl mb-4">Wedding News</h2>
            <div className="w-20 h-px bg-[#c5a059] mx-auto" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 flex flex-col justify-center"
            >
              <div className="space-y-8">
                {(config.news || []).map((news, idx) => (
                  <div key={idx} className="border-l-2 border-[#c5a059]/20 pl-6 pb-2">
                    <span className="text-[#c5a059] font-sans text-xs tracking-widest uppercase mb-1 block">
                      {news.date}
                    </span>
                    <h3 className="font-playfair text-2xl mb-2">{news.title}</h3>
                    <p className="font-sans text-[#1a1a1a]/60 leading-relaxed">
                      {news.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <img 
                src={transformGDriveLink(config.newsImageUrl || defaultNews)} 
                alt="Latest News" 
                className="w-full h-[600px] object-cover shadow-[0_10px_30px_-10px_rgba(197,160,89,0.2)] rounded-sm grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1200?text=News'; }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-[#1a1a1a] text-[#fdfcf6] text-center border-t border-[#c5a059]/10">
        <div className="max-w-xl mx-auto px-4">
          <Heart className="w-8 h-8 text-[#c5a059] mx-auto mb-6" />
          <h2 className="font-playfair text-3xl mb-4 italic">{config.primaryName} & {config.secondaryName}</h2>
          <p className="font-sans text-[#c5a059]/60 tracking-widest uppercase text-xs mb-8">
            Est. {config.date ? format(new Date(config.date), "yyyy") : '2026'}
          </p>
          <div className="text-sm text-[#fdfcf6]/40 flex flex-col space-y-2">
            <p>Copyright © {config.date ? format(new Date(config.date), "yyyy") : '2026'} {config.primaryName} & {config.secondaryName} Wedding. All Rights Reserved.</p>
            <p>Made with love for our dear family and friends.</p>
            <p className="mt-4 text-[10px] tracking-[0.1em] uppercase opacity-60">for business enquiries and custom websites: tytonyxindia@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
