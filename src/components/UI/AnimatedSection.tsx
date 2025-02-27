
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-in-bottom' | 'slide-in-left' | 'slide-in-right' | 'scale-in';
  delay?: number;
  threshold?: number;
  once?: boolean;
}

const AnimatedSection = ({
  children,
  className,
  animation = 'fade-in',
  delay = 0,
  threshold = 0.2,
  once = true,
}: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setIsVisible(true);
          if (once) setHasAnimated(true);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once, hasAnimated]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        {
          'opacity-0': !isVisible,
          'opacity-100': isVisible,
          'translate-y-10': !isVisible && animation === 'fade-in',
          'translate-y-0': isVisible && animation === 'fade-in',
          'translate-y-20': !isVisible && animation === 'slide-in-bottom',
          'translate-y-0': isVisible && animation === 'slide-in-bottom',
          'translate-x-[-50px]': !isVisible && animation === 'slide-in-left',
          'translate-x-0': isVisible && animation === 'slide-in-left',
          'translate-x-[50px]': !isVisible && animation === 'slide-in-right',
          'translate-x-0': isVisible && animation === 'slide-in-right',
          'scale-95': !isVisible && animation === 'scale-in',
          'scale-100': isVisible && animation === 'scale-in',
        },
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
