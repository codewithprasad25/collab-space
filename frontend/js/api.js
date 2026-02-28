// js/api.js - API Service

const API_BASE_URL = 'http://localhost:8080';

const API = {
    fetchUserWorkspaces: async(userEmail) => {
        try {
            const response = await fetch(`${API_BASE_URL}/fetch/users/workspace/${userEmail}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch workspaces:', error);
            return [];
        }
    },

    createWorkspace: async(workspaceName, loggedInEmail) => {
        try {
            const response = await fetch(`${API_BASE_URL}/create/workspace/${workspaceName}?loggedInEmail=${encodeURIComponent(loggedInEmail)}`, {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/json' })
            });
            const text = await response.text();
            if (!response.ok) {
                console.error('Failed to create workspace:', text);
                return { ok: false, message: text };
            }
            return { ok: true, message: text };
        } catch (error) {
            console.error('Failed to create workspace:', error);
            return { ok: false, message: error.message };
        }
    },

    addChannel: async(userEmail, workspaceId, channelName, isPrivate) => {
        try {
            const response = await fetch(`${API_BASE_URL}/channel/create/${userEmail}`, {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    workspaceId,
                    channelName,
                    isPrivate: isPrivate.toString()
                })
            });
            const text = await response.text();
            if (!response.ok) {
                console.error('Failed to create channel:', text);
                return { ok: false, message: text };
            }
            return { ok: true, message: text };
        } catch (error) {
            console.error('Failed to add channel:', error);
            return { ok: false, message: error.message };
        }
    },

    inviteMember: async(workspaceId, adminEmail, userEmail, userRole) => {
        try {
            const response = await fetch(`${API_BASE_URL}/invite/workspace/${workspaceId}`, {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ adminEmail, userEmail, userRole })
            });
            const result = await response.text();
            if (response.status == 400) throw new Error(`${result}`);
            return result;
        } catch (error) {
            alert(error.message);
            return null;
        }
    },

    fetchChannels: async(workspaceId, userEmail) => {
        try {
            console.log('Fetching channels for:', { workspaceId, userEmail });
            const response = await fetch(`${API_BASE_URL}/channel/fetch/users/channels`, {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ workspaceId, userEmail })
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            console.log('Raw API response:', JSON.stringify(data, null, 2));
            return data;
        } catch (error) {
            console.error('Failed to fetch channels:', error);
            return [];
        }
    },

    fetchWorkspaceMembers: async(workspaceId, userEmail) => {
        try {
            const response = await fetch(`${API_BASE_URL}/fetch/workspace/members`, {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ workspaceId, userEmail })
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch workspace members:', error);
            return [];
        }
    }
};