import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  sublabel?: string;
  error?: string;
  containerClassName?: string;
  accentColor?: 'forest' | 'amber' | 'emerald' | 'gold' | 'default';
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  sublabel,
  error,
  containerClassName = '',
  className = '',
  accentColor = 'forest',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? `pwd_${label.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : undefined);

  const getFocusRing = () => {
    switch (accentColor) {
      case 'amber':
        return 'focus:ring-2 focus:ring-amber-600 focus:border-amber-600';
      case 'emerald':
        return 'focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600';
      case 'gold':
        return 'focus:ring-2 focus:ring-foundation-gold focus:border-foundation-gold';
      case 'forest':
      default:
        return 'focus:ring-2 focus:ring-foundation-forest focus:border-foundation-forest';
    }
  };

  return (
    <div className={`w-full ${containerClassName}`}>
      {(label || sublabel) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <label htmlFor={inputId} className="block text-xs font-bold text-stone-700">
              {label}
            </label>
          )}
          {sublabel && (
            <span className="text-[10px] text-stone-400">
              {sublabel}
            </span>
          )}
        </div>
      )}
      <div className="relative flex items-center">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          className={`w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal ${getFocusRing()} focus:outline-none pr-10 transition-colors ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 focus:outline-none focus:text-stone-800 transition-colors cursor-pointer p-1 rounded-md"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
};
