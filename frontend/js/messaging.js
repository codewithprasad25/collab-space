let CURRENT_USER = localStorage.getItem('userName') || 'Guest';
let CURRENT_USER_AVATAR = CURRENT_USER.charAt(0).toUpperCase();

let messageFeed = null;
let chatTextarea = null;
let sendBtn = null;
let chatHeaderTitle = null;

// Static messages for demo
const STATIC_MESSAGES = {
    general: [{
            sender: 'System',
            avatar: 'S',
            text: 'Welcome to the #general channel! This is the start of the Collab-Space history.',
            time: '9:00 AM',
            isBot: true
        },
        {
            sender: 'Ashwani Kumar',
            avatar: 'A',
            text: 'Hey everyone! Let\'s discuss the new project roadmap.',
            time: '10:15 AM',
            isBot: false
        },
        {
            sender: 'Sarah Engineer',
            avatar: 'S',
            text: 'Great! I\'ve prepared a preliminary timeline.',
            time: '10:20 AM',
            isBot: false
        }
    ],
    random: [{
            sender: 'System',
            avatar: 'S',
            text: 'Welcome to #random! Off-topic conversations and fun discussions go here.',
            time: '9:00 AM',
            isBot: true
        },
        {
            sender: 'John Dev',
            avatar: 'J',
            text: 'Anyone up for lunch later? 🍕',
            time: '11:30 AM',
            isBot: false
        }
    ],
    engineering: [{
            sender: 'System',
            avatar: 'S',
            text: 'Welcome to #engineering! Technical discussions and code reviews here.',
            time: '9:00 AM',
            isBot: true
        },
        {
            sender: 'Sarah Engineer',
            avatar: 'S',
            text: 'I\'ve pushed the new API documentation to the repo.',
            time: '2:45 PM',
            isBot: false
        }
    ]
};

const stompClient = new StompJs.Client({
    webSocketFactory: () => {
        const currentHost = window.location.hostname;
        const wsUrl = currentHost === '127.0.0.1' || currentHost === '::1' 
            ? 'http://127.0.0.1:8080/gs-guide-websocket'
            : `http://${currentHost}:8080/gs-guide-websocket`;
        console.log('WebSocket URL:', wsUrl);
        return new SockJS(wsUrl);
    }
});

stompClient.onConnect = (frame) => {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/message', (greeting) => {
        let data = greeting.body;
        console.log('Received message:', data);
    });
};
stompClient.activate();


function initMessaging(feed, textarea, btn, title) {
    messageFeed = feed;
    chatTextarea = textarea;
    sendBtn = btn;
    chatHeaderTitle = title;

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (chatTextarea) {
        chatTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        chatTextarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });
    }
}

function renderSidebar(data) {
    const list = document.getElementById('channelList');
    if (!list) return;

    const ws = data.workspaces[data.activeWorkspace];
    if (!ws) return;

    console.log('Rendering channels:', ws.channels);
    list.innerHTML = '';

    ws.channels.forEach(ch => {
        const li = document.createElement('li');
        li.className = `channel-item ${ch.name === data.activeChannel ? 'active' : ''}`;
        li.dataset.id = ch.name;
        li.innerHTML = ch.isPrivate ?
            `<i class="fa-solid fa-lock"></i> ${ch.name}` :
            `<span class="channel-hash">#</span> ${ch.name}`;
        list.appendChild(li);
    });
}

function renderDirectMessages(data) {
    const dmList = document.querySelector('.dm-list');
    if (!dmList) return;

    const ws = data.workspaces[data.activeWorkspace];
    if (!ws || !ws.members) return;

    console.log('Rendering DM members:', ws.members);
    dmList.innerHTML = '';

    ws.members.forEach(member => {
        const li = document.createElement('li');
        li.className = `channel-item user-status ${member.isActive ? 'online' : 'offline'}`;
        li.dataset.id = member.name;
        li.dataset.userId = member.id;
        const statusIcon = member.isActive ? 'fa-circle' : 'fa-regular fa-circle';
        li.innerHTML = `
            <i class="fa-solid ${statusIcon}"></i> ${member.name}
        `;
        dmList.appendChild(li);
    });
}

function loadChannel(name) {
    const data = Store.getState();
    const ws = data.workspaces[data.activeWorkspace];
    if (!ws) return;

    document.querySelectorAll('.channel-item').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.id === name) el.classList.add('active');
    });

    const channel = ws.channels.find(c => c.name === name);
    if (chatHeaderTitle && channel) {
        const icon = channel.isPrivate ? '<i class="fa-solid fa-lock"></i>' : '#';
        chatHeaderTitle.innerHTML = `${icon} ${name}`;
    }

    Store.setActiveChannel(name);

    // Load static messages for demo
    const staticMessages = STATIC_MESSAGES[name] || [];

    if (messageFeed) {
        messageFeed.innerHTML = '';
        staticMessages.forEach(msg => addMessageToDOM(msg));
        messageFeed.scrollTop = messageFeed.scrollHeight;
    }
}

function sendMessage() {
    const text = chatTextarea.value.trim();
    if (!text) return;

    stompClient.publish({
        destination: "/app/hello",
        body: JSON.stringify({ 'message': text }),
    });

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msg = {
        sender: CURRENT_USER,
        avatar: CURRENT_USER_AVATAR,
        text: text,
        time: time,
        isBot: false
    };

    addMessageToDOM(msg);
    chatTextarea.value = '';
    chatTextarea.style.height = '80px';
    messageFeed.scrollTop = messageFeed.scrollHeight;
}

function addMessageToDOM(msg) {
    if (!messageFeed) return;
    const div = document.createElement('div');
    div.className = 'message-group';
    div.innerHTML = `
        <div class="msg-avatar" style="background: ${msg.isBot ? '#1164A3' : '#4A154B'}">${msg.avatar}</div>
        <div class="msg-content">
            <div class="msg-meta">
                <span class="msg-sender">${msg.sender}</span>
                <span class="msg-time">${msg.time}</span>
            </div>
            <div class="msg-text">${msg.text}</div>
        </div>
    `;
    messageFeed.appendChild(div);
}

function setupChannelListeners() {
    const list = document.getElementById('channelList');
    if (list) {
        list.addEventListener('click', (e) => {
            const item = e.target.closest('.channel-item');
            if (item) loadChannel(item.dataset.id);
        });
    }
}

function setupDirectMessageListeners() {
    const dmList = document.querySelector('.dm-list');
    if (dmList) {
        dmList.addEventListener('click', (e) => {
            const item = e.target.closest('.channel-item');
            if (item) {
                const userName = item.dataset.id;
                const userId = item.dataset.userId;
                loadDirectMessage(userName, userId);
            }
        });
    }
}

function loadDirectMessage(userName, userId) {
    console.log('Loading DM with:', userName, userId);

    // Update active DM in localStorage
    localStorage.setItem('activeDMUser', userName);
    localStorage.setItem('activeDMUserId', userId);

    // Update UI - mark as active
    document.querySelectorAll('.dm-list .channel-item').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.id === userName) el.classList.add('active');
    });

    // Update chat header
    if (chatHeaderTitle) {
        chatHeaderTitle.innerHTML = `${userName}`;
    }

    // Clear message feed for DM
    if (messageFeed) {
        messageFeed.innerHTML = '';
        messageFeed.scrollTop = messageFeed.scrollHeight;
    }

    console.log('DM loaded:', userName);
}

function setupCollapsibleSections() {
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('collapsed');
        });
    });
}