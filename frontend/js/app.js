document.addEventListener('DOMContentLoaded', () => {

    const CURRENT_USER = 'Prasad Shinde';
    const CURRENT_USER_AVATAR = 'P';
    const BOT_NAME = 'CollabBot';

    // Default Data (used if localStorage is empty)
    const DEFAULT_DATA = {
        activeChannel: 'general',
        // UPDATED: Channels are now objects with visibility state
        channels: [
            { name: 'general', isPrivate: false },
            { name: 'random', isPrivate: false },
            { name: 'engineering', isPrivate: true }
        ],
        messages: {
            'general': [
                { sender: 'System', avatar: 'S', text: 'Welcome to #general!', time: '9:00 AM', isBot: true }
            ],
            'random': [],
            'engineering': []
        }
    };

    // --- LOCAL STORAGE ENGINE ---
    const Store = {
        get: () => {
            const data = localStorage.getItem('collabSpaceData');
            return data ? JSON.parse(data) : DEFAULT_DATA;
        },
        save: (data) => {
            localStorage.setItem('collabSpaceData', JSON.stringify(data));
        },
        getState: () => Store.get(),

        // Add message to specific channel
        addMessage: (channel, msgObj) => {
            const data = Store.get();
            if (!data.messages[channel]) data.messages[channel] = [];
            data.messages[channel].push(msgObj);
            Store.save(data);
        },

        // UPDATED: Add new channel with visibility
        addChannel: (channelName, isPrivate) => {
            const data = Store.get();
            // Check if exists (using .some since it's an array of objects now)
            const exists = data.channels.some(c => c.name === channelName);

            if (!exists) {
                data.channels.push({ name: channelName, isPrivate: isPrivate });
                data.messages[channelName] = [];
                Store.save(data);
            }
        },

        setActiveChannel: (channelName) => {
            const data = Store.get();
            data.activeChannel = channelName;
            Store.save(data);
        }
    };

    // --- DOM ELEMENTS ---
    const channelListEl = document.getElementById('channelList');
    const messageFeed = document.getElementById('messageFeed');
    const chatTextarea = document.querySelector('.input-wrapper textarea');
    const sendBtn = document.querySelector('.send-btn');
    const chatHeaderTitle = document.querySelector('.chat-header h3');

    // --- INITIALIZATION ---
    function initApp() {
        const data = Store.getState();
        renderSidebar(data);
        loadChannel(data.activeChannel);
    }

    // --- CORE LOGIC: RENDER SIDEBAR ---
    function renderSidebar(data) {
        channelListEl.innerHTML = ''; // Clear existing

        data.channels.forEach(channelObj => {
            const li = document.createElement('li');
            const isActive = channelObj.name === data.activeChannel;

            li.className = `channel-item ${isActive ? 'active' : ''}`;
            li.dataset.id = channelObj.name;

            // Logic: Choose Icon
            const iconHtml = channelObj.isPrivate ?
                `<i class="fa-solid fa-lock" style="font-size: 0.8rem; margin-right: 6px;"></i>` :
                `<span class="channel-hash">#</span>`;

            li.innerHTML = `${iconHtml} ${channelObj.name}`;
            channelListEl.appendChild(li);
        });
    }

    // --- CORE LOGIC: LOAD CHANNEL & MESSAGES ---
    function loadChannel(channelName) {
        const data = Store.getState();

        // 1. Update UI Active State
        document.querySelectorAll('.channel-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.id === channelName) item.classList.add('active');
        });

        // 2. Find Channel Object to check visibility
        const currentChannelObj = data.channels.find(c => c.name === channelName);
        const isPrivate = currentChannelObj ? currentChannelObj.isPrivate : false;

        // 3. Update Header with Animation
        chatHeaderTitle.style.opacity = 0;
        setTimeout(() => {
            const icon = isPrivate ? '<i class="fa-solid fa-lock"></i>' : '#';
            chatHeaderTitle.innerHTML = `${icon} ${channelName}`;
            chatHeaderTitle.style.opacity = 1;
        }, 150);

        // 4. Update Persisted State
        Store.setActiveChannel(channelName);

        // 5. Render Messages
        const messages = data.messages[channelName] || [];
        messageFeed.innerHTML = '';
        messages.forEach(msg => renderMessageToDOM(msg));
        scrollToBottom();
    }

    // --- MESSAGING LOGIC ---
    function handleSendMessage() {
        const text = chatTextarea.value.trim();
        if (!text) return;

        const data = Store.getState();
        const currentChannel = data.activeChannel;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const msgObj = {
            sender: CURRENT_USER,
            avatar: CURRENT_USER_AVATAR,
            text: text,
            time: time,
            isBot: false
        };

        Store.addMessage(currentChannel, msgObj);
        renderMessageToDOM(msgObj);

        chatTextarea.value = '';
        chatTextarea.style.height = '80px';
        scrollToBottom();

        simulateBotReply(currentChannel);
    }

    function renderMessageToDOM(msg) {
        const html = `
            <div class="message-group ${msg.isBot ? '' : 'new-message'}">
                <div class="msg-avatar" style="background: ${msg.isBot ? '#1164A3' : '#4A154B'}">
                    ${msg.avatar}
                </div>
                <div class="msg-content">
                    <div class="msg-meta">
                        <span class="msg-sender">${msg.sender}</span>
                        <span class="msg-time">${msg.time}</span>
                    </div>
                    <div class="msg-text">${escapeHtml(msg.text)}</div>
                </div>
            </div>
        `;
        messageFeed.insertAdjacentHTML('beforeend', html);
    }

    function simulateBotReply(channel) {
        setTimeout(() => {
            const currentObj = Store.getState();
            if (currentObj.activeChannel !== channel) return;

            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const replyObj = {
                sender: BOT_NAME,
                avatar: 'B',
                text: "I've saved that to the database!",
                time: time,
                isBot: true
            };

            Store.addMessage(channel, replyObj);
            renderMessageToDOM(replyObj);
            scrollToBottom();
        }, 1500);
    }

    // --- FEATURE: COLLAPSIBLE SIDEBAR ---
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            section.classList.toggle('collapsed');
        });
    });

    // --- FEATURE: ADD CHANNEL (MODAL) ---
    const createChannelForm = document.getElementById('createChannelForm');
    const channelNameInput = document.getElementById('newChannelName');
    const modal = document.getElementById('channelModal');

    // NEW: Handle Radio Card Selection (Visual)
    const radioCards = document.querySelectorAll('.radio-card');
    radioCards.forEach(card => {
        card.addEventListener('click', () => {
            // UI Toggle
            radioCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            // Visual Prefix Update
            const radio = card.querySelector('input');
            const prefixSpan = document.getElementById('modalPrefixDisplay');
            if (radio.checked && prefixSpan) {
                prefixSpan.innerHTML = radio.value === 'private' ?
                    '<i class="fa-solid fa-lock" style="font-size: 0.8rem"></i>' :
                    '#';
            }
        });
    });

    // Open Modal
    document.querySelectorAll('.add-channel-icon').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.classList.add('open');
            channelNameInput.focus();
        });
    });

    // Close Modal
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => modal.classList.remove('open'));
    });

    // Create Channel Submit
    if (createChannelForm) {
        createChannelForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let name = channelNameInput.value.trim().toLowerCase().replace(/\s+/g, '-');

            // NEW: Get Visibility Value
            const visibilityInput = document.querySelector('input[name="channelVisibility"]:checked');
            const isPrivate = visibilityInput ? (visibilityInput.value === 'private') : false;

            if (name) {
                Store.addChannel(name, isPrivate);

                const data = Store.getState();
                renderSidebar(data);
                loadChannel(name);

                modal.classList.remove('open');
                createChannelForm.reset();

                // Reset Radio UI
                radioCards.forEach(c => c.classList.remove('selected'));
                if (radioCards[0]) radioCards[0].classList.add('selected');
                if (document.getElementById('modalPrefixDisplay'))
                    document.getElementById('modalPrefixDisplay').innerText = '#';
            }
        });
    }

    // --- EVENT LISTENERS ---

    // Sidebar Navigation
    channelListEl.addEventListener('click', (e) => {
        const item = e.target.closest('.channel-item');
        if (item) {
            loadChannel(item.dataset.id);
        }
    });

    // Send Message
    sendBtn.addEventListener('click', handleSendMessage);
    chatTextarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Auto-resize textarea
    chatTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') this.style.height = '80px';
    });

    // Scroll Helper
    function scrollToBottom() {
        messageFeed.scrollTop = messageFeed.scrollHeight;
    }

    // Security Helper
    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // --- BOOTSTRAP ---
    initApp();
});