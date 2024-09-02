document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url');
    const goButton = document.getElementById('goButton');
    const backButton = document.getElementById('backButton');
    const forwardButton = document.getElementById('forwardButton');
    const refreshButton = document.getElementById('refreshButton');
    const homeButton = document.getElementById('homeButton');
    const bookmarkButton = document.getElementById('bookmarkButton');
    const bookmarkIcon = document.getElementById('bookmarkIcon');
    const browserFrame = document.getElementById('browserFrame');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const bookmarksDiv = document.getElementById('bookmarks');
    const bookmarkList = document.getElementById('bookmarkList');
    const bookmarkModal = document.getElementById('bookmarkModal');
    const modalTitle = document.getElementById('modalTitle');
    const bookmarkNameInput = document.getElementById('bookmarkName');
    const saveBookmarkButton = document.getElementById('saveBookmarkButton');
    const removeBookmarkButton = document.getElementById('removeBookmarkButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const discordButton = document.getElementById('discordButton');
    const closeBookmarkPanelButton = document.getElementById('closeBookmarkPanelButton');

    const homeUrl = 'https://www.youtube.com/@zit-x-cheat';
    const allowedDomains = ['youtube.com'];

    let history = [];
    let historyIndex = -1;
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    function loadUrl(url) {
        if (url) {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'http://' + url;
            }
            browserFrame.src = url;
            history = history.slice(0, historyIndex + 1);
            history.push(url);
            historyIndex++;
            updateNavigationButtons();
            updateBookmarkButton();
            toggleBookmarkButton();
        }
    }

    function updateNavigationButtons() {
        backButton.disabled = historyIndex <= 0;
        forwardButton.disabled = historyIndex >= history.length - 1;
    }

    function updateBookmarkButton() {
        const currentUrl = browserFrame.src;
        const isBookmarked = bookmarks.some(b => b.url === currentUrl);
        bookmarkIcon.classList.toggle('blue', isBookmarked);
    }

    function openBookmarkModal(edit = false) {
        if (canOpenBookmarkPanel()) {
            bookmarkModal.classList.remove('hidden');
            if (edit) {
                modalTitle.textContent = 'Edit Bookmark';
                const currentUrl = browserFrame.src;
                const bookmark = bookmarks.find(b => b.url === currentUrl);
                bookmarkNameInput.value = bookmark ? bookmark.title : '';
                removeBookmarkButton.classList.remove('hidden');
            } else {
                modalTitle.textContent = 'Add Bookmark';
                bookmarkNameInput.value = '';
                removeBookmarkButton.classList.add('hidden');
            }
        } else {
            alert('Bookmarks can only be managed on allowed sites like YouTube.');
        }
    }

    function closeBookmarkModal() {
        bookmarkModal.classList.add('hidden');
    }

    function closeBookmarksPanel() {
        bookmarksDiv.classList.add('hidden');
    }

    function toggleBookmarkButton() {
        const currentUrl = browserFrame.src;
        const domain = new URL(currentUrl).hostname;
        const isAllowedDomain = allowedDomains.some(allowed => domain.includes(allowed));
        bookmarkButton.disabled = !isAllowedDomain;
        if (!isAllowedDomain) {
            bookmarksDiv.classList.add('hidden');
        }
    }

    function canOpenBookmarkPanel() {
        const currentUrl = browserFrame.src;
        const domain = new URL(currentUrl).hostname;
        return allowedDomains.some(allowed => domain.includes(allowed));
    }

    function updateBookmarks() {
        bookmarkList.innerHTML = '';
        bookmarks.forEach((bookmark) => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = bookmark.url;
            link.textContent = bookmark.title || bookmark.url;
            link.target = '_blank';
            listItem.appendChild(link);
            bookmarkList.appendChild(listItem);
        });
    }

    // Event listeners
    goButton.addEventListener('click', () => loadUrl(urlInput.value));
    urlInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            loadUrl(urlInput.value);
        }
    });

    backButton.addEventListener('click', () => {
        if (historyIndex > 0) {
            historyIndex--;
            browserFrame.src = history[historyIndex];
            updateNavigationButtons();
        }
    });

    forwardButton.addEventListener('click', () => {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            browserFrame.src = history[historyIndex];
            updateNavigationButtons();
        }
    });

    refreshButton.addEventListener('click', () => {
        browserFrame.src = browserFrame.src;
    });

    homeButton.addEventListener('click', () => {
        loadUrl(homeUrl);
    });

    bookmarkButton.addEventListener('click', () => {
        const currentUrl = browserFrame.src;
        if (bookmarkIcon.classList.contains('blue')) {
            openBookmarkModal(true);
        } else {
            openBookmarkModal(false);
        }
    });

    saveBookmarkButton.addEventListener('click', () => {
        const name = bookmarkNameInput.value.trim();
        const url = browserFrame.src;
        if (name) {
            const existingIndex = bookmarks.findIndex(b => b.url === url);
            if (existingIndex > -1) {
                bookmarks[existingIndex].title = name;
            } else {
                bookmarks.push({ url, title: name });
            }
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            updateBookmarks();
            closeBookmarkModal();
            updateBookmarkButton();
        }
    });

    removeBookmarkButton.addEventListener('click', () => {
        const url = browserFrame.src;
        bookmarks = bookmarks.filter(b => b.url !== url);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        updateBookmarks();
        closeBookmarkModal();
        updateBookmarkButton();
    });

    closeModalButton.addEventListener('click', () => {
        closeBookmarkModal();
    });

    closeBookmarkPanelButton.addEventListener('click', () => {
        closeBookmarksPanel();
    });

    discordButton.addEventListener('click', () => {
        window.open('https://discord.gg/your-discord-invite', '_blank');
    });

    browserFrame.addEventListener('load', () => {
        loadingIndicator.style.display = 'none';
        urlInput.value = browserFrame.src;
        updateBookmarkButton();
        toggleBookmarkButton();
    });

    browserFrame.addEventListener('beforeunload', () => {
        loadingIndicator.style.display = 'block';
    });

    urlInput.value = homeUrl;
    browserFrame.src = homeUrl;
    updateBookmarks();
    toggleBookmarkButton();
});
