// Bot Logic for SummitFit Adventures

const chatWindow = document.getElementById('chat-window');
const chatControls = document.querySelector('.chat-controls');

// Initial Options (HTML string with onclick handlers)
const initialOptionsHTML = `
    <div class="chat-options">
        <button class="btn-option" onclick="selectLevel(1, '1 - Beginner (Chill)')">1 - Beginner (Chill)</button>
        <button class="btn-option" onclick="selectLevel(3, '3 - Intermediate (Active)')">3 - Intermediate (Active)</button>
        <button class="btn-option" onclick="selectLevel(5, '5 - Advanced (Athlete)')">5 - Advanced (Athlete)</button>
    </div>
`;

// FORCE INITIALIZE: Overwrite the static HTML to ensure onclicks are active
chatControls.innerHTML = initialOptionsHTML;

// -----------------------------------
// Global Window Functions (for inline onclicks)
// -----------------------------------

window.selectLevel = function(level, text) {
    handleUserSelection(level, text);
};

window.resetBot = function() {
    // Clear chat window except the first greeting? 
    // Or just append a divider. Let's just append.
    
    // Restore initial options
    chatControls.innerHTML = initialOptionsHTML;
    
    // Helper to scroll
    scrollToBottom();
};

function handleUserSelection(level, text) {
    // 1. User Message
    addMessage(text, 'user-msg');

    // 2. Clear controls to prevent double clicking
    chatControls.innerHTML = ''; 

    // 3. Bot "Thinking"
    addTypingIndicator();

    // 4. Artificial Delay
    setTimeout(() => {
        removeTypingIndicator();
        
        // 5. Filter Routes
        // Ensure routes.js is loaded. If not, fallback.
        const safeFindRoutes = (typeof findRoutes === 'function') ? findRoutes : () => [];
        const recommendations = safeFindRoutes(level);
        
        if (recommendations.length > 0) {
            addMessage(`Great choice. Based on your fitness level (${level}/5), here are the best adventures for you:`, 'bot-msg');
            
            recommendations.forEach(route => {
                addRouteCard(route);
            });

            addMessage("Select a route to book, or start over to check other levels.", 'bot-msg');
        } else {
            addMessage("I don't have a specific route for that exact level right now, but we can customize one.", 'bot-msg');
        }

        // 6. Add "Back" / Reset Button
        addBackButton();

    }, 600);
}

// -----------------------------------
// UI Helper Functions
// -----------------------------------

function addMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', className);
    msgDiv.innerHTML = `<p>${text}</p>`;
    // Insert before the controls area
    chatWindow.insertBefore(msgDiv, chatControls.parentElement.querySelector('.chat-controls'));
    scrollToBottom();
}

function addRouteCard(route) {
    const card = document.createElement('div');
    card.classList.add('chat-message', 'bot-msg', 'route-result');
    card.style.borderLeft = "4px solid #e67e22";
    card.style.backgroundColor = "#fff";
    card.style.color = "#333";
    
    // Price formatting check
    const priceDisplay = (typeof route.logistics.price === 'number') ? `R${route.logistics.price} pp` : route.logistics.price;

    card.innerHTML = `
        <h4 style="color:#2c3e50; margin-bottom:5px;">${route.name}</h4>
        <p style="font-size:0.9rem; color:#666;">📍 ${route.location}</p>
        <div style="display:flex; gap:10px; margin:10px 0; font-size:0.85rem; font-weight:bold;">
            <span>⏱ ${route.specs.duration}</span>
            <span>⛰ ${route.specs.elevation}</span>
        </div>
        <p style="font-size:0.9rem;">${route.specs.terrain}</p>
        <div style="margin-top:10px; font-weight:bold; color:#e67e22;">
            ${priceDisplay}
        </div>
        <button onclick="bookRoute('${route.id}')" class="btn-primary" style="margin-top:10px; width:100%; font-size:0.8rem;">Book This Adventure</button>
    `;
    
    chatWindow.insertBefore(card, chatControls.parentElement.querySelector('.chat-controls'));
    scrollToBottom();
}

function addBackButton() {
    chatControls.innerHTML = `
        <div class="chat-options">
            <button class="btn-option" onclick="resetBot()" style="border-color:#ccc; color:#666;">← Start Over</button>
        </div>
    `;
    scrollToBottom();
}

function addTypingIndicator() {
    const typing = document.createElement('div');
    typing.id = 'typing-indicator';
    typing.classList.add('chat-message', 'bot-msg');
    typing.innerHTML = '<p><em>Thinking...</em></p>';
    chatWindow.insertBefore(typing, chatControls.parentElement.querySelector('.chat-controls'));
    scrollToBottom();
}

function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if(typing) typing.remove();
}

function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

window.bookRoute = function(routeId) {
    const route = routes.find(r => r.id === routeId);
    if (!route) return;
    const msg = `Hi Ernest, I'm interested in booking the ${route.name}.`;
    const whatsappUrl = `https://wa.me/27825654084?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
}
