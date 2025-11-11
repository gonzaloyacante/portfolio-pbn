'use client';

import { useEffect, useRef, useState } from 'react';
import { Monitor, Smartphone, Tablet, Maximize2, RefreshCw } from 'lucide-react';
import { Button } from './form-components';

interface LivePreviewProps {
  url?: string;
  designSettings?: any;
}

export default function LivePreview({ url = '/', designSettings }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Inject design settings into iframe
  useEffect(() => {
    if (!iframeRef.current || !designSettings) return;

    const iframe = iframeRef.current;
    const iframeWindow = iframe.contentWindow;

    if (!iframeWindow) return;

    // Wait for iframe to load
    const handleLoad = () => {
      const doc = iframeWindow.document;
      if (!doc || !doc.documentElement) return;

      // Inject CSS variables
      const root = doc.documentElement;
      
      if (designSettings.primaryColor) root.style.setProperty('--cms-primary-color', designSettings.primaryColor);
      if (designSettings.secondaryColor) root.style.setProperty('--cms-secondary-color', designSettings.secondaryColor);
      if (designSettings.backgroundColor) root.style.setProperty('--cms-background-color', designSettings.backgroundColor);
      if (designSettings.textColor) root.style.setProperty('--cms-text-color', designSettings.textColor);
      if (designSettings.accentColor) root.style.setProperty('--cms-accent-color', designSettings.accentColor);
      if (designSettings.headingFont) root.style.setProperty('--cms-heading-font', designSettings.headingFont);
      if (designSettings.bodyFont) root.style.setProperty('--cms-body-font', designSettings.bodyFont);
      if (designSettings.headingSize) root.style.setProperty('--cms-heading-size', designSettings.headingSize);
      if (designSettings.bodySize) root.style.setProperty('--cms-body-size', designSettings.bodySize);
      if (designSettings.lineHeight) root.style.setProperty('--cms-line-height', designSettings.lineHeight);
      if (designSettings.containerMaxWidth) root.style.setProperty('--cms-container-max-width', designSettings.containerMaxWidth);
      if (designSettings.sectionPadding) root.style.setProperty('--cms-section-padding', designSettings.sectionPadding);
      if (designSettings.elementSpacing) root.style.setProperty('--cms-element-spacing', designSettings.elementSpacing);
      if (designSettings.borderRadius) root.style.setProperty('--cms-border-radius', designSettings.borderRadius);
      if (designSettings.boxShadow) root.style.setProperty('--cms-box-shadow', designSettings.boxShadow);
      if (designSettings.hoverTransform) root.style.setProperty('--cms-hover-transform', designSettings.hoverTransform);
      if (designSettings.transitionSpeed) root.style.setProperty('--cms-transition-speed', designSettings.transitionSpeed);
    };

    iframe.addEventListener('load', handleLoad);
    
    // If already loaded, inject immediately
    if (iframe.contentDocument?.readyState === 'complete') {
      handleLoad();
    }

    return () => iframe.removeEventListener('load', handleLoad);
  }, [designSettings]);

  const handleRefresh = () => {
    if (!iframeRef.current) return;
    setIsRefreshing(true);
    iframeRef.current.src = iframeRef.current.src;
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleFullscreen = () => {
    if (!iframeRef.current) return;
    iframeRef.current.requestFullscreen();
  };

  const deviceSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' },
  };

  const currentSize = deviceSizes[device];

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <Button
            variant={device === 'desktop' ? 'primary' : 'outline'}
            onClick={() => setDevice('desktop')}
            size="sm"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={device === 'tablet' ? 'primary' : 'outline'}
            onClick={() => setDevice('tablet')}
            size="sm"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={device === 'mobile' ? 'primary' : 'outline'}
            onClick={() => setDevice('mobile')}
            size="sm"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-400 font-mono">
            {currentSize.width} × {currentSize.height}
          </span>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            onClick={handleFullscreen}
            size="sm"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-4 bg-neutral-100 dark:bg-neutral-900">
        <div
          className="bg-white dark:bg-neutral-800 shadow-2xl transition-all duration-300"
          style={{
            width: currentSize.width,
            height: currentSize.height,
            maxWidth: '100%',
            borderRadius: device === 'mobile' ? '2rem' : '0.5rem',
          }}
        >
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full"
            style={{
              border: 'none',
              borderRadius: device === 'mobile' ? '2rem' : '0.5rem',
            }}
            title="Live Preview"
          />
        </div>
      </div>
    </div>
  );
}
