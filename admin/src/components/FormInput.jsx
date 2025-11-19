import React from 'react';

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onKeyDown,
  onPaste,
  placeholder,
  error,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  rightIconClickable = false,
  className = '',
  disabled = false,
  required = false,
  inputMode,
  maxLength,
  minLength,
  textarea = false,
  rows,
  cols,
  ...rest
}) => {
  const inputId = `input-${name}`;
  
  // Determine padding based on icons
  const getPaddingClasses = () => {
    let paddingLeft = 'pl-3 sm:pl-4';
    let paddingRight = 'pr-3 sm:pr-4';
    
    if (Icon && !textarea) {
      paddingLeft = 'pl-10 sm:pl-11';
    }
    
    if (RightIcon && !textarea) {
      paddingRight = 'pr-10 sm:pr-11';
    }
    
    return `${paddingLeft} ${paddingRight}`;
  };
  
  // Base input classes
  const baseInputClasses = `w-full py-2.5 sm:py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 text-sm sm:text-base text-black transition-colors ${
    textarea ? 'resize-none' : ''
  } ${
    error 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-primary-light focus:ring-primary focus:border-primary'
  } ${getPaddingClasses()} ${className}`;

  return (
    <div>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-xs sm:text-sm font-montserrat-medium-500 text-black mb-1.5 sm:mb-2"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && !textarea && (
          <Icon className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-black-light pointer-events-none" />
        )}
        
        {textarea ? (
          <textarea
            id={inputId}
            name={name}
            value={value || ''}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            minLength={minLength}
            rows={rows || 4}
            cols={cols}
            className={baseInputClasses}
            {...rest}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            placeholder={placeholder}
            disabled={disabled}
            inputMode={inputMode}
            maxLength={maxLength}
            minLength={minLength}
            className={baseInputClasses}
            {...rest}
          />
        )}
        
        {RightIcon && !textarea && (
          <div
            onClick={onRightIconClick && rightIconClickable ? onRightIconClick : undefined}
            className={`absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-black-light ${
              onRightIconClick && rightIconClickable 
                ? 'cursor-pointer hover:text-primary transition-colors' 
                : 'pointer-events-none'
            }`}
          >
            <RightIcon className="w-full h-full" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-1.5 font-montserrat-regular-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;

