// ===== FIREBASE IMPORTS =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import {
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signInWithPopup, GoogleAuthProvider, onAuthStateChanged,
    signOut, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
    getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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

const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// ===== INDEXED DB WALLPAPER CACHE =====
const WallpaperDB = {
    _db: null,
    async open() {
        if (this._db) return this._db;
        return new Promise((resolve, reject) => {
            const req = indexedDB.open('AnimeCardWallpapers', 1);
            req.onupgradeneeded = e => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('wallpapers'))
                    db.createObjectStore('wallpapers', { keyPath: 'url' });
            };
            req.onsuccess = e => { this._db = e.target.result; resolve(this._db); };
            req.onerror = () => reject(req.error);
        });
    },
    async save(url, blob) {
        try {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx = db.transaction('wallpapers', 'readwrite');
                tx.objectStore('wallpapers').put({ url, blob, savedAt: Date.now() });
                tx.oncomplete = resolve;
                tx.onerror = () => reject(tx.error);
            });
        } catch(e) { console.warn('WallpaperDB.save failed', e); }
    },
    async get(url) {
        try {
            const db = await this.open();
            return new Promise(resolve => {
                const tx = db.transaction('wallpapers', 'readonly');
                const req = tx.objectStore('wallpapers').get(url);
                req.onsuccess = () => resolve(req.result ? req.result.blob : null);
                req.onerror = () => resolve(null);
            });
        } catch(e) { return null; }
    },
    async getAll() {
        try {
            const db = await this.open();
            return new Promise(resolve => {
                const tx = db.transaction('wallpapers', 'readonly');
                const req = tx.objectStore('wallpapers').getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => resolve([]);
            });
        } catch(e) { return []; }
    },
    async delete(url) {
        try {
            const db = await this.open();
            return new Promise(resolve => {
                const tx = db.transaction('wallpapers', 'readwrite');
                tx.objectStore('wallpapers').delete(url);
                tx.oncomplete = resolve;
                tx.onerror = resolve;
            });
        } catch(e) {}
    }
};

// ===== CARD DATABASE =====
const commonTier = [
    { name: 'Takemichi',     img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558132/Takemichi_vwtnkn.jpg',        power: 55, rarity: 'common' },
    { name: 'Asta',          img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558127/Asta_vvpkxw.jpg',             power: 60, rarity: 'common' },
    { name: 'Bakugo',        img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558126/bakugo_bzsdkd.jpg',           power: 59, rarity: 'common' },
    { name: 'Todoroki',      img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558135/Todoroki_wxl7qr.jpg',        power: 58, rarity: 'common' },
    { name: 'Zenitsu',       img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558135/Zenitsu_fadzsq.jpg',         power: 57, rarity: 'common' },
    { name: 'Chopper',       img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610064/Chopper_q40ir1.jpg',         power: 57, rarity: 'common' },
    { name: 'Jean Kirstein', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610064/Jean_Kirstein_itrl3a.jpg',   power: 60, rarity: 'common' },
    { name: 'Krillin',       img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610065/Krillin_sbxnl9.jpg',         power: 60, rarity: 'common' },
    { name: 'Lucy Heartfilia',img:'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610064/Lucy_Heartfilia_p8rmpa.jpg', power: 58, rarity: 'common' },
    { name: 'Nami',          img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610065/Nami_pae6b3.jpg',            power: 57, rarity: 'common' },
    { name: 'Noelle Silva',  img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610065/Noelle_Silva_uk3lls.jpg',    power: 60, rarity: 'common' },
    { name: 'Orihime Inoue', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610065/Orihime_Inoue_ff6ptx.jpg',  power: 58, rarity: 'common' },
    { name: 'Sasha Blouse',  img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610066/Sasha_Blouse_plxj0x.jpg',   power: 59, rarity: 'common' },
    { name: 'Tien Shinhan',  img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772610066/Tien_Shinhan_u33dko.jpg',   power: 60, rarity: 'common' }
];
const rareTier = [
    { name: 'Rock Lee', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558131/Rock_Lee_atsmbi.jpg',  power: 75, rarity: 'rare' },
    { name: 'Mikasa',   img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558129/Mikasa_kujzch.jpg',    power: 73, rarity: 'rare' },
    { name: 'Yuji',     img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558135/Yuji_mi5xbd.jpg',      power: 72, rarity: 'rare' },
    { name: 'Killua',   img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558130/Killua_ugn6j3.jpg',    power: 71, rarity: 'rare' },
    { name: 'Tanjiro',  img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558133/Tanjiro_i4qgix.jpg',   power: 70, rarity: 'rare' },
    { name: 'Eren',     img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558127/Eren_Yeager_tmhmlj.jpg',power: 70, rarity: 'rare' },
    { name: 'Nobara',   img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558130/Nobara_eumklm.jpg',    power: 68, rarity: 'rare' },
    { name: 'Nezuko',   img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558129/Nezuko_oi7laj.jpg',    power: 67, rarity: 'rare' },
    { name: 'Hinata',   img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558127/Hinata_fdx7dg.jpg',    power: 66, rarity: 'rare' }
];
const epicTier = [
    { name: 'Luffy',     img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558130/Luffy_qhgaaf.jpg',      power: 93, rarity: 'epic' },
    { name: 'Zoro',      img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558136/Zoro_pjpe20.jpg',       power: 93, rarity: 'epic' },
    { name: 'Sukuna',    img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558133/Sukuna_ebqhi6.jpg',     power: 92, rarity: 'epic' },
    { name: 'Itachi',    img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558128/Itachi_xdtwaw.jpg',     power: 91, rarity: 'epic' },
    { name: 'Yuta',      img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558135/Yuta_aqedjr.jpg',       power: 91, rarity: 'epic' },
    { name: 'Sasuke',    img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558132/Sasuke_huc4nl.jpg',     power: 91, rarity: 'epic' },
    { name: 'Kakashi',   img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558128/kakashi_dsoncb.jpg',    power: 90, rarity: 'epic' },
    { name: 'Yami',      img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558134/Yami_a9oz0l.jpg',       power: 89, rarity: 'epic' },
    { name: 'Igris',     img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558128/Igris_kuhjld.jpg',      power: 88, rarity: 'epic' },
    { name: 'Gaara',     img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558129/Gaara_mr68wx.jpg',      power: 88, rarity: 'epic' },
    { name: 'Asta Black',img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558130/Asta_Black_pip017.jpg', power: 88, rarity: 'epic' },
    { name: 'Sanji',     img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558132/Sanji_w7nfkm.jpg',      power: 87, rarity: 'epic' },
    { name: 'Toji',      img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558134/Toji_rg4w92.jpg',       power: 85, rarity: 'epic' }
];
const mythicalTier = [
    { name: 'Goku',         img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558135/Goku_rsafc4.jpg',           power: 98,  rarity: 'mythical' },
    { name: 'Gojo',         img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558127/Gojo_cvuof0.jpg',           power: 96,  rarity: 'mythical' },
    { name: 'Madara',       img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558130/Madara_n6imes.jpg',         power: 95,  rarity: 'mythical' },
    { name: 'Sung Jin-Woo', img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772558135/Sung-Jin-Woo_sx1aln.jpg',  power: 94,  rarity: 'mythical' },
    { name: 'Naruto',       img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499429/Naruto_ecn9cr.png',         power: 105, rarity: 'mythical' },
    { name: 'Anos Voldigoad',img:'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499423/Anos_Voldigoad_e7tjal.jpg', power: 110, rarity: 'mythical' },
    { name: 'Saitama',      img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499421/Saitama_xh9rca.jpg',       power: 112, rarity: 'mythical' },
    { name: 'Beerus',       img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499420/Beerus_rxypk0.jpg',        power: 111, rarity: 'mythical' },
    { name: 'Kaido',        img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499420/Kaido_awgupa.jpg',         power: 98,  rarity: 'mythical' },
    { name: 'Meliodas',     img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499420/Meliodas_wuuci9.jpg',     power: 101, rarity: 'mythical' },
    { name: 'Vegeta',       img: 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773499419/Vegeta_ntcnl9.jpg',        power: 108, rarity: 'mythical' }
];
const allCards = [...commonTier, ...rareTier, ...epicTier, ...mythicalTier];

// rarity weights for 3-card pack (common-biased)
const rarityWeights = [
    { rarity: 'common',   weight: 60, pool: commonTier },
    { rarity: 'rare',     weight: 25, pool: rareTier   },
    { rarity: 'epic',     weight: 10, pool: epicTier   },
    { rarity: 'mythical', weight:  5, pool: mythicalTier }
];
// rarity weights for 1-card guaranteed-rare pack
const rarePlusWeights = [
    { rarity: 'rare',     weight: 60, pool: rareTier   },
    { rarity: 'epic',     weight: 30, pool: epicTier   },
    { rarity: 'mythical', weight: 10, pool: mythicalTier }
];

// ===== GAME STATE =====
let playerCollection = [];
let activeDeckIds    = [];
let playerHand = [], aiHand = [];
let playerWins = 0, aiWins = 0, animeShards = 0;
let totalMoneyEarned = 0, totalWins = 0, totalLosses = 0, totalRounds = 0;
let username = 'Player';
let currentRound = 1;
let gameActive = false, isAITurn = false, warInProgress = false;
let currentUser    = null;
let lastPlayed     = '--';
let autoSaveInterval = null;
let savePending    = false;
let swiperInstance = null;
let emailVisible   = false;
let wallpaperSetting    = 'default';
let blurLevel           = 0;
let customWallpaperUrl  = '';
let wallpaperLibrary    = [];
let isLowQuality        = false;
let isFirstMatch        = true;  // prevents fake result screen on very first login

// ===== DOM REFS =====
const authOverlay          = document.getElementById('authOverlay');
const loginForm            = document.getElementById('loginForm');
const signupForm           = document.getElementById('signupForm');
const loginBtn             = document.getElementById('loginBtn');
const signupBtn            = document.getElementById('signupBtn');
const googleLoginBtn       = document.getElementById('googleLoginBtn');
const googleSignupBtn      = document.getElementById('googleSignupBtn');
const showSignupLink       = document.getElementById('showSignup');
const showLoginLink        = document.getElementById('showLogin');
const showResetLink        = document.getElementById('showReset');
const loginLoading         = document.getElementById('loginLoading');
const signupLoading        = document.getElementById('signupLoading');
const loginError           = document.getElementById('loginError');
const signupError          = document.getElementById('signupError');
const profileModal         = document.getElementById('profileModal');
const profileBtn           = document.getElementById('profileBtn');
const closeProfileBtn      = document.getElementById('closeProfileBtn');
const logoutBtn            = document.getElementById('logoutBtn');
const manualSaveBtn        = document.getElementById('manualSaveBtn');
const saveUsernameBtn      = document.getElementById('saveUsernameBtn');
const profileUsernameInput = document.getElementById('profileUsernameInput');
const saveStatus           = document.getElementById('saveStatus');
const toggleEmailBtn       = document.getElementById('toggleEmailBtn');
const profileEmail         = document.getElementById('profileEmail');
const swiperWrapper        = document.getElementById('swiperWrapper');
const playerScoreSpan      = document.getElementById('playerScore');
const aiScoreSpan          = document.getElementById('aiScore');
const playerCardsCount     = document.getElementById('playerCardsCount');
const aiCardsCount         = document.getElementById('aiCardsCount');
const aiHandContainer      = document.getElementById('aiHandContainer');
const aiLastPlayedArea     = document.getElementById('aiLastPlayedArea');
const aiLastPlayedCard     = document.getElementById('aiLastPlayedCard');
const aiLastPlayedName     = document.getElementById('aiLastPlayedName');
const roundLogDiv          = document.getElementById('roundLog');
const roundCounter         = document.getElementById('roundCounter');
const playBtn              = document.getElementById('playBtn');
const inventoryBtn         = document.getElementById('inventoryBtn');
const marketBtn            = document.getElementById('marketBtn');
const settingsBtn          = document.getElementById('settingsBtn');
const inventoryModal       = document.getElementById('inventoryModal');
const closeInventoryBtn    = document.getElementById('closeInventoryBtn');
const inventoryGrid        = document.getElementById('inventoryGrid');
const marketModal          = document.getElementById('marketModal');
const closeMarketBtn       = document.getElementById('closeMarketBtn');
const pack3Card            = document.getElementById('pack3Card');
const pack1Card            = document.getElementById('pack1Card');
const packOpenModal        = document.getElementById('packOpenModal');
const packCardsContainer   = document.getElementById('packCardsContainer');
const closePackBtn         = document.getElementById('closePackBtn');
const notification         = document.getElementById('notification');
const warOverlay           = document.getElementById('warOverlay');
const warPlayerCard        = document.getElementById('warPlayerCard');
const warAiCard            = document.getElementById('warAiCard');
const shardSpan            = document.getElementById('shardCount');
const profileTotalCards    = document.getElementById('profileTotalCards');
const profileShards        = document.getElementById('profileShards');
const profileWins          = document.getElementById('profileWins');
const profileLossesEl      = document.getElementById('profileLosses');
const profileRounds        = document.getElementById('profileRounds');
const profileLastOnline    = document.getElementById('profileLastOnline');
const resetModal           = document.getElementById('resetModal');
const closeResetBtn        = document.getElementById('closeResetBtn');
const sendResetBtn         = document.getElementById('sendResetBtn');
const resetEmailInput      = document.getElementById('resetEmailInput');
const resetLoading         = document.getElementById('resetLoading');
const resetError           = document.getElementById('resetError');
const settingsModal        = document.getElementById('settingsModal');
const closeSettingsBtn     = document.getElementById('closeSettingsBtn');
const qualityBtns          = document.querySelectorAll('.quality-btn');
const wallpaperBtns        = document.querySelectorAll('.wallpaper-btn');
const blurSlider           = document.getElementById('blurSlider');
const blurValueEl          = document.getElementById('blurValue');
const wallpaperPreview     = document.getElementById('wallpaperPreview');
const uploadWallpaperBtn   = document.getElementById('uploadWallpaperBtn');
const wallpaperUpload      = document.getElementById('wallpaperUpload');
const pasteWallpaperBtn    = document.getElementById('pasteWallpaperBtn');
const uploadSpinner        = document.getElementById('uploadSpinner');
const wallpaperBg          = document.getElementById('wallpaperBg');
const matchResultOverlay   = document.getElementById('matchResultOverlay');
const matchResultTitle     = document.getElementById('matchResultTitle');
const matchResultScore     = document.getElementById('matchResultScore');
const matchResultSub       = document.getElementById('matchResultSub');

// ===== NOTIFICATION =====
let notifTimer = null;
function showNotification(msg, type = 'info') {
    notification.textContent = msg;
    notification.className = `notification show ${type}`;
    clearTimeout(notifTimer);
    notifTimer = setTimeout(() => notification.classList.remove('show'), 3000);
}

// ===== FIREBASE: SAVE =====
async function savePlayerData(instant = false) {
    if (!currentUser) return;
    if (savePending) return;
    savePending = true;
    try {
        const playerRef = doc(db, 'players', currentUser.uid);
        await setDoc(playerRef, {
            email:            currentUser.email,
            username:         username,
            collection:       playerCollection,
            activeDeckIds:    activeDeckIds,
            shards:           animeShards,
            totalMoneyEarned: totalMoneyEarned,
            totalWins:        totalWins,
            totalLosses:      totalLosses,
            totalRounds:      totalRounds,
            wallpaperSetting: wallpaperSetting,
            blurLevel:        blurLevel,
            customWallpaperUrl: customWallpaperUrl,
            wallpaperLibrary: wallpaperLibrary,
            quality:          isLowQuality ? 'low' : 'high',
            lastOnline:       serverTimestamp(),
            updatedAt:        serverTimestamp()
        }, { merge: true });
        if (instant) {
            saveStatus.textContent = '✅ Saved!';
            saveStatus.classList.add('saved');
            setTimeout(() => {
                saveStatus.textContent = '💾 Auto-save every 5 min';
                saveStatus.classList.remove('saved');
            }, 2000);
        }
    } catch (err) {
        console.error('Save error:', err);
        if (instant) showNotification('❌ Save failed — check connection', 'error');
    } finally {
        savePending = false;
    }
}

// ===== FIREBASE: LOAD =====
async function loadPlayerData() {
    if (!currentUser) return;
    try {
        const playerRef  = doc(db, 'players', currentUser.uid);
        const playerSnap = await getDoc(playerRef);
        if (playerSnap.exists()) {
            const d = playerSnap.data();
            playerCollection   = d.collection       || [];
            activeDeckIds      = d.activeDeckIds     || [];
            animeShards        = d.shards            || 0;
            totalMoneyEarned   = d.totalMoneyEarned  || 0;
            totalWins          = d.totalWins         || 0;
            totalLosses        = d.totalLosses       || 0;
            totalRounds        = d.totalRounds       || 0;
            username           = d.username          || 'Player';
            wallpaperSetting   = d.wallpaperSetting  || 'default';
            blurLevel          = d.blurLevel         || 0;
            customWallpaperUrl = d.customWallpaperUrl|| '';
            wallpaperLibrary   = d.wallpaperLibrary  || [];
            // Restore quality preference
            if (d.quality === 'low') {
                isLowQuality = true;
                document.body.classList.add('low-quality');
                // Sync quality button UI
                qualityBtns.forEach(b => b.classList.toggle('active', b.dataset.quality === 'low'));
            }
            // Read lastOnline BEFORE this session overwrites it
            lastPlayed = d.lastOnline ? formatTimestamp(d.lastOnline) : '--';
            // Seed starter deck for new accounts that somehow have no cards
            if (playerCollection.length === 0) {
                playerCollection = commonTier.slice(0, 5).map(c => ({ ...c, id: crypto.randomUUID(), count: 1 }));
                activeDeckIds    = playerCollection.map(c => c.id);
                await savePlayerData(false);
            }
        } else {
            // Brand-new account
            playerCollection = commonTier.slice(0, 5).map(c => ({ ...c, id: crypto.randomUUID(), count: 1 }));
            activeDeckIds    = playerCollection.map(c => c.id);
            animeShards      = 150; // starter shards
            await savePlayerData(false);
        }
    } catch (err) {
        console.error('Load error:', err);
        showNotification('⚠️ Failed to load save data', 'error');
        // Fall back so game is still playable offline
        if (playerCollection.length === 0) {
            playerCollection = commonTier.slice(0, 5).map(c => ({ ...c, id: crypto.randomUUID(), count: 1 }));
            activeDeckIds    = playerCollection.map(c => c.id);
        }
    }
}

function formatTimestamp(ts) {
    if (!ts) return '--';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(() => {
        if (currentUser && gameActive) savePlayerData(false);
    }, 300000); // every 5 min
}

// ===== AUTH FLOW =====
function showAuthForm(form) {
    loginError.textContent  = '';
    signupError.textContent = '';
    loginForm.style.display  = form === 'login'  ? 'flex' : 'none';
    signupForm.style.display = form === 'signup' ? 'flex' : 'none';
}

loginBtn.addEventListener('click', async () => {
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) { loginError.textContent = 'Please fill in all fields'; return; }
    loginLoading.style.display = 'block';
    loginError.textContent = '';
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        loginError.textContent = friendlyAuthError(err);
    } finally {
        loginLoading.style.display = 'none';
    }
});

signupBtn.addEventListener('click', async () => {
    const email    = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm  = document.getElementById('signupConfirm').value;
    if (!email || !password) { signupError.textContent = 'Please fill in all fields'; return; }
    if (password.length < 6) { signupError.textContent = 'Password must be at least 6 characters'; return; }
    if (password !== confirm) { signupError.textContent = 'Passwords do not match'; return; }
    signupLoading.style.display = 'block';
    signupError.textContent = '';
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
        signupError.textContent = friendlyAuthError(err);
    } finally {
        signupLoading.style.display = 'none';
    }
});

async function handleGoogleSignIn() {
    try {
        googleProvider.setCustomParameters({ prompt: 'select_account' });
        await signInWithPopup(auth, googleProvider);
    } catch (err) {
        if (err.code !== 'auth/popup-closed-by-user')
            showNotification('Google sign-in failed', 'error');
    }
}

function friendlyAuthError(err) {
    const map = {
        'auth/invalid-email':        'Invalid email address.',
        'auth/user-not-found':       'No account with this email.',
        'auth/wrong-password':       'Incorrect password.',
        'auth/email-already-in-use': 'Email already registered.',
        'auth/weak-password':        'Password is too weak.',
        'auth/too-many-requests':    'Too many attempts — try again later.',
        'auth/network-request-failed':'Network error — check connection.'
    };
    return map[err.code] || err.message.replace('Firebase: ', '');
}

googleLoginBtn.addEventListener('click', handleGoogleSignIn);
googleSignupBtn.addEventListener('click', handleGoogleSignIn);
showSignupLink.addEventListener('click', () => showAuthForm('signup'));
showLoginLink.addEventListener('click',  () => showAuthForm('login'));

showResetLink.addEventListener('click', () => {
    resetError.textContent = '';
    resetEmailInput.value  = '';
    resetModal.classList.remove('hidden');
});
closeResetBtn.addEventListener('click', () => resetModal.classList.add('hidden'));

sendResetBtn.addEventListener('click', async () => {
    const email = resetEmailInput.value.trim();
    if (!email) { resetError.textContent = 'Please enter your email'; return; }
    resetLoading.style.display = 'block';
    resetError.textContent = '';
    try {
        await sendPasswordResetEmail(auth, email);
        showNotification('✅ Reset link sent! Check your email.', 'success');
        resetModal.classList.add('hidden');
    } catch (err) {
        resetError.textContent = friendlyAuthError(err);
    } finally {
        resetLoading.style.display = 'none';
    }
});

// ===== AUTH STATE OBSERVER =====
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        authOverlay.classList.add('hidden');
        await loadPlayerData();
        applyWallpaper();
        refreshUI();
        gameActive   = true;
        isFirstMatch = true;
        startAutoSave();
        preloadPlayerCollectionImages(); // non-blocking
        autoRestartMatch();
        showNotification(`⚡ Welcome back, ${username}!`, 'success');
    } else {
        currentUser = null;
        gameActive  = false;
        authOverlay.classList.remove('hidden');
        if (autoSaveInterval) { clearInterval(autoSaveInterval); autoSaveInterval = null; }
    }
});

logoutBtn.addEventListener('click', async () => {
    await savePlayerData(true);
    await signOut(auth);
    profileModal.classList.add('hidden');
    showNotification('Logged out', 'info');
});

manualSaveBtn.addEventListener('click', async () => { await savePlayerData(true); });

// ===== PROFILE =====
saveUsernameBtn.addEventListener('click', async () => {
    if (!currentUser) return;
    const newName = profileUsernameInput.value.trim();
    if (newName.length < 3 || newName.length > 20) {
        showNotification('Username must be 3–20 characters', 'error'); return;
    }
    try {
        await updateDoc(doc(db, 'players', currentUser.uid), { username: newName, updatedAt: serverTimestamp() });
        username = newName;
        saveUsernameBtn.disabled = true;
        showNotification('✅ Username saved!', 'success');
    } catch (err) {
        showNotification('❌ Could not save username', 'error');
    }
});

profileUsernameInput.addEventListener('input', () => {
    const val = profileUsernameInput.value.trim();
    saveUsernameBtn.disabled = !(val.length >= 3 && val !== username);
});

profileBtn.addEventListener('click', () => {
    if (!currentUser) { showNotification('Please login first', 'error'); return; }
    // Populate
    profileEmail.textContent = currentUser.email;
    profileEmail.classList.add('blurred');
    emailVisible = false;
    toggleEmailBtn.innerHTML = '<i class="fas fa-eye"></i>';
    profileUsernameInput.value = username;
    saveUsernameBtn.disabled   = true;
    profileTotalCards.textContent = playerCollection.length;
    profileShards.textContent     = animeShards.toLocaleString();
    profileWins.textContent       = totalWins;
    profileLossesEl.textContent   = totalLosses;
    profileRounds.textContent     = totalRounds;
    profileLastOnline.textContent = `Last Played: ${lastPlayed}`;
    // Rarity breakdown
    const counts = { common: 0, rare: 0, epic: 0, mythical: 0 };
    playerCollection.forEach(c => { if (counts[c.rarity] !== undefined) counts[c.rarity]++; });
    document.getElementById('profileCommonCount').textContent   = counts.common;
    document.getElementById('profileRareCount').textContent     = counts.rare;
    document.getElementById('profileEpicCount').textContent     = counts.epic;
    document.getElementById('profileMythicalCount').textContent = counts.mythical;
    profileModal.classList.remove('hidden');
});

closeProfileBtn.addEventListener('click', () => profileModal.classList.add('hidden'));

toggleEmailBtn.addEventListener('click', () => {
    emailVisible = !emailVisible;
    profileEmail.classList.toggle('blurred', !emailVisible);
    toggleEmailBtn.innerHTML = emailVisible ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
});

// ===== QUALITY SYSTEM — real, one mode at a time =====
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    renderWallpaperLibrary();
});
closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
    savePlayerData(false); // persist quality + blur changes
});

qualityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        qualityBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        isLowQuality = btn.dataset.quality === 'low';
        document.body.classList.toggle('low-quality', isLowQuality);
    });
});

// ===== WALLPAPER SYSTEM =====
// Bug fix: wallpaperPreview must NOT use background-attachment:fixed
// (fixed causes the preview box to scroll-through instead of filling)
function setElWallpaper(el, setting, url, isPreview = false) {
    // Fully reset inline styles first
    el.style.cssText = '';
    const attach = isPreview ? 'scroll' : 'fixed';

    if (setting === 'space') {
        const spaceUrl = 'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773501301/background_1_auwd54.jpg';
        el.style.backgroundImage      = `url("${spaceUrl}")`;
        el.style.backgroundSize       = 'cover';
        el.style.backgroundPosition   = 'center center';
        el.style.backgroundRepeat     = 'no-repeat';
        el.style.backgroundAttachment = attach;
    } else if (setting === 'custom' && url) {
        el.style.backgroundImage      = `url("${url}")`;
        el.style.backgroundSize       = 'cover';
        el.style.backgroundPosition   = 'center center';
        el.style.backgroundRepeat     = 'no-repeat';
        el.style.backgroundAttachment = attach;
    } else {
        // default gradient
        el.style.background = 'linear-gradient(135deg,#1a0a2e 0%,#16213e 50%,#0f0f23 100%)';
    }
}

function applyWallpaper() {
    setElWallpaper(wallpaperBg,      wallpaperSetting, customWallpaperUrl, false);
    setElWallpaper(wallpaperPreview, wallpaperSetting, customWallpaperUrl, true);
    // Sync blur
    const blurPx = (blurLevel / 100) * 10;
    document.documentElement.style.setProperty('--wallpaper-blur', `${blurPx}px`);
    blurSlider.value        = blurLevel;
    blurValueEl.textContent = blurLevel;
    // Sync active button
    wallpaperBtns.forEach(b => b.classList.toggle('active', b.dataset.wallpaper === wallpaperSetting));
    renderWallpaperLibrary();
}

wallpaperBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        wallpaperSetting = btn.dataset.wallpaper;
        applyWallpaper();
        savePlayerData(false);
    });
});

blurSlider.addEventListener('input', () => {
    blurLevel = parseInt(blurSlider.value, 10);
    blurValueEl.textContent = blurLevel;
    document.documentElement.style.setProperty('--wallpaper-blur', `${(blurLevel / 100) * 10}px`);
    if (currentUser) savePlayerData(false);
});

uploadWallpaperBtn.addEventListener('click', () => wallpaperUpload.click());

async function uploadWallpaperBlob(blob, fileName = `clipboard_${Date.now()}.png`) {
    if (!currentUser) return;
    showNotification('⏳ Uploading wallpaper…', 'info');
    if (uploadSpinner) uploadSpinner.style.display = 'inline-block';
    try {
        const filename = `wallpapers/${currentUser.uid}/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const sRef     = ref(storage, filename);
        const snapshot = await uploadBytes(sRef, blob);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        await WallpaperDB.save(downloadUrl, blob);
        const entry = {
            url:       downloadUrl,
            name:      fileName.substring(0, 30),
            timestamp: Date.now()
        };
        wallpaperLibrary.unshift(entry);
        if (wallpaperLibrary.length > 30) wallpaperLibrary = wallpaperLibrary.slice(0, 30);
        customWallpaperUrl = downloadUrl;
        wallpaperSetting   = 'custom';
        applyWallpaper();
        showNotification('✅ Wallpaper saved!', 'success');
        await savePlayerData(true);
        renderWallpaperLibrary();
    } catch (err) {
        console.error('Upload error:', err);
        showNotification('❌ Upload failed', 'error');
    } finally {
        if (uploadSpinner) uploadSpinner.style.display = 'none';
    }
}

async function handlePasteFromClipboard() {
    if (!currentUser) { showNotification('Login first', 'error'); return; }
    try {
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
            const imageTypes = item.types.filter(type => type.startsWith('image/'));
            if (imageTypes.length === 0) continue;
            const blob = await item.getType(imageTypes[0]);
            if (blob) {
                await uploadWallpaperBlob(blob);
                return;
            }
        }
        showNotification('No image found in clipboard', 'error');
    } catch (err) {
        console.error('Clipboard read error:', err);
        showNotification('Clipboard access denied. Allow permission.', 'error');
    }
}

wallpaperUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;
    if (!file.type.startsWith('image/')) {
        showNotification('Only images allowed', 'error');
        wallpaperUpload.value = '';
        return;
    }
    await uploadWallpaperBlob(file, file.name);
    wallpaperUpload.value = '';
});

pasteWallpaperBtn?.addEventListener('click', handlePasteFromClipboard);

function renderWallpaperLibrary() {
    const container = document.getElementById('wallpaperLibraryGrid');
    if (!container) return;
    container.innerHTML = '';
    if (wallpaperLibrary.length === 0) {
        container.innerHTML = '<p class="wl-empty">No wallpapers uploaded yet</p>';
        return;
    }
    wallpaperLibrary.forEach((entry, index) => {
        const thumb = document.createElement('div');
        const isActive = (customWallpaperUrl === entry.url && wallpaperSetting === 'custom');
        thumb.className = 'wallpaper-thumb' + (isActive ? ' active' : '');
        thumb.style.backgroundImage    = `url("${entry.url}")`;
        thumb.style.backgroundSize     = 'cover';
        thumb.style.backgroundPosition = 'center';
        thumb.title = entry.name;

        thumb.addEventListener('click', () => {
            customWallpaperUrl = entry.url;
            wallpaperSetting   = 'custom';
            applyWallpaper();
            savePlayerData(false);
            showNotification('🖼️ Wallpaper applied!', 'success');
        });

        const del = document.createElement('button');
        del.className = 'wallpaper-thumb-delete';
        del.textContent = '✕';
        del.title = 'Remove';
        del.addEventListener('click', async (ev) => {
            ev.stopPropagation();
            wallpaperLibrary.splice(index, 1);
            await WallpaperDB.delete(entry.url);
            if (customWallpaperUrl === entry.url) {
                if (wallpaperLibrary.length > 0) {
                    customWallpaperUrl = wallpaperLibrary[0].url;
                    wallpaperSetting   = 'custom';
                } else {
                    customWallpaperUrl = '';
                    wallpaperSetting   = 'default';
                }
                applyWallpaper();
            }
            renderWallpaperLibrary();
            savePlayerData(false);
        });

        thumb.appendChild(del);
        container.appendChild(thumb);
    });
}

// ===== IMAGE PRELOADING (post-login, non-blocking) =====
function preloadImages(urls, priority = false) {
    urls.forEach(url => {
        if (!url) return;
        const img = new Image();
        if (priority) img.fetchPriority = 'high';
        img.src = url;
    });
}

async function preloadPlayerCollectionImages() {
    // Background: warm up full card DB
    preloadImages(allCards.map(c => c.img), false);
    // Priority: player's own collection
    preloadImages(playerCollection.map(c => c.img).filter(Boolean), true);
    // Pack artwork
    preloadImages([
        'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772603856/3-Card_Pack_100_mdhkfz.jpg',
        'https://res.cloudinary.com/dgzhxztx0/image/upload/v1772603856/1-Card_Pack_50_tjyfaf.jpg',
        'https://res.cloudinary.com/dgzhxztx0/image/upload/v1773501301/background_1_auwd54.jpg'
    ], false);
    // Warm up IndexedDB wallpaper blobs
    try {
        const cached = await WallpaperDB.getAll();
        cached.forEach(entry => {
            if (!entry.blob) return;
            const objUrl = URL.createObjectURL(entry.blob);
            const img = new Image();
            img.onload = img.onerror = () => URL.revokeObjectURL(objUrl);
            img.src = objUrl;
        });
    } catch (e) {}
}

// ===== GAME LOGIC =====
function log(msg) {
    const p = document.createElement('p');
    p.textContent = msg;
    roundLogDiv.appendChild(p);
    roundLogDiv.scrollTop = roundLogDiv.scrollHeight;
    while (roundLogDiv.children.length > 6) roundLogDiv.removeChild(roundLogDiv.firstChild);
}

function getAIDifficulty() {
    if (totalRounds < 8)  return 'easy';
    if (totalRounds < 20) return 'medium';
    if (totalRounds < 35) return 'hard';
    return 'impossible';
}

function getDifficultyLabel() {
    return { easy:'🟢 Rookie', medium:'🟡 Fighter', hard:'🟠 Elite', impossible:'🔴 Legend' }[getAIDifficulty()];
}

function drawAIHand() {
    const lvl = getAIDifficulty();
    let pool;
    if      (lvl === 'easy')       pool = [...commonTier, ...rareTier.slice(0, 2)];
    else if (lvl === 'medium')     pool = [...commonTier, ...rareTier, ...epicTier.slice(0, 2)];
    else if (lvl === 'hard')       pool = [...rareTier,   ...epicTier.slice(0, 4)];
    else                           pool = [...epicTier,   ...mythicalTier.slice(0, 2)];
    // Ensure at least 5
    while (pool.length < 5) pool.push(...commonTier);
    return pool.sort(() => Math.random() - 0.5).slice(0, 5).map(c => ({ ...c }));
}

function drawPlayerHand() {
    const deck = playerCollection.filter(c => activeDeckIds.includes(c.id));
    if (deck.length === 0) return playerCollection.slice(0, 5).map(c => ({ ...c }));
    return deck.sort(() => Math.random() - 0.5).slice(0, 5).map(c => ({ ...c }));
}

function renderAIHand() {
    aiHandContainer.innerHTML = '';
    aiHand.forEach(card => {
        const div = document.createElement('div');
        div.className = 'ai-card';
        div.style.backgroundImage    = `url('${card.img}')`;
        div.style.backgroundSize     = 'cover';
        div.style.backgroundPosition = 'center';
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
        slide.dataset.rarity = card.rarity;
        slide.style.backgroundImage    = `url('${card.img}')`;
        slide.style.backgroundSize     = 'cover';
        slide.style.backgroundPosition = 'center';
        const rarityBadge = {
            rare:     '<span class="rarity-badge rare">RARE</span>',
            epic:     '<span class="rarity-badge epic">EPIC</span>',
            mythical: '<span class="rarity-badge mythical">✦ MYTHICAL</span>'
        }[card.rarity] || '';
        slide.innerHTML = `<span class="power-badge">⚡${card.power}</span><h4>${card.name}</h4>${rarityBadge}`;
        swiperWrapper.appendChild(slide);
    });

    // Destroy old swiper safely
    if (swiperInstance) {
        try { swiperInstance.destroy(true, true); } catch(e) {}
        swiperInstance = null;
    }

    if (playerHand.length === 0) {
        playerCardsCount.textContent = 0;
        return;
    }

    // Small delay so DOM is ready
    requestAnimationFrame(() => {
        try {
            swiperInstance = new Swiper('.mySwiper', {
                effect:      'cards',
                grabCursor:  true,
                initialSlide: 0,
                loop:        false,
                rotate:      true,
                speed:       isLowQuality ? 180 : 380,
                cardsEffect: {
                    perSlideOffset: 10,
                    perSlideRotate: 2,
                    slideShadows:   !isLowQuality
                }
            });
        } catch(e) { console.warn('Swiper init error:', e); }
    });

    playerCardsCount.textContent = playerHand.length;
    playBtn.disabled = false;
}

function refreshUI() {
    playerScoreSpan.textContent = playerWins;
    aiScoreSpan.textContent     = aiWins;
    shardSpan.textContent       = animeShards.toLocaleString();
    playerCardsCount.textContent= playerHand.length;
    aiCardsCount.textContent    = aiHand.length;
    // Difficulty badge
    const diffEl = document.getElementById('difficultyLabel');
    if (diffEl) diffEl.textContent = getDifficultyLabel();
    // Shard pop animation
    const sc = document.querySelector('.shards-corner');
    if (sc) {
        sc.classList.remove('pop');
        void sc.offsetWidth; // force reflow
        sc.classList.add('pop');
        setTimeout(() => sc.classList.remove('pop'), 420);
    }
}

function setButtonsEnabled(on) {
    [inventoryBtn, marketBtn, profileBtn, settingsBtn, playBtn].forEach(b => {
        if (b) b.disabled = !on;
    });
}

// ===== WAR ANIMATION =====
function animateWar(pCard, aCard, playerWon) {
    return new Promise(resolve => {
        // Show overlay
        warOverlay.style.display = 'flex';
        warOverlay.classList.remove('hidden');

        // Set card backgrounds
        warPlayerCard.style.backgroundImage    = `url('${pCard.img}')`;
        warPlayerCard.style.backgroundSize     = 'cover';
        warPlayerCard.style.backgroundPosition = 'center';
        warAiCard.style.backgroundImage        = `url('${aCard.img}')`;
        warAiCard.style.backgroundSize         = 'cover';
        warAiCard.style.backgroundPosition     = 'center';

        // Set power & labels
        warPlayerCard.querySelector('.war-power').textContent = `⚡${pCard.power}`;
        warAiCard.querySelector('.war-power').textContent     = `⚡${aCard.power}`;
        const pLabel = warPlayerCard.querySelector('.war-label');
        const aLabel = warAiCard.querySelector('.war-label');
        pLabel.textContent = playerWon ? 'VICTORY' : 'DEFEAT';
        aLabel.textContent = playerWon ? 'DEFEAT'  : 'VICTORY';

        // Reset animation classes
        warPlayerCard.className = 'war-card';
        warAiCard.className     = 'war-card';

        const fast = isLowQuality;
        const t1 = fast ? 30   : 60;   // reveal delay
        const t2 = fast ? 350  : 800;  // winner glow delay
        const t3 = fast ? 1400 : 3200; // total display time

        setTimeout(() => {
            warPlayerCard.classList.add('revealed');
            warAiCard.classList.add('revealed');
        }, t1);

        setTimeout(() => {
            if (playerWon) warPlayerCard.classList.add('winner');
            else           warAiCard.classList.add('winner');
        }, t2);

        setTimeout(() => {
            warOverlay.classList.add('hidden');
            // Use transitionend fallback
            setTimeout(() => {
                warOverlay.style.display = 'none';
                resolve();
            }, 350);
        }, t3);
    });
}

// ===== PLAY ROUND =====
async function playRound() {
    if (!gameActive || isAITurn || warInProgress) return;
    if (!playerHand.length || !aiHand.length) { autoRestartMatch(); return; }

    const activeIndex = swiperInstance?.activeIndex ?? 0;
    const playerCard  = playerHand[Math.min(activeIndex, playerHand.length - 1)];
    if (!playerCard) return;

    isAITurn = true; warInProgress = true;
    playBtn.disabled = true;
    setButtonsEnabled(false);

    // AI "thinking" — only visual, cards shuffle
    const aiEls = document.querySelectorAll('.ai-card');
    aiEls.forEach(el => el.classList.add('swapping'));
    await new Promise(r => setTimeout(r, isLowQuality ? 150 : 450));
    aiEls.forEach(el => el.classList.remove('swapping'));
    aiEls.forEach(el => el.classList.add('thinking'));
    await new Promise(r => setTimeout(r, isLowQuality ? 200 : 700));
    aiEls.forEach(el => el.classList.remove('thinking'));

    // AI decision logic
    const lvl     = getAIDifficulty();
    const sorted  = [...aiHand].sort((a, b) => a.power - b.power);
    const higher  = sorted.find(c => c.power >= playerCard.power);
    let aiIdx;

    if (lvl === 'easy') {
        if (Math.random() < 0.45) {
            aiIdx = Math.floor(Math.random() * aiHand.length);
        } else {
            const weaker = sorted.filter(c => c.power < playerCard.power);
            const pick   = weaker.length ? weaker[Math.floor(Math.random() * weaker.length)] : sorted[0];
            aiIdx = aiHand.findIndex(c => c.name === pick.name);
        }
    } else if (lvl === 'medium') {
        aiIdx = (higher && Math.random() < 0.65)
            ? aiHand.findIndex(c => c.name === higher.name)
            : Math.floor(Math.random() * aiHand.length);
    } else {
        // hard / impossible — always plays best counter
        aiIdx = higher
            ? aiHand.findIndex(c => c.name === higher.name)
            : aiHand.findIndex(c => c.name === sorted[sorted.length - 1].name);
    }

    const aiCard    = aiHand[aiIdx];
    const playerWon = playerCard.power >= aiCard.power;

    await animateWar(playerCard, aiCard, playerWon);

    // Show AI's last played
    aiLastPlayedCard.style.backgroundImage    = `url('${aiCard.img}')`;
    aiLastPlayedCard.style.backgroundSize     = 'cover';
    aiLastPlayedCard.style.backgroundPosition = 'center';
    aiLastPlayedName.textContent = `${aiCard.name} (⚡${aiCard.power})`;
    aiLastPlayedArea.classList.add('visible');

    aiLastPlayedCard.classList.remove('spin-reveal');
    void aiLastPlayedCard.offsetWidth;
    aiLastPlayedCard.classList.add('spin-reveal');
    setTimeout(() => aiLastPlayedCard.classList.remove('spin-reveal'), 800);

    // Score & shards
    if (playerWon) {
        playerWins++;
        animeShards += 10; totalMoneyEarned += 10;
        playerScoreSpan.classList.add('score-change');
        setTimeout(() => playerScoreSpan.classList.remove('score-change'), 500);
        log(`✅ R${currentRound} WIN +10🪙 · ${playerCard.name}(${playerCard.power}) vs ${aiCard.name}(${aiCard.power})`);
    } else {
        aiWins++;
        animeShards += 5; totalMoneyEarned += 5;
        aiScoreSpan.classList.add('score-change');
        setTimeout(() => aiScoreSpan.classList.remove('score-change'), 500);
        log(`❌ R${currentRound} LOSE +5🪙 · ${aiCard.name}(${aiCard.power}) beat ${playerCard.name}(${playerCard.power})`);
    }

    playerHand.splice(activeIndex, 1);
    aiHand.splice(aiIdx, 1);
    totalRounds++; currentRound++;

    renderPlayerHand();
    renderAIHand();
    refreshUI();

    roundCounter.classList.remove('round-change');
    void roundCounter.offsetWidth;
    roundCounter.classList.add('round-change');
    roundCounter.textContent = `R${currentRound}`;
    setTimeout(() => roundCounter.classList.remove('round-change'), 500);

    // Background save (not instant)
    savePlayerData(false);

    setTimeout(() => {
        aiLastPlayedArea.classList.remove('visible');
        isAITurn = false; warInProgress = false;
        playBtn.disabled = false;
        setButtonsEnabled(true);
        if (!playerHand.length || !aiHand.length) autoRestartMatch();
    }, isLowQuality ? 800 : 1200);
}

// ===== MATCH RESULT =====
function showMatchResult(playerWon, pScore, aScore) {
    return new Promise(resolve => {
        matchResultTitle.textContent = playerWon ? '🏆 YOU WIN!' : '💀 YOU LOSE';
        matchResultTitle.className   = 'match-result-title' + (playerWon ? '' : ' loss');
        matchResultScore.textContent = `${pScore} — ${aScore}`;
        const bonus = playerWon ? 25 : 10;
        animeShards        += bonus;
        totalMoneyEarned   += bonus;
        matchResultSub.textContent = `+${bonus} 🪙 match bonus`;
        matchResultOverlay.classList.remove('hidden');
        const hold = isLowQuality ? 1600 : 2600;
        setTimeout(() => {
            matchResultOverlay.classList.add('hidden');
            resolve();
        }, hold);
    });
}

// ===== AUTO RESTART MATCH =====
async function autoRestartMatch() {
    // Show result screen only if at least one round was played and it's not first login
    if (!isFirstMatch && currentRound > 1) {
        if (playerWins > aiWins) totalWins++;
        else                     totalLosses++;
        await showMatchResult(playerWins > aiWins, playerWins, aiWins);
    }
    isFirstMatch = false;

    // Reset match
    playerWins = 0; aiWins = 0; currentRound = 1;
    playerHand = drawPlayerHand();
    aiHand     = drawAIHand();

    renderPlayerHand();
    renderAIHand();
    refreshUI();

    roundCounter.textContent = 'R1';
    aiLastPlayedArea.classList.remove('visible');
    roundLogDiv.innerHTML = '';

    log('⚔️ New match started!');
    log(`💡 Swipe cards — tap PLAY to battle! ${getDifficultyLabel()}`);

    isAITurn = false; warInProgress = false;
    playBtn.disabled = false;
    setButtonsEnabled(true);

    savePlayerData(false);
}

// ===== RARITY DRAW HELPERS =====
function drawFromWeights(weights) {
    const total = weights.reduce((s, r) => s + r.weight, 0);
    let rand = Math.random() * total;
    for (const r of weights) {
        if (rand < r.weight) return r;
        rand -= r.weight;
    }
    return weights[0];
}

function makeCard(pool) {
    const src = pool[Math.floor(Math.random() * pool.length)];
    return { ...src, id: crypto.randomUUID(), count: 1 };
}

// ===== INVENTORY =====
function openInventory() {
    inventoryGrid.innerHTML = '';
    const cardMap = new Map();
    playerCollection.forEach(card => {
        const key = card.name;
        if (cardMap.has(key)) {
            cardMap.get(key).count = (cardMap.get(key).count || 1) + 1;
        } else {
            cardMap.set(key, { ...card, count: card.count || 1 });
        }
    });
    let stacked = Array.from(cardMap.values()).sort((a, b) => b.power - a.power);

    const rarityFilter = document.getElementById('inventoryRarityFilter')?.value || 'all';
    const sortFilter   = document.getElementById('inventorySortFilter')?.value   || 'power-desc';
    const searchTerm   = document.getElementById('inventorySearch')?.value.toLowerCase() || '';

    if (rarityFilter !== 'all') stacked = stacked.filter(c => c.rarity === rarityFilter);
    if (searchTerm)             stacked = stacked.filter(c => c.name.toLowerCase().includes(searchTerm));
    if (sortFilter === 'power-asc')  stacked.sort((a, b) => a.power - b.power);
    else                             stacked.sort((a, b) => b.power - a.power);

    const deckSizeEl   = document.getElementById('deckSizeCount');
    const totalCardsEl = document.getElementById('totalCardsCount');
    if (deckSizeEl)   deckSizeEl.textContent   = `${activeDeckIds.length}/10`;
    if (totalCardsEl) totalCardsEl.textContent = playerCollection.length;

    stacked.forEach(card => {
        const div = document.createElement('div');
        div.className = `inventory-card rarity-${card.rarity}${activeDeckIds.includes(card.id) ? ' selected' : ''}`;
        div.style.backgroundImage    = `url('${card.img}')`;
        div.style.backgroundSize     = 'cover';
        div.style.backgroundPosition = 'center';
        div.innerHTML = `
            <span class="power-badge">⚡${card.power}</span>
            <h4>${card.name}</h4>
            ${card.count > 1 ? `<span class="stack-count">×${card.count}</span>` : ''}
            <div class="rarity-strip ${card.rarity}"></div>`;
        div.addEventListener('click', () => {
            if (activeDeckIds.includes(card.id)) {
                if (activeDeckIds.length <= 1) { showNotification('Deck must have at least 1 card', 'error'); return; }
                activeDeckIds = activeDeckIds.filter(id => id !== card.id);
                div.classList.remove('selected');
            } else {
                if (activeDeckIds.length >= 10) { showNotification('Deck max 10 cards', 'error'); return; }
                activeDeckIds.push(card.id);
                div.classList.add('selected');
            }
            if (deckSizeEl) deckSizeEl.textContent = `${activeDeckIds.length}/10`;
        });
        inventoryGrid.appendChild(div);
    });
    inventoryModal.classList.remove('hidden');
}

// ===== PACK OPENING =====
function openPack(cardCount, weights, price) {
    if (animeShards < price) { showNotification(`Need ${price} 🪙`, 'error'); return; }
    animeShards -= price;
    refreshUI();

    const newCards = [];
    for (let i = 0; i < cardCount; i++) {
        const rarityObj = drawFromWeights(weights);
        newCards.push(makeCard(rarityObj.pool));
    }
    newCards.forEach(c => playerCollection.push(c));

    packCardsContainer.innerHTML = '';
    newCards.forEach(c => {
        const div = document.createElement('div');
        div.className = `pack-card ${c.rarity}`;
        div.style.backgroundImage    = `url('${c.img}')`;
        div.style.backgroundSize     = 'cover';
        div.style.backgroundPosition = 'center';
        div.innerHTML = `<span class="power-badge">⚡${c.power}</span><h4>${c.name}</h4>`;
        packCardsContainer.appendChild(div);
    });
    packOpenModal.classList.remove('hidden');

    const hasMythical = newCards.some(c => c.rarity === 'mythical');
    const hasEpic     = newCards.some(c => c.rarity === 'epic');
    if      (hasMythical) showNotification('✨ MYTHICAL PULLED! 🔥🔥🔥', 'success');
    else if (hasEpic)     showNotification('💜 EPIC card pulled!', 'success');
    else                  showNotification(`+${cardCount} card${cardCount > 1 ? 's' : ''} added!`, 'info');

    savePlayerData(false);
}

// ===== EVENT LISTENERS =====
playBtn.addEventListener('click', playRound);

inventoryBtn.addEventListener('click', openInventory);

document.addEventListener('input',  e => { if (e.target.id === 'inventorySearch')        openInventory(); });
document.addEventListener('change', e => { if (e.target.id === 'inventoryRarityFilter' || e.target.id === 'inventorySortFilter') openInventory(); });

closeInventoryBtn.addEventListener('click', async () => {
    inventoryModal.classList.add('hidden');
    await savePlayerData(true);
});

marketBtn.addEventListener('click', () => {
    marketModal.classList.remove('hidden');
});

closeMarketBtn.addEventListener('click', () => marketModal.classList.add('hidden'));

// 3-card pack: common-biased weights
pack3Card.addEventListener('click', () => {
    openPack(3, rarityWeights, 100);
    marketModal.classList.add('hidden');
});
// 1-card pack: guaranteed Rare+
pack1Card.addEventListener('click', () => {
    openPack(1, rarePlusWeights, 50);
    marketModal.classList.add('hidden');
});

closePackBtn.addEventListener('click', async () => {
    packOpenModal.classList.add('hidden');
    await savePlayerData(true);
});

// Keyboard: press Space or Enter to play (only when no modal is open)
document.addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.code === 'Enter') && !playBtn.disabled
        && profileModal.classList.contains('hidden')
        && inventoryModal.classList.contains('hidden')
        && marketModal.classList.contains('hidden')
        && settingsModal.classList.contains('hidden')
        && packOpenModal.classList.contains('hidden')) {
        e.preventDefault();
        playRound();
    }
});

// ===== BOOT — show empty UI while waiting for auth =====
refreshUI();
