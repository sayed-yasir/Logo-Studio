(function (root) {
  'use strict';

  const GENERIC_PATTERNS = [
    { re: /generic|stock|clip[- ]?art|template|common icon/i, penalty: 14 },
    { re: /handshake|globe|upward arrow|dollar sign|bar chart|shopping bag|shopping cart|tag icon|chef hat|fork and knife|coffee cup|wheat|hanger|camera icon|paint brush|skull|controller|shield/i, penalty: 10 },
    { re: /random (?:circle|triangle|square|shape|symbol)|decorative detail|ornamental clutter/i, penalty: 8 }
  ];

  const CUES = [
    'one unexpected but brand-relevant visual decision',
    'a distinctive master silhouette that remains recognizable at small size',
    'one subtle hidden meaning or secondary reading where it strengthens the concept',
    'non-obvious proportion or intersection derived from the brand idea',
    'avoid interchangeable stock-logo construction'
  ];

  function textOf(analysis, concept) {
    return [
      concept?.visualIdea, concept?.symbolLogic, concept?.meaning,
      concept?.shapeDirection, concept?.typographyDirection,
      analysis?.brief?.subject, analysis?.brief?.description, ...(analysis?.brief?.keywords || [])
    ].filter(Boolean).join(' ');
  }

  function score(analysis, concept) {
    const text = textOf(analysis, concept);
    let value = 62;
    GENERIC_PATTERNS.forEach(rule => { if (rule.re.test(text)) value -= rule.penalty; });
    if (/distinctive|custom|brand-specific|non-literal|negative space|hidden|unexpected|fused|signature|modular/i.test(text)) value += 10;
    if (/literal/i.test(text)) value -= 5;
    if ((analysis?.brief?.keywords || []).length >= 2) value += 4;
    if (/negativeSpace|symbolFusion|abstract|modular|monogram|wordmark/i.test(concept?.id || '')) value += 4;
    return Math.max(0, Math.min(100, value));
  }

  function directives(analysis, concept) {
    const originality = score(analysis, concept);
    const out = [];
    if (originality < 70) out.push(CUES[0], CUES[4]);
    if (originality < 78) out.push(CUES[1]);
    if (/negativeSpace|symbolFusion|abstract|monogram/i.test(concept?.id || '')) out.push(CUES[2]);
    out.push('keep the final mark simple enough to reproduce, trademark-distinct in spirit, and visually ownable');
    return [...new Set(out)].slice(0, 5);
  }

  root.LogoStudioOriginalityEngine = {
    score,
    directives,
    analyze(analysis, concept) {
      const originality = score(analysis, concept);
      return {
        score: originality,
        level: originality >= 82 ? 'high' : originality >= 70 ? 'good' : 'needs refinement',
        directives: directives(analysis, concept)
      };
    }
  };
})(window);
