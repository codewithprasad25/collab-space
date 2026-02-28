// js/app.js - Main App Entry

const initApp = async() => {

    console.log('initApp started');
    const userEmail = localStorage.getItem('currentUser');
    if (!userEmail) return;

    const workspaces = await API.fetchUserWorkspaces(userEmail) || [];
    // If there are no workspaces we still want to continue initialization
    Store.setWorkspaces(workspaces);

    // If user has no workspaces we will open the create-ws modal later after all
    // of the event listeners have been installed.  The actual open call lives near
    // the bottom of this function.
    if (workspaces.length === 0) {
        console.log('No workspaces found; will auto-open modal once initialization is complete');
    }

    // Restore previous active workspace if it exists, otherwise keep whatever was
    // chosen when Store.setWorkspaces() ran (defaults to first workspace).
    const savedWorkspaceId = localStorage.getItem('activeWorkspaceId');
    if (savedWorkspaceId && workspaces.find(ws => String(ws.workspaceId) === savedWorkspaceId)) {
        Store.setActiveWorkspace(savedWorkspaceId);
    }

    buildWorkspaceRail();

    let data = Store.getState();
    let ws = data.workspaces[data.activeWorkspace];

    if (ws) {
        // Fetch channels for active workspace
        const channels = await API.fetchChannels(Number(data.activeWorkspace), userEmail);
        Store.setChannels(channels);

        // Fetch members for active workspace
        const members = await API.fetchWorkspaceMembers(Number(data.activeWorkspace), userEmail);
        Store.setMembers(members);

        // Refresh data after setting channels and members
        data = Store.getState();
        ws = data.workspaces[data.activeWorkspace];
    } else {
        console.warn('No active workspace is set, skipping channel/member fetch');
    }

    const feed = document.getElementById('messageFeed');
    const textarea = document.querySelector('.input-wrapper textarea');
    const btn = document.querySelector('.send-btn');
    const title = document.querySelector('.chat-header h3');

    // Ensure elements exist before initializing messaging
    if (feed && textarea && btn && title) {
        initMessaging(feed, textarea, btn, title);
    } else {
        console.warn('Some messaging elements not found:', { feed, textarea, btn, title });
    }

    const titleEl = document.getElementById('workspaceTitle');
    if (titleEl && ws) {
        titleEl.innerHTML = `${ws.name} <i class="fa-solid fa-chevron-down"></i>`;
    }

    initWorkspaceListeners();
    renderSidebar(data);
    renderDirectMessages(data);
    setupChannelListeners();
    setupDirectMessageListeners();
    setupCollapsibleSections();

    console.log('About to initialize modals');
    initWorkspaceModal();
    console.log('Workspace modal initialized');
    initChannelModal();
    console.log('Channel modal initialized');
    reinitializeChannelModalButtons();
    console.log('Channel modal buttons reinitialized');
    initInviteMemberModal();
    console.log('Invite member modal initialized');
    initAddChannelMemberModal();
    console.log('Add channel member modal initialized');

    // Auto-open create workspace modal if there are no workspaces (new user)
    if (workspaces.length === 0) {
        setTimeout(() => {
            const modal = document.getElementById('workspaceModal');
            const input = document.getElementById('newWorkspaceName');
            if (modal) modal.classList.add('open');
            if (input) input.focus();
        }, 300);
    }

    // Auto-open create channel modal if no channels exist
    if (ws && ws.channels && ws.channels.length === 0) {
        setTimeout(() => {
            const cm = document.getElementById('channelModal');
            const input = document.getElementById('newChannelName');
            if (cm) cm.classList.add('open');
            if (input) input.focus();
        }, 500);
    }

    if (ws) {
        loadChannel(data.activeChannel);
    }
};

const buildWorkspaceRail = () => {
    const rail = document.getElementById('workspaceRail');
    rail.innerHTML = '';

    const data = Store.getState();
    console.log('Building workspace rail with workspaces:', Object.keys(data.workspaces));

    Object.values(data.workspaces).forEach(ws => {
        const item = document.createElement('div');
        item.className = 'rail-item';
        if (ws.id === data.activeWorkspace) item.classList.add('active');
        item.dataset.workspace = ws.id;
        item.innerHTML = `<span class="ws-initials">${getInitials(ws.name)}</span>`;
        item.title = ws.name;
        rail.appendChild(item);
    });

    // Recreate the add-ws button
    const addBtn = document.createElement('div');
    addBtn.className = 'rail-item add-ws';
    addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
    addBtn.title = 'Create workspace';
    addBtn._addWsListenerAdded = false; // Reset flag
    rail.appendChild(addBtn);

    // Add refresh button
    const refreshBtn = document.createElement('div');
    refreshBtn.className = 'rail-item refresh-btn';
    refreshBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
    refreshBtn.title = 'Refresh workspaces';
    refreshBtn.addEventListener('click', async(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Refresh button clicked');
        refreshBtn.style.opacity = '0.5';
        refreshBtn.style.pointerEvents = 'none';
        await refreshWorkspacesUI();
        refreshBtn.style.opacity = '1';
        refreshBtn.style.pointerEvents = 'auto';
    });
    rail.appendChild(refreshBtn);
};

const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const refreshWorkspacesUI = async() => {
    const userEmail = localStorage.getItem('currentUser');
    if (!userEmail) {
        console.error('No user email found in localStorage');
        return;
    }

    try {
        console.log('Starting workspace refresh for:', userEmail);

        // Fetch fresh workspace list with retry logic
        let workspaces = await API.fetchUserWorkspaces(userEmail);
        console.log('Fetched workspaces (attempt 1):', JSON.stringify(workspaces, null, 2));

        // If no workspaces returned, wait a moment and retry
        // (backend might need time to process workspace creation)
        if (!workspaces || workspaces.length === 0) {
            console.log('No workspaces found, waiting 1s and retrying...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            workspaces = await API.fetchUserWorkspaces(userEmail);
            console.log('Fetched workspaces (attempt 2):', JSON.stringify(workspaces, null, 2));
        }

        if (!workspaces || workspaces.length === 0) {
            console.warn('⚠️ No workspaces returned from API after retry');
            console.warn('This means the backend endpoint is not returning workspaces for:', userEmail);
            alert('No workspaces found. Check browser console for details.');
            return;
        }

        console.log('✓ Workspaces found:', workspaces.length);

        Store.setWorkspaces(workspaces);
        console.log('Workspaces saved to Store');

        // Rebuild the rail
        buildWorkspaceRail();
        console.log('Workspace rail rebuilt');

        // Reinitialize listeners on the new rail items
        initWorkspaceListeners();
        console.log('Workspace listeners reinitialized');
        reinitializeWorkspaceModalButtons();
        console.log('Workspace modal buttons reinitialized');

        // Load channels/members for active workspace
        const data = Store.getState();
        console.log('Active workspace:', data.activeWorkspace);

        if (data.activeWorkspace && data.workspaces[data.activeWorkspace]) {
            const channels = await API.fetchChannels(Number(data.activeWorkspace), userEmail);
            Store.setChannels(channels);
            console.log('Channels loaded');

            const members = await API.fetchWorkspaceMembers(Number(data.activeWorkspace), userEmail);
            Store.setMembers(members);
            console.log('Members loaded');

            // Update UI
            const freshData = Store.getState();
            renderSidebar(freshData);
            renderDirectMessages(freshData);
            setupChannelListeners();
            console.log('UI updated');

            const titleEl = document.getElementById('workspaceTitle');
            const ws = freshData.workspaces[freshData.activeWorkspace];
            if (titleEl && ws) {
                titleEl.innerHTML = `${ws.name} <i class="fa-solid fa-chevron-down"></i>`;
            }
        } else {
            console.warn('No active workspace or workspace not found in store');
        }

        console.log('✓ Workspaces refreshed successfully');
    } catch (error) {
        console.error('Error refreshing workspaces:', error);
        alert('Error refreshing workspaces. Check console for details.');
    }
};

document.addEventListener('DOMContentLoaded', initApp);

// Debug helper - Add to window for console access
window.debugWorkspaces = async() => {
    const userEmail = localStorage.getItem('currentUser');
    console.log('=== DEBUGGING WORKSPACES ===');
    console.log('Current user email:', userEmail);

    if (!userEmail) {
        console.error('❌ No user email in localStorage');
        return;
    }

    console.log('\n--- Testing API.fetchUserWorkspaces ---');
    const workspaces = await API.fetchUserWorkspaces(userEmail);
    console.log('Raw API response:', JSON.stringify(workspaces, null, 2));
    console.log('Number of workspaces:', workspaces ? workspaces.length : 0);

    const storeState = Store.getState();
    console.log('\n--- Store state ---');
    console.log('Store workspaces:', Object.keys(storeState.workspaces).length, 'total');
    console.log('Store active workspace:', storeState.activeWorkspace);

    if (workspaces && workspaces.length > 0) {
        console.log('\n--- Workspace Details ---');
        workspaces.forEach((ws, idx) => {
            console.log(`Workspace ${idx + 1}:`, {
                workspaceId: ws.workspaceId,
                workspaceName: ws.workspaceName,
                userRole: ws.userRole,
                createdBy: ws.createdBy
            });
        });
        console.log('✓ Workspaces are being returned from backend');
    } else {
        console.warn('⚠️ No workspaces returned from API');
        console.log('\n--- Checking Backend Directly ---');

        try {
            const currentHost = window.location.hostname;
            const apiUrl = currentHost === '127.0.0.1' || currentHost === '::1' ?
                'http://127.0.0.1:8080' :
                `http://${currentHost}:8080`;
            const endpoint = `${apiUrl}/fetch/users/workspace/${encodeURIComponent(userEmail)}`;
            const response = await fetch(endpoint);
            const data = await response.json();
            console.log('Direct backend response:', JSON.stringify(data, null, 2));
            console.log('HTTP Status:', response.status);
        } catch (err) {
            console.error('Error calling backend directly:', err);
        }
    }
};

window.testAPICall = async() => {
    const userEmail = localStorage.getItem('currentUser');
    console.log('\n=== DIRECT API TEST ===');

    if (!userEmail) {
        console.error('❌ No user email found');
        return null;
    }

    const currentHost = window.location.hostname;
    const apiUrl = currentHost === '127.0.0.1' || currentHost === '::1' ?
        'http://127.0.0.1:8080' :
        `http://${currentHost}:8080`;
    const endpoint = `${apiUrl}/fetch/users/workspace/${encodeURIComponent(userEmail)}`;

    console.log('Testing endpoint:', endpoint);

    try {
        const response = await fetch(endpoint);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response body:', JSON.stringify(data, null, 2));
        if (data && Array.isArray(data)) {
            console.log('✓ API returned', data.length, 'workspaces');
        }
        return data;
    } catch (err) {
        console.error('❌ Error:', err);
        return null;
    }
};

// Test backend connectivity
window.testBackend = async() => {
    const currentHost = window.location.hostname;
    const apiUrl = currentHost === '127.0.0.1' || currentHost === '::1' ?
        'http://127.0.0.1:8080' :
        `http://${currentHost}:8080`;

    console.log('\n=== TESTING BACKEND CONNECTIVITY ===');
    console.log('Backend URL:', apiUrl);
    console.log('Frontend URL:', window.location.href);
    console.log('\nAttempting to connect...\n');

    try {
        const endpoint = `${apiUrl}/fetch/users/workspace/test@example.com`;
        const response = await fetch(endpoint, {
            method: 'GET',
            timeout: 5000
        });
        console.log('✓ Backend is REACHABLE');
        console.log('Response status:', response.status);
        console.log('Response headers:', {
            'Content-Type': response.headers.get('Content-Type'),
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin')
        });

        try {
            const data = await response.json();
            console.log('Response body:', JSON.stringify(data, null, 2));
        } catch (e) {
            const text = await response.text();
            console.log('Response body (text):', text);
        }

        return true;
    } catch (error) {
        console.error('❌ Backend is NOT REACHABLE');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        console.error('\nPossible causes:');
        console.error('1. Backend server is not running on', apiUrl);
        console.error('2. Backend is on a different port');
        console.error('3. CORS is not enabled on the backend');
        console.error('4. Network connectivity issue');
        console.error('\nFix: Make sure your Spring Boot backend is running and listening on port 8080');
        return false;
    }
};

// Show current API base URL
window.showAPIConfig = () => {
    const currentHost = window.location.hostname;
    const apiUrl = currentHost === '127.0.0.1' || currentHost === '::1' ?
        'http://127.0.0.1:8080' :
        `http://${currentHost}:8080`;

    console.log('\n=== API CONFIGURATION ===');
    console.log('API_BASE_URL:', apiUrl);
    console.log('Frontend running at:', window.location.href);
    console.log('Frontend host:', currentHost);
    console.log('\nThe API URL is automatically determined based on frontend host');
};