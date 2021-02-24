const chatEl = document.getElementById('chat');
const chatButton = document.getElementById('chatImgContainer');
const chatCount = document.getElementById('chatCount');
const refreshRateOpen = timeOutTime;
const refreshRateClose = 15 * 1000;
let refreshRate = refreshRateClose;
let closeButton;
let chatMessagesDiv;
let chatHtml;
let scrollBarY;
let chatInput;
let sendIcon;
let chatVersion = 0;
let isChatOpen;
let interval;

// init chat


document.addEventListener('DOMContentLoaded', function () {
    chatHtml = document.createElement('html');
    chatHtml.innerHTML = html;
    chatEl.appendChild(chatHtml);
    getElements();
    initChatStyle();
    initEventListeners();
    getAndUpdateCurrentVersion();
    refreshMessagesInterval();
})

async function refreshMessagesInterval() {
    setInterval(receiveMessages, refreshRateClose);
}

function getElements() {
    closeButton = document.getElementById('closeChat');
    chatMessagesDiv = document.getElementById('messages-container');
    chatInput = document.getElementById('chat-input');
    sendIcon = document.getElementById('msgSendIcon');
}

function initChatStyle() {
    chatEl.style.position = "fixed";
    chatEl.style.right = "8vh";
    chatEl.style.bottom = "8vh";
    chatEl.style.width = "35vh";
    chatEl.style.zIndex = "1000";
}

// event handlers

function initEventListeners() {
    chatButton.addEventListener('click', toggleChat);
    closeButton.addEventListener('click', toggleChat);
    chatInput.addEventListener('keyup', (e) => enterSendEventHandler(e));
    sendIcon.addEventListener('click', (e) => clickSendEventHandler(e));
    chatInput.addEventListener('mouseenter', () => chatInput.focus())
    document.querySelector('.content').addEventListener('click', closeChat);
    document.querySelector('.sidebar').addEventListener('click', closeChat);
    document.querySelector('.navbar').addEventListener('click', closeChat);
}

function enterSendEventHandler(e) {
    if (e.code === "Enter" && chatInput.value.length > 0) {
        createSelfMessage(chatInput.value);
        sendMessageToServer(chatInput.value);
        chatInput.value = "";
        chatInput.focus();
    }
}

function clickSendEventHandler() {
    if (chatInput.value.length > 0) {
        createSelfMessage(chatInput.value);
        sendMessageToServer(chatInput.value);
        chatInput.value = "";
        chatInput.focus();
    }
}

function toggleChat() {
    if (chatEl.style.display === "block") {
        chatEl.style.display = "none";
        isChatOpen = false;
        clearInterval(interval);
    } else {
        receiveMessages();
        chatEl.style.display = "block";
        isChatOpen = true;
        chatCount.innerText = "0";
        interval = setInterval(receiveMessages, refreshRateOpen);
    }
}

function closeChat() {
    if (chatEl.style.display === "block") {
        chatEl.style.display = "none";
        isChatOpen = false;
        clearInterval(interval);
    }
}


const html = "<div id=\"chat-container\" class=\"pull-right fixed-bottom container offset-md-6 col-11 col-md-5\">\n" +
    "    <div id=\"chat-header\" class=\"row\">\n" +
    "        <div class=\"col-12 alert alert-primary\">\n" +
    "            Chat\n" +
    "            <a id='closeChat' style='cursor: pointer'><i style='color: white' class='fa fa-close pull-right'></i></a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div id=\"chat-body\" class=\"row\">\n" +
    "        <div id=\"messages-container\" class=\"col-12\">\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div id=\"chat-footer\" class=\"row\">\n" +
    "        <div class=\"col-10 col-md-11\">\n" +
    "            <input id=\"chat-input\" type=\"text\" class=\"text-input\"\n" +
    "                   placeholder=\"Enter A Message...\">\n" +
    "        </div>\n" +
    "        <div class=\"col-2 col-md-1\">\n" +
    "            <i class=\"fa fa-envelope-o\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>";


function createMessage(text, sender) {
    let html = "<div class=\"row chatMsgContainer\">\n" +
        "           <div class=\"col-10 chatMsg\">\n" +
        "                   <span class='msgTitle'>" + sender + ":<br></span>" + text +
        "           </div>\n" +
        "       </div>";

    let div = document.createElement('div');
    div.innerHTML = html;
    chatMessagesDiv.appendChild(div);
    div.scrollIntoView()
}

function createSelfMessage(text) {
    let html = "<div class=\"row chatMsgContainer\">\n" +
        "          <div class=\"col-2\"></div>\n" +
        "          <div class=\"col-10 chatMsg chatMsgSelf\">\n" +
        "              <span class='msgTitle'>You:<br></span>\n" +
        "              " + text + "\n" +
        "          </div>\n" +
        "      </div>";

    let div = document.createElement('div');
    div.innerHTML = html;
    chatMessagesDiv.appendChild(div);
    div.scrollIntoView()
}


// Server will return the new char version AFTER sending the message.
function sendMessageToServer(text) {
    let data = JSON.stringify({
        message: text
    });

    fetch('/chat/send', {
        method: 'post',
        body: data,
        headers: getPostHeaders()
    }).then(async function (response) {
        let json = await response.json()
        if (json.isSuccess) {
            chatVersion = json.data;
        } else {
            showError("Couldn't send the message due to an unknown error");
        }
    });
}

// Receive any chat message that been created after the current chat version.
function receiveMessages() {
    let data = JSON.stringify({
        version: chatVersion.toString()
    });

    fetch('/chat/receive', {
        method: 'post',
        body: data,
        headers: getPostHeaders()
    }).then(async function (response) {
        let json = await response.json();
        if (json.isSuccess) {
            json.data.messages.forEach(function (msg) {
                if (msg.isMine) {
                    createSelfMessage(msg.content);
                } else {
                    createMessage(msg.content, msg.creator);
                }
                handleLabelCount();
                chatVersion = json.data.version;
            });
        } else {
            showError("Couldn't get chat messages due to an unknown error");
        }
    });
}

function handleLabelCount() {
    if (!isChatOpen) {
        let count = parseInt(chatCount.innerText);
        chatCount.innerText = (count + 1).toString();
    }
}

function getAndUpdateCurrentVersion() {
    fetch('/chat/receive', {
        method: 'get',
    }).then(async function (response) {
        let json = await response.json()
        if (json.isSuccess) {
            chatVersion = json.data;
        } else {
            console.log("Error getting chat version")
        }
    });
}

