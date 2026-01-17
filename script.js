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

    // Strategy form toggle functionality
    toggleBtn.addEventListener('click', function() {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', !isExpanded);
        strategyForm.classList.toggle('collapsed');
        toggleText.textContent = isExpanded ? 'Rozbalit' : 'Sbalit';
    });

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

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate API call (replace with actual API call to ChatGPT)
        generateContent(formData)
            .then(content => {
                displayResult(content);
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            })
            .catch(error => {
                console.error('Error generating content:', error);
                alert('Chyba při generování obsahu. Zkuste to prosím znovu.');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
    });

    // Form reset handler
    form.addEventListener('reset', function() {
        resultContainer.classList.add('result-hidden');
        resultContainer.style.display = 'none';
    });

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
            alert('Nepodařilo se zkopírovat text automaticky. Použijte Ctrl+C pro kopírování.');
        }

        document.body.removeChild(textArea);
    }

    // New content button handler
    newContentBtn.addEventListener('click', function() {
        resultContainer.classList.add('result-hidden');
        resultContainer.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Validate form data
    function validateForm(data) {
        if (!data.topic) {
            alert('Prosím vyplňte téma příspěvku.');
            return false;
        }
        if (!data.platform) {
            alert('Prosím vyberte platformu.');
            return false;
        }
        if (!data.tone) {
            alert('Prosím vyberte tón příspěvku.');
            return false;
        }
        if (!data.length) {
            alert('Prosím vyberte délku příspěvku.');
            return false;
        }
        if (!data.stdcPhase) {
            alert('Prosím vyberte STDC fázi.');
            return false;
        }
        return true;
    }

    // Generate content (simulated - replace with actual API call)
    function generateContent(data) {
        return new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                // Get strategy data and merge with content data
                const strategy = getStrategyData();
                // This is a mock response. In production, this would call the ChatGPT API
                const mockContent = generateMockContent(data, strategy);
                resolve(mockContent);
            }, 2000);
        });
    }

    // Generate mock content based on form data
    function generateMockContent(data, strategy) {
        const platformEmojis = {
            facebook: '👥',
            instagram: '📸',
            twitter: '🐦',
            linkedin: '💼',
            tiktok: '🎵'
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
    function displayResult(content) {
        generatedContent.textContent = content;
        resultContainer.classList.remove('result-hidden');
        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Show success message
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = '✅ ' + message;

        resultContainer.insertBefore(successDiv, resultContainer.firstChild);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Real-time character counter for textarea (optional enhancement)
    // This is a placeholder for future functionality

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
});
