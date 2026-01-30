// 전역 변수
let userMessages = [];
let assistantMessages = [];
let userInfo = '';

// 탭 전환
function showTab(tabId) {
    // 모든 탭 콘텐츠 숨기기
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // 모든 탭 버튼 비활성화
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // 선택한 탭 활성화
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');

    // 페이지 최상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 로딩 표시
function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// 채팅 시작
function startChat() {
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    
    if (age === '') {
        alert('나이를 입력해주세요.');
        return;
    }
    if (gender === '') {
        alert('성별을 선택해주세요.');
        return;
    }
    
    userInfo = `age:${age},gender:${gender}`;

    document.querySelector('.input-form').style.display = 'none';
    document.getElementById('chatInterface').style.display = 'block';
}

// 메시지 추가 함수
function addMessage(content, isUser = false) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    
    if (isUser) {
        messageDiv.classList.add('user-message');
        messageDiv.innerHTML = `
            <div class="message-avatar"></div>
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
    } else {
        messageDiv.classList.add('assistant-message');
        messageDiv.innerHTML = `
            <div class="message-avatar">🐕</div>
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
    }
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 메시지 전송
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message === '') {
        return;
    }

    // 사용자 메시지 추가
    addMessage(message, true);
    userMessages.push(message);
    messageInput.value = '';

    // 로딩 표시
    showLoader();

    try {
        const response = await fetch('http://localhost:3000/fortuneTell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userInfo: userInfo,
                userMessages: userMessages,
                assistantMessages: assistantMessages,
            })
        });

        const data = await response.json();
        
        // 로딩 숨기기
        hideLoader();
        
        // 어시스턴트 메시지 추가
        assistantMessages.push(data.assistant);
        addMessage(data.assistant, false);
        
    } catch (error) {
        hideLoader();
        console.error('Error:', error);
        addMessage('죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.', false);
    }
}

// Enter 키로 메시지 전송
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}
