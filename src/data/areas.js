// src/data/areas.js
// One entry per town page (/service-areas/:slug).
// IMPORTANT: only keep towns you genuinely serve, and add REAL local detail to each (a neighborhood you work in,
// a job you did there with the owner's permission, typical issues you see). Pages that are near-copies of each other
// are treated as low-quality by Google, so make each one specific.

export const AREAS = [
  {
    slug: 'amesbury',
    name: 'Amesbury',
    state: 'MA',
    intro:
      'Amesbury sits on the Merrimack River with a long mill history, and its housing mixes older homes with newer builds. Older houses here often need attention to wood, windows and roofing that has aged out.',
    notes: [
      'Older houses commonly show rot at sills, trim and porch framing',
      'River-valley moisture is hard on exterior paint and decks',
      'Mixed housing stock, so repairs range from small punch lists to full deck rebuilds',
    ],
    nearby: ['newburyport', 'salisbury'],
  },
  {
    slug: 'newburyport',
    name: 'Newburyport',
    state: 'MA',
    intro:
      'Newburyport is known for its historic downtown and waterfront, and many of its homes are Federal and Victorian-era. Older construction calls for careful repair work that respects the building.',
    notes: [
      'Historic homes often need trim, window and porch repair done by hand rather than replaced',
      'Some neighborhoods have historic-district review for exterior changes, so check with the city before starting',
      'Waterfront wind and salt air shorten the life of paint and exterior wood',
    ],
    nearby: ['amesbury', 'newbury'],
  },
  {
    slug: 'salisbury',
    name: 'Salisbury',
    state: 'MA',
    intro:
      'Salisbury combines year-round homes with Salisbury Beach cottages and coastal properties. Wind, salt and storm exposure are the main reasons exteriors here age quickly.',
    notes: [
      'Coastal weather is hard on roofs, decks, railings and fasteners',
      'Seasonal and second homes benefit from opening and closing checklists',
      'After a nor\u2019easter, a quick roof and gutter check can prevent bigger repairs',
    ],
    nearby: ['amesbury', 'newbury'],
  },
  {
    slug: 'haverhill',
    name: 'Haverhill',
    state: 'MA',
    intro:
      'Haverhill is a larger city on the Merrimack with older single-family homes, multi-family houses and rental properties. Landlords and property managers here often need reliable help across several units.',
    notes: [
      'Multi-family and rental properties need efficient turnover and punch-list work',
      'Older homes commonly need drywall, trim and door repair, and exterior painting',
      'Recurring seasonal maintenance suits owners with more than one property',
    ],
    nearby: ['amesbury', 'newburyport'],
  },
  {
    slug: 'newbury',
    name: 'Newbury',
    state: 'MA',
    intro:
      'Newbury covers Byfield, farmland, marsh and the Plum Island shoreline. Properties range from rural lots with plenty of grounds to exposed coastal homes.',
    notes: [
      'Larger lots mean more yard cleanup, brush clearing and mulching',
      'Plum Island and marsh-edge homes face constant wind and salt exposure',
      'Storm damage assessment is a frequent request after coastal weather',
    ],
    nearby: ['newburyport', 'salisbury'],
  },
]

export const getArea = (slug) => AREAS.find((a) => a.slug === slug)
