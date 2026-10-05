// src/data/projects.js
//
// ONE place to edit the portfolio. To use real photos:
//   1. Drop your photos into src/assets/ (featured) or src/assets/slider-images/ (before/after),
//      either replacing the existing files (same names) or adding new ones and updating the imports.
//   2. Rewrite the text below so it describes the REAL job (what you did, what the property was).
//      Only claim what is true: customers can tell, and the captions are statements about your work.
//
// Image guidance: featured photos 4:3 landscape (about 880x660), before/after pairs the SAME framing and
// the SAME aspect ratio (about 1200x1200 square or 4:3), WebP or JPG under ~150 KB each.

import deckImg from '../assets/portfolio-deck.webp'
import roofImg from '../assets/portfolio-roof.webp'
import yardImg from '../assets/portfolio-yard.webp'
import paintingImg from '../assets/portfolio-painting.webp'

import cabinetOld from '../assets/slider-images/Cabinet-Old.webp'
import cabinetNew from '../assets/slider-images/Cabinet-New.webp'
import deckOld from '../assets/slider-images/Deck-Old.webp'
import deckNew from '../assets/slider-images/Deck-New.webp'
import roofOld from '../assets/slider-images/Roof-Old.webp'
import roofNew from '../assets/slider-images/Roof-New.webp'

// Home page "Recent work" grid
export const FEATURED_PROJECTS = [
  {
    img: deckImg,
    alt: 'Aerial view of a multi-level wooden deck with black railings, stairs and built-in planters beside a green-sided house',
    tag: 'Carpentry',
    title: 'Multi-level deck',
  },
  {
    img: roofImg,
    alt: 'Roofer removing worn shingles from a pitched roof',
    tag: 'Roofing',
    title: 'Shingle tear-off & repair',
  },
  {
    img: yardImg,
    alt: 'Two crew members mowing and edge-trimming a striped lawn beside tall hedges',
    tag: 'Yard & grounds',
    title: 'Lawn & grounds care',
  },
  {
    img: paintingImg,
    alt: 'Painter in paint-splattered clothes working on the ceiling edge of a bright interior room',
    tag: 'Painting',
    title: 'Interior painting',
  },
]

// /portfolio-transformations page (drag-to-compare sliders)
export const TRANSFORMATIONS = [
  {
    id: 1,
    title: 'Full Exterior Deck Rebuild & Railing Upgrade',
    category: 'Carpentry',
    desc: 'Replaced a severely weathered, rotting 20-year-old pine deck with low-maintenance composite decking and custom black aluminum railing.',
    beforeImg: deckOld,
    afterImg: deckNew,
  },
  {
    id: 2,
    title: 'Architectural Shingle Roof Replacement',
    category: 'Roofing',
    desc: 'Stripped away old shingles, repaired plywood roof decking, and installed heavy-duty architectural dimensional shingles with upgraded ridge vents.',
    beforeImg: roofOld,
    afterImg: roofNew,
  },
  {
    id: 3,
    title: 'Complete Kitchen & Interior Cabinet Refinishing',
    category: 'Painting & Finishing',
    desc: 'Sprayed dated oak cabinets with a clean modern satin finish, added new matte black hardware, and updated wall trim.',
    beforeImg: cabinetOld,
    afterImg: cabinetNew,
  },
]
