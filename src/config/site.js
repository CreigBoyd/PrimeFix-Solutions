// Single source of truth for business details used across the site.
// TODO(owner): replace the placeholder phone/email with your real ones.
// Also update: public/primefix-solutions.vcf, index.html (JSON-LD), server/.env (BUSINESS_PHONE).
export const SITE = {
  name: 'PrimeFix Solutions',
  url: 'https://primefix.vip',
  phoneDisplay: '(555) 010-2000',
  phoneTel: '+15550102000',
  email: 'hello@primefix.vip',
  hours: 'Mon–Sat, 7am–6pm',
  // Paste your REAL profile URLs here (e.g. 'https://www.facebook.com/yourpage').
  // Anything left empty is simply not shown in the footer.
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    x: '',
  },
}

export const telHref = `tel:${SITE.phoneTel}`
export const mailHref = `mailto:${SITE.email}`
