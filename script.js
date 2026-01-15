// --- Core Application Logic ---
const App = {
    state: {
        lang: 'pt',
        fontSize: 11,
        fontFamily: "'Roboto', sans-serif",
        highlightMode: false,
        theme: localStorage.getItem('theme') || 'light'
    },
    
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.applyTheme();
        this.render();
        this.initLucideIcons();
    },

    initLucideIcons() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    },

    cacheDOM() {
        this.dom = {
            root: document.documentElement,
            body: document.body,
            ptContent: document.getElementById('doc-pt'),
            enContent: document.getElementById('doc-en'),
            fontDisplay: document.getElementById('fontSizeVal'),
            btnPt: document.getElementById('lang-pt'),
            btnEn: document.getElementById('lang-en'),
            btnHighlight: document.getElementById('btnHighlight'),
            fontSelect: document.getElementById('fontSelect'),
            contentArea: document.getElementById('content-area'),
            themeToggle: document.getElementById('theme-toggle'),
            themeIcon: document.getElementById('theme-icon')
        };
    },

    bindEvents() {
        // Font Family Change
        this.dom.fontSelect.addEventListener('change', (e) => {
            this.state.fontFamily = e.target.value;
            this.updateStyle();
        });

        // Highlighter Text Selection Logic
        this.dom.contentArea.addEventListener('mouseup', () => {
            if (!this.state.highlightMode) return;
            this.applyHighlight();
        });

        // Theme Toggle
        if (this.dom.themeToggle) {
            this.dom.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    },

    updateStyle() {
        const root = this.dom.root;
        root.style.setProperty('--doc-base-size', `${this.state.fontSize}pt`);
        root.style.setProperty('--doc-font-family', this.state.fontFamily);
        this.dom.fontDisplay.textContent = this.state.fontSize;
    },

    applyTheme() {
        this.dom.body.setAttribute('data-theme', this.state.theme);
        localStorage.setItem('theme', this.state.theme);
        this.updateThemeIcon();
    },

    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    },

    updateThemeIcon() {
        const icon = this.dom.themeIcon;
        if (!icon) return;
        
        if (this.state.theme === 'dark') {
            // Sun icon for switching to light mode
            icon.setAttribute('data-lucide', 'sun');
        } else {
            // Moon icon for switching to dark mode
            icon.setAttribute('data-lucide', 'moon');
        }
        
        // Re-render Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    },

    render() {
        // Language Toggle
        if (this.state.lang === 'pt') {
            this.dom.ptContent.classList.remove('hidden');
            this.dom.enContent.classList.add('hidden');
            this.dom.btnPt.classList.add('active');
            this.dom.btnEn.classList.remove('active');
        } else {
            this.dom.ptContent.classList.add('hidden');
            this.dom.enContent.classList.remove('hidden');
            this.dom.btnPt.classList.remove('active');
            this.dom.btnEn.classList.add('active');
        }

        // Highlight Mode UI
        if (this.state.highlightMode) {
            this.dom.btnHighlight.classList.add('active');
            this.dom.body.classList.add('mode-highlight');
        } else {
            this.dom.btnHighlight.classList.remove('active');
            this.dom.body.classList.remove('mode-highlight');
        }
    },

    // --- Actions ---
    
    applyHighlight() {
        const selection = window.getSelection();
        if (!selection.rangeCount || selection.isCollapsed) return;
        
        const range = selection.getRangeAt(0);
        
        // Safety check: ensure selection is inside doc
        if (!this.dom.contentArea.contains(range.commonAncestorContainer)) return;

        try {
            // Simple highlighting wrapper
            const span = document.createElement('span');
            span.className = 'highlighted';
            range.surroundContents(span);
            selection.removeAllRanges();
        } catch (e) {
            console.warn("Complex selection crossing block elements ignored for prototype stability.");
        }
    }
};

// --- Global Functions for HTML Handlers ---

window.setLanguage = (lang) => {
    App.state.lang = lang;
    App.render();
};

window.adjustFontSize = (delta) => {
    const newSize = App.state.fontSize + delta;
    if (newSize >= 9 && newSize <= 18) {
        App.state.fontSize = newSize;
        App.updateStyle();
    }
};

window.toggleHighlighter = () => {
    App.state.highlightMode = !App.state.highlightMode;
    App.render();
};

window.downloadPDF = () => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = './assets/Thiago_Sampaio_Curriculo.pdf';
    link.download = 'Thiago_Sampaio_Curriculo.pdf';
    link.click();
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
