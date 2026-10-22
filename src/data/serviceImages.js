// src/data/serviceImages.js
// Header photo for each service page. Replace the files in src/assets with photos of YOUR crew and jobs when you have them
// (800x500, landscape) and update the alt text to describe what is really in the picture.
// A service with no entry here simply shows no photo.
import roofing from '../assets/service-roofing.webp'
import carpentry from '../assets/service-carpentry.webp'
import handyman from '../assets/service-handyman.webp'

export const SERVICE_IMAGES = {
  roofing: { src: roofing, alt: 'Roofer in a hard hat fastening roofing panels with a cordless drill' },
  carpentry: { src: carpentry, alt: 'Person drilling into a wooden board with a cordless drill at a workbench' },
  'handyman-repairs': { src: handyman, alt: 'Worker in a hard hat applying joint compound to a drywall ceiling seam' },
}
