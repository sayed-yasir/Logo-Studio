/* Stage 13 — Advanced Prompt Library Intelligence.
 * Read-only recommendation/ranking helpers. Never mutates library records.
 */
(function(root){
  'use strict';
  function clean(v){ return String(v==null?'':v).trim(); }
  function words(v){ return clean(v).toLowerCase().split(/[^a-z0-9]+/).filter(function(x){return x.length>2;}); }
  function uniq(a){ var o={},out=[]; (a||[]).forEach(function(x){x=clean(x);if(x&&!o[x]){o[x]=1;out.push(x);}});return out; }
  function buildQueries(ctx){
    ctx=ctx||{}; var a=ctx.analysis||{}, c=ctx.concept||{}, d=ctx.dna||{};
    var industry=clean(a.industry||a.industryId), styles=Array.isArray(a.style)?a.style:[a.style], types=Array.isArray(a.logoType)?a.logoType:[a.logoType];
    var q=[];
    styles.concat(types).forEach(function(x){if(clean(x))q.push(clean(x));});
    if(industry) q.push(industry);
    if(c.name) q.push(c.name);
    if(c.symbolLogic) q.push(words(c.symbolLogic).slice(0,3).join(' '));
    if(c.visualIdea) q.push(words(c.visualIdea).slice(0,3).join(' '));
    if(d.shape) q.push(words(d.shape).slice(0,3).join(' '));
    if(d.typography) q.push(words(d.typography).slice(0,2).join(' '));
    return uniq(q).filter(function(x){return x.length>2;}).slice(0,8);
  }
  function score(p,ctx){
    var a=ctx.analysis||{},c=ctx.concept||{},d=ctx.dna||{}, text=(String(p.text||'')+' '+String(p.category||'')+' '+(p.tags||[]).join(' ')).toLowerCase();
    var s=0, industry=clean(a.industry).toLowerCase();
    if(industry && text.indexOf(industry)>=0)s+=8;
    [c.name,c.symbolLogic,c.visualIdea,d.shape,d.typography,d.composition].forEach(function(v){words(v).slice(0,6).forEach(function(w){if(text.indexOf(w)>=0)s+=1;});});
    (Array.isArray(a.style)?a.style:[a.style]).filter(Boolean).forEach(function(v){if(text.indexOf(String(v).toLowerCase())>=0)s+=5;});
    return s+(root.LogoStudioPromptLearning&&p.id?root.LogoStudioPromptLearning.rankBoost(p.id):0);
  }
  root.LogoStudioLibraryIntelligence={buildQueries:buildQueries,score:score};
})(window);
