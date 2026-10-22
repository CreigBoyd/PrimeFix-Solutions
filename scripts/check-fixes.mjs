// Run:  node scripts/check-fixes.mjs            (checks your source, and dist/ if you have already built)
// It tells you whether the hydration + .htaccess fixes are really in your project and in your latest build.
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'))
const read = (f) => (existsSync(path.join(root, f)) ? readFileSync(path.join(root, f), 'utf8') : null)
let failed = 0
const check = (label, ok, hint) => {
  if (!ok) failed++
  console.log(`${ok ? '  PASS' : '  FAIL'}  ${label}${ok ? '' : `\n          -> ${hint}`}`)
}

console.log(`\nChecking project: ${root}\n\nSOURCE FILES`)
const cc = read('src/components/CookieConsent.jsx')
check('CookieConsent decides after page load (this was the React #418/#423 error)', !!cc && /useEffect/.test(cc) && /useState\(false\)/.test(cc),
  'Replace src/components/CookieConsent.jsx with the one from the zip.')
const ht = read('public/.htaccess')
check('.htaccess has no looping rewrite rules', !!ht && !/RewriteRule \^\(\.\*\[\^\/\]\)\$/.test(ht) && !/RewriteRule \^\(\.\+\)\/\$ \/\$1 \[R=301/.test(ht),
  'Replace public/.htaccess with the one from the zip (the old one makes inner pages redirect forever).')
check('.htaccess serves the branded 404 page', !!ht && /ErrorDocument 404 \/404\.html/.test(ht), 'Replace public/.htaccess with the one from the zip.')
check('canonical URLs use the trailing-slash form', /canonicalFor/.test(read('src/hooks/usePageTitle.js') || ''), 'Replace src/hooks/usePageTitle.js with the one from the zip.')
check('prerender uses the same URL shape as the browser', /route \+ '\/'/.test(read('scripts/prerender.mjs') || ''), 'Replace scripts/prerender.mjs with the one from the zip.')
check('review dates use a fixed locale', !/toLocaleDateString\(undefined/.test(read('src/pages/Reviews.jsx') || ''), 'Replace src/pages/Reviews.jsx with the one from the zip.')
const idx = read('index.html')
check('index.html has no hand-written font preload', !!idx && !/rel="preload"/.test(idx), 'Remove the <link rel="preload" ... playwrite ...> block from index.html.')

const dist = read('dist/index.html')
console.log('\nLATEST BUILD (dist/)')
if (dist === null) {
  console.log('  (no dist/ folder yet - run  npm run build  and then run this check again)')
} else {
  check('the built home page does NOT contain the cookie banner', !/cookie-banner/.test(dist), 'Your dist/ was built from the OLD CookieConsent. Fix the source file above, then run  npm run build  again.')
  const dht = read('dist/.htaccess')
  check('dist/.htaccess is the fixed version', !!dht && !/RewriteRule \^\(\.\*\[\^\/\]\)\$/.test(dht), 'Rebuild after replacing public/.htaccess.')
  check('inner pages were prerendered', existsSync(path.join(root, 'dist/services/roofing/index.html')) && existsSync(path.join(root, 'dist/404.html')), 'Run the full  npm run build  (it must end with "prerendered 30 pages + 404.html").')
  const roof = read('dist/services/roofing/index.html') || ''
  check('canonical tags use trailing slashes', /canonical" href="https:\/\/primefix\.vip\/services\/roofing\/"/.test(roof), 'Rebuild after replacing src/hooks/usePageTitle.js and scripts/prerender.mjs.')
  const m = dist.match(/assets\/index-([A-Za-z0-9_-]+)\.js/)
  console.log(`  INFO  main script in this build: index-${m ? m[1] : '?'}.js   (compare with the live page source)`)
}
console.log(failed ? `\n${failed} problem(s) found - fix those, run  npm run build, and upload the whole dist/ folder again.\n` : '\nAll checks passed. If errors still show on the live site, the files on the server are older than this build - re-upload dist/.\n')
process.exit(failed ? 1 : 0)
