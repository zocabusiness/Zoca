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



// Partner galleries: seamless infinite loop in both directions, including touch/trackpad scrolling.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.partner-project').forEach(project => {
    const track = project.querySelector('.partner-gallery-track');
    if (!track) return;
    const originals = [...track.querySelectorAll('.partner-gallery-item')];
    if (originals.length < 2) return;

    // Add a complete copy on either side so the user can enter the loop
    // from the first image and continue in either direction immediately.
    const makeClone = item => {
      const clone = item.cloneNode(true);
      clone.dataset.galleryClone = 'true';
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a,button,input,select,textarea,[tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));
      clone.querySelectorAll('img').forEach(img => img.loading = 'eager');
      return clone;
    };
    const before = document.createDocumentFragment();
    originals.forEach(item => before.appendChild(makeClone(item)));
    track.insertBefore(before, originals[0]);
    const after = document.createDocumentFragment();
    originals.forEach(item => after.appendChild(makeClone(item)));
    track.appendChild(after);

    let cycleWidth = 0;
    let normalizing = false;
    const measure = () => {
      const firstOriginal = originals[0];
      const firstAfter = track.querySelector('[data-gallery-clone="true"]:last-of-type');
      // Use the original sequence's total width, including its inter-item gaps.
      const firstBefore = track.querySelector('[data-gallery-clone="true"]');
      const firstAfterClone = [...track.querySelectorAll('[data-gallery-clone="true"]')][originals.length];
      if (firstOriginal && firstAfterClone) cycleWidth = firstAfterClone.offsetLeft - firstOriginal.offsetLeft;
      if (!cycleWidth && originals.length) {
        const last = originals[originals.length - 1];
        cycleWidth = last.offsetLeft + last.offsetWidth - firstOriginal.offsetLeft;
        const style = getComputedStyle(track);
        cycleWidth += parseFloat(style.columnGap || style.gap || 0) || 0;
      }
      if (firstBefore && firstAfter) { /* keep clone references measurable */ }
    };
    const firstOriginal = originals[0];
    const normalize = () => {
      if (normalizing || !cycleWidth) return;
      const originalStart = firstOriginal.offsetLeft;
      const originalEnd = originalStart + cycleWidth;
      if (track.scrollLeft < originalStart - 1) {
        normalizing = true;
        track.scrollLeft += cycleWidth;
        normalizing = false;
      } else if (track.scrollLeft >= originalEnd - 1) {
        normalizing = true;
        track.scrollLeft -= cycleWidth;
        normalizing = false;
      }
    };
    const startAtFirst = () => {
      measure();
      track.scrollLeft = firstOriginal.offsetLeft;
    };
    requestAnimationFrame(() => requestAnimationFrame(startAtFirst));
    track.addEventListener('scroll', normalize, {passive:true});
    window.addEventListener('resize', () => {
      const current = track.scrollLeft;
      measure();
      // Keep the current visual position anchored to the real sequence after resize.
      track.scrollLeft = firstOriginal.offsetLeft + ((current - firstOriginal.offsetLeft) % cycleWidth + cycleWidth) % cycleWidth;
    }, {passive:true});

    project.querySelectorAll('.partner-gallery-arrow').forEach(button => {
      button.addEventListener('click', () => {
        const direction = Number(button.dataset.galleryDir || 1);
        const item = originals[0];
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        track.scrollBy({left: direction * (item.getBoundingClientRect().width + gap), behavior:'smooth'});
      });
    });
  });
});
