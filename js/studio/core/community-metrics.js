/* Stage 22 — Community Prompt Metrics (local-first)
 * By default this runs fully on the visitor's device: ratings and use counts are kept in localStorage and no network request is made.
 * A shared (same-origin) metrics service can be switched on by defining, before this script loads:
 *   <script>window.LS_COMMUNITY_ENDPOINT='/api/prompt-metrics'</script>
 * No fake counters are ever created. The old default (/api/prompt-metrics) does not exist on a static host such as GitHub Pages,
 * so every card used to fire a request that ended in a 404 error. */
(function(root){
  'use strict';
  var ENDPOINT=String(root.LS_COMMUNITY_ENDPOINT||'');
  var KEY='ls:community-ratings:v1';
  var down=false; /* set after the first failed request so we never retry it on every card */
  function remote(){return !!ENDPOINT&&!down}
  function read(){try{var v=JSON.parse(localStorage.getItem(KEY));return v&&typeof v==='object'?v:{}}catch(e){return {}}}
  function write(v){try{localStorage.setItem(KEY,JSON.stringify(v));return true}catch(e){return false}}
  function local(id){var m=read()[id];return m&&typeof m==='object'?m:{rating:0,rated:false,used:0}}
  function localRate(id,rating){var m=read();m[id]=m[id]||{rating:0,rated:false,used:0};m[id].rating=rating;m[id].rated=true;write(m);return m[id]}
  function asLocal(id){var x=local(id);return {available:false,stars:x.rating||0,ratings:x.rated?1:0,uses:x.used||0,userRating:x.rating||0}}
  function shape(x,r){return {available:true,stars:Number(x.stars||0),ratings:Number(x.ratings||0),uses:Number(x.uses||0),userRating:Number(x.userRating||r||0)}}
  function get(id){
    if(!remote())return Promise.resolve(asLocal(id));
    return fetch(ENDPOINT+'?id='+encodeURIComponent(id),{headers:{'Accept':'application/json'},credentials:'same-origin',cache:'no-store'})
      .then(function(r){if(!r.ok)throw new Error('community-unavailable');return r.json()})
      .then(function(x){return shape(x)})
      .catch(function(){down=true;return asLocal(id)});
  }
  function rate(id,rating){
    rating=Math.max(1,Math.min(5,Number(rating)||0));
    localRate(id,rating);
    if(!remote())return Promise.resolve(asLocal(id));
    return fetch(ENDPOINT,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({id:String(id),rating:rating})})
      .then(function(r){if(!r.ok)throw new Error('community-unavailable');return r.json()})
      .then(function(x){return shape(x,rating)})
      .catch(function(){down=true;return asLocal(id)});
  }
  function recordUse(id){
    var m=read();m[id]=m[id]||{rating:0,rated:false,used:0};m[id].used=(m[id].used||0)+1;write(m);
    if(remote()){try{fetch(ENDPOINT,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({id:String(id),event:'use'})}).catch(function(){down=true})}catch(e){}}
    return m[id];
  }
  /* The prompts this visitor rated, best first (used by the "Top rated" page when no shared service is configured). */
  function ratedIds(limit){
    var m=read();
    return Object.keys(m).filter(function(k){return m[k]&&m[k].rated&&m[k].rating>0})
      .sort(function(a,b){return (m[b].rating-m[a].rating)||((m[b].used||0)-(m[a].used||0))})
      .slice(0,limit||20).map(function(k){return {id:k,rating:m[k].rating,used:m[k].used||0}});
  }
  root.LogoStudioCommunityMetrics={endpoint:ENDPOINT,get enabled(){return !!ENDPOINT},get:get,rate:rate,recordUse:recordUse,local:local,ratedIds:ratedIds};
})(window);
