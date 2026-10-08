/* Logo Studio — Stage 9 application / mockup intelligence. */
(function (root) {
  'use strict';
  const rules = root.LogoStudioApplicationRules || {};
  const aliases = {
    web: 'website', website: 'website', mobile: 'mobile', app: 'appIcon', 'app icon': 'appIcon', social: 'social', instagram: 'social', clothing: 'clothing', apparel: 'clothing', packaging: 'packaging', 'business card': 'businessCard', businesscard: 'businessCard', signage: 'signage', billboard: 'billboard', product: 'product', vehicle: 'vehicle', building: 'building', architecture: 'building'
  };
  function keyOf(value) { const raw = String(value || '').trim().toLowerCase(); return aliases[raw] || raw.replace(/\s+/g, ''); }
  function unique(list) { return [...new Set(list.filter(Boolean))]; }
  function resolve(requested) {
    const list = Array.isArray(requested) ? requested : (requested ? [requested] : []);
    const keys = unique(list.map(keyOf).filter(k => rules[k]));
    return keys.map(k => ({ key: k, ...rules[k] }));
  }
  root.LogoStudioApplicationIntelligence = {
    resolve,
    analyze(analysis, concept) {
      const selected = resolve(analysis?.brief?.application);
      const fallback = selected.length ? selected : [{ key: 'core', label: 'Core Identity', priorities: ['scalability','recognition','master mark'], shape: 'balanced scalable silhouette', typography: 'legible custom typography', composition: 'primary master lockup plus compact mark', color: 'reliable full-color and one-color fallback', avoid: ['application-specific fragility'] }];
      const combined = field => unique(fallback.flatMap(r => Array.isArray(r[field]) ? r[field] : [r[field]]));
      const direction = {
        selected: fallback.map(r => r.key), labels: fallback.map(r => r.label),
        priorities: combined('priorities'), shape: combined('shape'), typography: combined('typography'), composition: combined('composition'), color: combined('color'), avoid: combined('avoid')
      };
      direction.mockup = fallback.filter(r => r.key !== 'core').map(r => `${r.label}: demonstrate ${r.priorities.slice(0,2).join(' and ')}`).join('; ');
      direction.conceptFit = concept ? `Preserve ${concept.name} silhouette and symbol logic across every application` : '';
      return direction;
    },
    enhanceDNA(analysis, dna) {
      const app = this.analyze(analysis);
      return { ...dna, shape: `${dna.shape}; application: ${app.shape.slice(0,2).join(', ')}`, typography: `${dna.typography}; ${app.typography.slice(0,2).join(', ')}`, composition: `${dna.composition}; ${app.composition.slice(0,2).join(', ')}`, color: `${dna.color}; ${app.color.slice(0,2).join(', ')}`, recognition: `${dna.recognition}; ${app.priorities.slice(0,2).join(', ')}` };
    },
    promptDirectives(analysis, concept) {
      const app = this.analyze(analysis, concept);
      const out = [];
      if (app.labels.length) out.push(`application direction: ${app.labels.join(', ')}`);
      if (app.priorities.length) out.push(`application priorities: ${app.priorities.slice(0,6).join(', ')}`);
      if (app.shape.length) out.push(`application shape: ${app.shape.slice(0,2).join(', ')}`);
      if (app.composition.length) out.push(`application composition: ${app.composition.slice(0,2).join(', ')}`);
      if (app.mockup) out.push(`mockup direction: ${app.mockup}`);
      if (app.avoid.length) out.push(`application avoid: ${app.avoid.slice(0,6).join(', ')}`);
      return unique(out);
    }
  };
})(window);
