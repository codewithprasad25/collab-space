// js/modals/channel-modal.js - Channel creation modal

let _channelModalInitialized = false;

function reinitializeChannelModalButtons() {
    const modal = document.getElementById('channelModal');
    const channelNameInput = document.getElementById('newChannelName');

    if (!modal || !channelNameInput) return;

    document.querySelectorAll('.add-channel-icon').forEach(btn => {
        if (!btn._addChannelListenerAdded) {
            btn.addEventListener('click', (e) => {
                console.log('Add channel button clicked');
                e.preventDefault();
                e.stopPropagation();
                modal.classList.add('open');
                channelNameInput.focus();
            });
            btn._addChannelListenerAdded = true;
        }
    });
}

function initChannelModal() {
    if (_channelModalInitialized) return;
    _channelModalInitialized = true;

    const modal = document.getElementById('channelModal');
    const createChannelForm = document.getElementById('createChannelForm');
    const channelNameInput = document.getElementById('newChannelName');
    const radioCards = document.querySelectorAll('.radio-card');

    console.log('initChannelModal called');

    if (!modal || !createChannelForm) {
        console.error('Channel modal or form not found');
        return;
    }

    // Initial button setup
    reinitializeChannelModalButtons();

    // Handle Radio Card Selection (Visual)
    radioCards.forEach(card => {
        card.addEventListener('click', () => {
            radioCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            const radio = card.querySelector('input');
            const prefixSpan = document.getElementById('modalPrefixDisplay');
            if (radio.checked && prefixSpan) {
                prefixSpan.innerHTML = radio.value === 'private' ?
                    '<i class="fa-solid fa-lock" style="font-size: 0.8rem"></i>' :
                    '#';
            }
        });
    });

    // Open Modal using event delegation on document
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-channel-icon');
        if (btn) {
            console.log('Add channel button clicked via delegation');
            e.preventDefault();
            e.stopPropagation();
            modal.classList.add('open');
            channelNameInput.focus();
        }
    });

    // Setup button click handler - attach to buttons that exist
    function setupAddChannelButton() {
        document.querySelectorAll('.add-channel-icon').forEach(btn => {
            if (!btn._addChannelListenerAdded) {
                btn.addEventListener('click', (e) => {
                    console.log('Add channel button clicked via direct listener');
                    e.preventDefault();
                    e.stopPropagation();
                    modal.classList.add('open');
                    channelNameInput.focus();
                });
                btn._addChannelListenerAdded = true;
            }
        });
    }

    setupAddChannelButton();

    // Close Modal
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => modal.classList.remove('open'));
    });

    // Create Channel Submit
    createChannelForm.addEventListener('submit', async(e) => {
        e.preventDefault();
        let name = channelNameInput.value.trim().toLowerCase().replace(/\s+/g, '-');

        const visibilityInput = document.querySelector('input[name="channelVisibility"]:checked');
        const isPrivate = visibilityInput ? (visibilityInput.value === 'private') : false;

        if (name) {
            const userEmail = localStorage.getItem('currentUser');
            const data = Store.getState();
            const workspaceId = Number(data.activeWorkspace);

            const result = await API.addChannel(userEmail, workspaceId, name, isPrivate);
            if (result.ok) {
                Store.addChannel(name, isPrivate);
                renderSidebar(data);
                loadChannel(name);

                modal.classList.remove('open');
                createChannelForm.reset();

                radioCards.forEach(c => c.classList.remove('selected'));
                if (radioCards[0]) radioCards[0].classList.add('selected');
                if (document.getElementById('modalPrefixDisplay'))
                    document.getElementById('modalPrefixDisplay').innerText = '#';

                alert(result.message || `Channel "#${name}" created successfully!`);
            } else {
                alert(result.message || 'Failed to create channel. Please try again.');
            }
        }
    });
}