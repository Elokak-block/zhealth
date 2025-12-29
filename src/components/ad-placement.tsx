'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    ezstandalone: {
      cmd: any[];
      showAds: (...args: number[]) => void;
    };
  }
}

interface AdPlacementProps {
  placementId: number;
}

const AdPlacement = ({ placementId }: AdPlacementProps) => {
  useEffect(() => {
    if (window.ezstandalone && typeof window.ezstandalone.showAds === 'function') {
      try {
        window.ezstandalone.cmd.push(() => {
            window.ezstandalone.showAds(placementId);
        });
      } catch (error) {
        console.error(`Ezoic showAds failed for placement ${placementId}:`, error);
      }
    }
  }, [placementId]);

  return <div id={`ezoic-pub-ad-placeholder-${placementId}`} />;
};

export default AdPlacement;
