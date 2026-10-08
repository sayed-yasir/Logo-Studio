/* Stage 6 — specialized industry intelligence. Local data only. */
(function (root) {
  'use strict';
  const common = {
    coding: {
      priorityTypes: ['modular','monogram','abstract','negativeSpace'],
      symbol: ['algorithmic structure','architecture of logic','initial abstraction','data flow rhythm'],
      avoid: ['literal laptop','keyboard icon','generic </> brackets','stock code window','random terminal screenshot'],
      promptLogic: 'derive the symbol from programming structure or the brand initials; communicate developer identity without literal coding clichés'
    },
    gaming: {
      priorityTypes: ['symbolFusion','emblem','abstract','monogram'],
      symbol: ['competitive motion','custom clan silhouette','controlled aggression','character abstraction'],
      avoid: ['generic shield','random flames','generic skull','stock controller icon','excessive ornamental spikes'],
      promptLogic: 'build a bold game-ready silhouette with a memorable profile and controlled aggression; avoid generic esports symbols'
    },
    business: {
      priorityTypes: ['monogram','geometric','negativeSpace','wordmark'],
      symbol: ['strategic connection','framework','forward structure','initial abstraction'],
      avoid: ['generic handshake','generic bar chart','stock globe','generic arrow'],
      promptLogic: 'communicate credibility and strategic clarity through proportion, structure, and a distinctive brand-specific symbol'
    },
    finance: {
      priorityTypes: ['geometric','monogram','negativeSpace','wordmark'],
      symbol: ['balance','secure structure','measured growth','trust geometry'],
      avoid: ['generic upward arrow','generic dollar sign','generic bar chart','stock coin imagery'],
      promptLogic: 'express trust and measured progress through stable geometry and a restrained silhouette rather than literal financial icons'
    },
    retail: {
      priorityTypes: ['symbolFusion','wordmark','geometric','monogram'],
      symbol: ['product abstraction','memorable letterform','consumer gesture','compact icon system'],
      avoid: ['generic shopping bag','generic cart','generic price tag'],
      promptLogic: 'create a memorable consumer-facing mark that remains clear at storefront, packaging, and small digital sizes'
    },
    fashion: {
      priorityTypes: ['monogram','wordmark','negativeSpace','abstract'],
      symbol: ['signature gesture','editorial monogram','refined silhouette','letterform intervention'],
      avoid: ['generic hanger','generic clothing silhouette','ornamental crown','random luxury crest'],
      promptLogic: 'use refined proportion, custom lettering, and restrained symbolism to create a distinctive fashion identity'
    },
    creative: {
      priorityTypes: ['abstract','symbolFusion','wordmark','negativeSpace'],
      symbol: ['visual metaphor','art-directed gesture','unexpected form','editorial abstraction'],
      avoid: ['generic camera icon','generic paint brush','generic music note'],
      promptLogic: 'translate the creative discipline into an unexpected but simple visual metaphor with art-directed typography'
    },
    restaurant: {
      priorityTypes: ['symbolFusion','emblem','wordmark','negativeSpace'],
      symbol: ['culinary gesture','ingredient abstraction','place identity','crafted emblem'],
      avoid: ['generic chef hat','fork and knife cliché','generic plate icon'],
      promptLogic: 'communicate appetite, craft, and place through a simple distinctive mark rather than literal food clip-art'
    },
    coffee: {
      priorityTypes: ['symbolFusion','negativeSpace','wordmark','monogram'],
      symbol: ['bean-leaf relationship','roasting gesture','origin story','ritual abstraction'],
      avoid: ['generic coffee cup','generic steaming mug','literal bean clip-art'],
      promptLogic: 'use a reduced coffee-specific metaphor with a strong silhouette and warm crafted typography'
    },
    bakery: {
      priorityTypes: ['symbolFusion','wordmark','emblem','monogram'],
      symbol: ['grain abstraction','bread contour','oven gesture','crafted initial'],
      avoid: ['generic bread loaf','chef hat','generic wheat bundle'],
      promptLogic: 'express craft and warmth with a simple food-related abstraction and friendly distinctive lettering'
    },
    premium: {
      priorityTypes: ['monogram','wordmark','negativeSpace','abstract'],
      symbol: ['signature proportion','refined monogram','quiet luxury geometry','subtle hidden meaning'],
      avoid: ['generic crown','generic diamond','excessive ornament','fake crest details'],
      promptLogic: 'achieve premium character through restraint, proportion, custom typography, and one memorable structural detail'
    }
  };
  root.LogoStudioSpecializedRules = common;
})(window);
