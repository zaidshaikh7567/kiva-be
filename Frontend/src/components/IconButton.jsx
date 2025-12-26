const IconButton = ({
    children,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    onClick,
    type = "button",
    disabled = false,
    className = "",
  }) => {
    const baseClasses =
      "w-fit  inline-flex items-center px-6 py-3 bg-primary-dark text-white font-medium rounded-md capitalize hover:bg-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl";
  
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${className} ${
          disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
        }`}
      >
        {LeftIcon && <LeftIcon className="w-4 h-4 mr-2" />}
        <span>{children}</span>
        {RightIcon && <RightIcon className="w-4 h-4 ml-2 mt-[2px]" />}
      </button>
    );
  };
  
  export default IconButton;
  