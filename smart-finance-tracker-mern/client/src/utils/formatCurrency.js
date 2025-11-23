// Format currency based on currency type
export const formatCurrency = (amount, currency = 'XAF') => {
    if (amount === null || amount === undefined) return '0';

    const numAmount = parseFloat(amount);

    if (isNaN(numAmount)) return '0';

    // For XAF (no decimals)
    if (currency === 'XAF') {
        return numAmount.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    // For other currencies (2 decimals)
    return numAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

// Format currency with symbol
export const formatCurrencyWithSymbol = (amount, currency = 'XAF') => {
    const formatted = formatCurrency(amount, currency);

    if (currency === 'XAF') {
        return `${formatted} frs`;
    }

    // Currency symbols for other currencies
    const symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'NGN': '₦',
        'ZAR': 'R'
    };

    const symbol = symbols[currency] || currency;
    return `${symbol}${formatted}`;
};

export default formatCurrency;