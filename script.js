// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contentForm');
    const resultContainer = document.getElementById('result');
    const generatedContent = document.getElementById('generatedContent');
    const copyBtn = document.getElementById('copyBtn');
    const newContentBtn = document.getElementById('newContentBtn');

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            topic: document.getElementById('topic').value.trim(),
            platform: document.getElementById('platform').value,
            tone: document.getElementById('tone').value,
            length: document.getElementById('length').value,
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
        resultContainer.style.display = 'none';
    });

    // Copy button handler
    copyBtn.addEventListener('click', function() {
        const text = generatedContent.textContent;
        navigator.clipboard.writeText(text)
            .then(() => {
                showSuccessMessage('Obsah byl zkopírován do schránky!');
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                alert('Nepodařilo se zkopírovat text.');
            });
    });

    // New content button handler
    newContentBtn.addEventListener('click', function() {
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
        return true;
    }

    // Generate content (simulated - replace with actual API call)
    function generateContent(data) {
        return new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                // This is a mock response. In production, this would call the ChatGPT API
                const mockContent = generateMockContent(data);
                resolve(mockContent);
            }, 2000);
        });
    }

    // Generate mock content based on form data
    function generateMockContent(data) {
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

        const emoji = platformEmojis[data.platform] || '✨';
        const toneStyle = toneStyles[data.tone] || 'přátelském';

        let content = `${emoji} ${data.topic}\n\n`;
        
        content += `Toto je ukázkový obsah vygenerovaný v ${toneStyle} tónu pro platformu ${data.platform}.\n\n`;
        
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

        if (data.keywords) {
            content += `🔑 Klíčová slova: ${data.keywords}\n\n`;
        }

        if (data.additionalInfo) {
            content += `📝 Další kontext: ${data.additionalInfo}\n\n`;
        }

        content += `---\n`;
        content += `⚠️ Poznámka: Toto je ukázkový obsah. V produkční verzi bude obsah generován pomocí ChatGPT API.`;

        return content;
    }

    // Display the generated content
    function displayResult(content) {
        generatedContent.textContent = content;
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
    const additionalInfoTextarea = document.getElementById('additionalInfo');
    additionalInfoTextarea.addEventListener('input', function() {
        // Could add character counter here if needed
    });

    // Form field animation on focus
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});
