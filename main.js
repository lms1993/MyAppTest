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
            // Replace this with your actual API endpoint
            const response = await fetch('http://localhost:3000/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            // If the server isn't running, this will fail. We'll catch it.
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            const botReply = data.reply || '죄송해요, 지금은 답변을 드릴 수 없어요. 잠시 후 다시 시도해주세요.';
            
            chatLog.removeChild(thinkingElement);
            appendMessage('bot', botReply);

        } catch (error) {
            console.error('Fetch Error:', error);
            // Mock response for testing when the server is not available
            setTimeout(() => {
                chatLog.removeChild(thinkingElement);
                const mockReplies = [
                    "그렇군요. 조금 더 자세히 이야기해주실 수 있을까요?",
                    "정말 힘드셨겠어요. 그 상황에서 어떤 감정을 느끼셨나요?",
                    "흥미로운 관점이네요. 왜 그렇게 생각하게 되셨어요?",
                    "그런 일이 있으셨군요. 마음이 많이 복잡하시겠어요."
                ];
                const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
                appendMessage('bot', randomReply);
            }, 1500);
        }
    }
});
