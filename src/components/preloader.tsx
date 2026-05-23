'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function AppPreloader({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // 🚫 Prevent server/client mismatch
  if (!mounted) return null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[99999] flex items-center justify-center bg-background transition-opacity duration-500",
          loading ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="heart-rate">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="150px"
            height="73px"
            viewBox="0 0 150 73"
            xmlSpace="preserve"
          >
            <polyline
              fill="none"
              strokeWidth="3"
              strokeMiterlimit="10"
              points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
            />
          </svg>
          <div className="fade-in" />
          <div className="fade-out" />
        </div>
      </div>

      {!loading && children}
    </>
  );
}
