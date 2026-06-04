document.addEventListener('DOMContentLoaded', () => {
    initThemeControl();
    initReadingProgressBar();
    initLocalStorageComments();
});

/**
 * 1. Dark/Light Theme
 */
function initThemeControl() {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;

    // Check localStorage for preferred theme settings
    const activeTheme = localStorage.getItem('afriblog-theme') || 'light';
    setThemeState(activeTheme);

    toggleButton.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setThemeState(targetTheme);
    });

    function setThemeState(theme) {
        if (theme === 'dark') {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            toggleButton.textContent = '☀️';
            localStorage.setItem('afriblog-theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            toggleButton.textContent = '🌙';
            localStorage.setItem('afriblog-theme', 'light');
        }
    }
}

/**
 * 2. Article Reading Progress Bar
 */
function initReadingProgressBar() {
    const progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (height > 0) {
            const scrolledPercentage = (winScroll / height) * 100;
            progressBar.style.width = scrolledPercentage + '%';
        } else {
            progressBar.style.width = '0%';
        }
    });
}

/**
 * 3. Local Storage Comment Management System Fallback
 */
function initLocalStorageComments() {
    const commentForm = document.getElementById('client-comment-form');
    const domCommentsList = document.getElementById('dom-comments-list');
    
    if (!commentForm || !domCommentsList) return;

    // Resolve context identity using the document pathname URL
    const contextPostSlug = window.location.pathname;

    // Retrieve historical storage payload records
    let records = JSON.parse(localStorage.getItem(`comments-${contextPostSlug}`)) || [];
    
    // Render local storage comments alongside server-side comments
    records.forEach(item => appendCommentToDOM(item.name, item.body, item.date));

    commentForm.addEventListener('submit', (e) => {
        // Intercept action to ensure capture cache synchronization
        const inputName = document.getElementById('comment-name').value.trim();
        const inputBody = document.getElementById('comment-body').value.trim();
        const dateString = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        if (inputName && inputBody) {
            const payload = { name: inputName, body: inputBody, date: dateString };
            records.push(payload);
            localStorage.setItem(`comments-${contextPostSlug}`, JSON.stringify(records));
            
            appendCommentToDOM(payload.name, payload.body, payload.date);
        }
    });

    function appendCommentToDOM(name, body, date) {
        const bubble = document.createElement('div');
        bubble.className = 'comment-bubble slide-up';
        bubble.innerHTML = `
            <div class="comment-meta">
                <strong>${escapeHTML(name)}</strong> <small>${date} (Local Storage)</small>
            </div>
            <p>${escapeHTML(body)}</p>
        `;
        domCommentsList.appendChild(bubble);
    }

    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}