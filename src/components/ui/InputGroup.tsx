import React from 'react';
import './InputGroup.css';

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
  // Check if options are objects with value/label or simple strings
  const isObjectOptions = options && options.length > 0 && typeof options[0] === 'object';

  // Use label as placeholder
  const inputPlaceholder = placeholder || label;

  return (
    <div className={`input-group ${className}`}>
      {options ? (
        <div className="input-group-wrapper">
          {icon && (
            <span className="input-group-icon">
              {icon}
            </span>
          )}
          <select 
            className={`input-group-field input-group-select ${icon ? '' : 'input-group-field-no-icon'}`}
            value={value}
            onChange={onChange}
            disabled={disabled}
            name={name}
          >
            <option value="">{label}</option>
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
        <div className="input-group-wrapper">
          {icon && (
            <span className="input-group-icon input-group-icon-textarea">
              {icon}
            </span>
          )}
          <textarea
            placeholder={inputPlaceholder}
            rows={3}
            className={`input-group-field input-group-textarea ${icon ? 'has-icon' : 'input-group-field-no-icon'}`}
            value={value}
            onChange={onChange}
            disabled={disabled}
            name={name}
          />
        </div>
      ) : (
        <div className="input-group-wrapper">
          {icon && (
            <span className="input-group-icon">
              {icon}
            </span>
          )}
          <input
            type={type}
            placeholder={inputPlaceholder}
            className={`input-group-field ${icon ? '' : 'input-group-field-no-icon'}`}
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
