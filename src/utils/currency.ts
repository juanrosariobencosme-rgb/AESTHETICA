export interface CountryOption {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  rate: number;
  flag: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: 'US', name: 'USA', currency: 'USD', symbol: '$', rate: 1.0, flag: '🇺🇸' },
  { code: 'DO', name: 'República Dominicana', currency: 'DOP', symbol: 'RD$', rate: 59.20, flag: '🇩🇴' }
];

export function convertAndFormatPrice(usdPrice: number, countryCode: string): string {
  const country = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];
  const converted = usdPrice * country.rate;
  
  if (country.currency === 'EUR') {
    return `${converted.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  }
  
  if (country.currency === 'COP' || country.currency === 'CLP') {
    // Latin American Pesos often don't show cents
    return `${country.symbol}${Math.round(converted).toLocaleString('es-CO')} ${country.currency}`;
  }

  if (country.currency === 'DOP') {
    return `${country.symbol} ${converted.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DOP`;
  }
  
  return `${country.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${country.currency}`;
}
