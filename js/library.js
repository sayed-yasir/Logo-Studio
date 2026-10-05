(async()=>{
const PAGE=20,N=5000;let M,BIN;
/*INFLATE*/
function inflateRaw(src,out){
 let pos=0,bb=0,bc=0,op=0;
 const bits=n=>{let v=bb;while(bc<n){v|=src[pos++]<<bc;bc+=8}bb=v>>>n;bc-=n;return v&((1<<n)-1)};
 const mk=()=>({c:new Uint16Array(16),s:new Uint16Array(288)});
 const build=(h,len,n)=>{h.c.fill(0);for(let s=0;s<n;s++)h.c[len[s]]++;if(h.c[0]===n)return;const off=new Uint16Array(16);for(let l=1;l<15;l++)off[l+1]=off[l]+h.c[l];for(let s=0;s<n;s++)if(len[s])h.s[off[len[s]]++]=s};
 const dec=h=>{let code=0,first=0,idx=0;for(let l=1;l<=15;l++){code|=bits(1);const c=h.c[l];if(code-c<first)return h.s[idx+(code-first)];idx+=c;first+=c;first<<=1;code<<=1}throw new Error('bad code')};
 const LB=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],
 LE=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],
 DB=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],
 DE=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],
 ORD=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
 const codes=(lc,dc)=>{for(;;){let s=dec(lc);if(s<256)out[op++]=s;else if(s===256)return;else{s-=257;if(s>=29)throw new Error('bad symbol');const len=LB[s]+bits(LE[s]),d=dec(dc);if(d>=30)throw new Error('bad distance');const dist=DB[d]+bits(DE[d]);if(dist>op)throw new Error('bad offset');for(let i=0;i<len;i++){out[op]=out[op-dist];op++}}}};
 let FL,FD,last;
 do{last=bits(1);const t=bits(2);
  if(t===0){bb=0;bc=0;const len=src[pos]|src[pos+1]<<8;pos+=4;out.set(src.subarray(pos,pos+len),op);op+=len;pos+=len}
  else if(t===1){if(!FL){const l=new Uint8Array(288);for(let i=0;i<288;i++)l[i]=i<144?8:i<256?9:i<280?7:8;FL=mk();build(FL,l,288);FD=mk();build(FD,new Uint8Array(30).fill(5),30)}codes(FL,FD)}
  else if(t===2){const nl=bits(5)+257,nd=bits(5)+1,nc=bits(4)+4,cl=new Uint8Array(320);
   for(let i=0;i<nc;i++)cl[ORD[i]]=bits(3);
   const ch=mk();build(ch,cl,19);const ln=new Uint8Array(320);let i=0;
   while(i<nl+nd){const s=dec(ch);if(s<16)ln[i++]=s;else{let prev=0,rep;if(s===16){prev=ln[i-1];rep=3+bits(2)}else if(s===17)rep=3+bits(3);else rep=11+bits(7);while(rep--)ln[i++]=prev}}
   const lc=mk(),dc=mk();build(lc,ln,nl);build(dc,ln.subarray(nl),nd);codes(lc,dc)}
  else throw new Error('bad block');
 }while(!last);
 return out;
}
/*END-INFLATE*/
async function unpack(){
 const raw=Uint8Array.from(atob(window.LIB_B64),c=>c.charCodeAt(0));
 if(typeof DecompressionStream==='function'){
  try{return new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer())}catch(e){}
 }
 /* Older browsers (no DecompressionStream): gzip = 10-byte header + deflate data + 8-byte trailer */
 const n=raw.length,size=(raw[n-4]|raw[n-3]<<8|raw[n-2]<<16|raw[n-1]<<24)>>>0;
 return inflateRaw(raw.subarray(10,n-8),new Uint8Array(size));
}
try{
 const buf=await unpack();
 const L=new DataView(buf.buffer,buf.byteOffset,buf.byteLength).getUint32(0);
 M=JSON.parse(new TextDecoder().decode(buf.subarray(4,4+L)));BIN=buf.subarray(4+L);
}catch(e){
 const f=()=>Promise.reject(new Error('This browser can’t load the prompt library. Update your browser and reload.'));
 LogoStudio.connect({generate:f,search:f,get:f});return;
}
const C=M.c,H=M.h;
const tc=C.find(c=>c.id==='tech-ai');if(tc)tc.name='Tech AI';
const fixCase=s=>/lowercase/i.test(s)&&/capital|uppercase|small caps/i.test(s)?s.replace(/\s*Use all (lowercase|capitals)[^.]*\./,''):s;
C.forEach(c=>{c.vi=c.f.map((l,k)=>c.v.indexOf(k));c.fl=c.f.map(l=>l.map(s=>s.toLowerCase()));c.nl=(c.name+' '+c.p).toLowerCase();c.w=c.v.length});
const pad=n=>String(n).padStart(4,'0');
function build(ci,n){
 const c=C[ci],row=c.o+(n-1)*c.w,val=k=>{const v=c.vi[k],s=c.f[k][v<0?0:BIN[row+v]];return k===7?fixCase(s):s};
 let t='BRAND NAME: {brand}\n\n'+val(0);
 for(let k=1;k<c.f.length;k++)t+='\n\n'+H[k-1]+':\n'+val(k);
 return{id:c.p+'-'+pad(n),text:t,category:c.id};
}
function parseId(s){
 const m=/^([a-z][a-z\- ]*?)[\s\-]*0*(\d{1,4})$/i.exec(s.trim());if(!m)return null;
 const p=m[1].trim().replace(/\s+/g,'-').toUpperCase(),ci=C.findIndex(c=>c.p===p),n=+m[2];
 return ci>=0&&n>=1&&n<=N?[ci,n]:null;
}
function matcher(c,terms){
 const m=c.fl.map(l=>terms.map(t=>l.map(s=>s.includes(t))));
 const base=terms.map((t,k)=>c.nl.includes(t)||c.fl.some((l,f)=>c.vi[f]<0&&m[f][k][0]));
 return n=>{const row=c.o+(n-1)*c.w;
  for(let k=0;k<terms.length;k++){
   if(base[k])continue;let ok=false;
   for(let j=0;j<c.w&&!ok;j++)ok=m[c.v[j]][k][BIN[row+j]];
   if(!ok)return false}
  return true};
}
LogoStudio.connect({
 categories:async()=>C.map(c=>({id:c.id,name:c.name,desc:c.desc})),
 get:async id=>{const r=parseId(String(id));return r?build(r[0],r[1]):null},
 generate:async({category,exclude=[]})=>{
  const ci=category?C.findIndex(c=>c.id===category):Math.floor(Math.random()*C.length);
  if(ci<0)throw new Error('Unknown category.');
  let n;for(let i=0;i<20;i++){n=1+Math.floor(Math.random()*N);if(!exclude.includes(C[ci].p+'-'+pad(n)))break}
  return build(ci,n);
 },
 search:async({query='',category='',page=1})=>{
  const q=query.trim(),out=[];
  if(q){const r=parseId(q);if(r&&(!category||C[r[0]].id===category))return{items:[build(r[0],r[1])],hasMore:false}}
  const terms=q.toLowerCase().split(/\s+/).filter(Boolean);
  const idx=C.map((c,i)=>i).filter(i=>!category||C[i].id===category);
  const ms=idx.map(i=>terms.length?matcher(C[i],terms):null);
  const skip=(page-1)*PAGE,need=skip+PAGE+1;let seen=0;
  for(let n=1;n<=N&&seen<need;n++)for(let j=0;j<idx.length&&seen<need;j++){
   if(ms[j]&&!ms[j](n))continue;
   if(seen>=skip&&out.length<PAGE)out.push(build(idx[j],n));
   seen++;
  }
  return{items:out,hasMore:seen>skip+PAGE};
 }
});
})();
