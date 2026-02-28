// js/store.js - Simple Data Store

const DEFAULT_DATA = {
    activeWorkspace: null,
    activeChannel: 'general',
    workspaces: {}
};

const Store = {
    get: () => {
        const saved = localStorage.getItem('collabSpaceData');
        return saved ? JSON.parse(saved) : DEFAULT_DATA;
    },

    save: (data) => {
        localStorage.setItem('collabSpaceData', JSON.stringify(data));
    },

    getState: () => Store.get(),

    getCurrentWorkspace: () => {
        const data = Store.get();
        if (!data.activeWorkspace || !data.workspaces[data.activeWorkspace]) return null;
        return data.workspaces[data.activeWorkspace];
    },

    setWorkspaces: (workspacesArray) => {
        const data = Store.get();
        data.workspaces = {};
        data.activeWorkspace = null;

        workspacesArray.forEach(ws => {
            const id = String(ws.workspaceId);
            data.workspaces[id] = {
                id: id,
                name: ws.workspaceName,
                role: ws.userRole,
                channels: [],
                messages: {},
                members: []
            };

            if (!data.activeWorkspace) {
                data.activeWorkspace = id;
            }
        });

        Store.save(data);
    },

    setActiveWorkspace: (id) => {
        const data = Store.get();
        data.activeWorkspace = String(id);
        const ws = data.workspaces[data.activeWorkspace];
        if (ws && ws.channels.length > 0) {
            data.activeChannel = ws.channels[0].name;
        }
        Store.save(data);
    },

    setActiveChannel: (name) => {
        const data = Store.get();
        data.activeChannel = name;
        Store.save(data);
    },

    addMessage: (channel, msg) => {
        const data = Store.get();
        const ws = data.workspaces[data.activeWorkspace];
        if (!ws.messages[channel]) ws.messages[channel] = [];
        ws.messages[channel].push(msg);
        Store.save(data);
    },

    setChannels: (channels) => {
        const data = Store.get();
        const ws = data.workspaces[data.activeWorkspace];
        if (!ws) return;

        console.log('API Channels received:', JSON.stringify(channels, null, 2));
        if (channels.length > 0) {
            console.log('First channel RAW:', channels[0]);
        }

        ws.channels = channels.map(ch => ({
            name: ch.channelName,
            isPrivate: ch.private,
            id: ch.channelId
        }));
        console.log('Channels stored in Store:', ws.channels);

        ws.messages = {};
        ws.channels.forEach(ch => {
            ws.messages[ch.name] = [];
        });

        if (ws.channels.length > 0) {
            data.activeChannel = ws.channels[0].name;
        }

        Store.save(data);
    },

    setMembers: (members) => {
        const data = Store.get();
        const ws = data.workspaces[data.activeWorkspace];
        if (!ws) return;

        // Backend returns WorkspaceMemberDto with fields:
        // userId, userName, userEmail, isActive (serialized as "active")
        ws.members = members.map(m => ({
            id: m.userId,
            name: m.userName,
            email: m.userEmail,
            isActive: m.active
        }));

        Store.save(data);
    },

    addChannel: (name, isPrivate) => {
        const data = Store.get();
        const ws = data.workspaces[data.activeWorkspace];
        if (!ws.channels.some(c => c.name === name)) {
            ws.channels.push({ name, isPrivate });
            ws.messages[name] = [];
            Store.save(data);
        }
    }
};