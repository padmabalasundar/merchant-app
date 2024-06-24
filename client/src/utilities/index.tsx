export const parseDemoninations = (denominations: number[], denominationType: string) => {
    return denominationType === 'Fixed' ? denominations.toString().replaceAll(',', ', $'): denominations.toString().replace(',', ' - $');
}