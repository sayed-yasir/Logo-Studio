(function (root) {
  'use strict';
  const types = root.LogoStudioLogoTypes;
  const styles = root.LogoStudioStyles;
  const industries = root.LogoStudioIndustries;
  const specialized = root.LogoStudioSpecializedRules || {};
  const originalityEngine = root.LogoStudioOriginalityEngine;

  const BLUEPRINTS = {
    monogram: {
      label: 'Letterform Fusion',
      visual: (i) => `an abstracted initial structure derived from ${i.symbolDirections[0] || 'the brand idea'}`,
      symbol: (b) => `construct the mark from the brand initials, using one intentional overlap or shared stroke rather than literal letter stacking`,
      shape: 'interlocking or nested letter geometry',
      composition: 'compact monogram with optional wordmark',
      typography: 'custom geometric wordmark with spacing matched to the monogram'
    },
    negativeSpace: {
      label: 'Dual-Reading Mark',
      visual: (i) => `a primary silhouette that reveals a second brand-relevant form through negative space`,
      symbol: (b) => `hide a meaningful secondary reading inside the main silhouette; the hidden form must remain legible without adding decorative detail`,
      shape: 'bold enclosing silhouette with deliberate cut-space',
      composition: 'standalone symbol optimized for small sizes',
      typography: 'optional restrained wordmark'
    },
    geometric: {
      label: 'Constructed Geometry',
      visual: (i) => `a reduced geometric system expressing ${i.psychology.slice(0,2).join(' and ')}`,
      symbol: (b) => `translate one brand-specific idea into a small set of repeatable geometric primitives`,
      shape: 'precise geometric primitives and controlled proportions',
      composition: 'balanced standalone mark',
      typography: 'precise geometric sans if text is required'
    },
    symbolFusion: {
      label: 'Symbol Fusion',
      visual: (i) => `two related visual ideas fused into one inseparable silhouette`,
      symbol: (b, i) => `merge a brand-specific cue with ${i.symbolDirections[0] || 'an industry-relevant form'} so the result reads as one original symbol`,
      shape: 'fused contours with one dominant silhouette',
      composition: 'symbol-first combination mark',
      typography: 'custom wordmark subordinate to the symbol'
    },
    abstract: {
      label: 'Meaningful Abstract Mark',
      visual: (i) => `a non-literal form translating ${i.psychology.slice(0,2).join(' and ') } into a memorable silhouette`,
      symbol: (b) => `avoid literal objects; encode the brand idea through proportion, rhythm, interruption, or directional form`,
      shape: 'non-literal sculptural geometry',
      composition: 'standalone abstract mark',
      typography: 'optional custom wordmark'
    },
    modular: {
      label: 'Modular Identity',
      visual: (i) => `a repeatable module system that creates one recognizable master symbol`,
      symbol: (b) => `build the identity from a small reusable module whose arrangement can support a scalable brand system`,
      shape: 'repeatable units with a controlled grid',
      composition: 'modular master mark with scalable variants',
      typography: 'systematic sans wordmark'
    },
    emblem: {
      label: 'Structured Emblem',
      visual: (i) => `a compact contained identity built around ${i.symbolDirections[0] || 'a brand-specific symbol'}`,
      symbol: (b) => `use containment only when it strengthens recognition; avoid ornamental badge clutter`,
      shape: 'contained silhouette with clear hierarchy',
      composition: 'compact emblem with optional wordmark',
      typography: 'legible condensed or refined type matched to the emblem'
    },
    wordmark: {
      label: 'Custom Wordmark',
      visual: (i) => `a distinctive typographic identity where the brand name itself becomes the symbol`,
      symbol: (b) => `create recognition through one or two custom letterform interventions rather than decorative effects`,
      shape: 'customized letterform silhouette',
      composition: 'horizontal wordmark',
      typography: 'custom lettering with deliberate spacing and one memorable modification'
    },
    architectural: {
      label: 'Structural Mark',
      visual: (i) => `a structural abstraction inspired by ${i.symbolDirections[0] || 'space and proportion'}`,
      symbol: (b) => `express the brand through load-bearing relationships, framing, or spatial rhythm rather than literal buildings`,
      shape: 'structural grid and proportional geometry',
      composition: 'architectural symbol with optional wordmark',
      typography: 'precise architectural sans'
    }
  };

  function pickBlueprint(key) {
    return BLUEPRINTS[key] || BLUEPRINTS.symbolFusion;
  }

  function styleLogic(keys) {
    return keys.flatMap(k => (styles[k] && styles[k].logic) || []).slice(0, 4);
  }

  function makeConcept(analysis, typeKey, styleKeys, index) {
    const b = analysis.brief;
    const industry = industries[b.industry] || industries.general;
    const type = types[typeKey] || types.combination;
    const blueprint = pickBlueprint(typeKey);
    const logic = styleLogic(styleKeys);
    const stylePhrase = logic.length ? logic.join(', ') : 'controlled visual restraint';
    const id = [b.industry || 'general', typeKey, ...styleKeys.slice(0,2), index].join('-');

    return root.LogoStudioDomain.createConcept({
      id,
      name: `${industry.label} — ${blueprint.label}`,
      visualIdea: `${blueprint.visual(industry)}, expressed through ${stylePhrase}`,
      symbolLogic: blueprint.symbol(b, industry),
      meaning: `${industry.psychology.slice(0,3).join(', ')} translated into a distinctive, reduced mark`,
      shapeDirection: `${blueprint.shape}; ${industry.geometry.slice(0,3).join(', ')} proportions`,
      typographyDirection: blueprint.typography,
      compositionDirection: blueprint.composition,
      recommendedStyle: styleKeys
    });
  }

  function scoreConcept(concept, analysis) {
    const b = analysis.brief;
    let score = 50;
    if (b.keywords.length && b.keywords.some(k => concept.visualIdea.toLowerCase().includes(String(k).toLowerCase()))) score += 8;
    if (b.application.length && /small|scale|silhouette|recogn/i.test(concept.shapeDirection + concept.compositionDirection)) score += 7;
    if (/negative|distinctive|custom|brand-specific/i.test(concept.symbolLogic + concept.typographyDirection)) score += 8;
    if (b.logoType && concept.id.includes(b.logoType)) score += 10;
    return Math.min(100, score);
  }

  root.LogoStudioConceptEngine = {
    generateVariants(analysis) {
      const b = analysis.brief;
      const resolved = root.LogoStudioStyleEngine.resolve(b.style);
      const requested = b.logoType && types[b.logoType] ? b.logoType : 'combination';
      const special = specialized[b.industry];
      const candidates = special ? [...special.priorityTypes, requested] : [requested, 'negativeSpace', 'symbolFusion', 'geometric', 'abstract'];
      if (b.industry === 'coding' || b.industry === 'technology' || resolved.styles.includes('modular')) candidates.push('modular');
      if (b.industry === 'architecture') candidates.push('architectural');
      if (b.industry === 'fashion' || resolved.styles.includes('luxury')) candidates.push('monogram', 'wordmark');
      if (b.industry === 'restaurant' || b.industry === 'coffee' || b.industry === 'bakery') candidates.push('emblem');
      const unique = [...new Set(candidates)].filter(k => types[k]);
      return unique.slice(0, 6).map((typeKey, i) => {
        const styleKeys = resolved.styles.length ? resolved.styles : ['modern'];
        const concept = makeConcept(analysis, typeKey, styleKeys, i + 1);
        if (special) {
          concept.symbolLogic += `; ${special.promptLogic}`;
          concept.meaning += `; specialized cues: ${special.symbol.slice(0, 3).join(', ')}`;
          concept.score += special.priorityTypes.includes(typeKey) ? 8 : 0;
        }
        concept.score = scoreConcept(concept, analysis);
        if (special) concept.score = Math.min(100, concept.score + 4);
        if (originalityEngine) {
          const originality = originalityEngine.analyze(analysis, concept);
          concept.originality = originality;
          concept.score = Math.min(100, concept.score + Math.round((originality.score - 60) * 0.18));
        }
        return concept;
      }).sort((a,b) => b.score - a.score);
    },

    generate(analysis) {
      return this.generateVariants(analysis)[0];
    }
  };
})(window);
