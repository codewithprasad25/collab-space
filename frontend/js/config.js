const stompClient = new StompJs.Client({
    webSocketFactory: () => {
        const currentHost = window.location.hostname;
        const wsUrl = currentHost === '127.0.0.1' || currentHost === '::1' 
            ? 'http://127.0.0.1:8080/gs-guide-websocket'
            : `http://${currentHost}:8080/gs-guide-websocket`;
        console.log('WebSocket URL (config):', wsUrl);
        return new SockJS(wsUrl);
    }
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/message', (greeting) => {
        let data = greeting.body;
        showGreeting(JSON.parse(greeting.body).message);
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    } else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.publish({
        destination: "/app/hello",
        body: JSON.stringify({ 'message': $("#name").val() })
    });
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function() {
    $("form").on('submit', (e) => e.preventDefault());
    $("#connect").click(() => connect());
    $("#disconnect").click(() => disconnect());
    $("#send").click(() => sendName());
});