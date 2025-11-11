import React, { useEffect } from "react";

function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleOverlayClick}
            style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
            <div
                className="bg-bg-card dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                style={{ animation: 'slideUp 0.3s ease-out' }}
            >
                <div className="flex items-center justify-between p-6 border-b border-border-primary dark:border-neutral-700">
                    <h3 className="text-2xl font-serif font-medium text-text-primary dark:text-neutral-100">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 transition-all duration-300"
                        aria-label="Close modal"
                    >
                        <i className="bi bi-x-lg text-xl"></i>
                    </button>
                </div>

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;