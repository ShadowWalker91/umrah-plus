'use client';

import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';
import { formatDateDDMMYYYY, toIsoDate } from '@/lib/utils';

interface DateInputFieldProps {
  id?: string;
  name?: string;
  value?: string;
  onChange: (isoValue: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  hasError?: boolean;
  isValid?: boolean;
}

/**
 * Custom date input field that strictly displays dates in `dd.mm.yyyy` format
 * (e.g. 25.09.2026), while providing a full-width clickable trigger that
 * opens the browser's native calendar picker seamlessly.
 */
export default function DateInputField({
  id,
  name,
  value,
  onChange,
  min,
  max,
  placeholder = 'DD.MM.YYYY',
  required = false,
  disabled = false,
  className = '',
  hasError = false,
  isValid = false,
}: DateInputFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const displayDate = value ? formatDateDDMMYYYY(value) : '';
  const isoValue = value ? toIsoDate(value) : '';
  const isoMin = min ? toIsoDate(min) : undefined;
  const isoMax = max ? toIsoDate(max) : undefined;

  const handleContainerClick = () => {
    if (disabled) return;
    try {
      inputRef.current?.showPicker?.();
    } catch {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`group relative flex items-center justify-between bg-[#0c0d10] border rounded-xl px-3.5 py-2.5 text-xs transition-all cursor-pointer select-none ${
        disabled
          ? 'opacity-50 cursor-not-allowed border-white/5'
          : hasError
          ? 'border-red-500/80 ring-1 ring-red-500/30'
          : isValid
          ? 'border-emerald-500/70 focus-within:border-emerald-500'
          : 'border-white/10 hover:border-[#c5a059] focus-within:border-[#c5a059] focus-within:ring-1 focus-within:ring-[#c5a059]/40'
      } ${className}`}
    >
      {/* Visual Formatted Date Display strictly in DD.MM.YYYY */}
      <span
        className={`font-mono text-xs tracking-wider transition-colors ${
          displayDate ? 'text-white font-medium' : 'text-gray-500'
        }`}
      >
        {displayDate || placeholder}
      </span>

      {/* Calendar Icon Indicator */}
      <div className="flex items-center gap-1.5 pl-2 pointer-events-none">
        <Calendar className="w-3.5 h-3.5 text-[#c5a059] group-hover:scale-110 transition-transform shrink-0" />
      </div>

      {/* Native invisible HTML5 Date Picker overlay for 100% full-box click & mobile support */}
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="date"
        value={isoValue}
        min={isoMin}
        max={isoMax}
        required={required}
        disabled={disabled}
        onClick={(e) => {
          try {
            (e.currentTarget as any).showPicker?.();
          } catch {}
        }}
        onFocus={(e) => {
          try {
            (e.currentTarget as any).showPicker?.();
          } catch {}
        }}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
        tabIndex={disabled ? -1 : 0}
        aria-label={placeholder}
      />
    </div>
  );
}
