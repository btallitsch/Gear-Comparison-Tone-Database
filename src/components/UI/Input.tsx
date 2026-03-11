import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  rows?: number;
}

interface SelectProps {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', ...props }, ref) => (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrap}>
        {icon && <span className={styles.inputIcon}>{icon}</span>}
        <input
          ref={ref}
          className={`${styles.input} ${icon ? styles.hasIcon : ''} ${error ? styles.hasError : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className={styles.error}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  )
);
Input.displayName = 'Input';

export const Textarea = ({ label, error, hint, rows = 4, className = '', ...props }: TextareaProps) => (
  <div className={styles.field}>
    {label && <label className={styles.label}>{label}</label>}
    <textarea
      rows={rows}
      className={`${styles.input} ${styles.textarea} ${error ? styles.hasError : ''} ${className}`}
      {...props}
    />
    {error && <span className={styles.error}>{error}</span>}
    {hint && !error && <span className={styles.hint}>{hint}</span>}
  </div>
);

export const Select = ({ label, error, hint, options, value, onChange, placeholder }: SelectProps) => (
  <div className={styles.field}>
    {label && <label className={styles.label}>{label}</label>}
    <select
      className={`${styles.input} ${styles.select} ${error ? styles.hasError : ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    {error && <span className={styles.error}>{error}</span>}
    {hint && !error && <span className={styles.hint}>{hint}</span>}
  </div>
);
