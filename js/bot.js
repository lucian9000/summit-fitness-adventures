// Bot Logic for SummitFit Adventures

const chatWindow = document.getElementById('chat-window');
const chatControls = document.querySelector('.chat-controls');

// Initial State: Waiting for Fitness Level
const optionsLevel = document.querySelectorAll('.btn-option');

optionsLevel.forEach(button => {
    button.addEventListener('click', (e) => {
        const level = parseInt(e.target.dataset.level || 1); // Add data-level to html buttons later, or infer from text
        // For now, inferring from text content for simplicity if attributes aren't there yet
        let selectedLevel = 1;
        if(e.target.textContent.includes('3')) selectedLevel = 3;
        if(e.target.textContent.includes('5')) selectedLevel = 5;

        handleUserSelection(selectedLevel, e.target.textContent);
    });
});

function handleUserSelection(level, text) {
    // 1. User Message (Visual echo of what they clicked)
    addMessage(text, 'user-msg');

    // 2. Remove old controls
    chatControls.innerHTML = ''; 

    // 3. Bot "Thinking"
    addTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();
        // 4. Filter Routes
        const recommendations = findRoutes(level);
        
        if (recommendations.length > 0) {
            addMessage(`Great choice. Based on your fitness level (${level}/5), here are the best adventures for you:`, 'bot-msg');
            
            // 5. Display Cards
            recommendations.forEach(route => {
                addRouteCard(route);
            });

            // 6. Final Call to Action
            addMessage("Select a route to see full details or book.", 'bot-msg');
        } else {
            addMessage("I couldn't find a specific route for that level right now, but Ernest can customize a trip for you.", 'bot-msg');
            addCustomButton("Contact Ernest for Custom Trip");
        }

    }, 800); // 800ms delay for realism
}

// UI Helper Functions
function addMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', className);
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatWindow.insertBefore(msgDiv, chatControls.parentElement.querySelector('.chat-controls')); // Insert before controls
    
    // Auto scroll
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addRouteCard(route) {
    const card = document.createElement('div');
    card.classList.add('chat-message', 'bot-msg', 'route-result');
    card.style.borderLeft = "4px solid #e67e22";
    card.style.backgroundColor = "#fff";
    card.style.color = "#333";
    
    card.innerHTML = `
        <h4 style="color:#2c3e50; margin-bottom:5px;">${route.name}</h4>
        <p style="font-size:0.9rem; color:#666;">📍 ${route.location}</p>
        <div style="display:flex; gap:10px; margin:10px 0; font-size:0.85rem; font-weight:bold;">
            <span>⏱ ${route.specs.duration}</span>
            <span>⛰ ${route.specs.elevation}</span>
        </div>
        <p style="font-size:0.9rem;">${route.specs.terrain}</p>
        <div style="margin-top:10px; font-weight:bold; color:#e67e22;">
            R${route.logistics.price} pp
        </div>
        <button onclick="bookRoute('${route.id}')" class="btn-primary" style="margin-top:10px; width:100%; font-size:0.8rem;">Book This Adventure</button>
    `;
    
    chatWindow.insertBefore(card, chatControls.parentElement.querySelector('.chat-controls'));
}

function addTypingIndicator() {
    const typing = document.createElement('div');
    typing.id = 'typing-indicator';
    typing.classList.add('chat-message', 'bot-msg');
    typing.innerHTML = '<p><em>Thinking...</em></p>';
    chatWindow.insertBefore(typing, chatControls.parentElement.querySelector('.chat-controls'));
}

function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if(typing) typing.remove();
}

function bookRoute(routeId) {
    // For now, just alert or redirect to WhatsApp
    const route = routes.find(r => r.id === routeId);
    const msg = `Hi Ernest, I'm interested in booking the ${route.name}.`;
    const whatsappUrl = `https://wa.me/27825654084?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
}
