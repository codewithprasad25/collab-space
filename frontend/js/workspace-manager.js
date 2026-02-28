// js/workspace-manager.js - Simple Workspace Switching

async function switchWorkspaceUI(id) {
    Store.setActiveWorkspace(id);
    // Save active workspace to localStorage
    localStorage.setItem('activeWorkspaceId', String(id));

    // Fetch channels and members for the new workspace
    const userEmail = localStorage.getItem('currentUser');
    const channels = await API.fetchChannels(Number(id), userEmail);
    Store.setChannels(channels);

    const members = await API.fetchWorkspaceMembers(Number(id), userEmail);
    Store.setMembers(members);

    const data = Store.getState();
    const ws = data.workspaces[id];

    document.querySelectorAll('.rail-item[data-workspace]').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.workspace === id) el.classList.add('active');
    });

    const titleEl = document.getElementById('workspaceTitle');
    if (titleEl && ws) {
        titleEl.innerHTML = `${ws.name} <i class="fa-solid fa-chevron-down"></i>`;
    }

    renderSidebar(data);
    renderDirectMessages(data);
    setupChannelListeners();
    if (ws && ws.channels.length > 0) {
        loadChannel(ws.channels[0].name);
    } else if (ws && ws.channels.length === 0) {
        // Auto-open create channel modal if no channels in this workspace
        setTimeout(() => {
            document.getElementById('channelModal').classList.add('open');
            document.getElementById('newChannelName').focus();
        }, 300);
    }

    // Reinitialize modal buttons after DOM changes
    reinitializeChannelModalButtons();
    reinitializeInviteMemberModalButtons();
}

function initWorkspaceListeners() {
    document.querySelectorAll('.rail-item[data-workspace]').forEach(el => {
        el.addEventListener('click', () => {
            switchWorkspaceUI(el.dataset.workspace);
        });
    });
}