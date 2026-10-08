(function (root) {
  'use strict';
  root.LogoStudioQualityCheck = {
    run(analysis, concept, dna, prompt) {
      const originality = root.LogoStudioOriginalityEngine ? root.LogoStudioOriginalityEngine.analyze(analysis, concept) : null;
      const application = root.LogoStudioApplicationIntelligence ? root.LogoStudioApplicationIntelligence.analyze(analysis, concept) : null;
      const appRequested = Boolean(analysis.brief.application && analysis.brief.application.length);
      const checks = [
        ['brand', Boolean(analysis.brief.brandName), 'Brand name is present'],
        ['industry', Boolean(analysis.brief.industry), 'Industry direction exists'],
        ['concept', Boolean(concept.visualIdea && concept.symbolLogic), 'Concept has visual and symbol logic'],
        ['dna', Boolean(dna.shape && dna.geometry && dna.composition), 'Logo DNA is connected to the concept'],
        ['prompt', prompt.length >= 120 && prompt.length <= 1200, 'Prompt is information-dense without unnecessary length'],
        ['generic', !/modern professional premium logo for/i.test(prompt), 'Prompt avoids generic boilerplate'],
        ['originality', !originality || originality.score >= 58, 'Concept has sufficient originality signal'],
        ['application', !appRequested || Boolean(application && application.priorities.length), 'Application direction is resolved when requested'],
        ['applicationPrompt', !appRequested || /application (direction|priorities|composition)/i.test(prompt), 'Prompt carries application-aware direction when requested'],
        ['contradiction', !(analysis.brief.style || '').toString().match(/minimal/i) || !/(excessive|busy|ornamental clutter)/i.test(prompt), 'Prompt does not undermine minimal style']
      ];
      const failed = checks.filter(c => !c[1]).map(c => c[0]);
      return { ok: failed.length === 0, failed, checks, originality };
    }
  };
})(window);
