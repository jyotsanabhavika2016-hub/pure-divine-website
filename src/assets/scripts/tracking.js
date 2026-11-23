/*
 * Privacy-conscious event layer.
 * It only creates browser-side dataLayer events. A GTM container or GA4 tag is
 * deliberately not injected until the business supplies an approved ID and
 * consent policy. Submission events represent an attempt, never a confirmed
 * booking or payment.
 */
const dataLayer=window.dataLayer=window.dataLayer||[];
const clean=value=>String(value||'').replace(/\s+/g,' ').trim().slice(0,120);
function track(eventName,parameters={}){
  const event={event:eventName,page_path:window.location.pathname,...parameters};
  dataLayer.push(event);
  document.dispatchEvent(new CustomEvent('pde:track',{detail:event}));
}

track('pde_page_view');

document.addEventListener('click',event=>{
  const link=event.target.closest('a');
  if(!link)return;
  const href=link.getAttribute('href')||'';
  const label=clean(link.textContent);
  if(/^https:\/\/wa\.me\//i.test(href))track('pde_whatsapp_click',{link_text:label});
  else if(/^tel:/i.test(href))track('pde_phone_click',{link_text:label});
  else if(/\/contact\/?(?:#.*)?$/i.test(href))track('pde_contact_cta_click',{link_text:label});
  else if(/\/learn\/checkout\//i.test(href))track('pde_checkout_initiated',{link_text:label,course_path:href});
  else if(/\/courses\/?(?:#.*)?$/i.test(href))track('pde_courses_cta_click',{link_text:label});
});

document.addEventListener('submit',event=>{
  const form=event.target;
  if(!(form instanceof HTMLFormElement))return;
  const formId=clean(form.id||form.getAttribute('aria-label')||form.className||'site_form');
  const isBooking=/book-session|pde-cf7-form|booking/i.test(`${window.location.pathname} ${formId}`);
  track(isBooking?'pde_booking_submission_attempt':'pde_enquiry_submission_attempt',{form_id:formId});
},true);
