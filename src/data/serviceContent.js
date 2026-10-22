// src/data/serviceContent.js
// One entry per service page (/services/:slug). Keep the wording specific and true to how YOU work.
// Do not add claims you cannot back up (prices, warranty lengths, license numbers) - those belong in written estimates
// and in SITE.credentials (src/config/site.js).

export const SERVICES = [
  {
    slug: 'roofing',
    name: 'Roofing',
    title: 'Roof Repair & Shingle Replacement',
    metaDescription:
      'Roof leak repair, shingle replacement, flashing and storm-damage assessment for homes in Essex County, MA. Request a free estimate from PrimeFix Solutions.',
    headline: 'Roof repair and shingle replacement in Essex County, MA',
    intro:
      'New England roofs take wind, ice, snow load and salt air. Most roof problems start small: a few lifted shingles, tired flashing, a clogged gutter. We repair what can be repaired and tell you plainly when a section or the whole roof needs replacing.',
    covers: [
      'Shingle repair and replacement',
      'Flashing and leak repair around chimneys, vents and valleys',
      'Gutter installation and repair',
      'Storm damage assessment and temporary protection',
    ],
    signs: [
      'Missing, curling, cracked or lifted shingles',
      'Shingle granules collecting in gutters or at downspouts',
      'Water stains on ceilings or walls, or daylight visible in the attic',
      'Icicles or ice building up along the eaves in winter',
      'Moss or dark streaking that keeps coming back',
    ],
    faqs: [
      {
        q: 'How long does an asphalt shingle roof last?',
        a: 'Basic three-tab shingles often last around 15 to 20 years and architectural shingles around 25 to 30, but sun exposure, attic ventilation and installation quality all change that. A close look at the roof tells you more than its age alone.',
      },
      {
        q: 'Can a small leak be repaired without replacing the roof?',
        a: 'Often, yes. When damage is limited to flashing or a handful of shingles and the rest of the roof is in decent shape, a repair is the sensible choice. Widespread wear or repeated leaks in different places usually point toward replacement.',
      },
      {
        q: 'What causes ice dams, and does a roofer fix them?',
        a: 'Ice dams form when heat escaping from the attic melts snow that then refreezes at the cold eaves. The lasting fix is usually air sealing, insulation and ventilation in the attic, sometimes alongside roof repairs. Roof work alone will not remove the cause.',
      },
    ],
    related: ['seasonal-upkeep', 'carpentry'],
  },
  {
    slug: 'carpentry',
    name: 'Carpentry',
    title: 'Deck Repair, Rebuilds & Carpentry',
    metaDescription:
      'Deck repair and rebuilds, trim, framing and rot repair for homes in Essex County, MA. Request a free estimate from PrimeFix Solutions.',
    headline: 'Deck repair, rot repair and finish carpentry in Essex County, MA',
    intro:
      'Wood outside lives a hard life. Decks, porches, stairs and trim rot where water sits, and the damage you can see is often smaller than the damage you cannot. We repair what is sound, replace what is not, and explain the difference before work starts.',
    covers: [
      'Deck and porch repair, rebuilds and new builds',
      'Stairs and railings',
      'Trim and finish carpentry',
      'Framing, rot and structural repair',
    ],
    signs: [
      'Soft or spongy boards, or a screwdriver that sinks into the wood',
      'Railings or stairs that move when you lean on them',
      'A deck that bounces, sags or pulls away from the house',
      'Rot at post bases, window sills, door frames or trim',
      'Rusted or loose fasteners and brackets',
    ],
    faqs: [
      {
        q: 'Should I repair or rebuild my deck?',
        a: 'If the framing, posts and the connection to the house are sound and the damage is limited to boards or railings, repair usually makes sense. If joists, posts or the ledger are rotted or the structure is unsafe, rebuilding is the safer path.',
      },
      {
        q: 'Do I need a permit for deck work in Massachusetts?',
        a: 'New decks and structural changes generally need a building permit through your town. Minor like-for-like repairs often do not, but rules differ by town, and your local building department has the final say.',
      },
      {
        q: 'Is composite decking better than wood?',
        a: 'Composite costs more up front and needs less upkeep; wood costs less and needs regular sealing or staining. Either one lasts only as long as the framing and flashing underneath it, which is where most problems start.',
      },
    ],
    related: ['painting-finishing', 'handyman-repairs'],
  },
  {
    slug: 'painting-finishing',
    name: 'Painting & finishing',
    title: 'Interior & Exterior Painting',
    metaDescription:
      'Interior painting, exterior painting and staining, and deck sealing for homes in Essex County, MA. Request a free estimate from PrimeFix Solutions.',
    headline: 'Interior and exterior painting in Essex County, MA',
    intro:
      'A paint job is mostly preparation. Scraping, sanding, repairing and priming decide whether it lasts three years or ten, and the finish coat is the easy part. We prep properly and match the product to the surface and the weather.',
    covers: [
      'Interior painting and touch-up work',
      'Exterior painting and staining',
      'Deck sealing and refinishing',
      'Trim, doors and small finishing jobs',
    ],
    signs: [
      'Peeling, bubbling or chalky exterior paint',
      'Bare or graying wood on siding, trim or decks',
      'Stains, scuffs or yellowing that cleaning does not fix',
      'Cracked caulk around windows, doors and trim',
      'Water stains that have been repaired and need refinishing',
    ],
    faqs: [
      {
        q: 'When can exterior painting be done in New England?',
        a: 'Most exterior paints need dry weather and air and surface temperatures above roughly 40 to 50 degrees, so the main season runs from late spring into early fall. Interior work can happen any time of year.',
      },
      {
        q: 'My house was built before 1978. Does that matter?',
        a: 'Yes. Older paint may contain lead, and federal rules require lead-safe work practices by certified firms when painted surfaces are disturbed in pre-1978 homes. Ask any painter about lead-safe certification before work begins.',
      },
      {
        q: 'How often does exterior paint need redoing?',
        a: 'It varies with the surface, the paint and sun and weather exposure, but many exterior paint jobs last roughly 7 to 10 years when the prep was done well. South- and west-facing walls and decks tend to wear fastest.',
      },
    ],
    related: ['carpentry', 'handyman-repairs'],
  },
  {
    slug: 'handyman-repairs',
    name: 'Handyman & repairs',
    title: 'Handyman & Home Repairs',
    metaDescription:
      'Drywall repair, doors, hardware, small carpentry and general home repairs in Essex County, MA. Request a free estimate from PrimeFix Solutions.',
    headline: 'Handyman and home repairs in Essex County, MA',
    intro:
      'Every house has a list: the door that sticks, the hole in the drywall, the loose railing, the fixture that was never hung. We work through the list in as few visits as possible, and we tell you honestly when a job belongs to a licensed specialist instead.',
    covers: [
      'Drywall and interior repair',
      'Doors, locks and hardware',
      'Fixture and accessory installs',
      'General repairs and small carpentry',
    ],
    signs: [
      'A growing list of small repairs you keep putting off',
      'Doors or windows that stick, rub or will not latch',
      'Cracks, holes or water-damaged patches in drywall',
      'Loose handrails, shelving or hardware',
      'A property that needs a reliable person between tenants or sales',
    ],
    faqs: [
      {
        q: 'What kinds of jobs are too big or too specialized for a handyman?',
        a: 'Work in regulated trades such as electrical, gas and most plumbing must be done by licensed tradespeople in Massachusetts. If your job needs one, we will say so rather than stretch beyond what is allowed.',
      },
      {
        q: 'Can you handle a long list of small jobs in one visit?',
        a: 'That is the best way to use a handyman. Send us the whole list, or walk us through it, and we will group the tasks so there are fewer visits and one clear price.',
      },
      {
        q: 'Do you work for landlords and property managers?',
        a: 'Yes. Turnover repairs, punch lists and recurring maintenance across several units are common requests. Tell us how many properties and we will talk through a schedule that fits.',
      },
    ],
    related: ['carpentry', 'painting-finishing'],
  },
  {
    slug: 'yard-grounds',
    name: 'Yard & grounds',
    title: 'Yard Cleanup, Mulching & Grounds Care',
    metaDescription:
      'Spring and fall cleanups, mowing, mulching and brush clearing for properties in Essex County, MA. Request a free estimate from PrimeFix Solutions.',
    headline: 'Yard cleanup, mulching and grounds care in Essex County, MA',
    intro:
      'A cared-for yard protects the house as much as it improves the curb appeal. Clear beds, trimmed shrubs and a dry foundation perimeter keep moisture and pests away from the building. We handle the seasonal work so it happens on time.',
    covers: [
      'Mowing and trimming',
      'Spring and fall cleanups',
      'Mulching and bed work',
      'Brush and branch clearing',
    ],
    signs: [
      'Leaves and debris smothering lawn and beds',
      'Overgrown shrubs touching siding or the roof edge',
      'Bare, weedy or washed-out garden beds',
      'Storm-fallen branches and brush',
      'A property you manage that needs a regular schedule',
    ],
    faqs: [
      {
        q: 'When should spring cleanup happen in Massachusetts?',
        a: 'Usually once the ground has thawed and is no longer soggy, often in April. Working on wet lawns compacts the soil, so timing depends on the spring.',
      },
      {
        q: 'How much mulch should go in a bed?',
        a: 'About two to three inches is a good rule. Keep mulch pulled back from tree trunks and house siding; piling it against them holds moisture and invites rot and pests.',
      },
      {
        q: 'How short should the lawn be cut?',
        a: 'For the cool-season grasses common in New England, around three to four inches, and no more than about a third of the blade at a time. Cutting too short stresses the lawn and lets weeds in.',
      },
    ],
    related: ['seasonal-upkeep', 'handyman-repairs'],
  },
  {
    slug: 'seasonal-upkeep',
    name: 'Seasonal upkeep',
    title: 'Seasonal Home Maintenance',
    metaDescription:
      'Gutter cleaning, winterizing, spring turnover and roof checks for homes in Essex County, MA. See PrimeFix Solutions seasonal maintenance.',
    headline: 'Seasonal home maintenance in Essex County, MA',
    intro:
      'Most expensive repairs begin as small, ignored maintenance. A clogged gutter becomes rotted fascia; a cracked caulk line becomes a wet wall. A simple seasonal routine catches these early, and we can run that routine for you.',
    covers: [
      'Gutter cleaning',
      'Winterizing',
      'Spring turnover and inspection',
      'Roof snow-load checks',
    ],
    signs: [
      'You are not sure when the gutters were last cleaned',
      'Downspouts that dump water against the foundation',
      'Trees with branches hanging over the roof',
      'Cracked caulk or worn weatherstripping at windows and doors',
      'A second home or rental that sits empty part of the year',
    ],
    faqs: [
      {
        q: 'What belongs on a fall maintenance checklist in New England?',
        a: 'Clean gutters and downspouts, direct water away from the foundation, seal gaps and refresh caulk, disconnect outdoor hoses, look over the roof and chimney flashing, trim branches over the roof, and check steps and railings before ice arrives.',
      },
      {
        q: 'How often should gutters be cleaned?',
        a: 'At least twice a year, typically in late fall after the leaves drop and again in spring. Homes with lots of trees may need more.',
      },
      {
        q: 'Is there a plan for regular visits?',
        a: 'Yes, we offer seasonal maintenance plans. You can read the details on the maintenance plans page.',
      },
    ],
    related: ['roofing', 'yard-grounds'],
  },
]

export const getService = (slug) => SERVICES.find((s) => s.slug === slug)
