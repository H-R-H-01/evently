'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Heart } from 'lucide-react';
import type { InvitationConfig } from '../../lib/types';
import { format } from 'date-fns';
import { transformGDriveLink } from '../../lib/utils';

export default function VintageGarden({ config }: { config: InvitationConfig }) {
  const defaultHero = 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  const defaultNews = 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen bg-[#f7f3ef] text-[#4a4238] font-serif selection:bg-[#e8d5c4] overflow-x-hidden">
      {/* Decorative Corner Ornaments */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-[url('https://www.transparenttextures.com/patterns/floral-paper.png')] opacity-10 pointer-events-none z-50" />
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-[url('https://www.transparenttextures.com/patterns/floral-paper.png')] opacity-10 pointer-events-none z-50 rotate-180" />

      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center p-6 sm:p-12 overflow-hidden">
        <div className="absolute inset-4 md:inset-8 border border-[#c19a6b]/30 z-20 pointer-events-none" />
        <div className="absolute inset-6 md:inset-10 border-4 border-[#c19a6b]/10 z-20 pointer-events-none" />

        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center transition-all duration-1000 scale-[1.01]"
            style={{ backgroundImage: `url('${transformGDriveLink(config.heroImageUrl || defaultHero)}')`, filter: 'sepia(20%) contrast(90%)' }}
          />
          <div className="absolute inset-0 bg-white/20" />
        </div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.5 }}
           className="relative z-30 bg-[#f7f3ef]/80 backdrop-blur-sm p-12 md:p-20 text-center max-w-3xl border border-[#c19a6b]/20 shadow-2xl"
        >
          <div className="w-16 h-px bg-[#c19a6b]/40 mx-auto mb-8" />
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-[#3d3126] mb-8 leading-tight lowercase italic flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
            <span>{config.primaryName}</span>
            <span className="text-xl not-italic font-sans tracking-[0.3em] text-[#c19a6b] lowercase">and</span>
            <span>{config.secondaryName}</span>
          </h1>
          <div className="w-16 h-px bg-[#c19a6b]/40 mx-auto mt-8 mb-6" />
          <p className="text-lg md:text-xl tracking-widest uppercase font-sans text-[#c19a6b]">
            {config.date ? format(new Date(config.date), "MMMM do, yyyy") : 'Spring 2026'}
          </p>
          <p className="text-sm font-sans italic text-[#8b7e6d] mt-4">{config.location || 'The Secret Garden'}</p>
        </motion.div>
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
                <div className="flex justify-center items-center space-x-4">
                    <div className="h-[1px] w-12 bg-[#c19a6b]/30" />
                    <Heart className="w-6 h-6 text-[#c19a6b]/50" />
                    <div className="h-[1px] w-12 bg-[#c19a6b]/30" />
                </div>
                
                <h2 className="text-4xl md:text-6xl text-[#3d3126] font-serif italic mt-12">Our Secret Promise</h2>
                
                <div className="max-w-2xl mx-auto mt-12">
                    <p className="text-xl md:text-2xl leading-relaxed text-[#5c5044] font-serif italic">
                        "{config.message || 'Like flowers in a hidden glen, our love has bloomed in its own time and season. We invite you to be part of the most special page in our story.'}"
                    </p>
                </div>

                <div className="pt-16 grid md:grid-cols-2 gap-16 text-left max-w-3xl mx-auto">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-[#c19a6b] font-sans text-xs tracking-[0.3em] uppercase">
                            <Calendar className="w-4 h-4" />
                            <span>The Day</span>
                        </div>
                        <h3 className="text-3xl text-[#3d3126]">{config.date ? format(new Date(config.date), "EEEE, MMMM do") : 'TBD'}</h3>
                        <p className="text-[#8b7e6d] font-sans">Formal ceremony at {config.date ? format(new Date(config.date), "h:mm p") : 'TBD'}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-[#c19a6b] font-sans text-xs tracking-[0.3em] uppercase">
                            <MapPin className="w-4 h-4" />
                            <span>The Place</span>
                        </div>
                        <h3 className="text-3xl text-[#3d3126]">{config.location || 'Greenwood Manor'}</h3>
                        <p className="text-[#8b7e6d] font-sans">{config.venue || 'West Wing Terrace, Old English Park'}</p>
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Visual Break with Invitation image */}
      <section className="py-24 px-6 bg-[#efe9e3]">
        <div className="max-w-5xl mx-auto">
             <div className="relative group">
                <div className="relative z-10 bg-white p-4 shadow-2xl flex justify-center items-center min-h-[300px]">
                    {config.imageUrl ? (
                        <div 
                            className="inline-block relative h-fit w-fit"
                            style={{ 
                                padding: `${config.imageStyle?.paddingY || 0}px ${config.imageStyle?.paddingX || 0}px`,
                                border: config.imageStyle?.showBorder ? `1px solid ${config.imageStyle.borderColor}` : 'none'
                            }}
                        >
                            <img 
                                src={transformGDriveLink(config.imageUrl)} 
                                alt="Vintage Invitation" 
                                className="max-w-full max-h-[80vh] w-auto h-auto object-contain sepia-[5%] mx-auto"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1200?text=Vintage+Invite'; }}
                            />
                        </div>
                    ) : (
                        <div className="h-96 w-full bg-[#fefdfc] flex items-center justify-center text-[#c19a6b]/40 italic text-2xl font-serif">
                            Captured in Light and Love
                        </div>
                    )}
                </div>
             </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-24 relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-[#c19a6b]/20 -z-0" />
                <span className="relative z-10 bg-[#f7f3ef] px-12 text-5xl font-serif italic text-[#3d3126]">The Milestones</span>
            </div>

            <div className="space-y-32">
                {(config.news || []).map((news, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}
                    >
                        <div className="md:w-1/2 text-center md:text-left">
                            <span className="text-[#c19a6b] font-sans tracking-[0.4em] uppercase text-xs mb-4 block italic">{news.date}</span>
                            <h3 className="text-4xl text-[#3d3126] font-serif mb-6 lowercase italic">{news.title}</h3>
                            <p className="text-lg leading-relaxed text-[#5c5044] font-serif">{news.description}</p>
                        </div>
                        <div className="md:w-1/2 h-80 w-full bg-[#efe9e3] border border-[#c19a6b]/10 p-2 overflow-hidden shadow-xl">
                            <div className="w-full h-full border border-[#c19a6b]/5 overflow-hidden">
                                <img 
                                    src={transformGDriveLink(config.newsImageUrl || defaultNews)} 
                                    className="w-full h-full object-cover opacity-80 hover:scale-110 transition-transform duration-1000"
                                    alt="Timeline"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-40 px-6 bg-[#3d3126] text-[#efe9e3] text-center overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-[#c19a6b]/20" />
        <div className="relative z-10 space-y-12">
            <h2 className="text-5xl md:text-7xl font-serif lowercase italic drop-shadow-lg">
                {config.primaryName} <br/> & <br/> {config.secondaryName}
            </h2>
            <div className="w-16 h-px bg-[#c19a6b]/40 mx-auto" />
            <p className="text-xs font-sans tracking-[0.6em] uppercase text-[#c19a6b]">forever starts here</p>
            <p className="text-sm font-sans italic opacity-40">Copyright © {config.date ? format(new Date(config.date), "yyyy") : '2026'} • Beautifully Crafted</p>
            <div className="mt-8 text-[10px] opacity-40 flex flex-col space-y-2">
              <p>Made with love for our dear family and friends.</p>
              <p className="tracking-[0.1em] uppercase">for business enquiries and custom websites: tytonyxindia@gmail.com</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
