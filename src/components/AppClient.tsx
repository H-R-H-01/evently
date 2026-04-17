'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { decodeConfig } from '../lib/utils';
import EventForm from './EventForm';
import CountdownView from './CountdownView';
import HomeTiles from './HomeTiles';
import InvitationBuilder from './InvitationBuilder';
import InvitationView from './InvitationView';
import { LoadingSpinner } from './LoadingSpinner';
import type { AnyConfig, EventConfig, InvitationConfig } from '../lib/types';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

export default function AppClient() {
  const searchParams = useSearchParams();
  const dataQuery = searchParams.get('data');
  const builderQuery = searchParams.get('builder');
  const themeQuery = searchParams.get('theme');
  const idQuery = searchParams.get('id');
  
  const [isMounted, setIsMounted] = useState(false);
  const [activeBuilder, setActiveBuilder] = useState<'home' | 'countdown' | 'invitation' | 'dashboard' | 'admin'>('home');
  const [dbConfig, setDbConfig] = useState<AnyConfig | null>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(!!idQuery);

  useEffect(() => {
    setIsMounted(true);
    if (builderQuery === 'countdown') setActiveBuilder('countdown');
    if (builderQuery === 'invitation') setActiveBuilder('invitation');
    if (builderQuery === 'dashboard') setActiveBuilder('dashboard');
    if (builderQuery === 'admin') setActiveBuilder('admin');

    if (idQuery) {
      const fetchWebsite = async () => {
        try {
          const docRef = doc(db, 'websites', idQuery);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const expiresAt = new Date(data.expiresAt);
            if (expiresAt.getTime() < Date.now()) {
              alert('This event endpoint has expired.');
              setActiveBuilder(data.type as typeof activeBuilder);
            } else {
              setDbConfig(data.config);
            }
          } else {
            alert('Website not found.');
          }
        } catch (err) {
          console.error("Error fetching site", err);
        } finally {
          setIsLoadingDb(false);
        }
      };
      fetchWebsite();
    }
  }, [builderQuery, idQuery]);

  if (!isMounted || isLoadingDb) {
    return <LoadingSpinner />;
  }

  const config = dbConfig || (dataQuery ? (decodeConfig(dataQuery) as AnyConfig) : null);

  if (config) {
    if (config.type === 'invitation') {
      return <InvitationView config={config as InvitationConfig} />;
    } else {
      return <CountdownView config={config as EventConfig} />;
    }
  }

  if (activeBuilder === 'countdown') {
    return <EventForm onBack={() => setActiveBuilder('home')} />;
  }

  if (activeBuilder === 'invitation') {
    return <InvitationBuilder 
      onBack={() => setActiveBuilder('home')} 
      initialThemeId={themeQuery || undefined} 
    />;
  }

  if (activeBuilder === 'dashboard') {
    return <UserDashboard onNavigate={(t) => setActiveBuilder(t as any)} />;
  }

  if (activeBuilder === 'admin') {
    return <AdminDashboard onBack={() => setActiveBuilder('home')} />;
  }

  return <HomeTiles onSelect={(t) => setActiveBuilder(t as any)} />;
}
