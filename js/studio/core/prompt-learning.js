/* Stage 15 — Prompt Intelligence Learning.
 * Deterministic, offline-only learning signals from prompt use, attach and favorite actions.
 * This never changes the built-in library; it only reads/writes local personal prompt metrics.
 */
(function(root){
  'use strict';
  var KEY='ls:prompt-learning:v1';
  function read(){try{var v=JSON.parse(localStorage.getItem(KEY));return v&&typeof v==='object'?v:{}}catch(e){return {}}}
  function write(v){try{localStorage.setItem(KEY,JSON.stringify(v));return true}catch(e){return false}}
  function clean(v){return String(v==null?'':v).trim()}
  function now(){return new Date().toISOString()}
  function ensure(id){if(!id)return null;var m=read();m[id]=m[id]||{useCount:0,attachCount:0,favoriteCount:0,createdAt:now()};return m}
  function bump(id,field){var m=ensure(id);if(!m)return null;m[id][field]=(m[id][field]||0)+1;m[id].updatedAt=now();if(field==='useCount')m[id].lastUsedAt=now();if(field==='attachCount')m[id].lastAttachedAt=now();if(field==='favoriteCount')m[id].lastFavoritedAt=now();write(m);return m[id]}
  var api={
    key:KEY,
    metrics:function(id){return read()[id]||{useCount:0,attachCount:0,favoriteCount:0};},
    all:function(){return read();},
    recordUse:function(id){return bump(id,'useCount');},
    recordAttach:function(id){return bump(id,'attachCount');},
    recordFavorite:function(id,active){
      var m=ensure(id);if(!m)return null;
      if(active){if(!m[id].favoriteActive){m[id].favoriteCount=(m[id].favoriteCount||0)+1;m[id].lastFavoritedAt=now();m[id].favoriteActive=true;}}
      else m[id].favoriteActive=false;
      m[id].updatedAt=now();write(m);return m[id];
    },
    score:function(id){var x=this.metrics(id);return Math.min(18,(x.useCount||0)*1.5+(x.attachCount||0)*4+(x.favoriteCount||0)*5+(x.favoriteActive?3:0));},
    rankBoost:function(id){return this.score(id);},
    clear:function(){return write({});}
  };
  root.LogoStudioPromptLearning=api;
})(window);
