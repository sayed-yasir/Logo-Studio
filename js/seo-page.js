/* Theme toggle for the static category pages (same storage key and colors as app.js). */
(function(){
  var d=document.documentElement;
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-act=theme]');if(!b)return;
    var t=(d.dataset.theme||'dark')==='dark'?'light':'dark';
    d.dataset.theme=t;
    var m=document.querySelector('meta[name=theme-color]');if(m)m.content=t==='light'?'#F7F5FC':'#07060B';
    try{localStorage.setItem('ls:theme',JSON.stringify(t))}catch(_){}
  });
})();
