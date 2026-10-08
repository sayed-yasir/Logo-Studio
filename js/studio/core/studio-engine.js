/* Public local orchestration layer. Stage 2 only: no DOM and no network. */
(function (root) {
  'use strict';
  root.LogoStudioEngine = {
    generate(input) {
      const analysis = root.LogoStudioBrandIntelligence.analyze(input);
      const concept = root.LogoStudioConceptEngine.generate(analysis);
      return this.generateFromAnalysis(analysis, concept);
    },
    generateFromAnalysis(analysis, concept) {
      let dna = root.LogoStudioDNAGenerator.generate(analysis, concept);
      if (root.LogoStudioRenderIntelligence) dna = root.LogoStudioRenderIntelligence.enhanceDNA(analysis, dna);
      if (root.LogoStudioApplicationIntelligence) dna = root.LogoStudioApplicationIntelligence.enhanceDNA(analysis, dna);
      const prompt = root.LogoStudioPromptBuilder.build(analysis, concept, dna);
      const variations = root.LogoStudioVariationEngine ? root.LogoStudioVariationEngine.generate(analysis, concept, dna, prompt) : {};
      const quality = root.LogoStudioQualityCheck.run(analysis, concept, dna, prompt);
      const application = root.LogoStudioApplicationIntelligence ? root.LogoStudioApplicationIntelligence.analyze(analysis, concept) : null;
      const render = root.LogoStudioRenderIntelligence ? root.LogoStudioRenderIntelligence.resolve(analysis.brief.style) : null;
      return { analysis, concept, dna, prompt, variations, quality, application, render };
    }
  };
})(window);
