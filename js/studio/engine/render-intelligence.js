(function (root) {
  'use strict';
  const styles = root.LogoStudioStyles;

  const MATERIAL_KEYS = ['chrome','liquidMetal','glass','holographic','titanium','gold','silver','crystal','neon','embossed','soft3D','futuristic3D','productRender','studioLighting'];
  const RENDER_KEYS = ['threeD', ...MATERIAL_KEYS];

  function uniq(list) { return [...new Set(list.filter(Boolean))]; }

  function resolve(requested) {
    const keys = Array.isArray(requested) ? requested : [requested];
    const selected = uniq(keys.filter(k => styles[k]));
    const has3D = selected.includes('threeD') || selected.some(k => MATERIAL_KEYS.includes(k));
    const renderStyles = selected.filter(k => RENDER_KEYS.includes(k));
    return {
      enabled: has3D,
      styles: renderStyles,
      materials: renderStyles.filter(k => MATERIAL_KEYS.includes(k) && !['studioLighting','productRender','soft3D','futuristic3D','neon','embossed'].includes(k)),
      logic: uniq(renderStyles.flatMap(k => styles[k]?.logic || [])),
      negative: uniq(renderStyles.flatMap(k => styles[k]?.negative || [])),
      shape: uniq(renderStyles.map(k => styles[k]?.shape)).join('; '),
      geometry: uniq(renderStyles.map(k => styles[k]?.geometry)).join('; '),
      composition: uniq(renderStyles.map(k => styles[k]?.composition)).join('; '),
      color: uniq(renderStyles.map(k => styles[k]?.color)).join('; ')
    };
  }

  function resolutionHint(input, enabled) {
    if (!enabled) return '';
    const raw = [input?.subject, input?.description, ...(input?.keywords || []), ...(Array.isArray(input?.style) ? input.style : [input?.style])].filter(Boolean).join(' ').toLowerCase();
    if (/8k|8 k/.test(raw)) return '8K high-fidelity render';
    if (/4k|4 k/.test(raw)) return '4K high-fidelity render';
    return 'high-fidelity render';
  }

  root.LogoStudioRenderIntelligence = {
    resolve,
    resolutionHint,
    enhanceDNA(analysis, dna) {
      const render = resolve(analysis.brief.style);
      if (!render.enabled) return dna;
      return {
        ...dna,
        shape: `${dna.shape}; ${render.shape}`,
        geometry: `${dna.geometry}; ${render.geometry}`,
        color: `${dna.color}; ${render.color}`,
        composition: `${dna.composition}; ${render.composition}`,
        recognition: `${dna.recognition}; material must support silhouette readability and brand recognition`
      };
    },
    promptDirectives(analysis) {
      const render = resolve(analysis.brief.style);
      if (!render.enabled) return [];
      return uniq([
        render.logic.length ? `render logic: ${render.logic.join(', ')}` : '',
        render.materials.length ? `material: ${render.materials.map(k => styles[k]?.label || k).join(', ')}` : '',
        resolutionHint(analysis.brief, true),
        'professional studio render, physically coherent material response, controlled highlights and shadows',
        render.negative.length ? `render avoid: ${render.negative.slice(0,6).join(', ')}` : ''
      ]);
    }
  };
})(window);
