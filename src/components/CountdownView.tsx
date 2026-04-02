'use client';

import { useEffect, useState } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { EventConfig } from '../lib/types';

export default function CountdownView({ config }: { config: EventConfig }) {
  const { eventName, eventDate, additionalInfo, style, userInfo } = config;
  const targetDate = new Date(eventDate);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalSeconds = differenceInSeconds(targetDate, now);
  const isPast = totalSeconds <= 0;

  const days = isPast ? 0 : differenceInDays(targetDate, now);
  const hours = isPast ? 0 : differenceInHours(targetDate, now) % 24;
  const minutes = isPast ? 0 : differenceInMinutes(targetDate, now) % 60;
  const seconds = isPast ? 0 : totalSeconds % 60;

  const { textStyles, bgColor } = style || {};

  return (
    <div 
      className={`min-h-screen w-full flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden`}
      style={{ backgroundColor: bgColor || '#0a0b10' }}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm -z-10" />

      {/* Royal Background Ornamentation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none -z-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-5xl mx-auto z-10"
      >
        <div className="text-center mb-16 space-y-4">
          <p 
            className="tracking-[0.2em] uppercase opacity-80" 
            style={{ 
              color: textStyles?.preTitle?.color, 
              fontFamily: textStyles?.preTitle?.fontFamily,
              fontSize: textStyles?.preTitle?.fontSize,
              fontStyle: textStyles?.preTitle?.fontStyle
            }}
          >
            Join us for
          </p>
          <h1 
            className="mb-6 tracking-wide drop-shadow-2xl" 
            style={{ 
              color: textStyles?.title?.color, 
              fontFamily: textStyles?.title?.fontFamily,
              fontSize: textStyles?.title?.fontSize,
              fontStyle: textStyles?.title?.fontStyle,
              textShadow: `0 4px 20px ${textStyles?.title?.color || '#ffd700'}40` 
            }}
          >
            {eventName}
          </h1>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-current to-transparent opacity-50" style={{ color: textStyles?.title?.color }} />
        </div>

        {/* Live Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mb-20">
          <TimeUnit value={days} label="Days" numberStyle={textStyles?.countdownNumbers} labelStyle={textStyles?.countdownLabels} />
          <TimeUnit value={hours} label="Hours" numberStyle={textStyles?.countdownNumbers} labelStyle={textStyles?.countdownLabels} />
          <TimeUnit value={minutes} label="Minutes" numberStyle={textStyles?.countdownNumbers} labelStyle={textStyles?.countdownLabels} />
          <TimeUnit value={seconds} label="Seconds" numberStyle={textStyles?.countdownNumbers} labelStyle={textStyles?.countdownLabels} />
        </div>

        {/* Additional Info Cards */}
        {additionalInfo && additionalInfo.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
            {additionalInfo.map((info, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                className="p-8 border rounded-2xl bg-white/5 backdrop-blur-md shadow-xl"
                style={{ borderColor: `${textStyles?.infoHeaders?.color || '#ffffff'}20` }}
              >
                <h3 
                  className="tracking-wider mb-4 border-b pb-4 opacity-90" 
                  style={{ 
                    color: textStyles?.infoHeaders?.color, 
                    fontFamily: textStyles?.infoHeaders?.fontFamily,
                    fontSize: textStyles?.infoHeaders?.fontSize,
                    fontStyle: textStyles?.infoHeaders?.fontStyle,
                    borderColor: `${textStyles?.infoHeaders?.color}20` 
                  }}
                >
                  {info.header}
                </h3>
                <p 
                  className="leading-relaxed opacity-80 whitespace-pre-wrap" 
                  style={{ 
                    color: textStyles?.infoDescriptions?.color, 
                    fontFamily: textStyles?.infoDescriptions?.fontFamily,
                    fontSize: textStyles?.infoDescriptions?.fontSize,
                    fontStyle: textStyles?.infoDescriptions?.fontStyle
                  }}
                >
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Host Info */}
        <div className="mt-20 text-center opacity-70">
          <p 
            className="tracking-widest uppercase mb-2" 
            style={{ 
              color: textStyles?.hostLabel?.color, 
              fontFamily: textStyles?.hostLabel?.fontFamily,
              fontSize: textStyles?.hostLabel?.fontSize,
              fontStyle: textStyles?.hostLabel?.fontStyle
            }}
          >
            Hosted by
          </p>
          <p 
            style={{ 
              color: textStyles?.hostName?.color, 
              fontFamily: textStyles?.hostName?.fontFamily,
              fontSize: textStyles?.hostName?.fontSize,
              fontStyle: textStyles?.hostName?.fontStyle
            }}
          >
            {userInfo.name}
          </p>
        </div>

      </motion.div>
      
      <Link 
        href="/"
        className="fixed bottom-6 right-6 p-4 rounded-full bg-black/40 border border-white/10 backdrop-blur-md hover:bg-black/60 hover:scale-105 transition-all flex items-center gap-2 group z-50 text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest font-inter opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all max-w-[100px]">Create</span>
      </Link>
    </div>
  );
}

function TimeUnit({ value, label, numberStyle, labelStyle }: { value: number, label: string, numberStyle?: any, labelStyle?: any }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 shadow-2xl rounded-2xl relative overflow-hidden group">
      {/* Glassy backdrop that adjusts to the requested BG color but stays distinct */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundColor: numberStyle?.color || '#ffffff' }} />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl transition-all" />
      
      <div className="relative z-10 flex flex-col items-center">
        <AnimatePresence mode="popLayout">
          <motion.span 
            key={value}
            initial={{ y: 20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="font-bold tabular-nums tracking-tighter"
            style={{ 
              color: numberStyle?.color, 
              fontFamily: numberStyle?.fontFamily,
              fontSize: numberStyle?.fontSize || '4rem',
              fontStyle: numberStyle?.fontStyle
            }}
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
        <span 
          className="tracking-[0.3em] uppercase mt-4 opacity-70 font-light" 
          style={{ 
            color: labelStyle?.color, 
            fontFamily: labelStyle?.fontFamily,
            fontSize: labelStyle?.fontSize || '1rem',
            fontStyle: labelStyle?.fontStyle
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
