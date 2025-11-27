import React from 'react';
import { Link } from 'react-router-dom';

const NeedHelpSection = ({
  title = 'Need Help Choosing',
  highlightText = '?',
  description,
  primaryCtaLabel = 'Custom Design',
  primaryCtaHref = '/custom',
  primaryCtaProps = {},
  secondaryCta,
  className = 'py-16 md:py-20 bg-black text-white',
  wrapperClassName = 'max-w-4xl mx-auto text-center px-4 md:px-6',
  titleClassName = 'text-3xl md:text-4xl lg:text-5xl font-sorts-mill-gloudy mb-6 md:mb-8',
  descriptionClassName = 'text-base md:text-lg lg:text-xl font-montserrat-regular-400 text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto px-4',
  actionsWrapperClassName = 'flex flex-col sm:flex-row gap-4 md:gap-6 justify-center',
}) => {
  return (
    <section className={className}>
      <div className={wrapperClassName}>
        <h2 className={titleClassName}>
          {title}
          {highlightText && (
            <span className="text-primary">
              {highlightText}
            </span>
          )}
        </h2>
        {description && (
          <p className={descriptionClassName}>
            {description}
          </p>
        )}

        <div className={actionsWrapperClassName}>
          {primaryCtaLabel && (
            <Link
              to={primaryCtaHref}
              className="px-6 md:px-10 py-3 md:py-4 bg-primary text-white font-montserrat-medium-500 hover:bg-primary-dark transition-colors duration-300 rounded-lg text-base md:text-lg"
              {...primaryCtaProps}
            >
              {primaryCtaLabel}
            </Link>
          )}
          {secondaryCta}
        </div>
      </div>
    </section>
  );
};

export default NeedHelpSection;


