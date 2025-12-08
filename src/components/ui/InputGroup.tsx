import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface InputGroupProps {
  label: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  options?: string[] | SelectOption[];
  isTextarea?: boolean;
  className?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  name?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  type = 'text',
  placeholder = '',
  icon,
  options,
  isTextarea = false,
  className = '',
  value,
  onChange,
  disabled = false,
  name,
}) => {
  const baseInputStyles = `
    w-full px-3 py-2.5 rounded-xl 
    bg-[#DFF3E4]/60 
    border border-[#DFF3E4]
    text-gray-700 text-sm
    placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-[#3F3176]/20 focus:border-[#3F3176]/30
    transition-all duration-200
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
  `;

  // Check if options are objects with value/label or simple strings
  const isObjectOptions = options && options.length > 0 && typeof options[0] === 'object';

  // Use label as placeholder
  const inputPlaceholder = placeholder || label;

  // Input styles with icon padding
  const inputWithIconStyles = `
    w-full pl-9 pr-3 py-2.5 rounded-xl 
    bg-[#DFF3E4]/60 
    border border-[#DFF3E4]
    text-gray-700 text-sm
    placeholder:text-gray-500
    focus:outline-none focus:ring-2 focus:ring-[#3F3176]/20 focus:border-[#3F3176]/30
    transition-all duration-200
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
  `;

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Render select, textarea or input - with icon inside */}
      {options ? (
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3F3176]">
              {icon}
            </span>
          )}
          <select 
            className={icon ? inputWithIconStyles : baseInputStyles}
            value={value}
            onChange={onChange}
            disabled={disabled}
            name={name}
          >
            <option value="" className="text-gray-500">{label}</option>
            {isObjectOptions
              ? (options as SelectOption[]).map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))
              : (options as string[]).map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))
            }
          </select>
        </div>
      ) : isTextarea ? (
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-3 text-[#3F3176]">
              {icon}
            </span>
          )}
          <textarea
            placeholder={inputPlaceholder}
            rows={3}
            className={`${icon ? inputWithIconStyles : baseInputStyles} resize-none`}
            value={value}
            onChange={onChange}
            disabled={disabled}
            name={name}
          />
        </div>
      ) : (
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3F3176]">
              {icon}
            </span>
          )}
          <input
            type={type}
            placeholder={inputPlaceholder}
            className={icon ? inputWithIconStyles : baseInputStyles}
            value={value}
            onChange={onChange}
            disabled={disabled}
            name={name}
          />
        </div>
      )}
    </div>
  );
};

export default InputGroup;
