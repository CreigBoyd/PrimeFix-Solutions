# Complete Project File Structure

```
primefix-react/
├── .continue/
│   └── agents/
│       └── new-config.yaml
├── dist/
│   ├── assets/
│   │   ├── BeforeAfterPortfolio-Bf4auFbX.js
│   │   ├── Cabinet-New-aeH4u9TT.webp
│   │   ├── Cabinet-Old-CzmZk44K.webp
│   │   ├── CostEstimator-C5tykv7O.js
│   │   ├── Deck-New-C7HzPwcK.webp
│   │   ├── Deck-Old-C1fUZd5e.webp
│   │   ├── FAQ-BtYxnkWv.js
│   │   ├── fontawesome-vendor-BLf0FzRu.js
│   │   ├── Home-Cqq818Ml.js
│   │   ├── index-CjTdYYio.css
│   │   ├── index-CuUWE3Te.js
│   │   ├── MaintenancePlans-DnL-JpVl.js
│   │   ├── NotFound-6KluABl0.js
│   │   ├── portfolio-deck-S7ZtShBM.webp
│   │   ├── portfolio-painting-CZPrMqtQ.webp
│   │   ├── portfolio-roof-3aA22JnF.webp
│   │   ├── portfolio-yard-Diz4t20j.webp
│   │   ├── primefix-hero-W4NJ4_Ki.webp
│   │   ├── primefix-solutions-logo-dark-bg-CF7MSGSC.svg
│   │   ├── react-vendor-DkfLzY1l.js
│   │   ├── Reviews-CxhaUuDw.js
│   │   ├── reviews-Dl9z_ZXl.js
│   │   ├── Roof-New-B4U-p9EX.webp
│   │   ├── Roof-Old-8uxfNoWy.jpg
│   │   ├── ServiceExplorer-CvsFIu81.js
│   │   ├── toast-DCGVZOYj.js
│   │   └── usePageTitle-iHaGpHt1.js
│   ├── .htaccess
│   ├── about.txt
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.webmanifest
│   ├── primefix-solutions.vcf
│   ├── registerSW.js
│   ├── robots.txt
│   ├── site.webmanifest
│   ├── sitemap.xml
│   ├── sw.js
│   └── workbox-9c191d2f.js
├── public/
│   ├── .htaccess
│   ├── about.txt
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   ├── og-image.jpg
│   ├── primefix-solutions.vcf
│   ├── robots.txt
│   ├── site.webmanifest
│   └── sitemap.xml
├── server/
│   ├── storage/
│   │   ├── ratelimit/
│   │   │   └── contact-eff8e7ca506627fe15dda5e0e512fcaad70b6d520f37cc76597fdb4f2d83a1a3.json
│   │   └── .htaccess
│   ├── .env
│   ├── .htaccess
│   ├── bootstrap.php
│   ├── composer.json
│   ├── composer.lock
│   ├── config.php
│   ├── pending-reviews.json
│   ├── PFS_email-logo.png
│   ├── send-mail.php
│   ├── submit-review.php
│   ├── subscribe.php
│   └── subscribers.csv
├── src/
│   ├── assets/
│   │   ├── slider-images/
│   │   │   ├── Cabinet-New.webp
│   │   │   ├── Cabinet-Old.webp
│   │   │   ├── Deck-New.webp
│   │   │   ├── Deck-Old.webp
│   │   │   ├── Roof-New.webp
│   │   │   ├── Roof-Old.jpg
│   │   │   └── Roof-Old.webp
│   │   ├── portfolio-deck.webp
│   │   ├── portfolio-painting.webp
│   │   ├── portfolio-roof.webp
│   │   ├── portfolio-yard.webp
│   │   ├── primefix-hero.webp
│   │   └── primefix-solutions-logo-dark-bg.svg
│   ├── components/
│   │   ├── ContextMenu/
│   │   │   ├── ContextMenu.jsx
│   │   │   ├── helpers.js
│   │   │   ├── index.js
│   │   │   └── MenuCard.jsx
│   │   ├── BookingModal.jsx
│   │   ├── Chatbot.jsx
│   │   ├── Contact.jsx
│   │   ├── CookieConsent.jsx
│   │   ├── EmergencyBanner.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── JellyButton.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── MobileActionBar.jsx
│   │   ├── Newsletter.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Process.jsx
│   │   ├── ReviewModal.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── ServiceModal.jsx
│   │   ├── Services.jsx
│   │   ├── StarRating.jsx
│   │   └── Testimonials.jsx
│   ├── config/
│   │   └── site.js
│   ├── data/
│   │   └── reviews.json
│   ├── hooks/
│   │   └── usePageTitle.js
│   ├── pages/
│   │   ├── BeforeAfterPortfolio.jsx
│   │   ├── CostEstimator.jsx
│   │   ├── FAQ.jsx
│   │   ├── Home.jsx
│   │   ├── MaintenancePlans.jsx
│   │   ├── NotFound.jsx
│   │   ├── Reviews.jsx
│   │   └── ServiceExplorer.jsx
│   ├── routes/
│   │   └── pageRegistry.js
│   ├── utils/
│   │   ├── analytics.js
│   │   ├── api.js
│   │   ├── booking.js
│   │   ├── consoleBanner.js
│   │   ├── toast.js
│   │   └── validation.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── OrininalCSS_style.css
│   └── style.css
├── .env
├── FS.cjs
├── index.html
├── package-lock.json
├── package.json
├── PFS.zip
├── README.md
├── start.bat
├── transfer.cjs
├── vercel.json
└── vite.config.js
```
