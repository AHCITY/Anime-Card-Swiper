// ===== PACK SYSTEM =====
function openPack(cardCount, price) {
    if (animeShards < price) { showNotification(`Need ${price} 🪙`, 'error'); return; }
    animeShards -= price; refreshUI();
    const newCards = [];
    for (let i = 0; i < cardCount; i++) {
        const rarity = getRandomRarity();
        const card = getRandomCardFromRarity(rarity);
        newCards.push(card); playerCollection.push(card);
    }
    packCardsContainer.innerHTML = '';
    newCards.forEach(c => {
        const div = document.createElement('div');
        div.className = `pack-card ${c.rarity}`;
        div.style.background = `url('${c.img}') center/cover`;
        packCardsContainer.appendChild(div);
    });
    packOpenModal.classList.remove('hidden');
    showNotification(`+${cardCount} cards!`, 'success');
    savePlayerData(true);
}

function getRandomRarity() {
    const totalWeight = rarityWeights.reduce((sum, r) => sum + r.weight, 0);
    let rand = Math.random() * totalWeight;
    for (let r of rarityWeights) { if (rand < r.weight) return r; rand -= r.weight; }
    return rarityWeights[0];
}

function getRandomCardFromRarity(rarityObj) {
    const pool = rarityObj.pool;
    if (pool.length === 0) return { ...commonTier[Math.floor(Math.random() * commonTier.length)], id: crypto.randomUUID(), count: 1 };
    return { ...pool[Math.floor(Math.random() * pool.length)], id: crypto.randomUUID(), count: 1 };
}

// Pack & Market listeners
pack3Card.addEventListener('click', () => { openPack(3, 100); marketModal.classList.add('hidden'); });
pack1Card.addEventListener('click', () => { openPack(1, 50); marketModal.classList.add('hidden'); });

closePackBtn.addEventListener('click', async () => {
    packOpenModal.classList.add('hidden');
    if (gameActive) { playerHand = drawPlayerHand(); renderPlayerHand(); await savePlayerData(true); }
});