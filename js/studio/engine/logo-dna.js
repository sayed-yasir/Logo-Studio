(function (root) {
  'use strict';
  const rules = root.LogoStudioRules;
  root.LogoStudioDNAGenerator = {
    generate(analysis, concept) {
      const b = analysis.brief;
      const industry = analysis.industry || {};
      const style = root.LogoStudioStyleEngine.resolve(b.style);
      const personality = b.personality.map(key => rules.personality[key] || key).join('; ');
      const color = b.preferredColors.length
        ? b.preferredColors.join(', ')
        : (industry.colorDirections || ['restrained brand-led palette']).join(', ');
      const application = b.application.length
        ? b.application.map(key => (rules.applications[key] || {}).requirements || key).flat().join('; ')
        : 'remain recognizable across common digital and print sizes';
      const meaning = [concept.meaning, b.keywords.length ? `keyword cues: ${b.keywords.join(', ')}` : ''].filter(Boolean).join('; ');
      let dna = root.LogoStudioDomain.createDNA({
        shape: `${concept.shapeDirection}; ${style.shape}`,
        symbol: concept.symbolLogic,
        geometry: `${style.geometry}; ${concept.shapeDirection}; construction must remain precise and reproducible`,
        meaning,
        typography: `${concept.typographyDirection}; ${style.typography}`,
        color: `${color}; ${style.color}${b.colorRestrictions.length ? `; avoid ${b.colorRestrictions.join(', ')}` : ''}`,
        composition: `${concept.compositionDirection}; ${style.composition}; ${application}`,
        personality: personality || 'distinctive, clear, brand-specific',
        recognition: `Prioritize a memorable silhouette, clear negative space, and legibility at small sizes${style.avoid.length ? `; avoid ${style.avoid.join(', ')}` : ''}`
      });
      if (root.LogoStudioRenderIntelligence) dna = root.LogoStudioRenderIntelligence.enhanceDNA(analysis, dna);
      return dna;
    }
  };
})(window);
