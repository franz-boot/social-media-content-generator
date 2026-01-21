// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    const form = document.getElementById('contentForm');
    const resultContainer = document.getElementById('result');
    const generatedContent = document.getElementById('generatedContent');
    const copyBtn = document.getElementById('copyBtn');
    const newContentBtn = document.getElementById('newContentBtn');

    // Strategy form elements
    const strategyForm = document.getElementById('strategyForm');
    const strategyToggle = document.getElementById('strategyToggle');
    const toggleBtn = strategyToggle.querySelector('.toggle-btn');
    const toggleText = toggleBtn.querySelector('.toggle-text');
    const saveStrategyBtn = document.getElementById('saveStrategyBtn');
    const clearStrategyBtn = document.getElementById('clearStrategyBtn');

    // New elements
    const variationBtn = document.getElementById('generate-variation');
    const exportTxtBtn = document.getElementById('export-txt');
    const exportMdBtn = document.getElementById('export-md');
    const exportHtmlBtn = document.getElementById('export-html');
    const clearHistoryBtn = document.getElementById('clear-history');
    const historyList = document.getElementById('history-list');

    // Stats elements
    const charCountEl = document.getElementById('char-count');
    const wordCountEl = document.getElementById('word-count');
    const readTimeEl = document.getElementById('read-time');
    const twitterWarningEl = document.getElementById('twitter-warning');

    // Store last used form parameters for variation
    let lastFormParams = null;
    let currentPlatform = '';

    // Length select element
    const lengthSelect = document.getElementById('length');
    const platformSelect = document.getElementById('platform');

    // Length options for each content type
    const delkaOptions = {
        // Sociální sítě (default)
        default: [
            { value: '', text: 'Vyberte délku...' },
            { value: 'kratky', text: 'Krátký (50-100 slov)' },
            { value: 'stredni', text: 'Střední (100-200 slov)' },
            { value: 'dlouhy', text: 'Dlouhý (200-300 slov)' }
        ],
        // Blogový článek
        'blogovy-clanek': [
            { value: '', text: 'Vyberte délku...' },
            { value: 'kratky', text: 'Krátký (400-500 slov)' },
            { value: 'stredni', text: 'Střední (600-800 slov)' },
            { value: 'dlouhy', text: 'Dlouhý (900-1200 slov)' },
            { value: 'extra-dlouhy', text: 'Extra dlouhý (1500-2000 slov)' }
        ],
        // Newsletter
        'newsletter': [
            { value: '', text: 'Vyberte délku...' },
            { value: 'kratky', text: 'Krátký (150-250 slov)' },
            { value: 'stredni', text: 'Střední (300-450 slov)' },
            { value: 'dlouhy', text: 'Dlouhý (500-700 slov)' }
        ],
        // Emailing
        'emailing': [
            { value: '', text: 'Vyberte délku...' },
            { value: 'kratky', text: 'Krátký (75-125 slov)' },
            { value: 'stredni', text: 'Střední (150-250 slov)' },
            { value: 'dlouhy', text: 'Dlouhý (300-400 slov)' }
        ]
    };

    // ========================================
    // TEMPLATES
    // ========================================

    const templates = [
        {
            id: 'promo-eshop',
            name: 'Promo e-shop',
            icon: '🛒',
            description: 'Propagace produktu pro e-shop',
            settings: {
                platform: 'facebook',
                tone: 'friendly',
                length: 'stredni',
                stdcPhase: 'do',
                callToAction: 'buy_now'
            }
        },
        {
            id: 'vzdelavaci-linkedin',
            name: 'Vzdělávací LinkedIn',
            icon: '📚',
            description: 'Odborný příspěvek pro LinkedIn',
            settings: {
                platform: 'linkedin',
                tone: 'professional',
                length: 'dlouhy',
                stdcPhase: 'think',
                callToAction: 'learn_more'
            }
        },
        {
            id: 'instagram-story',
            name: 'Instagram engagement',
            icon: '📸',
            description: 'Poutavý post pro Instagram',
            settings: {
                platform: 'instagram',
                tone: 'casual',
                length: 'kratky',
                stdcPhase: 'see',
                callToAction: 'comment'
            }
        },
        {
            id: 'newsletter-novinky',
            name: 'Newsletter novinky',
            icon: '📧',
            description: 'Pravidelný newsletter pro zákazníky',
            settings: {
                platform: 'newsletter',
                tone: 'friendly',
                length: 'stredni',
                stdcPhase: 'care',
                callToAction: 'learn_more'
            }
        },
        {
            id: 'blog-navod',
            name: 'Blog návod',
            icon: '✍️',
            description: 'Návod nebo how-to článek',
            settings: {
                platform: 'blogovy-clanek',
                tone: 'professional',
                length: 'dlouhy',
                stdcPhase: 'think',
                callToAction: ''
            }
        },
        {
            id: 'prodejni-email',
            name: 'Prodejní email',
            icon: '💰',
            description: 'Konverzní email s CTA',
            settings: {
                platform: 'emailing',
                tone: 'professional',
                length: 'stredni',
                stdcPhase: 'do',
                callToAction: 'buy_now'
            }
        }
    ];

    let activeTemplateId = null;

    function renderTemplates() {
        const templatesGrid = document.getElementById('templates-grid');
        templatesGrid.innerHTML = templates.map(template => `
            <div class="template-card${activeTemplateId === template.id ? ' active' : ''}" data-id="${template.id}">
                <div class="template-icon">${template.icon}</div>
                <div class="template-name">${template.name}</div>
                <div class="template-description">${template.description}</div>
            </div>
        `).join('');

        // Add event listeners
        templatesGrid.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => applyTemplate(card.dataset.id));
        });
    }

    function applyTemplate(templateId) {
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        activeTemplateId = templateId;

        // Apply settings to form
        const { settings } = template;

        // Update platform first (this triggers length options update)
        if (settings.platform) {
            platformSelect.value = settings.platform;
            updateLengthOptions(settings.platform);
        }

        if (settings.tone) {
            document.getElementById('tone').value = settings.tone;
        }
        if (settings.length) {
            lengthSelect.value = settings.length;
        }
        if (settings.stdcPhase) {
            document.getElementById('stdcPhase').value = settings.stdcPhase;
        }
        if (settings.callToAction !== undefined) {
            document.getElementById('callToAction').value = settings.callToAction;
        }

        // Re-render to show active state
        renderTemplates();

        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });

        showSuccessMessage(`Šablona "${template.name}" byla aplikována.`);
    }

    // ========================================
    // FAVORITES
    // ========================================

    const FAVORITES_KEY = 'contentGeneratorFavorites';

    // Modal elements
    const saveModal = document.getElementById('save-modal');
    const favoriteNameInput = document.getElementById('favorite-name');
    const modalCancelBtn = document.getElementById('modal-cancel');
    const modalSaveBtn = document.getElementById('modal-save');
    const saveFavoriteBtn = document.getElementById('save-favorite');

    function loadFavorites() {
        const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
        return favorites;
    }

    function saveFavorites(favorites) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }

    function getCurrentFormSettings() {
        return {
            platform: platformSelect.value,
            tone: document.getElementById('tone').value,
            length: lengthSelect.value,
            stdcPhase: document.getElementById('stdcPhase').value,
            targetAudience: document.getElementById('targetAudience').value,
            callToAction: document.getElementById('callToAction').value,
            keywords: document.getElementById('keywords').value,
            additionalInfo: document.getElementById('additionalInfo').value
        };
    }

    function openSaveModal() {
        favoriteNameInput.value = '';
        saveModal.hidden = false;
        favoriteNameInput.focus();
    }

    function closeSaveModal() {
        saveModal.hidden = true;
        favoriteNameInput.value = '';
    }

    function saveFavorite() {
        const name = favoriteNameInput.value.trim();
        if (!name) {
            showErrorMessage('Zadejte název oblíbeného nastavení.');
            return;
        }

        const favorites = loadFavorites();
        const newFavorite = {
            id: 'fav-' + Date.now(),
            name: name,
            createdAt: Date.now(),
            settings: getCurrentFormSettings()
        };

        favorites.unshift(newFavorite);
        saveFavorites(favorites);

        closeSaveModal();
        renderFavorites();
        showSuccessMessage(`Oblíbené "${name}" bylo uloženo.`);
    }

    function renderFavorites() {
        const favoritesGrid = document.getElementById('favorites-grid');
        const favorites = loadFavorites();

        if (favorites.length === 0) {
            favoritesGrid.innerHTML = '<div class="empty-state" id="favorites-empty">Zatím nemáte žádná oblíbená nastavení</div>';
            return;
        }

        favoritesGrid.innerHTML = favorites.map(fav => `
            <div class="favorite-card" data-id="${fav.id}">
                <button type="button" class="favorite-delete" data-id="${fav.id}" title="Smazat">×</button>
                <div class="favorite-icon">⭐</div>
                <div class="favorite-name">${fav.name}</div>
                <div class="favorite-description">${getPlatformLabel(fav.settings.platform) || 'Vlastní'}</div>
            </div>
        `).join('');

        // Add event listeners for applying favorites
        favoritesGrid.querySelectorAll('.favorite-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('favorite-delete')) {
                    applyFavorite(card.dataset.id);
                }
            });
        });

        // Add event listeners for deleting favorites
        favoritesGrid.querySelectorAll('.favorite-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteFavorite(btn.dataset.id);
            });
        });
    }

    function applyFavorite(id) {
        const favorites = loadFavorites();
        const favorite = favorites.find(f => f.id === id);
        if (!favorite) return;

        const { settings } = favorite;

        // Clear active template
        activeTemplateId = null;
        renderTemplates();

        // Update platform first (this triggers length options update)
        if (settings.platform) {
            platformSelect.value = settings.platform;
            updateLengthOptions(settings.platform);
        }

        if (settings.tone) {
            document.getElementById('tone').value = settings.tone;
        }
        if (settings.length) {
            lengthSelect.value = settings.length;
        }
        if (settings.stdcPhase) {
            document.getElementById('stdcPhase').value = settings.stdcPhase;
        }
        if (settings.targetAudience !== undefined) {
            document.getElementById('targetAudience').value = settings.targetAudience;
        }
        if (settings.callToAction !== undefined) {
            document.getElementById('callToAction').value = settings.callToAction;
        }
        if (settings.keywords !== undefined) {
            document.getElementById('keywords').value = settings.keywords;
        }
        if (settings.additionalInfo !== undefined) {
            document.getElementById('additionalInfo').value = settings.additionalInfo;
        }

        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });

        showSuccessMessage(`Oblíbené "${favorite.name}" bylo aplikováno.`);
    }

    function deleteFavorite(id) {
        if (!confirm('Opravdu chcete smazat toto oblíbené nastavení?')) {
            return;
        }

        let favorites = loadFavorites();
        favorites = favorites.filter(f => f.id !== id);
        saveFavorites(favorites);
        renderFavorites();
        showSuccessMessage('Oblíbené bylo smazáno.');
    }

    // Modal event listeners
    saveFavoriteBtn.addEventListener('click', openSaveModal);
    modalCancelBtn.addEventListener('click', closeSaveModal);
    modalSaveBtn.addEventListener('click', saveFavorite);

    // Close modal on overlay click
    saveModal.addEventListener('click', (e) => {
        if (e.target === saveModal) {
            closeSaveModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !saveModal.hidden) {
            closeSaveModal();
        }
    });

    // Save on Enter key in modal
    favoriteNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveFavorite();
        }
    });

    // Function to update length options based on platform
    function updateLengthOptions(platform) {
        const options = delkaOptions[platform] || delkaOptions.default;

        // Store current selection
        const currentValue = lengthSelect.value;

        // Clear and repopulate options
        lengthSelect.innerHTML = '';
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            lengthSelect.appendChild(option);
        });

        // Restore selection if it exists in new options
        const validValues = options.map(o => o.value);
        if (validValues.includes(currentValue)) {
            lengthSelect.value = currentValue;
        } else {
            lengthSelect.value = '';
        }
    }

    // Platform change event listener
    platformSelect.addEventListener('change', function() {
        updateLengthOptions(this.value);
        updateQualityIndicator();
    });

    // ========================================
    // QUALITY INDICATOR
    // ========================================

    const qualityIndicator = document.getElementById('form-quality');
    const qualityText = document.getElementById('quality-text');
    const topicInput = document.getElementById('topic');
    const toneSelect = document.getElementById('tone');
    const stdcSelect = document.getElementById('stdcPhase');

    function updateQualityIndicator() {
        const requiredFields = [
            { el: topicInput, filled: topicInput.value.trim() !== '' },
            { el: platformSelect, filled: platformSelect.value !== '' },
            { el: toneSelect, filled: toneSelect.value !== '' },
            { el: lengthSelect, filled: lengthSelect.value !== '' },
            { el: stdcSelect, filled: stdcSelect.value !== '' }
        ];

        const filledCount = requiredFields.filter(f => f.filled).length;
        const totalRequired = requiredFields.length;

        if (qualityText) {
            qualityText.textContent = `Vyplněno ${filledCount}/${totalRequired} povinných polí`;
        }

        if (qualityIndicator) {
            if (filledCount === totalRequired) {
                qualityIndicator.classList.remove('incomplete');
            } else {
                qualityIndicator.classList.add('incomplete');
            }
        }
    }

    // Add event listeners for quality indicator
    if (topicInput) {
        topicInput.addEventListener('input', updateQualityIndicator);
    }
    if (toneSelect) {
        toneSelect.addEventListener('change', updateQualityIndicator);
    }
    if (lengthSelect) {
        lengthSelect.addEventListener('change', updateQualityIndicator);
    }
    if (stdcSelect) {
        stdcSelect.addEventListener('change', updateQualityIndicator);
    }

    // Initialize quality indicator on page load
    updateQualityIndicator();

    // Strategy form toggle functionality
    toggleBtn.addEventListener('click', function() {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', !isExpanded);
        strategyForm.classList.toggle('collapsed');
        toggleText.textContent = isExpanded ? 'Rozbalit' : 'Sbalit';
    });

    // ========================================
    // HISTORY FUNCTIONS
    // ========================================

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('contentHistory') || '[]');
        return history;
    }

    function saveToHistory(platform, topic, content) {
        const history = loadHistory();
        const newEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            platform: platform,
            topic: topic,
            content: content
        };

        // Add to beginning, keep only last 10
        history.unshift(newEntry);
        if (history.length > 10) {
            history.pop();
        }

        localStorage.setItem('contentHistory', JSON.stringify(history));
        renderHistory();
    }

    function clearHistory() {
        if (confirm('Opravdu chcete vymazat celou historii generování?')) {
            localStorage.removeItem('contentHistory');
            renderHistory();
            showSuccessMessage('Historie byla vymazána.');
        }
    }

    function deleteHistoryItem(id) {
        let history = loadHistory();
        history = history.filter(item => item.id !== id);
        localStorage.setItem('contentHistory', JSON.stringify(history));
        renderHistory();
        showSuccessMessage('Položka byla odstraněna z historie.');
    }

    function loadHistoryItem(id) {
        const history = loadHistory();
        const item = history.find(h => h.id === id);
        if (item) {
            generatedContent.textContent = item.content;
            currentPlatform = item.platform;
            resultContainer.classList.remove('result-hidden');
            updateContentStats();
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('cs-CZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function truncateText(text, maxLength = 50) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    function getPlatformLabel(platform) {
        const labels = {
            facebook: 'Facebook',
            instagram: 'Instagram',
            twitter: 'Twitter/X',
            linkedin: 'LinkedIn',
            tiktok: 'TikTok',
            'blogovy-clanek': 'Blog',
            'newsletter': 'Newsletter',
            'emailing': 'Email'
        };
        return labels[platform] || platform;
    }

    function renderHistory() {
        const history = loadHistory();

        if (history.length === 0) {
            historyList.innerHTML = '<p class="history-empty">Zatím žádná historie generování.</p>';
            return;
        }

        historyList.innerHTML = history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-item-header">
                    <span class="history-platform platform-${item.platform}">${getPlatformLabel(item.platform)}</span>
                    <span class="history-date">${formatDate(item.timestamp)}</span>
                </div>
                <div class="history-item-topic">${truncateText(item.topic, 40)}</div>
                <div class="history-item-preview">${truncateText(item.content, 80)}</div>
                <div class="history-item-actions">
                    <button type="button" class="btn btn-tiny history-load" data-id="${item.id}">📄 Načíst</button>
                    <button type="button" class="btn btn-tiny btn-danger history-delete" data-id="${item.id}">🗑️</button>
                </div>
            </div>
        `).join('');

        // Add event listeners
        historyList.querySelectorAll('.history-load').forEach(btn => {
            btn.addEventListener('click', () => loadHistoryItem(parseInt(btn.dataset.id)));
        });
        historyList.querySelectorAll('.history-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteHistoryItem(parseInt(btn.dataset.id));
            });
        });
    }

    // ========================================
    // EXPORT FUNCTIONS
    // ========================================

    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportAsTxt() {
        const content = generatedContent.textContent;
        if (!content) return;

        const filename = `obsah-${currentPlatform}-${Date.now()}.txt`;
        downloadFile(content, filename, 'text/plain;charset=utf-8');
        showSuccessMessage('Soubor TXT byl stažen.');
    }

    function exportAsMd() {
        const content = generatedContent.textContent;
        if (!content) return;

        const date = new Date().toLocaleDateString('cs-CZ');
        const mdContent = `---
platforma: ${getPlatformLabel(currentPlatform)}
datum: ${date}
---

# Vygenerovaný obsah

${content}
`;
        const filename = `obsah-${currentPlatform}-${Date.now()}.md`;
        downloadFile(mdContent, filename, 'text/markdown;charset=utf-8');
        showSuccessMessage('Soubor MD byl stažen.');
    }

    function exportAsHtml() {
        const content = generatedContent.textContent;
        if (!content) return;

        const date = new Date().toLocaleDateString('cs-CZ');
        const htmlContent = `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vygenerovaný obsah - ${getPlatformLabel(currentPlatform)}</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background: #0f172a;
            color: #f1f5f9;
            line-height: 1.8;
        }
        .meta {
            color: #94a3b8;
            font-size: 0.9rem;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #334155;
        }
        .content {
            white-space: pre-wrap;
            background: #1e293b;
            padding: 24px;
            border-radius: 12px;
        }
    </style>
</head>
<body>
    <div class="meta">
        <strong>Platforma:</strong> ${getPlatformLabel(currentPlatform)} |
        <strong>Datum:</strong> ${date}
    </div>
    <div class="content">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
</body>
</html>`;
        const filename = `obsah-${currentPlatform}-${Date.now()}.html`;
        downloadFile(htmlContent, filename, 'text/html;charset=utf-8');
        showSuccessMessage('Soubor HTML byl stažen.');
    }

    // ========================================
    // CONTENT STATS FUNCTIONS
    // ========================================

    function updateContentStats() {
        const content = generatedContent.textContent || '';

        // Character count
        const charCount = content.length;
        const charCountNoSpaces = content.replace(/\s/g, '').length;
        charCountEl.textContent = `${charCount} znaků (${charCountNoSpaces} bez mezer)`;

        // Word count
        const words = content.trim().split(/\s+/).filter(w => w.length > 0);
        const wordCount = content.trim() ? words.length : 0;
        wordCountEl.textContent = `${wordCount} slov`;

        // Read time (200 words per minute)
        const readTime = Math.max(1, Math.ceil(wordCount / 200));
        readTimeEl.textContent = `${readTime} min čtení`;

        // Twitter warning
        if (currentPlatform === 'twitter' && charCount > 280) {
            twitterWarningEl.classList.remove('hidden');
        } else {
            twitterWarningEl.classList.add('hidden');
        }
    }

    // ========================================
    // VARIATION FUNCTION
    // ========================================

    async function generateVariation() {
        if (!lastFormParams) return;

        variationBtn.disabled = true;
        variationBtn.textContent = '🔄 Generuji...';

        try {
            // Add variation instruction to the params
            const variationParams = {
                ...lastFormParams,
                additionalInfo: (lastFormParams.additionalInfo || '') +
                    '\n\nVYTVOŘ ODLIŠNOU VARIACI - nepoužívej stejné fráze ani strukturu jako předtím.'
            };

            const content = await generateContent(variationParams);
            displayResult(content, lastFormParams.platform, lastFormParams.topic);
        } catch (error) {
            console.error('Error generating variation:', error);
            showErrorMessage('Chyba při generování variace.');
        } finally {
            variationBtn.disabled = false;
            variationBtn.textContent = '🔄 Nová variace';
        }
    }

    // ========================================
    // STRATEGY FUNCTIONS
    // ========================================

    // Load saved strategy from localStorage
    function loadStrategy() {
        const savedStrategy = localStorage.getItem('communicationStrategy');
        if (savedStrategy) {
            const strategy = JSON.parse(savedStrategy);
            document.getElementById('brandName').value = strategy.brandName || '';
            document.getElementById('brandMission').value = strategy.brandMission || '';
            document.getElementById('brandValues').value = strategy.brandValues || '';
            document.getElementById('usp').value = strategy.usp || '';
            document.getElementById('brandVoice').value = strategy.brandVoice || '';
            document.getElementById('communicationPillars').value = strategy.communicationPillars || '';
            document.getElementById('keyMessages').value = strategy.keyMessages || '';
            document.getElementById('avoidTopics').value = strategy.avoidTopics || '';

            // Show saved indicator
            updateStrategySavedIndicator(true);
        }
    }

    // Save strategy to localStorage
    function saveStrategy() {
        const strategy = {
            brandName: document.getElementById('brandName').value.trim(),
            brandMission: document.getElementById('brandMission').value.trim(),
            brandValues: document.getElementById('brandValues').value.trim(),
            usp: document.getElementById('usp').value.trim(),
            brandVoice: document.getElementById('brandVoice').value,
            communicationPillars: document.getElementById('communicationPillars').value.trim(),
            keyMessages: document.getElementById('keyMessages').value.trim(),
            avoidTopics: document.getElementById('avoidTopics').value.trim()
        };

        localStorage.setItem('communicationStrategy', JSON.stringify(strategy));
        updateStrategySavedIndicator(true);
        showSuccessMessage('Strategie byla uložena!');
    }

    // Get current strategy data
    function getStrategyData() {
        const savedStrategy = localStorage.getItem('communicationStrategy');
        return savedStrategy ? JSON.parse(savedStrategy) : null;
    }

    // Update saved indicator in header
    function updateStrategySavedIndicator(saved) {
        const existingIndicator = strategyToggle.querySelector('.strategy-saved');
        if (saved && !existingIndicator) {
            const indicator = document.createElement('span');
            indicator.className = 'strategy-saved';
            indicator.innerHTML = '✓ Uloženo';
            strategyToggle.querySelector('h2').appendChild(indicator);
        } else if (!saved && existingIndicator) {
            existingIndicator.remove();
        }
    }

    // Save strategy button handler
    saveStrategyBtn.addEventListener('click', saveStrategy);

    // Clear strategy button handler
    clearStrategyBtn.addEventListener('click', function() {
        if (confirm('Opravdu chcete vymazat uloženou strategii?')) {
            localStorage.removeItem('communicationStrategy');
            strategyForm.reset();
            updateStrategySavedIndicator(false);
            showSuccessMessage('Strategie byla vymazána.');
        }
    });

    // Load strategy on page load
    loadStrategy();

    // ========================================
    // FORM SUBMISSION
    // ========================================

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            topic: document.getElementById('topic').value.trim(),
            platform: document.getElementById('platform').value,
            tone: document.getElementById('tone').value,
            length: document.getElementById('length').value,
            stdcPhase: document.getElementById('stdcPhase').value,
            targetAudience: document.getElementById('targetAudience').value.trim(),
            callToAction: document.getElementById('callToAction').value,
            keywords: document.getElementById('keywords').value.trim(),
            additionalInfo: document.getElementById('additionalInfo').value.trim()
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Store for variation
        lastFormParams = { ...formData };

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Generate content
        generateContent(formData)
            .then(content => {
                displayResult(content, formData.platform, formData.topic);
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                // Enable variation button after first generation
                variationBtn.disabled = false;
            })
            .catch(error => {
                console.error('Error generating content:', error);
                showErrorMessage('Chyba při generování obsahu. Zkuste to prosím znovu.');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
    });

    // Form reset handler
    form.addEventListener('reset', function() {
        resultContainer.classList.add('result-hidden');
        variationBtn.disabled = true;
        lastFormParams = null;
        // Reset quality indicator after form is cleared
        setTimeout(updateQualityIndicator, 0);
    });

    // ========================================
    // EVENT LISTENERS
    // ========================================

    // Copy button handler
    copyBtn.addEventListener('click', function() {
        const text = generatedContent.textContent;

        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showSuccessMessage('Obsah byl zkopírován do schránky!');
                })
                .catch(err => {
                    console.error('Clipboard API failed:', err);
                    fallbackCopyText(text);
                });
        } else {
            // Fallback for older browsers or non-HTTPS contexts
            fallbackCopyText(text);
        }
    });

    // Fallback copy method
    function fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            showSuccessMessage('Obsah byl zkopírován do schránky!');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            showErrorMessage('Nepodařilo se zkopírovat text. Použijte Ctrl+C.');
        }

        document.body.removeChild(textArea);
    }

    // New content button handler
    newContentBtn.addEventListener('click', function() {
        resultContainer.classList.add('result-hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Export button handlers
    exportTxtBtn.addEventListener('click', exportAsTxt);
    exportMdBtn.addEventListener('click', exportAsMd);
    exportHtmlBtn.addEventListener('click', exportAsHtml);

    // Variation button handler
    variationBtn.addEventListener('click', generateVariation);

    // Clear history button handler
    clearHistoryBtn.addEventListener('click', clearHistory);

    // ========================================
    // VALIDATION
    // ========================================

    // Validate form data
    function validateForm(data) {
        if (!data.topic) {
            showErrorMessage('Prosím vyplňte téma příspěvku.');
            return false;
        }
        if (!data.platform) {
            showErrorMessage('Prosím vyberte platformu.');
            return false;
        }
        if (!data.tone) {
            showErrorMessage('Prosím vyberte tón příspěvku.');
            return false;
        }
        if (!data.length) {
            showErrorMessage('Prosím vyberte délku příspěvku.');
            return false;
        }
        if (!data.stdcPhase) {
            showErrorMessage('Prosím vyberte STDC fázi.');
            return false;
        }
        return true;
    }

    // ========================================
    // CONTENT GENERATION
    // ========================================

    // Generate content using Netlify serverless function
    async function generateContent(data) {
        const strategy = getStrategyData();

        // Try to use API to call serverless function
        if (window.API) {
            try {
                return await window.API.generateContent(data, strategy);
            } catch (error) {
                console.warn('API call failed, using mock content:', error.message);
                // Fallback to mock content if API fails (local development)
                return generateMockContent(data, strategy);
            }
        }

        // Fallback to mock content if API is not available
        return generateMockContent(data, strategy);
    }

    // Generate mock content based on form data
    function generateMockContent(data, strategy) {
        const platformEmojis = {
            facebook: '👥',
            instagram: '📸',
            twitter: '🐦',
            linkedin: '💼',
            tiktok: '🎵',
            'blogovy-clanek': '📝',
            'newsletter': '📧',
            'emailing': '💌'
        };

        const toneStyles = {
            professional: 'profesionálním',
            casual: 'neformálním',
            friendly: 'přátelském',
            humorous: 'humorném',
            inspirational: 'inspirativním'
        };

        const stdcDescriptions = {
            see: { name: 'See', description: 'budování povědomí', goal: 'oslovit široké publikum a zvýšit viditelnost značky' },
            think: { name: 'Think', description: 'zvažování', goal: 'pomoci publiku porozumět vašemu řešení' },
            do: { name: 'Do', description: 'akce', goal: 'motivovat k okamžité akci a konverzi' },
            care: { name: 'Care', description: 'péče', goal: 'budovat loajalitu a vztah se stávajícími zákazníky' }
        };

        const ctaTexts = {
            learn_more: 'Zjistěte více na našem webu!',
            sign_up: 'Zaregistrujte se ještě dnes!',
            buy_now: 'Nakupte nyní a ušetřete!',
            contact: 'Kontaktujte nás pro více informací!',
            share: 'Sdílejte s přáteli!',
            comment: 'Co si o tom myslíte? Napište do komentářů!',
            visit_website: 'Navštivte náš web!',
            download: 'Stáhněte si zdarma!'
        };

        const brandVoiceLabels = {
            expert: 'expertním a autoritativním',
            friendly: 'přátelským a přístupným',
            innovative: 'inovativním a progresivním',
            trustworthy: 'důvěryhodným a spolehlivým',
            playful: 'hravým a zábavným',
            luxurious: 'luxusním a exkluzivním'
        };

        const emoji = platformEmojis[data.platform] || '✨';
        const toneStyle = toneStyles[data.tone] || 'přátelském';
        const stdcInfo = stdcDescriptions[data.stdcPhase] || stdcDescriptions.see;

        let content = `${emoji} ${data.topic}\n\n`;

        // Add brand name if available
        if (strategy && strategy.brandName) {
            content += `🏢 Značka: ${strategy.brandName}\n`;
        }

        content += `Toto je ukázkový obsah vygenerovaný v ${toneStyle} tónu pro platformu ${data.platform}.\n`;
        content += `📊 STDC fáze: ${stdcInfo.name} (${stdcInfo.description}) - cíl: ${stdcInfo.goal}\n`;

        // Add brand voice if available
        if (strategy && strategy.brandVoice && brandVoiceLabels[strategy.brandVoice]) {
            content += `🎤 Hlas značky: ${brandVoiceLabels[strategy.brandVoice]}\n`;
        }

        content += `\n`;

        if (data.targetAudience) {
            content += `🎯 Cílová skupina: ${data.targetAudience}\n\n`;
        }

        if (data.length === 'kratky') {
            content += `Krátký příspěvek o tématu "${data.topic}" je ideální pro rychlé sdílení. `;
            content += `Zaujměte své publikum stručným, ale působivým sdělením. 💡\n\n`;
        } else if (data.length === 'stredni') {
            content += `Střední příspěvek vám umožňuje více rozvinout téma "${data.topic}". `;
            content += `Poskytněte svému publiku zajímavé informace a praktické tipy. `;
            content += `Nezapomeňte zahrnout výzvu k akci! 🚀\n\n`;
        } else if (data.length === 'dlouhy') {
            content += `Dlouhý příspěvek o tématu "${data.topic}" nabízí prostor pro hloubkovou analýzu. `;
            content += `Můžete sdílet své zkušenosti, poskytovat cenné rady a vytvářet silné spojení s publikem. `;
            content += `Delší obsah často generuje větší zapojení a diskuze. `;
            content += `Ujistěte se, že je váš text dobře strukturovaný a snadno čitelný! 📚\n\n`;
        } else if (data.length === 'extra-dlouhy') {
            content += `Extra dlouhý příspěvek o tématu "${data.topic}" je ideální pro hloubkovou analýzu. `;
            content += `Rozviňte téma do více sekcí s podnadpisy pro lepší čitelnost. `;
            content += `Poskytněte komplexní pohled na problematiku. 📖\n\n`;
        }

        // Add strategy-based content
        if (strategy) {
            if (strategy.keyMessages) {
                content += `💬 Klíčové sdělení: ${strategy.keyMessages.split('\n')[0]}\n\n`;
            }

            if (strategy.usp) {
                content += `⭐ USP: ${strategy.usp}\n\n`;
            }

            if (strategy.brandValues) {
                content += `💎 Hodnoty: ${strategy.brandValues}\n\n`;
            }
        }

        if (data.keywords) {
            content += `🔑 Klíčová slova: ${data.keywords}\n\n`;
        }

        if (data.callToAction && ctaTexts[data.callToAction]) {
            content += `👉 ${ctaTexts[data.callToAction]}\n\n`;
        }

        if (data.additionalInfo) {
            content += `📝 Další kontext: ${data.additionalInfo}\n\n`;
        }

        // Show avoid topics warning if relevant
        if (strategy && strategy.avoidTopics) {
            content += `⚠️ Vyhnout se: ${strategy.avoidTopics}\n\n`;
        }

        content += `---\n`;
        content += `⚠️ Poznámka: Toto je ukázkový obsah. V produkční verzi bude obsah generován pomocí ChatGPT API.`;

        return content;
    }

    // Display the generated content
    function displayResult(content, platform, topic) {
        generatedContent.textContent = content;
        currentPlatform = platform || '';
        resultContainer.classList.remove('result-hidden');

        // Add fade-in animation class
        generatedContent.classList.add('fade-in');
        setTimeout(() => generatedContent.classList.remove('fade-in'), 500);

        // Update stats
        updateContentStats();

        // Save to history
        if (platform && topic) {
            saveToHistory(platform, topic, content);
        }

        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ========================================
    // NOTIFICATIONS
    // ========================================

    // Toast notification system
    const toast = document.getElementById('toast');

    function showToast(message, type = 'success') {
        toast.textContent = (type === 'success' ? '✓ ' : '✕ ') + message;
        toast.className = type;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Show success message (using toast)
    function showSuccessMessage(message) {
        showToast(message, 'success');
    }

    // Show error message (using toast)
    function showErrorMessage(message) {
        showToast(message, 'error');
    }

    // ========================================
    // FORM FIELD ANIMATIONS
    // ========================================

    // Form field animation on focus - using CSS classes
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('form-group-focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('form-group-focused');
        });
    });

    // ========================================
    // TABS FUNCTIONALITY
    // ========================================

    function initTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and hide all content
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => {
                    c.classList.remove('active');
                    c.hidden = true;
                });

                // Activate clicked button and show corresponding content
                btn.classList.add('active');
                const tabContent = document.getElementById(btn.dataset.tab + '-tab');
                if (tabContent) {
                    tabContent.hidden = false;
                    tabContent.classList.add('active');
                }
            });
        });
    }

    // ========================================
    // BULK GENERATION
    // ========================================

    // Store bulk results for export
    window.bulkResults = [];

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function bulkGenerate() {
        const topicsText = document.getElementById('bulk-topics').value.trim();
        const topics = topicsText.split('\n').filter(t => t.trim()).slice(0, 10);

        if (topics.length === 0) {
            showErrorMessage('Zadejte alespoň jedno téma');
            return;
        }

        const platforma = document.getElementById('bulk-platforma').value;
        const ton = document.getElementById('bulk-ton').value;
        const delka = document.getElementById('bulk-delka').value;
        const stdc = document.getElementById('bulk-stdc').value;

        // Validate required fields
        if (!platforma) {
            showErrorMessage('Vyberte platformu');
            return;
        }
        if (!ton) {
            showErrorMessage('Vyberte tón');
            return;
        }
        if (!delka) {
            showErrorMessage('Vyberte délku');
            return;
        }
        if (!stdc) {
            showErrorMessage('Vyberte STDC fázi');
            return;
        }

        const settings = {
            platform: platforma,
            tone: ton,
            length: delka,
            stdcPhase: stdc,
            useStrategy: document.getElementById('bulk-use-strategy').checked
        };

        // Show loading state
        const bulkBtn = document.getElementById('bulk-generate');
        bulkBtn.classList.add('loading');
        bulkBtn.disabled = true;

        // Show results section
        document.getElementById('bulk-results').hidden = false;
        document.getElementById('bulk-results-list').innerHTML = '';

        const results = [];

        for (let i = 0; i < topics.length; i++) {
            updateBulkProgress(i, topics.length);

            // Add placeholder for current topic
            addBulkResultPlaceholder(topics[i].trim(), i);

            try {
                const formData = {
                    topic: topics[i].trim(),
                    platform: settings.platform,
                    tone: settings.tone,
                    length: settings.length,
                    stdcPhase: settings.stdcPhase,
                    targetAudience: '',
                    callToAction: '',
                    keywords: '',
                    additionalInfo: ''
                };

                const strategy = settings.useStrategy ? getStrategyData() : null;
                let content;

                // Use API if available
                if (window.API) {
                    try {
                        content = await window.API.generateContent(formData, strategy);
                    } catch (error) {
                        console.warn('API call failed, using mock content:', error.message);
                        content = generateMockContent(formData, strategy);
                    }
                } else {
                    content = generateMockContent(formData, strategy);
                }

                results.push({ topic: topics[i].trim(), content, success: true });
                updateBulkResult(i, content, true);

            } catch (error) {
                results.push({ topic: topics[i].trim(), error: error.message, success: false });
                updateBulkResult(i, error.message, false);
            }

            // Small pause between requests (rate limiting)
            if (i < topics.length - 1) {
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        updateBulkProgress(topics.length, topics.length);
        showSuccessMessage(`Vygenerováno ${results.filter(r => r.success).length} z ${topics.length} příspěvků`);

        // Store results for export
        window.bulkResults = results;

        // Reset button state
        bulkBtn.classList.remove('loading');
        bulkBtn.disabled = false;
    }

    function updateBulkProgress(current, total) {
        document.getElementById('bulk-progress-text').textContent = `${current} / ${total}`;
        const percentage = total > 0 ? (current / total) * 100 : 0;
        document.getElementById('bulk-progress-fill').style.width = `${percentage}%`;
    }

    function addBulkResultPlaceholder(topic, index) {
        const html = `
            <div class="bulk-result-item" id="bulk-result-${index}">
                <div class="bulk-result-header">
                    <span class="bulk-result-topic">${escapeHtml(topic)}</span>
                    <span class="bulk-result-status loading">⏳ Generuji...</span>
                </div>
                <div class="bulk-result-content">
                    <div class="skeleton-loader"></div>
                </div>
            </div>
        `;
        document.getElementById('bulk-results-list').insertAdjacentHTML('beforeend', html);
    }

    function updateBulkResult(index, content, success) {
        const item = document.getElementById(`bulk-result-${index}`);
        if (!item) return;

        const statusEl = item.querySelector('.bulk-result-status');
        const contentEl = item.querySelector('.bulk-result-content');

        if (success) {
            statusEl.textContent = '✅ Hotovo';
            statusEl.className = 'bulk-result-status success';
            contentEl.innerHTML = `
                <div class="bulk-result-text">${escapeHtml(content)}</div>
                <button class="btn btn-small bulk-copy-btn" data-index="${index}">📋 Kopírovat</button>
            `;
            // Add copy event listener
            const copyBtn = contentEl.querySelector('.bulk-copy-btn');
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(content).then(() => {
                    showSuccessMessage('Zkopírováno do schránky');
                }).catch(() => {
                    fallbackCopyText(content);
                });
            });
        } else {
            statusEl.textContent = '❌ Chyba';
            statusEl.className = 'bulk-result-status error';
            contentEl.innerHTML = `<div class="bulk-result-error">${escapeHtml(content)}</div>`;
        }
    }

    function exportAllBulk() {
        if (!window.bulkResults || window.bulkResults.length === 0) {
            showErrorMessage('Žádné výsledky k exportu');
            return;
        }

        const successfulResults = window.bulkResults.filter(r => r.success);
        if (successfulResults.length === 0) {
            showErrorMessage('Žádné úspěšné výsledky k exportu');
            return;
        }

        let allContent = successfulResults
            .map((r, i) => `=== ${i + 1}. ${r.topic} ===\n\n${r.content}`)
            .join('\n\n---\n\n');

        downloadFile(allContent, 'bulk-content.txt', 'text/plain;charset=utf-8');
        showSuccessMessage('Export dokončen');
    }

    function copyAllBulk() {
        if (!window.bulkResults || window.bulkResults.length === 0) {
            showErrorMessage('Žádné výsledky ke kopírování');
            return;
        }

        const successfulResults = window.bulkResults.filter(r => r.success);
        if (successfulResults.length === 0) {
            showErrorMessage('Žádné úspěšné výsledky ke kopírování');
            return;
        }

        let allContent = successfulResults
            .map((r, i) => `=== ${i + 1}. ${r.topic} ===\n\n${r.content}`)
            .join('\n\n---\n\n');

        navigator.clipboard.writeText(allContent).then(() => {
            showSuccessMessage('Vše zkopírováno do schránky');
        }).catch(() => {
            fallbackCopyText(allContent);
        });
    }

    function clearBulkResults() {
        document.getElementById('bulk-results').hidden = true;
        document.getElementById('bulk-results-list').innerHTML = '';
        window.bulkResults = [];
        updateBulkProgress(0, 0);
    }

    // Bulk generation event listeners
    document.getElementById('bulk-generate')?.addEventListener('click', bulkGenerate);
    document.getElementById('bulk-export-all')?.addEventListener('click', exportAllBulk);
    document.getElementById('bulk-copy-all')?.addEventListener('click', copyAllBulk);
    document.getElementById('bulk-clear')?.addEventListener('click', clearBulkResults);

    // ========================================
    // INITIALIZATION
    // ========================================

    // Initialize tabs
    initTabs();

    // Load history on page load
    renderHistory();

    // Load templates and favorites on page load
    renderTemplates();
    renderFavorites();
});
