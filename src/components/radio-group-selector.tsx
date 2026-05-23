'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type Option = {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

interface RadioGroupSelectorProps {
  options: Option[];
  selectedValue: string | undefined;
  onValueChange: (value: string) => void;
}

export function RadioGroupSelector({
  options,
  selectedValue,
  onValueChange,
}: RadioGroupSelectorProps) {
  const name = React.useId();
  return (
    <div className="radio-input-group p-2">
      {options.map((option) => (
        <label
          key={option.value}
          htmlFor={option.value}
          className={cn(selectedValue === option.value && 'active')}
        >
          {option.icon && <option.icon className="h-4 w-4" />}
          <span className="label-text">{option.label}</span>
          <input
            id={option.value}
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(e) => onValueChange(e.target.value)}
            className="ml-auto"
          />
        </label>
      ))}
    </div>
  );
}
