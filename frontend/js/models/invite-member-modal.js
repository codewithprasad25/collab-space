// js/modals/invite-member-modal.js - Invite member modal

let _inviteMemberModalInitialized = false;

function reinitializeInviteMemberModalButtons() {
    const inviteMemberModal = document.getElementById('inviteMemberModal');
    const memberEmailInput = document.getElementById('memberEmail');

    if (!inviteMemberModal || !memberEmailInput) return;

    document.querySelectorAll('.invite-member-btn').forEach(btn => {
        if (!btn._inviteListenerAdded) {
            btn.addEventListener('click', (e) => {
                console.log('Invite member button clicked');
                e.preventDefault();
                e.stopPropagation();
                inviteMemberModal.classList.add('open');
                memberEmailInput.focus();
            });
            btn._inviteListenerAdded = true;
        }
    });
}

function initInviteMemberModal() {
    if (_inviteMemberModalInitialized) return;
    _inviteMemberModalInitialized = true;

    const inviteMemberModal = document.getElementById('inviteMemberModal');
    const inviteMemberForm = document.getElementById('inviteMemberForm');
    const memberEmailInput = document.getElementById('memberEmail');
    const inviteMemberBtn = document.getElementById('inviteMemberBtn');
    const inviteMemberBtn_trigger = document.querySelector('.invite-member-btn');
    const roleOptions = document.querySelectorAll('.role-option');

    console.log('initInviteMemberModal called');

    if (!inviteMemberModal || !inviteMemberForm) {
        console.error('Invite member modal or form not found');
        return;
    }

    // Initial button setup
    reinitializeInviteMemberModalButtons();

    // Close Modal
    inviteMemberModal.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            inviteMemberModal.classList.remove('open');
        });
    });

    // Handle Role Selection UI
    roleOptions.forEach(option => {
        option.addEventListener('click', () => {
            roleOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            option.querySelector('input[type="radio"]').checked = true;
        });
    });

    // Handle Form Submit
    inviteMemberForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        const userEmail = memberEmailInput.value.trim();
        let userRole = document.querySelector('input[name="memberRole"]:checked').value;
        // Convert to capitalized format for API: member -> Member, admin -> Admin
        userRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);

        if (userEmail) {
            inviteMemberBtn.disabled = true;
            inviteMemberBtn.textContent = 'Inviting...';

            try {
                const adminEmail = localStorage.getItem('currentUser');
                const data = Store.getState();
                const workspaceId = Number(data.activeWorkspace);

                const result = await API.inviteMember(workspaceId, adminEmail, userEmail, userRole);
                if (result) {
                    inviteMemberModal.classList.remove('open');
                    inviteMemberForm.reset();

                    roleOptions.forEach(o => o.classList.remove('selected'));
                    if (roleOptions[0]) roleOptions[0].classList.add('selected');

                    alert(`Invite sent to ${userEmail} as ${userRole}!`);
                } else {
                    console.error('Invite member failed with no result');
                }
            } catch (error) {
                console.error('Error inviting member:', error);
                alert('Failed to invite member. Please try again.');
            } finally {
                inviteMemberBtn.disabled = false;
                inviteMemberBtn.textContent = 'Invite';
            }
        }
    });

    // Close Modal on Outside Click
    inviteMemberModal.addEventListener('click', (e) => {
        if (e.target === inviteMemberModal) {
            inviteMemberModal.classList.remove('open');
        }
    });
}