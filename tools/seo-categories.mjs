// Content for the 20 public category pages.
// `id` must match the category id used by the app (#/?c=ID and #/search?c=ID).
// Slugs become /<slug>-logo-prompts/ under SITE_URL.
export const CATEGORIES = [
  {
    id: "monogram", slug: "monogram", name: "Monogram", h1: "Monogram Logo Prompts",
    title: "Monogram Logo Prompts for Initial-Based Marks | Logo Studio",
    description: "Explore monogram logo prompts built around initials, interlocking letters and shared strokes, then customize them with your brand name in Logo Studio.",
    intro: "A monogram turns the initials of a name into one compact mark. This page explains the monogram direction and what to consider before you generate a prompt for it.",
    style: [
      "Monograms work by fusing two or three letters so they share strokes, overlap or interlock into a single silhouette. The aim is a form that reads as one unit while the letters stay legible. Strong monograms usually rest on a clear construction idea, such as a shared vertical stroke, a mirrored pair, or one letter nested inside another.",
      "Because the result is small and self-contained, a monogram is also a practical way to give a long name a short visual form."
    ],
    suits: "Personal brands and studios named after people, law and consulting firms, fashion and hospitality labels, and any identity that needs a compact mark for stamps, favicons and packaging seals.",
    considerations: [
      "Check that the initials still read in the right order at small sizes.",
      "Watch for letter pairs that collide into an unintended shape.",
      "Test the mark in one color on a plain background before adding detail.",
      "Decide early whether it will stand alone or sit beside the full name."
    ],
    related: ["lettermark", "abstract-letterform", "luxury-premium", "emblem"]
  },
  {
    id: "abstract-symbol", slug: "abstract-symbol", name: "Abstract Symbol", h1: "Abstract Symbol Logo Prompts",
    title: "Abstract Symbol Logo Prompts | Logo Studio",
    description: "Browse abstract symbol logo prompts that develop invented shapes with their own internal logic, and customize them with your brand name.",
    intro: "An abstract symbol does not depict an object. It uses shape, proportion and rhythm to stand for a feeling or an idea the brand wants to carry.",
    style: [
      "Since the form is not tied to a literal subject, meaning comes from consistency: repeated angles, balanced weight and a clear logic for how the parts relate. The symbol earns recognition through use rather than instant interpretation.",
      "That makes the construction important. It needs to be simple enough to remember and distinct enough to stay apart from generic swooshes, orbits and circles."
    ],
    suits: "Companies that work across several products or markets where a literal icon would become limiting, technology, finance and consulting brands, and new ventures whose offer may change over time.",
    considerations: [
      "Describe how the shape should feel (stable, open, quick) before you generate.",
      "Compare the result with well-known marks to avoid accidental resemblance.",
      "Pair the symbol with a clear name lockup, since it will not explain the business on its own.",
      "Check it at favicon size, where fine internal detail disappears."
    ],
    related: ["geometric", "symbolic", "minimal", "experimental-mark"]
  },
  {
    id: "wordmark", slug: "wordmark", name: "Wordmark", h1: "Wordmark Logo Prompts",
    title: "Wordmark Logo Prompts for Name-Led Logos | Logo Studio",
    description: "Wordmark logo prompts focused on custom lettering, spacing and ligatures, so the brand name itself becomes the logo. Customize them in Logo Studio.",
    intro: "A wordmark is the brand name set as the logo, with no separate symbol. All of its character comes from the lettering.",
    style: [
      "Distinctiveness lives in details: a modified terminal, a joined pair of letters, an unusual crossbar, carefully tuned spacing. Typeface choice and rhythm matter more here than in any other logo type, because nothing else carries the design.",
      "Short, distinctive names tend to suit this approach best. Longer names can work too, but they need a deliberate rhythm so the line does not feel stretched."
    ],
    suits: "Brands whose name is already memorable and easy to spell, editorial and retail brands, software and service companies that want a quiet, confident identity, and businesses that will mostly appear in horizontal layouts.",
    considerations: [
      "Test legibility on screens and in print at small widths.",
      "Look closely at letter pairs that can blur together, such as r and n beside m.",
      "Plan a compact version or an initial for narrow spaces like app icons.",
      "Keep custom details subtle enough to survive reproduction."
    ],
    related: ["lettermark", "minimal", "elegant", "bold"]
  },
  {
    id: "lettermark", slug: "lettermark", name: "Lettermark", h1: "Lettermark Logo Prompts",
    title: "Lettermark Logo Prompts for Initial Marks | Logo Studio",
    description: "Lettermark logo prompts for compact initial-based marks where letters stay readable but are tuned as one designed form. Try them with your brand name.",
    intro: "A lettermark uses a brand's initials as its logo. Unlike a monogram built on fusion, the letters usually stay separate and recognizable.",
    style: [
      "The design comes from weight, spacing and proportion rather than from joining the letters. Careful kerning, a consistent stroke and a considered typeface turn plain initials into something that feels owned.",
      "Lettermarks are especially useful when a full name is long or formal, because the short form can do the daily work while the full name appears alongside it."
    ],
    suits: "Organizations with long formal names such as associations, institutions and engineering firms, brands better known by an acronym, and teams that need a short, durable mark.",
    considerations: [
      "Choose the letter set deliberately; some acronyms are hard to read or pronounce.",
      "Letter spacing is the main design tool, so review it at several sizes.",
      "Consider how the mark sits next to the full name.",
      "Make sure the initials do not spell an unintended word."
    ],
    related: ["monogram", "wordmark", "abstract-letterform", "bold"]
  },
  {
    id: "negative-space", slug: "negative-space", name: "Negative Space", h1: "Negative Space Logo Prompts",
    title: "Negative Space Logo Prompts for Hidden Forms | Logo Studio",
    description: "Negative space logo prompts for hidden secondary forms, voids and silhouettes that reward a second look. Customize one with your brand name.",
    intro: "Negative space logos use the empty area around and inside shapes to reveal a second image or letter.",
    style: [
      "The idea only works when both readings are clear. The hidden form should emerge naturally from the main shape instead of feeling forced into it, and the two readings should relate to what the brand does or stands for.",
      "Because the effect depends on contrast between filled and empty areas, these marks tend to be built from bold, simple shapes with very little extra detail."
    ],
    suits: "Brands where a double meaning fits the story, design studios, cultural organizations, and companies that benefit from a mark that invites people to look twice.",
    considerations: [
      "Both the visible and the hidden form should be recognizable at a glance.",
      "Simplify before adding anything; clutter weakens the effect.",
      "Test on light and dark backgrounds, since reversing the mark can change which shape reads first.",
      "Check small sizes, where thin gaps can fill in."
    ],
    related: ["symbolic", "minimal", "geometric", "abstract-letterform"]
  },
  {
    id: "geometric", slug: "geometric", name: "Geometric", h1: "Geometric Logo Prompts",
    title: "Geometric Logo Prompts for Grid-Built Marks | Logo Studio",
    description: "Geometric logo prompts based on grids, ratios and simple shapes. Explore structured directions and customize them with your brand name.",
    intro: "Geometric logos are built from circles, squares, triangles and lines that relate to one another through clear proportions.",
    style: [
      "The rigor of a grid communicates order and reliability, but geometry does not have to feel cold. Consistent angles, matching corner radii and a limited set of shapes are what hold a geometric mark together and give it character.",
      "Many geometric marks start from a modular system, which also makes them easy to extend into patterns and icon sets."
    ],
    suits: "Engineering, architecture, fintech, software, education and manufacturing brands, and any identity that wants to project structure and clarity.",
    considerations: [
      "Pick a small set of primitives and keep stroke and corner treatment consistent.",
      "Judge optical balance by eye; mathematically equal shapes can look unequal.",
      "Avoid stacking so many shapes that the idea becomes hard to describe.",
      "Check that the construction survives at small sizes."
    ],
    related: ["minimal", "abstract-symbol", "futuristic", "organic-geometric"]
  },
  {
    id: "minimal", slug: "minimal", name: "Minimal", h1: "Minimal Logo Prompts",
    title: "Minimal Logo Prompts for Reduced, Simple Marks | Logo Studio",
    description: "Minimal logo prompts for reduced marks with one to three elements and generous space. Customize them with your brand name in Logo Studio.",
    intro: "A minimal logo removes everything except what carries the idea. What remains is usually one to three elements and a lot of space.",
    style: [
      "Minimal is not the same as plain. With so few elements, proportion, spacing and a single decisive gesture do all the work, and any weakness is easy to see. The challenge is to stop at the point where the mark is still specific to the brand.",
      "Reduced marks tend to be flexible: they scale well, reproduce in one color and sit comfortably in many layouts."
    ],
    suits: "Studios, consultancies, wellness brands, apps and personal brands, and any business whose mark will appear in many small contexts.",
    considerations: [
      "Aim for one clear gesture and resist adding a second idea.",
      "Check the result does not look like a generic placeholder shape.",
      "Test it in a single color at very small sizes.",
      "Use spacing and alignment deliberately, since they are most of the design."
    ],
    related: ["wordmark", "geometric", "timeless", "negative-space"]
  },
  {
    id: "futuristic", slug: "futuristic", name: "Futuristic", h1: "Futuristic Logo Prompts",
    title: "Futuristic Logo Prompts for Modern Brands | Logo Studio",
    description: "Futuristic logo prompts with precise angles, segmented forms and engineered clarity. Develop a forward-looking direction with your brand name.",
    intro: "Futuristic logos suggest what comes next through precision, using sharp angles, segmented shapes and clean cuts.",
    style: [
      "The most lasting futuristic marks rely on structure rather than effects. Controlled angles, consistent stroke and carefully segmented forms read as engineered, while glows and heavy gradients tend to date quickly.",
      "A restrained typeface usually helps. When the symbol is expressive, calm lettering keeps the whole identity balanced."
    ],
    suits: "Technology, mobility, energy, gaming, research and hardware brands, and startups that want to signal a forward-looking outlook.",
    considerations: [
      "Make sure the mark works flat before adding gradients or glow.",
      "Avoid overused space and orbit imagery unless it relates to the brand.",
      "Check that segmented parts do not fall apart at small sizes.",
      "Pair the symbol with a clean, restrained typeface."
    ],
    related: ["tech-ai", "geometric", "dynamic", "experimental-mark"]
  },
  {
    id: "luxury-premium", slug: "luxury-premium", name: "Luxury Premium", h1: "Luxury Premium Logo Prompts",
    title: "Luxury Premium Logo Prompts for Refined Brands | Logo Studio",
    description: "Luxury premium logo prompts focused on restraint, fine line work and sophisticated typography. Customize a refined direction with your brand name.",
    intro: "A premium identity usually communicates through restraint. Proportion, spacing and craft carry the impression, not decoration.",
    style: [
      "Typical tools include fine line work, high-contrast serif letters or widely spaced capitals, and plenty of empty space around the mark. Ornament is used sparingly so that each detail feels chosen.",
      "Fine details need a production check. A hairline that looks elegant on a screen may disappear in embossing, foil or small digital use."
    ],
    suits: "Jewelry, fashion, fragrance, hospitality, wine and spirits, private services and high-end property brands.",
    considerations: [
      "Check thin strokes in the real materials and sizes you plan to use.",
      "Use generous spacing; crowding undermines a premium feel.",
      "Keep ornament minimal and purposeful.",
      "Prepare a simplified version for very small applications."
    ],
    related: ["elegant", "monogram", "modern-classic", "timeless"]
  },
  {
    id: "tech-ai", slug: "tech-ai", name: "Tech / AI", h1: "Tech / AI Logo Prompts",
    title: "Tech / AI Logo Prompts for Software Brands | Logo Studio",
    description: "Tech and AI logo prompts exploring networks, computational structures and neural-inspired geometry. Customize them with your brand name.",
    intro: "Marks for software and intelligent systems often draw on networks, nodes, grids and layered structures.",
    style: [
      "The hard part is avoiding the generic: the brain outline, the circuit trace and the glowing sphere appear everywhere. A stronger direction ties the form to what the product actually does, such as connecting, sorting, predicting or protecting.",
      "These marks also live in interfaces, so they have to work as app icons and avatars, in both light and dark themes."
    ],
    suits: "AI products, developer tools, data platforms, SaaS companies, security firms and research labs.",
    considerations: [
      "Relate the form to the product's function, not just to technology in general.",
      "Be cautious with motifs that many other AI brands already use.",
      "Test the mark as a small square icon and a circular avatar.",
      "Check legibility on both dark and light interface backgrounds."
    ],
    related: ["futuristic", "geometric", "abstract-symbol", "minimal"]
  },
  {
    id: "emblem", slug: "emblem", name: "Emblem", h1: "Emblem Logo Prompts",
    title: "Emblem Logo Prompts for Badge and Crest Marks | Logo Studio",
    description: "Emblem logo prompts for badges, seals and crests where symbol and name sit in one contained shape. Customize them with your brand name.",
    intro: "An emblem places the symbol and the name inside one contained shape, such as a badge, seal, shield or crest.",
    style: [
      "That containment gives emblems a sense of tradition and craftsmanship, and it makes them well suited to stamps, labels, patches and signage. The trade-off is detail: small text inside a badge becomes hard to read quickly.",
      "Because of this, an emblem usually benefits from a simplified companion version for small and digital uses."
    ],
    suits: "Breweries, coffee roasters, schools, clubs, outdoor brands, craft makers and institutions that want an established, rooted look.",
    considerations: [
      "Keep lettering large enough to remain readable when the badge shrinks.",
      "Prepare a simplified version without fine text for small sizes.",
      "Avoid filling every corner; leave breathing room inside the shape.",
      "Consider embroidery, embossing and stamping if the emblem will be physical."
    ],
    related: ["symbolic", "modern-classic", "timeless", "monogram"]
  },
  {
    id: "symbolic", slug: "symbolic", name: "Symbolic", h1: "Symbolic Logo Prompts",
    title: "Symbolic Logo Prompts for Metaphor Marks | Logo Studio",
    description: "Symbolic logo prompts that use a clear metaphor chosen for the brand name's meaning. Explore the direction and customize it with your brand name.",
    intro: "A symbolic logo uses a recognizable image as a metaphor, such as a path, a seed or a doorway, chosen for its link to the brand's meaning.",
    style: [
      "These marks succeed when the metaphor is clear and the execution is fresh. The first idea that comes to mind is often a cliché, so it helps to push past it and find a version that feels specific to the brand.",
      "A good test is whether the metaphor can be explained in one sentence and still looks distinctive when reduced to a simple silhouette."
    ],
    suits: "Nonprofits, education and healthcare organizations, publishers, and brands with a clear story or mission.",
    considerations: [
      "State the metaphor in a single sentence before you generate.",
      "Move past the most obvious image for your industry.",
      "Reduce the idea to a clean silhouette.",
      "Check what the chosen symbol means in the cultures where the brand will appear."
    ],
    related: ["abstract-symbol", "negative-space", "emblem", "organic-geometric"]
  },
  {
    id: "dynamic", slug: "dynamic", name: "Dynamic", h1: "Dynamic Logo Prompts",
    title: "Dynamic Logo Prompts for Marks with Movement | Logo Studio",
    description: "Dynamic logo prompts with movement, rotation, direction and rhythm built into the structure. Customize a motion-led direction with your brand name.",
    intro: "A dynamic logo suggests movement even though it is static, through rotation, direction and repeated rhythm.",
    style: [
      "Motion is usually built into the structure: angled cuts, forms that seem to turn or advance, and repetition that creates a beat. The direction of movement should fit the brand's meaning, whether that is forward, upward or around.",
      "The risk is instability. A mark that moves in every direction can look unsettled, so balance and a clear anchor point matter."
    ],
    suits: "Sports, logistics, mobility, fitness, media and events brands, and any business that wants to convey progress or energy.",
    considerations: [
      "Choose a direction of movement that matches what the brand stands for.",
      "Balance motion with a stable element so the mark does not look unsteady.",
      "Check how it sits in tight spaces and in different placements.",
      "Make sure the idea still reads when the mark is shown completely still."
    ],
    related: ["futuristic", "bold", "geometric", "abstract-symbol"]
  },
  {
    id: "bold", slug: "bold", name: "Bold", h1: "Bold Logo Prompts",
    title: "Bold Logo Prompts for Heavy, High-Impact Marks | Logo Studio",
    description: "Bold logo prompts built on heavy weight, strong silhouettes and tight counters. Customize a high-impact direction with your brand name.",
    intro: "Bold logos rely on weight and silhouette. Thick shapes and tight counters give them presence from a distance.",
    style: [
      "A bold mark has to be recognizable from its outline alone. Heavy forms hold up well on signage, merchandise and small screens, but they bring their own risk: when counters and gaps get too tight, they can fill in and the shapes blur together.",
      "Contrast with space helps. A heavy form needs room around it so the weight reads as confidence rather than crowding."
    ],
    suits: "Sports, construction, food, retail, events and youth-oriented brands, and any identity that will appear on signage and merchandise.",
    considerations: [
      "Keep counters and gaps open enough to survive printing and reduction.",
      "Make sure the silhouette is recognizable at a glance.",
      "Give heavy shapes enough surrounding space.",
      "Check that fine details do not clog at small sizes."
    ],
    related: ["dynamic", "wordmark", "emblem", "geometric"]
  },
  {
    id: "elegant", slug: "elegant", name: "Elegant", h1: "Elegant Logo Prompts",
    title: "Elegant Logo Prompts for Refined Marks | Logo Studio",
    description: "Elegant logo prompts with graceful curves, calligraphic influence and delicate contrast. Customize a refined direction with your brand name.",
    intro: "Elegant logos favor graceful curves, calligraphic influence and delicate contrast between thick and thin strokes.",
    style: [
      "Elegance comes from flow and balance rather than ornament. Smooth transitions, controlled contrast and well-judged spacing give a mark its poise, while excess flourishes quickly make it feel fussy.",
      "Thin strokes and script details need testing, because the qualities that make them refined are the first to disappear when a logo is small or printed on rough materials."
    ],
    suits: "Beauty, weddings, boutiques, florists, hospitality, publishing and artisan food brands.",
    considerations: [
      "Check that the contrast between thick and thin strokes holds at small sizes.",
      "Use flourishes sparingly and only where they add meaning.",
      "Test script lettering for readability.",
      "Review the mark in one color and on textured surfaces."
    ],
    related: ["luxury-premium", "monogram", "timeless", "modern-classic"]
  },
  {
    id: "timeless", slug: "timeless", name: "Timeless", h1: "Timeless Logo Prompts",
    title: "Timeless Logo Prompts for Classic Marks | Logo Studio",
    description: "Timeless logo prompts that use fundamental shapes, classical proportions and durable construction. Customize them with your brand name.",
    intro: "A timeless logo tries to avoid dating itself. It relies on fundamental shapes, classical proportions and sound construction.",
    style: [
      "No mark is certain to stay current, but marks that avoid trend-driven effects tend to age more gently. Clear geometry, sensible proportion and restrained detail are what this direction emphasizes.",
      "It often means choosing what to leave out: no fashionable gradients, no novelty lettering, nothing that depends on a particular moment."
    ],
    suits: "Law, finance, education, family businesses, manufacturing and long-established institutions.",
    considerations: [
      "Avoid effects that are tied to a current trend.",
      "Favor proportion and construction over decoration.",
      "Test the mark in one color and across a range of sizes.",
      "Ask whether the mark would still make sense for the brand in many years."
    ],
    related: ["modern-classic", "minimal", "emblem", "geometric"]
  },
  {
    id: "abstract-letterform", slug: "abstract-letterform", name: "Abstract Letterform", h1: "Abstract Letterform Logo Prompts",
    title: "Abstract Letterform Logo Prompts | Logo Studio",
    description: "Abstract letterform logo prompts where a letter is stretched, cut or rotated into a symbol. Customize one with your brand name in Logo Studio.",
    intro: "An abstract letterform takes a single letter and transforms it into a symbol, while keeping enough of the original shape to be recognized.",
    style: [
      "This sits between a lettermark and a pure symbol. The letter may be stretched, sliced, rotated or rebuilt from simple parts, and the design succeeds when you see both the letter and something more.",
      "Some letters offer more room for this than others, so the choice of letter and its construction are part of the creative decision."
    ],
    suits: "Brands with a strong one-letter identity, apps and product lines, and studios that want a distinctive mark based on a single initial.",
    considerations: [
      "Make sure the letter stays identifiable after the transformation.",
      "Check that it cannot be mistaken for a different letter.",
      "Compare it with existing letter-based logos to avoid resemblance.",
      "Test it as an app icon and in one color."
    ],
    related: ["monogram", "lettermark", "negative-space", "experimental-mark"]
  },
  {
    id: "organic-geometric", slug: "organic-geometric", name: "Organic Geometric", h1: "Organic Geometric Logo Prompts",
    title: "Organic Geometric Logo Prompts | Logo Studio",
    description: "Organic geometric logo prompts that fuse controlled geometry with natural curves and growth forms. Customize them with your brand name.",
    intro: "Organic geometric logos combine controlled geometry with natural curves, growth patterns and biological structures.",
    style: [
      "The balance is the point: enough structure to feel designed, enough softness to feel alive. Spirals, buds, cells and leaves can all serve as starting points, as long as they are abstracted into clean, consistent curves.",
      "Kept too literal, natural motifs read as clip art. A shared curve logic across the whole mark helps it feel like one idea."
    ],
    suits: "Wellness, sustainability, food, biotech, outdoor, education and cosmetics brands.",
    considerations: [
      "Keep the natural reference abstract so the mark does not look like clip art.",
      "Use a consistent logic for curves and angles.",
      "Be wary of leaf imagery that many brands already use.",
      "Check the mark in a single color."
    ],
    related: ["geometric", "symbolic", "abstract-symbol", "elegant"]
  },
  {
    id: "modern-classic", slug: "modern-classic", name: "Modern Classic", h1: "Modern Classic Logo Prompts",
    title: "Modern Classic Logo Prompts | Logo Studio",
    description: "Modern classic logo prompts that simplify classical structure and proportion with modern restraint. Customize them with your brand name.",
    intro: "Modern classic logos keep the structure and proportion of traditional design but strip it back with modern restraint.",
    style: [
      "Typical cues include classical letterforms, symmetry and crest-like structure, with ornament removed and details cleaned up. The aim is to keep a sense of heritage without it feeling dated or theatrical.",
      "The key decision is which classical cues to keep and which to drop. Keeping them all produces pastiche; dropping them all loses the character."
    ],
    suits: "Restaurants, professional services, publishers, boutique hotels and heritage brands refreshing an older identity.",
    considerations: [
      "Decide which classical cues stay, such as serifs, symmetry or a crest-like frame.",
      "Remove ornament that does not add meaning.",
      "Test in both digital and print contexts.",
      "Avoid copying a historic style too literally."
    ],
    related: ["timeless", "elegant", "emblem", "luxury-premium"]
  },
  {
    id: "experimental-mark", slug: "experimental-mark", name: "Experimental Mark", h1: "Experimental Mark Logo Prompts",
    title: "Experimental Mark Logo Prompts | Logo Studio",
    description: "Experimental mark logo prompts with unconventional construction, unusual symbol logic and optical experiments. Customize them with your brand name.",
    intro: "Experimental marks break from convention through unusual construction, unexpected symbol logic or optical effects.",
    style: [
      "This direction suits brands that want to stand apart rather than fit a category. Even so, a successful experiment usually follows one clear rule that holds it together, so it reads as intentional instead of random.",
      "Optical tricks and unusual constructions can be fragile in production, so they deserve extra testing."
    ],
    suits: "Creative studios, music and culture projects, fashion and art brands, agencies, and businesses in crowded markets that want a memorable identity.",
    considerations: [
      "Define the single rule that organizes the experiment.",
      "Check reproduction in one color and at small sizes, where optical effects can break down.",
      "Keep a simplified fallback version for everyday use.",
      "Make sure the mark is still readable as a brand symbol, not just as an image."
    ],
    related: ["abstract-symbol", "futuristic", "abstract-letterform", "negative-space"]
  }
];
