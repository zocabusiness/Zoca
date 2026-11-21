document.addEventListener('DOMContentLoaded',()=>{const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();const f=document.getElementById('quoteForm');if(f)f.addEventListener('submit',e=>{e.preventDefault();if(!f.reportValidity())return;const d=new FormData(f);const subject=encodeURIComponent('Project enquiry from '+d.get('name'));const body=encodeURIComponent('Name: '+d.get('name')+'\nPhone: '+d.get('phone')+'\nCompany: '+d.get('company')+'\nEmail: '+d.get('email')+'\n\nProject details:\n'+d.get('details'));window.location.href='mailto:hello@zoca.studio?subject='+subject+'&body='+body;});const t=document.getElementById('timeline'),p=document.getElementById('timelineProgress');if(t&&p){const u=()=>{const r=t.getBoundingClientRect(),s=innerHeight*.78,e=innerHeight*.25,v=(s-r.top)/(r.height+s-e);p.style.height=(Math.max(0,Math.min(1,v))*100)+'%'};addEventListener('scroll',u,{passive:true});addEventListener('resize',u);u();}const tabs=document.querySelectorAll('.portfolio-tab');if(tabs.length){tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(item=>{const active=item===tab;item.classList.toggle('active',active);item.setAttribute('aria-selected',active?'true':'false');});document.querySelectorAll('.portfolio-panel').forEach(panel=>{const active=panel.id===tab.getAttribute('aria-controls');panel.hidden=!active;panel.classList.toggle('active',active);});}));}});

// AIDA hover/focus state: show only the matching explanation.
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('#aida-interaction');
  if (!root) return;
  const items = [...root.querySelectorAll('.aida-item')];
  const copies = [...root.querySelectorAll('[data-copy]')];
  const activate = (step) => {
    items.forEach(item => item.classList.toggle('is-active', item.dataset.step === step));
    copies.forEach(copy => copy.classList.toggle('is-visible', copy.dataset.copy === step));
  };
  const clear = () => {
    items.forEach(item => item.classList.remove('is-active'));
    copies.forEach(copy => copy.classList.remove('is-visible'));
  };
  items.forEach(item => {
    item.addEventListener('pointerenter', () => activate(item.dataset.step));
    item.addEventListener('focus', () => activate(item.dataset.step));
    item.addEventListener('blur', () => { if (!root.contains(document.activeElement)) clear(); });
  });
  root.addEventListener('pointerleave', () => {
    if (!root.contains(document.activeElement)) clear();
  });
});
