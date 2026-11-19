document.querySelectorAll('.menu').forEach(button=>{
  button.addEventListener('click',()=>{
    const nav=document.querySelector('.nav');
    const open=nav.classList.toggle('open');
    button.setAttribute('aria-expanded',String(open));
  });
});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{
  document.querySelector('.nav')?.classList.remove('open');
  document.querySelector('.menu')?.setAttribute('aria-expanded','false');
}));
document.querySelectorAll('.ada-card').forEach(card=>{
  card.addEventListener('click',()=>card.classList.toggle('active'));
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.classList.toggle('active')}});
});
const play=document.querySelector('.play');
if(play){
  play.addEventListener('click',()=>{
    const video=document.querySelector('#showreel-video');
    if(video && video.querySelector('source')?.getAttribute('src')){
      video.style.display='block'; video.controls=true; video.play(); play.style.display='none';
    } else {
      alert('Add your showreel video at assets/showreel.mp4 to activate playback.');
    }
  });
}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
