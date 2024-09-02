document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url');
    const goButton = document.getElementById('goButton');
    const backButton = document.getElementById('backButton');
    const forwardButton = document.getElementById('forwardButton');
    const refreshButton = document.getElementById('refreshButton');
    const homeButton = document.getElementById('homeButton');
    const bookmarkButton = document.getElementById('bookmarkButton');
    const browserFrame = document.getElementById('browserFrame');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const bookmarksDiv = document.getElementById('bookmarks');
    const bookmarkList = document.getElementById('bookmarkList');

    const homeUrl = 'https://www.example.com';

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
        }
    }

    function updateNavigationButtons() {
        backButton.disabled = historyIndex <= 0;
        forwardButton.disabled = historyIndex >= history.length - 1;
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

    browserFrame.addEventListener('load', () => {
        loadingIndicator.style.display = 'none';
        urlInput.value = browserFrame.src;
    });

    browserFrame.addEventListener('beforeunload', () => {
        loadingIndicator.style.display = 'block';
    });

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
        if (!bookmarks.some(b => b.url === currentUrl)) {
            bookmarks.push({ url: currentUrl, title: document.title });
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            updateBookmarks();
        }
        bookmarksDiv.classList.toggle('hidden');
    });

    // Initialize
    urlInput.value = homeUrl;
    updateBookmarks();
});
