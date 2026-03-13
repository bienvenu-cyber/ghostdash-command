import React, { useState } from 'react';

interface EditableValueProps {
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
  prefix?: string;
  suffix?: string;
  type?: 'text' | 'number';
}

export default function EditableValue({ value, onChange, className = '', prefix = '', suffix = '', type = 'text' }: EditableValueProps) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(String(value));

  const handleSave = () => {
    onChange(local);
    setEditing(false);
  };

  if (editing) {
    return (
      <input 
        autoFocus
        type={type}
        value={local}
        onChange={e => setLocal(e.target.value)}
        onBlur={handleSave}
        onKeyDown={e => e.key === 'Enter' && handleSave()}
        className={`border-b border-[#00AFF0] outline-none bg-transparent text-current font-inherit ${className}`}
        style={{ width: Math.max(local.length, 4) + 'ch' }}
      />
    );
  }

  return (
    <span 
      onClick={(e) => {
        e.stopPropagation();
        setLocal(String(value));
        setEditing(true);
      }} 
      className={`${className} cursor-pointer hover:opacity-70 transition-opacity`} 
      title="Click to edit"
    >
      {prefix}{value}{suffix}
    </span>
  );
}
