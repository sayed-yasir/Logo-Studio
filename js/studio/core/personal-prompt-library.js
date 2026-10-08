/* Stage 14 — Personal Prompt Library.
 * Stores prompts created by the user on this device. Separate from the built-in 100K+ library.
 * Deterministic, offline-first, deduplicated by prompt fingerprint.
 */
(function(root){
  'use strict';
  var KEY='ls:personal-prompts:v1';
  function read(){try{var v=JSON.parse(localStorage.getItem(KEY));return Array.isArray(v)?v:[]}catch(e){return[]}}
  function write(v){try{localStorage.setItem(KEY,JSON.stringify(v));return true}catch(e){return false}}
  function clean(v){return String(v==null?'':v).trim()}
  function words(v){return clean(v).toLowerCase().split(/[^a-z0-9]+/).filter(function(x){return x.length>2})}
  function fingerprint(text){var s=clean(text),h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return ('00000000'+(h>>>0).toString(16)).slice(-8)}
  function tags(input){input=input||{};var out=[];(Array.isArray(input.tags)?input.tags:[]).concat(input.industry,input.style,input.logoType,input.application).forEach(function(v){if(Array.isArray(v))out=out.concat(v);else if(clean(v))out.push(clean(v))});return Array.from(new Set(out.map(function(x){return clean(x).toLowerCase()}).filter(Boolean))).slice(0,18)}
  var api={
    metrics:function(id){return root.LogoStudioPromptLearning?root.LogoStudioPromptLearning.metrics(id):{useCount:0,attachCount:0,favoriteCount:0};},
    recordUse:function(id){if(root.LogoStudioPromptLearning)root.LogoStudioPromptLearning.recordUse(id);return this.get(id);},
    recordAttach:function(id){if(root.LogoStudioPromptLearning)root.LogoStudioPromptLearning.recordAttach(id);return this.get(id);},
    recordFavorite:function(id,active){if(root.LogoStudioPromptLearning)root.LogoStudioPromptLearning.recordFavorite(id,!!active);return this.get(id);},
    isFavorite:function(id){var m=this.metrics(id);return !!m.favoriteActive;},
    key:KEY,
    list:function(){return read().sort(function(a,b){return String(b.updatedAt).localeCompare(String(a.updatedAt))})},
    get:function(id){return read().find(function(x){return x.id===id})||null},
    add:function(input){
      input=input||{};var text=clean(input.text);if(!text)return null;var items=read(),fp=fingerprint(text),existing=items.find(function(x){return x.fingerprint===fp});
      if(existing){existing.usageCount=(existing.usageCount||0)+1;existing.updatedAt=new Date().toISOString();if(root.LogoStudioPromptLearning)root.LogoStudioPromptLearning.recordUse(existing.id);if(input.source)existing.source=input.source;write(items);return existing}
      var now=new Date().toISOString(),item={id:'MY-'+fp.toUpperCase(),fingerprint:fp,text:text,title:clean(input.title)||'Studio Prompt',source:clean(input.source)||'Studio',category:clean(input.category),tags:tags(input),industry:clean(input.industry),style:Array.isArray(input.style)?input.style.slice(0,8):clean(input.style)?[clean(input.style)]:[],logoType:clean(input.logoType),application:Array.isArray(input.application)?input.application.slice(0,8):[],createdAt:now,updatedAt:now,usageCount:1,learned: {useCount:0,attachCount:0,favoriteCount:0}};
      items.unshift(item);if(!write(items))return null;if(root.LogoStudioPromptLearning)root.LogoStudioPromptLearning.recordUse(item.id);return item;
    },
    addResult:function(result,brief,source){
      result=result||{};brief=brief||{};var out=[],style=brief.style||result.analysis&&result.analysis.style||[],application=brief.application||result.application&&result.application.applications||[];
      if(result.prompt)out.push(this.add({text:result.prompt,title:(brief.brandName||'Studio')+' — Primary',source:source||'Studio Generated',industry:brief.industry,style:style,logoType:brief.logoType,application:application,tags:['primary','concept']}));
      var vars=result.variations||{};Object.keys(vars).forEach(function(k){if(vars[k])out.push(api.add({text:vars[k],title:(brief.brandName||'Studio')+' — '+k,source:source||'Studio Variation',industry:brief.industry,style:style,logoType:brief.logoType,application:application,tags:[k,'variation']}))});
      return out.filter(Boolean);
    },
    remove:function(id){return write(read().filter(function(x){return x.id!==id}))},
    clear:function(){return write([])},
    score:function(p,ctx){
      ctx=ctx||{};var a=ctx.analysis||{},c=ctx.concept||{},d=ctx.dna||{},text=(p.text+' '+(p.tags||[]).join(' ')+' '+p.industry+' '+(p.style||[]).join(' ')+' '+p.logoType).toLowerCase(),s=0;
      if(a.industry&&text.indexOf(String(a.industry).toLowerCase())>=0)s+=16;
      (Array.isArray(a.style)?a.style:[a.style]).filter(Boolean).forEach(function(v){if(text.indexOf(String(v).toLowerCase())>=0)s+=9});
      [c.name,c.symbolLogic,c.visualIdea,d.shape,d.typography,d.composition].forEach(function(v){words(v).slice(0,8).forEach(function(w){if(text.indexOf(w)>=0)s+=1})});
      (p.usageCount||0)>1?s+=Math.min(6,p.usageCount):0;
      return s+(root.LogoStudioPromptLearning?root.LogoStudioPromptLearning.rankBoost(p.id):0);
    }
  };
  root.LogoStudioPersonalPromptLibrary=api;
})(window);
