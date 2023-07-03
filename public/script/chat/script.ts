// Send a new message to the server
const inputField = document.getElementById('input-field') as HTMLInputElement;
const messagesContainer = document.getElementById('messages') as HTMLDivElement;
const inputContainer = document.getElementById(
    'input-container'
) as HTMLElement;

// Toggle sidebar visibility when hamburger menu is clicked
const hamburgerMenu = document.getElementById('hamburger-menu') as HTMLElement;
const sidebar = document.querySelector('.sidebar') as HTMLElement;

if (hamburgerMenu && sidebar) {
    hamburgerMenu.addEventListener('click', () => {
        sidebar.style.display =
            sidebar.style.display === 'none' ? 'flex' : 'none';
    });
}

async function showNotification(title: string, body: string) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted' && document.visibilityState === 'hidden') {
        const options = {
            body,
            icon: '../image/icon/icon.png',
        };
        const notification = new Notification(title, options);
    } else {
        return;
    }
}

const adjustInputHeight = () => {
    let lines = inputField.value.split('\n').length;
    if (lines > 30) {
        lines = 30;
    } else if (lines <= 3) {
        lines = 3;
    }

    const scrollableHeight =
        messagesContainer.scrollHeight - messagesContainer.clientHeight;
    const isScrolledToBottom =
        Math.abs(messagesContainer.scrollTop - scrollableHeight) <= 1;

    inputField.style.height = `${lines}ch`;

    adjustMessagesHeight(isScrolledToBottom);
};

const adjustMessagesHeight = (isScrolledToBottom: Boolean) => {
    const inputHeight = window.getComputedStyle(inputContainer).height;
    const inputHeightInCh =
        parseFloat(inputHeight) /
        parseFloat(getComputedStyle(document.documentElement).fontSize);
    console.log('Input height: ', inputHeightInCh);
    const paddingBottom = `${inputHeightInCh}ch`;

    //messagesContainer.style.paddingBottom = paddingBottom;

    console.log(isScrolledToBottom, messagesContainer.scrollTop);
    if (isScrolledToBottom) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
};

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

const addMessage = async (message: any) => {
    console.log('Running addMessage() ', message);
    const messagesContainer = document.getElementById(
        'messages'
    ) as HTMLDivElement;
    console.log(messagesContainer);

    if (Array.isArray(message)) {
        for (const item of message) {
            console.log('Item: ', item);
            await formatMessage(item);
        }
    } else {
        console.log('Item: ', message);
        await formatMessage(message);
    }
};

const formatMessage = async (message: any) => {
    try {
        console.log('Formatting: ', message);

        const messageString = message.message;
        const username = message.username;
        const sent_on = message.sent_on;

        const messageText = await wrapCodeInTags(messageString);

        console.log(messageText);

        const format = navigator.language === 'ja' ? 'ja-JP' : 'en-NZ';
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
        };

        const formatter = new Intl.DateTimeFormat(format, options);
        const formattedSentOn = formatter
            .format(new Date(sent_on))
            .replace(',', '.');

        const isJapanese = format === 'ja-JP' && username === 'Anonymous';
        const formattedUsername = isJapanese ? '名無し' : username;

        const formattedMessageText = messageText.replace(
            /((?:>>\d+)|(?:https?:\/\/[^\s]+))/g,
            (match: any) => {
                if (match.startsWith('>>')) {
                    return `<a href="#${match.slice(
                        2
                    )}" class="jump">${match}</a>`;
                } else {
                    return `<a href="${match}" target="_blank">${match}</a>`;
                }
            }
        );

        const messagesContainer = document.getElementById(
            'messages'
        ) as HTMLDivElement;
        const pCount = messagesContainer.getElementsByTagName('p').length + 1;
        const formattedHtml = `${pCount} ${formattedUsername}: ${formattedSentOn}<br /><pre class="messageText">${formattedMessageText}</pre>`;

        const p = document.createElement('p');

        p.innerHTML = formattedHtml;

        p.id = pCount.toString();
        p.dataset.server = message.id;

        console.log(p);

        try {
            // Check if message contains a link
            const linkRegex = /(https?:\/\/[^\s]+)/g;
            const linkMatches = messageText.match(linkRegex);
            if (linkMatches) {
                const linkUrl = linkMatches[0];

                const imageRegex = /\.(gif|jpe?g|png)(\?.*)?$/i;
                const isImage = imageRegex.test(linkUrl);

                if (isImage) {
                    // Create image element
                    const imageElement = document.createElement(
                        'img'
                    ) as HTMLImageElement;
                    imageElement.src = linkUrl;
                    imageElement.style.display = 'block';
                    imageElement.style.marginTop = '10px';

                    // Append image element to p element
                    p.appendChild(imageElement);
                } else {
                    // Fetch the metadata of the link
                    const response = await fetch(linkUrl);
                    const html = await response.text();

                    // Parse the metadata from the HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    const meta_title = doc.querySelector(
                        'meta[property="og:title"]'
                    );
                    const meta_description = doc.querySelector(
                        'meta[property="og:description"]'
                    );
                    const meta_image = doc.querySelector(
                        'meta[property="og:image"]'
                    );

                    let title, description, imageUrl;

                    if (meta_title) {
                        title = meta_title.getAttribute('content');
                    } else {
                        title = doc
                            .querySelector('meta[name="description"]')
                            ?.getAttribute('content');
                    }

                    if (meta_description) {
                        description = meta_description.getAttribute('content');
                    } else {
                        description = doc
                            .querySelector('meta[name="description"]')
                            ?.getAttribute('content');
                    }

                    if (meta_image) {
                        imageUrl = meta_image.getAttribute('content');
                    } else {
                        imageUrl = '';
                    }

                    const linkElement = document.createElement('a');
                    linkElement.href = linkUrl;
                    linkElement.target = '_blank';
                    linkElement.classList.add('linkEmbed');

                    // Create a preview element
                    const preview = document.createElement('div');
                    preview.classList.add('link-preview');

                    const width = Math.max(25, linkUrl.length * 0.6); // Adjust the multiplier as needed
                    const height = Math.max(23, linkUrl.length * 0.3); // Adjust the multiplier as needed
                    preview.style.width = `${width}rem`;
                    preview.style.height = `${height}rem`;

                    const messagesWidth = messagesContainer.offsetWidth;
                    const previewWidth = preview.offsetWidth;

                    if (previewWidth < messagesWidth) {
                        preview.style.width = `${messagesWidth * 0.9}px`;
                    }

                    // Create and append the title element
                    const titleElement = document.createElement('h3');
                    titleElement.textContent = title || linkUrl;
                    preview.appendChild(titleElement);

                    const fontSize = 0.8; // Adjust the font size as needed

                    // Create and append the description element
                    const descriptionElement = document.createElement('p');
                    descriptionElement.textContent = description || '';
                    descriptionElement.style.overflow = 'hidden';
                    descriptionElement.style.fontSize = `${fontSize}em`;

                    /* Split the text content of the description element by line breaks and count the number of lines
                    const lineHeight = parseFloat(
                        getComputedStyle(descriptionElement).lineHeight
                    );*/

                    // Calculate the line height and maximum height of the description element
                    //descriptionElement.style.lineHeight = lineHeight + 'px';

                    preview.appendChild(descriptionElement);

                    // Create and append the image element
                    if (imageUrl) {
                        const imageElement = document.createElement('img');
                        imageElement.src = imageUrl;

                        const messagesWidth = messagesContainer.offsetWidth;
                        const imageWidth = imageElement.offsetWidth;

                        if (imageWidth < messagesWidth) {
                            imageElement.style.width = `${
                                messagesWidth * 0.9
                            }px`;
                        }
                        //preview.appendChild(imageElement);
                    } else {
                        preview.classList.add('noIMG');
                    }

                    // Append the preview element to the link element
                    linkElement.appendChild(preview);

                    // Append the link element to the p element
                    p.appendChild(linkElement);
                }
            }
        } catch (error) {
            console.error('Error parsing link:', error);
        }

        console.log(p);

        const isAtBottom =
            messagesContainer.scrollTop + messagesContainer.clientHeight ===
            messagesContainer.scrollHeight;

        messagesContainer.appendChild(p);

        if (isAtBottom) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    } catch (error) {
        console.error('Error formatting message:', error);
    }
};

async function wrapCodeInTags(text: string): Promise<string> {
    const codeRegex = /^```([\s\S]*)```$/;
    const match = text.match(codeRegex);

    if (match) {
        const codeContent = match[1];
        const wrappedCode = `<code>${codeContent}</code>`;
        return wrappedCode;
    }

    return text;
}

const deleteMessage = (messageId: number) => {
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            method: 'deleteMessage',
            message_id: messageId,
            server_id: 'WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2',
        }),
    })
        .then((response) => {
            console.log(response); // log the response
            const messageElement = document.getElementById(
                messageId.toString()
            );
            if (messageElement) {
                messageElement.remove();
            }
        })
        .catch((error) => {
            console.error('Error deleting message:', error);
        });
};

inputField.addEventListener('input', () => {
    localStorage.setItem('input', inputField.value);
    adjustInputHeight();
});
