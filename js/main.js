// ===== CARD DATABASE =====
const commonTier = [
    { name: 'Takemichi', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558132/Takemichi_vwtnkn.jpg', power: 55, rarity: 'common' },
    { name: 'Asta', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558127/Asta_vvpkxw.jpg', power: 60, rarity: 'common' },
    { name: 'Bakugo', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558126/bakugo_bzsdkd.jpg', power: 59, rarity: 'common' },
    { name: 'Todoroki', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558135/Todoroki_wxl7qr.jpg', power: 58, rarity: 'common' },
    { name: 'Zenitsu', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558135/Zenitsu_fadzsq.jpg', power: 57, rarity: 'common' },
    { name: 'Chopper', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610064/Chopper_q40ir1.jpg', power: 57, rarity: 'common' },
    { name: 'Jean Kirstein', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610064/Jean_Kirstein_itrl3a.jpg', power: 60, rarity: 'common' },
    { name: 'Krillin', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610065/Krillin_sbxnl9.jpg', power: 60, rarity: 'common' },
    { name: 'Lucy Heartfilia', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610064/Lucy_Heartfilia_p8rmpa.jpg', power: 58, rarity: 'common' },
    { name: 'Nami', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610065/Nami_pae6b3.jpg', power: 57, rarity: 'common' },
    { name: 'Noelle Silva', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610065/Noelle_Silva_uk3lls.jpg', power: 60, rarity: 'common' },
    { name: 'Orihime Inoue', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610065/Orihime_Inoue_ff6ptx.jpg', power: 58, rarity: 'common' },
    { name: 'Sasha Blouse', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610066/Sasha_Blouse_plxj0x.jpg', power: 59, rarity: 'common' },
    { name: 'Tien Shinhan', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610066/Tien_Shinhan_u33dko.jpg', power: 60, rarity: 'common' }
];
const rareTier = [
    { name: 'Rock Lee', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558131/Rock_Lee_atsmbi.jpg', power: 75, rarity: 'rare' },
    { name: 'Mikasa', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558129/Mikasa_kujzch.jpg', power: 73, rarity: 'rare' },
    { name: 'Yuji', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558135/Yuji_mi5xbd.jpg', power: 72, rarity: 'rare' },
    { name: 'Killua', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558130/Killua_ugn6j3.jpg', power: 71, rarity: 'rare' },
    { name: 'Tanjiro', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558133/Tanjiro_i4qgix.jpg', power: 70, rarity: 'rare' },
    { name: 'Eren', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558127/Eren_Yeager_tmhmlj.jpg', power: 70, rarity: 'rare' },
    { name: 'Nobara', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558130/Nobara_eumklm.jpg', power: 68, rarity: 'rare' },
    { name: 'Nezuko', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558129/Nezuko_oi7laj.jpg', power: 67, rarity: 'rare' },
    { name: 'Hinata', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558127/Hinata_fdx7dg.jpg', power: 66, rarity: 'rare' }
];
const epicTier = [
    { name: 'Luffy', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558130/Luffy_qhgaaf.jpg', power: 93, rarity: 'epic' },
    { name: 'Zoro', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558136/Zoro_pjpe20.jpg', power: 93, rarity: 'epic' },
    { name: 'Sukuna', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558133/Sukuna_ebqhi6.jpg', power: 92, rarity: 'epic' },
    { name: 'Itachi', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558128/Itachi_xdtwaw.jpg', power: 91, rarity: 'epic' },
    { name: 'Yuta', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558135/Yuta_aqedjr.jpg', power: 91, rarity: 'epic' },
    { name: 'Sasuke', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558132/Sasuke_huc4nl.jpg', power: 91, rarity: 'epic' },
    { name: 'Kakashi', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558128/kakashi_dsoncb.jpg', power: 90, rarity: 'epic' },
    { name: 'Yami', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558134/Yami_a9oz0l.jpg', power: 89, rarity: 'epic' },
    { name: 'Igris', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558128/Igris_kuhjld.jpg', power: 88, rarity: 'epic' },
    { name: 'Gaara', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558129/Gaara_mr68wx.jpg', power: 88, rarity: 'epic' },
    { name: 'Asta Black', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558130/Asta_Black_pip017.jpg', power: 88, rarity: 'epic' },
    { name: 'Sanji', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558132/Sanji_w7nfkm.jpg', power: 87, rarity: 'epic' },
    { name: 'Toji', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558134/Toji_rg4w92.jpg', power: 85, rarity: 'epic' }
];
const mythicalTier = [
    { name: 'Goku', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558135/Goku_rsafc4.jpg', power: 98, rarity: 'mythical' },
    { name: 'Gojo', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558127/Gojo_cvuof0.jpg', power: 96, rarity: 'mythical' },
    { name: 'Madara', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558130/Madara_n6imes.jpg', power: 95, rarity: 'mythical' },
    { name: 'Sung Jin-Woo', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558135/Sung-Jin-Woo_sx1aln.jpg', power: 94, rarity: 'mythical' },
    // NEW MYTHICAL CARDS - UPDATE 1.0
    { name: 'Naruto', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499429/Naruto_ecn9cr.png', power: 105, rarity: 'mythical' },
    { name: 'Anos Voldigoad', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499423/Anos_Voldigoad_e7tjal.jpg', power: 110, rarity: 'mythical' },
    { name: 'Saitama', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499421/Saitama_xh9rca.jpg', power: 112, rarity: 'mythical' },
    { name: 'Beerus', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499420/Beerus_rxypk0.jpg', power: 111, rarity: 'mythical' },
    { name: 'Kaido', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499420/Kaido_awgupa.jpg', power: 98, rarity: 'mythical' },
    { name: 'Meliodas', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499420/Meliodas_wuuci9.jpg', power: 101, rarity: 'mythical' },
    { name: 'Vegeta', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499419/Vegeta_ntcnl9.jpg', power: 108, rarity: 'mythical' }
];
const allCards = [...commonTier, ...rareTier, ...epicTier, ...mythicalTier];
const rarityWeights = [
    { rarity: 'common', weight: 60, pool: commonTier },
    { rarity: 'rare', weight: 25, pool: rareTier },
    { rarity: 'epic', weight: 10, pool: epicTier },
    { rarity: 'mythical', weight: 5, pool: mythicalTier }
];

// ===== WALLPAPERS =====
const wallpapers = {
    default: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f0f23 100%)',
    space: 'url("https://res.cloudinary.com/dgzhxztx0/image/upload/v1773501301/background_1_auwd54.jpg") center/cover',
    custom: ''
};

// ===== GAME STATE =====
let playerCollection = [];
let activeDeckIds = [];
let playerHand = [], aiHand = [];
let playerWins = 0, aiWins = 0, animeShards = 0;
let totalMoneyEarned = 0, totalWins = 0, totalLosses = 0, totalRounds = 0;
let username = 'Player';
let currentRound = 1;
let gameActive = false, isAITurn = false, warInProgress = false;
let currentSwiper = null;
let currentUser = null;
let lastOnline = '--';
let autoSaveInterval = null;
let savePending = false;
let swiperInstance = null;
let emailVisible = false;
let friendList = [];
let currentFriendsTab = 'players';
let wallpaperSetting = 'default';
let blurLevel = 0;
let customWallpaperUrl = '';

// ===== CHEAT CODE =====
let typedKeys = '';
window.addEventListener('keydown', (e) => {
    typedKeys += e.key;
    if (typedKeys.length > 10) typedKeys = typedKeys.slice(-10);
    if (typedKeys.toLowerCase().includes('godmode')) {
        animeShards += 1000000;
        refreshUI();
        showNotification('🔧 DEV MODE: +1,000,000 🪙', 'success');
        typedKeys = '';
    }
});

// ===== DOM ELEMENTS =====
const authOverlay = document.getElementById('authOverlay');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const showReset = document.getElementById('showReset');
const loginLoading = document.getElementById('loginLoading');
const signupLoading = document.getElementById('signupLoading');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');
const profileModal = document.getElementById('profileModal');
const profileBtn = document.getElementById('profileBtn');
const closeProfileBtn = document.getElementById('closeProfileBtn');
const logoutBtn = document.getElementById('logoutBtn');
const manualSaveBtn = document.getElementById('manualSaveBtn');
const saveUsernameBtn = document.getElementById('saveUsernameBtn');
const profileUsernameInput = document.getElementById('profileUsernameInput');
const saveStatus = document.getElementById('saveStatus');
const toggleEmailBtn = document.getElementById('toggleEmailBtn');
const profileEmail = document.getElementById('profileEmail');
const swiperWrapper = document.getElementById('swiperWrapper');
const playerScoreSpan = document.getElementById('playerScore');
const aiScoreSpan = document.getElementById('aiScore');
const playerCardsCount = document.getElementById('playerCardsCount');
const aiCardsCount = document.getElementById('aiCardsCount');
const aiHandContainer = document.getElementById('aiHandContainer');
const aiLastPlayedArea = document.getElementById('aiLastPlayedArea');
const aiLastPlayedCard = document.getElementById('aiLastPlayedCard');
const aiLastPlayedName = document.getElementById('aiLastPlayedName');
const roundLogDiv = document.getElementById('roundLog');
const roundCounter = document.getElementById('roundCounter');
const playBtn = document.getElementById('playBtn');
const inventoryBtn = document.getElementById('inventoryBtn');
const marketBtn = document.getElementById('marketBtn');
const friendsBtn = document.getElementById('friendsBtn');
const settingsBtn = document.getElementById('settingsBtn');
const inventoryModal = document.getElementById('inventoryModal');
const closeInventoryBtn = document.getElementById('closeInventoryBtn');
const inventoryGrid = document.getElementById('inventoryGrid');
const marketModal = document.getElementById('marketModal');
const closeMarketBtn = document.getElementById('closeMarketBtn');
const pack3Card = document.getElementById('pack3Card');
const pack1Card = document.getElementById('pack1Card');
const packOpenModal = document.getElementById('packOpenModal');
const packCardsContainer = document.getElementById('packCardsContainer');
const closePackBtn = document.getElementById('closePackBtn');
const notification = document.getElementById('notification');
const warOverlay = document.getElementById('warOverlay');
const warPlayerCard = document.getElementById('warPlayerCard');
const warAiCard = document.getElementById('warAiCard');
const shardSpan = document.getElementById('shardCount');
const profileTotalCards = document.getElementById('profileTotalCards');
const profileShards = document.getElementById('profileShards');
const profileTotalEarned = document.getElementById('profileTotalEarned');
const profileWins = document.getElementById('profileWins');
const profileLossesEl = document.getElementById('profileLosses');
const profileRounds = document.getElementById('profileRounds');
const profileLastOnline = document.getElementById('profileLastOnline');
const resetModal = document.getElementById('resetModal');
const closeResetBtn = document.getElementById('closeResetBtn');
const sendResetBtn = document.getElementById('sendResetBtn');
const resetEmailInput = document.getElementById('resetEmailInput');
const resetLoading = document.getElementById('resetLoading');
const resetError = document.getElementById('resetError');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const qualityBtns = document.querySelectorAll('.quality-btn');
const wallpaperBtns = document.querySelectorAll('.wallpaper-btn');
const blurSlider = document.getElementById('blurSlider');
const blurValue = document.getElementById('blurValue');
const wallpaperPreview = document.getElementById('wallpaperPreview');
const uploadWallpaperBtn = document.getElementById('uploadWallpaperBtn');
const wallpaperUpload = document.getElementById('wallpaperUpload');
const wallpaperBg = document.getElementById('wallpaperBg');
const friendsModal = document.getElementById('friendsModal');
const closeFriendsBtn = document.getElementById('closeFriendsBtn');
const friendsList = document.getElementById('friendsList');
const friendsTabs = document.querySelectorAll('.friends-tab');
const friendSearchInput = document.getElementById('friendSearchInput');
const friendSearchContainer = document.getElementById('friendSearchContainer');
const friendProfileModal = document.getElementById('friendProfileModal');
const closeFriendProfileBtn = document.getElementById('closeFriendProfileBtn');
const friendProfileAvatar = document.getElementById('friendProfileAvatar');
const friendProfileName = document.getElementById('friendProfileName');
const friendProfileUsername = document.getElementById('friendProfileUsername');
const friendProfileWins = document.getElementById('friendProfileWins');
const friendProfileLosses = document.getElementById('friendProfileLosses');
const friendProfileCards = document.getElementById('friendProfileCards');
const friendProfileRounds = document.getElementById('friendProfileRounds');

// ===== NOTIFICATION =====
function showNotification(msg, type = 'info') {
    notification.textContent = msg;
    notification.classList.add('show');
    notification.style.borderColor = type === 'success' ? 'gold' : (type === 'error' ? '#ff4444' : '#ff3cac');
    setTimeout(() => notification.classList.remove('show'), 2500);
}

// ===== FIREBASE SAVE/LOAD =====
async function savePlayerData(instant = false) {
    if (!currentUser || savePending) return;
    savePending = true;
    try {
        const playerRef = doc(db, 'players', currentUser.uid);
        await setDoc(playerRef, {
            email: currentUser.email,
            username: username,
            collection: playerCollection,
            activeDeckIds: activeDeckIds,
            shards: animeShards,
            totalMoneyEarned: totalMoneyEarned,
            totalWins: totalWins,
            totalLosses: totalLosses,
            totalRounds: totalRounds,
            friendList: friendList,
            wallpaperSetting: wallpaperSetting,
            blurLevel: blurLevel,
            customWallpaperUrl: customWallpaperUrl,
            lastOnline: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });
        if (instant) {
            saveStatus.textContent = '💾 Saved!';
            saveStatus.classList.add('saved');
            setTimeout(() => {
                saveStatus.textContent = '💾 Auto-save every 5 minutes';
                saveStatus.classList.remove('saved');
            }, 2000);
        }
    } catch (error) {
        console.error('Save error:', error);
        if (instant) showNotification('Failed to save data', 'error');
    } finally {
        savePending = false;
    }
}

async function loadPlayerData() {
    if (!currentUser) return;
    try {
        const playerRef = doc(db, 'players', currentUser.uid);
        const playerSnap = await getDoc(playerRef);
        if (playerSnap.exists()) {
            const data = playerSnap.data();
            playerCollection = data.collection || [];
            activeDeckIds = data.activeDeckIds || [];
            animeShards = data.shards || 0;
            totalMoneyEarned = data.totalMoneyEarned || 0;
            totalWins = data.totalWins || 0;
            totalLosses = data.totalLosses || 0;
            totalRounds = data.totalRounds || 0;
            username = data.username || 'Player';
            friendList = data.friendList || [];
            wallpaperSetting = data.wallpaperSetting || 'default';
            blurLevel = data.blurLevel || 0;
            customWallpaperUrl = data.customWallpaperUrl || '';
            lastOnline = data.lastOnline ? formatTimestamp(data.lastOnline) : '--';
            applyWallpaper();
            if (playerCollection.length === 0) {
                playerCollection = commonTier.slice(0, 5).map(c => ({ ...c, id: crypto.randomUUID(), count: 1 }));
                activeDeckIds = playerCollection.map(c => c.id);
                await savePlayerData(true);
            }
        } else {
            playerCollection = commonTier.slice(0, 5).map(c => ({ ...c, id: crypto.randomUUID(), count: 1 }));
            activeDeckIds = playerCollection.map(c => c.id);
            await savePlayerData(true);
        }
    } catch (error) {
        console.error('Error loading player data:', error);
        showNotification('Failed to load save data', 'error');
    }
}

function formatTimestamp(timestamp) {
    if (!timestamp) return '--';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(() => {
        if (currentUser && gameActive) savePlayerData(false);
    }, 300000);
}

// ===== AUTH FUNCTIONS =====
function showAuthForm(form) {
    loginError.textContent = '';
    signupError.textContent = '';
    resetError.textContent = '';
    if (form === 'login') {
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'flex';
    }
}

loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) {
        loginError.textContent = 'Please fill in all fields';
        return;
    }
    loginLoading.style.display = 'block';
    loginError.textContent = '';
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        loginError.textContent = error.message.replace('Firebase: ', '');
    } finally {
        loginLoading.style.display = 'none';
    }
});

signupBtn.addEventListener('click', async () => {
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    if (!email || !password) {
        signupError.textContent = 'Please fill in all fields';
        return;
    }
    if (password.length < 6) {
        signupError.textContent = 'Password must be at least 6 characters';
        return;
    }
    if (password !== confirm) {
        signupError.textContent = 'Passwords do not match';
        return;
    }
    signupLoading.style.display = 'block';
    signupError.textContent = '';
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        signupError.textContent = error.message.replace('Firebase: ', '');
    } finally {
        signupLoading.style.display = 'none';
    }
});

async function handleGoogleSignIn() {
    try {
        googleProvider.setCustomParameters({ prompt: 'select_account' });
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error('Google sign-in error:', error);
        showNotification('Google sign-in failed: ' + error.message, 'error');
    }
}

googleLoginBtn.addEventListener('click', handleGoogleSignIn);
googleSignupBtn.addEventListener('click', handleGoogleSignIn);
showSignup.addEventListener('click', () => showAuthForm('signup'));
showLogin.addEventListener('click', () => showAuthForm('login'));

// ===== FORGOT PASSWORD - FIXED =====
showReset.addEventListener('click', () => {
    resetModal.classList.remove('hidden');
    resetError.textContent = '';
    resetEmailInput.value = '';
});

closeResetBtn.addEventListener('click', () => {
    resetModal.classList.add('hidden');
});

sendResetBtn.addEventListener('click', async () => {
    const email = resetEmailInput.value.trim();
    if (!email) {
        resetError.textContent = 'Please enter your email';
        return;
    }
    resetLoading.style.display = 'block';
    resetError.textContent = '';
    try {
        await sendPasswordResetEmail(auth, email);
        showNotification('✅ Reset link sent! Check your email.', 'success');
        resetModal.classList.add('hidden');
    } catch (error) {
        let errorMsg = error.message.replace('Firebase: ', '');
        if (error.code === 'auth/user-not-found') {
            errorMsg = 'No account found with this email';
        } else if (error.code === 'auth/invalid-email') {
            errorMsg = 'Please enter a valid email address';
        } else if (error.code === 'auth/too-many-requests') {
            errorMsg = 'Too many attempts. Please try again later.';
        }
        resetError.textContent = errorMsg;
    } finally {
        resetLoading.style.display = 'none';
    }
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        authOverlay.classList.add('hidden');
        await loadPlayerData();
        gameActive = true;
        startAutoSave();
        autoRestartMatch();
        showNotification(`Welcome, ${username}!`, 'success');
    } else {
        currentUser = null;
        authOverlay.classList.remove('hidden');
        gameActive = false;
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
            autoSaveInterval = null;
        }
    }
});

logoutBtn.addEventListener('click', async () => {
    await savePlayerData(true);
    await signOut(auth);
    profileModal.classList.add('hidden');
    showNotification('Logged out successfully', 'info');
});

manualSaveBtn.addEventListener('click', async () => {
    await savePlayerData(true);
});

saveUsernameBtn.addEventListener('click', async () => {
    if (!currentUser) return;
    const newUsername = profileUsernameInput.value.trim();
    if (newUsername.length < 3 || newUsername.length > 20) {
        showNotification('Username must be 3-20 characters', 'error');
        return;
    }
    try {
        const playerRef = doc(db, 'players', currentUser.uid);
        await updateDoc(playerRef, { username: newUsername, updatedAt: serverTimestamp() });
        username = newUsername;
        saveUsernameBtn.classList.add('saved');
        saveUsernameBtn.disabled = true;
        showNotification('Username saved!', 'success');
        setTimeout(() => saveUsernameBtn.classList.remove('saved'), 2000);
        await savePlayerData(true);
    } catch (error) {
        console.error('Username save error:', error);
        showNotification('Failed to save username', 'error');
    }
});

profileUsernameInput.addEventListener('input', () => {
    const currentVal = profileUsernameInput.value.trim();
    saveUsernameBtn.disabled = !(currentVal !== username && currentVal.length >= 3);
});

profileBtn.addEventListener('click', () => {
    if (!currentUser) { showNotification('Please login first', 'error'); return; }
    profileEmail.textContent = currentUser.email;
    profileEmail.classList.add('blurred');
    emailVisible = false;
    toggleEmailBtn.innerHTML = '<i class="fas fa-eye"></i>';
    profileUsernameInput.value = username;
    saveUsernameBtn.disabled = true;
    profileTotalCards.textContent = playerCollection.length;
    profileShards.textContent = animeShards;
    profileTotalEarned.textContent = totalMoneyEarned;
    profileWins.textContent = totalWins;
    profileLossesEl.textContent = totalLosses;
    profileRounds.textContent = totalRounds;
    profileLastOnline.textContent = `Last Online: ${lastOnline}`;
    profileModal.classList.remove('hidden');
});

closeProfileBtn.addEventListener('click', () => profileModal.classList.add('hidden'));

toggleEmailBtn.addEventListener('click', () => {
    if (emailVisible) {
        profileEmail.classList.add('blurred');
        toggleEmailBtn.innerHTML = '<i class="fas fa-eye"></i>';
        emailVisible = false;
    } else {
        profileEmail.classList.remove('blurred');
        toggleEmailBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        emailVisible = true;
    }
});

// ===== PRELOAD IMAGES =====
function preloadImages(urls) {
    urls.forEach(url => { if (url) { const img = new Image(); img.onerror = () => {}; img.src = url; } });
}
preloadImages(allCards.map(c => c.img));
preloadImages([
    'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772603856/3-Card_Pack_100_mdhkfz.jpg',
    'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772603856/1-Card_Pack_50_tjyfaf.jpg',
    'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773501301/background_1_auwd54.jpg'
]);