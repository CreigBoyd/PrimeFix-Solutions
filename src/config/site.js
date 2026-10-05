// Single source of truth for business details used across the site.

// Also update: public/primefix-solutions.vcf, index.html (JSON-LD + noscript), server/.env (BUSINESS_PHONE),
// and src/utils/booking.js (hours must match: Mon-Fri 7-18, Sat 8-14, closed Sunday).
// src/config/site.js
export const SITE = {
  name: 'PrimeFix Solutions',
  phoneDisplay: '(978) 417-2042',
  phoneRaw: '9784172042',
  email: 'hello@PrimeFix.vip',
  hours: 'Mon–Fri 7am–6pm · Sat 8am–2pm',
  social: {
    instagram: 'https://www.instagram.com/pfix.solutions/',
    facebook: 'https://www.facebook.com/PrimeFixSolutionsMA',
    pinterest: 'https://www.pinterest.com/primefixmaintenancesolutions/',
  }
}

export const telHref = `tel:${SITE.phoneRaw}`
export const mailHref = `mailto:${SITE.email}`
