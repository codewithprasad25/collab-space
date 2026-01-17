function sendMessage() {
    const input = document.getElementById("msgInput");
    if (!input.value) return;

    const msg = document.createElement("p");
    msg.innerHTML = "<b>You:</b> " + input.value;

    document.getElementById("messages").appendChild(msg);
    input.value = "";
}