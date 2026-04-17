'use client';

import { useEffect, useState } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { EventConfig, BoxStyle } from '../lib/types';
import PremiumCountdown from './countdowns/PremiumCountdown';
import { TemplateFooter } from './TemplateFooter';

function hexToRgba(hex: string, opacity: number) {
  if (!hex) return 'transparent';
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(x => x + x).join('');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return 'transparent';
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

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

  const { textStyles, bgColor, boxStyles } = style || {};

  const defaultBoxStyle = {
    enabled: true,
    backgroundColor: '#ffffff',
    backgroundOpacity: 5,
    borderColor: '#ffffff',
    borderOpacity: 10
  };

  const cdBox = boxStyles?.countdown || defaultBoxStyle;
  const infoBox = boxStyles?.additionalInfo || defaultBoxStyle;

  if (style?.layout === 'premium') {
    return <PremiumCountdown config={config} />;
  }

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
          <TimeUnit value={days} label="Days" numberStyle={textStyles?.countdownNumbers} labelStyle={textStyles?.countdownLabels} boxStyle={cdBox} />
          <TimeUnit value={hours} label="Hours" numberStyle={textStyles?.countdownNumbers} labelStyle={textStyles?.countdownLabels} boxStyle={cdBox} />
          <TimeUnit value={minutes} label="Minutes" numberStyle={textStyles?.countdownNumbers} labelStyle={textStyles?.countdownLabels} boxStyle={cdBox} />
          <TimeUnit value={seconds} label="Seconds" numberStyle={textStyles?.countdownNumbers} labelStyle={textStyles?.countdownLabels} boxStyle={cdBox} />
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
                className={`p-8 rounded-2xl ${infoBox.enabled ? 'shadow-xl backdrop-blur-md' : ''}`}
                style={{ 
                  backgroundColor: infoBox.enabled ? hexToRgba(infoBox.backgroundColor, infoBox.backgroundOpacity) : 'transparent',
                  border: infoBox.enabled ? `1px solid ${hexToRgba(infoBox.borderColor, infoBox.borderOpacity)}` : 'none',
                }}
              >
                <h3 
                  className={`tracking-wider mb-4 pb-4 opacity-90 ${infoBox.enabled ? 'border-b' : ''}`}
                  style={{ 
                    color: textStyles?.infoHeaders?.color, 
                    fontFamily: textStyles?.infoHeaders?.fontFamily,
                    fontSize: textStyles?.infoHeaders?.fontSize,
                    fontStyle: textStyles?.infoHeaders?.fontStyle,
                    borderColor: infoBox.enabled ? hexToRgba(infoBox.borderColor, infoBox.borderOpacity) : 'transparent' 
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
          <div className="mt-20 text-[10px] opacity-40 flex flex-col items-center space-y-2 uppercase tracking-[0.2em]" style={{ color: textStyles?.hostLabel?.color }}>
             <p>Made with love for our dear family and friends.</p>
             <p className="font-bold">for business enquiries and custom websites: tytonyxindia@gmail.com</p>
          </div>
        </div>

      </motion.div>
      <Link 
        href="/"
        className="fixed bottom-6 right-6 p-4 rounded-full bg-black/40 border border-white/10 backdrop-blur-md hover:bg-black/60 hover:scale-105 transition-all flex items-center gap-2 group z-50 text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest font-inter opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all max-w-[100px]">Create</span>
      </Link>

      <TemplateFooter 
        type="countdown" 
        themeId={style?.theme} 
        themeLabel={style?.theme ? {
          royal_gold: 'Royal Gold',
          midnight_silver: 'Midnight Silver',
          rose_elegance: 'Rose Elegance',
          ocean_depth: 'Ocean Depth',
          neon_cyber: 'Neon Cyber',
          emerald_forest: 'Emerald Forest'
        }[style.theme] : 'Classic Countdown'} 
      />
    </div>
  );
}

function TimeUnit({ value, label, numberStyle, labelStyle, boxStyle }: { value: number, label: string, numberStyle?: any, labelStyle?: any, boxStyle?: BoxStyle }) {
  const box = boxStyle || { enabled: true, backgroundColor: '#ffffff', backgroundOpacity: 5, borderColor: '#ffffff', borderOpacity: 10 };

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl relative overflow-hidden group ${box.enabled ? 'shadow-2xl' : ''}`}>
      {box.enabled && (
        <>
          <div className="absolute inset-0" style={{ backgroundColor: hexToRgba(box.backgroundColor, box.backgroundOpacity) }} />
          <div className="absolute inset-0 backdrop-blur-xl rounded-2xl transition-all" style={{ border: `1px solid ${hexToRgba(box.borderColor, box.borderOpacity)}` }} />
        </>
      )}
      
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
