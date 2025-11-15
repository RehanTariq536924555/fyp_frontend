
// Common animation configurations for framer-motion
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 }
};

export const slideIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3 }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

// Function to apply intersection observer for animations
export const createScrollObserver = (
  targetRef: React.RefObject<HTMLElement>, 
  callback: (isIntersecting: boolean) => void
) => {
  if (typeof window === 'undefined' || !window.IntersectionObserver) return;
  
  const observer = new IntersectionObserver(
    ([entry]) => {
      callback(entry.isIntersecting);
    },
    { threshold: 0.15 }
  );
  
  if (targetRef.current) {
    observer.observe(targetRef.current);
  }
  
  return () => {
    if (targetRef.current) {
      observer.unobserve(targetRef.current);
    }
  };
};
