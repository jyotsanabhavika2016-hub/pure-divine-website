document.addEventListener('DOMContentLoaded', function () {
    const launcher = document.getElementById('pde-chat-launcher');
    const widget = document.getElementById('pde-chat-widget');
    const closeBtn = document.getElementById('pde-chat-close');
    const messagesBox = document.getElementById('pde-chat-messages');
    const quickActionsBox = document.getElementById('pde-chat-quick-actions');
    const input = document.getElementById('pde-chat-input');
    const sendBtn = document.getElementById('pde-chat-send');
    const leadFormWrap = document.getElementById('pde-chat-lead-form');

    let sessionId = sessionStorage.getItem('pde_chat_session_id') || ('pde_' + Date.now());
    sessionStorage.setItem('pde_chat_session_id', sessionId);

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function appendMessage(text, sender) {
        const message = document.createElement('div');
        message.className = 'pde-message ' + (sender === 'user' ? 'pde-user-message' : 'pde-bot-message');
        message.textContent = text;
        messagesBox.appendChild(message);
        scrollMessagesToBottom();
    }

    function scrollMessagesToBottom() {
        setTimeout(() => {
            messagesBox.scrollTop = messagesBox.scrollHeight;
        }, 60);
    }

    function renderQuickActions(actions) {
        quickActionsBox.innerHTML = '';

        if (!actions || !actions.length) return;

        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pde-quick-action';
            btn.textContent = action;

            btn.addEventListener('click', function () {
                handleQuickAction(action);
            });

            quickActionsBox.appendChild(btn);
        });
    }

    function handleQuickAction(action) {
        const value = action.toLowerCase();

        if (value.includes('whatsapp')) {
            window.open('https://wa.me/917691011395', '_blank');
            return;
        }

        if (value.includes('contact')) {
            appendMessage('You can reach us at hello@puredivineenergy.com or call +91 7691011395.', 'bot');
            return;
        }

        if (value.includes('leave your details') || value.includes('book consultation')) {
            appendMessage('Please share your details below and our team will contact you shortly.', 'bot');
            showLeadForm();
            return;
        }

        if (value.includes('courses')) {
            appendMessage('We offer Reiki Level 1, Reiki Level 2, Master & Teacher, Pranic Healing, and 27 Days Journey.', 'bot');
            renderQuickActions(['Reiki Level 1', 'Reiki Level 2', 'Master & Teacher', 'Leave Your Details']);
            return;
        }

        if (value.includes('healing services')) {
            appendMessage('We support Reiki Healing, Chakra Healing, Aura Cleansing, Meditation, and spiritual guidance sessions.', 'bot');
            renderQuickActions(['Book Consultation', 'WhatsApp Support', 'Leave Your Details']);
            return;
        }

        input.value = action;
        sendMessage();
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'pde-message pde-bot-message';
        typing.id = 'pde-typing';
        typing.textContent = 'Communicating...';
        messagesBox.appendChild(typing);
        scrollMessagesToBottom();
    }

    function hideTyping() {
        const typing = document.getElementById('pde-typing');
        if (typing) typing.remove();
    }

    function showLeadForm() {
        if (leadFormWrap) {
            leadFormWrap.classList.remove('pde-hidden');
            scrollMessagesToBottom();
        }
    }

    async function submitLeadForm(e) {
        e.preventDefault();

        const fullName = document.getElementById('pde-lead-name').value.trim();
        const email = document.getElementById('pde-lead-email').value.trim();
        const phone = document.getElementById('pde-lead-phone').value.trim();

        try {
            await fetch(PDE_CHAT_CONFIG.leadUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    full_name: fullName,
                    email: email,
                    phone: phone,
                    interest_area: 'Chatbot lead'
                })
            });

            appendMessage('Thank you. Our team will contact you shortly.', 'bot');
            leadFormWrap.classList.add('pde-hidden');
        } catch (error) {
            appendMessage('Sorry, we could not save your details right now.', 'bot');
        }
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        input.value = '';
        quickActionsBox.innerHTML = '';
        showTyping();

        try {
            const response = await fetch(PDE_CHAT_CONFIG.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: text,
                    session_id: sessionId,
                    page_url: window.location.href
                })
            });

            const data = await response.json();

            hideTyping();
            appendMessage(data.reply || 'Sorry, I could not respond right now.', 'bot');
            renderQuickActions(data.quick_actions || []);

            if (data.show_lead_form) {
                showLeadForm();
            }

            if (data.mode === 'fallback_menu') {
                appendMessage('You can continue using the guided options below.', 'bot');
            }
        } catch (error) {
            hideTyping();
            appendMessage('Please use the options below to continue.', 'bot');
            renderQuickActions(['Courses', 'Healing Services', 'Book Consultation', 'WhatsApp Support', 'Contact Us']);
        }
    }

    function openWidget() {
        widget.classList.remove('pde-hidden');
        launcher.classList.add('pde-hidden');

        if (!messagesBox.dataset.welcomed) {
            appendMessage(
                'Welcome to Pure Divine Energy. I can help you choose a healing path, explore courses, or book a consultation.',
                'bot'
            );
            renderQuickActions([
                'Reiki Healing',
                'Book Consultation',
                'Courses',
                'WhatsApp Support'
            ]);
            messagesBox.dataset.welcomed = 'true';
        }
    }

    function closeWidget() {
        widget.classList.add('pde-hidden');
        launcher.classList.remove('pde-hidden');
    }

    launcher.addEventListener('click', openWidget);
    closeBtn.addEventListener('click', closeWidget);
    sendBtn.addEventListener('click', sendMessage);

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    const leadForm = document.getElementById('pde-lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', submitLeadForm);
    }

    if (!isMobile()) {
        setTimeout(openWidget, 1200);
    }
});