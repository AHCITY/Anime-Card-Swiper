// ===== AI LOGIC =====
function getAIDifficultyLevel() {
    if (totalRounds < 8) return 'easy';
    else if (totalRounds < 20) return 'medium';
    else if (totalRounds < 35) return 'hard';
    else return 'impossible';
}

function drawAIHand() {
    const level = getAIDifficultyLevel();
    let pool = [];
    if (level === 'easy') pool = [...commonTier, ...rareTier.slice(0, 2)];
    else if (level === 'medium') pool = [...commonTier, ...rareTier, ...epicTier.slice(0, 2)];
    else if (level === 'hard') pool = [...rareTier, ...epicTier.slice(0, 4)];
    else pool = [...epicTier, ...mythicalTier.slice(0, 2)];
    while (pool.length < 5) pool.push(...commonTier);
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 5).map(c => ({ ...c }));
}

function drawPlayerHand() {
    const deckCards = playerCollection.filter(c => activeDeckIds.includes(c.id));
    if (deckCards.length === 0) return [];
    return [...deckCards].sort(() => Math.random() - 0.5).slice(0, 5).map(c => ({ ...c }));
}