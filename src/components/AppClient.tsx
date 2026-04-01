'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { decodeConfig } from '@/lib/utils';
import EventForm from './EventForm';
import CountdownView from './CountdownView';
import { LoadingSpinner } from './LoadingSpinner';

export default function AppClient() {
  const searchParams = useSearchParams();
  const dataQuery = searchParams.get('data');
  const [config, setConfig] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (dataQuery) {
      const decoded = decodeConfig(dataQuery);
      if (decoded) {
        setConfig(decoded);
      }
    }
    setIsInitializing(false);
  }, [dataQuery]);

  if (isInitializing) {
    return <LoadingSpinner />;
  }

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
