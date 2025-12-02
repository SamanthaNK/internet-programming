import React, { useState, useRef, useEffect } from 'react';

const CustomDatePicker = ({
    value,
    onChange,
    label,
    required = false,
    className = "",
    min,
    max,
    mode = "date" // "date" or "month"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        if (value) {
            if (mode === "month") {
                const [year, month] = value.split('-');
                return new Date(parseInt(year), parseInt(month) - 1, 1);
            }
            return new Date(value);
        }
        return new Date();
    });
    const pickerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDisplay = (val) => {
        if (!val) return '';
        if (mode === "month") {
            const [year, month] = val.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        }
        const d = new Date(val);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const handleDateSelect = (day) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const dateString = newDate.toISOString().split('T')[0];
        onChange(dateString);
        setIsOpen(false);
    };

    const handleMonthSelect = (month) => {
        const year = viewDate.getFullYear();
        const monthString = `${year}-${String(month).padStart(2, '0')}`;
        onChange(monthString);
        setIsOpen(false);
    };

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(viewDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);

    const selectedDate = value && mode === "date" ? new Date(value) : null;
    const selectedMonth = value && mode === "month" ? parseInt(value.split('-')[1]) : null;
    const selectedYear = value && mode === "month" ? parseInt(value.split('-')[0]) : null;
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    return (
        <div className={`relative ${className}`} ref={pickerRef}>
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
                <span className={value ? "text-text-primary dark:text-neutral-100" : "text-text-muted dark:text-neutral-400"}>
                    {value ? formatDisplay(value) : `Select ${mode}`}
                </span>
                <i className="bi bi-calendar3 text-text-muted"></i>
            </button>

            {isOpen && mode === "date" && (
                <div className="absolute z-50 w-72 mt-2 p-3 bg-bg-card dark:bg-neutral-700 border border-border-primary dark:border-neutral-600 rounded-lg shadow-lg animate-slideUp">
                    <div className="flex items-center justify-between mb-3">
                        <button
                            type="button"
                            onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}
                            className="p-1 hover:bg-bg-secondary dark:hover:bg-neutral-600 rounded transition-colors"
                        >
                            <i className="bi bi-chevron-left text-text-primary dark:text-neutral-100 text-sm"></i>
                        </button>

                        <span className="font-serif text-base text-text-primary dark:text-neutral-100">
                            {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>

                        <button
                            type="button"
                            onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}
                            className="p-1 hover:bg-bg-secondary dark:hover:bg-neutral-600 rounded transition-colors"
                        >
                            <i className="bi bi-chevron-right text-text-primary dark:text-neutral-100 text-sm"></i>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-0.5 mb-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-center text-xs font-medium text-text-muted dark:text-neutral-400 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-0.5">
                        {blanks.map(i => (
                            <div key={`blank-${i}`} className="aspect-square"></div>
                        ))}
                        {days.map(day => {
                            const isSelected = selectedDate &&
                                selectedDate.getDate() === day &&
                                selectedDate.getMonth() === month &&
                                selectedDate.getFullYear() === year;
                            const isToday = today.getDate() === day &&
                                today.getMonth() === month &&
                                today.getFullYear() === year;

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleDateSelect(day)}
                                    className={`aspect-square rounded text-xs transition-colors ${isSelected
                                            ? 'bg-primary-kombu dark:bg-primary-moss text-white'
                                            : isToday
                                                ? 'bg-primary-light dark:bg-neutral-600 text-primary-kombu dark:text-primary-light'
                                                : 'hover:bg-bg-secondary dark:hover:bg-neutral-600 text-text-primary dark:text-neutral-100'
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {isOpen && mode === "month" && (
                <div className="absolute z-50 w-72 mt-2 p-4 bg-bg-card dark:bg-neutral-700 border border-border-primary dark:border-neutral-600 rounded-lg shadow-lg animate-slideUp">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={() => setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1))}
                            className="p-1 hover:bg-bg-secondary dark:hover:bg-neutral-600 rounded transition-colors"
                        >
                            <i className="bi bi-chevron-left text-text-primary dark:text-neutral-100 text-sm"></i>
                        </button>

                        <span className="font-serif text-base text-text-primary dark:text-neutral-100">
                            {viewDate.getFullYear()}
                        </span>

                        <button
                            type="button"
                            onClick={() => setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1))}
                            className="p-1 hover:bg-bg-secondary dark:hover:bg-neutral-600 rounded transition-colors"
                        >
                            <i className="bi bi-chevron-right text-text-primary dark:text-neutral-100 text-sm"></i>
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {months.map((monthName, index) => {
                            const monthNum = index + 1;
                            const isSelected = selectedMonth === monthNum &&
                                selectedYear === viewDate.getFullYear();
                            const isCurrentMonth = currentMonth === monthNum &&
                                currentYear === viewDate.getFullYear();

                            return (
                                <button
                                    key={monthName}
                                    type="button"
                                    onClick={() => handleMonthSelect(monthNum)}
                                    className={`py-3 px-2 rounded-lg text-sm font-medium transition-colors ${isSelected
                                            ? 'bg-primary-kombu dark:bg-primary-moss text-white'
                                            : isCurrentMonth
                                                ? 'bg-primary-light dark:bg-neutral-600 text-primary-kombu dark:text-primary-light'
                                                : 'hover:bg-bg-secondary dark:hover:bg-neutral-600 text-text-primary dark:text-neutral-100'
                                        }`}
                                >
                                    {monthName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;