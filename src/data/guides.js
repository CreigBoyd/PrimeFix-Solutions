// src/data/guides.js
// Helpful, general how-to articles (/guides/:slug). They bring in people searching for answers and show expertise.
// Keep them factual. Add new ones by copying an entry; the sitemap and prerendering pick them up automatically.

export const GUIDES = [
  {
    slug: 'roof-repair-or-replace-new-england',
    title: 'Roof Repair or Replacement? How to Tell in New England',
    metaDescription:
      'Learn the signs that a roof can be repaired versus replaced, how long shingles last in New England weather, and what to check before you call a roofer.',
    published: '2026-10-05',
    minutes: 4,
    service: 'roofing',
    intro:
      'A roof does not fail all at once. It wears out in stages, and the question every homeowner faces is whether the next repair is worth making or whether the money belongs in a new roof. These are the signs that help you decide.',
    sections: [
      {
        heading: 'Signs a repair may be enough',
        paragraphs: ['Repair usually makes sense when the damage is limited and the rest of the roof is in decent condition.'],
        bullets: [
          'A few missing, cracked or lifted shingles after a storm',
          'A single leak traced to flashing around a chimney, vent or skylight',
          'Damaged or loose ridge cap shingles',
          'Clogged or sagging gutters causing local water damage',
        ],
      },
      {
        heading: 'Signs replacement is the better investment',
        paragraphs: ['When wear is widespread, repeated repairs rarely hold and cost more over time.'],
        bullets: [
          'Shingles curling, cupping or cracking across large areas',
          'Heavy granule loss, with bare patches or granules piling up in gutters',
          'Leaks showing up in several different places',
          'Daylight visible through the roof boards in the attic',
          'A roof at or past the typical life of its shingles',
        ],
      },
      {
        heading: 'How long do shingles last here?',
        paragraphs: [
          'Basic three-tab shingles often last around 15 to 20 years and architectural shingles around 25 to 30. Freeze-thaw cycles, ice dams, heavy snow, strong coastal wind, poor attic ventilation and sun exposure can all shorten that. Age matters, but condition matters more.',
        ],
      },
      {
        heading: 'What you can safely check yourself',
        paragraphs: [
          'Do not climb onto the roof. From the ground, look for missing or curling shingles, stains on ceilings and walls, rust or debris at flashing, and granules at the bottom of downspouts. In the attic with a flashlight, look for damp insulation, stained wood and daylight.',
        ],
      },
      {
        heading: 'What to do next',
        paragraphs: [
          'Take photos of anything you find, note when leaks appear (after rain, snowmelt or wind), and get the roof looked at before the next season. Catching a small problem early almost always costs less than waiting.',
        ],
      },
    ],
  },
  {
    slug: 'ice-dams-causes-and-prevention',
    title: 'Ice Dams: What Causes Them and How to Prevent Them',
    metaDescription:
      'Ice dams form when heat escapes into the attic and melts roof snow. Learn the causes, safe short-term steps, and the lasting fixes for New England homes.',
    published: '2026-10-05',
    minutes: 4,
    service: 'roofing',
    intro:
      'Ice dams are ridges of ice that build up along the eaves in winter and push meltwater back under the shingles. They are one of the most common causes of winter roof leaks in New England, and they are usually a symptom of what is happening in the attic.',
    sections: [
      {
        heading: 'What causes an ice dam',
        paragraphs: [
          'Heat from the living space escapes into the attic and warms the roof deck. Snow on the warm part of the roof melts, runs down to the cold eave, and refreezes. Over days the ice builds up and traps meltwater behind it, which can seep under shingles and into the house.',
        ],
      },
      {
        heading: 'Signs you have one',
        bullets: [
          'Thick ice along the lower edge of the roof, often with large icicles',
          'Water stains on ceilings or walls near exterior walls',
          'Peeling paint or damp insulation near the eaves',
          'Gutters pulled away or bent under ice',
        ],
      },
      {
        heading: 'Safe short-term steps',
        paragraphs: ['These reduce damage while you arrange a lasting fix.'],
        bullets: [
          'Clear snow from the lower few feet of the roof with a long-handled roof rake, working from the ground',
          'Never chip or pick at the ice with tools; it damages shingles and can hurt you',
          'If water is entering the house, move belongings, protect floors, and call a professional',
        ],
      },
      {
        heading: 'Lasting fixes',
        paragraphs: [
          'The permanent solution is keeping the roof deck cold and even: seal air leaks from the living space into the attic, add insulation to a suitable level, and make sure the attic is properly ventilated. Roof work such as replacing damaged shingles or flashing helps, but it does not remove the cause on its own.',
        ],
      },
      {
        heading: 'When to call for help',
        paragraphs: [
          'If ice dams return every winter, or you see interior water stains, have the roof and attic looked at before the next cold season. Fall is the best time to deal with it.',
        ],
      },
    ],
  },
  {
    slug: 'deck-repair-or-rebuild',
    title: 'Deck Repair vs. Rebuild: How to Decide',
    metaDescription:
      'How to tell whether a wood deck can be repaired or needs a rebuild: the rot checks that matter, what a ledger board is, and when a permit is likely needed.',
    published: '2026-10-05',
    minutes: 4,
    service: 'carpentry',
    intro:
      'Decks are exposed to rain, snow, sun and foot traffic year after year. Surface boards can look rough while the structure underneath is fine, and the reverse is just as common. Knowing what to check helps you decide between a repair and a rebuild.',
    sections: [
      {
        heading: 'Start with the structure, not the boards',
        paragraphs: [
          'Decking boards are the easiest and cheapest part to replace. What decides repair versus rebuild is the frame: the posts, beams, joists and the ledger, the board that attaches the deck to the house.',
        ],
      },
      {
        heading: 'Simple checks you can do',
        bullets: [
          'Probe wood with a screwdriver at post bases, joist ends and the ledger; soft or crumbly wood is rotted',
          'Look for rust, loose or missing fasteners and flashing gaps where the deck meets the house',
          'Push on railings and posts; any movement is a safety concern',
          'Look underneath for sagging joists, cracked posts or ground-contact rot',
          'Check stairs for loose treads and stringers',
        ],
      },
      {
        heading: 'When repair makes sense',
        paragraphs: [
          'If the posts, beams, joists and ledger are sound and the damage is limited to some boards, railings or stair parts, repairs and refinishing can add many years.',
        ],
      },
      {
        heading: 'When to rebuild',
        paragraphs: [
          'Rot in the ledger, multiple posts or many joists, a deck that pulls away from the house, or a frame that was never built to code are reasons to rebuild rather than patch. A weak ledger connection is among the most serious deck failures.',
        ],
      },
      {
        heading: 'Permits',
        paragraphs: [
          'In Massachusetts, new decks and structural changes generally need a building permit from your town. Small like-for-like repairs often do not, but rules vary, so ask your local building department before starting.',
        ],
      },
    ],
  },
  {
    slug: 'fall-home-maintenance-checklist-massachusetts',
    title: 'Fall Home Maintenance Checklist for Massachusetts Homes',
    metaDescription:
      'A practical fall checklist for New England homes: gutters, roof, caulking, outdoor water, trees, steps and heating, so winter does not catch you out.',
    published: '2026-10-05',
    minutes: 4,
    service: 'seasonal-upkeep',
    intro:
      'Winter is hard on a house, and most winter damage starts with something that could have been handled in October. Work through this list before the first hard freeze.',
    sections: [
      {
        heading: 'Gutters and roof',
        bullets: [
          'Clean gutters and downspouts after most leaves have fallen',
          'Make sure downspouts discharge several feet away from the foundation',
          'Look for missing, curled or damaged shingles and worn flashing',
          'Trim branches that hang over or rub against the roof',
        ],
      },
      {
        heading: 'Seal the envelope',
        bullets: [
          'Refresh cracked caulk around windows, doors and trim',
          'Replace worn weatherstripping and door sweeps',
          'Seal gaps where pipes, cables and vents enter the house',
        ],
      },
      {
        heading: 'Water and plumbing',
        bullets: [
          'Disconnect outdoor hoses and shut off and drain exterior spigots as designed',
          'Know where your main water shut-off is',
          'Insulate exposed pipes in unheated spaces',
        ],
      },
      {
        heading: 'Outside and safety',
        bullets: [
          'Inspect steps, railings and walkways for hazards before ice arrives',
          'Rake leaves off lawns and beds so they do not smother grass',
          'Store or cover outdoor furniture and equipment',
          'Test smoke and carbon monoxide alarms and replace batteries',
        ],
      },
      {
        heading: 'Heating',
        paragraphs: [
          'Have the heating system serviced, replace filters, and have chimneys and flues inspected if you use a fireplace or wood stove. Book early; the busy season starts when it gets cold.',
        ],
      },
    ],
  },
  {
    slug: 'spring-home-maintenance-checklist-new-england',
    title: 'Spring Home Maintenance Checklist After a New England Winter',
    metaDescription:
      'What to inspect and repair after winter: roof and gutters, foundation drainage, decks, siding and paint, windows, and yard cleanup for New England homes.',
    published: '2026-10-05',
    minutes: 4,
    service: 'seasonal-upkeep',
    intro:
      'Freeze-thaw cycles, snow load and wind leave their mark by the end of winter. A careful spring walk-around finds problems while they are still small and gets the house ready for the busy outdoor season.',
    sections: [
      {
        heading: 'Roof and gutters',
        bullets: [
          'From the ground, look for shingles that lifted, cracked or went missing',
          'Check for stains on ceilings and in the attic that appeared after snowmelt',
          'Clear gutters of debris and make sure they are still firmly attached and sloped',
        ],
      },
      {
        heading: 'Foundation and drainage',
        bullets: [
          'Look for new cracks in foundation walls or concrete steps',
          'Make sure soil slopes away from the house and downspouts drain well',
          'Check the basement for dampness after heavy rain',
        ],
      },
      {
        heading: 'Siding, trim, paint and windows',
        bullets: [
          'Look for peeling paint, soft trim, and gaps in caulk',
          'Check window and door seals and screens',
          'Wash siding to reveal problems and refresh the finish',
        ],
      },
      {
        heading: 'Decks, porches and walkways',
        bullets: [
          'Probe post bases and joists for soft wood',
          'Tighten loose railings and fasteners',
          'Plan to sweep, clean and, if needed, reseal or stain once the weather settles',
        ],
      },
      {
        heading: 'Yard',
        paragraphs: [
          'Once the ground has thawed and is no longer soggy, clear leaves and branches, cut back dead growth, edge beds and refresh mulch to about two to three inches, keeping it away from the house and trunks.',
        ],
      },
    ],
  },
]

export const getGuide = (slug) => GUIDES.find((g) => g.slug === slug)
