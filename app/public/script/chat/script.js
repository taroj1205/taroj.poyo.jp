"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Send a new message to the server
const sendButton = document.getElementById('send-button');
const inputField = document.getElementById('input-field');
const messagesContainer = document.getElementById('messages');
// Toggle sidebar visibility when hamburger menu is clicked
const hamburgerMenu = document.getElementById('hamburger-menu');
const sidebar = document.querySelector('.sidebar');
if (hamburgerMenu && sidebar) {
    hamburgerMenu.addEventListener('click', () => {
        sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
    });
}
window.addEventListener('load', () => {
    const hamburger = document.querySelector('#hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && window.innerWidth >= 720) {
        sidebar.style.display = 'block';
    }
    if (hamburger && window.innerWidth <= 720) {
        hamburger.style.display = 'block';
    }
});
function showNotification(title, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const permission = yield Notification.requestPermission();
        if (permission === 'granted' && document.visibilityState === 'hidden') {
            const options = {
                body,
                icon: '../image/icon/icon.png',
            };
            const notification = new Notification(title, options);
        }
        else {
            localStorage.setItem('notificationPermission', permission);
        }
    });
}
messagesContainer.addEventListener('scroll', () => {
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
        const messages = messagesContainer.querySelectorAll('p');
        let lastVisibleMessage = null;
        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            const rect = message.getBoundingClientRect();
            if (rect.bottom <= window.innerHeight) {
                lastVisibleMessage = message;
                break;
            }
        }
        if (lastVisibleMessage) {
            localStorage.setItem('scrollPos', lastVisibleMessage.id);
        }
    }
});
window.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const permission = localStorage.getItem('notificationPermission');
    if (permission !== 'granted') {
        yield showNotification('', '');
    }
    const input = localStorage.getItem('input');
    if (input) {
        inputField.value = input;
        adjustInputHeight();
    }
}));
const addMessage = (message) => {
    console.debug(message);
    const messagesContainer = document.getElementById('messages');
    messagesContainer === null || messagesContainer === void 0 ? void 0 : messagesContainer.appendChild(formatMessage(message));
};
const formatMessage = (message) => {
    const p = document.createElement('p');
    let messageText = message.message;
    let username = message.username;
    let format = navigator.language;
    format = format === 'ja' ? 'ja-JP' : 'en-NZ';
    const sent_on = new Date(message.sent_on).toLocaleString(format, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZoneName: 'short'
    }).replace(',', '.');
    if (format === 'ja-JP' && username === 'Anonymous') {
        username = '名無し';
    }
    if (messageText.includes('>>')) {
        messageText = messageText.replace(/>>(\d+)/g, '<a href="#$1">>>$1</a>');
    }
    p.innerHTML = `${message.id} ${username}: ${sent_on}<br /><span >${messageText}</span>`;
    p.id = message.id;
    return p;
};
inputField.addEventListener('input', () => {
    localStorage.setItem("input", inputField.value);
    adjustInputHeight();
});
const adjustInputHeight = () => {
    let lines = inputField.value.split('\n').length;
    if (lines > 30) {
        lines = 30;
    }
    else if (lines <= 2) {
        lines = 2;
    }
    inputField.style.height = `${lines}ch`;
};
