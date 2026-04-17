'use client';

import { useState } from 'react';
import { ChevronDown, Check, Copy, ArrowRight, Image as ImageIcon, Sparkles } from 'lucide-react';
import { encodeConfig, transformGDriveLink } from '../lib/utils';
import { format, addDays } from 'date-fns';
import InvitationView from './InvitationView';
import type { InvitationConfig } from '../lib/types';
import CheckoutModal from './CheckoutModal';

const THEMES = [
  { id: 'royal_wedding', label: 'Royal Wedding (Elegant & Traditional)', categories: ['marriage'] },
  { id: 'modern_minimal', label: 'Modern Minimalist (Clean & Sophisticated)', categories: ['marriage'] },
  { id: 'vintage_garden', label: 'Vintage Garden (Floral & Heritage)', categories: ['marriage'] },
  { id: 'royal_birthday', label: 'Royal Birthday (Grand Celebration)', categories: ['birthday'] },
  { id: 'neon_birthday', label: 'Neon Birthday (Modern & High-Energy)', categories: ['birthday'] },
  { id: 'romantic_clouds', label: 'Romantic Clouds (Floating Elements)', categories: ['marriage', 'birthday'] },
  { id: 'golden_starfall', label: 'Golden Starfall (Space Parallax)', categories: ['marriage', 'birthday'] },
  { id: 'simple', label: 'Simple - No Effects', categories: ['marriage', 'birthday'] }
];

export default function InvitationBuilder({ onBack, initialThemeId }: { onBack?: () => void, initialThemeId?: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [copied, setCopied] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const today = new Date();
  const defaultDateStr = format(addDays(today, 30), "yyyy-MM-dd'T'18:00");

  const [formData, setFormData] = useState<InvitationConfig>(() => {
    const eventType = initialThemeId && ['royal_birthday', 'neon_birthday'].includes(initialThemeId) ? 'birthday' : 'marriage';
    return {
      type: 'invitation',
      eventType,
      title: eventType === 'marriage' ? 'A Royal Invitation' : 'A Royal Celebration',
      primaryName: eventType === 'marriage' ? 'Julian' : 'Prince Julian',
      secondaryName: eventType === 'marriage' ? 'Isabella' : undefined,
      date: defaultDateStr,
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      heroImageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      newsImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      themeId: initialThemeId || 'royal_wedding',
      location: 'The Gilded Palace',
      venue: '123 Serenity Drive, Royal Estates',
      message: 'Together with our families, we invite you to witness a promise of a lifetime. Join us as we celebrate the union of two souls in a setting fit for royalty.',
      news: [
        { 
          date: 'April 10, 2026', 
          title: 'The Venue Finalized', 
          description: 'We are thrilled to announce that the Gilded Palace will host our special day. The ballroom is currently being prepared with custom floral designs.' 
        },
        { 
          date: 'May 15, 2026', 
          title: 'Menu Selection', 
          description: 'A five-course royal banquet has been curated by Chef Alessandro. Featuring local seasonal delicacies and vintage champagne.' 
        }
      ],
      imageStyle: {
        showBorder: true,
        borderColor: '#c5a059',
        paddingX: 20,
        paddingY: 20
      }
    };
  });

  const isPremiumTheme = ['royal_wedding', 'modern_minimal', 'vintage_garden', 'royal_birthday', 'neon_birthday'].includes(formData.themeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (websiteId: string) => {
    setIsCheckoutOpen(false);
    const url = `${window.location.origin}/?id=${websiteId}`;
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
                    themeId: type === 'marriage' ? 'royal_wedding' : type === 'birthday' ? 'royal_birthday' : 'simple',
                    title: type === 'marriage' ? 'You are joyfully invited to celebrate the union of' : 
                           type === 'birthday' ? 'Join us for a spectacular birthday celebration for' : 
                           'You are invited to a special event',
                    secondaryName: type === 'marriage' ? prev.secondaryName || 'Isabella' : undefined
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {THEMES.filter(t => t.categories.includes(formData.eventType)).map(theme => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, themeId: theme.id }))}
                      className={`p-3 rounded-lg border text-left transition-all ${formData.themeId === theme.id ? 'bg-[#4db8ff]/10 border-[#4db8ff] ring-1 ring-[#4db8ff]' : 'bg-[#13151f] border-[#1a1d2e] hover:border-white/10'}`}
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.themeId === theme.id ? 'text-[#4db8ff]' : 'text-[#94a3b8]'}`}>
                        {theme.label}
                      </span>
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

                {isPremiumTheme && (
                  <div className="space-y-4 pt-4 border-t border-[#1a1d2e] animate-in fade-in slide-in-from-top-2 duration-300">
                    <h3 className="text-sm font-bold text-[#c5a059] border-b border-[#c5a059]/30 pb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Premium Template Settings
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Location / Venue Name</label>
                        <input type="text" value={formData.location || ''} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} placeholder="e.g. The Gilded Palace" className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-md p-2.5 text-sm text-[#f8fafc] focus:border-[#c5a059] outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Full Address</label>
                        <input type="text" value={formData.venue || ''} onChange={e => setFormData(p => ({ ...p, venue: e.target.value }))} placeholder="123 Serenity Drive..." className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-md p-2.5 text-sm text-[#f8fafc] focus:border-[#c5a059] outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Personal Message</label>
                        <textarea value={formData.message || ''} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} rows={3} className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-md p-2.5 text-sm text-[#f8fafc] focus:border-[#c5a059] outline-none resize-none" />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                       <label className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Hero Background Image</label>
                       <input type="url" value={formData.heroImageUrl || ''} onChange={e => setFormData(p => ({ ...p, heroImageUrl: transformGDriveLink(e.target.value) }))} placeholder="Hero background URL..." className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-md p-2.5 text-sm text-[#f8fafc] focus:border-[#c5a059] outline-none" />
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] text-[#94a3b8] uppercase tracking-wider">News Section Image</label>
                       <input type="url" value={formData.newsImageUrl || ''} onChange={e => setFormData(p => ({ ...p, newsImageUrl: transformGDriveLink(e.target.value) }))} placeholder="Timeline section image URL..." className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-md p-2.5 text-sm text-[#f8fafc] focus:border-[#c5a059] outline-none" />
                    </div>

                    <div className="space-y-3 pt-2">
                       <label className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Wedding News / Timeline</label>
                       {(formData.news || []).map((item, idx) => (
                         <div key={idx} className="p-3 bg-[#0a0b10] border border-[#1a1d2e] rounded-md space-y-2">
                            <input type="text" value={item.date} onChange={e => {
                              const newNews = [...(formData.news || [])];
                              newNews[idx].date = e.target.value;
                              setFormData(p => ({ ...p, news: newNews }));
                            }} placeholder="Date" className="w-full bg-transparent border-b border-[#1a1d2e] text-xs text-[#c5a059] outline-none pb-1" />
                            <input type="text" value={item.title} onChange={e => {
                              const newNews = [...(formData.news || [])];
                              newNews[idx].title = e.target.value;
                              setFormData(p => ({ ...p, news: newNews }));
                            }} placeholder="Title" className="w-full bg-transparent border-b border-[#1a1d2e] text-sm text-[#f8fafc] outline-none pb-1" />
                            <textarea value={item.description} onChange={e => {
                              const newNews = [...(formData.news || [])];
                              newNews[idx].description = e.target.value;
                              setFormData(p => ({ ...p, news: newNews }));
                            }} placeholder="Description" rows={2} className="w-full bg-transparent text-xs text-[#94a3b8] outline-none resize-none" />
                            <button type="button" onClick={() => {
                              const newNews = (formData.news || []).filter((_, i) => i !== idx);
                              setFormData(p => ({ ...p, news: newNews }));
                            }} className="text-[10px] text-red-500/50 hover:text-red-500 transition-colors uppercase tracking-widest pt-1">
                              Remove
                            </button>
                         </div>
                       ))}
                       <button type="button" onClick={() => {
                         setFormData(p => ({ ...p, news: [...(p.news || []), { date: '', title: '', description: '' }] }));
                       }} className="w-full p-2 border border-dashed border-[#1a1d2e] rounded-md text-[10px] text-[#94a3b8] hover:text-[#c5a059] hover:border-[#c5a059] transition-colors">
                         + Add Milestone
                       </button>
                    </div>
                  </div>
                )}
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
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="flex items-center justify-center gap-2 w-full pointer-events-auto px-8 py-4 bg-[#4db8ff] hover:bg-[#3ba0e6] text-[#0a0b10] rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(77,184,255,0.3)] hover:shadow-[0_0_30px_rgba(77,184,255,0.5)] transform hover:-translate-y-1"
                >
                  <Sparkles className="w-5 h-5" />
                  Create Website
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
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        amount={formData.eventType === 'marriage' ? 350 : 250}
        itemName={`Premium ${formData.eventType === 'marriage' ? 'Wedding' : 'Birthday'} Invitation`}
        configData={formData}
        builderType="invitation"
        themeId={formData.themeId}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}
