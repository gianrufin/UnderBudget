/** Major world currencies offered in the currency picker. `locale` feeds Intl.NumberFormat. */
export const CURRENCIES = [
  { code: 'PHP', locale: 'en-PH', symbol: '₱', name: 'Philippine Peso' },
  { code: 'USD', locale: 'en-US', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', locale: 'en-IE', symbol: '€', name: 'Euro' },
  { code: 'GBP', locale: 'en-GB', symbol: '£', name: 'British Pound' },
  { code: 'JPY', locale: 'ja-JP', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', locale: 'zh-CN', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', locale: 'en-IN', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AUD', locale: 'en-AU', symbol: '$', name: 'Australian Dollar' },
  { code: 'CAD', locale: 'en-CA', symbol: '$', name: 'Canadian Dollar' },
  { code: 'CHF', locale: 'de-CH', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'SGD', locale: 'en-SG', symbol: '$', name: 'Singapore Dollar' },
  { code: 'HKD', locale: 'en-HK', symbol: '$', name: 'Hong Kong Dollar' },
  { code: 'KRW', locale: 'ko-KR', symbol: '₩', name: 'South Korean Won' },
  { code: 'THB', locale: 'th-TH', symbol: '฿', name: 'Thai Baht' },
  { code: 'MYR', locale: 'ms-MY', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'IDR', locale: 'id-ID', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'VND', locale: 'vi-VN', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'MXN', locale: 'es-MX', symbol: '$', name: 'Mexican Peso' },
  { code: 'BRL', locale: 'pt-BR', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'ZAR', locale: 'en-ZA', symbol: 'R', name: 'South African Rand' },
  { code: 'NZD', locale: 'en-NZ', symbol: '$', name: 'New Zealand Dollar' },
  { code: 'AED', locale: 'ar-AE', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', locale: 'ar-SA', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'SEK', locale: 'sv-SE', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', locale: 'nb-NO', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', locale: 'da-DK', symbol: 'kr', name: 'Danish Krone' },
]

export function getCurrency(code) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
}
