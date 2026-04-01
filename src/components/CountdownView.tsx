'use client';

import { useEffect, useState } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Share2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CountdownView({ config }: { config: any }) {
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

  return (
    <div 
      className={`min-h-screen w-full flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden ${style.fontSize}`}
      style={{ 
        backgroundColor: style.bgColor, 
        color: style.textColor,
        fontFamily: style.fontFamily 
      }}
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
          <p className="tracking-[0.2em] uppercase text-sm sm:text-base opacity-80" style={{ fontFamily: 'var(--font-inter)' }}>Join us for</p>
          <h1 className="text-5xl sm:text-7xl font-playfair mb-6 tracking-wide drop-shadow-2xl" style={{ textShadow: `0 4px 20px ${style.textColor}40` }}>
            {eventName}
          </h1>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-current to-transparent opacity-50" />
        </div>

        {/* Live Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mb-20">
          <TimeUnit value={days} label="Days" color={style.textColor} bgColor={style.bgColor} />
          <TimeUnit value={hours} label="Hours" color={style.textColor} bgColor={style.bgColor} />
          <TimeUnit value={minutes} label="Minutes" color={style.textColor} bgColor={style.bgColor} />
          <TimeUnit value={seconds} label="Seconds" color={style.textColor} bgColor={style.bgColor} />
        </div>

        {/* Additional Info Cards */}
        {additionalInfo && additionalInfo.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
            {additionalInfo.map((info: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md shadow-xl"
                style={{ borderColor: `${style.textColor}20` }}
              >
                <h3 className="text-2xl font-playfair tracking-wider mb-4 border-b pb-4 opacity-90" style={{ borderColor: `${style.textColor}20` }}>
                  {info.header}
                </h3>
                <p className="font-light leading-relaxed opacity-80" style={{ fontFamily: 'var(--font-inter)' }}>
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Host Info */}
        <div className="mt-20 text-center opacity-70">
          <p className="text-sm tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-inter)' }}>Hosted by</p>
          <p className="text-2xl font-playfair">{userInfo.name}</p>
        </div>

      </motion.div>
      
      {/* Create Own Button - discrete */}
      <a 
        href="/"
        className="fixed bottom-6 right-6 p-4 rounded-full bg-black/40 border border-white/10 backdrop-blur-md hover:bg-black/60 hover:scale-105 transition-all flex items-center gap-2 group z-50 text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest font-inter opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all max-w-[100px]">Create</span>
      </a>
    </div>
  );
}

function TimeUnit({ value, label, color, bgColor }: { value: number, label: string, color: string, bgColor: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 shadow-2xl rounded-2xl relative overflow-hidden group">
      {/* Glassy backdrop that adjusts to the requested BG color but stays distinct */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundColor: color }} />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl transition-all" />
      
      <div className="relative z-10 flex flex-col items-center">
        <AnimatePresence mode="popLayout">
          <motion.span 
            key={value}
            initial={{ y: 20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-6xl sm:text-8xl font-playfair font-bold tabular-nums tracking-tighter"
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
        <span className="text-sm sm:text-base tracking-[0.3em] uppercase mt-4 opacity-70 font-light" style={{ fontFamily: 'var(--font-inter)' }}>
          {label}
        </span>
      </div>
    </div>
  );
}
