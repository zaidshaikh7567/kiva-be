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
  className = '',
  disabled = false,
  required = false,
  inputMode,
  maxLength,
  minLength,
  ...rest
}) => {
  const inputId = `input-${name}`;
  
  // Base input classes
  const baseInputClasses = `w-full py-2.5 sm:py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 text-sm sm:text-base text-black transition-colors ${
    error 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-primary-light focus:ring-primary focus:border-primary'
  } ${Icon ? 'pl-10 sm:pl-11' : 'px-3 sm:px-4'} pr-3 sm:pr-4 ${className}`;

  return (
    <div>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-xs sm:text-sm font-montserrat-medium-500 text-black mb-1.5 sm:mb-2"
        >
          {label} {required && '*'}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-black-light pointer-events-none" />
        )}
        
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

