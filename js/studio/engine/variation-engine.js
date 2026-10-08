/* Stage 10 — Prompt Variation Engine. Local, deterministic, identity-preserving. */
(function (root) {
  'use strict';

  function clean(parts) {
    return parts.map(function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); }).filter(Boolean);
  }

  function compact(parts, max) {
    var out = clean(parts), text = out.join('; ') + '.';
    if (text.length <= max) return text;
    // Remove least important clauses first. The brand, subject and user context are protected.
    var removable = ['meaning: ', 'audience: ', 'feeling: ', 'detail: ', 'presentation: ', 'geometry: ', 'composition: ', 'typography: ', 'shape: '];
    removable.forEach(function (prefix) {
      if ((out.join('; ') + '.').length <= max) return;
      var i = out.findIndex(function (p) { return p.indexOf(prefix) === 0; });
      if (i >= 0) out.splice(i, 1);
    });
    text = out.join('; ') + '.';
    if (text.length <= max) return text;
    // Still too long: drop whole trailing clauses (never the first four) instead of cutting a word.
    while (out.length > 4 && (out.join('; ') + '.').length > max) out.splice(out.length - 1, 1);
    return out.join('; ') + '.';
  }

  function identity(analysis, concept, dna) {
    var b = analysis.brief;
    return clean([
      'brand "' + (b.brandName || 'the brand') + '"',
      analysis.industry.label + ' identity',
      b.subject ? 'the logo must clearly depict: ' + b.subject : '',
      b.description ? 'brand context: ' + b.description : '',
      'core concept: ' + concept.name,
      'visual idea: ' + concept.visualIdea,
      'symbol logic: ' + concept.symbolLogic,
      'shape: ' + dna.shape,
      'geometry: ' + dna.geometry,
      'typography: ' + dna.typography,
      'composition: ' + dna.composition,
      'meaning: ' + dna.meaning,
      'color: ' + dna.color,
      'recognition: ' + dna.recognition
    ]);
  }

  function directives(analysis, concept, dna) {
    var b = analysis.brief;
    var style = root.LogoStudioStyleEngine.resolve(b.style);
    var render = root.LogoStudioRenderIntelligence ? root.LogoStudioRenderIntelligence.promptDirectives(analysis) : [];
    var application = root.LogoStudioApplicationIntelligence ? root.LogoStudioApplicationIntelligence.promptDirectives(analysis, concept) : [];
    return {
      style: style.logic ? style.logic.slice(0, 5) : [],
      render: render,
      application: application,
      avoid: style.avoid ? style.avoid.slice(0, 6) : []
    };
  }

  var modes = {
    short: function (id, d) {
      return compact(id.concat(['distinctive, simple, scalable, recognizable', 'no unnecessary detail']), 620);
    },
    professional: function (id, d) {
      return compact(id.concat(['professional vector construction', 'clear hierarchy and balanced proportions', 'production-ready across sizes'], d.style.map(function (x) { return 'style: ' + x; })), 900);
    },
    premium: function (id, d) {
      return compact(id.concat(['refined proportions', 'precise geometry', 'restrained premium visual language', 'sophisticated typography'], d.style.map(function (x) { return 'style: ' + x; })), 950);
    },
    minimal: function (id, d) {
      return compact(id.concat(['minimal reduction', 'few deliberate shapes', 'strong negative space', 'clean silhouette', 'no visual clutter']), 760);
    },
    '3d': function (id, d) {
      return compact(id.concat(['dimensional presentation while preserving the core vector identity'], d.render, ['controlled material definition', 'studio lighting', 'high-fidelity render']), 1000);
    },
    '8k': function (id, d) {
      return compact(id.concat(['ultra-detailed 8K render of the finished logo', 'quality comes from precise form, material definition, clean edges and controlled lighting, not from resolution alone'], d.render, ['studio lighting with soft reflections', 'sharp high-fidelity detail', 'centered composition on a clean background']), 1050);
    },
    experimental: function (id, d) {
      return compact(id.concat(['art-directed experimental construction', 'unexpected but intentional visual relationship', 'distinctive silhouette', 'preserve brand recognition'], d.application), 1000);
    }
  };

  root.LogoStudioVariationEngine = {
    modes: Object.keys(modes),
    generate: function (analysis, concept, dna, basePrompt) {
      var id = identity(analysis, concept, dna);
      var d = directives(analysis, concept, dna);
      var result = {};
      Object.keys(modes).forEach(function (key) {
        result[key] = modes[key](id.slice(), d);
      });
      return result;
    }
  };
})(window);
