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
let adapter=null,CATLIST=DEFAULT_CATS,ncSeen=false,LIBSTATS=null;
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
window.LogoStudio={connect(a){adapter=a;readyRes();if(a&&typeof a.stats==='function')a.stats().then(x=>{LIBSTATS=x;refreshStats()},()=>{});API.categories().then(c=>{if(Array.isArray(c)&&c.length)CATLIST=c},()=>{/* already logged by API.categories; the built-in category list stays in use */}).then(()=>{
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
const NAVI={home:['Home','#/','home'],studio:['Studio','#/studio','wand'],examples:['Examples','#/examples','image'],search:['Search','#/search','search'],categories:['Categories','#/categories','grid'],favorites:['Favorites','#/favorites','heart'],projects:['Projects','#/projects','folder'],'my-prompts':['My Prompts','#/my-prompts','spark'],popular:['Top rated','#/popular','star']};
/* Desktop header, phone bottom bar, and the "More" menu (one list; the two entries already in the desktop header carry class m-only and are hidden there). */
const NAV_TOP=['studio','examples','search','categories','favorites'],NAV_BAR=['home','studio','search','favorites'],NAV_MORE=['examples','categories','projects','my-prompts','popular'],MORE_DESK=['projects','my-prompts','popular'];
function favCount(){return Object.keys(FAV).length}
function drawNav(active){
 const badge=`<span class="cnt" data-fc ${favCount()?'':'hidden'}>${favCount()}</span>`;
 const mk=(k,cls)=>{const l=NAVI[k];return `<a href="${l[1]}"${cls?` class="${cls}"`:''} ${k===active?'aria-current="page"':''}>${ic(l[2])}<span>${l[0]}</span>${k==='favorites'?badge:''}</a>`};
 const more=`<button type="button" class="more-btn" data-act="more-menu" aria-haspopup="true" aria-expanded="false" aria-controls="more-panel" data-d="${MORE_DESK.includes(active)?1:0}" data-m="${NAV_MORE.includes(active)?1:0}">${ic('more')}<span>More</span></button>`;
 $('#nav').innerHTML=NAV_TOP.map(k=>mk(k)).join('')+more;
 $('#bnav').innerHTML=NAV_BAR.map(k=>mk(k)).join('')+more;
 const mp=$('#more-panel');if(mp){mp.innerHTML=NAV_MORE.map(k=>mk(k,MORE_DESK.includes(k)?'':'m-only')).join('');mp.hidden=true}
 document.querySelectorAll('.more-btn').forEach(b=>b.setAttribute('aria-expanded','false'));
}
function toggleMore(btn,force){
 const mp=$('#more-panel');if(!mp)return;const open=force!==undefined?force:mp.hidden;
 mp.hidden=!open;document.querySelectorAll('.more-btn').forEach(b=>b.setAttribute('aria-expanded',open?'true':'false'));
 if(open){const f=mp.querySelector('a:not(.m-only), a.m-only');const first=Array.prototype.find.call(mp.querySelectorAll('a'),a=>a.offsetParent!==null);if(first&&btn&&btn.dataset&&btn.dataset.kb)first.focus()}
}
function syncFav(){document.querySelectorAll('[data-fc]').forEach(e=>{e.textContent=favCount();e.hidden=!favCount()})}

/* ---------- components ---------- */
const skel=n=>Array.from({length:n},()=>`<div class="card sk" aria-hidden="true"><i class="t"></i><i></i><i></i><i class="s"></i></div>`).join('');
const stateBox=(icon,title,msg,btn='',cls='')=>`<div class="state ${cls}">${ic(icon)}<h2>${esc(title)}</h2><p>${esc(msg)}</p>${btn}</div>`;
const retry=a=>`<button class="btn sec" data-act="${a}">${ic('refresh')}Try again</button>`;
const ncBox=()=>`<div class="state">${ic('plug')}<h2>Prompt library unavailable</h2><p>The prompt library didn’t load. Reload the page, and if this keeps happening, update your browser.</p><button class="btn sec" data-act="reload">${ic('refresh')}Reload page</button></div>`;
function errBox(e,act){if(e&&e.code==='NOT_CONNECTED')return ncBox();return stateBox('alert','Something went wrong',(e&&e.message)||'The request failed. Check your connection and try again.',retry(act),'er')}
function starButtons(id,userRating){
 const r=Number(userRating)||0;
 return Array.from({length:5},(_,i)=>{const n=i+1;return `<button class="prompt-star ${n<=r?'active':''}" data-act="rate-prompt" data-id="${esc(id)}" data-rating="${n}" aria-label="Rate ${n} star${n===1?'':'s'}" aria-pressed="${n===r?'true':'false'}">★</button>`}).join('');
}
function communityMarkup(id){return `<div class="prompt-community" data-community="${esc(id)}"><span class="prompt-stars" aria-label="Prompt rating">${starButtons(id,0)}</span><span class="community-meta">Loading rating…</span></div>`}
async function hydrateCommunity(root){const nodes=(root||document).querySelectorAll('[data-community]');for(const el of nodes){if(el.dataset.loaded==='1')continue;el.dataset.loaded='1';const id=el.dataset.community;try{const x=await LogoStudioCommunityMetrics.get(id);const stars=Math.round(Number(x.stars)||0);el.querySelector('.prompt-stars').innerHTML=starButtons(id,x.userRating);el.querySelector('.community-meta').textContent=x.available?(stars?`${stars}/5 · ${Number(x.ratings||0)} rating${Number(x.ratings||0)===1?'':'s'} · ${Number(x.uses||0)} uses`:'No community ratings yet'):(x.userRating?`Your rating: ${x.userRating}/5`:'Rate this prompt')}catch(e){const m=window.LogoStudioPromptLearning?LogoStudioPromptLearning.metrics(id):{};el.querySelector('.community-meta').textContent=`Local activity: ${Number(m.useCount||0)} use${Number(m.useCount||0)===1?'':'s'}`}}}
async function ratePrompt(id,rating){if(!id)return;const result=await LogoStudioCommunityMetrics.rate(id,Number(rating));document.querySelectorAll('[data-community]').forEach(el=>{if(el.dataset.community===id)el.dataset.loaded='0'});await hydrateCommunity(document);toast(result.available?'Your rating was saved':'Rating saved on this device')}
function communitySummaryCard(p,rank,metrics){const id=esc(p.id),stars=Number(metrics.stars||0),ratings=Number(metrics.ratings||0),uses=Number(metrics.uses||0);return `<article class="card community-leader"><header><span class="community-rank">#${rank}</span><span class="pid"><code>${id}</code></span></header><p class="pv">${esc(pv(p.text||''))}</p><div class="prompt-community"><span class="prompt-stars" aria-label="${stars} out of 5 stars">${starButtons(id,0)}</span><span class="community-meta">${stars}/5 · ${ratings} rating${ratings===1?'':'s'} · ${uses} uses</span></div><footer><button class="ab" data-act="copy" data-id="${id}">${ic('copy')}Copy</button><a class="ab" href="#/prompt/${encodeURIComponent(p.id)}">Details</a></footer></article>`}
async function popular(){
 const M=window.LogoStudioCommunityMetrics,shared=!!(M&&M.enabled);
 app.innerHTML=`<section class="view"><div class="studio-head"><div><p class="eyebrow">${shared?'Community':'Your ratings'}</p><h1 class="h2">Top rated prompts</h1><p class="lede">${shared?'Prompts ranked by real community ratings and usage. No fake counters are shown.':'Your highest-rated prompts on this device. Use the stars on any prompt to rate it and it will appear here.'}</p></div></div><div class="list" id="popular-list">${skel(4)}</div></section>`;
 const box=$('#popular-list');if(!box)return;
 try{
  if(shared){
   const r=await fetch(M.endpoint+'?sort=popular&limit=20',{credentials:'same-origin',headers:{'Accept':'application/json'},cache:'no-store'});
   if(!r.ok)throw new Error('unavailable');
   const data=await r.json(),items=Array.isArray(data.items)?data.items:[];
   if(!location.hash.startsWith('#/popular'))return;
   if(!items.length){box.innerHTML=stateBox('star','No community rankings yet','Highly rated prompts will appear here once people start rating them.');return}
   box.innerHTML=items.map((x,i)=>communitySummaryCard(x.prompt||x,i+1,x)).join('');return}
  const rated=M?M.ratedIds(20):[];
  if(!rated.length){box.innerHTML=stateBox('star','No rated prompts yet','Open any prompt and tap the stars to rate it. Your best-rated prompts are listed here.','<a class="btn pri" href="#/search">Browse prompts</a>');return}
  const found=await Promise.all(rated.map(x=>API.get(x.id).catch(()=>null)));
  if(!location.hash.startsWith('#/popular'))return;
  const prompts=found.filter(p=>p&&p.id);
  box.innerHTML=prompts.length?prompts.map(p=>card(p)).join(''):stateBox('star','No rated prompts yet','Open any prompt and tap the stars to rate it.');
  hydrateCommunity(box);
 }catch(e){if(location.hash.startsWith('#/popular'))box.innerHTML=stateBox('star','Rankings are unavailable right now','Try again in a moment. Your own ratings stay saved on this device.',retry('retry-popular'),'er')}
}

function card(p,pop,full){
 P[p.id]=p;const f=!!FAV[p.id],id=esc(p.id);
 return `<article class="card ${pop?'pop':''}" data-id="${id}"><header><span class="pid"><span class="k">Prompt ID</span><code>${id}</code></span>${p.category?`<span class="tag">${esc(catName(p.category))}</span>`:''}</header>
${full?`<div class="ptxt">${fmt(fill(p.text,S.brand))}</div>`:`<p class="pv">${esc(fill(pv(p.text),S.brand))}</p>`}${communityMarkup(p.id)}
<footer><button class="ab" data-act="copy" data-id="${id}">${ic('copy')}Copy</button><button class="ab" data-act="share" data-id="${id}">${ic('share')}Share</button><button class="ab" data-act="fav" data-id="${id}" aria-pressed="${f}">${ic('heart')}Favorite</button>${studioProjectId?`<button class="ab" data-act="save-library" data-id="${id}">${ic('grid')}Project</button>`:''}<a class="ab" href="#/prompt/${encodeURIComponent(p.id)}">Details</a></footer></article>`;
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
 const studio=String(s.source||'').toLowerCase()==='studio';
 if(!id||!img)return '';
 const action=studio?`<a class="ab sample-use" href="#/studio">Open Studio</a>`:`<a class="ab" href="#/prompt/${encodeURIComponent(rawId)}">View Prompt</a><a class="ab sample-use" href="#/?use=${encodeURIComponent(s.promptId||s.prompt)}">Use Prompt</a>`;
 return `<article class="sample-card"><a class="sample-media" href="${studio?'#/studio':'#/prompt/'+encodeURIComponent(rawId)}" aria-label="${studio?'Open Studio':'View prompt '+id}"><img src="${img}" alt="${alt}" loading="lazy" width="1200" height="900"></a><div class="sample-body"><div class="sample-top"><span class="sample-cat">${catName(cat)||cat}</span><span class="sample-badge">${studio?'Studio Generated':'AI-generated'}</span></div><h3>${title}</h3><div class="sample-meta"><code>${id}</code>${s.industry?`<span class="tag">${esc(s.industry)}</span>`:''}</div>${studio&&s.promptText?`<details class="sample-prompt"><summary>Prompt used</summary><p>${esc(s.promptText)}</p></details>`:''}<div class="sample-actions">${action}</div></div></article>`;
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
/* ---------- home page sections (all numbers are read from the real data, none are typed in) ---------- */
function statItem(id,label,v){return `<div class="stat"><b id="${id}">${v==null?'—':esc(String(v))}</b><span>${label}</span></div>`}
function homeIntro(){
 const inds=reg(window.LogoStudioIndustries).length,vars=Object.keys(VARLABEL).length;
 return `<section class="stats" id="home-stats" aria-label="Logo Studio at a glance">${statItem('st-styles','Logo styles',LIBSTATS?LIBSTATS.categories:CATLIST.length)}${statItem('st-prompts','Library prompts',LIBSTATS?LIBSTATS.total.toLocaleString('en-US'):null)}${statItem('st-inds','Industries in Studio',inds||null)}${statItem('st-vars','Prompt variations per direction',vars||null)}</section>
<section class="how" aria-labelledby="how-title"><div class="section-head"><div><p class="eyebrow">Three steps</p><h2 id="how-title">How it works</h2></div></div><ol class="steps"><li><span class="n">1</span><h3>Enter your brand</h3><p>Type a brand name and choose a logo style. Prompts show your name in place, ready to copy.</p></li><li><span class="n">2</span><h3>Choose a style</h3><p>Generate a prompt from the library at once, or open Studio for a full concept, Logo DNA and prompt variations.</p></li><li><span class="n">3</span><h3>Copy and create</h3><p>Paste the prompt into your preferred image tool. Favorites and projects are saved on this device.</p></li></ol></section>`;
}
function homeMore(){
 const F=[['wand','Prompt generator','Brand name plus style gives a structured prompt in one click.','focus-brand','Try it'],['folder','Concept studio','A guided workspace from brief to concept, Logo DNA, prompt and variations.','#/studio','Open Studio'],['search','Prompt library','Search by keyword, style or Prompt ID across every logo style.','#/search','Search'],['grid','Saved projects','Keep directions on this device. Rename, duplicate, export and import them.','#/projects','Projects'],['heart','Favorites & My Prompts','Save the prompts you like and keep everything Studio generated.','#/favorites','Favorites'],['image','Logo examples','AI-generated visual demonstrations linked to real prompts.','#/examples','Examples']];
 const feat=F.map(f=>{const a=f[3].charAt(0)==='#'?`<a class="ab" href="${f[3]}">${f[4]}</a>`:`<button type="button" class="ab" data-act="${f[3]}">${f[4]}</button>`;return `<article class="feat">${ic(f[0])}<h3>${f[1]}</h3><p>${f[2]}</p>${a}</article>`}).join('');
 const tiles=CATLIST.map(c=>{const d=String(c.desc||'').split(/(?<=\.)\s/)[0];return `<a class="style-tile" href="#/search?c=${encodeURIComponent(c.id)}"><b>${esc(c.name)}</b><span>${esc(d)}</span></a>`}).join('');
 return `<section class="feats" aria-labelledby="feat-title"><div class="section-head"><div><p class="eyebrow">Everything in one place</p><h2 id="feat-title">Features</h2></div></div><div class="feat-grid">${feat}</div></section>
<section class="styles-home" aria-labelledby="sty-title"><div class="section-head"><div><p class="eyebrow">Library</p><h2 id="sty-title">Browse by style</h2><p>Every style has its own set of prompts. Open one to search it.</p></div><a class="ab" href="#/categories">All categories</a></div><div class="style-grid">${tiles}</div></section>`;
}
function refreshStats(){
 const set=(id,v)=>{const e=document.getElementById(id);if(e&&v!=null)e.textContent=v};
 if(!LIBSTATS)return;set('st-styles',LIBSTATS.categories);set('st-prompts',LIBSTATS.total.toLocaleString('en-US'));
}
function home(prm){
 if(prm.get('c')!==null)S.cat=prm.get('c');
 app.innerHTML=`<section class="hero view" data-s="idle"><div class="hero-copy"><p class="eyebrow">Logo Studio</p><h1>Create a direction <em>for your brand.</em></h1><p class="lede">Enter a brand name, choose a style, and generate a structured logo prompt you can use with your preferred image tool.</p>
<form class="gen" id="gf" novalidate><div><label for="bn">Brand name</label><input class="inp" id="bn" dir="auto" autocomplete="off" maxlength="60" placeholder="Enter your brand name…" value="${esc(S.brand)}" style="margin-top:10px"><p class="fe" id="bnerr" role="alert"></p></div>
<div><label for="sc">Style</label><select class="inp" id="sc" style="margin-top:10px"><option value="">All styles</option>${CATLIST.map(c=>`<option value="${esc(c.id)}" ${c.id===S.cat?'selected':''}>${esc(c.name)}</option>`).join('')}</select></div>
<button class="btn pri" id="gb" type="submit">${ic('wand')}Generate Prompt</button></form></div>
<div class="out"><div class="hero-mark" aria-hidden="true">${ART}</div><div class="tile"><div class="mono" id="mono"></div><div><div class="tn" id="tn" dir="auto"></div><div class="ts">Brand preview</div></div></div><div id="result" aria-live="polite"></div></div></section>${homeIntro()}
<section class="sample-section" aria-labelledby="samples-title"><div class="section-head"><div><p class="eyebrow">Sample work</p><h2 id="samples-title">Explore Logo Examples</h2><p>See how Logo Studio prompts can translate into different visual directions.</p></div><a id="sample-more" class="ab" href="#/examples" hidden>View all examples</a></div><div class="sample-grid" id="sample-grid"></div><div class="sample-state" id="sample-state" hidden>Examples are coming soon.</div></section>${homeMore()}`;
 tile();drawResult();loadSamples();refreshStats();
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
 app.innerHTML=`<section class="view"><h1 class="h2">Search prompts</h1><form class="sform" id="qf" role="search"><div class="sbox">${ic('search')}<input id="q" type="search" dir="auto" autocomplete="off" aria-label="Search prompts" placeholder="Search prompts, categories or Prompt ID…" value="${esc(Q.q)}"></div><select class="inp" id="qc" aria-label="Category"><option value="">All categories</option>${CATLIST.map(c=>`<option value="${esc(c.id)}" ${c.id===Q.c?'selected':''}>${esc(c.name)}</option>`).join('')}</select></form><div class="list" id="sres" aria-live="polite"></div></section>`;
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
 app.innerHTML=`<section class="view examples-page"><a class="back" href="#/">${ic('arrow')}Back</a><p class="eyebrow">Sample work</p><h1 class="h2">Explore Logo Examples</h1><p class="lede">Real examples connected to Logo Studio prompts, including Studio-generated showcase directions.</p><div class="example-filters"><button class="ab active" data-act="filter-examples" data-filter="all">All</button><button class="ab" data-act="filter-examples" data-filter="studio">Studio Generated</button><button class="ab" data-act="filter-examples" data-filter="library">Library</button></div><div class="sample-grid" id="sample-grid"></div><div class="sample-state" id="sample-state">Loading examples…</div></section>`;
 try{const all=await sampleData();window.__logoExamples=all.filter(s=>s&&(s.promptId||s.prompt)&&(s.image||s.file)&&s.alt&&s.category&&s.aiGenerated===true);renderExamples('all')}catch(e){$('#sample-state').textContent='Examples are unavailable right now.'}
}
function renderExamples(filter){const all=window.__logoExamples||[],valid=filter==='studio'?all.filter(s=>s.source==='studio'):filter==='library'?all.filter(s=>s.source!=='studio'):all,g=$('#sample-grid'),st=$('#sample-state');if(!g||!st)return;g.innerHTML=valid.map(sampleCard).join('');st.hidden=!!valid.length;if(!valid.length)st.textContent='No examples in this filter yet.';document.querySelectorAll('[data-act=filter-examples]').forEach(function(b){b.classList.toggle('active',b.dataset.filter===filter)})}
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


/* ---------- Stage 11: Studio + local projects ---------- */
const STUDIO_OPTS={
 audience:['Founders & startups','Developers & technical teams','Young adults','Families','Professionals & B2B','Luxury customers','Students','Gamers','Everyone'],
 feeling:['trust','innovation','warmth','luxury','energy','calm','playfulness','confidence','reliability','creativity'],
 keywords:['signal','structure','growth','connection','speed','craft','nature','community','precision','future','heritage','light'],
 colors:['black','white','silver','gold','navy','electric blue','red','green','orange','purple','brown','cream'],
 complexity:[['simple','Simple'],['controlled','Controlled'],['expressive','Expressive'],['intricate','Intricate']]
};
const STUDIO_MAX={personality:3,feeling:3,keywords:5,colors:4,style:4,audience:2};
const cap=t=>String(t).charAt(0).toUpperCase()+String(t).slice(1);
const reg=R=>{try{const o=(R&&R.list&&typeof R.list==='object')?R.list:R;return Object.keys(o).filter(k=>o[k]&&typeof o[k]==='object'&&(o[k].label||o[k].name)).map(k=>({key:k,label:o[k].label||o[k].name,family:o[k].family}))}catch(e){return[]}};
function chipBtn(val,label,on,custom){return `<button type="button" class="chip${custom?' custom':''}" data-act="chip" data-val="${esc(val)}" aria-pressed="${on?'true':'false'}">${esc(label)}</button>`}
function chipGroup(name,label,opts,o){o=o||{};const sel=(o.sel||[]).map(x=>String(x).toLowerCase());const chips=opts.map(x=>{const v=Array.isArray(x)?x[0]:x,l=Array.isArray(x)?x[1]:cap(x);return chipBtn(v,l,sel.indexOf(String(v).toLowerCase())>=0||sel.indexOf(String(l).toLowerCase())>=0)}).join('');
 const add=o.custom?`<div class="chip-add-row"><input class="inp chip-add" data-chip-add="${name}" maxlength="30" placeholder="Add your own…" aria-label="Add your own ${esc(label.toLowerCase())}"><button type="button" class="ab" data-act="chip-add" data-chip-target="${name}">Add</button></div>`:'';
 return `<div class="studio-wide chip-field"><span class="flabel" id="cl-${name}">${esc(label)}${o.hint?` <small>${esc(o.hint)}</small>`:''}</span><div class="chips" role="group" aria-labelledby="cl-${name}" data-chips="${name}" data-mode="${o.mode||'multi'}">${chips}</div>${add}</div>`}
function chipVals(n){return Array.prototype.map.call(document.querySelectorAll('[data-chips="'+n+'"] .chip[aria-pressed="true"]'),b=>b.dataset.val)}
function setChips(n,vals){const g=document.querySelector('[data-chips="'+n+'"]');if(!g)return;vals=(Array.isArray(vals)?vals:(vals?String(vals).split(','):[])).map(x=>String(x).trim()).filter(Boolean);
 g.querySelectorAll('.chip.custom').forEach(c=>c.remove());g.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed','false'));
 vals.forEach(v=>{const lv=v.toLowerCase();const hit=Array.prototype.find.call(g.querySelectorAll('.chip'),c=>c.dataset.val.toLowerCase()===lv||c.textContent.toLowerCase()===lv);if(hit)hit.setAttribute('aria-pressed','true');else if(document.querySelector('[data-chip-add="'+n+'"]'))g.insertAdjacentHTML('beforeend',chipBtn(v,v,true,true))})}
function addCustomChip(n){const inp=document.querySelector('[data-chip-add="'+n+'"]');if(!inp)return;const v=inp.value.replace(/[,;]/g,' ').replace(/\s+/g,' ').trim();if(!v)return;const g=document.querySelector('[data-chips="'+n+'"]');
 const dup=Array.prototype.find.call(g.querySelectorAll('.chip'),c=>c.dataset.val.toLowerCase()===v.toLowerCase());
 if(dup){if(dup.getAttribute('aria-pressed')!=='true')toggleChip(dup)}else{const b=document.createElement('span');b.innerHTML=chipBtn(v,v,false,true);const c=b.firstChild;g.appendChild(c);toggleChip(c)}inp.value=''}
function toggleChip(btn){const g=btn.closest('[data-chips]');if(!g)return;const n=g.dataset.chips,on=btn.getAttribute('aria-pressed')==='true';
 if(g.dataset.mode==='single'){g.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed','false'));if(!on)btn.setAttribute('aria-pressed','true');return}
 if(!on){const max=STUDIO_MAX[n];if(max&&chipVals(n).length>=max){toast('Choose up to '+max+' options',2200);return}}
 btn.setAttribute('aria-pressed',on?'false':'true')}
const STUDIO_STEPS=[['1','01 Brief'],['2','02 Concepts'],['3','03 DNA'],['4','04 Prompt'],['5','05 Variations'],['6','06 Save']];
let studioStep=1;
function drawStudioSteps(){const nav=$('#studio-steps');if(!nav)return;const ready=!!studioResult;nav.innerHTML=STUDIO_STEPS.map(x=>{const n=Number(x[0]),dis=n>1&&!ready;return `<button type="button" data-act="studio-step" data-step="${n}" class="${n===studioStep?'active':''}"${n===studioStep?' aria-current="step"':''}${dis?' disabled aria-disabled="true"':''}>${x[1]}</button>`}).join('')}
function setStudioStep(n){n=Number(n)||1;if(n>1&&!studioResult)n=1;studioStep=Math.max(1,Math.min(6,n));const f=$('#sf');if(f)f.hidden=studioStep!==1;
 document.querySelectorAll('.studio-panel').forEach(pn=>{pn.hidden=Number(pn.dataset.panel)!==studioStep});drawStudioSteps();
 const act=document.querySelector('#studio-steps .active');if(act&&act.scrollIntoView)try{act.scrollIntoView({block:'nearest',inline:'center'})}catch(e){}
 const top=$('#studio-steps');if(top&&top.scrollIntoView)try{top.scrollIntoView({block:'start',behavior:RM.matches?'auto':'smooth'})}catch(e){}}
function studio(prm){
 const b=prm.get('brand')||'', industry=prm.get('industry')||'', style=prm.get('style')||'';
 studioResult=null;studioProjectId=null;studioLibraryPrompts=[];studioLibrarySuggestions=[];studioStep=1;
 const inds=reg(window.LogoStudioIndustries),types=reg(window.LogoStudioLogoTypes),styles=reg(window.LogoStudioStyles),apps=reg(window.LogoStudioApplicationRules);
 const pers=Object.keys((window.LogoStudioRules&&LogoStudioRules.personality)||{}).map(k=>[k,cap(k)]);
 const fams={modern:'Modern',premium:'Premium',technology:'Technology',gaming:'Gaming',business:'Business',creative:'Creative',retail:'Food & retail',system:'Systems',render:'3D & materials'};
 const famOrder=Object.keys(fams);const byFam={};styles.forEach(x=>{const f=fams[x.family]?x.family:'modern';(byFam[f]=byFam[f]||[]).push(x)});
 const styleSel=csv(style);
 const styleHtml=famOrder.filter(f=>byFam[f]).map(f=>`<div class="chip-sub"><small>${esc(fams[f])}</small><div class="chips" data-chips="style" data-mode="multi">${byFam[f].map(x=>chipBtn(x.key,x.label,styleSel.some(v=>v.toLowerCase()===x.key.toLowerCase()||v.toLowerCase()===x.label.toLowerCase()))).join('')}</div></div>`).join('');
 const indOpts=`<option value="">Choose an industry…</option>`+inds.map(x=>`<option value="${esc(x.label)}"${x.label.toLowerCase()===industry.toLowerCase()||x.key.toLowerCase()===industry.toLowerCase()?' selected':''}>${esc(x.label)}</option>`).join('');
 app.innerHTML=`<section class="view studio-page"><div class="studio-head"><div><p class="eyebrow">Logo Concept & Prompt Studio</p><h1 class="h2">Build a logo direction, not just a prompt.</h1><p class="lede">A local, rule-based workspace from brand strategy to concept, Logo DNA, originality, applications and prompt variations.</p></div><a class="ab" href="#/projects">${ic('grid')}Saved Projects</a></div>
 <nav class="studio-steps" id="studio-steps" aria-label="Studio pipeline"></nav>
 <form id="sf" class="studio-form" novalidate><div class="studio-grid">
 <div><label for="s-brand">Brand name <span class="req">*</span></label><input class="inp" id="s-brand" maxlength="60" value="${esc(b)}" placeholder="e.g. NEXA"></div>
 <div><label for="s-industry">Industry <span class="req">*</span></label><select class="inp" id="s-industry">${indOpts}</select></div>
 ${chipGroup('audience','Target audience',STUDIO_OPTS.audience,{custom:true,hint:'up to 2'})}
 ${chipGroup('personality','Personality',pers,{hint:'up to 3'})}
 ${chipGroup('feeling','Desired feeling',STUDIO_OPTS.feeling,{custom:true,hint:'up to 3'})}
 ${chipGroup('keywords','Keywords',STUDIO_OPTS.keywords,{custom:true,hint:'up to 5'})}
 ${chipGroup('colors','Preferred colors',STUDIO_OPTS.colors,{custom:true,hint:'up to 4'})}
 ${chipGroup('type','Logo type',types.map(x=>[x.key,x.label]),{mode:'single',hint:'optional — leave empty for smart default'})}
 <div class="studio-wide chip-field"><span class="flabel" id="cl-style">Style <small>up to 4</small></span><div role="group" aria-labelledby="cl-style">${styleHtml}</div></div>
 ${chipGroup('application','Applications',apps.map(x=>[x.label,x.label]),{})}
 <div><label for="s-complexity">Complexity</label><select class="inp" id="s-complexity"><option value="">Smart default</option>${STUDIO_OPTS.complexity.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select></div>
 <div class="studio-wide"><label for="s-subject">What should the logo show? <small class="muted">(optional — the more specific, the better)</small></label><input class="inp" id="s-subject" maxlength="140" placeholder="e.g. a coffee bean shaped like a mountain peak"></div>
 <div class="studio-wide"><label for="s-desc">Brand description <small class="muted">(optional)</small></label><textarea class="inp" id="s-desc" rows="4" maxlength="500" placeholder="Who is the brand and what should the identity communicate?"></textarea></div>
 </div><p class="fe" id="sferr" role="alert"></p><div class="studio-actions"><button class="btn pri" type="submit">${ic('wand')}Generate Studio Direction</button><button class="btn sec" type="button" data-act="save-studio" disabled>${ic('heart')}Save Project</button></div></form>
 <div id="studio-result" aria-live="polite"></div></section>`;
 drawStudioSteps();
 if(prm.get('project')) loadStudioProject(prm.get('project'));
}

function csv(v){return String(v||'').split(',').map(x=>x.trim()).filter(Boolean)}
function studioInput(){return {brandName:$('#s-brand')?.value,industry:$('#s-industry')?.value,targetAudience:chipVals('audience').join(', '),personality:chipVals('personality'),desiredFeeling:chipVals('feeling'),keywords:chipVals('keywords'),preferredColors:chipVals('colors'),logoType:chipVals('type')[0]||'',style:chipVals('style'),application:chipVals('application'),complexity:$('#s-complexity')?.value,subject:$('#s-subject')?.value,description:$('#s-desc')?.value}}
const VARLABEL={short:'Short Prompt',professional:'Professional Prompt',premium:'Premium Prompt',minimal:'Minimal Prompt','3d':'3D Prompt','8k':'8K Prompt',experimental:'Experimental Prompt'};
let studioResult=null,studioProjectId=null,studioLibrarySuggestions=[],studioLibraryPrompts=[];
function renderStudioResult(){
 const r=$('#studio-result'); if(!r||!studioResult)return;
 const x=studioResult, v=x.variations||{}, concepts=studioResult.concepts||[];
 const variation=Object.keys(v).map(k=>`<details class="variation"><summary>${esc(VARLABEL[k]||k)}</summary><p>${esc(v[k])}</p><button class="ab" data-act="copy-studio" data-variation="${esc(k)}">${ic('copy')}Copy</button></details>`).join('');
 const conceptCards=concepts.map((c,i)=>`<button type="button" class="concept-choice ${studioResult.concept&&c.id===studioResult.concept.id?'selected':''}" data-act="select-concept" data-index="${i}"><span class="concept-rank">0${i+1}</span><span><strong>${esc(c.name)}</strong><small>${esc(c.visualIdea)}</small></span><b>${esc(String(Math.round(c.score||0)))}</b></button>`).join('');
 const quality=x.quality||{};
 const nav=(prev,next,nl)=>`<div class="studio-nav-row">${prev?`<button type="button" class="btn sec" data-act="studio-step" data-step="${prev}">← Back</button>`:'<span></span>'}${next?`<button type="button" class="btn pri" data-act="studio-step" data-step="${next}">${nl||'Next'} →</button>`:''}</div>`;
 const dnaRows=[['Symbol logic',x.concept.symbolLogic],['Meaning',x.concept.meaning],['Shape',x.dna.shape],['Typography',x.dna.typography],['Composition',x.dna.composition],['Recognition',x.dna.recognition||'Distinctive, scalable brand recognition']];
 r.innerHTML=`<section class="studio-panel" data-panel="2" hidden><article class="card concept-panel"><div class="result-label"><p class="eyebrow">Concept selection</p><span class="quality-pill">Quality ${esc(String(quality.score||'—'))}</span></div><h2>${esc(x.concept.name)}</h2><p>${esc(x.concept.visualIdea)}</p><p class="muted">Choose a direction — DNA, prompt and variations update automatically.</p><div class="concept-list">${conceptCards}</div></article>${nav(1,3,'Logo DNA')}</section>
 <section class="studio-panel" data-panel="3" hidden><article class="card"><div class="result-label"><p class="eyebrow">Logo DNA</p><span class="quality-pill">Originality ${esc(String(x.dna.originality||quality.originalityScore||'—'))}</span></div><h2>${esc(x.concept.name)}</h2><dl>${dnaRows.map(d=>`<dt>${d[0]}</dt><dd>${esc(d[1])}</dd>`).join('')}</dl></article>${nav(2,4,'Prompt')}</section>
 <section class="studio-panel" data-panel="4" hidden><article class="card primary-prompt"><div class="result-label"><p class="eyebrow">Primary prompt</p><div class="prompt-actions"><button class="ab" data-act="copy-studio">${ic('copy')}Copy</button><button class="ab" data-act="save-studio">${ic('heart')}Save</button></div></div><div class="ptxt"><p>${esc(x.prompt)}</p></div></article>${nav(3,5,'Variations')}</section>
 <section class="studio-panel" data-panel="5" hidden><div class="card variation-list"><div class="result-label"><div><p class="eyebrow">Prompt Variations</p><h2>Same identity, different presentation modes</h2></div></div>${variation}</div>${nav(4,6,'Save')}</section>
 <section class="studio-panel" data-panel="6" hidden><article class="card save-panel"><div class="result-label"><div><p class="eyebrow">Save</p><h2>${esc(x.concept.name)}</h2><p class="muted">Keep this direction on this device. You can reopen, export or import it from Saved Projects.</p></div></div><div class="studio-actions"><button class="btn pri" type="button" data-act="save-studio">${ic('heart')}Save Project</button><a class="btn sec" href="#/projects">Saved Projects</a></div></article><div id="library-panel"></div>${nav(5,0)}</section>`;
 document.querySelectorAll('[data-act="save-studio"]').forEach(b=>{b.disabled=false});
 setStudioStep(studioStep>1?studioStep:2);
 renderLibraryPanel();
 loadLibrarySuggestions();
}

function saveCurrentStudio(){
 if(!studioResult)return null;
 try{
  const brief=LogoStudioDomain.createBrief(studioInput()), existing=studioProjectId?LogoStudioProjectManager.get(studioProjectId):null;
  const attached=studioLibraryPrompts.length?studioLibraryPrompts:(existing&&Array.isArray(existing.libraryPrompts)?existing.libraryPrompts:[]);
  const p=LogoStudioProjectManager.save({id:studioProjectId,name:brief.brandName+' — '+(brief.industry||'Logo Project'),brief:brief,result:studioResult,libraryPrompts:attached});
  studioProjectId=p.id;studioLibraryPrompts=Array.isArray(p.libraryPrompts)?p.libraryPrompts:[];toast('Project saved locally');renderLibraryPanel();return p;
 }catch(e){toast(e.message||'Could not save project',3200);return null}
}
function loadStudioProject(id){
 const p=LogoStudioProjectManager.get(id); if(!p){toast('Project not found',2800);return}
 studioProjectId=p.id; studioLibraryPrompts=Array.isArray(p.libraryPrompts)?p.libraryPrompts.slice():[]; const b=p.brief||{};
 const sb=$('#s-brand');if(sb)sb.value=b.brandName||'';const si=$('#s-industry');if(si){const w=String(b.industry||'').toLowerCase();Array.prototype.forEach.call(si.options,o=>{if(o.value.toLowerCase()===w||o.text.toLowerCase()===w)si.value=o.value})}
 const sc=$('#s-complexity');if(sc)sc.value=b.complexity||'';const sd=$('#s-desc');if(sd)sd.value=b.description||'';const ss=$('#s-subject');if(ss)ss.value=b.subject||'';
 setChips('audience',b.targetAudience);setChips('personality',b.personality);setChips('feeling',b.desiredFeeling);setChips('keywords',b.keywords);setChips('colors',b.preferredColors);setChips('type',b.logoType);setChips('style',b.style);setChips('application',b.application);
 if(p.result){studioResult=p.result;studioStep=2;renderStudioResult()}else{drawStudioSteps()}
}
function renderLibraryPanel(){
 const el=$('#library-panel');if(!el)return;const attached=studioLibraryPrompts||[],suggestions=studioLibrarySuggestions||[];
 el.innerHTML=`<section class="card library-inspiration"><div class="result-label"><div><p class="eyebrow">Library Inspiration</p><h2>Related prompts from the existing library</h2><p class="muted">Recommendations from the built-in library and your own Studio prompts. The 100K+ collection stays read-only.</p></div><button class="ab" data-act="refresh-library">${ic('refresh')}Refresh</button></div><div class="library-cols"><div><h3>Suggested for this Concept</h3><div class="library-suggestion-list">${suggestions.length?suggestions.map(libraryPromptCard).join(''):`<div class="library-empty">Generating related library prompts…</div>`}</div></div><div><h3>Attached to this Project <span class="count-pill">${attached.length}</span></h3><div class="library-attached-list">${attached.length?attached.map(function(p){return `<div class="library-attached"><div><code>${esc(p.id)}</code><small>${esc(catName(p.category)||p.category||'Library prompt')}</small></div><button class="ab" data-act="remove-library" data-id="${esc(p.id)}">Remove</button></div>`}).join(''):`<div class="library-empty">Attach useful references here to keep inspiration with the project.</div>`}</div></div></div></section>`;
}
function libraryPromptCard(p){const id=esc(p.id),short=esc(pv(p.text||'').slice(0,220)),personal=String(p.source||'').toLowerCase().indexOf('studio')>=0||String(p.id||'').indexOf('MY-')===0;return `<article class="library-suggestion ${personal?'personal-suggestion':''}"><header><code>${id}</code><span class="tag">${esc(personal?'My Prompt':(catName(p.category)||p.category||'Prompt'))}</span></header><p>${short}${(p.text||'').length>220?'…':''}</p><footer>${personal?`<button class="ab" data-act="use-personal" data-id="${id}">Use</button>`:`<a class="ab" href="#/prompt/${encodeURIComponent(p.id)}">View</a>`}<button class="ab" data-act="attach-library" data-id="${id}">${ic('grid')}Attach</button></footer></article>`}
async function loadLibrarySuggestions(){const panel=$('#library-panel');if(!panel||!studioResult)return;try{const ctx={analysis:studioResult.analysis||{},concept:studioResult.concept||{},dna:studioResult.dna||{}},queries=LogoStudioLibraryIntelligence.buildQueries(ctx),found={},hits=[];for(const q of queries){try{const r=await API.search({query:q,page:1});(r&&r.items||[]).forEach(function(p){if(p&&p.id&&!found[p.id]){found[p.id]=1;hits.push(p)}})}catch(e){}if(hits.length>=18)break}const personal=window.LogoStudioPersonalPromptLibrary?LogoStudioPersonalPromptLibrary.list():[];personal.forEach(function(p){if(p&&p.id&&!found[p.id]){found[p.id]=1;hits.push(p)}});hits.sort(function(a,b){const ap=String(a.id||'').indexOf('MY-')===0,bp=String(b.id||'').indexOf('MY-')===0;return (bp-ap)+(bp?LogoStudioPersonalPromptLibrary.score(b,ctx):LogoStudioLibraryIntelligence.score(b,ctx))-(ap?LogoStudioPersonalPromptLibrary.score(a,ctx):LogoStudioLibraryIntelligence.score(a,ctx))});const attached={};studioLibraryPrompts.forEach(function(p){attached[p.id]=1});studioLibrarySuggestions=hits.filter(function(p){return !attached[p.id]}).slice(0,8);renderLibraryPanel()}catch(e){studioLibrarySuggestions=[];renderLibraryPanel()}}
function attachLibraryPrompt(id){const p=studioLibrarySuggestions.find(function(x){return x.id===id})||P[id]||(window.LogoStudioPersonalPromptLibrary&&LogoStudioPersonalPromptLibrary.get(id));if(!p)return;if(!studioProjectId){const saved=saveCurrentStudio();if(!saved){toast('Save the Studio project before attaching prompts',3000);return}}const updated=LogoStudioProjectManager.addLibraryPrompt(studioProjectId,p);if(updated){if(window.LogoStudioPromptLearning)LogoStudioPromptLearning.recordAttach(p.id);studioLibraryPrompts=updated.libraryPrompts||[];studioLibrarySuggestions=studioLibrarySuggestions.filter(function(x){return x.id!==id});renderLibraryPanel();toast('Prompt attached to project')}}
function removeLibraryPrompt(id){if(!studioProjectId)return;const p=LogoStudioProjectManager.get(studioProjectId);if(!p)return;p.libraryPrompts=(p.libraryPrompts||[]).filter(function(x){return x.id!==id});p.updatedAt=new Date().toISOString();LogoStudioProjectManager.save(p);studioLibraryPrompts=p.libraryPrompts;renderLibraryPanel();toast('Prompt removed')}
function myPrompts(){const items=window.LogoStudioPersonalPromptLibrary?LogoStudioPersonalPromptLibrary.list():[];app.innerHTML=`<section class="view examples-page"><div class="studio-head"><div><p class="eyebrow">Your prompt memory</p><h1 class="h2">My Prompts</h1><p class="lede">Every prompt generated by Studio is kept locally and can become inspiration for future concepts.</p></div><span class="count-pill">${items.length}</span></div><div class="list personal-list">${items.length?items.map(personalPromptCard).join(''):stateBox('wand','No personal prompts yet','Generate a Studio direction and your prompt plus its variations will appear here.','<a class="btn pri" href="#/studio">Open Studio</a>')}</div></section>`}
function personalPromptCard(p){return `<article class="card personal-card"><header><div><p class="eyebrow">${esc(p.source||'Studio Generated')}</p><h2>${esc(p.title||'Studio Prompt')}</h2></div><code>${esc(p.id)}</code></header><p class="pv">${esc(pv(p.text||'').slice(0,420))}${(p.text||'').length>420?'…':''}</p><div class="sample-meta"><span class="tag">${esc(p.industry||'General')}</span>${(p.style||[]).slice(0,3).map(function(x){return `<span class="tag">${esc(x)}</span>`}).join('')}<span class="muted">Used ${esc(p.usageCount||1)}×</span>${window.LogoStudioPersonalPromptLibrary&&window.LogoStudioPersonalPromptLibrary.metrics(p.id).attachCount?`<span class="muted">Attached ${esc(window.LogoStudioPersonalPromptLibrary.metrics(p.id).attachCount)}×</span>`:''}</div><footer><button class="ab" data-act="copy-personal" data-id="${esc(p.id)}">${ic('copy')}Copy</button><button class="ab" data-act="fav-personal" data-id="${esc(p.id)}" aria-pressed="${window.LogoStudioPersonalPromptLibrary&&window.LogoStudioPersonalPromptLibrary.isFavorite(p.id)?'true':'false'}">${ic('heart')}${window.LogoStudioPersonalPromptLibrary&&window.LogoStudioPersonalPromptLibrary.isFavorite(p.id)?'Unfavorite':'Favorite'}</button><button class="ab" data-act="remove-personal" data-id="${esc(p.id)}">Remove</button></footer></article>`}
function projectListHtml(q){const list=LogoStudioProjectManager.search(q||'');return list.length?list.map(projectCard).join(''):(q?stateBox('search','No matching projects','Try a different name, industry or style.'):stateBox('grid','No saved projects','Create a Studio direction and save it locally.'))}
function projects(){
 app.innerHTML=`<section class="view projects-page"><div class="studio-head"><div><p class="eyebrow">Workspace</p><h1 class="h2">Saved Projects</h1><p class="lede">Projects stay on this device. Your existing 100K prompt library remains separate and untouched.</p></div><div class="project-tools"><a class="btn pri" href="#/studio">${ic('wand')}New Project</a><button class="ab" data-act="export-projects">Export</button><label class="ab file-btn">Import<input type="file" id="import-projects" accept="application/json,.json" hidden></label></div></div><div class="project-search"><label for="proj-q" class="sr">Search projects</label><input id="proj-q" type="search" placeholder="Search projects by name, industry or style" autocomplete="off"></div><div class="project-list" id="project-list">${projectListHtml('')}</div></section>`;
}
function projectCard(p){const b=p.brief||{},lp=Array.isArray(p.libraryPrompts)?p.libraryPrompts.length:0,id=esc(p.id);return `<article class="card project-card"><header><div><p class="eyebrow">${p.favorite?'Favorite project':'Project'}</p><h2>${esc(p.name)}</h2></div><code>${id}</code></header><p>${esc([b.industry,b.style&&b.style.join(', ')].filter(Boolean).join(' · '))}</p><p class="muted">${lp} library prompt${lp===1?'':'s'} attached · Updated ${esc(new Date(p.updatedAt).toLocaleString())}</p><footer><a class="ab" href="#/studio?project=${encodeURIComponent(p.id)}">Open</a><button class="ab" data-act="fav-project" data-id="${id}" aria-pressed="${p.favorite?'true':'false'}">${ic('heart')}Favorite</button><button class="ab" data-act="rename-project" data-id="${id}">Rename</button><button class="ab" data-act="duplicate-project" data-id="${id}">Duplicate</button><button class="ab" data-act="delete-project" data-id="${id}">Delete</button></footer></article>`}
function openProjectPrompt(id){const p=LogoStudioProjectManager.get(id);if(!p)return;}

/* ---------- router ---------- */
function safeDecode(s){try{return decodeURIComponent(s)}catch(e){console.error('[Logo Studio] Invalid encoding in the page address.',e);return null}}
function route(){
 const h=location.hash.slice(1)||'/',[path,qs]=h.split('?'),prm=new URLSearchParams(qs||''),seg=path.split('/').filter(Boolean),v=seg[0]||'home';
 drawNav(['home','studio','projects','my-prompts','examples','popular','search','categories','favorites'].includes(v)?v:'');window.scrollTo(0,0);
 const si=document.getElementById('seo-intro');if(si)si.hidden=v!=='home';
 if(v==='home')home(prm);else if(v==='studio')studio(prm);else if(v==='projects')projects(prm);else if(v==='my-prompts')myPrompts();else if(v==='examples')examples();else if(v==='popular')popular();else if(v==='search')search(prm);else if(v==='categories')categories();else if(v==='favorites')favorites();else if(v==='prompt'&&seg[1]){const pid=safeDecode(seg[1]);if(pid===null)app.innerHTML=`<div class="view">${stateBox('alert','Invalid link','This prompt link isn’t valid. Check the address and try again.','<a class="btn pri" href="#/">Go home</a>')}</div>`;else details(pid)}
 else app.innerHTML=`<div class="view">${stateBox('alert','Page not found','This page doesn’t exist.','<a class="btn pri" href="#/">Go home</a>')}</div>`;
}
 setTimeout(()=>hydrateCommunity(document),60);
const RM=matchMedia('(prefers-reduced-motion:reduce)');let ct;
addEventListener('hashchange',()=>{const c=$('#curtain');if(!c||RM.matches){route();return}clearTimeout(ct);c.classList.remove('go');void c.offsetWidth;c.classList.add('go');ct=setTimeout(route,330);setTimeout(()=>c.classList.remove('go'),850)});

/* ---------- events ---------- */
document.addEventListener('click',async e=>{
 const mp=$('#more-panel');if(mp&&!mp.hidden&&!e.target.closest('.more-btn')&&!e.target.closest('#more-panel'))toggleMore(null,false);else if(mp&&!mp.hidden&&e.target.closest('#more-panel a'))toggleMore(null,false);
 const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act,id=t.dataset.id;
 if(a==='theme')toggleTheme();
 else if(a==='more-menu'){toggleMore(t,undefined)}
 else if(a==='focus-brand'){const bn=$('#bn');window.scrollTo({top:0,behavior:RM.matches?'auto':'smooth'});if(bn)setTimeout(()=>bn.focus({preventScroll:true}),250)}
 else if(a==='back'){e.preventDefault();history.length>1?history.back():(location.hash='#/')}
 else if(a==='reload')location.reload();
 else if(a==='again'||a==='retry-gen')generate();
 else if(a==='retry-search')runSearch(true);
 else if(a==='retry-detail')route();
 else if(a==='retry-cats')categories();
 else if(a==='retry-popular')popular();
 else if(a==='more'){Q.page++;runSearch(false)}
 else if(a==='filter-examples'){renderExamples(t.dataset.filter||'all')}
 else if(a==='rate-prompt'){ratePrompt(id,t.dataset.rating)}
 else if(a==='copy'&&P[id]){if(window.LogoStudioPromptLearning)LogoStudioPromptLearning.recordUse(id);if(window.LogoStudioCommunityMetrics)LogoStudioCommunityMetrics.recordUse(id);const has=!!S.brand.trim(),ok=await copyText(fill(P[id].text,S.brand));
  if(!ok)toast('Copy failed. Select the text and copy manually.');
  else if(has)toast('Copied to clipboard');
  else toast('Copied. Replace [ENTER BRAND NAME HERE] with your brand name.',3800)}
 else if(a==='share'&&P[id]){
  const url=APP_BASE+'#/prompt/'+encodeURIComponent(id);
  if(location.protocol==='file:'){toast('Share links work once the site is uploaded to a host.',3800)}
  else if(navigator.share){try{await navigator.share({title:'Logo Studio prompt '+id,text:fill(P[id].text,S.brand),url})}catch(err){if(!err||err.name!=='AbortError')toast(await copyText(url)?'Link copied':'Couldn’t copy the link')}}
  else toast(await copyText(url)?'Link copied':'Couldn’t copy the link');
 }
 else if(a==='select-concept'){const idx=Number(t.dataset.index);if(studioResult&&studioResult.analysis&&studioResult.concepts&&studioResult.concepts[idx]){const result=LogoStudioEngine.generateFromAnalysis(studioResult.analysis,studioResult.concepts[idx]);result.concepts=studioResult.concepts;studioResult=result;try{LogoStudioPersonalPromptLibrary.addResult(result,studioInput(),'Studio Generated / Concept Selection')}catch(e){}renderStudioResult();toast('Concept selected')}}
 else if(a==='save-studio'){saveCurrentStudio()}
 else if(a==='studio-step'){setStudioStep(t.dataset.step)}
 else if(a==='chip'){toggleChip(t)}
 else if(a==='chip-add'){addCustomChip(t.dataset.chipTarget)}
 else if(a==='save-library'){const p=P[id];if(!studioProjectId){toast('Open a saved Studio project first',2800)}else if(p){const u=LogoStudioProjectManager.addLibraryPrompt(studioProjectId,p);if(u){if(window.LogoStudioPromptLearning)LogoStudioPromptLearning.recordAttach(p.id);studioLibraryPrompts=u.libraryPrompts||[];toast('Prompt added to project')}}}
 else if(a==='attach-library'){attachLibraryPrompt(id)}
 else if(a==='remove-library'){removeLibraryPrompt(id)}
 else if(a==='refresh-library'){loadLibrarySuggestions()}
 else if(a==='use-personal'){const p=window.LogoStudioPersonalPromptLibrary&&LogoStudioPersonalPromptLibrary.get(id);if(p){window.LogoStudioPersonalPromptLibrary.recordUse(id);copyText(p.text).then(ok=>toast(ok?'Copied personal prompt':'Copy failed'))}}
 else if(a==='copy-personal'){const p=window.LogoStudioPersonalPromptLibrary&&LogoStudioPersonalPromptLibrary.get(id);if(p){window.LogoStudioPersonalPromptLibrary.recordUse(id);copyText(p.text).then(ok=>toast(ok?'Copied personal prompt':'Copy failed'))}}
 else if(a==='fav-personal'){const p=window.LogoStudioPersonalPromptLibrary&&LogoStudioPersonalPromptLibrary.get(id);if(p){const active=!LogoStudioPersonalPromptLibrary.isFavorite(id);LogoStudioPersonalPromptLibrary.recordFavorite(id,active);myPrompts();toast(active?'Personal prompt favorited':'Personal prompt unfavorited')}}
 else if(a==='remove-personal'){if(window.LogoStudioPersonalPromptLibrary&&confirm('Remove this personal prompt from your local prompt memory?')){LogoStudioPersonalPromptLibrary.remove(id);myPrompts();toast('Personal prompt removed')}}
 else if(a==='copy-studio'){const k=t.dataset.variation;const txt=k&&studioResult?.variations?.[k]?studioResult.variations[k]:studioResult?.prompt||'';copyText(txt).then(ok=>toast(ok?'Copied':'Copy failed'))}
 else if(a==='fav-project'){const u=LogoStudioProjectManager.toggleFavorite(id);if(u){projects();toast(u.favorite?'Added to favorites':'Removed from favorites')}}
 else if(a==='rename-project'){const cur=LogoStudioProjectManager.get(id);const nm=cur?prompt('Project name',cur.name):null;if(nm!==null){if(LogoStudioProjectManager.rename(id,nm)){projects();toast('Project renamed')}else toast('Enter a project name',2800)}}
 else if(a==='duplicate-project'){const c=LogoStudioProjectManager.duplicate(id);if(c){projects();toast('Project duplicated')}else toast('Could not duplicate project',3000)}
 else if(a==='delete-project'){if(confirm('Delete this saved project?')){LogoStudioProjectManager.remove(id);projects();toast('Project deleted')}}
 else if(a==='export-projects'){const blob=new Blob([LogoStudioProjectManager.exportJSON()],{type:'application/json'}),url=URL.createObjectURL(blob),aEl=document.createElement('a');aEl.href=url;aEl.download='logo-studio-projects.json';aEl.click();setTimeout(()=>URL.revokeObjectURL(url),500);toast('Projects exported')}
 else if(a==='fav'&&P[id]){
  const becoming=!FAV[id];
  if(FAV[id]){delete FAV[id];toast('Removed from favorites')}else{FAV[id]=P[id];toast('Saved to favorites')}
  if(window.LogoStudioPromptLearning)LogoStudioPromptLearning.recordFavorite(id,becoming);
  store.set('ls:fav',FAV);syncFav();
  if(location.hash.startsWith('#/favorites'))favorites();
  else document.querySelectorAll('[data-act=fav]').forEach(b=>{if(b.dataset.id===id)b.setAttribute('aria-pressed',!!FAV[id])});
 }
});
document.addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='gf')generate();if(e.target.id==='sf'){const b=$('#s-brand')?.value.trim(),i=$('#s-industry')?.value.trim(),er=$('#sferr');if(!b||!i){er.textContent='Brand name and industry are required.';return}er.textContent='';studioProjectId=null;try{const input=studioInput(), analysis=LogoStudioBrandIntelligence.analyze(input), concepts=LogoStudioConceptEngine.generateVariants(analysis), result=LogoStudioEngine.generateFromAnalysis(analysis, concepts[0]); result.concepts=concepts; studioResult=result; try{LogoStudioPersonalPromptLibrary.addResult(result,input,'Studio Generated')}catch(e){} studioStep=2; renderStudioResult(); toast('Studio direction generated')}catch(err){er.textContent=err.message||'Generation failed.'}}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const mp=$('#more-panel');if(mp&&!mp.hidden){toggleMore(null,false);const b=document.querySelector('.more-btn[aria-expanded]');if(b&&b.offsetParent!==null)b.focus()}}const i=e.target;if(e.key==='Enter'&&i&&i.dataset&&i.dataset.chipAdd){e.preventDefault();addCustomChip(i.dataset.chipAdd)}});
let dt;
document.addEventListener('input',e=>{
 const i=e.target;
 if(i.id==='bn'){S.brand=i.value;i.classList.remove('bad');$('#bnerr').textContent='';tile();const rt=$('#result .ptxt');if(rt&&S.result)rt.innerHTML=fmt(fill(S.result.text,S.brand))}
 else if(i.id==='db'){S.brand=i.value;const x=document.querySelector('.ptxt');const p=P[document.querySelector('.card[data-id]')?.dataset.id];if(x&&p)x.innerHTML=fmt(fill(p.text,S.brand))}
 else if(i.id==='q'){Q.q=i.value;clearTimeout(dt);dt=setTimeout(()=>{history.replaceState(null,'','#/search?q='+encodeURIComponent(Q.q)+(Q.c?'&c='+encodeURIComponent(Q.c):''));runSearch(true)},300)}
});
document.addEventListener('input',e=>{if(e.target&&e.target.id==='proj-q'){const l=$('#project-list');if(l)l.innerHTML=projectListHtml(e.target.value)}});
document.addEventListener('change',e=>{if(e.target.id==='import-projects'&&e.target.files[0]){const f=e.target.files[0],rd=new FileReader();rd.onload=()=>{try{LogoStudioProjectManager.importJSON(rd.result);projects();toast('Projects imported')}catch(err){toast(err.message||'Import failed',3200)}};rd.readAsText(f);return}if(e.target.id==='sc')S.cat=e.target.value;if(e.target.id==='qc'){Q.c=e.target.value;history.replaceState(null,'','#/search?q='+encodeURIComponent(Q.q)+(Q.c?'&c='+encodeURIComponent(Q.c):''));runSearch(true)}});
route();
setTimeout(()=>hydrateCommunity(document),120);
if(!RM.matches&&matchMedia('(hover:hover)').matches){let tx=innerWidth*.7,ty=innerHeight*.2,cx=tx,cy=ty,raf=0;const tick=()=>{cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;const s=document.body.style;s.setProperty('--mx',cx+'px');s.setProperty('--my',cy+'px');raf=Math.abs(tx-cx)+Math.abs(ty-cy)>.5?requestAnimationFrame(tick):0};addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(tick)},{passive:true})}

/* ---------- start fetching the prompt library once the page is idle, or at the first sign of interaction ---------- */
(function(){
 const go=()=>{ensureLib().catch(()=>{})};
 const idle=window.requestIdleCallback||(f=>setTimeout(f,1500));
 addEventListener('load',()=>idle(go,{timeout:4000}));
 ['pointerdown','keydown','focusin','touchstart'].forEach(ev=>addEventListener(ev,go,{once:true,passive:true}));
})();
