'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, Timestamp, addDoc } from 'firebase/firestore';
import { ExternalLink, Edit2, Clock, Plus, Settings, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface WebsiteData {
  id: string;
  config: any;
  type: 'invitation' | 'countdown';
  themeId: string;
  title: string;
  createdAt: string;
  expiresAt: string;
  editCount: number;
}

export default function UserDashboard({ onNavigate }: { onNavigate?: (target: string) => void }) {
  const { user, userData, logout } = useAuth();
  const [websites, setWebsites] = useState<WebsiteData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchWebsites = async () => {
      try {
        const q = query(collection(db, 'websites'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const sites: WebsiteData[] = [];
        querySnapshot.forEach((doc) => {
          sites.push({ id: doc.id, ...doc.data() } as WebsiteData);
        });
        // Sort by created descending
        sites.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setWebsites(sites);
      } catch (error) {
        console.error("Error fetching websites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b10] text-white">
        <div className="text-center">
           <h2 className="text-2xl font-playfair mb-4">You need to log in</h2>
           <button onClick={() => window.location.href = '/'} className="px-6 py-2 bg-blue-500 rounded-md">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050a] text-white p-6 lg:p-12 font-sans selection:bg-[#4db8ff]/30">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-4xl font-playfair mb-2">My Endpoints</h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase">Welcome back, {userData?.displayName || user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            {onNavigate && (
              <button 
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-lg text-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> New Website
              </button>
            )}
            {userData?.role === 'admin' && onNavigate && (
              <button 
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:border-purple-500/40 rounded-lg text-sm transition-colors"
              >
                <Settings className="w-4 h-4" /> Admin
              </button>
            )}
            <button 
              onClick={logout}
              className="text-xs text-gray-500 hover:text-red-400 uppercase tracking-widest font-bold transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Websites List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-[#4db8ff] border-t-transparent animate-spin" />
          </div>
        ) : websites.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <p className="text-gray-400 mb-6">You haven't created any websites yet.</p>
            {onNavigate && (
               <button onClick={() => onNavigate('home')} className="px-6 py-3 bg-[#4db8ff] text-black font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-[#3ba0e6]">
                  Create Your First
               </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map(site => {
              const expiresDate = new Date(site.expiresAt);
              const isExpired = expiresDate.getTime() < Date.now();
              const daysLeft = Math.max(0, Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
              
              return (
                <div key={site.id} className="bg-[#13151f] border border-[#1a1d2e] rounded-xl p-6 relative group overflow-hidden flex flex-col">
                  {/* Expiration Indicator */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${isExpired ? 'bg-red-500' : daysLeft < 5 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#4db8ff] bg-[#4db8ff]/10 px-2 py-1 rounded">
                      {site.type} • {site.themeId?.replace('_', ' ')}
                    </span>
                    {isExpired && (
                       <span className="flex items-center gap-1 text-[10px] text-red-400 font-bold uppercase tracking-widest">
                         <AlertTriangle className="w-3 h-3" /> Expired
                       </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-playfair mb-2 truncate" title={site.title}>{site.title || 'Untitled Event'}</h3>
                  
                  <div className="space-y-2 mt-auto pt-6 mb-6 text-xs text-gray-500 font-mono">
                    <div className="flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5" /> Created: {format(new Date(site.createdAt), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5" /> Expires: {format(expiresDate, 'MMM dd, yyyy')} ({daysLeft} days left)
                    </div>
                    <div className="flex items-center gap-2">
                       <Edit2 className="w-3.5 h-3.5" /> Edits Used: {site.editCount} / 2 (Free)
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    {!isExpired ? (
                       <a 
                         href={`/?id=${site.id}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-widest border border-white/5 transition-colors"
                       >
                         <ExternalLink className="w-3.5 h-3.5" /> View
                       </a>
                    ) : (
                       <button 
                         disabled
                         className="flex items-center justify-center gap-2 py-2.5 bg-white/5 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest border border-transparent cursor-not-allowed"
                       >
                         <ExternalLink className="w-3.5 h-3.5" /> View
                       </button>
                    )}
                    
                    {onNavigate && (
                       <button 
                         onClick={() => {
                           // Navigate to builder with this ID to edit
                           window.location.href = `/?builder=${site.type}&edit=${site.id}`;
                         }}
                         className="flex items-center justify-center gap-2 py-2.5 border border-[#4db8ff]/50 text-[#4db8ff] hover:bg-[#4db8ff]/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
                       >
                         <Edit2 className="w-3.5 h-3.5" /> Edit
                       </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
