'use client';

import { useState } from 'react';
import { Plus, Trash2, Calendar, Clock, Image as ImageIcon, Link2, Copy, Check } from 'lucide-react';
import { encodeConfig } from '@/lib/utils';
import { addDays, format, isAfter, isBefore } from 'date-fns';

export default function EventForm() {
  const [copied, setCopied] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  
  // Date Limits
  const today = new Date();
  const maxDate = addDays(today, 31);
  const minDateStr = format(today, "yyyy-MM-dd'T'HH:mm");
  const maxDateStr = format(maxDate, "yyyy-MM-dd'T'HH:mm");

  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: minDateStr,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userInfo: { name: '', email: '', phoneCode: '+1', phone: '' },
    additionalInfo: [{ header: 'Venue', description: '' }],
    style: {
      textColor: '#ffffff',
      bgColor: '#0a0b10',
      fontFamily: 'var(--font-playfair)',
      fontSize: 'text-base'
    }
  });

  const [error, setError] = useState('');

  const handleAddField = () => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: [...prev.additionalInfo, { header: '', description: '' }]
    }));
  };

  const handleRemoveField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: prev.additionalInfo.filter((_, i) => i !== index)
    }));
  };

  const handleInfoChange = (index: number, field: 'header' | 'description', value: string) => {
    const newInfo = [...formData.additionalInfo];
    newInfo[index][field] = value;
    setFormData(prev => ({ ...prev, additionalInfo: newInfo }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const selectedDate = new Date(formData.eventDate);
    if (isAfter(selectedDate, maxDate)) {
      setError('Event date cannot be more than 31 days from today.');
      return;
    }
    if (isBefore(selectedDate, today)) {
      setError('Event date cannot be in the past.');
      return;
    }

    if (!formData.eventName.trim()) {
      setError('Event name is required.');
      return;
    }

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

  if (generatedUrl) {
    return (
      <div className="w-full max-w-2xl mx-auto glass-panel p-8 sm:p-12 mix-blend-normal rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-xl border border-[#d4af37]/30">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#d4af37]" />
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#13151f] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d4af37]/50 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <Check className="w-10 h-10 text-[#ffd700]" />
          </div>
          <h2 className="text-4xl font-playfair text-[#ffd700] mb-4 tracking-wide">Royal Endpoint Created</h2>
          <p className="text-[#94a3b8] text-lg font-light leading-relaxed">
            Your majestic countdown is ready to be shared with your guests. Copy the scroll below.
          </p>
        </div>

        <div className="bg-[#0a0b10]/80 border border-[#1a1d2e] rounded-xl p-6 flex flex-col md:flex-row items-center gap-4 shadow-inner">
          <input 
            type="text" 
            readOnly 
            value={generatedUrl}
            className="w-full bg-transparent text-[#f8fafc] font-light outline-none overflow-hidden text-ellipsis selection:bg-[#d4af37]/30"
          />
          <button 
            onClick={handleCopy}
            className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#ffd700] text-[#0a0b10] font-semibold rounded-lg transition-all active:scale-95 whitespace-nowrap"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied to Scroll' : 'Copy Scroll'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setGeneratedUrl('')}
            className="text-[#94a3b8] hover:text-[#d4af37] transition-colors border-b border-transparent hover:border-[#d4af37] pb-1 uppercase tracking-widest text-sm"
          >
            Create Another Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-12 glass-panel p-6 sm:p-10 rounded-2xl shadow-2xl relative border border-[#d4af37]/20">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-playfair text-[#ffd700] mb-4 tracking-wider">
          Proclaim Your Event
        </h1>
        <p className="text-[#94a3b8] font-light max-w-xl mx-auto">
          Craft a majestic countdown for your upcoming momentous occasion. 
          Fill in the decree below to generate a unique scroll (endpoint).
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-center text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* User Info Section */}
        <section className="space-y-6 relative">
          <div className="flex items-center gap-3 border-b border-[#1a1d2e] pb-3">
            <h3 className="text-xl font-playfair text-[#f8fafc] tracking-wide">I. Host Information</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-[#94a3b8] uppercase tracking-wider font-medium">Full Name</label>
              <input required type="text"
                value={formData.userInfo.name}
                onChange={e => setFormData(prev => ({ ...prev, userInfo: { ...prev.userInfo, name: e.target.value } }))}
                className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-lg p-3 text-[#f8fafc] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all placeholder:text-[#475569]"
                placeholder="Lord / Lady Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#94a3b8] uppercase tracking-wider font-medium">Email Pigeon</label>
              <input required type="email"
                value={formData.userInfo.email}
                onChange={e => setFormData(prev => ({ ...prev, userInfo: { ...prev.userInfo, email: e.target.value } }))}
                className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-lg p-3 text-[#f8fafc] focus:border-[#d4af37] outline-none transition-all"
                placeholder="royalty@kingdom.com"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm text-[#94a3b8] uppercase tracking-wider font-medium">Royal Contact Number</label>
              <div className="flex gap-2">
                <select 
                  value={formData.userInfo.phoneCode}
                  onChange={e => setFormData(prev => ({ ...prev, userInfo: { ...prev.userInfo, phoneCode: e.target.value } }))}
                  className="w-24 bg-[#13151f] border border-[#1a1d2e] rounded-lg p-3 text-[#f8fafc] focus:border-[#d4af37] outline-none appearance-none"
                >
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+91">+91 (IN)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+81">+81 (JP)</option>
                </select>
                <input required type="tel"
                  value={formData.userInfo.phone}
                  onChange={e => setFormData(prev => ({ ...prev, userInfo: { ...prev.userInfo, phone: e.target.value } }))}
                  className="flex-1 bg-[#13151f] border border-[#1a1d2e] rounded-lg p-3 text-[#f8fafc] focus:border-[#d4af37] outline-none transition-all"
                  placeholder="234 567 8900"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Event Info Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1a1d2e] pb-3">
            <h3 className="text-xl font-playfair text-[#f8fafc] tracking-wide">II. Event Details</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm text-[#94a3b8] uppercase tracking-wider font-medium">What is the occasion?</label>
              <input required type="text"
                value={formData.eventName}
                onChange={e => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-lg p-4 text-[#ffd700] text-xl font-playfair focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all placeholder:text-[#475569] placeholder:font-sans"
                placeholder="e.g., The Royal Wedding of Arthur & Guinevere"
              />
            </div>
            <div className="space-y-2 relative">
              <label className="text-sm text-[#94a3b8] uppercase tracking-wider font-medium flex gap-2 items-center">
                <Calendar className="w-4 h-4" /> Date & Time
              </label>
              <input required type="datetime-local"
                min={minDateStr}
                max={maxDateStr}
                value={formData.eventDate}
                onChange={e => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-lg p-3 text-[#f8fafc] focus:border-[#d4af37] outline-none block color-scheme-dark"
                style={{ colorScheme: 'dark' }}
              />
              <p className="text-xs text-[#64748b]">Maximum 31 days into the future.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#94a3b8] uppercase tracking-wider font-medium flex gap-2 items-center">
                <Clock className="w-4 h-4" /> Timezone
              </label>
              <input type="text" readOnly value={formData.timezone}
                className="w-full bg-[#0a0b10] border border-[#1a1d2e] rounded-lg p-3 text-[#94a3b8] cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1a1d2e] pb-3">
            <h3 className="text-xl font-playfair text-[#f8fafc] tracking-wide">III. Additional Decrees</h3>
          </div>
          
          <div className="space-y-4">
            {formData.additionalInfo.map((info, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 items-start p-4 bg-[#13151f]/50 border border-[#1a1d2e] rounded-xl relative group">
                <div className="w-full sm:w-1/3 space-y-2">
                  <label className="text-xs text-[#94a3b8] uppercase tracking-widest">Header</label>
                  <input required type="text"
                    value={info.header}
                    onChange={e => handleInfoChange(index, 'header', e.target.value)}
                    className="w-full bg-[#0a0b10] border border-[#1a1d2e] rounded-md p-2 text-[#f8fafc] text-sm focus:border-[#d4af37] outline-none"
                    placeholder="e.g., Venue"
                  />
                </div>
                <div className="w-full sm:w-2/3 space-y-2">
                  <label className="text-xs text-[#94a3b8] uppercase tracking-widest">Description</label>
                  <textarea required
                    value={info.description}
                    onChange={e => handleInfoChange(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full bg-[#0a0b10] border border-[#1a1d2e] rounded-md p-2 text-[#f8fafc] text-sm focus:border-[#d4af37] outline-none resize-none"
                    placeholder="Detail the information..."
                  />
                </div>
                {formData.additionalInfo.length > 1 && (
                  <button type="button" onClick={() => handleRemoveField(index)}
                    className="absolute -right-2 -top-2 bg-[#1a1d2e] bg-opacity-80 p-1.5 rounded-full border border-[#d4af37]/30 text-red-400 hover:text-red-300 hover:bg-[#1a1d2e] transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button type="button" onClick={handleAddField}
            className="flex items-center gap-2 text-sm text-[#d4af37] hover:text-[#ffd700] hover:underline transition-all"
          >
            <Plus className="w-4 h-4" /> Add Additional Info
          </button>
        </section>

        {/* Style Customization Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1a1d2e] pb-3">
            <h3 className="text-xl font-playfair text-[#f8fafc] tracking-wide">IV. Aesthetic Customizations</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-[#94a3b8] uppercase tracking-wider font-medium">Text Color</label>
              <div className="flex items-center gap-2 border border-[#1a1d2e] bg-[#13151f] rounded-lg p-2">
                <input type="color" 
                  value={formData.style.textColor}
                  onChange={e => setFormData(prev => ({ ...prev, style: { ...prev.style, textColor: e.target.value } }))}
                  className="w-8 h-8 rounded shrink-0 cursor-pointer overflow-hidden bg-transparent border-0 p-0"
                />
                <span className="text-xs text-[#94a3b8] font-mono uppercase">{formData.style.textColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#94a3b8] uppercase tracking-wider font-medium">BG Color</label>
              <div className="flex items-center gap-2 border border-[#1a1d2e] bg-[#13151f] rounded-lg p-2">
                <input type="color" 
                  value={formData.style.bgColor}
                  onChange={e => setFormData(prev => ({ ...prev, style: { ...prev.style, bgColor: e.target.value } }))}
                  className="w-8 h-8 rounded shrink-0 cursor-pointer overflow-hidden bg-transparent border-0 p-0"
                />
                <span className="text-xs text-[#94a3b8] font-mono uppercase">{formData.style.bgColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#94a3b8] uppercase tracking-wider font-medium">Font Family</label>
              <select 
                value={formData.style.fontFamily}
                onChange={e => setFormData(prev => ({ ...prev, style: { ...prev.style, fontFamily: e.target.value } }))}
                className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-lg p-3.5 text-sm text-[#f8fafc] focus:border-[#d4af37] outline-none"
              >
                <option value="var(--font-playfair)">Playfair Display (Royal)</option>
                <option value="var(--font-inter)">Inter (Modern)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#94a3b8] uppercase tracking-wider font-medium">Font Size (Base)</label>
              <select 
                value={formData.style.fontSize}
                onChange={e => setFormData(prev => ({ ...prev, style: { ...prev.style, fontSize: e.target.value } }))}
                className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-lg p-3.5 text-sm text-[#f8fafc] focus:border-[#d4af37] outline-none"
              >
                <option value="text-sm">Small</option>
                <option value="text-base">Medium</option>
                <option value="text-lg">Large</option>
                <option value="text-xl">Grand</option>
              </select>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-6 border-t border-[#1a1d2e]">
          <button 
            type="submit"
            className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[#d4af37] to-[#ffd700] hover:from-[#ffd700] hover:to-[#ffd700] text-[#0a0b10] text-lg font-playfair tracking-widest uppercase font-bold rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 mx-auto block"
          >
            Forge Endpoint
          </button>
        </div>
      </form>
    </div>
  );
}
