// src/utils/consoleBanner.js
export function initConsoleBanner() {
  const asciiArt = `
  ____  ____  _____ __  __ _____ _____ _____  _  _   
 |  _ \\|  _ \\|_   _|  \\/  | ____|  ___|_   _|| || |  
 | |_) | |_) | | | | |\\/| |  _| | |_    | |  | || |_ 
 |  __/|  _ <  | | | |  | | |___|  _|   | |  |__   _|
 |_|   |_| \\_\\_|_|_|_|  |_|_____|_|     |_|     |_|  
  `;

  const bannerStyle = `
    color: #0d9488;
    font-weight: bold;
    font-family: monospace;
  `;

  const tagStyle = `
    background: #0d9488;
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: sans-serif;
  `;

  const subTextStyle = `
    color: #64748b;
    font-size: 11px;
    font-family: sans-serif;
  `;

  console.log(
    `%c${asciiArt}\n%c PrimeFix Solutions %c Building & Property Maintenance\n%cLooking for website development or custom maintenance solutions? Reach out at hello@primefixsolutions.com`,
    bannerStyle,
    tagStyle,
    'color: #0369a1; font-weight: bold; font-size: 12px;',
    subTextStyle
  );
}