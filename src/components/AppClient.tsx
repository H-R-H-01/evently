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

export default function AppClient() {
  const searchParams = useSearchParams();
  const dataQuery = searchParams.get('data');
  const builderQuery = searchParams.get('builder');
  const themeQuery = searchParams.get('theme');
  
  const [isMounted, setIsMounted] = useState(false);
  const [activeBuilder, setActiveBuilder] = useState<'home' | 'countdown' | 'invitation'>('home');

  useEffect(() => {
    setIsMounted(true);
    if (builderQuery === 'countdown') setActiveBuilder('countdown');
    if (builderQuery === 'invitation') setActiveBuilder('invitation');
  }, [builderQuery]);

  if (!isMounted) {
    return <LoadingSpinner />;
  }

  const config = dataQuery ? (decodeConfig(dataQuery) as AnyConfig) : null;

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

  return <HomeTiles onSelect={setActiveBuilder} />;
}
