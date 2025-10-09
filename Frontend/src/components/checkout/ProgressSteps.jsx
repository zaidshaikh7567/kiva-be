import React from 'react';
import { Check } from 'lucide-react';

const ProgressSteps = ({ 
  currentStep, 
  totalSteps, 
  steps, 
  onStepClick, 
  canNavigateToStep,
  showIcons = false,
  showDescriptions = true,
  variant = 'default' // 'default', 'compact', 'detailed'
}) => {
  const getStepIcon = (step, stepNumber, isCompleted) => {
    if (showIcons && step.icon) {
      return <step.icon className="w-5 h-5" />;
    }
    if (isCompleted && showIcons) {
      return <Check className="w-5 h-5" />;
    }
    return stepNumber;
  };

  const getStepStyles = (isCurrentStep, isCompleted, isClickable) => {
    const baseStyles = "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300";
    
    if (isCurrentStep) {
      return `${baseStyles} bg-primary text-white shadow-lg`;
    }
    
    if (isCompleted) {
      return `${baseStyles} bg-primary-dark text-white hover:bg-primary hover:scale-105`;
    }
    
    if (isClickable) {
      return `${baseStyles} bg-gray-200 text-gray-600 hover:bg-gray-300`;
    }
    
    return `${baseStyles} bg-gray-200 text-gray-400 cursor-not-allowed`;
  };

  const getContainerStyles = () => {
    switch (variant) {
      case 'compact':
        return "py-4";
      case 'detailed':
        return "py-12";
      default:
        return "py-8";
    }
  };

  return (
    <section className={`bg-white border-b border-primary-light ${getContainerStyles()}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center space-x-4 md:space-x-8">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCurrentStep = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            const isClickable = canNavigateToStep ? canNavigateToStep(stepNumber) : true;
            
            return (
              <React.Fragment key={stepNumber}>
                {/* Step Button */}
                <button 
                  onClick={() => onStepClick && onStepClick(stepNumber)}
                  className="flex items-center group cursor-pointer"
                  disabled={!isClickable}
                >
                  <div className={getStepStyles(isCurrentStep, isCompleted, isClickable)}>
                    {getStepIcon(step, stepNumber, isCompleted)}
                  </div>
                  
                  {/* Step Title */}
                  <span className="hidden md:block ml-3 font-montserrat-medium-500 text-black group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </span>
                </button>
                
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className={`w-12 md:w-24 h-1 ${
                    currentStep > stepNumber ? 'bg-primary' : 'bg-gray-200'
                  } transition-colors duration-300`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Step Descriptions (Mobile) */}
        {showDescriptions && (
          <div className="md:hidden mt-4">
            <div className="text-center">
              <p className="text-sm font-montserrat-medium-500 text-black">
                {steps[currentStep - 1]?.title}
              </p>
              <p className="text-xs font-montserrat-regular-400 text-black-light mt-1">
                {steps[currentStep - 1]?.description}
              </p>
            </div>
          </div>
        )}

        {/* Detailed Progress (for detailed variant) */}
        {variant === 'detailed' && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isCurrentStep = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;
                
                return (
                  <div 
                    key={stepNumber}
                    className={`text-center p-4 rounded-lg transition-all duration-300 ${
                      isCurrentStep 
                        ? 'bg-primary-light border-2 border-primary' 
                        : isCompleted 
                          ? 'bg-green-50 border-2 border-green-200' 
                          : 'bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      isCurrentStep 
                        ? 'bg-primary text-white' 
                        : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                    }`}>
                      {getStepIcon(step, stepNumber, isCompleted)}
                    </div>
                    <h3 className="font-montserrat-semibold-600 text-black mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs font-montserrat-regular-400 text-black-light">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgressSteps;
