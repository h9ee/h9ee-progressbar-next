'use client';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import DefaultBar from './ProgressBar';

interface ProgressBarProviderProps {
  children: React.ReactNode;
  /** Custom progress bar component to use (if provided). */
  customBar?: React.ComponentType<any> | React.ReactElement;
  /** Color of the default progress bar (ignored if customBar is used). */
  color?: string;
  /** Height of the default progress bar in CSS units (ignored if customBar is used). */
  height?: string;
}

const ProgressBarProvider: React.FC<ProgressBarProviderProps> = ({
  children,
  customBar,
  color,
  height
}) => {
  // Track loading state and progress percentage
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [barVisible, setBarVisible] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get current route pathname (and search params) to detect changes
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPath = useRef<string | null>(null);

  // Effect: detect route changes via pathname changes (App Router):contentReference[oaicite:3]{index=3}
  useEffect(() => {
    if (prevPath.current !== null && prevPath.current !== pathname) {
      // Pathname changed, meaning navigation is complete
      setIsLoading(false);
    }
    prevPath.current = pathname;
  }, [pathname, searchParams]);

  // Effect: global click handler to catch navigation link clicks and start the bar
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;
      // Only trigger for internal navigation links
      const href = anchor.getAttribute('href');
      if (!href) return;
      if (anchor.target && anchor.target !== '_self') return;           // ignore new tab/window
      if (href.startsWith('#')) return;                                 // ignore same-page anchors
      // Create a URL to check origin and path
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;                // ignore external links
      const currentPath = window.location.pathname + window.location.search;
      if (url.pathname + url.search === currentPath) return;            // ignore links to the current page
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; // ignore modified clicks
      // If we reach here, it's an internal client-side navigation
      setIsLoading(true);
    };
    document.addEventListener('click', handleLinkClick);
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  // Effect: manage progress bar appearance based on isLoading state
  useEffect(() => {
    if (isLoading) {
      // Navigation started: show the bar and begin progress animation
      setBarVisible(true);
      setProgress(10); // start at 10%
      // Gradually increase progress until ~90%
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          // Increase by a random step to simulate progress, up to a cap
          const nextProgress = prev + Math.random() * 10;
          return nextProgress < 90 ? nextProgress : 90;
        });
      }, 200);
    } else {
      // Navigation completed: finish progress and hide the bar
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setProgress(100); // fill the bar to 100%
      // After a short delay, hide the bar (allows the 100% width to be seen)
      const timeout = setTimeout(() => {
        setBarVisible(false);
        setProgress(0); // reset for next navigation
      }, 300);
      return () => {
        clearTimeout(timeout);
      };
    }
    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLoading]);

  return (
    <>
      {children}
      {barVisible && (
        // Render custom bar if provided, otherwise the default bar
        customBar
          ? (React.isValidElement(customBar)
              ? customBar
              : React.createElement(customBar as React.ComponentType<any>))
          : <DefaultBar progress={progress} color={color} height={height} />
      )}
    </>
  );
};

export default ProgressBarProvider;
