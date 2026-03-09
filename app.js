const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatOutput = document.getElementById('chat-output');

const startMenu = document.getElementById('startMenu');
const startBtn = document.querySelector('.start-btn');
const timeDisplay = document.querySelector('.time-display');

const aiWindow = document.getElementById('widget-1');
const windowHeader = document.querySelector('.window-header');
const windowContent = document.querySelector('.window-content');
const btnClose = document.querySelector('.btn-close');
const btnMin = document.querySelector('.btn-min');
const btnMax = document.querySelector('.btn-max');
let isMaximized = false;
let preMaxStyles = { width: '', height: '', top: '', left: '' };

function updateClock() {
    if (!timeDisplay) return; 
    
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    timeDisplay.textContent = `${hours}:${minutes} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

window.toggleStartMenu = function() {
    if (startMenu.style.display === 'flex') {
        startMenu.style.display = 'none';
    } else {
        startMenu.style.display = 'flex';
    }
};

document.addEventListener('click', function(event) {
    if (startMenu && startBtn) {
        if (startMenu.style.display === 'flex' && !startBtn.contains(event.target) && !startMenu.contains(event.target)) {
            startMenu.style.display = 'none';
        }
    }
});

if (btnClose && aiWindow) {
    btnClose.addEventListener('click', () => {
        aiWindow.style.display = 'none';
    });
}

if (btnMin && windowContent) {
    btnMin.addEventListener('click', () => {
        windowContent.style.display = windowContent.style.display === 'none' ? 'block' : 'none';
    });
}

let isDragging = false;
let mouseOffsetX = 0;
let mouseOffsetY = 0;

if (windowHeader && aiWindow) {
    windowHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        mouseOffsetX = e.clientX - aiWindow.offsetLeft;
        mouseOffsetY = e.clientY - aiWindow.offsetTop;
        document.body.style.userSelect = 'none'; 
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        aiWindow.style.left = `${e.clientX - mouseOffsetX}px`;
        aiWindow.style.top = `${e.clientY - mouseOffsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
    });
}

async function sendMessage() {
    const text = chatInput.value.trim(); 
    if (!text) return; 

    chatOutput.innerHTML += `<div class="msg-user"><strong>You:</strong> ${text}</div>`;
    chatInput.value = ''; 
    chatOutput.scrollTop = chatOutput.scrollHeight;

    try {
        const response = await fetch('https://nikels.app.n8n.cloud/webhook-test/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }) 
        });

        const data = await response.json();

        chatOutput.innerHTML += `<div class="msg-ai"><strong>AI:</strong> ${data.respuesta}</div>`;
        chatOutput.scrollTop = chatOutput.scrollHeight;

    } catch (error) {
        console.error("Error del servidor:", error);
        chatOutput.innerHTML += `<div class="msg-error"><strong>Error:</strong> Connection lost.</div>`;
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
}

if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

if (btnMax && aiWindow) {
    btnMax.addEventListener('click', () => {
        if (!isMaximized) {
            preMaxStyles.width = aiWindow.style.width || 'auto';
            preMaxStyles.height = aiWindow.style.height || 'auto';
            preMaxStyles.top = aiWindow.style.top || '50px';
            preMaxStyles.left = aiWindow.style.left || '50px';

            aiWindow.style.width = '100%';
            aiWindow.style.height = 'calc(100vh - 40px)'; 
            aiWindow.style.top = '0';
            aiWindow.style.left = '0';
            isMaximized = true;
        } else {
            aiWindow.style.width = preMaxStyles.width;
            aiWindow.style.height = preMaxStyles.height;
            aiWindow.style.top = preMaxStyles.top;
            aiWindow.style.left = preMaxStyles.left;
            isMaximized = false;
        }
    });
}

window.openAIWindow = function() {
    const aiWindow = document.getElementById('widget-1');
    const startMenu = document.getElementById('startMenu');
    
    if (aiWindow) {
        aiWindow.style.display = 'flex'; 
    }
    
    if (startMenu) {
        startMenu.style.display = 'none';
    }
};

window.shutdownSystem = function() {
    window.close();
    
    document.body.innerHTML = `
        <div style="background-color: black; height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; color: #ffae00; font-family: 'Segoe UI', Tahoma, sans-serif;">
            <h2 style="text-align: center; font-weight: normal;">It is now safe to turn off your computer.<br><br><span style="font-size: 16px; color: white;">You may close this tab.</span></h2>
        </div>
    `;
};

function startBackgroundMusic() {
    const audio = document.getElementById('bg-music');
    
    if (audio && audio.paused) {
        audio.play().then(() => {
            audio.volume = 0.4;
            console.log("Ambient music initiated");
        }).catch(error => {
            console.log("The browser is blocking the audio:", error);
        });
    }
    
    document.body.removeEventListener('click', startBackgroundMusic);
}

document.body.addEventListener('click', startBackgroundMusic, { once: true });

window.toggleMusic = function() {
    const audio = document.getElementById('bg-music');
    if (!audio) return;

    if (audio.paused) {
        audio.play();
        audio.volume = 0.4;
    } else {
        audio.pause();
    }
};