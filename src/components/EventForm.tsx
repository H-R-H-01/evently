'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Clock, Copy, Check, ChevronDown, ChevronUp, Sparkles, Image as ImageIcon } from 'lucide-react';
import { encodeConfig } from '../lib/utils';
import { addDays, format, isAfter, isBefore } from 'date-fns';
import { EventConfig, TextStyle, BoxStyle } from '../lib/types';
import CountdownView from './CountdownView';

const FONTS = [
  { label: 'Playfair Display (Royal)', value: 'var(--font-playfair)' },
  { label: 'Inter (Modern)', value: 'var(--font-inter)' }
];

const FONT_SIZES = [
  { label: 'Extra Small', value: '0.75rem' },
  { label: 'Small', value: '0.875rem' },
  { label: 'Base', value: '1rem' },
  { label: 'Large', value: '1.125rem' },
  { label: 'Extra Large', value: '1.5rem' },
  { label: '2XL', value: '2rem' },
  { label: '4XL', value: '3rem' },
  { label: '6XL', value: '4rem' },
  { label: '8XL', value: '6rem' }
];

const defaultText = (size: string, family: string, color: string, style = 'normal'): TextStyle => ({
  fontSize: size,
  fontFamily: family,
  color,
  fontStyle: style
});

const defaultBox = (bg: string, bgOp: number, border: string, borderOp: number, enabled = true): BoxStyle => ({
  enabled,
  backgroundColor: bg,
  backgroundOpacity: bgOp,
  borderColor: border,
  borderOpacity: borderOp
});

const THEMES = {
  royal_gold: {
    name: 'Royal Gold',
    bgColor: '#0a0b10',
    globalFontFamily: 'var(--font-playfair)',
    globalTextColor: '#ffd700',
    textStyles: {
      title: defaultText('4rem', 'var(--font-playfair)', '#ffd700'),
      preTitle: defaultText('1rem', 'var(--font-inter)', '#ffffff'),
      countdownNumbers: defaultText('6rem', 'var(--font-playfair)', '#ffd700'),
      countdownLabels: defaultText('1rem', 'var(--font-inter)', '#ffffff'),
      infoHeaders: defaultText('1.5rem', 'var(--font-playfair)', '#ffd700'),
      infoDescriptions: defaultText('1rem', 'var(--font-inter)', '#ffffff'),
      hostLabel: defaultText('0.875rem', 'var(--font-inter)', '#ffffff'),
      hostName: defaultText('1.5rem', 'var(--font-playfair)', '#ffd700'),
    },
    boxStyles: {
      countdown: defaultBox('#ffffff', 5, '#ffd700', 10),
      additionalInfo: defaultBox('#ffffff', 5, '#ffd700', 20)
    }
  },
  midnight_silver: {
    name: 'Midnight Silver',
    bgColor: '#05050a',
    globalFontFamily: 'var(--font-inter)',
    globalTextColor: '#e2e8f0',
    textStyles: {
      title: defaultText('4rem', 'var(--font-inter)', '#e2e8f0'),
      preTitle: defaultText('1rem', 'var(--font-inter)', '#94a3b8'),
      countdownNumbers: defaultText('6rem', 'var(--font-inter)', '#e2e8f0'),
      countdownLabels: defaultText('1rem', 'var(--font-inter)', '#94a3b8'),
      infoHeaders: defaultText('1.5rem', 'var(--font-inter)', '#e2e8f0'),
      infoDescriptions: defaultText('1rem', 'var(--font-inter)', '#94a3b8'),
      hostLabel: defaultText('0.875rem', 'var(--font-inter)', '#94a3b8'),
      hostName: defaultText('1.5rem', 'var(--font-inter)', '#e2e8f0'),
    },
    boxStyles: {
      countdown: defaultBox('#ffffff', 2, '#ffffff', 5),
      additionalInfo: defaultBox('#ffffff', 2, '#e2e8f0', 10)
    }
  },
  rose_elegance: {
    name: 'Rose Elegance',
    bgColor: '#1a1014',
    globalFontFamily: 'var(--font-playfair)',
    globalTextColor: '#f4a6b3',
    textStyles: {
      title: defaultText('4rem', 'var(--font-playfair)', '#f4a6b3'),
      preTitle: defaultText('1rem', 'var(--font-inter)', '#fce4e8'),
      countdownNumbers: defaultText('6rem', 'var(--font-playfair)', '#ffffff'),
      countdownLabels: defaultText('1rem', 'var(--font-inter)', '#fce4e8'),
      infoHeaders: defaultText('1.5rem', 'var(--font-playfair)', '#f4a6b3'),
      infoDescriptions: defaultText('1rem', 'var(--font-inter)', '#fce4e8'),
      hostLabel: defaultText('0.875rem', 'var(--font-inter)', '#fce4e8'),
      hostName: defaultText('1.5rem', 'var(--font-playfair)', '#f4a6b3'),
    },
    boxStyles: {
      countdown: defaultBox('#f4a6b3', 5, '#f4a6b3', 15),
      additionalInfo: defaultBox('#f4a6b3', 5, '#f4a6b3', 20)
    }
  },
  ocean_depth: {
    name: 'Ocean Depth',
    bgColor: '#000814',
    globalFontFamily: 'var(--font-inter)',
    globalTextColor: '#4db8ff',
    textStyles: {
      title: defaultText('4rem', 'var(--font-inter)', '#4db8ff'),
      preTitle: defaultText('1rem', 'var(--font-inter)', '#0066cc'),
      countdownNumbers: defaultText('6rem', 'var(--font-inter)', '#ffffff'),
      countdownLabels: defaultText('1rem', 'var(--font-inter)', '#0066cc'),
      infoHeaders: defaultText('1.5rem', 'var(--font-inter)', '#4db8ff'),
      infoDescriptions: defaultText('1rem', 'var(--font-inter)', '#ffffff'),
      hostLabel: defaultText('0.875rem', 'var(--font-inter)', '#0066cc'),
      hostName: defaultText('1.5rem', 'var(--font-inter)', '#4db8ff'),
    },
    boxStyles: {
      countdown: defaultBox('#0066cc', 10, '#4db8ff', 30),
      additionalInfo: defaultBox('#0066cc', 10, '#4db8ff', 20)
    }
  },
  neon_cyber: {
    name: 'Neon Cyber',
    bgColor: '#0c001a',
    globalFontFamily: 'var(--font-inter)',
    globalTextColor: '#ff00ff',
    textStyles: {
      title: defaultText('4rem', 'var(--font-inter)', '#ff00ff', 'italic'),
      preTitle: defaultText('1rem', 'var(--font-inter)', '#cc99ff'),
      countdownNumbers: defaultText('6rem', 'var(--font-inter)', '#00ffff'),
      countdownLabels: defaultText('1rem', 'var(--font-inter)', '#cc99ff'),
      infoHeaders: defaultText('1.5rem', 'var(--font-inter)', '#ff00ff'),
      infoDescriptions: defaultText('1rem', 'var(--font-inter)', '#cc99ff'),
      hostLabel: defaultText('0.875rem', 'var(--font-inter)', '#cc99ff'),
      hostName: defaultText('1.5rem', 'var(--font-inter)', '#00ffff'),
    },
    boxStyles: {
      countdown: defaultBox('#ff00ff', 5, '#00ffff', 40),
      additionalInfo: defaultBox('#ff00ff', 5, '#ff00ff', 40)
    }
  },
  emerald_forest: {
    name: 'Emerald Forest',
    bgColor: '#051a05',
    globalFontFamily: 'var(--font-playfair)',
    globalTextColor: '#66ff66',
    textStyles: {
      title: defaultText('4rem', 'var(--font-playfair)', '#66ff66'),
      preTitle: defaultText('1rem', 'var(--font-inter)', '#e6ffe6'),
      countdownNumbers: defaultText('6rem', 'var(--font-playfair)', '#ffffff'),
      countdownLabels: defaultText('1rem', 'var(--font-inter)', '#b3ffb3'),
      infoHeaders: defaultText('1.5rem', 'var(--font-playfair)', '#66ff66'),
      infoDescriptions: defaultText('1rem', 'var(--font-inter)', '#e6ffe6'),
      hostLabel: defaultText('0.875rem', 'var(--font-inter)', '#b3ffb3'),
      hostName: defaultText('1.5rem', 'var(--font-playfair)', '#ffffff'),
    },
    boxStyles: {
      countdown: defaultBox('#00ff00', 5, '#66ff66', 20),
      additionalInfo: defaultBox('#00ff00', 5, '#66ff66', 30)
    }
  }
};

type TextKey = keyof EventConfig['style']['textStyles'];

const TEXT_KEYS: { key: TextKey; label: string }[] = [
  { key: 'title', label: 'Event Title' },
  { key: 'preTitle', label: 'Pre-Title (Join us for)' },
  { key: 'countdownNumbers', label: 'Countdown Numbers' },
  { key: 'countdownLabels', label: 'Countdown Labels' },
  { key: 'infoHeaders', label: 'Extra Info Headers' },
  { key: 'infoDescriptions', label: 'Extra Info Descriptions' },
  { key: 'hostLabel', label: 'Host Label (Hosted by)' },
  { key: 'hostName', label: 'Host Name' },
];

export default function EventForm({ onBack }: { onBack?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
  
  // Date Limits
  const today = new Date();
  const maxDate = addDays(today, 31);
  const minDateStr = format(today, "yyyy-MM-dd'T'HH:mm");
  const maxDateStr = format(maxDate, "yyyy-MM-dd'T'HH:mm");

  const [formData, setFormData] = useState<EventConfig>({
    type: 'countdown',
    eventName: 'Royal Gala Celebration',
    eventDate: format(addDays(new Date(), 30), "yyyy-MM-dd'T'18:00"),
    timezone: 'UTC+0',
    userInfo: { name: 'Julian & Isabella', email: '', phoneCode: '+1', phone: '' },
    additionalInfo: [
      { header: 'Attire', description: 'Royal Black Tie' },
      { header: 'Valet', description: 'Complimentary parking at the main gate' }
    ],
    style: {
      theme: 'royal_gold',
      layout: 'classic',
      ...JSON.parse(JSON.stringify(THEMES['royal_gold']))
    },
    message: 'We are counting down to a moment that will change everything.',
    location: 'The Gilded Palace',
    news: [
      { date: 'Step 1', title: 'Grand Arrival', description: 'The gates open for our honored guests.' }
    ]
  });

  const [error, setError] = useState('');
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  // Common styles to update all at once
  const [commonStyle, setCommonStyle] = useState<TextStyle>({
    fontSize: '1rem',
    color: '#ffffff',
    fontStyle: 'normal',
    fontFamily: 'var(--font-playfair)'
  });

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

  const applyTheme = (themeKey: keyof typeof THEMES) => {
    const theme = THEMES[themeKey];
    setFormData(prev => ({
      ...prev,
      style: {
        ...prev.style,
        theme: themeKey,
        bgColor: theme.bgColor,
        globalFontFamily: theme.globalFontFamily,
        globalTextColor: theme.globalTextColor,
        textStyles: JSON.parse(JSON.stringify(theme.textStyles)), // deep copy
        boxStyles: JSON.parse(JSON.stringify(theme.boxStyles)) // deep copy
      }
    }));
  };

  const updateIndividualTextStyle = (key: TextKey, field: keyof TextStyle, value: string) => {
    setFormData(prev => ({
      ...prev,
      style: {
        ...prev.style,
        textStyles: {
          ...prev.style.textStyles,
          [key]: {
            ...prev.style.textStyles[key],
            [field]: value
          }
        }
      }
    }));
  };

  const applyCommonStyle = () => {
    setFormData(prev => {
      const newTextStyles = { ...prev.style.textStyles };
      (Object.keys(newTextStyles) as TextKey[]).forEach(key => {
        newTextStyles[key] = { ...commonStyle };
      });
      return {
        ...prev,
        style: {
          ...prev.style,
          textStyles: newTextStyles
        }
      };
    });
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

  const TextStyleEditor = ({ textStyle, onChange, label }: { textStyle: TextStyle, onChange: (field: keyof TextStyle, val: string) => void, label: string }) => (
    <div className="space-y-4 p-4 bg-[#13151f] rounded-lg border border-[#1a1d2e]">
      <h4 className="text-[#d4af37] text-sm tracking-wider uppercase mb-2 font-medium">{label}</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-[#94a3b8] uppercase">Color</label>
          <div className="flex items-center gap-2 border border-[#1a1d2e] bg-[#0a0b10] rounded p-1">
            <input type="color" 
              value={textStyle.color}
              onChange={e => onChange('color', e.target.value)}
              className="w-6 h-6 rounded shrink-0 cursor-pointer overflow-hidden bg-transparent border-0 p-0"
            />
            <span className="text-xs text-[#94a3b8] font-mono">{textStyle.color}</span>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[#94a3b8] uppercase">Size</label>
          <select 
            value={textStyle.fontSize}
            onChange={e => onChange('fontSize', e.target.value)}
            className="w-full bg-[#0a0b10] border border-[#1a1d2e] rounded p-1.5 text-xs text-[#f8fafc] outline-none"
          >
            {FONT_SIZES.map(f => (
              <option key={f.value} value={f.value}>{f.label} ({f.value})</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[#94a3b8] uppercase">Family</label>
          <select 
            value={textStyle.fontFamily}
            onChange={e => onChange('fontFamily', e.target.value)}
            className="w-full bg-[#0a0b10] border border-[#1a1d2e] rounded p-1.5 text-xs text-[#f8fafc] outline-none"
          >
            {FONTS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[#94a3b8] uppercase">Style</label>
          <select 
            value={textStyle.fontStyle}
            onChange={e => onChange('fontStyle', e.target.value)}
            className="w-full bg-[#0a0b10] border border-[#1a1d2e] rounded p-1.5 text-xs text-[#f8fafc] outline-none"
          >
            <option value="normal">Normal</option>
            <option value="italic">Italic</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0a0b10]">
      {/* LEFT COLUMN: Builder Form */}
      <div className={`w-full flex-shrink-0 ${generatedUrl ? 'lg:w-full flex flex-col items-center justify-center' : 'lg:w-[45%]'} h-screen overflow-y-auto scrollbar-hide bg-[#0a0b10] border-r border-[#1a1d2e] relative z-20`}>
        {generatedUrl ? (
          <div className="w-full max-w-2xl mx-auto glass-panel p-8 sm:p-12 mix-blend-normal rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-xl border border-[#d4af37]/30 m-6 mt-12 bg-[#0a0b10]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#d4af37]" />
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#13151f] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d4af37]/50 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <Check className="w-10 h-10 text-[#ffd700]" />
              </div>
              <h2 className="text-4xl font-playfair text-[#ffd700] mb-4 tracking-wide">Royal Endpoint Created</h2>
              <p className="text-[#94a3b8] text-lg font-light leading-relaxed">
                Your majestic countdown is ready to be shared.
              </p>
            </div>
            <div className="bg-[#13151f]/80 border border-[#1a1d2e] rounded-xl p-6 flex flex-col md:flex-row items-center gap-4 shadow-inner">
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
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
            <div className="mt-8 text-center">
              <button 
                onClick={() => setGeneratedUrl('')}
                className="text-[#94a3b8] hover:text-[#d4af37] transition-colors border-b border-transparent hover:border-[#d4af37] pb-1 uppercase tracking-widest text-sm"
              >
                Return to Editor
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-10 pb-32">
            <div className="mb-10 block lg:hidden">
              <h2 className="text-sm font-bold text-[#d4af37] tracking-widest uppercase mb-2">Live Preview Available Below</h2>
            </div>
            <div className="text-left mb-10">
              {onBack && (
                <button 
                  type="button" 
                  onClick={onBack}
                  className="flex items-center gap-2 mb-6 text-[#94a3b8] hover:text-[#d4af37] transition-all text-sm tracking-widest uppercase font-bold"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" /> Return to Hub
                </button>
              )}
              <h1 className="text-4xl font-playfair text-[#ffd700] mb-2 tracking-wider">
                Forge Event
              </h1>
              <div className="flex gap-4 mt-6 border-b border-[#1a1d2e]">
                <button type="button" onClick={() => setActiveTab('content')} className={`pb-2 text-xs uppercase tracking-widest font-bold ${activeTab === 'content' ? 'text-[#ffd700] border-b-2 border-[#ffd700]' : 'text-[#64748b]'}`}>Content</button>
                <button type="button" onClick={() => setActiveTab('style')} className={`pb-2 text-xs uppercase tracking-widest font-bold ${activeTab === 'style' ? 'text-[#ffd700] border-b-2 border-[#ffd700]' : 'text-[#64748b]'}`}>Style</button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-center text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {activeTab === 'content' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <section className="space-y-4">
                    <h3 className="text-lg font-playfair text-[#f8fafc] border-b border-[#1a1d2e] pb-2">Event Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-[#94a3b8] uppercase tracking-wider font-medium">Event Name</label>
                        <input required type="text"
                          value={formData.eventName}
                          onChange={e => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                          className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-lg p-3 text-[#ffd700] focus:border-[#d4af37] outline-none mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-[#94a3b8] uppercase tracking-wider font-medium flex items-center gap-1"><Calendar className="w-3 h-3"/> Date</label>
                          <input required type="datetime-local"
                            min={minDateStr}
                            max={maxDateStr}
                            value={formData.eventDate}
                            onChange={e => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                            className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-lg p-2 text-sm text-[#f8fafc] focus:border-[#d4af37] outline-none mt-1"
                            style={{ colorScheme: 'dark' }}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[#94a3b8] uppercase tracking-wider font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> Timezone</label>
                          <input type="text" readOnly value={formData.timezone}
                            className="w-full bg-[#0a0b10] border border-[#1a1d2e] rounded-lg p-2 text-sm text-[#94a3b8] mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-playfair text-[#f8fafc] border-b border-[#1a1d2e] pb-2">Host Details</h3>
                    <div>
                      <label className="text-xs text-[#94a3b8] uppercase tracking-wider font-medium">Host Name</label>
                      <input required type="text" value={formData.userInfo.name}
                        onChange={e => setFormData(prev => ({ ...prev, userInfo: { ...prev.userInfo, name: e.target.value } }))}
                        className="w-full bg-[#13151f] border border-[#1a1d2e] rounded-lg p-2 text-sm text-[#f8fafc] focus:border-[#d4af37] outline-none mt-1"
                      />
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-playfair text-[#f8fafc] border-b border-[#1a1d2e] pb-2">Additional Info Cards</h3>
                    <div className="space-y-3">
                      {formData.additionalInfo.map((info, index) => (
                        <div key={index} className="p-3 bg-[#13151f] border border-[#1a1d2e] rounded-lg relative group">
                          <input required type="text" value={info.header} onChange={e => handleInfoChange(index, 'header', e.target.value)}
                            className="w-full bg-transparent border-b border-[#1a1d2e] p-1 text-[#f8fafc] text-sm mb-2 outline-none" placeholder="Header"
                          />
                          <textarea required value={info.description} onChange={e => handleInfoChange(index, 'description', e.target.value)} rows={2}
                            className="w-full bg-[#0a0b10] border border-[#1a1d2e] rounded p-2 text-[#f8fafc] text-xs outline-none resize-none" placeholder="Description"
                          />
                          <button type="button" onClick={() => handleRemoveField(index)} className="absolute -right-2 -top-2 bg-[#1a1d2e] p-1 text-red-400 rounded-full border border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddField} className="text-xs text-[#d4af37] flex items-center gap-1 hover:underline">
                        <Plus className="w-3 h-3" /> Add Card
                      </button>
                    </div>
                  </section>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-xs text-[#94a3b8] uppercase font-bold">Countdown Layout</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setFormData(p => ({ ...p, style: { ...p.style, layout: 'classic' } }))} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.style.layout !== 'premium' ? 'bg-[#ffd700]/10 border-[#ffd700] text-[#ffd700]' : 'bg-[#13151f] border-[#1a1d2e] text-[#94a3b8]'}`}>
                        <Clock className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase">Basic Clock</span>
                      </button>
                      <button type="button" onClick={() => setFormData(p => ({ ...p, style: { ...p.style, layout: 'premium' } }))} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.style.layout === 'premium' ? 'bg-[#4db8ff]/10 border-[#4db8ff] text-[#4db8ff]' : 'bg-[#13151f] border-[#1a1d2e] text-[#94a3b8]'}`}>
                        <Sparkles className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase">StoryScroll</span>
                      </button>
                    </div>
                  </div>

                  {formData.style.layout === 'premium' && (
                    <div className="space-y-4 p-4 bg-[#ffd700]/5 border border-[#ffd700]/20 rounded-xl animate-in zoom-in-95 duration-300">
                      <h3 className="text-xs font-bold text-[#ffd700] flex items-center gap-2 uppercase tracking-widest italic mb-2">
                        <Sparkles className="w-4 h-4" /> StoryScroll Premium Fields
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-[#94a3b8] uppercase tracking-widest">Hero Image URL</label>
                          <div className="relative">
                            <input type="text" value={formData.heroImageUrl || ''} onChange={e => setFormData(p => ({ ...p, heroImageUrl: e.target.value }))} placeholder="Direct image link" className="w-full bg-[#0a0b10] border border-white/10 rounded p-2.5 text-xs text-white pl-9 outline-none focus:border-[#ffd700]" />
                            <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-[#94a3b8] uppercase tracking-widest">Personal Message</label>
                          <textarea value={formData.message || ''} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} placeholder="Share a few words..." className="w-full bg-[#0a0b10] border border-white/10 rounded p-2.5 text-xs text-white min-h-[80px] outline-none focus:border-[#ffd700]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-[#94a3b8] uppercase tracking-widest">Location Name</label>
                          <input type="text" value={formData.location || ''} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Grand Terrace" className="w-full bg-[#0a0b10] border border-white/10 rounded p-2.5 text-xs text-white outline-none focus:border-[#ffd700]" />
                        </div>
                        
                        <div className="pt-4 border-t border-white/10">
                           <div className="flex justify-between items-center mb-4">
                              <label className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-widest">Event Milestones</label>
                              <button type="button" onClick={() => setFormData(p => ({ ...p, news: [...(p.news || []), { date: '', title: '', description: '' }] }))} className="text-[10px] bg-[#ffd700] text-black px-2 py-1 rounded font-bold hover:scale-105 transition-transform flex items-center gap-1">
                                <Plus className="w-3 h-3" /> Add
                              </button>
                           </div>
                           <div className="space-y-3">
                              {(formData.news || []).map((item, idx) => (
                                <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-2 relative group">
                                  <button type="button" onClick={() => setFormData(p => ({ ...p, news: (p.news || []).filter((_, i) => i !== idx) }))} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                  <input type="text" value={item.date} onChange={e => setFormData(p => ({ ...p, news: (p.news || []).map((n, i) => i === idx ? { ...n, date: e.target.value } : n) }))} placeholder="Date/Time" className="w-full bg-transparent border-b border-white/10 p-1 text-[10px] text-[#ffd700] outline-none" />
                                  <input type="text" value={item.title} onChange={e => setFormData(p => ({ ...p, news: (p.news || []).map((n, i) => i === idx ? { ...n, title: e.target.value } : n) }))} placeholder="Title" className="w-full bg-transparent border-b border-white/10 p-1 text-xs text-white outline-none" />
                                  <textarea value={item.description} onChange={e => setFormData(p => ({ ...p, news: (p.news || []).map((n, i) => i === idx ? { ...n, description: e.target.value } : n) }))} placeholder="Description" className="w-full bg-transparent p-1 text-[10px] text-gray-500 outline-none" />
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs text-[#94a3b8] uppercase font-bold">Theme & Style</label>
                    <div className="grid grid-cols-3 gap-2">
                       {Object.entries(THEMES).map(([id, theme]) => (
                         <button key={id} type="button" onClick={() => applyTheme(id as keyof typeof THEMES)} className={`p-2 rounded border text-[10px] text-center transition-all ${formData.style.theme === id ? 'border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]' : 'border-[#1a1d2e] bg-[#13151f] text-[#94a3b8]'}`}>
                            {theme.name}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs text-[#94a3b8] uppercase font-bold">Individual Text Elements</label>
                    <div className="space-y-2">
                      {TEXT_KEYS.map(({ key, label }) => (
                        <div key={key} className="border border-[#1a1d2e] rounded-lg overflow-hidden bg-[#0a0b10]">
                          <button type="button" onClick={() => setActiveAccordion(activeAccordion === key ? null : key)} className="w-full flex justify-between items-center p-3 text-sm text-white hover:bg-[#13151f] transition-colors">
                            {label}
                            {activeAccordion === key ? <ChevronUp className="w-4 h-4 text-[#ffd700]" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                          </button>
                          {activeAccordion === key && (
                             <TextStyleEditor textStyle={formData.style.textStyles[key]} onChange={(f, v) => updateIndividualTextStyle(key, f, v)} label={label} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="fixed bottom-0 left-0 w-full lg:w-[45%] p-4 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10] to-transparent z-40">
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-[#0a0b10] text-sm font-bold uppercase tracking-widest rounded-lg shadow-xl hover:-translate-y-1 transition-transform transform active:scale-95">
                  Create Royal Countdown
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Live Preview */}
      {!generatedUrl && (
        <div className="w-full lg:flex-1 h-screen overflow-hidden bg-black relative border-l border-[#1a1d2e] z-10">
          <div className="absolute top-4 right-4 z-50 bg-black/60 border border-[#1a1d2e] px-4 py-1.5 rounded-full text-xs font-mono text-[#ffd700] backdrop-blur flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            LIVE PREVIEW
          </div>
          <CountdownView config={formData} />
        </div>
      )}
    </div>
  );
}
