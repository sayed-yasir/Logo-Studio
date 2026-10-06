/* ==========================================================================
   DATA LAYER — connect your real prompt library here, without touching the UI.
   LogoStudio.connect({
     categories(): Promise<[{id,name,desc?}]>          (optional)
     generate({brand,category,exclude:[id]}): Promise<Prompt>
     search({query,category,page}): Promise<{items:[Prompt],hasMore?:bool}>
     get(id): Promise<Prompt>
   })
   Prompt = { id:string, text:string ("{brand}" is replaced in the UI), category?:string, tags?:[string], createdAt?:string }
   Throw/reject on failure. With no adapter connected, the UI shows its "not connected" state.
   ========================================================================== */
/* Fallback shown only while the prompt library is not connected yet. Mirrors the 20 real categories (id / name / description) of the library. */
const DEFAULT_CATS=[
{id:'monogram',name:'Monogram',desc:'Initials, letter fusion, interlocking forms, shared strokes and custom letter construction. The letters are the symbol.'},
{id:'abstract-symbol',name:'Abstract Symbol',desc:'Non-literal shapes with an invented internal logic. The symbol stands for a feeling or idea rather than an object.'},
{id:'wordmark',name:'Wordmark',desc:'The name as the logo. Custom letter details, ligatures, rhythm and spacing make the word ownable.'},
{id:'lettermark',name:'Lettermark',desc:'Compact initial-based marks where letters keep their identity but are tuned as a single unit.'},
{id:'negative-space',name:'Negative Space',desc:'Hidden secondary forms, dual readings, voids and silhouettes that reward a second look. The empty space is the idea.'},
{id:'geometric',name:'Geometric',desc:'Mathematical relationships, modular systems, grids, ratios and primitives. Every dimension can be justified.'},
{id:'minimal',name:'Minimal',desc:'Maximum reduction. One to three elements at most, one decisive gesture and extreme restraint.'},
{id:'futuristic',name:'Futuristic',desc:'Forward-looking forms, precise angles, segmented structures and engineered clarity, without sci-fi clichés or glow effects.'},
{id:'luxury-premium',name:'Luxury Premium',desc:'Restraint, proportion, fine line work, sophisticated typography and minimal visual weight. Silence in place of noise.'},
{id:'tech-ai',name:'Tech AI',desc:'Intelligent systems, networks, computational structures, neural-inspired geometry and modular intelligence in a simple form.'},
{id:'emblem',name:'Emblem',desc:'Contained badge, seal and crest-style structures where symbol and name form one unit, built for stamps and signage.'},
{id:'symbolic',name:'Symbolic',desc:'A symbol carrying a clear metaphor, chosen for resonance with the brand name\'s sound, letters or general meaning, and not for any claimed activity.'},
{id:'dynamic',name:'Dynamic',desc:'Movement, rotation, direction and rhythm built into the structure, with motion implied by form and not by effects or blur.'},
{id:'bold',name:'Bold',desc:'Heavy weight, strong silhouette and massive presence. Thick shapes, tight counters and immediate impact that survives at tiny sizes.'},
{id:'elegant',name:'Elegant',desc:'Graceful curves, calligraphic influence, delicate contrast and flowing balance. Grace in the line and ease in the spacing.'},
{id:'timeless',name:'Timeless',desc:'Fundamental shapes, classical proportions, durable construction and no trend-driven devices. A logo meant to look right in decades.'},
{id:'abstract-letterform',name:'Abstract Letterform',desc:'A letter stretched into a symbol: still recognizable as a letter, but transformed by cuts, rotation and geometry.'},
{id:'organic-geometric',name:'Organic Geometric',desc:'Controlled geometry fused with natural curves and biological structures. Growth patterns are expressed with compass-and-ruler discipline.'},
{id:'modern-classic',name:'Modern Classic',desc:'Classical structure and proportion, simplified with modern restraint. Heritage cues are used as geometry and never as ornament.'},
{id:'experimental-mark',name:'Experimental Mark',desc:'Unconventional construction, unusual symbol logic and optical experiments that remain usable as a real logo.'}];
let adapter=null,CATLIST=DEFAULT_CATS,ncSeen=false;
/* The prompt library (~900 KB) is fetched after the first paint (see the end of this file) or at once if an action needs it.
   Every call made before it is ready simply waits for it, so a click on Generate on a slow connection is held and then runs by itself. */
let libP=null,readyRes;const ready=new Promise(r=>{readyRes=r});
const addScript=src=>new Promise((ok,bad)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>bad(new Error('Could not load '+src));document.head.appendChild(s)});
function ensureLib(){
 if(adapter)return Promise.resolve();
 if(!libP)libP=addScript(APP_BASE+'js/library-data.js').then(()=>addScript(APP_BASE+'js/library.js'))
  .then(()=>Promise.race([ready,new Promise((_,no)=>setTimeout(()=>no(new Error('The prompt library took too long to load.')),45000))]))
  .catch(e=>{libP=null;throw e});
 return libP;
}
const NOTCONN=()=>Promise.reject({code:'NOT_CONNECTED'});
const lib=(m,...a)=>ensureLib().then(()=>adapter&&typeof adapter[m]==='function'?adapter[m](...a):NOTCONN(),NOTCONN);
const nc=p=>p.catch(e=>{if(e&&e.code==='NOT_CONNECTED')ncSeen=true;throw e});
const API={
 categories:()=>lib('categories').catch(e=>{if(e&&e.code==='NOT_CONNECTED')return DEFAULT_CATS;console.error('[Logo Studio] Could not load categories from the prompt library.',e);throw e}),
 generate:q=>nc(lib('generate',q)),
 search:q=>nc(lib('search',q)),
 get:id=>nc(lib('get',id))
};
window.LogoStudio={connect(a){adapter=a;readyRes();API.categories().then(c=>{if(Array.isArray(c)&&c.length)CATLIST=c},()=>{/* already logged by API.categories; the built-in category list stays in use */}).then(()=>{
 /* Only re-render the page if something already asked for the library; otherwise just refresh the category lists in place */
 if(ncSeen){ncSeen=false;if(S.status==='nc')S.status='idle';route()}else refreshCats()})}};

/* Application root URL, derived from where this script is served (…/js/app.js → …/), so share links always point at the app, whichever page loaded it. */
const APP_BASE=(()=>{try{const s=document.currentScript&&document.currentScript.src;if(s)return new URL('../',s).href}catch{}return location.href.split('#')[0].split('?')[0]})();

/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ic=n=>`<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const store={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const app=$('#app');
/* Saved favorites are read from localStorage; keep only well-formed prompts ({id,text} strings) and ignore anything else. */
function loadFav(){
 let raw;
 try{raw=JSON.parse(localStorage.getItem('ls:fav'))}catch(e){console.error('[Logo Studio] Saved favorites could not be read; starting with an empty list.',e);return {}}
 if(raw==null)return {};
 if(typeof raw!=='object'){console.error('[Logo Studio] Saved favorites have an unexpected format; starting with an empty list.');return {}}
 const out={};let bad=0;
 Object.values(raw).forEach(v=>{
  if(v&&typeof v==='object'&&typeof v.id==='string'&&v.id&&typeof v.text==='string'&&v.text){
   const p={id:v.id,text:v.text};
   if(typeof v.category==='string')p.category=v.category;
   if(Array.isArray(v.tags))p.tags=v.tags.filter(t=>typeof t==='string');
   if(typeof v.createdAt==='string')p.createdAt=v.createdAt;
   out[p.id]=p}
  else bad++});
 if(bad)console.error('[Logo Studio] Ignored '+bad+' invalid saved favorite(s).');
 return out;
}
let FAV=loadFav(),P={},S={brand:'',cat:'',seen:[],result:null,status:'idle',msg:''};
const fill=(t,b)=>String(t||'').replace(/\{brand\}/gi,()=>b&&b.trim()?b.trim():'[ENTER BRAND NAME HERE]');
const fmt=t=>String(t).split(/\n\n/).map((b,i)=>{const m=/^([A-Z][A-Z0-9 \/\-]*):\n([\s\S]*)$/.exec(b);return m?`<h2>${esc(m[1])}</h2><p>${esc(m[2])}</p>`:`<p${i?'':' class="bn"'}>${esc(b)}</p>`}).join('');
const pv=t=>{const b=String(t).split(/\n\n/);return b[1]||b[0]||''};
const ART=`<div class="art" aria-hidden="true"><svg viewBox="0 0 400 400" fill="none" stroke="currentColor"><g class="ring"><circle cx="200" cy="200" r="190" stroke="var(--line)"/><circle cx="200" cy="200" r="145" stroke="var(--line)" stroke-dasharray="2 9"/><circle cx="200" cy="10" r="5" fill="var(--accent)" stroke="none"/></g><rect x="112" y="112" width="176" height="176" rx="44" stroke="var(--line)"/><circle cx="200" cy="200" r="92" stroke="var(--accent)" stroke-opacity=".55"/><path transform="translate(143 143) scale(1.14)" fill="var(--text)" fill-rule="evenodd" stroke="none" d="M81.95 36.71 L66.56 51.91 L51.48 52.09 L29.20 74.38 L33.86 79.22 L48.21 93.33 L48.94 93.70 L50.15 93.82 L51.06 93.70 L52.21 93.03 L93.52 51.91 L94.00 50.58 L94.00 49.49 L93.39 48.09ZM85.64 50.03 L50.09 85.40 L35.01 70.56 L52.09 53.36 L67.11 53.24 L77.89 42.46ZM51.18 6.36 L50.39 6.18 L49.00 6.30 L47.55 7.21 L6.73 47.91 L6.18 48.82 L6.06 50.70 L6.24 51.36 L6.91 52.39 L24.77 70.08 L25.80 70.62 L27.80 70.68 L29.01 70.08 L50.45 48.70 L64.26 48.70 L65.29 48.40 L66.44 47.61 L77.34 36.71 L78.01 35.62 L78.13 33.62 L77.47 32.22 L76.68 31.50 L75.71 31.07 L74.07 31.07 L72.62 31.80 L62.39 41.85 L49.49 41.79 L48.27 41.91 L47.55 42.22 L46.15 43.37 L26.89 62.51 L14.42 50.15 L49.91 14.60 L50.21 14.66 L67.65 32.04 L67.96 31.98 L72.50 27.38 L52.27 7.03Z"/></svg></div>`;
const catName=id=>(CATLIST.find(c=>c.id===id)||{}).name||id;
let tt;function toast(m,ms=2000){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),ms)}
async function copyText(t){try{await navigator.clipboard.writeText(t);return true}catch{try{const a=document.createElement('textarea');a.value=t;a.setAttribute('readonly','');a.style.cssText='position:fixed;top:0;left:0;opacity:0;pointer-events:none';document.body.appendChild(a);a.focus({preventScroll:true});a.select();const ok=document.execCommand('copy');a.remove();return ok}catch{return false}}}

/* ---------- theme ---------- */
let th=store.get('ls:theme',null);if(th!=='light'&&th!=='dark')th=null;
const LIGHTMQ=matchMedia('(prefers-color-scheme: light)');
function applyTheme(t){document.documentElement.dataset.theme=t;const m=document.querySelector('meta[name=theme-color]');if(m)m.content=t==='light'?'#F7F5FC':'#07060B'}
applyTheme(th||(LIGHTMQ.matches?'light':'dark'));
if(LIGHTMQ.addEventListener)LIGHTMQ.addEventListener('change',e=>{if(!th)applyTheme(e.matches?'light':'dark')});
function toggleTheme(){const cur=document.documentElement.dataset.theme||'dark';th=cur==='dark'?'light':'dark';applyTheme(th);store.set('ls:theme',th)}

/* ---------- nav ---------- */
const LINKS=[['home','Home','#/','home'],['examples','Examples','#/examples','grid'],['search','Search','#/search','search'],['categories','Categories','#/categories','grid'],['favorites','Favorites','#/favorites','heart']];
function favCount(){return Object.keys(FAV).length}
function drawNav(active){
 const badge=`<span class="cnt" data-fc ${favCount()?'':'hidden'}>${favCount()}</span>`;
 const mk=l=>`<a href="${l[2]}" ${l[0]===active?'aria-current="page"':''}>${ic(l[3])}${l[1]}${l[0]==='favorites'?badge:''}</a>`;
 $('#nav').innerHTML=LINKS.map(l=>mk(l)).join('');$('#bnav').innerHTML=LINKS.map(l=>mk(l)).join('');
}
function syncFav(){document.querySelectorAll('[data-fc]').forEach(e=>{e.textContent=favCount();e.hidden=!favCount()})}

/* ---------- components ---------- */
const skel=n=>Array.from({length:n},()=>`<div class="card sk" aria-hidden="true"><i class="t"></i><i></i><i></i><i class="s"></i></div>`).join('');
const stateBox=(icon,title,msg,btn='',cls='')=>`<div class="state ${cls}">${ic(icon)}<h2>${esc(title)}</h2><p>${esc(msg)}</p>${btn}</div>`;
const retry=a=>`<button class="btn sec" data-act="${a}">${ic('refresh')}Try again</button>`;
const ncBox=()=>`<div class="state">${ic('plug')}<h2>Prompt library unavailable</h2><p>The prompt library didn’t load. Reload the page, and if this keeps happening, update your browser.</p><button class="btn sec" data-act="reload">${ic('refresh')}Reload page</button></div>`;
function errBox(e,act){if(e&&e.code==='NOT_CONNECTED')return ncBox();return stateBox('alert','Something went wrong',(e&&e.message)||'The request failed. Check your connection and try again.',retry(act),'er')}
function card(p,pop,full){
 P[p.id]=p;const f=!!FAV[p.id],id=esc(p.id);
 return `<article class="card ${pop?'pop':''}" data-id="${id}"><header><span class="pid"><span class="k">Prompt ID</span><code>${id}</code></span>${p.category?`<span class="tag">${esc(catName(p.category))}</span>`:''}</header>
${full?`<div class="ptxt">${fmt(fill(p.text,S.brand))}</div>`:`<p class="pv">${esc(fill(pv(p.text),S.brand))}</p>`}
<footer><button class="ab" data-act="copy" data-id="${id}">${ic('copy')}Copy</button><button class="ab" data-act="share" data-id="${id}">${ic('share')}Share</button><button class="ab" data-act="fav" data-id="${id}" aria-pressed="${f}">${ic('heart')}Favorite</button><a class="ab" href="#/prompt/${encodeURIComponent(p.id)}">Details</a></footer></article>`;
}

/* ---------- views ---------- */
let sampleP=null;
const sampleData=()=>{if(!sampleP)sampleP=fetch(APP_BASE+'samples/samples.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error('Samples unavailable');return r.json()}).then(x=>Array.isArray(x.images)?x.images:[]);return sampleP};
function sampleCard(s){
 const rawId=s.promptId||s.prompt||'';
 const id=esc(rawId);
 const rawImg=s.image||((s.file||'').startsWith('samples/')?s.file:'samples/'+(s.file||''));
 const img=esc(rawImg);
 const title=esc(s.title||'Logo concept');
 const cat=esc(s.category||'');
 const alt=esc(s.alt||title);
 if(!id||!img)return '';
 return `<article class="sample-card"><a class="sample-media" href="#/prompt/${encodeURIComponent(rawId)}" aria-label="View prompt ${id}"><img src="${img}" alt="${alt}" loading="lazy" width="1200" height="900"></a><div class="sample-body"><div class="sample-top"><span class="sample-cat">${catName(cat)||cat}</span><span class="sample-badge">AI-generated</span></div><h3>${title}</h3><div class="sample-meta"><code>${id}</code></div><div class="sample-actions"><a class="ab" href="#/prompt/${encodeURIComponent(rawId)}">View Prompt</a><a class="ab sample-use" href="#/?use=${encodeURIComponent(s.promptId||s.prompt)}">Use Prompt</a></div></div></article>`;
}
async function loadSamples(){
 const grid=$('#sample-grid'),state=$('#sample-state');if(!grid||!state)return;
 try{
  const all=await sampleData();
  const valid=all.filter(s=>s&&(s.promptId||s.prompt)&&(s.image||s.file)&&s.alt&&s.category&&s.aiGenerated===true);
  if(!valid.length){state.hidden=false;grid.innerHTML='';return}
  const six=valid.slice(0,6);state.hidden=true;grid.innerHTML=six.map(sampleCard).join('');
  const more=$('#sample-more');if(more)more.hidden=valid.length<=6;
 }catch(e){state.hidden=false;grid.innerHTML='';state.textContent='Examples are unavailable right now.'}
}
async function loadUsePrompt(id){
 if(!id)return;
 try{const p=await API.get(id);if(p&&p.id){S.result=p;S.status='ok';drawResult(true);const r=$('#result');if(r)r.scrollIntoView({behavior:'smooth',block:'start'})}}
 catch(e){S.status=e&&e.code==='NOT_CONNECTED'?'nc':'err';S.msg=e&&e.message||'Could not load this prompt.';drawResult(true)}
}
function home(prm){
 if(prm.get('c')!==null)S.cat=prm.get('c');
 app.innerHTML=`<section class="hero view" data-s="idle"><div class="hero-copy"><p class="eyebrow">Logo Studio</p><h1>Create a direction <em>for your brand.</em></h1><p class="lede">Enter a brand name, choose a style, and generate a structured logo prompt you can use with your preferred image tool.</p>
<form class="gen" id="gf" novalidate><div><label for="bn">Brand name</label><input class="inp" id="bn" dir="auto" autocomplete="off" maxlength="60" placeholder="Enter your brand name…" value="${esc(S.brand)}" style="margin-top:10px"><p class="fe" id="bnerr" role="alert"></p></div>
<div><label for="sc">Style</label><select class="inp" id="sc" style="margin-top:10px"><option value="">All styles</option>${CATLIST.map(c=>`<option value="${esc(c.id)}" ${c.id===S.cat?'selected':''}>${esc(c.name)}</option>`).join('')}</select></div>
<button class="btn pri" id="gb" type="submit">${ic('wand')}Generate Prompt</button></form></div>
<div class="out"><div class="hero-mark" aria-hidden="true">${ART}</div><div class="tile"><div class="mono" id="mono"></div><div><div class="tn" id="tn" dir="auto"></div><div class="ts">Brand preview</div></div></div><div id="result" aria-live="polite"></div></div></section>
<section class="sample-section" aria-labelledby="samples-title"><div class="section-head"><div><p class="eyebrow">Sample work</p><h2 id="samples-title">Explore Logo Examples</h2><p>See how Logo Studio prompts can translate into different visual directions.</p></div><a id="sample-more" class="ab" href="#/examples" hidden>View all examples</a></div><div class="sample-grid" id="sample-grid"></div><div class="sample-state" id="sample-state" hidden>Examples are coming soon.</div></section>`;
 tile();drawResult();loadSamples();
 const use=prm.get('use');if(use)loadUsePrompt(use);
}
function tile(){const b=S.brand.trim(),w=b.split(/\s+/).filter(Boolean);$('#mono')&&($('#mono').textContent=w.length?(Array.from(w[0])[0]+(w[1]?Array.from(w[1])[0]:'')).toUpperCase():'?');const n=$('#tn');if(n){n.textContent=b||'Your brand';n.classList.toggle('ph',!b)}}
function drawResult(pop){
 const r=$('#result');if(!r)return;const s=S.status;
 const hh=$('.hero');if(hh)hh.dataset.s=s;const gb=$('#gb');if(gb)gb.disabled=s==='loading';
 r.innerHTML=s==='loading'?skel(1):s==='ok'?card(S.result,pop,true)+`<button class="btn sec" data-act="again" style="width:100%;margin-top:14px">${ic('refresh')}Generate again</button>`
 :s==='nc'?ncBox():s==='err'?errBox({message:S.msg},'retry-gen'):s==='empty'?stateBox('search','No prompt found','Nothing matched this category yet. Try another category or choose All styles.'):stateBox('wand','Your prompt appears here','Add a brand name, choose a category, and select Generate prompt.');
}
async function generate(){
 const b=S.brand.trim(),er=$('#bnerr'),bn=$('#bn');
 if(!b){if(er){er.textContent='Enter a brand name to continue.';bn.classList.add('bad');bn.focus()}return}
 S.status='loading';drawResult();
 try{const p=await API.generate({brand:b,category:S.cat,exclude:S.seen.slice(-50)});
  if(!p||!p.id||!p.text){S.status='empty'}else{S.seen.push(p.id);S.result=p;S.status='ok'}}
 catch(e){if(e&&e.code==='NOT_CONNECTED')S.status='nc';else{S.status='err';S.msg=(e&&e.message)||''}}
 drawResult(true);
}
let sTok=0,Q={q:'',c:'',page:1,items:[]};
function search(prm){
 Q.q=prm.get('q')||'';Q.c=prm.get('c')||'';
 app.innerHTML=`<section class="view"><h1 class="h2">Search prompts</h1><form class="sform" id="sf" role="search"><div class="sbox">${ic('search')}<input id="q" type="search" dir="auto" autocomplete="off" aria-label="Search prompts" placeholder="Search prompts, categories or Prompt ID…" value="${esc(Q.q)}"></div><select class="inp" id="qc" aria-label="Category"><option value="">All categories</option>${CATLIST.map(c=>`<option value="${esc(c.id)}" ${c.id===Q.c?'selected':''}>${esc(c.name)}</option>`).join('')}</select></form><div class="list" id="sres" aria-live="polite"></div></section>`;
 runSearch(true);
}
async function runSearch(reset){
 const el=$('#sres');if(!el)return;const tok=++sTok;
 if(!Q.q.trim()&&!Q.c){el.innerHTML=stateBox('search','Search the prompt library','Type a keyword or a Prompt ID, or choose a category to begin.');return}
 if(reset){Q.page=1;Q.items=[];el.innerHTML=skel(3)}
 try{const r=await API.search({query:Q.q.trim(),category:Q.c,page:Q.page});if(tok!==sTok)return;
  Q.items=Q.items.concat((r&&r.items)||[]);Q.more=!!(r&&r.hasMore);
  el.innerHTML=Q.items.length?Q.items.map(p=>card(p)).join('')+(Q.more?`<button class="btn sec" data-act="more">Load more</button>`:''):stateBox('search','No results',Q.q||Q.c?'Nothing matched your search. Prompts are written in English, so try different English keywords, a Prompt ID, or another category.':'There are no prompts to show yet.');
 }catch(e){if(tok===sTok)el.innerHTML=errBox(e,'retry-search')}
}
async function examples(){
 app.innerHTML=`<section class="view examples-page"><a class="back" href="#/">${ic('arrow')}Back</a><p class="eyebrow">Sample work</p><h1 class="h2">Explore Logo Examples</h1><p class="lede">Curated demonstrations connected to the real Logo Studio prompt library.</p><div class="sample-grid" id="sample-grid"></div><div class="sample-state" id="sample-state">Loading examples…</div></section>`;
 try{const all=await sampleData();const valid=all.filter(s=>s&&(s.promptId||s.prompt)&&(s.image||s.file)&&s.alt&&s.category&&s.aiGenerated===true);const g=$('#sample-grid'),st=$('#sample-state');g.innerHTML=valid.map(sampleCard).join('');st.hidden=!!valid.length;if(!valid.length)st.textContent='Examples are coming soon.'}catch(e){$('#sample-state').textContent='Examples are unavailable right now.'}
}
async function categories(){
 app.innerHTML=`<section class="view"><h1 class="h2">Categories</h1><p class="lede">Pick a logo style to browse its prompts or generate a new one.</p><div class="cats" id="cg">${skel(4)}</div></section>`;
 let list=CATLIST,failed=false; /* the built-in list mirrors the library, so this page never waits for it */
 if(location.hash.indexOf('categories')<0)return;
 const g=$('#cg');
 if(failed){g.innerHTML=stateBox('alert','Categories couldn’t be loaded','Reload the page and try again. If this keeps happening, update your browser.',retry('retry-cats'),'er');g.style.display='block';return}
 if(!list||!list.length){g.innerHTML=stateBox('grid','No categories yet','Categories will appear here once the library is connected.');g.style.display='block';return}
 CATLIST=list;g.innerHTML=list.map(c=>`<div class="cc"><h2>${esc(c.name)}</h2><p>${esc(c.desc||'')}</p><div class="ca"><a class="ab" href="#/search?c=${encodeURIComponent(c.id)}">${ic('search')}Browse</a><a class="ab" href="#/?c=${encodeURIComponent(c.id)}">${ic('wand')}Generate</a></div></div>`).join('');
}
function favorites(){
 const items=Object.values(FAV);
 app.innerHTML=`<section class="view"><h1 class="h2">Favorites</h1><div class="list">${items.length?items.map(p=>card(p)).join(''):stateBox('heart','No favorites yet','Select Favorite on any prompt to save it here. Favorites stay on this device.','<a class="btn pri" href="#/">Generate a prompt</a>')}</div></section>`;
}
async function details(id){
 app.innerHTML=`<section class="view"><a class="back" href="#/" data-act="back">${ic('arrow')}Back</a><h1 class="h2">Prompt details</h1><div class="det" id="dt">${skel(1)}</div></section>`;
 let p=null,err=null;try{p=await API.get(id)}catch(e){err=e;p=FAV[id]||null}
 if(!location.hash.includes('prompt'))return;const d=$('#dt');
 if(!p||!p.id){d.innerHTML=`<div style="grid-column:1/-1">${err&&err.code!=='NOT_CONNECTED'?errBox(err,'retry-detail'):err?ncBox():stateBox('search','Prompt not found','No prompt exists with ID '+id+'.','<a class="btn sec" href="#/search">Search prompts</a>')}</div>`;return}
 const rows=[['Prompt ID',p.id],['Category',p.category?catName(p.category):''],['Tags',(p.tags||[]).join(', ')],['Created',p.createdAt?new Date(p.createdAt).toLocaleDateString():'']].filter(r=>r[1]);
 d.innerHTML=`<div>${card(p,false,true)}</div><div class="card"><div><label for="db">Preview with your brand name</label><input class="inp" id="db" dir="auto" maxlength="60" placeholder="Your brand name" value="${esc(S.brand)}" style="margin-top:8px"></div><dl>${rows.map(r=>`<dt>${r[0]}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl></div>`;
}

/* ---------- keep category lists in sync once the library connects (no page re-render) ---------- */
function refreshCats(){
 const opts=(val,all)=>`<option value="">${all}</option>`+CATLIST.map(c=>`<option value="${esc(c.id)}" ${c.id===val?'selected':''}>${esc(c.name)}</option>`).join('');
 const sc=$('#sc');if(sc)sc.innerHTML=opts(S.cat,'All styles');
 const qc=$('#qc');if(qc)qc.innerHTML=opts(Q.c,'All categories');
}

/* ---------- router ---------- */
function safeDecode(s){try{return decodeURIComponent(s)}catch(e){console.error('[Logo Studio] Invalid encoding in the page address.',e);return null}}
function route(){
 const h=location.hash.slice(1)||'/',[path,qs]=h.split('?'),prm=new URLSearchParams(qs||''),seg=path.split('/').filter(Boolean),v=seg[0]||'home';
 drawNav(['home','examples','search','categories','favorites'].includes(v)?v:'');window.scrollTo(0,0);
 const si=document.getElementById('seo-intro');if(si)si.hidden=v!=='home';
 if(v==='home')home(prm);else if(v==='search')search(prm);else if(v==='categories')categories();else if(v==='favorites')favorites();else if(v==='prompt'&&seg[1]){const pid=safeDecode(seg[1]);if(pid===null)app.innerHTML=`<div class="view">${stateBox('alert','Invalid link','This prompt link isn’t valid. Check the address and try again.','<a class="btn pri" href="#/">Go home</a>')}</div>`;else details(pid)}
 else app.innerHTML=`<div class="view">${stateBox('alert','Page not found','This page doesn’t exist.','<a class="btn pri" href="#/">Go home</a>')}</div>`;
}
const RM=matchMedia('(prefers-reduced-motion:reduce)');let ct;
addEventListener('hashchange',()=>{const c=$('#curtain');if(!c||RM.matches){route();return}clearTimeout(ct);c.classList.remove('go');void c.offsetWidth;c.classList.add('go');ct=setTimeout(route,330);setTimeout(()=>c.classList.remove('go'),850)});

/* ---------- events ---------- */
document.addEventListener('click',async e=>{
 const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act,id=t.dataset.id;
 if(a==='theme')toggleTheme();
 else if(a==='back'){e.preventDefault();history.length>1?history.back():(location.hash='#/')}
 else if(a==='reload')location.reload();
 else if(a==='again'||a==='retry-gen')generate();
 else if(a==='retry-search')runSearch(true);
 else if(a==='retry-detail')route();
 else if(a==='retry-cats')categories();
 else if(a==='more'){Q.page++;runSearch(false)}
 else if(a==='copy'&&P[id]){const has=!!S.brand.trim(),ok=await copyText(fill(P[id].text,S.brand));
  if(!ok)toast('Copy failed. Select the text and copy manually.');
  else if(has)toast('Copied to clipboard');
  else toast('Copied. Replace [ENTER BRAND NAME HERE] with your brand name.',3800)}
 else if(a==='share'&&P[id]){
  const url=APP_BASE+'#/prompt/'+encodeURIComponent(id);
  if(location.protocol==='file:'){toast('Share links work once the site is uploaded to a host.',3800)}
  else if(navigator.share){try{await navigator.share({title:'Logo Studio prompt '+id,text:fill(P[id].text,S.brand),url})}catch(err){if(!err||err.name!=='AbortError')toast(await copyText(url)?'Link copied':'Couldn’t copy the link')}}
  else toast(await copyText(url)?'Link copied':'Couldn’t copy the link');
 }
 else if(a==='fav'&&P[id]){
  if(FAV[id]){delete FAV[id];toast('Removed from favorites')}else{FAV[id]=P[id];toast('Saved to favorites')}
  store.set('ls:fav',FAV);syncFav();
  if(($('#app').querySelector('h1')||{}).textContent==='Favorites')favorites();
  else document.querySelectorAll('[data-act=fav]').forEach(b=>{if(b.dataset.id===id)b.setAttribute('aria-pressed',!!FAV[id])});
 }
});
document.addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='gf')generate()});
let dt;
document.addEventListener('input',e=>{
 const i=e.target;
 if(i.id==='bn'){S.brand=i.value;i.classList.remove('bad');$('#bnerr').textContent='';tile();const rt=$('#result .ptxt');if(rt&&S.result)rt.innerHTML=fmt(fill(S.result.text,S.brand))}
 else if(i.id==='db'){S.brand=i.value;const x=document.querySelector('.ptxt');const p=P[document.querySelector('.card[data-id]')?.dataset.id];if(x&&p)x.innerHTML=fmt(fill(p.text,S.brand))}
 else if(i.id==='q'){Q.q=i.value;clearTimeout(dt);dt=setTimeout(()=>{history.replaceState(null,'','#/search?q='+encodeURIComponent(Q.q)+(Q.c?'&c='+encodeURIComponent(Q.c):''));runSearch(true)},300)}
});
document.addEventListener('change',e=>{if(e.target.id==='sc')S.cat=e.target.value;if(e.target.id==='qc'){Q.c=e.target.value;history.replaceState(null,'','#/search?q='+encodeURIComponent(Q.q)+(Q.c?'&c='+encodeURIComponent(Q.c):''));runSearch(true)}});
route();
if(!RM.matches&&matchMedia('(hover:hover)').matches){let tx=innerWidth*.7,ty=innerHeight*.2,cx=tx,cy=ty,raf=0;const tick=()=>{cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;const s=document.body.style;s.setProperty('--mx',cx+'px');s.setProperty('--my',cy+'px');raf=Math.abs(tx-cx)+Math.abs(ty-cy)>.5?requestAnimationFrame(tick):0};addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(tick)},{passive:true})}

/* ---------- start fetching the prompt library once the page is idle, or at the first sign of interaction ---------- */
(function(){
 const go=()=>{ensureLib().catch(()=>{})};
 const idle=window.requestIdleCallback||(f=>setTimeout(f,1500));
 addEventListener('load',()=>idle(go,{timeout:4000}));
 ['pointerdown','keydown','focusin','touchstart'].forEach(ev=>addEventListener(ev,go,{once:true,passive:true}));
})();
