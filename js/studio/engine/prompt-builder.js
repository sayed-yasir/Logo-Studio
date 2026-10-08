(function (root) {
  'use strict';
  const rules = root.LogoStudioRules;
  const originalityEngine = root.LogoStudioOriginalityEngine;
  const MAX = 820; // short on purpose: every clause must earn its place

  const norm = s => String(s || '').replace(/\s+/g, ' ').trim();

  /* Priority-based fitting. Each part is {t: text, p: priority}.
     p = 0 is never removed (brand, industry and the user's own subject).
     When the prompt is too long, whole clauses with the HIGHEST p number are removed first
     (the last one among equals). Text is never cut in the middle of a word or clause. */
  function fit(parts, max) {
    // Remove clauses that repeat earlier ones (the colour and style rules can emit the same phrase several times).
    const seen = new Set();
    const out = parts.filter(x => x.t).map(x => {
      const kept = x.t.split('; ').filter(c => { const k = c.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
      return { t: kept.join('; '), p: x.p };
    }).filter(x => x.t);
    const len = () => out.map(x => x.t).join('; ').length + 1;
    while (len() > max) {
      let at = -1, worst = 0;
      out.forEach((x, i) => { if (x.p >= worst && x.p > 0) { worst = x.p; at = i; } });
      if (at < 0) break;
      out.splice(at, 1);
    }
    let text = out.map(x => x.t).join('; ');
    if (text.length + 1 > max) {
      // Only protected parts remain and they are still too long: cut at the last clause boundary.
      const cut = text.slice(0, max - 1);
      const i = cut.lastIndexOf('; ');
      text = i > 200 ? cut.slice(0, i) : cut.replace(/\s+\S*$/, '');
    }
    return text + '.';
  }

  function directiveParts(list, kind) {
    return list.map(norm).filter(Boolean).map(t => {
      let p = kind === 'render' ? 3 : 8;
      if (kind === 'application') {
        if (/^application direction/i.test(t)) p = 2;
        else if (/^application priorities/i.test(t)) p = 6;
        else if (/^application avoid/i.test(t)) p = 7;
        else if (/^application composition/i.test(t)) p = 6;
      }
      return { t, p };
    });
  }

  root.LogoStudioPromptBuilder = {
    build(analysis, concept, dna) {
      const b = analysis.brief;
      const style = root.LogoStudioStyleEngine.resolve(b.style);
      const render = root.LogoStudioRenderIntelligence ? root.LogoStudioRenderIntelligence.promptDirectives(analysis) : [];
      const application = root.LogoStudioApplicationIntelligence ? root.LogoStudioApplicationIntelligence.promptDirectives(analysis, concept) : [];
      const originality = originalityEngine ? originalityEngine.analyze(analysis, concept) : null;
      const subject = norm(b.subject);
      const description = norm(b.description);
      const P = (t, p) => ({ t: norm(t), p });
      const logoType = norm(b.logoType).toLowerCase();
      const approach = norm(String(concept.name || '').split(/\s[—–-]\s/).pop());
      const appRequested = Boolean(b.application && b.application.length);

      const parts = [
        // First clause states the task and the logo type, so the image model knows what it is making.
        P(`Design a ${logoType ? logoType + ' ' : 'distinctive '}logo for "${b.brandName || 'the brand'}", a ${analysis.industry.label} brand`, 0),
        // The user's own words come right after the brand so the image model reads them first.
        subject ? P(`the logo must clearly depict: ${subject}`, 0) : null,
        description ? P(`brand context: ${description}`, 1) : null,
        P(`approach: ${approach}`, 6),
        P(`concept: ${concept.visualIdea}`, 2),
        P(`symbol logic: ${concept.symbolLogic}`, 2),
        P(`color: ${dna.color}`, 3),
        P(`shape: ${dna.shape}`, 4),
        P(`typography: ${dna.typography}`, 3),
        P(`geometry: ${dna.geometry}`, 5),
        P(`composition: ${dna.composition}`, 4),
        P(`style direction: ${style.logic.slice(0, 4).join(', ')}`, 8),
        b.desiredFeeling.length ? P(`feeling: ${b.desiredFeeling.join(', ')}`, 7) : null,
        b.targetAudience ? P(`audience: ${b.targetAudience}`, 7) : null,
        b.complexity && rules.complexity[b.complexity] ? P(`detail: ${rules.complexity[b.complexity].logic}`, 8) : null,
        P(`recognition: ${dna.recognition}`, 7),
        originality ? P(`originality: ${originality.directives.join(', ')}`, 8) : null,
        P(`meaning: ${dna.meaning}`, 9),
        style.avoid.length ? P(`avoid: ${style.avoid.slice(0, 5).join(', ')}`, 4) : null,
        P(style.family.includes('render')
          ? 'presentation-ready brand mark, preserve core identity before effects'
          : 'flat vector logo on a plain background, works in one color', 1)
      ].filter(Boolean)
        .concat(directiveParts(render, 'render'), appRequested ? directiveParts(application, 'application') : []);

      return fit(parts, MAX);
    }
  };
})(window);
