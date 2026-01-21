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

    // Original length options for social media
    const socialMediaLengthOptions = [
        { value: '', text: 'Vyberte délku...' },
        { value: 'short', text: 'Krátký (50-100 slov)' },
        { value: 'medium', text: 'Střední (100-200 slov)' },
        { value: 'long', text: 'Dlouhý (200-300 slov)' }
    ];

    // Blog article length options
    const blogLengthOptions = [
        { value: '', text: 'Vyberte délku...' },
        { value: 'short', text: 'Krátký (400-500 slov)' },
        { value: 'medium', text: 'Střední (600-800 slov)' },
        { value: 'long', text: 'Dlouhý (900-1200 slov)' },
        { value: 'extra-long', text: 'Extra dlouhý (1500-2000 slov)' }
    ];

    // Function to update length options based on platform
    function updateLengthOptions(platform) {
        const options = platform === 'blogovy-clanek' ? blogLengthOptions : socialMediaLengthOptions;

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
    });

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

        if (data.length === 'short') {
            content += `Krátký příspěvek o tématu "${data.topic}" je ideální pro rychlé sdílení. `;
            content += `Zaujměte své publikum stručným, ale působivým sdělením. 💡\n\n`;
        } else if (data.length === 'medium') {
            content += `Střední příspěvek vám umožňuje více rozvinout téma "${data.topic}". `;
            content += `Poskytněte svému publiku zajímavé informace a praktické tipy. `;
            content += `Nezapomeňte zahrnout výzvu k akci! 🚀\n\n`;
        } else {
            content += `Dlouhý příspěvek o tématu "${data.topic}" nabízí prostor pro hloubkovou analýzu. `;
            content += `Můžete sdílet své zkušenosti, poskytovat cenné rady a vytvářet silné spojení s publikem. `;
            content += `Delší obsah často generuje větší zapojení a diskuze. `;
            content += `Ujistěte se, že je váš text dobře strukturovaný a snadno čitelný! 📚\n\n`;
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
    // INITIALIZATION
    // ========================================

    // Load history on page load
    renderHistory();
});
