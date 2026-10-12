// Independent contact flow: visitors compose an email in their own mail app.
document.addEventListener('submit', event => {
  const form=event.target;
  if(location.pathname.startsWith('/learn/checkout/')){
    event.preventDefault();event.stopImmediatePropagation();if(!form.reportValidity())return;
    const data=new FormData(form);const body=[...data].map(([k,v])=>`${k}: ${v}`).join('\n');
    location.href='mailto:hello@puredivineenergy.com?subject='+encodeURIComponent('Course enrollment enquiry: '+location.pathname.split('/').filter(Boolean).pop())+'&body='+encodeURIComponent(body);
    return;
  }
  if(location.pathname.startsWith('/verify/')){event.preventDefault();event.stopImmediatePropagation();let status=form.querySelector('[role="status"]');if(!status){status=document.createElement('p');status.setAttribute('role','status');form.append(status)}status.textContent='Certificate records and administrator access have not been connected to this rebuilt website. Please contact support@puredivineenergy.com for verification.';return;}
  if(!form.matches('.wpcf7-form')) {if(form.method.toLowerCase()==='post'){event.preventDefault();event.stopImmediatePropagation();let status=document.createElement('p');status.setAttribute('role','status');status.textContent='This form needs its original backend connected. Please contact hello@puredivineenergy.com.';form.append(status)}return;}
  event.preventDefault();event.stopImmediatePropagation();
  if(!form.reportValidity()) return;
  const data=new FormData(form);
  const name=data.get('your-name')||'';
  const email=data.get('your-email')||'';
  const subject=data.get('your-subject')||'Healing consultation';
  const message=data.get('your-message')||'';
  const body=`Name: ${name}\nEmail: ${email}\n\n${message}`;
  window.location.href=`mailto:hello@puredivineenergy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  let status=form.querySelector('.wpcf7-response-output');
  if(!status){status=document.createElement('p');form.append(status)}
  status.style.display='block';status.setAttribute('role','status');
  status.textContent='Your email app will open with your enquiry. Please send the email there to contact us.';
},true);
document.addEventListener('DOMContentLoaded',()=>{
for(const form of document.forms){for(const input of form.querySelectorAll('input:not([type="hidden"]),textarea')){const label=input.previousElementSibling;if(label?.tagName==='LABEL'&&!label.htmlFor){input.id ||= 'field-'+input.name;label.htmlFor=input.id}}}
if(location.pathname.startsWith('/learn/checkout/')){const button=document.querySelector('button[type="submit"]');if(button)button.textContent='Enquire About Enrollment';}
});
