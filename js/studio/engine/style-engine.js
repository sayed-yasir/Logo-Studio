(function (root) {
  'use strict';
  const styles = root.LogoStudioStyles;

  function uniq(list) { return [...new Set(list.filter(Boolean))]; }
  function pairAllowed(a,b) {
    const A = styles[a], B = styles[b];
    if (!A || !B) return false;
    return (A.compatible || []).includes(b) || (B.compatible || []).includes(a);
  }

  root.LogoStudioStyleEngine = {
    resolve(requested) {
      const keys = uniq((Array.isArray(requested) ? requested : [requested]).filter(k => styles[k]));
      const selected = keys.length ? keys : ['modern'];
      const conflicts = [];
      for (let i=0; i<selected.length; i++) {
        for (let j=i+1; j<selected.length; j++) {
          if (!pairAllowed(selected[i], selected[j])) conflicts.push([selected[i], selected[j]]);
        }
      }
      const data = selected.map(k => styles[k]);
      return {
        styles: selected,
        compatible: conflicts.length === 0,
        conflicts,
        family: uniq(data.map(d => d.family)),
        logic: uniq(data.flatMap(d => d.logic || [])),
        shape: uniq(data.map(d => d.shape)).join('; '),
        geometry: uniq(data.map(d => d.geometry)).join('; '),
        typography: uniq(data.map(d => d.typography)).join('; '),
        composition: uniq(data.map(d => d.composition)).join('; '),
        color: uniq(data.map(d => d.color)).join('; '),
        avoid: uniq(data.flatMap(d => d.negative || [])),
        labels: data.map(d => d.label)
      };
    },

    isCompatible(a,b) { return pairAllowed(a,b); },

    suggest(base) {
      const key = styles[base] ? base : 'modern';
      return (styles[key].compatible || []).filter(k => styles[k]).slice(0, 5);
    }
  };
})(window);
