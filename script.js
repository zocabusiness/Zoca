document.addEventListener('DOMContentLoaded',()=>{const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();const f=document.getElementById('quoteForm');if(f){const categoryInput=document.getElementById('projectCategory'),projectFields=document.getElementById('projectFields'),submitWrap=document.getElementById('quoteSubmit'),status=document.getElementById('quoteStatus'),categoryTitle=document.getElementById('selectedCategoryTitle'),categoryButtons=[...f.querySelectorAll('.category-choice')],serviceChecks=[...f.querySelectorAll('input[name="services"]')],serviceSummary=document.getElementById('serviceSummary'),servicePicker=document.getElementById('servicePicker'),submitButton=document.getElementById('submitQuote');categoryButtons.forEach(button=>button.addEventListener('click',()=>{const category=button.dataset.category;categoryInput.value=category;categoryButtons.forEach(b=>b.setAttribute('aria-pressed',b===button?'true':'false'));categoryTitle.textContent=category+' project details';projectFields.hidden=false;submitWrap.hidden=false;status.hidden=true;}));serviceChecks.forEach(check=>check.addEventListener('change',()=>{const selected=serviceChecks.filter(c=>c.checked).map(c=>c.value);serviceSummary.innerHTML=selected.length?selected.join(', ')+' <span aria-hidden="true">⌄</span>':'Select services <span aria-hidden="true">⌄</span>';}));f.addEventListener('submit',async e=>{e.preventDefault();const personalRequired=[...f.querySelectorAll('.quote-fields [required]')];for(const field of personalRequired){if(!field.reportValidity())return;}if(!categoryInput.value){categoryButtons[0].focus();return;}const projectRequired=[...projectFields.querySelectorAll('[required]')];for(const field of projectRequired){if(!field.reportValidity())return;}if(!serviceChecks.some(c=>c.checked)){servicePicker.open=true;serviceSummary.focus?.();servicePicker.scrollIntoView({behavior:'smooth',block:'center'});return;}if(f.elements._honey.value)return;submitButton.disabled=true;submitButton.textContent='Sending…';status.hidden=true;try{const response=await fetch(f.action,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({...Object.fromEntries(new FormData(f).entries()),services:serviceChecks.filter(c=>c.checked).map(c=>c.value)})});const responseText=await response.text();let result={};try{result=JSON.parse(responseText)}catch(_){throw new Error('The form service returned an unreadable response. Please try again or email Zocabusiness@gmail.com.')}if(!response.ok||result.success===false)throw new Error(result.message||'Submission failed');f.querySelectorAll('.quote-step-heading,.quote-prompt,.category-buttons,.project-fields,.quote-submit').forEach(el=>el.hidden=true);status.classList.remove('error');status.innerHTML='<h2>Thank you!</h2><p>Your enquiry has been submitted. We’ll review your project details and get back to you within a few days.</p>';status.hidden=false;f.reset();}catch(error){status.classList.add('error');status.innerHTML='<h2>Something went wrong</h2><p>Your enquiry could not be sent just now. Please try again, or email us directly at <a href="mailto:Zocabusiness@gmail.com">Zocabusiness@gmail.com</a>.</p>';status.hidden=false;}finally{submitButton.disabled=false;submitButton.innerHTML='Submit enquiry <span aria-hidden="true">↗</span>';}});}const t=document.getElementById('timeline'),p=document.getElementById('timelineProgress');if(t&&p){const u=()=>{const r=t.getBoundingClientRect(),s=innerHeight*.78,e=innerHeight*.25,v=(s-r.top)/(r.height+s-e);p.style.height=(Math.max(0,Math.min(1,v))*100)+'%'};addEventListener('scroll',u,{passive:true});addEventListener('resize',u);u();}const tabs=[...document.querySelectorAll('.portfolio-tab')];if(tabs.length){const activatePortfolioTab=tab=>{tabs.forEach(item=>{const active=item===tab;item.classList.toggle('active',active);item.setAttribute('aria-selected',active?'true':'false');});document.querySelectorAll('.portfolio-panel').forEach(panel=>{const active=panel.id===tab.getAttribute('aria-controls');panel.hidden=!active;panel.classList.toggle('active',active);});};tabs.forEach(tab=>tab.addEventListener('click',()=>{activatePortfolioTab(tab);const category=tab.dataset.portfolio;history.replaceState(null,'',`${window.location.pathname}?category=${category}#${category}`);}));const queryCategory=new URLSearchParams(window.location.search).get('category');const hashCategory=window.location.hash.replace(/^#/,'');const requested=(queryCategory||hashCategory||'hospitality').trim().toLowerCase();const requestedTab=tabs.find(tab=>(tab.dataset.portfolio||'').trim().toLowerCase()===requested);activatePortfolioTab(requestedTab||tabs[0]);}});

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



// Partner galleries: genuinely circular scrolling in either direction.
// Keep two duplicate cycles on each side, and only recenter after the visitor
// has moved a full cycle beyond the central copy. The recenter is between
// identical image sequences, so the visible gallery never jumps to the start.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.partner-project').forEach(project => {
    const track = project.querySelector('.partner-gallery-track');
    if (!track) return;
    const originals = [...track.querySelectorAll('.partner-gallery-item')];
    if (originals.length < 2) return;

    const cloneCycle = () => originals.map(item => {
      const clone = item.cloneNode(true);
      clone.dataset.galleryClone = 'true';
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a,button,input,select,textarea,[tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));
      clone.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
      return clone;
    });

    // Two full cycles before and after the real items provide ample runway.
    const before = document.createDocumentFragment();
    [...cloneCycle(), ...cloneCycle()].forEach(item => before.appendChild(item));
    track.insertBefore(before, originals[0]);
    const after = document.createDocumentFragment();
    [...cloneCycle(), ...cloneCycle()].forEach(item => after.appendChild(item));
    track.appendChild(after);

    let cycleWidth = 0;
    let centralStart = 0;
    let adjusting = false;
    const measure = () => {
      const first = originals[0];
      const firstAfter = originals[0].nextElementSibling;
      // The next item is the second original; use the first clone after the
      // original run to measure one complete cycle including all gaps.
      const cloneAfter = track.querySelectorAll('[data-gallery-clone="true"]')[originals.length * 2];
      if (!first || !cloneAfter) return;
      centralStart = first.offsetLeft;
      cycleWidth = cloneAfter.offsetLeft - first.offsetLeft;
      if (!cycleWidth && firstAfter) {
        const last = originals[originals.length - 1];
        cycleWidth = last.offsetLeft + last.offsetWidth - first.offsetLeft + (parseFloat(getComputedStyle(track).gap) || 0);
      }
    };

    const recenter = () => {
      if (adjusting || !cycleWidth) return;
      const leftBoundary = centralStart - cycleWidth;
      const rightBoundary = centralStart + cycleWidth;
      if (track.scrollLeft < leftBoundary) {
        adjusting = true;
        track.scrollLeft += cycleWidth;
        adjusting = false;
      } else if (track.scrollLeft >= rightBoundary) {
        adjusting = true;
        track.scrollLeft -= cycleWidth;
        adjusting = false;
      }
    };

    const initialize = () => {
      measure();
      if (cycleWidth) track.scrollLeft = centralStart;
    };
    const ready = Promise.all(originals.flatMap(item => [...item.querySelectorAll('img')].map(img => img.decode?.().catch(() => {}) || Promise.resolve())));
    ready.then(() => requestAnimationFrame(() => requestAnimationFrame(initialize)));
    window.addEventListener('load', initialize, { once: true });
    track.addEventListener('scroll', recenter, { passive: true });
    window.addEventListener('resize', () => {
      const relative = cycleWidth ? track.scrollLeft - centralStart : 0;
      measure();
      if (cycleWidth) track.scrollLeft = centralStart + Math.max(-cycleWidth * .9, Math.min(cycleWidth * .9, relative));
    }, { passive: true });

    project.querySelectorAll('.partner-gallery-arrow').forEach(button => {
      button.addEventListener('click', () => {
        const direction = Number(button.dataset.galleryDir || 1);
        const item = originals[0];
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        track.scrollBy({ left: direction * (item.getBoundingClientRect().width + gap), behavior: 'smooth' });
      });
    });
  });
});
