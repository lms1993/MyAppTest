document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Chatbot functionality
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');

    chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        appendMessage('user', messageText);
        userInput.value = '';

        // --- Backend Communication ---
        // This is where you would send the message to your backend.
        // We'll use a mock response for now.
        getBotResponse(messageText);
    }

    function appendMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        messageElement.appendChild(paragraph);
        
        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the latest message
    }

    async function getBotResponse(userMessage) {
        const thinkingElement = document.createElement('div');
        thinkingElement.classList.add('message', 'bot-message');
        thinkingElement.innerHTML = '<p><em>상담사가 메시지를 작성 중입니다...</em></p>';
        chatLog.appendChild(thinkingElement);
        chatLog.scrollTop = chatLog.scrollHeight;
        
        try {
            // Use relative path for the API endpoint
            const response = await fetch('/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            // If the server isn't running, this will fail. We'll catch it.
            if (!response.ok) {
                // For a 204 No Content response, we can provide a default message
                // or handle it as a successful but empty response.
                if (response.status === 204) {
                    chatLog.removeChild(thinkingElement);
                    appendMessage('bot', 'No content received from server.');
                    return; 
                }
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }

            const data = await response.json();
            const botReply = data.assistant || '죄송해요, 지금은 답변을 드릴 수 없어요. 잠시 후 다시 시도해주세요.';
            
            chatLog.removeChild(thinkingElement);
            appendMessage('bot', botReply);

        } catch (error) {
            console.error('Fetch Error:', error);
            chatLog.removeChild(thinkingElement);
            appendMessage('bot', '오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    }
});
