// Type definitions
interface ContentFormData {
    topic: string;
    platform: string;
    tone: string;
    length: string;
    stdcPhase: string;
    targetAudience: string;
    callToAction: string;
    keywords: string;
    additionalInfo: string;
}

interface StrategyData {
    brandName?: string;
    brandMission?: string;
    brandValues?: string;
    usp?: string;
    brandVoice?: string;
    communicationPillars?: string;
    keyMessages?: string;
    avoidTopics?: string;
}

interface STDCInfo {
    name: string;
    description: string;
    goal: string;
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear().toString();
    }

    const form = document.getElementById('contentForm') as HTMLFormElement | null;
    const resultContainer = document.getElementById('result') as HTMLElement | null;
    const generatedContent = document.getElementById('generatedContent') as HTMLElement | null;
    const copyBtn = document.getElementById('copyBtn') as HTMLButtonElement | null;
    const newContentBtn = document.getElementById('newContentBtn') as HTMLButtonElement | null;

    // Strategy form elements
    const strategyForm = document.getElementById('strategyForm') as HTMLFormElement | null;
    const strategyToggle = document.getElementById('strategyToggle') as HTMLElement | null;
    const toggleBtn = strategyToggle?.querySelector('.toggle-btn') as HTMLButtonElement | null;
    const toggleText = toggleBtn?.querySelector('.toggle-text') as HTMLElement | null;
    const saveStrategyBtn = document.getElementById('saveStrategyBtn') as HTMLButtonElement | null;
    const clearStrategyBtn = document.getElementById('clearStrategyBtn') as HTMLButtonElement | null;

    // Strategy form toggle functionality
    if (toggleBtn && strategyForm && toggleText) {
        toggleBtn.addEventListener('click', function() {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
            strategyForm.classList.toggle('collapsed');
            toggleText.textContent = isExpanded ? 'Rozbalit' : 'Sbalit';
        });
    }

    // Load saved strategy from localStorage
    function loadStrategy(): void {
        const savedStrategy = localStorage.getItem('communicationStrategy');
        if (savedStrategy) {
            const strategy: StrategyData = JSON.parse(savedStrategy);
            const brandName = document.getElementById('brandName') as HTMLInputElement | null;
            const brandMission = document.getElementById('brandMission') as HTMLTextAreaElement | null;
            const brandValues = document.getElementById('brandValues') as HTMLTextAreaElement | null;
            const usp = document.getElementById('usp') as HTMLTextAreaElement | null;
            const brandVoice = document.getElementById('brandVoice') as HTMLSelectElement | null;
            const communicationPillars = document.getElementById('communicationPillars') as HTMLTextAreaElement | null;
            const keyMessages = document.getElementById('keyMessages') as HTMLTextAreaElement | null;
            const avoidTopics = document.getElementById('avoidTopics') as HTMLTextAreaElement | null;

            if (brandName) brandName.value = strategy.brandName || '';
            if (brandMission) brandMission.value = strategy.brandMission || '';
            if (brandValues) brandValues.value = strategy.brandValues || '';
            if (usp) usp.value = strategy.usp || '';
            if (brandVoice) brandVoice.value = strategy.brandVoice || '';
            if (communicationPillars) communicationPillars.value = strategy.communicationPillars || '';
            if (keyMessages) keyMessages.value = strategy.keyMessages || '';
            if (avoidTopics) avoidTopics.value = strategy.avoidTopics || '';

            // Show saved indicator
            updateStrategySavedIndicator(true);
        }
    }

    // Save strategy to localStorage
    function saveStrategy(): void {
        const brandName = document.getElementById('brandName') as HTMLInputElement | null;
        const brandMission = document.getElementById('brandMission') as HTMLTextAreaElement | null;
        const brandValues = document.getElementById('brandValues') as HTMLTextAreaElement | null;
        const usp = document.getElementById('usp') as HTMLTextAreaElement | null;
        const brandVoice = document.getElementById('brandVoice') as HTMLSelectElement | null;
        const communicationPillars = document.getElementById('communicationPillars') as HTMLTextAreaElement | null;
        const keyMessages = document.getElementById('keyMessages') as HTMLTextAreaElement | null;
        const avoidTopics = document.getElementById('avoidTopics') as HTMLTextAreaElement | null;

        const strategy: StrategyData = {
            brandName: brandName?.value.trim() || '',
            brandMission: brandMission?.value.trim() || '',
            brandValues: brandValues?.value.trim() || '',
            usp: usp?.value.trim() || '',
            brandVoice: brandVoice?.value || '',
            communicationPillars: communicationPillars?.value.trim() || '',
            keyMessages: keyMessages?.value.trim() || '',
            avoidTopics: avoidTopics?.value.trim() || ''
        };

        localStorage.setItem('communicationStrategy', JSON.stringify(strategy));
        updateStrategySavedIndicator(true);
        showSuccessMessage('Strategie byla uložena!');
    }

    // Get current strategy data
    function getStrategyData(): StrategyData | null {
        const savedStrategy = localStorage.getItem('communicationStrategy');
        return savedStrategy ? JSON.parse(savedStrategy) : null;
    }

    // Update saved indicator in header
    function updateStrategySavedIndicator(saved: boolean): void {
        if (!strategyToggle) return;
        const existingIndicator = strategyToggle.querySelector('.strategy-saved');
        if (saved && !existingIndicator) {
            const indicator = document.createElement('span');
            indicator.className = 'strategy-saved';
            indicator.innerHTML = '✓ Uloženo';
            const h2 = strategyToggle.querySelector('h2');
            if (h2) h2.appendChild(indicator);
        } else if (!saved && existingIndicator) {
            existingIndicator.remove();
        }
    }

    // Save strategy button handler
    if (saveStrategyBtn) {
        saveStrategyBtn.addEventListener('click', saveStrategy);
    }

    // Clear strategy button handler
    if (clearStrategyBtn && strategyForm) {
        clearStrategyBtn.addEventListener('click', function() {
            if (confirm('Opravdu chcete vymazat uloženou strategii?')) {
                localStorage.removeItem('communicationStrategy');
                strategyForm.reset();
                updateStrategySavedIndicator(false);
                showSuccessMessage('Strategie byla vymazána.');
            }
        });
    }

    // Load strategy on page load
    loadStrategy();

    // Form submission handler
    if (form) {
        form.addEventListener('submit', function(e: Event) {
            e.preventDefault();

            // Get form data
            const topic = document.getElementById('topic') as HTMLInputElement | null;
            const platform = document.getElementById('platform') as HTMLSelectElement | null;
            const tone = document.getElementById('tone') as HTMLSelectElement | null;
            const length = document.getElementById('length') as HTMLSelectElement | null;
            const stdcPhase = document.getElementById('stdcPhase') as HTMLSelectElement | null;
            const targetAudience = document.getElementById('targetAudience') as HTMLInputElement | null;
            const callToAction = document.getElementById('callToAction') as HTMLSelectElement | null;
            const keywords = document.getElementById('keywords') as HTMLInputElement | null;
            const additionalInfo = document.getElementById('additionalInfo') as HTMLTextAreaElement | null;

            const formData: ContentFormData = {
                topic: topic?.value.trim() || '',
                platform: platform?.value || '',
                tone: tone?.value || '',
                length: length?.value || '',
                stdcPhase: stdcPhase?.value || '',
                targetAudience: targetAudience?.value.trim() || '',
                callToAction: callToAction?.value || '',
                keywords: keywords?.value.trim() || '',
                additionalInfo: additionalInfo?.value.trim() || ''
            };

            // Validate form
            if (!validateForm(formData)) {
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }

            // Simulate API call (replace with actual API call to ChatGPT)
            generateContent(formData)
                .then(content => {
                    displayResult(content);
                    if (submitBtn) {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
                })
                .catch(error => {
                    console.error('Error generating content:', error);
                    alert('Chyba při generování obsahu. Zkuste to prosím znovu.');
                    if (submitBtn) {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
                });
        });

        // Form reset handler
        form.addEventListener('reset', function() {
            if (resultContainer) {
                resultContainer.style.display = 'none';
            }
        });
    }

    // Copy button handler
    if (copyBtn && generatedContent) {
        copyBtn.addEventListener('click', function() {
            const text = generatedContent.textContent || '';

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
    }

    // Fallback copy method
    function fallbackCopyText(text: string): void {
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
    if (newContentBtn && resultContainer) {
        newContentBtn.addEventListener('click', function() {
            resultContainer.style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Validate form data
    function validateForm(data: ContentFormData): boolean {
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
    function generateContent(data: ContentFormData): Promise<string> {
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
    function generateMockContent(data: ContentFormData, strategy: StrategyData | null): string {
        const platformEmojis: Record<string, string> = {
            facebook: '👥',
            instagram: '📸',
            twitter: '🐦',
            linkedin: '💼',
            tiktok: '🎵'
        };

        const toneStyles: Record<string, string> = {
            professional: 'profesionálním',
            casual: 'neformálním',
            friendly: 'přátelském',
            humorous: 'humorném',
            inspirational: 'inspirativním'
        };

        const stdcDescriptions: Record<string, STDCInfo> = {
            see: { name: 'See', description: 'budování povědomí', goal: 'oslovit široké publikum a zvýšit viditelnost značky' },
            think: { name: 'Think', description: 'zvažování', goal: 'pomoci publiku porozumět vašemu řešení' },
            do: { name: 'Do', description: 'akce', goal: 'motivovat k okamžité akci a konverzi' },
            care: { name: 'Care', description: 'péče', goal: 'budovat loajalitu a vztah se stávajícími zákazníky' }
        };

        const ctaTexts: Record<string, string> = {
            learn_more: 'Zjistěte více na našem webu!',
            sign_up: 'Zaregistrujte se ještě dnes!',
            buy_now: 'Nakupte nyní a ušetřete!',
            contact: 'Kontaktujte nás pro více informací!',
            share: 'Sdílejte s přáteli!',
            comment: 'Co si o tom myslíte? Napište do komentářů!',
            visit_website: 'Navštivte náš web!',
            download: 'Stáhněte si zdarma!'
        };

        const brandVoiceLabels: Record<string, string> = {
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
    function displayResult(content: string): void {
        if (generatedContent) {
            generatedContent.textContent = content;
        }
        if (resultContainer) {
            resultContainer.style.display = 'block';
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Show success message
    function showSuccessMessage(message: string): void {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = '✅ ' + message;

        if (resultContainer) {
            resultContainer.insertBefore(successDiv, resultContainer.firstChild);
        }

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Real-time character counter for textarea (optional enhancement)
    // This is a placeholder for future functionality

    // Form field animation on focus - using CSS classes
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function(this: HTMLElement) {
                this.parentElement?.classList.add('form-group-focused');
            });

            input.addEventListener('blur', function(this: HTMLElement) {
                this.parentElement?.classList.remove('form-group-focused');
            });
        });
    }
});
