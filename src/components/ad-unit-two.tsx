'use client';

import { useEffect } from 'react';

// A unique key is needed if you render this component multiple times on the same page.
export const AdUnitTwo = ({ adKey }: { adKey: string }) => {
  useEffect(() => {
    // Check if the script has already been added by checking for a marker
    const containerId = `ad-container-${adKey}`;
    const adContainer = document.getElementById(containerId);

    if (!adContainer || adContainer.dataset.loaded) {
      return;
    }

    // Set a marker to indicate the script is loaded for this ad key
    adContainer.dataset.loaded = 'true';
    adContainer.innerHTML = ''; // Clear previous content if any

    const optionsScript = document.createElement('script');
    optionsScript.innerHTML = `atOptions = { 'key' : '8aea7caad346eb9be54d1a490f93fece', 'format' : 'iframe', 'height' : 60, 'width' : 468, 'params' : {} };`;
    
    const invokeScript = document.createElement('script');
    invokeScript.src = 'https://www.highperformanceformat.com/8aea7caad346eb9be54d1a490f93fece/invoke.js';
    invokeScript.async = true;

    adContainer.appendChild(optionsScript);
    adContainer.appendChild(invokeScript);

  }, [adKey]);

  return (
    <div className="w-full flex justify-center items-center h-[60px] my-4">
      <div id={`ad-container-${adKey}`} key={adKey}></div>
    </div>
  );
};
