'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, Heart } from 'lucide-react';

interface TemplateFooterProps {
  themeId?: string;
  type: 'invitation' | 'countdown';
  themeLabel?: string;
}

export function TemplateFooter({ themeId, type, themeLabel }: TemplateFooterProps) {
  const isDark = ['neon_birthday', 'golden_starfall', 'romantic_clouds'].includes(themeId || '');
  
  return (
    <footer className={`py-10 px-6 border-t ${isDark ? 'bg-black border-white/5' : 'bg-white border-black/5'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-2">
            <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Powered by Evently
            </h2>
            <p className={`text-lg font-playfair ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Create moments that last forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <Link 
              href={`/?builder=${type}${themeId ? `&theme=${themeId}` : ''}`}
              className={`group flex items-center justify-center gap-4 p-4 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:border-[#4db8ff]/50' : 'bg-gray-50 border-gray-100 hover:border-blue-200'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 group-hover:bg-[#4db8ff]/20' : 'bg-white group-hover:bg-blue-50'}`}>
                <Sparkles className={`w-4 h-4 ${isDark ? 'text-[#4db8ff]' : 'text-blue-500'}`} />
              </div>
              <div className="text-left">
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Create your own
                </span>
                <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {themeLabel || 'This Template'}
                </p>
              </div>
            </Link>

            <Link 
              href="/?builder=invitation"
              className={`group flex items-center justify-center gap-4 p-4 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:border-pink-500/50' : 'bg-gray-50 border-gray-100 hover:border-pink-200'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 group-hover:bg-pink-500/20' : 'bg-white group-hover:bg-pink-50'}`}>
                <Heart className={`w-4 h-4 ${isDark ? 'text-pink-500' : 'text-pink-600'}`} />
              </div>
              <div className="text-left">
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Explore Other
                </span>
                <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Invitations
                </p>
              </div>
            </Link>

            <Link 
              href="/?builder=countdown"
              className={`group flex items-center justify-center gap-4 p-4 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:border-yellow-500/50' : 'bg-gray-50 border-gray-100 hover:border-yellow-200'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 group-hover:bg-yellow-500/20' : 'bg-white group-hover:bg-yellow-50'}`}>
                <Calendar className={`w-4 h-4 ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`} />
              </div>
              <div className="text-left">
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Build Real-time
                </span>
                <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Countdowns
                </p>
              </div>
            </Link>
          </div>

          <div className="w-full space-y-4 pt-4 border-t border-white/5">
            <div className={`text-[10px] tracking-widest uppercase font-medium ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              &copy; 2026 Evently. All Rights Reserved.
            </div>
            <div className={`text-[9px] tracking-[0.2em] uppercase font-bold transition-colors ${isDark ? 'text-[#4db8ff]/60 hover:text-[#4db8ff]' : 'text-blue-500/60 hover:text-blue-500'}`}>
              for business enquiries and custom websites: tytonyxindia@gmail.com
            </div>
          </div>
        </div>
      </div>
    </footer>
        </div>
      </div>
    </footer>
  );
}
