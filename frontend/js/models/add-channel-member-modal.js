// js/modals/add-channel-member-modal.js - Add member to channel modal

let selectedMember = null;

function initAddChannelMemberModal() {
    const modal = document.getElementById('addChannelMemberModal');
    const form = document.getElementById('addChannelMemberForm');
    const searchInput = document.getElementById('memberSearchInput');
    const resultsDiv = document.getElementById('memberSearchResults');
    const addBtn = document.querySelector('.add-channel-member-btn');

    if (!modal || !form) return;

    // Open Modal
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.classList.add('open');
            searchInput.focus();
            resultsDiv.innerHTML = '';
            selectedMember = null;
        });
    }

    // Close Modal
    modal.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('open');
            selectedMember = null;
        });
    });

    // Search members
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const data = Store.getState();
        const ws = data.workspaces[data.activeWorkspace];

        if (!ws || !ws.members) {
            resultsDiv.innerHTML = '';
            return;
        }

        resultsDiv.innerHTML = '';

        if (searchTerm.length < 1) {
            resultsDiv.innerHTML = '<p style="padding: 1rem; color: #999; text-align: center;">Start typing to search...</p>';
            return;
        }

        const filtered = ws.members.filter(member =>
            member.name.toLowerCase().includes(searchTerm) ||
            (member.email && member.email.toLowerCase().includes(searchTerm))
        );

        if (filtered.length === 0) {
            resultsDiv.innerHTML = '<p style="padding: 1rem; color: #999; text-align: center;">No members found</p>';
            return;
        }

        filtered.forEach(member => {
            const item = document.createElement('div');
            item.className = `member-item ${selectedMember?.id === member.id ? 'member-item-selected' : ''}`;
            item.innerHTML = `
                <div class="member-info">
                    <span class="member-name">${member.name}</span>
                    <span class="member-email">ID: ${member.id}</span>
                </div>
                <input type="radio" name="selectedMember" value="${member.id}" ${selectedMember?.id === member.id ? 'checked' : ''}>
            `;
            resultsDiv.appendChild(item);

            item.addEventListener('click', () => {
                selectMember(member, item);
            });
        });
    });

    // Form submit - Add member to channel
    form.addEventListener('submit', async(e) => {
        e.preventDefault();

        if (!selectedMember) {
            alert('Please select a member');
            return;
        }

        await addMemberToChannel(selectedMember);
    });

    // Close Modal on Outside Click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
            selectedMember = null;
        }
    });
}

function selectMember(member, itemElement) {
    // Deselect previous
    document.querySelectorAll('.member-item-selected').forEach(el => {
        el.classList.remove('member-item-selected');
        el.querySelector('input[type="radio"]').checked = false;
    });

    // Select new
    selectedMember = member;
    itemElement.classList.add('member-item-selected');
    itemElement.querySelector('input[type="radio"]').checked = true;
}

async function addMemberToChannel(member) {
    const userEmail = localStorage.getItem('currentUser');
    const data = Store.getState();
    const workspaceId = Number(data.activeWorkspace);
    const channelName = data.activeChannel;
    const channel = data.workspaces[data.activeWorkspace].channels.find(ch => ch.name === channelName);

    if (!channel || !channel.id) {
        alert('Channel ID not found');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/channel/add/channel/member/${userEmail}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                workspaceId,
                channelId: channel.id,
                memberId: member.id
            })
        });
        const text = await response.text();

        if (response.ok) {
            alert(`${member.name} added to #${channelName}`);
            document.getElementById('addChannelMemberModal').classList.remove('open');
            document.getElementById('memberSearchInput').value = '';
            document.getElementById('memberSearchResults').innerHTML = '';
            selectedMember = null;
        } else {
            alert(text || 'Failed to add member');
        }
    } catch (error) {
        console.error('Error adding member to channel:', error);
        alert('Failed to add member');
    }
}