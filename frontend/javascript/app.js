document.addEventListener("DOMContentLoaded", () => {
    const msgInput = document.getElementById("msgInput");
    const sendBtn = document.getElementById("sendBtn");
    const messagesContainer = document.getElementById("messages");

    // Send message on button click
    sendBtn.addEventListener("click", sendMessage);

    // Send message on Enter key
    msgInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    // Channel navigation
    const channelItems = document.querySelectorAll(".channel-item");
    channelItems.forEach(item => {
        item.addEventListener("click", () => {
            channelItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            
            const channelName = item.textContent.trim();
            document.querySelector(".channel-name").textContent = channelName;
            msgInput.placeholder = `Message ${channelName}`;
            
            // Clear messages or load channel messages
            messagesContainer.innerHTML = `<div class="welcome-message">Welcome to ${channelName}</div>`;
        });
    });

    // DM navigation
    const dmItems = document.querySelectorAll(".dm-item");
    dmItems.forEach(item => {
        item.addEventListener("click", () => {
            dmItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            
            const dmName = item.textContent.trim();
            document.querySelector(".channel-name").textContent = dmName;
            msgInput.placeholder = `Message ${dmName}`;
            
            messagesContainer.innerHTML = `<div class="welcome-message">Direct message with ${dmName}</div>`;
        });
    });

    // Workspace dropdown toggle (placeholder)
    const workspaceDropdown = document.querySelector(".workspace-dropdown");
    if (workspaceDropdown) {
        workspaceDropdown.addEventListener("click", () => {
            alert("Workspace menu (to be implemented)");
        });
    }

    // Add workspace button (placeholder)
    const addWorkspaceBtn = document.querySelector(".add-workspace");
    if (addWorkspaceBtn) {
        addWorkspaceBtn.addEventListener("click", () => {
            alert("Add workspace feature (to be implemented)");
        });
    }

    // Invite people button
    const inviteBtn = document.querySelector(".invite-btn");
    if (inviteBtn) {
        inviteBtn.addEventListener("click", () => {
            alert("Invite people feature (to be implemented)");
        });
    }
});

function sendMessage() {
    const msgInput = document.getElementById("msgInput");
    const messagesContainer = document.getElementById("messages");
    
    const messageText = msgInput.value.trim();
    if (!messageText) return;

    // Remove welcome message if present
    const welcomeMsg = messagesContainer.querySelector(".welcome-message");
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    // Create message element
    const messageDiv = document.createElement("div");
    messageDiv.className = "message";
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-author">You</span>
            <span class="message-time">${timestamp}</span>
        </div>
        <div class="message-text">${messageText}</div>
    `;

    messagesContainer.appendChild(messageDiv);
    msgInput.value = "";
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}