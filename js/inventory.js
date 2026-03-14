// ===== INVENTORY SYSTEM =====
function getStackedInventory() {
    const cardMap = new Map();
    playerCollection.forEach(card => {
        const key = card.name;
        if (cardMap.has(key)) {
            const existing = cardMap.get(key);
            existing.count = (existing.count || 1) + (card.count || 1);
        } else cardMap.set(key, { ...card, count: card.count || 1 });
    });
    return Array.from(cardMap.values());
}

function openInventory() {
    inventoryGrid.innerHTML = '';
    const stackedCards = getStackedInventory();
    stackedCards.forEach(card => {
        const div = document.createElement('div');
        div.className = `inventory-card ${activeDeckIds.includes(card.id) ? 'selected' : ''}`;
        div.style.background = `url('${card.img}') center/cover`;
        div.innerHTML = `<span class="power-badge">⚡${card.power}</span><h4>${card.name}</h4>${card.count > 1 ? `<span class="stack-count">x${card.count}</span>` : ''}`;
        div.onclick = () => {
            if (activeDeckIds.includes(card.id)) {
                if (activeDeckIds.length > 1) { activeDeckIds = activeDeckIds.filter(id => id !== card.id); div.classList.remove('selected'); }
                else showNotification('Deck must have at least 1 card', 'error');
            } else {
                if (activeDeckIds.length < 5) { activeDeckIds.push(card.id); div.classList.add('selected'); }
                else showNotification('Deck max 5 cards', 'error');
            }
        };
        inventoryGrid.appendChild(div);
    });
    inventoryModal.classList.remove('hidden');
}

// Inventory related listeners
inventoryBtn.addEventListener('click', openInventory);
closeInventoryBtn.addEventListener('click', async () => {
    inventoryModal.classList.add('hidden');
    if (gameActive) { playerHand = drawPlayerHand(); renderPlayerHand(); await savePlayerData(true); }
});