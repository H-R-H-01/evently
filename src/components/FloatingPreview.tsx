'use client';

import React, { useState, useEffect } from 'react';
import { Maximize2, X, ArrowLeft, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingPreviewProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export function FloatingPreview({ children }: FloatingPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSmallPreview, setShowSmallPreview] = useState(true);

  // Handle hardware back button
  useEffect(() => {
    if (isExpanded) {
      window.history.pushState({ preview: 'open' }, '');
    }

    const handlePopState = (e: PopStateEvent) => {
      if (isExpanded) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isExpanded]);

  return (
    <>
      <AnimatePresence>
        {showSmallPreview && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-48 md:w-64 aspect-[9/16] bg-black rounded-xl border border-white/20 shadow-2xl z-40 overflow-hidden group"
          >
            {/* Control Overlay */}
            <div className="absolute inset-0 z-10 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                onClick={() => setIsExpanded(true)}
                className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors"
                title="Expand Preview"
              >
                <Maximize2 className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => setShowSmallPreview(false)}
                className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors"
                title="Hide Preview"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Scaled Content Container */}
            <div className="absolute inset-0 w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none">
                {children}
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white/70 uppercase tracking-widest font-bold z-20">
              Live Preview
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showSmallPreview && !isExpanded && (
        <button 
          onClick={() => setShowSmallPreview(true)}
          className="fixed bottom-24 right-6 p-4 bg-[#4db8ff] rounded-full shadow-lg z-40 hover:scale-110 transition-transform text-[#0a0b10]"
        >
          <Eye className="w-6 h-6" />
        </button>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#05050a] z-[100] flex flex-col"
          >
            {/* Header / Back Button */}
            <div className="p-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
              <button 
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Builder
              </button>
              <div className="text-[10px] text-[#4db8ff] font-mono tracking-widest">
                PREVIEW MODE
              </div>
            </div>

            {/* Fullscreen View */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
