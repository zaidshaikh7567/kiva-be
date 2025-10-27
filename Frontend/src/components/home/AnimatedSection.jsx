import React, { useEffect, useRef, useState } from 'react';

const AnimatedSection = ({ children, animationType = 'fadeIn', delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  const getAnimationClass = () => {
    if (!isVisible) return 'pre-animate';
    
    const animationMap = {
      'fadeIn': 'animate-fadeIn',
      'fadeInUp': 'animate-fadeInUp',
      'fadeInDown': 'animate-fadeInDown',
      'fadeInLeft': 'animate-fadeInLeft',
      'fadeInRight': 'animate-fadeInRight',
      'scaleIn': 'animate-scaleIn',
      'rotateIn': 'animate-rotateIn',
    };
    
    return animationMap[animationType] || 'animate-fadeIn';
  };
  
  return (
    <div 
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
