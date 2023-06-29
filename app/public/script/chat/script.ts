// Send a new message to the server
const sendButton = document.getElementById('send-button') as HTMLButtonElement;
const inputField = document.getElementById('input-field') as HTMLInputElement;
const messagesContainer = document.getElementById('messages') as HTMLElement;

// Toggle sidebar visibility when hamburger menu is clicked
const hamburgerMenu = document.getElementById('hamburger-menu') as HTMLElement;
const sidebar = document.querySelector('.sidebar') as HTMLElement;

if (hamburgerMenu && sidebar) {
    hamburgerMenu.addEventListener('click', () => {
        sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
    });
}

window.addEventListener('load', () => {
    const hamburger = document.querySelector('#hamburger-menu') as HTMLElement;
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (sidebar && window.innerWidth >= 720) {
        sidebar.style.display = 'block';
    }
    if (hamburger && window.innerWidth <= 720) {
        hamburger.style.display = 'block';
    }
});

async function showNotification(title: string, body: string) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted' && document.visibilityState === 'hidden') {
        const options = {
            body,
            icon: '../image/icon/icon.png',
        };
        const notification = new Notification(title, options);
    } else {
        localStorage.setItem('notificationPermission', permission);
    }
}

messagesContainer.addEventListener('scroll', () => {
    const messagesContainer = document.getElementById('messages') as HTMLElement;
    if (messagesContainer) {
        const messages = messagesContainer.querySelectorAll('p');
        let lastVisibleMessage: HTMLElement | null = null;
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


window.addEventListener('DOMContentLoaded', async () => {
    const permission = localStorage.getItem('notificationPermission');
    if (permission !== 'granted') {
        await showNotification('', '');
    }
    const input = localStorage.getItem('input');
    if (input) {
        inputField.value = input;
        adjustInputHeight();
    }
});

const addMessage = (message: any) => {
    console.debug(message);
    const messagesContainer = document.getElementById('messages');

    messagesContainer?.appendChild(formatMessage(message));
};

const formatMessage = (message: any) => {
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
    p.innerHTML = `${message.id} ${username}: ${sent_on}<br /><span style="padding-left: 2ch;">${messageText}</span>`;
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
    } else if (lines <= 3) {
        lines = 3;
    }
    inputField.style.height = `${lines}ch`;
};