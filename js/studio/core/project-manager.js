/* Stage 11 — local Project Manager. Offline-first, deterministic, no network. */
(function (root) {
  'use strict';
  var KEY = 'ls:projects:v1';
  function read(){ try { var v=JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v)?v:[]; } catch(e){ return []; } }
  function write(items){ try { localStorage.setItem(KEY, JSON.stringify(items)); return true; } catch(e){ return false; } }
  function uid(){ return 'LS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2,7).toUpperCase(); }
  function clean(v){ return String(v == null ? '' : v).trim(); }
  function snapshot(result){
    if(!result) return null;
    return JSON.parse(JSON.stringify(result));
  }
  root.LogoStudioProjectManager = {
    key: KEY,
    list: function(){ return read().sort(function(a,b){ if(!!b.favorite!==!!a.favorite) return b.favorite?1:-1; return String(b.updatedAt).localeCompare(String(a.updatedAt)); }); },
    get: function(id){ return read().find(function(p){ return p.id===id; }) || null; },
    save: function(input){
      input=input||{}; var items=read(), now=new Date().toISOString();
      var project={
        id: clean(input.id)||uid(),
        name: clean(input.name)||clean(input.brandName)||'Untitled Logo Project',
        createdAt: input.createdAt || now,
        updatedAt: now,
        brief: input.brief || {},
        result: snapshot(input.result),
        libraryPrompts: Array.isArray(input.libraryPrompts)?input.libraryPrompts.slice():[],
        notes: clean(input.notes),
        favorite: input.favorite === true
      };
      var i=items.findIndex(function(p){return p.id===project.id;});
      if(i>=0) items[i]=project; else items.push(project);
      if(!write(items)) throw new Error('Projects could not be saved on this device.');
      return project;
    },
    rename: function(id,name){
      name=clean(name).slice(0,120); if(!name) return null;
      var items=read(), i=items.findIndex(function(p){return p.id===id;}); if(i<0) return null;
      items[i].name=name; items[i].updatedAt=new Date().toISOString();
      return write(items)?items[i]:null;
    },
    duplicate: function(id){
      var src=this.get(id); if(!src) return null;
      var copy=JSON.parse(JSON.stringify(src)), now=new Date().toISOString();
      copy.id=uid(); copy.name=clean(src.name).slice(0,100)+' (copy)'; copy.createdAt=now; copy.updatedAt=now; copy.favorite=false;
      var items=read(); items.push(copy);
      return write(items)?copy:null;
    },
    toggleFavorite: function(id){
      var items=read(), i=items.findIndex(function(p){return p.id===id;}); if(i<0) return null;
      items[i].favorite=!items[i].favorite;
      return write(items)?items[i]:null;
    },
    search: function(q){
      q=clean(q).toLowerCase(); var all=this.list(); if(!q) return all;
      return all.filter(function(p){
        var b=p.brief||{}; var hay=[p.name,b.brandName,b.industry,(b.style||[]).join(' '),p.notes].join(' ').toLowerCase();
        return hay.indexOf(q)>=0;
      });
    },
    remove: function(id){ var next=read().filter(function(p){return p.id!==id;}); return write(next); },
    addLibraryPrompt: function(projectId,prompt){
      if(!prompt || !prompt.id) return null;
      var p=this.get(projectId); if(!p) return null;
      p.libraryPrompts=Array.isArray(p.libraryPrompts)?p.libraryPrompts:[];
      if(!p.libraryPrompts.some(function(x){return x.id===prompt.id;})) p.libraryPrompts.push({id:String(prompt.id),category:prompt.category||'',tags:Array.isArray(prompt.tags)?prompt.tags.slice():[],text:String(prompt.text||'')});
      p.updatedAt=new Date().toISOString(); write(read().map(function(x){return x.id===p.id?p:x;})); return p;
    },
    exportJSON: function(){ return JSON.stringify(this.list(),null,2); },
    importJSON: function(text){
      var incoming=JSON.parse(text); if(!Array.isArray(incoming)) throw new Error('Project file must contain a project list.');
      var current=read(), byId={}; current.forEach(function(p){byId[p.id]=p;});
      incoming.forEach(function(p){ if(p&&p.id&&p.brief) byId[String(p.id)]=p; });
      var merged=Object.keys(byId).map(function(k){return byId[k];}); if(!write(merged)) throw new Error('Projects could not be imported on this device.'); return this.list();
    }
  };
})(window);
