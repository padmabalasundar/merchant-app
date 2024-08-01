import moment from "moment";

export const parseDemoninations = (denominations: number[], denominationType: string) => {
    return (denominationType.toUpperCase() === 'FIXED') ? denominations.toString().replaceAll(',', ', ') : denominations.toString().replace(',', ' - ');
}

export const getCurrencySymbol = (currency: string | null) => {
    if (!currency) {
        return '$';
    }
    switch (currency) {
        case 'EUR':
            return '\u20AC';
        case 'GBP':
            return '\u00A3';
        case 'CAD':
            return 'CA$';
        case 'USD':
        default:
            return '$';
    }
};

export const formatDate = (timeStamp: Date | string | null) => {
    return  timeStamp ? moment(timeStamp).format('MM-DD-YYYY hh:mm a') : '-'
}