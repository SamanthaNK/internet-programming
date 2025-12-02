import React, { useState, useRef, useEffect } from 'react';

const CustomDropdown = ({
    options = [],
    value,
    onChange,
    placeholder = "Select...",
    label,
    required = false,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2.5 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent transition-all text-left flex items-center justify-between"
            >
                <span className={selectedOption ? "text-text-primary dark:text-neutral-100" : "text-text-muted dark:text-neutral-400"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <i className={`bi bi-chevron-down text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 py-1 bg-bg-card dark:bg-neutral-700 border border-border-primary dark:border-neutral-600 rounded-lg shadow-lg max-h-60 overflow-auto animate-slideUp">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left transition-colors ${value === opt.value
                                    ? 'bg-primary-light dark:bg-neutral-600 text-primary-kombu dark:text-primary-light'
                                    : 'text-text-primary dark:text-neutral-100 hover:bg-bg-secondary dark:hover:bg-neutral-600'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;