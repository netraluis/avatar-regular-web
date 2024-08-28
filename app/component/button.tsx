import React from 'react';
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}


const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, onClick, disabled, className }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled }
      onClick={onClick}
      type="button"
      className={`max-h-full inline-flex items-center gap-x-2 rounded-xl px-8 py-4 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
        ${
          disabled
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-black text-white hover:bg-secondary"
        }
        ${className ? className : ""}
        `
      }
    >
      {children}
    </button>
  );
})

Button.displayName = "Button";

export default Button;
