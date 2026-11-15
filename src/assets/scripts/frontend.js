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

// Smooth mouse-wheel movement on desktop. Touch devices keep their native scrolling,
// and internal scrolling areas (chat, dialogs, form fields) remain untouched.
const canUseSmoothWheel=window.matchMedia('(pointer: fine)').matches&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(canUseSmoothWheel){
  let targetScrollY=window.scrollY;
  let smoothWheelFrame=0;
  const usesOwnScroll=target=>{
    if(!(target instanceof Element))return false;
    if(document.querySelector('dialog[open]'))return true;
    const container=target.closest('textarea,select,input,[contenteditable="true"],.pde-chat-messages,.pde-mobile-panel,[data-pde-native-scroll]');
    if(!container)return false;
    const style=getComputedStyle(container);
    return /(auto|scroll)/.test(style.overflowY)&&container.scrollHeight>container.clientHeight;
  };
  const continueSmoothWheel=()=>{
    const distance=targetScrollY-window.scrollY;
    if(Math.abs(distance)<0.75){window.scrollTo(0,targetScrollY);smoothWheelFrame=0;return}
    window.scrollTo(0,window.scrollY+distance*.18);
    smoothWheelFrame=requestAnimationFrame(continueSmoothWheel);
  };
  window.addEventListener('wheel',event=>{
    if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.altKey||!event.deltaY||usesOwnScroll(event.target))return;
    event.preventDefault();
    const unit=event.deltaMode===1?38:1;
    const maxScroll=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
    targetScrollY=Math.max(0,Math.min(maxScroll,targetScrollY+event.deltaY*unit));
    if(!smoothWheelFrame)smoothWheelFrame=requestAnimationFrame(continueSmoothWheel);
  },{passive:false});
  window.addEventListener('scroll',()=>{if(!smoothWheelFrame)targetScrollY=window.scrollY},{passive:true});
}

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
  status.textContent='Frontend preview only. Your information has not been sent, saved, verified, or charged.';
});
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
