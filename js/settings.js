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
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File too large (max 5MB)', 'error');
        return;
    }
    try {
        const storageRef = ref(storage, `wallpapers/${currentUser.uid}_${Date.now()}`);
        await uploadBytes(storageRef, file);
        customWallpaperUrl = await getDownloadURL(storageRef);
        wallpaperSetting = 'custom';
        wallpaperBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-wallpaper="custom"]').classList.add('active');
        applyWallpaper();
        showNotification('Wallpaper uploaded!', 'success');
        await savePlayerData(true);
    } catch (error) {
        console.error('Upload error:', error);
        showNotification('Upload failed', 'error');
    }
});

function applyWallpaper() {
    let bg;
    if (wallpaperSetting === 'default') {
        bg = wallpapers.default;
    } else if (wallpaperSetting === 'space') {
        bg = wallpapers.space;
    } else if (wallpaperSetting === 'custom' && customWallpaperUrl) {
        bg = `url("${customWallpaperUrl}") center/cover`;
    } else {
        bg = wallpapers.default;
    }
    wallpaperBg.style.background = bg;
    wallpaperPreview.style.background = bg;
    blurSlider.value = blurLevel;
    blurValue.textContent = blurLevel;
    document.documentElement.style.setProperty('--wallpaper-blur', `${blurLevel / 100 * 10}px`);
}