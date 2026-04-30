// Загрузка сообщений из localStorage
let messages = [];

function loadMessages() {
    const saved = localStorage.getItem('github_messenger');
    if (saved) {
        try {
            messages = JSON.parse(saved);
        } catch(e) { messages = []; }
    }
    renderMessages();
}

function saveMessages() {
    localStorage.setItem('github_messenger', JSON.stringify(messages));
}

function renderMessages() {
    const container = document.getElementById('messages');
    if (!container) return;
    
    container.innerHTML = '';
    
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.isOwn ? 'message-own' : 'message-other'}`;
        
        const time = new Date(msg.timestamp);
        const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-name">${escapeHtml(msg.name)}</div>
            <div class="message-bubble">${escapeHtml(msg.text)}</div>
            <div class="message-time">${timeStr}</div>
        `;
        
        container.appendChild(messageDiv);
    });
    
    container.scrollTop = container.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addMessage(name, text, isOwn = false) {
    if (!text.trim()) return false;
    
    const message = {
        id: Date.now(),
        name: name.trim() || 'Аноним',
        text: text.trim(),
        timestamp: Date.now(),
        isOwn: isOwn
    };
    
    messages.push(message);
    
    if (messages.length > 200) {
        messages = messages.slice(-200);
    }
    
    saveMessages();
    renderMessages();
    return true;
}

function sendMessage() {
    const nameInput = document.getElementById('nameInput');
    const messageInput = document.getElementById('messageInput');
    
    const name = nameInput.value || 'Гость';
    const text = messageInput.value;
    
    if (addMessage(name, text, true)) {
        messageInput.value = '';
        messageInput.focus();
    }
}

function clearChat() {
    if (confirm('Удалить всю историю сообщений?')) {
        messages = [];
        saveMessages();
        renderMessages();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    const clearBtn = document.getElementById('clearBtn');
    
    sendBtn.addEventListener('click', sendMessage);
    clearBtn.addEventListener('click', clearChat);
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
