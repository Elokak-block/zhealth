'use client';

import Script from 'next/script';

// A unique key is needed if you render this component multiple times on the same page.
export const AdUnit = ({ adKey }: { adKey: string }) => {
  return (
    <div className="w-full flex justify-center items-center h-[50px] my-4">
      <div key={adKey}>
        <Script id={`ad-options-${adKey}`} strategy="lazyOnload">
          {`atOptions = { 'key' : '776d2d1dc730da4da753c518c38c4243', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };`}
        </Script>
        <Script
          src="https://www.highperformanceformat.com/776d2d1dc730da4da753c518c38c4243/invoke.js"
          strategy="lazyOnload"
        />
      </div>
    </div>
  );
};
