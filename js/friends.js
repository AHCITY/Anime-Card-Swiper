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