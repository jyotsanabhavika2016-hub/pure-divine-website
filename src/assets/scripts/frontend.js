/** Browser-only navigation, focus management and form demonstrations. */
const toggle=document.querySelector('.pde-mobile-toggle');
const panel=document.getElementById('pde-mobile-menu');
function closeMenu(returnFocus=false){
  if(!toggle||!panel)return;
  toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');panel.hidden=true;
  document.body.classList.remove('pde-mobile-menu-open');
  if(returnFocus)toggle.focus();
}
toggle?.addEventListener('click',()=>{
  const open=toggle.getAttribute('aria-expanded')==='true';
  toggle.setAttribute('aria-expanded',String(!open));toggle.setAttribute('aria-label',open?'Open menu':'Close menu');panel.hidden=open;
  document.body.classList.toggle('pde-mobile-menu-open',!open);
});
document.addEventListener('click',event=>{if(panel&&!panel.hidden&&!panel.contains(event.target)&&!toggle.contains(event.target))closeMenu()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&panel&&!panel.hidden)closeMenu(true)});
window.matchMedia('(min-width: 1025px)').addEventListener('change',event=>{if(event.matches)closeMenu()});
panel?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));

for(const form of document.forms){
  for(const [index,input] of [...form.querySelectorAll('input:not([type="hidden"]),textarea,select')].entries()){
    if(input.getAttribute('aria-required')==='true')input.required=true;
    const label=input.previousElementSibling?.tagName==='LABEL'?input.previousElementSibling:input.closest('p')?.querySelector('label');
    if(label?.tagName==='LABEL'&&!label.htmlFor){input.id||=`field-${form.id||[...document.forms].indexOf(form)}-${index}`;label.htmlFor=input.id}
  }
}
document.addEventListener('submit',event=>{
  const form=event.target;
  if(form.matches('#pde-chat-lead-form'))return;
  if(form.method.toLowerCase()!=='post'&&!form.matches('.wpcf7-form'))return;
  event.preventDefault();
  if(!form.reportValidity())return;
  let status=form.querySelector('.frontend-form-status');
  if(!status){status=document.createElement('p');status.className='frontend-form-status';status.setAttribute('role','status');form.append(status)}
  status.textContent='Online submissions are being prepared. Your details have not been sent. Please call, WhatsApp, or email us directly for support.';
});
for(const dateInput of document.querySelectorAll('input[type="date"][name="your-date"]')){
  const today=new Date();
  today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
  dateInput.min=today.toISOString().slice(0,10);
}
// Preserve the original checkout label without integrating a payment provider.
for(const button of document.querySelectorAll('form[action*="/checkout/"] button[type="submit"]'))button.textContent='Continue to Payment';

// Create a seamless, automatic testimonial carousel from the supplied stories.
for(const track of document.querySelectorAll('.pde-testimonial-track')){
  const cards=[...track.children];
  if(cards.length<2)continue;
  for(const card of cards){
    const copy=card.cloneNode(true);
    copy.setAttribute('aria-hidden','true');
    track.append(copy);
  }
}
// A small, optional 4-4-4 breathing timer for the daily affirmation.
for(const timer of document.querySelectorAll('.pde-breath-timer')){
  const button=timer.querySelector('.pde-breath-timer-toggle');
  const phase=timer.querySelector('.pde-breath-timer-phase');
  const value=timer.querySelector('.pde-breath-timer-orb strong');
  if(!button||!phase||!value)continue;
  const phases=['Breathe in','Hold gently','Breathe out'];
  let intervalId=0;
  let startedAt=0;
  const reset=()=>{
    window.clearInterval(intervalId);intervalId=0;startedAt=0;
    timer.classList.remove('is-running');button.textContent='Start';button.setAttribute('aria-pressed','false');
    phase.textContent='A moment for you';value.textContent='04';
  };
  const tick=()=>{
    const elapsed=Date.now()-startedAt;
    const cyclePosition=elapsed%12000;
    const phaseIndex=Math.floor(cyclePosition/4000);
    const secondsLeft=4-Math.floor((cyclePosition%4000)/1000);
    phase.textContent=phases[phaseIndex];value.textContent=String(secondsLeft).padStart(2,'0');
  };
  button.addEventListener('click',()=>{
    if(intervalId){reset();return}
    startedAt=Date.now();timer.classList.add('is-running');button.textContent='Stop';button.setAttribute('aria-pressed','true');
    tick();intervalId=window.setInterval(tick,250);
  });
}

// Keep FAQ groups easy to scan by showing one expanded answer per topic at a time.
for(const list of document.querySelectorAll('[data-faq-list]')){
  const items=[...list.querySelectorAll('details')];
  for(const item of items){
    item.addEventListener('toggle',()=>{
      if(!item.open)return;
      for(const sibling of items)if(sibling!==item)sibling.open=false;
    });
  }
}

// Keep the supplied videos intentionally simple: one accessible Play/Pause control only.
for(const player of document.querySelectorAll('.pde-video-player')){
  const video=player.querySelector('video');
  const button=player.querySelector('.pde-video-toggle');
  if(!video||!button)continue;
  const sync=()=>{
    const playing=!video.paused&&!video.ended;
    player.classList.toggle('is-playing',playing);
    button.setAttribute('aria-pressed',String(playing));
    button.setAttribute('aria-label',`${playing?'Pause':'Play'} ${video.getAttribute('aria-label')||'video'}`);
  };
  button.addEventListener('click',()=>{if(video.paused||video.ended)video.play();else video.pause()});
  video.addEventListener('play',sync);
  video.addEventListener('pause',sync);
  video.addEventListener('ended',sync);
  sync();
}

const previewLinks=[...document.querySelectorAll('.pde-image-preview')];
if(previewLinks.length){
  const modal=document.createElement('dialog');
  modal.className='pde-image-modal';
  modal.innerHTML='<button type="button" class="pde-image-modal-close" aria-label="Close image preview">×</button><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.append(modal);
  const modalImage=modal.querySelector('img');
  const modalCaption=modal.querySelector('figcaption');
  const close=()=>modal.close();
  modal.querySelector('.pde-image-modal-close').addEventListener('click',close);
  modal.addEventListener('click',event=>{if(event.target===modal)close()});
  for(const link of previewLinks)link.addEventListener('click',event=>{
    event.preventDefault();
    const image=link.querySelector('img');
    modalImage.src=link.dataset.preview||link.href;
    modalImage.alt=image?.alt||'';
    modalCaption.textContent=link.dataset.caption||'';
    modal.showModal();
  });
}

// Reveal the verified hero highlights with a single calm count-up when they enter view.
const heroCounts=[...document.querySelectorAll('[data-pde-count]')];
if(heroCounts.length){
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const showFinal=count=>{
    const total=Number(count.dataset.pdeCount)||0;
    count.textContent=`${total.toLocaleString('en-IN')}${count.dataset.pdeSuffix||''}`;
  };
  const animateCount=count=>{
    if(count.dataset.pdeCounted==='true')return;
    count.dataset.pdeCounted='true';
    const total=Number(count.dataset.pdeCount)||0;
    if(reduceMotion||total===0){showFinal(count);return}
    const duration=total>100?1450:950;
    const start=performance.now();
    const tick=now=>{
      const progress=Math.min((now-start)/duration,1);
      const eased=1-Math.pow(1-progress,3);
      count.textContent=`${Math.round(total*eased).toLocaleString('en-IN')}${count.dataset.pdeSuffix||''}`;
      if(progress<1)requestAnimationFrame(tick);else showFinal(count);
    };
    requestAnimationFrame(tick);
  };
  if('IntersectionObserver' in window&&!reduceMotion){
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting){animateCount(entry.target);observer.unobserve(entry.target)}
      }
    },{threshold:.65});
    heroCounts.forEach(count=>observer.observe(count));
  }else heroCounts.forEach(showFinal);
}

// Give each major page section the same gentle entrance as the hero.
// A section resets outside the viewport, so it can reveal naturally again.
const reduceScrollMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduceScrollMotion){
  const main=document.querySelector('main, #primary');
  const sectionSelectors=[':scope > section',':scope > article',':scope > .pde-page-shell',':scope > .pde-course-hero',':scope > .pde-course-catalog'];
  const targets=main?[...new Set(sectionSelectors.flatMap(selector=>[...main.querySelectorAll(selector)]))].filter(element=>!element.hidden):[];
  const childSelector='.pde-faq-list > details, .pde-course-card, .pde-service-card, .pde-benefit-card, .pde-process-step, .pde-hero-promise, .pde-contact-card, .pde-mini-card';
  for(const target of targets){
    target.classList.add('pde-scroll-reveal');
    const children=[...target.querySelectorAll(childSelector)].slice(0,8);
    children.forEach((child,index)=>{
      child.classList.add('pde-scroll-reveal-item');
      child.style.setProperty('--pde-reveal-delay',`${Math.min(index*75,450)}ms`);
    });
  }
  const reveal=target=>{
    target.classList.add('is-visible');
    target.querySelectorAll('.pde-scroll-reveal-item').forEach(item=>item.classList.add('is-visible'));
  };
  const reset=target=>{
    target.classList.remove('is-visible');
    target.querySelectorAll('.pde-scroll-reveal-item').forEach(item=>item.classList.remove('is-visible'));
  };
  window.requestAnimationFrame(()=>{
    document.documentElement.classList.add('pde-scroll-motion-ready');
    if(!targets.length)return;
    if(!('IntersectionObserver' in window)){targets.forEach(reveal);return}
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting)reveal(entry.target);
        else reset(entry.target);
      }
    },{rootMargin:'0px 0px -9% 0px',threshold:.08});
    targets.forEach(target=>observer.observe(target));
  });
}
