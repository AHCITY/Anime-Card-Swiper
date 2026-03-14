// ===== GAME ENGINE =====
function animateWar(playerCard, aiCard, playerWon) {
    return new Promise(resolve => {
        warOverlay.classList.remove('hidden');
        warPlayerCard.style.background = `url('${playerCard.img}') center/cover`;
        warAiCard.style.background = `url('${aiCard.img}') center/cover`;
        const playerLabel = warPlayerCard.querySelector('.war-label');
        const aiLabel = warAiCard.querySelector('.war-label');
        playerLabel.textContent = playerWon ? 'VICTORY' : 'DEFEAT';
        aiLabel.textContent = playerWon ? 'DEFEAT' : 'VICTORY';
        warPlayerCard.className = 'war-card';
        warAiCard.className = 'war-card';
        setTimeout(() => { warPlayerCard.classList.add('revealed'); warAiCard.classList.add('revealed'); }, 50);
        setTimeout(() => { if (playerWon) warPlayerCard.classList.add('winner'); else warAiCard.classList.add('winner'); }, 900);
        setTimeout(() => { warOverlay.classList.add('hidden'); setTimeout(resolve, 500); }, 3500);
    });
}

async function playRound() {
    if (!gameActive || isAITurn || warInProgress) return;
    if (!playerHand.length || !aiHand.length) { autoRestartMatch(); return; }
    const activeIndex = swiperInstance?.activeIndex ?? 0;
    const playerCard = playerHand[activeIndex];
    if (!playerCard) return;
    isAITurn = true; warInProgress = true; playBtn.disabled = true; setButtonsEnabled(false);
    const aiCardElements = document.querySelectorAll('.ai-card');
    aiCardElements.forEach(el => el.classList.add('swapping'));
    await new Promise(r => setTimeout(r, 500));
    aiCardElements.forEach(el => el.classList.remove('swapping'));
    aiCardElements.forEach(el => el.classList.add('thinking'));
    await new Promise(r => setTimeout(r, 800));
    aiCardElements.forEach(el => el.classList.remove('thinking'));
    const level = getAIDifficultyLevel();
    const sorted = [...aiHand].sort((a,b) => a.power - b.power);
    const higher = sorted.find(c => c.power >= playerCard.power);
    let aiIndex;
    if (level === 'easy') {
        if (Math.random() < 0.4) aiIndex = Math.floor(Math.random() * aiHand.length);
        else {
            const lower = sorted.filter(c => c.power < playerCard.power);
            if (lower.length && Math.random() < 0.7) {
                const r = lower[Math.floor(Math.random() * lower.length)];
                aiIndex = aiHand.findIndex(c => c.name === r.name);
            } else aiIndex = aiHand.findIndex(c => c.name === sorted[0].name);
        }
    } else if (level === 'medium') {
        if (higher && Math.random() < 0.7) aiIndex = aiHand.findIndex(c => c.name === higher.name);
        else aiIndex = Math.floor(Math.random() * aiHand.length);
    } else {
        if (higher) aiIndex = aiHand.findIndex(c => c.name === higher.name);
        else aiIndex = aiHand.findIndex(c => c.name === sorted[sorted.length-1].name);
    }
    const aiCard = aiHand[aiIndex];
    const playerWon = playerCard.power >= aiCard.power;
    await animateWar(playerCard, aiCard, playerWon);
    aiLastPlayedCard.style.background = `url('${aiCard.img}') center/cover`;
    aiLastPlayedName.textContent = `${aiCard.name} (${aiCard.power})`;
    aiLastPlayedArea.style.display = 'flex';
    aiLastPlayedCard.classList.add('spin-reveal');
    setTimeout(() => aiLastPlayedCard.classList.remove('spin-reveal'), 800);
    if (playerWon) {
        playerWins++; totalWins++; animeShards += 10; totalMoneyEarned += 10;
        playerScoreSpan.classList.add('score-change');
        setTimeout(() => playerScoreSpan.classList.remove('score-change'), 500);
        log(`✅ R${currentRound} WIN +10 · ${playerCard.name} (${playerCard.power}) vs ${aiCard.name} (${aiCard.power})`);
    } else {
        aiWins++; totalLosses++; animeShards += 5; totalMoneyEarned += 5;
        aiScoreSpan.classList.add('score-change');
        setTimeout(() => aiScoreSpan.classList.remove('score-change'), 500);
        log(`❌ R${currentRound} LOSE +5 · ${aiCard.name} (${aiCard.power}) vs ${playerCard.name} (${playerCard.power})`);
    }
    playerHand.splice(activeIndex, 1); aiHand.splice(aiIndex, 1);
    totalRounds++; currentRound++;
    renderPlayerHand(); renderAIHand(); refreshUI();
    roundCounter.classList.add('round-change');
    setTimeout(() => roundCounter.classList.remove('round-change'), 500);
    roundCounter.textContent = `R${currentRound}`;
    await savePlayerData(true);
    setTimeout(() => {
        aiLastPlayedArea.style.display = 'none';
        isAITurn = false; warInProgress = false; playBtn.disabled = false; setButtonsEnabled(true);
        if (!playerHand.length || !aiHand.length) autoRestartMatch();
    }, 1000);
}

function autoRestartMatch() {
    log("⚔️ Match over! Starting new match...");
    playerWins = 0; aiWins = 0; currentRound = 1;
    playerHand = drawPlayerHand(); aiHand = drawAIHand();
    renderPlayerHand(); renderAIHand(); refreshUI();
    roundCounter.textContent = `R${currentRound}`;
    aiLastPlayedArea.style.display = 'none';
    isAITurn = false; warInProgress = false; playBtn.disabled = false; setButtonsEnabled(true);
}

// ===== EVENT LISTENERS (core gameplay) =====
playBtn.addEventListener('click', playRound);

// ===== INITIALIZE =====
gameActive = false;
playerHand = drawPlayerHand();
aiHand = drawAIHand();
renderPlayerHand();
renderAIHand();
refreshUI();
applyWallpaper();