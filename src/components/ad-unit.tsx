'use client';

import { useEffect, useRef } from 'react';

// A unique key is needed if you render this component multiple times on the same page.
export const AdUnit = ({ adKey }: { adKey: string }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if scripts are already there to prevent duplication on re-renders
    if (adContainerRef.current && adContainerRef.current.children.length === 0) {
      const scriptContainer = document.createElement('div');
      scriptContainer.setAttribute('key', adKey);

      const optionsScript = document.createElement('script');
      optionsScript.innerHTML = `atOptions = { 'key' : '776d2d1dc730da4da753c518c38c4243', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };`;
      
      const invokeScript = document.createElement('script');
      invokeScript.src = 'https://www.highperformanceformat.com/776d2d1dc730da4da753c518c38c4243/invoke.js';
      invokeScript.async = true;

      // Append scripts to the ref'd div
      scriptContainer.appendChild(optionsScript);
      scriptContainer.appendChild(invokeScript);
      adContainerRef.current.appendChild(scriptContainer);
    }
  }, [adKey]);

  return (
     <div className="w-full flex justify-center items-center h-[50px] my-4">
      <div ref={adContainerRef}></div>
    </div>
  );
};
