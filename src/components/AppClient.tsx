'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { decodeConfig } from '@/lib/utils';
import EventForm from './EventForm';
import CountdownView from './CountdownView';
import { LoadingSpinner } from './LoadingSpinner';
import { EventConfig } from '@/lib/types';

export default function AppClient() {
  const searchParams = useSearchParams();
  const dataQuery = searchParams.get('data');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <LoadingSpinner />;
  }

  const config = dataQuery ? (decodeConfig(dataQuery) as EventConfig) : null;

  return (
    <>
      {config ? (
        <CountdownView config={config} />
      ) : (
        <EventForm />
      )}
    </>
  );
}
