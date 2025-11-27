import React from 'react';
import AnimatedSection from './home/AnimatedSection';

const CategoryHero = ({
  eyebrow = '',
  icon,
  title,
  highlightedWord,
  body = '',
  cta,
  backgroundImage,
  backgroundOverlay = 'rgba(0,0,0,0.35)',
  textColor = 'text-white',
  highlightColor = 'text-primary',
  dividerColor = 'bg-primary',
  className = '',
  contentWrapperClassName = '',
  animation = { type: 'fadeInUp', delay: 100 },
}) => {
  const renderTitle = () => {
    if (!title) return null;
    const [firstPart, ...rest] = title.split(highlightedWord || '');
    const secondPart = rest.join(highlightedWord || '');

    return (
      <h1 className={`text-2xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy leading-tight mb-3 md:mb-6 ${textColor}`}>
        {firstPart}
        {highlightedWord && (
          <span className={highlightColor}>{highlightedWord}</span>
        )}
        {secondPart}
      </h1>
    );
  };

  return (
    <AnimatedSection
    animationType={animation?.type || 'fadeInUp'}
    delay={animation?.delay || 0}
  >
    <section
      className={`relative py-8 md:py-16 lg:py-20 ${className}`}
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(${backgroundOverlay}, ${backgroundOverlay}), url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : undefined
      }
    >
      <div
        className={`max-w-6xl mx-auto px-4 md:px-6 text-center ${
          textColor?.includes('text-white') ? 'text-white' : 'text-black'
        } ${contentWrapperClassName}`}
      >
        {icon && (
          <div className={`inline-flex items-center justify-center w-20 h-20 ${textColor?.includes('text-white') ? 'bg-white/20' : 'bg-black/20'} rounded-full mb-6 backdrop-blur-sm`}>
            {icon}  
          </div>
        )}
        {eyebrow && (
          <p className="text-xs md:text-sm uppercase tracking-widest text-primary-primary font-montserrat-medium-500 mb-3 md:mb-4">
            {eyebrow}
          </p>
        )}

        {renderTitle()}

        {body && (
          <p className="text-sm md:text-lg lg:text-xl font-montserrat-regular-400 mb-4 md:mb-8 max-w-2xl mx-auto text-white px-2 md:px-4">
            {body}
          </p>
        )}

        <div className={`w-12 md:w-24 h-1 ${dividerColor} mx-auto`} />

        {cta}
      </div>
    </section>
  </AnimatedSection>
    // make dynamic
    // <AnimatedSection animationType="fadeInUp" delay={100}>
    //   <section className="py-8 md:py-16 lg:py-20 bg-secondary">
    //     <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
    //       <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-montserrat-medium-500 mb-3 md:mb-4">
    //         {eyebrow}
    //       </p>
    //       <h1 className="text-2xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy leading-tight mb-3 md:mb-6 text-black">
    //         {title}<span className="text-primary">.</span>
    //       </h1>
    //       <p className="text-sm md:text-lg lg:text-xl font-montserrat-regular-400 mb-4 md:mb-8 max-w-2xl mx-auto text-black-light px-2 md:px-4">
    //         {body}
    //       </p>
    //       <div className="w-12 md:w-24 h-1 bg-primary mx-auto"></div>
    //     </div>
    //   </section>
    // </AnimatedSection>
  );
};

export default CategoryHero;


