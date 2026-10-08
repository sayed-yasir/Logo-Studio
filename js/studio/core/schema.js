/* Logo Studio — Stage 2 domain schema.
 * Pure data contracts. No DOM, network, API, or UI dependencies.
 */
(function (root) {
  'use strict';
  root.LogoStudioDomain = {
    version: 1,
    createBrief(input) {
      input = input || {};
      return {
        brandName: String(input.brandName || '').trim(),
        industry: String(input.industry || '').trim(),
        category: String(input.category || '').trim(),
        targetAudience: String(input.targetAudience || '').trim(),
        personality: Array.isArray(input.personality) ? input.personality.slice() : (input.personality ? String(input.personality).split(',').map(v => v.trim()).filter(Boolean) : []),
        desiredFeeling: Array.isArray(input.desiredFeeling) ? input.desiredFeeling.slice() : (input.desiredFeeling ? String(input.desiredFeeling).split(',').map(v => v.trim()).filter(Boolean) : []),
        keywords: Array.isArray(input.keywords) ? input.keywords.slice() : [],
        preferredColors: Array.isArray(input.preferredColors) ? input.preferredColors.slice() : [],
        colorRestrictions: Array.isArray(input.colorRestrictions) ? input.colorRestrictions.slice() : [],
        logoType: String(input.logoType || '').trim(),
        style: Array.isArray(input.style) ? input.style.slice() : (input.style ? String(input.style).split(',').map(v => v.trim()).filter(Boolean) : []),
        complexity: String(input.complexity || '').trim(),
        subject: String(input.subject || '').trim().slice(0, 140),
        description: String(input.description || '').trim(),
        application: Array.isArray(input.application) ? input.application.slice() : []
      };
    },
    createConcept(input) {
      input = input || {};
      return {
        id: String(input.id || ''),
        name: String(input.name || ''),
        visualIdea: String(input.visualIdea || ''),
        symbolLogic: String(input.symbolLogic || ''),
        meaning: String(input.meaning || ''),
        shapeDirection: String(input.shapeDirection || ''),
        typographyDirection: String(input.typographyDirection || ''),
        compositionDirection: String(input.compositionDirection || ''),
        recommendedStyle: Array.isArray(input.recommendedStyle) ? input.recommendedStyle.slice() : [],
        score: Number.isFinite(Number(input.score)) ? Number(input.score) : 0
      };
    },
    createDNA(input) {
      input = input || {};
      return {
        shape: String(input.shape || ''),
        symbol: String(input.symbol || ''),
        geometry: String(input.geometry || ''),
        meaning: String(input.meaning || ''),
        typography: String(input.typography || ''),
        color: String(input.color || ''),
        composition: String(input.composition || ''),
        personality: String(input.personality || ''),
        recognition: String(input.recognition || '')
      };
    }
  };
})(window);
