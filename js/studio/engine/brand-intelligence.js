(function (root) {
  'use strict';
  const Domain = root.LogoStudioDomain;
  const industries = root.LogoStudioIndustries;
  const styles = root.LogoStudioStyles;

  const DEFAULTS = {
    complexity: 'controlled',
    personality: ['clear', 'distinctive'],
    desiredFeeling: ['confident'],
    style: ['modern'],
    logoType: 'combination'
  };

  function list(value) {
    if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean);
    return String(value || '').split(/[,;+]/).map(v => v.trim()).filter(Boolean);
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim()
      .replace(/[–—]/g, '-')
      .replace(/\s+/g, ' ');
  }

  function findIndustry(input) {
    const explicit = normalize(input.industry);
    if (explicit) {
      if (industries[explicit]) return { key: explicit, source: 'explicit', score: 1 };
      for (const [key, data] of Object.entries(industries)) {
        const candidates = [key, data.label, ...(data.aliases || [])].map(normalize);
        if (candidates.some(x => x === explicit || explicit.includes(x) || x.includes(explicit))) {
          return { key, source: 'explicit-match', score: 0.95 };
        }
      }
    }

    const text = [input.brandName, input.subject, input.description, ...list(input.keywords), input.category].map(normalize).join(' ');
    let best = { key: 'general', source: 'default', score: 0.2 };
    for (const [key, data] of Object.entries(industries)) {
      if (key === 'general') continue;
      const candidates = [key, data.label, ...(data.aliases || [])].map(normalize);
      let hits = 0;
      for (const candidate of candidates) {
        if (candidate && text.includes(candidate)) hits += candidate.includes(' ') ? 2 : 1;
      }
      if (hits > best.score * 4) best = { key, source: 'inferred', score: Math.min(0.9, 0.35 + hits * 0.1) };
    }
    return best;
  }

  function normalizeStyles(value) {
    const raw = list(value).flatMap(v => String(v).split(/[,;+]/)).map(v => normalize(v)).filter(Boolean);
    const out = [];
    for (const item of raw) {
      if (styles[item]) out.push(item);
      else {
        const match = Object.entries(styles).find(([key, data]) => normalize(key) === item || normalize(data.label) === item || normalize(data.label).includes(item));
        if (match) out.push(match[0]);
      }
    }
    return [...new Set(out)];
  }

  function normalizePersonality(value) { return [...new Set(list(value).map(normalize))]; }

  root.LogoStudioBrandIntelligence = {
    analyze(input) {
      const raw = input || {};
      const b = Domain.createBrief(raw);
      b.keywords = list(b.keywords);
      b.preferredColors = list(b.preferredColors);
      b.colorRestrictions = list(b.colorRestrictions);
      b.application = list(b.application);
      b.personality = normalizePersonality(b.personality);
      b.desiredFeeling = normalizePersonality(b.desiredFeeling);
      b.style = normalizeStyles(b.style);

      const industry = findIndustry(raw);
      b.industry = industry.key;
      if (!b.complexity) b.complexity = DEFAULTS.complexity;
      if (!b.logoType) b.logoType = DEFAULTS.logoType;
      if (!b.personality.length) b.personality = DEFAULTS.personality.slice();
      if (!b.desiredFeeling.length) b.desiredFeeling = DEFAULTS.desiredFeeling.slice();
      if (!b.style.length) b.style = DEFAULTS.style.slice();

      const industryData = industries[b.industry] || industries.general;
      const missing = [];
      if (!b.brandName) missing.push('brandName');
      if (!b.industry || b.industry === 'general') missing.push('industry');
      if (!raw.logoType) missing.push('logoType');
      if (!raw.style || !list(raw.style).length) missing.push('style');

      return {
        brief: b,
        industry: { key: b.industry, ...industryData },
        confidence: industry.score >= 0.9 ? 'high' : industry.score >= 0.55 ? 'medium' : 'low',
        inference: industry,
        defaultsApplied: {
          complexity: !raw.complexity,
          logoType: !raw.logoType,
          personality: !list(raw.personality).length,
          desiredFeeling: !list(raw.desiredFeeling).length,
          style: !list(raw.style).length
        },
        missing,
        signals: {
          hasBrand: Boolean(b.brandName),
          hasIndustry: b.industry !== 'general',
          hasLogoType: Boolean(b.logoType),
          hasStyle: b.style.length > 0,
          hasColorDirection: b.preferredColors.length > 0 || b.colorRestrictions.length > 0,
          hasAudience: Boolean(b.targetAudience),
          hasDescription: Boolean(b.description)
        }
      };
    }
  };
})(window);
