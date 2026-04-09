import { CURRENCIES } from '@/lib/constants';

export function convertPrice(amount: number, fromCurrency: string, toCurrency: string): number {
  const from = CURRENCIES.find(c => c.code === fromCurrency);
  const to = CURRENCIES.find(c => c.code === toCurrency);
  if (!from || !to) return amount;
  const inEur = amount * from.rateToEur;
  return inEur / to.rateToEur;
}

export function formatPrice(amount: number, currency: string): string {
  const curr = CURRENCIES.find(c => c.code === currency);
  if (!curr) return `${amount} ${currency}`;

  const formatted = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(amount));

  switch (currency) {
    case 'EUR': return `${formatted} €`;
    case 'USD': return `$${formatted}`;
    case 'GBP': return `£${formatted}`;
    case 'XOF': return `${formatted} FCFA`;
    case 'AED': return `${formatted} AED`;
    case 'THB': return `${formatted} ฿`;
    case 'MAD': return `${formatted} MAD`;
    default: return `${formatted} ${currency}`;
  }
}
