/** Local guided chat UI. It never calls the original chat or lead endpoints. */
const find=id=>document.getElementById(id);
const launcher=find('pde-chat-launcher');
const widget=find('pde-chat-widget');
const messages=find('pde-chat-messages');
const input=find('pde-chat-input');
const quickActions=find('pde-chat-quick-actions');
const leadForm=find('pde-chat-lead-form');
const closeButton=find('pde-chat-close');

if(launcher&&widget&&messages&&input){
  launcher.setAttribute('role','button');launcher.tabIndex=0;
  launcher.setAttribute('aria-label','Talk to us');
  launcher.setAttribute('aria-controls','pde-chat-widget');
  launcher.setAttribute('aria-expanded','false');
  widget.setAttribute('role','dialog');widget.setAttribute('aria-label','Spiritual guidance and healing support');
  messages.setAttribute('role','log');messages.setAttribute('aria-live','polite');
  closeButton.setAttribute('aria-label','Close chat');
  input.setAttribute('aria-label','Ask about healing, Reiki, courses');

  function appendMessage(text,sender='bot'){
    const message=document.createElement('div');
    message.className=`pde-message pde-${sender==='user'?'user':'bot'}-message`;
    message.textContent=text;messages.append(message);messages.scrollTop=messages.scrollHeight;
  }
  function renderActions(labels){
    quickActions.replaceChildren();
    for(const label of labels){
      const button=document.createElement('button');button.type='button';button.className='pde-quick-action';
      button.textContent=label;button.addEventListener('click',()=>respond(label));quickActions.append(button);
    }
  }
  function respond(text){
    appendMessage(text,'user');const query=text.toLowerCase();
    if(query.includes('whatsapp')){
      const link=document.createElement('a');link.className='pde-message pde-bot-message';
      link.href='https://wa.me/917691011395';link.textContent='Open WhatsApp support';messages.append(link);
    }else if(/consult|callback|details/.test(query)){
      appendMessage('Please share your details below. This frontend preview does not send or save your request.');
      leadForm?.classList.remove('pde-hidden');find('pde-lead-name')?.focus();
    }else if(/course|reiki|master|prana/.test(query)){
      appendMessage('We offer Reiki Level 1, Reiki Level 2, Master & Teacher, Pranic Healing, and 27 Days Journey. Explore Courses for the published learning paths.');
      renderActions(['Reiki Level 1','Reiki Level 2','Master & Teacher','Leave Your Details']);return;
    }else if(/healing|chakra|aura|service/.test(query)){
      appendMessage('We support Reiki Healing, Chakra Healing, Aura Cleansing, Meditation, and spiritual guidance sessions.');
    }else{
      appendMessage('This local guided preview can help you explore courses, healing services, and consultations. For personal guidance, contact hello@puredivineenergy.com or +91 7691011395.');
    }
    renderActions(['Courses','Healing Services','Book Consultation','WhatsApp Support']);
  }
  function openWidget(focus=true){
    widget.classList.remove('pde-hidden');launcher.classList.add('pde-hidden');launcher.setAttribute('aria-expanded','true');
    if(!messages.dataset.welcomed){
      appendMessage('Welcome to Pure Divine Energy. I can help you choose a healing path, explore courses, or book a consultation.');
      renderActions(['Reiki Healing','Book Consultation','Courses','WhatsApp Support']);messages.dataset.welcomed='true';
    }
    if(focus)input.focus();
  }
  function closeWidget(){widget.classList.add('pde-hidden');launcher.classList.remove('pde-hidden');launcher.setAttribute('aria-expanded','false');launcher.focus()}
  function send(){const text=input.value.trim();if(text){input.value='';respond(text)}}
  launcher.addEventListener('click',()=>openWidget());
  launcher.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openWidget()}});
  closeButton.addEventListener('click',closeWidget);
  find('pde-chat-send').addEventListener('click',send);
  input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();send()}});
  widget.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeWidget()}});
  leadForm?.addEventListener('submit',event=>{
    event.preventDefault();if(!leadForm.reportValidity())return;
    appendMessage('Frontend preview only. Your callback request has not been sent or saved.');
  });
  if(window.matchMedia('(min-width:769px)').matches)setTimeout(()=>openWidget(false),1200);
}
