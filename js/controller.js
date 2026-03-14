// ===== UI CONTROLLER =====
function log(msg) {
    const p = document.createElement('p');
    p.textContent = msg;
    roundLogDiv.appendChild(p);
    roundLogDiv.scrollTop = roundLogDiv.scrollHeight;
    while (roundLogDiv.children.length > 6) roundLogDiv.removeChild(roundLogDiv.children[0]);
}

function renderAIHand() {
    aiHandContainer.innerHTML = '';
    aiHand.forEach(card => {
        const div = document.createElement('div');
        div.className = 'ai-card';
        div.style.background = `linear-gradient(145deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('${card.img}') center/cover`;
        div.innerHTML = `<span class="power-badge-small">⚡${card.power}</span>`;
        aiHandContainer.appendChild(div);
    });
    aiCardsCount.textContent = aiHand.length;
}

function renderPlayerHand() {
    swiperWrapper.innerHTML = '';
    playerHand.forEach(card => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.style.background = `url('${card.img}') center/cover`;
        slide.innerHTML = `<span class="power-badge">⚡${card.power}</span><h4>${card.name}</h4>`;
        swiperWrapper.appendChild(slide);
    });
    if (swiperInstance) { swiperInstance.destroy(true, true); swiperInstance = null; }
    setTimeout(() => {
        swiperInstance = new Swiper(".mySwiper", {
            effect: "cards", grabCursor: true, initialSlide: 0, loop: false, rotate: true, speed: 400,
            cardsEffect: { perSlideOffset: 10, perSlideRotate: 2, slideShadows: false }
        });
    }, 50);
    playerCardsCount.textContent = playerHand.length;
}

function refreshUI() {
    playerScoreSpan.textContent = playerWins;
    aiScoreSpan.textContent = aiWins;
    shardSpan.textContent = animeShards;
    playerCardsCount.textContent = playerHand.length;
    aiCardsCount.textContent = aiHand.length;
    renderAIHand();
}

function setButtonsEnabled(enabled) {
    inventoryBtn.disabled = !enabled;
    marketBtn.disabled = !enabled;
    profileBtn.disabled = !enabled;
    friendsBtn.disabled = !enabled;
    settingsBtn.disabled = !enabled;
    playBtn.disabled = !enabled;
}