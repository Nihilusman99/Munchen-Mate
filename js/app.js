// --- DATA ---
const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "itinerary", label: "Itinerary", icon: "calendar_today" },
    { id: "packing", label: "Packing List", icon: "list_alt" },
    { id: "suggestions", label: "Suggestions", icon: "lightbulb" },
    { id: "translator", label: "Translator", icon: "translate" },
    { id: "transport", label: "Transport", icon: "directions_bus" },
    { id: "expenses", label: "Expenses", icon: "attach_money" }
];

const dashboardCards = [
    { id: "itinerary", title: "Dynamic Itinerary", description: "Daily plans.", icon: "📅" },
    { id: "packing", title: "Packing List", description: "What to bring for your trip.", icon: "📋" },
    { id: "suggestions", title: "Suggestions", description: "Local gems and hotspots.", icon: "💡" },
    { id: "translator", title: "Translator", description: "Translate phrases with context.", icon: "文" },
    { id: "transport", title: "Transportation", description: "Get around the city.", icon: "🚆" },
    { id: "expenses", title: "Expense Tracker", description: "Manage your trip budget.", icon: "💲" }
];

// --- GLOBAL DATA VARIABLES ---
let allAttractions = []; 

// --- FETCH DATA FUNCTION ---
async function loadData() {
    try {
        // Fetch Attractions
        const response = await fetch('data/attractions.json');
        allAttractions = await response.json();
        
        // Once loaded, populate the Suggestions Grid
        renderSuggestions(allAttractions);
        
    } catch (error) {
        console.error("Error loading JSON data:", error);
        // Fallback if fetch fails (e.g., not running on Live Server)
        alert("Could not load data. Are you using Live Server?");
    }
}

// Function to render the suggestions grid
function renderSuggestions(items) {
    const container = document.getElementById('suggestions-container');
    container.innerHTML = ''; // Clear current content

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'suggestion-card';
        div.innerHTML = `
            <div class="suggestion-img-container">
                <img src="${item.image}" alt="${item.name}" class="suggestion-img">
            </div>
            <div class="suggestion-content">
                <div class="suggestion-title">${item.name}</div>
                <div class="suggestion-desc">${item.description}</div>
                <div style="margin-top:10px; font-size:0.85rem; color:#444;">
                    <strong>📍 ${item.location}</strong> <br>
                    <span>💶 ${item.price}</span>
                </div>
                <a href="#" class="suggestion-link" style="margin-top:15px;" onclick="alert('Opening details for ${item.name}...')">
                    Explore <span class="material-icons" style="font-size: 1rem;">arrow_forward</span>
                </a>
            </div>
        `;
        container.appendChild(div);
    });
}

// --- INITIALIZATION ---
const navMenu = document.getElementById('nav-menu');
const gridContainer = document.getElementById('dashboard-grid');
const suggestionsContainer = document.getElementById('suggestions-container');

// 1. Render Sidebar
menuItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = `nav-item ${index === 0 ? 'active' : ''}`;
    // Store ID on the element for easier lookup
    li.dataset.id = item.id; 
    li.innerHTML = `<span class="material-icons">${item.icon}</span> ${item.label}`;
    li.onclick = () => navigateTo(item.id, li);
    navMenu.appendChild(li);
});

// 2. Render Dashboard Cards
dashboardCards.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
        <div class="card-title-row">
            <span class="card-icon">${card.icon}</span>
            <h3>${card.title}</h3>
        </div>
        <p>${card.description}</p>
    `;
    
    // Click logic for cards
    div.onclick = () => {
        // Find the corresponding nav item
        const targetNavItem = Array.from(navMenu.children).find(item => item.dataset.id === card.id);
        if (targetNavItem) {
            navigateTo(card.id, targetNavItem);
        } else {
            // Fallback if no specific page exists yet
              navigateTo('dashboard', navMenu.children[0]);
              alert('Feature coming soon!');
        }
    };

    gridContainer.appendChild(div);
});

// --- NAVIGATION LOGIC ---
function navigateTo(viewId, navElement) {
    // 1. Update Sidebar Active State
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if (navElement) navElement.classList.add('active');

    // 2. Hide all views
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));

    // 3. Show specific view
    const targetView = document.getElementById(`view-${viewId}`);
    
    if (targetView) {
        targetView.classList.add('active');
    } else {
        // Default to dashboard if view doesn't exist
        document.getElementById('view-dashboard').classList.add('active');
        // Optional: alert user
        if(viewId !== 'dashboard') console.log("View not implemented yet");
    }
}

// --- ITINERARY PAGE LOGIC ---
function generateItinerary() {
    const resultPanel = document.getElementById('itinerary-result');
    const durationInput = document.getElementById('trip-duration');
    const paceInput = document.getElementById('trip-pace');
    
    // 1. Get User Inputs
    const days = parseInt(durationInput.value) || 3;
    const itemsPerDay = parseInt(paceInput.value) || 3;
    
    // Get selected interests from checkboxes
    const checkedBoxes = document.querySelectorAll('.interest-check:checked');
    const selectedInterests = Array.from(checkedBoxes).map(cb => cb.value);

    // 2. Animation (UI Feedback)
    resultPanel.innerHTML = `<div class="placeholder-text" style="color:var(--accent-teal)">Crafting your journey...</div>`;

    // 3. The Logic Engine (Wait 500ms to feel like it's thinking)
    setTimeout(() => {
        // A. Filter the global 'allAttractions' list
        let filteredList = allAttractions.filter(place => {
            // If no interests selected, return everything (or just "must_see")
            if (selectedInterests.length === 0) return true;
            
            // Check if the place has ANY of the selected interest tags
            // We map "art" input to tags like "art", "museum", "gallery"
            const placeTags = place.tags.join(" "); // e.g., "museum indoor history"
            
            // Simple keyword matching
            return selectedInterests.some(interest => {
                if (interest === 'art') return placeTags.includes('art') || placeTags.includes('museum');
                if (interest === 'history') return placeTags.includes('history') || placeTags.includes('royal');
                if (interest === 'food') return placeTags.includes('food') || placeTags.includes('beer');
                if (interest === 'outdoor') return placeTags.includes('outdoor') || placeTags.includes('park');
                if (interest === 'shopping') return placeTags.includes('shopping') || placeTags.includes('market');
                return placeTags.includes(interest);
            });
        });

        // Fallback: If filter is too strict and returns nothing, show Must Sees
        if (filteredList.length === 0) {
            filteredList = allAttractions.filter(p => p.tags.includes('must_see'));
        }

        // B. Shuffle the list to make it "dynamic" (Randomize order)
        filteredList.sort(() => Math.random() - 0.5);

        // C. Build the HTML Output
        let htmlContent = `<div style="text-align:left; width: 100%; overflow-y: auto; max-height: 100%;">
                           <h2 style="font-family: 'VT323'; color: var(--accent-teal); margin-bottom:20px;">Your ${days}-Day Plan</h2>`;

        let itemIndex = 0;

        for (let i = 1; i <= days; i++) {
            htmlContent += `<div style="margin-bottom: 25px; border-left: 3px solid var(--accent-teal); padding-left: 15px;">
                            <h3 style="margin-bottom: 10px; color: #333;">Day ${i}</h3>`;
            
            // Add items for this day based on Pace
            let itemsToday = 0;
            while (itemsToday < itemsPerDay && itemIndex < filteredList.length) {
                const place = filteredList[itemIndex];
                
                htmlContent += `
                    <div style="margin-bottom: 8px;">
                        <strong>${place.name}</strong> 
                        <span style="font-size: 0.85rem; color: #666;">(${place.category})</span>
                    </div>`;
                
                itemIndex++;
                itemsToday++;
            }

            // If we ran out of items early
            if (itemsToday === 0) {
                htmlContent += `<p style="font-style:italic; color:#888;">Relax and explore the city streets!</p>`;
            }

            htmlContent += `</div>`;
        }

        htmlContent += `</div>`;
        resultPanel.innerHTML = htmlContent;

    }, 600);
}

// --- PACKING LIST LOGIC ---
async function generatePackingList() {
    const resultPanel = document.getElementById('packing-result');
    
    // 1. Get Inputs
    const days = parseInt(document.getElementById('pack-days').value) || 3;
    const temp = parseInt(document.getElementById('pack-temp').value);
    const isRaining = document.getElementById('pack-rain').checked;
    const isSunny = document.getElementById('pack-sun').checked;
    
    // Get Style
    const styleInput = document.querySelector('input[name="style"]:checked');
    const userStyle = styleInput ? styleInput.value : 'casual';

    // UI Feedback
    resultPanel.innerHTML = `<div class="placeholder-text" style="color:var(--accent-teal)">Calculating thermal layers...</div>`;

    try {
        // 2. Fetch Data
        const response = await fetch('data/clothing.json');
        const clothesBank = await response.json();

        // 3. Filter Logic
        const myList = clothesBank.filter(item => {
            // A. Temp Filter
            const tempMatch = temp >= item.min_temp && temp <= item.max_temp;
            
            // B. Condition Filter (Rain/Sun)
            // If item has a condition (e.g. "rain"), ONLY show if user checked rain.
            // If item has NO condition, it's always valid (unless filtered by temp).
            let conditionMatch = true;
            if (item.condition === 'rain' && !isRaining) conditionMatch = false;
            if (item.condition === 'sun' && !isSunny) conditionMatch = false;

            // C. Style Filter
            // If item is "formal" but user is "casual", hide it. 
            let styleMatch = true;
            if (item.style === 'formal' && userStyle !== 'formal') styleMatch = false;

            return tempMatch && conditionMatch && styleMatch;
        });

        // 4. Group by Category & Calculate Quantities
        // We use a "Map" to group items (Clothes, Electronics, etc.)
        const categories = {};

        myList.forEach(item => {
            if (!categories[item.category]) categories[item.category] = [];
            
            // Quantity Math
            let qty = 1;
            if (item.rule === '1_per_day') qty = days;
            if (item.rule === '1_per_2_days') qty = Math.ceil(days / 2);
            if (item.rule === '1_per_3_days') qty = Math.ceil(days / 3);
            
            // Create the display string (e.g., "7x Underwear")
            const displayString = (item.rule !== 'fixed') ? `${qty}x ${item.item}` : item.item;
            
            categories[item.category].push(displayString);
        });

        // 5. Render HTML
        setTimeout(() => {
            let html = `<div style="text-align:left; width: 100%; overflow-y: auto; max-height: 100%;">
                        <h2 style="font-family: 'VT323'; color: var(--accent-teal);">Packing for ${days} Days</h2>
                        <p style="font-size:0.9rem; color:#666; margin-bottom:20px;">Weather: ${temp}°C</p>`;

            // Loop through our groups and print them
            for (const [cat, items] of Object.entries(categories)) {
                html += `<h3 style="color:#333; border-bottom:1px solid #eee; padding-bottom:5px; margin-top:15px;">${cat}</h3>
                         <ul style="margin-left: 20px; margin-top:10px;">`;
                
                items.forEach(i => {
                    html += `<li style="margin-bottom:5px;">${i}</li>`;
                });

                html += `</ul>`;
            }

            html += `</div>`;
            resultPanel.innerHTML = html;
        }, 600);

    } catch (error) {
        console.error(error);
        resultPanel.innerHTML = "Error loading clothing data.";
    }
}

// --- TRANSLATOR LOGIC ---
async function generateTranslation() {
    const inputField = document.getElementById('translator-input');
    const resultPanel = document.getElementById('translator-result');
    const query = inputField.value.toLowerCase().trim();
    
    if (!query) {
        resultPanel.innerHTML = `<div class="placeholder-text">Type a word like "Beer", "Train", or "Hola"...</div>`;
        return;
    }

    try {
        // 1. Fetch Data
        const response = await fetch('data/phrases.json');
        const phrases = await response.json();

        // 2. Filter Logic (Search Engine)
        const results = phrases.filter(item => {
            // Search inside English OR Spanish fields
            return item.en.toLowerCase().includes(query) || 
                   item.es.toLowerCase().includes(query) ||
                   item.category.toLowerCase().includes(query);
        });

        // 3. Render Results
        if (results.length === 0) {
            resultPanel.innerHTML = `<div class="placeholder-text" style="font-size:1.2rem;">No phrases found for "${query}". <br>Try "Food", "Hello", or "Water".</div>`;
            return;
        }

        let html = `<div style="text-align:left; width: 100%; overflow-y: auto; max-height: 100%;">
                    <h2 style="font-family: 'VT323'; color: var(--accent-teal); margin-bottom:15px;">Found ${results.length} Phrase(s)</h2>`;

        results.forEach(item => {
            html += `
                <div style="background: rgba(255,255,255,0.6); border:1px solid #ccc; padding:15px; margin-bottom:15px; border-radius:4px;">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom:5px; text-transform:uppercase; letter-spacing:1px;">
                        ${item.category}
                    </div>
                    
                    <div style="font-size: 1.4rem; font-weight: bold; color: var(--accent-teal); margin-bottom: 5px;">
                        ${item.de}
                    </div>
                    
                    <div style="font-style: italic; color: #444; margin-bottom: 10px;">
                        "${item.en}" / "${item.es}"
                    </div>

                    <div style="background: #e0f7fa; padding: 8px; font-size: 0.85rem; color: #006064; border-radius: 4px;">
                        <strong>💡 Tip:</strong> ${item.context}
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        resultPanel.innerHTML = html;

    } catch (error) {
        console.error(error);
        resultPanel.innerHTML = "Error loading phrasebook.";
    }
}

// --- EXPENSE TRACKER LOGIC ---
let expenses = [];

function addExpense() {
    const descInput = document.getElementById('expense-desc');
    const amountInput = document.getElementById('expense-amount');
    const catInput = document.getElementById('expense-cat');

    const desc = descInput.value;
    const amount = parseFloat(amountInput.value);
    const cat = catInput.value;

    if (!desc || isNaN(amount) || !cat) {
        alert("Please fill in all fields correctly.");
        return;
    }

    expenses.push({ desc, amount, cat });
    renderExpenses();
    
    // Clear inputs
    descInput.value = '';
    amountInput.value = '';
    catInput.value = '';
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    renderExpenses();
}

function renderExpenses() {
    const tbody = document.getElementById('expense-table-body');
    const totalEl = document.getElementById('expense-total');
    
    tbody.innerHTML = '';

    if (expenses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 30px; color: #999;">No expenses logged yet.</td></tr>`;
        totalEl.innerText = 'Total: €0.00';
        return;
    }

    let total = 0;

    expenses.forEach((exp, index) => {
        total += exp.amount;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${exp.desc}</td>
            <td>${exp.cat}</td>
            <td>€${exp.amount.toFixed(2)}</td>
            <td style="text-align:center;">
                <span class="material-icons delete-btn" onclick="deleteExpense(${index})">delete</span>
            </td>
        `;
        tbody.appendChild(tr);
    });

    totalEl.innerText = `Total: €${total.toFixed(2)}`;
}

// --- TRANSPORT ROUTE LOGIC ---
async function findRoute() {
    const fromVal = document.getElementById('transport-from').value;
    const toVal = document.getElementById('transport-to').value;
    const resultPanel = document.getElementById('transport-result');

    if (!fromVal || !toVal) {
        alert("Please select both a Start and Destination.");
        return;
    }

    resultPanel.innerHTML = `<div class="placeholder-text" style="color:var(--accent-teal)">Connecting to DB Database...</div>`;

    try {
        // 1. Fetch Data
        const response = await fetch('data/transport.json');
        const routes = await response.json();

        // 2. Filter
        const match = routes.find(r => r.from === fromVal && r.to === toVal);

        // 3. Render
        setTimeout(() => {
            if (!match) {
                resultPanel.innerHTML = `
                    <div style="text-align:center">
                        <span class="material-icons" style="font-size:3rem; color:#ccc">sentiment_dissatisfied</span>
                        <p>No direct tourist route found in database for this connection.</p>
                        <p style="font-size:0.8rem; color:#999;">Try connecting via Central Station or Marienplatz.</p>
                    </div>`;
                return;
            }

            // Success - Render Ticket View
            resultPanel.innerHTML = `
                <div style="width: 100%; text-align: left;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid #ddd; padding-bottom:10px;">
                        <div>
                            <h2 style="font-family: 'VT323'; margin:0;">${match.mode} Route</h2>
                            <span style="font-size:0.9rem; color:#666;">${match.duration} • ${match.frequency}</span>
                        </div>
                        <div style="background:${match.color}; color:white; padding:5px 15px; border-radius:4px; font-weight:bold;">
                            ${match.line}
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <strong>🎫 Recommended Ticket:</strong><br>
                        <span style="color:var(--accent-teal); font-size:1.1rem;">${match.ticket_type}</span>
                    </div>

                    <div style="background:#f9f9f9; padding:15px; border-radius:5px;">
                        <strong>🛑 Key Stops:</strong>
                        <ul style="margin-left:20px; margin-top:10px; color:#444;">
                            ${match.stops.map(stop => `<li>${stop}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }, 600);

    } catch (error) {
        console.error(error);
        resultPanel.innerHTML = "Error loading transport database.";
    }
}

// --- MAP VIEWER LOGIC ---
function openMap(type) {
    const modal = document.getElementById('map-viewer');
    const img = document.getElementById('map-viewer-img');
    
    // Ensure you have these files in an 'images' folder!
    if (type === 'city') {
        img.src = 'images/map_city.png';
    } else if (type === 'region') {
        img.src = 'images/map_region.png';
    }
    
    modal.classList.add('active');
}

function closeMap() {
    document.getElementById('map-viewer').classList.remove('active');
}

// --- START APP ---
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});