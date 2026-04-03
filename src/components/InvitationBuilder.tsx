'use client';

import { useState } from 'react';
import { ChevronDown, Check, Copy, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { encodeConfig, transformGDriveLink } from '../lib/utils';
import { format, addDays } from 'date-fns';
import InvitationView from './InvitationView';
import type { InvitationConfig } from '../lib/types';

const THEMES = [
  { id: 'romantic_clouds', label: 'Romantic Clouds (Floating Elements)' },
  { id: 'golden_starfall', label: 'Golden Starfall (Space Parallax)' },
  { id: 'simple', label: 'Simple - No Effects' }
];

export default function InvitationBuilder({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [copied, setCopied] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

  const today = new Date();
  const defaultDateStr = format(addDays(today, 30), "yyyy-MM-dd'T'18:00");

  const [formData, setFormData] = useState<InvitationConfig>({
    type: 'invitation',
    eventType: 'marriage',
    title: 'You are joyfully invited to celebrate the union of',
    primaryName: 'Romeo',
    secondaryName: 'Juliet',
    date: defaultDateStr,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    themeId: 'romantic_clouds',
    imageStyle: {
      showBorder: true,
      borderColor: '#4db8ff',
      paddingX: 20,
      paddingY: 20
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const configString = encodeConfig(formData);
    const url = `${window.location.origin}${window.location.pathname}?data=${configString}`;
    setGeneratedUrl(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#05050a] p-6 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
        <div className="z-10 w-full max-w-3xl">
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-2 mb-8 text-[#94a3b8] hover:text-[#4db8ff] transition-all text-sm tracking-widest uppercase font-bold">
              <ChevronDown className="w-4 h-4 rotate-90" /> Return to Hub
            </button>
          )}
          <h1 className="text-4xl sm:text-5xl font-playfair text-[#f8fafc] mb-4">Choose Event Type</h1>
          <p className="text-[#94a3b8] mb-12">Select the kind of journey you want your guests to experience.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(['marriage', 'birthday', 'custom'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setFormData(prev => ({ 
                    ...prev, 
                    eventType: type,
                    title: type === 'marriage' ? 'You are joyfully invited to celebrate the union of' : 
                           type === 'birthday' ? 'Join us for a spectacular birthday celebration for' : 
                           'You are invited to a special event'
                  }));
                  setStep(2);
                }}
                className="group p-8 border border-[#1a1d2e] bg-[#0a0b10] hover:bg-[#13151f] hover:border-[#4db8ff]/50 rounded-2xl flex flex-col items-center text-center transition-all shadow-lg hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-full bg-[#13151f] border border-[#1a1d2e] flex items-center justify-center mb-6 group-hover:bg-[#4db8ff]/10 group-hover:border-[#4db8ff]/40 transition-colors">
                  <span className="text-2xl">{type === 'marriage' ? '💍' : type === 'birthday' ? '🎂' : '✨'}</span>
                </div>
                <h3 className="text-xl font-playfair text-[#f8fafc] mb-2 capitalize">{type === 'custom' ? 'Other / Custom' : type}</h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Customization & Live Preview
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#05050a]">
      {/* LEFT COLUMN: Builder Form */}
      <div className={`w-full flex-shrink-0 ${generatedUrl ? 'lg:w-full flex flex-col items-center justify-center' : 'lg:w-[45%]'} h-screen overflow-y-auto scrollbar-hide bg-[#0a0b10] border-r border-[#1a1d2e] relative z-20`}>
        {generatedUrl ? (
          <div className="w-full max-w-2xl mx-auto glass-panel p-8 sm:p-12 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-xl border border-[#4db8ff]/30 m-6 bg-[#0a0b10]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4db8ff] via-[#99ccff] to-[#4db8ff]" />
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#13151f] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#4db8ff]/50 shadow-[0_0_30px_rgba(77,184,255,0.2)]">
                <Check className="w-10 h-10 text-[#4db8ff]" />
              </div>
              <h2 className="text-4xl font-playfair text-[#f8fafc] mb-4 tracking-wide">Journey Prepared</h2>
              <p className="text-[#94a3b8] text-lg font-light leading-relaxed">
                Your StoryScroll Invitation is ready to amaze your guests.
              </p>
            </div>
            <div className="bg-[#13151f]/80 border border-[#1a1d2e] rounded-xl p-6 flex flex-col md:flex-row items-center gap-4 shadow-inner">
              <input type="text" readOnly value={generatedUrl} className="w-full bg-transparent text-[#f8fafc] font-light outline-none overflow-hidden text-ellipsis selection:bg-[#4db8ff]/30" />
              <button 
                onClick={handleCopy}
                className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-[#4db8ff] hover:bg-[#66c2ff] text-[#05050a] font-semibold rounded-lg transition-all active:scale-95 whitespace-nowrap"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
            <div className="mt-8 text-center flex justify-center gap-6">
              <button onClick={() => setGeneratedUrl('')} className="text-[#94a3b8] hover:text-[#4db8ff] transition-colors border-b border-transparent hover:border-[#4db8ff] pb-1 uppercase tracking-widest text-xs font-bold">
                Edit Again
              </button>
              <button onClick={() => { setGeneratedUrl(''); setStep(1); }} className="text-[#94a3b8] hover:text-[#4db8ff] transition-colors border-b border-transparent hover:border-[#4db8ff] pb-1 uppercase tracking-widest text-xs font-bold">
                New Invitation
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-10 pb-32">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 mb-8 text-[#94a3b8] hover:text-[#4db8ff] transition-all text-xs tracking-widest uppercase font-bold">
              <ChevronDown className="w-4 h-4 rotate-90" /> Back to Type
            </button>
            <h1 className="text-3xl font-playfair text-[#f8fafc] mb-2">Design Journey</h1>
            <p className="text-[#94a3b8] font-light text-sm mb-10">Customize details and see the parallax preview on the right. Scroll the right side to experience it.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Theme Settings */}
              <div className="space-y-3">
                <label className="text-xs text-[#94a3b8] uppercase font-bold tracking-wider">Effects & Theme</label>
                <div className="grid grid-cols-1 gap-2">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id} type="button"
                      onClick={() => setFormData(p => ({ ...p, themeId: theme.id }))}
                      className={`p-4 rounded-lg border text-left flex items-center justify-between transition-all ${formData.themeId === theme.id ? 'border-[#4db8ff] bg-[#4db8ff]/10 shadow-[0_0_15px_rgba(77,184,255,0.15)]' : 'border-[#1a1d2e] bg-[#0a0b10] hover:border-[#4db8ff]/50'}`}
                    >
                      <span className={`text-sm ${formData.themeId === theme.id ? 'text-[#4db8ff]' : 'text-[#f8fafc]'}`}>{theme.label}</span>
                      {formData.themeId === theme.id && <Check className="w-4 h-4 text-[#4db8ff]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Inputs */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#f8fafc] border-b border-[#1a1d2e] pb-2">Event Typography</h3>
                <div className="space-y-1">
                  <label className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Intro Text</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-md p-2.5 text-sm text-[#f8fafc] focus:border-[#4db8ff] outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#94a3b8] uppercase tracking-wider">{formData.eventType === 'marriage' ? 'Primary Name' : 'Name of Person/Event'}</label>
                    <input required type="text" value={formData.primaryName} onChange={e => setFormData(p => ({ ...p, primaryName: e.target.value }))} className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-md p-2.5 text-sm text-[#f8fafc] focus:border-[#4db8ff] outline-none" />
                  </div>
                  {formData.eventType === 'marriage' && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Secondary Name</label>
                      <input type="text" value={formData.secondaryName || ''} onChange={e => setFormData(p => ({ ...p, secondaryName: e.target.value }))} className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-md p-2.5 text-sm text-[#f8fafc] focus:border-[#4db8ff] outline-none" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Date & Time</label>
                  <input required type="datetime-local" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-md p-2.5 text-sm text-[#f8fafc] focus:border-[#4db8ff] outline-none" style={{ colorScheme: 'dark' }} />
                </div>
              </div>

              {/* Photo Styling */}
              <div className="space-y-4 pt-4 border-t border-[#1a1d2e]">
                <h3 className="text-sm font-bold text-[#f8fafc] border-b border-[#1a1d2e] pb-2">Image Styling</h3>
                
                <div className="p-4 bg-[#13151f] border border-[#1a1d2e] rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-[#94a3b8] uppercase tracking-wider font-bold">Show Glow Border</label>
                    <input 
                      type="checkbox" 
                      checked={formData.imageStyle?.showBorder} 
                      onChange={e => setFormData(p => ({ ...p, imageStyle: { ...p.imageStyle!, showBorder: e.target.checked } }))} 
                      className="accent-[#4db8ff] w-4 h-4 cursor-pointer" 
                    />
                  </div>

                  {formData.imageStyle?.showBorder && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Border Color</label>
                      <div className="flex items-center gap-2 border border-[#1a1d2e] bg-[#0a0b10] rounded p-1.5">
                        <input 
                          type="color" 
                          value={formData.imageStyle.borderColor} 
                          onChange={e => setFormData(p => ({ ...p, imageStyle: { ...p.imageStyle!, borderColor: e.target.value } }))} 
                          className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent" 
                        />
                        <span className="text-xs text-[#94a3b8] font-mono uppercase">{formData.imageStyle.borderColor}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-[#94a3b8] uppercase tracking-wider flex justify-between">Padding X <span>{formData.imageStyle?.paddingX}px</span></label>
                      <input 
                        type="range" min="0" max="100" 
                        value={formData.imageStyle?.paddingX} 
                        onChange={e => setFormData(p => ({ ...p, imageStyle: { ...p.imageStyle!, paddingX: parseInt(e.target.value) } }))} 
                        className="w-full accent-[#4db8ff]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-[#94a3b8] uppercase tracking-wider flex justify-between">Padding Y <span>{formData.imageStyle?.paddingY}px</span></label>
                      <input 
                        type="range" min="0" max="100" 
                        value={formData.imageStyle?.paddingY} 
                        onChange={e => setFormData(p => ({ ...p, imageStyle: { ...p.imageStyle!, paddingY: parseInt(e.target.value) } }))} 
                        className="w-full accent-[#4db8ff]" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Upload / Link */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#f8fafc] border-b border-[#1a1d2e] pb-2">Final Invitation Image</h3>
                <div className="p-4 bg-[#13151f] border border-[#1a1d2e] rounded-lg space-y-3">
                  <div className="flex items-center gap-2 text-[#94a3b8] mb-2">
                    <ImageIcon className="w-4 h-4" />
                    <p className="text-xs">Paste an image URL (Google Drive direct link, Imgur, etc.)</p>
                  </div>
                  <input required type="url" placeholder="https://..." 
                    value={formData.imageUrl} 
                    onChange={e => setFormData(p => ({ ...p, imageUrl: transformGDriveLink(e.target.value) }))} 
                    className="w-full bg-[#0a0b10] border border-[#1a1d2e] rounded-md p-2.5 text-sm text-[#f8fafc] focus:border-[#4db8ff] outline-none" 
                  />
                  {formData.imageUrl ? (
                    <div className="mt-2 w-full h-32 rounded bg-black flex items-center justify-center overflow-hidden border border-[#1a1d2e]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={transformGDriveLink(formData.imageUrl)} 
                        alt="Invitation Preview" 
                        className="max-w-full max-h-full object-contain opacity-80" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Invalid+Image+URL'; }} 
                      />
                    </div>
                  ) : (
                    <div className="mt-2 w-full h-32 rounded bg-[#0a0b10] border border-dashed border-[#1a1d2e] flex items-center justify-center text-[10px] text-[#64748b]">
                      No Image Provided
                    </div>
                  )}
                </div>
              </div>

              <div className="fixed bottom-0 left-0 w-full lg:w-[45%] p-4 bg-gradient-to-t from-[#05050a] via-[#05050a] to-transparent z-10 pointer-events-none">
                <button type="submit" className="w-full pointer-events-auto px-6 py-4 bg-[#4db8ff] hover:bg-[#66c2ff] text-[#05050a] text-sm tracking-widest uppercase font-bold rounded-lg shadow-[0_0_30px_rgba(77,184,255,0.2)] transition-all transform hover:-translate-y-1 active:scale-95">
                  Generate Endpoint
                </button>
              </div>

            </form>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Live Preview */}
      {!generatedUrl && (
        <div className="w-full lg:flex-1 h-screen overflow-y-auto bg-black relative border-l border-[#1a1d2e] scrollbar-hide">
          <div className="fixed top-4 right-4 z-50 bg-black/60 border border-[#1a1d2e] px-4 py-1.5 rounded-full text-xs font-mono text-[#4db8ff] backdrop-blur flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            SCROLL TO PREVIEW
          </div>
          {/* Render the View */}
          <InvitationView config={formData} />
        </div>
      )}
    </div>
  );
}
