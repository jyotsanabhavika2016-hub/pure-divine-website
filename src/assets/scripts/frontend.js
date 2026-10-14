/** Browser-only navigation, focus management and form demonstrations. */
const toggle=document.querySelector('.pde-mobile-toggle');
const panel=document.getElementById('pde-mobile-menu');
function closeMenu(returnFocus=false){
  if(!toggle||!panel)return;
  toggle.setAttribute('aria-expanded','false');panel.hidden=true;
  document.body.classList.remove('pde-mobile-menu-open');
  if(returnFocus)toggle.focus();
}
toggle?.addEventListener('click',()=>{
  const open=toggle.getAttribute('aria-expanded')==='true';
  toggle.setAttribute('aria-expanded',String(!open));panel.hidden=open;
  document.body.classList.toggle('pde-mobile-menu-open',!open);
});
document.addEventListener('click',event=>{if(panel&&!panel.hidden&&!panel.contains(event.target)&&!toggle.contains(event.target))closeMenu()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&panel&&!panel.hidden)closeMenu(true)});
window.matchMedia('(min-width: 1025px)').addEventListener('change',event=>{if(event.matches)closeMenu()});
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
