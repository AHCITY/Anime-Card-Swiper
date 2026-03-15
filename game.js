// ===== FIREBASE IMPORTS =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, serverTimestamp, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
    apiKey: "AIzaSyAYVhlIZXLYx3Q9sOD4flNlcdLt3ahu0N0",
    authDomain: "card-swiper-d5c0a.firebaseapp.com",
    projectId: "card-swiper-d5c0a",
    storageBucket: "card-swiper-d5c0a.firebasestorage.app",
    messagingSenderId: "579825479564",
    appId: "1:579825479564:web:f9d27ff12c7f7a5c5830a9",
    measurementId: "G-06SRGQTE85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

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
let particlesEnabled = true;

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
const particleBtns = document.querySelectorAll('.particle-btn');
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
            particlesEnabled: particlesEnabled,
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
            particlesEnabled = data.particlesEnabled !== undefined ? data.particlesEnabled : true;
            lastOnline = data.lastOnline ? formatTimestamp(data.lastOnline) : '--';
            applyWallpaper();
            applyParticles();
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

// ===== FORGOT PASSWORD =====
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

// ===== SETTINGS & QUALITY =====
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
});

closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));

qualityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        qualityBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.quality === 'low') {
            document.body.classList.add('low-quality');
        } else {
            document.body.classList.remove('low-quality');
        }
    });
});

particleBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        particlesEnabled = btn.dataset.particles === 'on';
        applyParticles();
        await savePlayerData(true);
    });
});

// ===== WALLPAPER SYSTEM =====
wallpaperBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        wallpaperBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        wallpaperSetting = btn.dataset.wallpaper;
        applyWallpaper();
    });
});

blurSlider.addEventListener('input', () => {
    blurLevel = blurSlider.value;
    blurValue.textContent = blurLevel;
    document.documentElement.style.setProperty('--wallpaper-blur', `${blurLevel / 100 * 10}px`);
});

uploadWallpaperBtn.addEventListener('click', () => wallpaperUpload.click());

wallpaperUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;
    if (file.size > 20 * 1024 * 1024) {
        showNotification('File too large (max 20MB)', 'error');
        wallpaperUpload.value = '';
        return;
    }
    showNotification('⏳ Uploading wallpaper...', 'info');
    const reader = new FileReader();
    reader.onload = (evt) => {
        customWallpaperUrl = evt.target.result;
        wallpaperSetting = 'custom';
        wallpaperBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-wallpaper="custom"]').classList.add('active');
        applyWallpaper();
    };
    reader.readAsDataURL(file);
    try {
        const storageRef = ref(storage, `wallpapers/${currentUser.uid}_${Date.now()}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        customWallpaperUrl = downloadUrl;
        wallpaperSetting = 'custom';
        applyWallpaper();
        showNotification('✅ Wallpaper saved!', 'success');
        await savePlayerData(true);
    } catch (error) {
        console.error('Upload error:', error);
        showNotification('⚠️ Preview shown, cloud save failed', 'error');
    }
    wallpaperUpload.value = '';
});

function setElWallpaper(el, setting, url) {
    el.style.backgroundImage = '';
    el.style.backgroundSize = '';
    el.style.backgroundPosition = '';
    el.style.background = '';
    if (setting === 'default') {
        el.style.background = wallpapers.default;
    } else if (setting === 'space') {
        const spaceUrl = 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773501301/background_1_auwd54.jpg';
        el.style.backgroundImage = `url("${spaceUrl}")`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
    } else if (setting === 'custom' && url) {
        el.style.backgroundImage = `url("${url}")`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
    } else {
        el.style.background = wallpapers.default;
    }
}

function applyWallpaper() {
    setElWallpaper(wallpaperBg, wallpaperSetting, customWallpaperUrl);
    setElWallpaper(wallpaperPreview, wallpaperSetting, customWallpaperUrl);
    blurSlider.value = blurLevel;
    blurValue.textContent = blurLevel;
    document.documentElement.style.setProperty('--wallpaper-blur', `${blurLevel / 100 * 10}px`);
    const wallpaperBtnActive = document.querySelector(`[data-wallpaper="${wallpaperSetting}"]`);
    if (wallpaperBtnActive) {
        wallpaperBtns.forEach(b => b.classList.remove('active'));
        wallpaperBtnActive.classList.add('active');
    }
}

function applyParticles() {
    if (particlesEnabled) {
        document.body.classList.remove('no-particles');
    } else {
        document.body.classList.add('no-particles');
    }
    particleBtns.forEach(btn => {
        const isOn = btn.dataset.particles === 'on';
        btn.classList.toggle('active', particlesEnabled ? isOn : !isOn);
    });
}

// ===== FRIENDS SYSTEM =====
friendsBtn.addEventListener('click', async () => {
    if (!currentUser) { showNotification('Please login first', 'error'); return; }
    friendsModal.classList.remove('hidden');
    await loadFriendsList();
});

closeFriendsBtn.addEventListener('click', () => friendsModal.classList.add('hidden'));

friendsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        friendsTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFriendsTab = tab.dataset.tab;
        friendSearchContainer.style.display = currentFriendsTab === 'players' ? 'block' : 'none';
        loadFriendsList();
    });
});

friendSearchInput.addEventListener('input', loadFriendsList);

async function loadFriendsList() {
    friendsList.innerHTML = '<p style="text-align:center; color:#aaa;">Loading...</p>';
    try {
        if (currentFriendsTab === 'players') {
            const playersRef = collection(db, 'players');
            const snapshot = await getDocs(playersRef);
            const players = [];
            snapshot.forEach(docSnap => {
                if (docSnap.id !== currentUser.uid) {
                    const data = docSnap.data();
                    players.push({ uid: docSnap.id, ...data });
                }
            });
            const search = friendSearchInput.value.toLowerCase();
            const filtered = players.filter(p => p.username?.toLowerCase().includes(search));
            renderFriendsList(filtered, false);
        } else {
            const friendData = [];
            for (const friendUid of friendList) {
                const friendRef = doc(db, 'players', friendUid);
                const friendSnap = await getDoc(friendRef);
                if (friendSnap.exists()) {
                    friendData.push({ uid: friendUid, ...friendSnap.data() });
                }
            }
            renderFriendsList(friendData, true);
        }
    } catch (error) {
        console.error('Load friends error:', error);
        friendsList.innerHTML = '<p style="text-align:center; color:#ff4444;">Failed to load</p>';
    }
}

function renderFriendsList(list, isFriends) {
    if (list.length === 0) {
        friendsList.innerHTML = '<p style="text-align:center; color:#aaa;">No players found</p>';
        return;
    }
    friendsList.innerHTML = '';
    list.forEach(player => {
        const item = document.createElement('div');
        item.className = 'friend-item';
        const initial = (player.username || 'P')[0].toUpperCase();
        const isFriend = friendList.includes(player.uid);
        item.innerHTML = `
            <div class="friend-info">
                <div class="friend-avatar">${initial}</div>
                <div class="friend-details">
                    <h4>${player.username || 'Unknown'}</h4>
                    <p>${player.totalWins || 0} wins · ${player.collection?.length || 0} cards</p>
                </div>
            </div>
            <div class="friend-actions">
                <button class="friend-action-btn view" data-uid="${player.uid}">View</button>
                ${isFriends ? (isFriend ? 
                    `<button class="friend-action-btn remove" data-uid="${player.uid}">Remove</button>` : 
                    `<button class="friend-action-btn add" data-uid="${player.uid}">Add</button>`) : ''}
            </div>
        `;
        friendsList.appendChild(item);
    });
    document.querySelectorAll('.friend-action-btn.view').forEach(btn => {
        btn.addEventListener('click', (e) => viewFriendProfile(e.target.dataset.uid));
    });
    document.querySelectorAll('.friend-action-btn.add').forEach(btn => {
        btn.addEventListener('click', (e) => addFriend(e.target.dataset.uid));
    });
    document.querySelectorAll('.friend-action-btn.remove').forEach(btn => {
        btn.addEventListener('click', (e) => removeFriend(e.target.dataset.uid));
    });
}

async function addFriend(uid) {
    if (friendList.includes(uid)) { showNotification('Already friends!', 'error'); return; }
    friendList.push(uid);
    await savePlayerData(true);
    loadFriendsList();
    showNotification('Friend added!', 'success');
}

async function removeFriend(uid) {
    friendList = friendList.filter(id => id !== uid);
    await savePlayerData(true);
    loadFriendsList();
    showNotification('Friend removed', 'info');
}

async function viewFriendProfile(uid) {
    try {
        const friendRef = doc(db, 'players', uid);
        const friendSnap = await getDoc(friendRef);
        if (friendSnap.exists()) {
            const data = friendSnap.data();
            friendProfileAvatar.textContent = (data.username || 'F')[0].toUpperCase();
            friendProfileName.textContent = data.username || 'Unknown';
            friendProfileUsername.textContent = `@${data.username || 'player'}`;
            friendProfileWins.textContent = data.totalWins || 0;
            friendProfileLosses.textContent = data.totalLosses || 0;
            friendProfileCards.textContent = data.collection?.length || 0;
            friendProfileRounds.textContent = data.totalRounds || 0;
            friendProfileModal.classList.remove('hidden');
        }
    } catch (error) {
        console.error('View profile error:', error);
        showNotification('Failed to load profile', 'error');
    }
}

closeFriendProfileBtn.addEventListener('click', () => friendProfileModal.classList.add('hidden'));

// ===== GAME FUNCTIONS =====
function log(msg) {
    const p = document.createElement('p');
    p.textContent = msg;
    roundLogDiv.appendChild(p);
    roundLogDiv.scrollTop = roundLogDiv.scrollHeight;
    while (roundLogDiv.children.length > 6) roundLogDiv.removeChild(roundLogDiv.children[0]);
}

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

function preloadImages(urls) {
    urls.forEach(url => { if (url) { const img = new Image(); img.onerror = () => {}; img.src = url; } });
}
preloadImages(allCards.map(c => c.img));
preloadImages([
    'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772603856/3-Card_Pack_100_mdhkfz.jpg',
    'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772603856/1-Card_Pack_50_tjyfaf.jpg',
    'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773501301/background_1_auwd54.jpg'
]);

// ===== EVENT LISTENERS =====
playBtn.addEventListener('click', playRound);
inventoryBtn.addEventListener('click', openInventory);
closeInventoryBtn.addEventListener('click', async () => {
    inventoryModal.classList.add('hidden');
    if (gameActive) { playerHand = drawPlayerHand(); renderPlayerHand(); await savePlayerData(true); }
});
marketBtn.addEventListener('click', () => marketModal.classList.remove('hidden'));
closeMarketBtn.addEventListener('click', () => marketModal.classList.add('hidden'));
pack3Card.addEventListener('click', () => { openPack(3, 100); marketModal.classList.add('hidden'); });
pack1Card.addEventListener('click', () => { openPack(1, 50); marketModal.classList.add('hidden'); });
closePackBtn.addEventListener('click', async () => {
    packOpenModal.classList.add('hidden');
    if (gameActive) { playerHand = drawPlayerHand(); renderPlayerHand(); await savePlayerData(true); }
});

// ===== INITIALIZE =====
gameActive = false;
playerHand = drawPlayerHand();
aiHand = drawAIHand();
renderPlayerHand();
renderAIHand();
refreshUI();
applyWallpaper();
applyParticles();
