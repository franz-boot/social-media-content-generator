// Netlify serverless function for generating social media content using OpenAI API

export async function handler(event) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'OpenAI API key not configured' })
        };
    }

    try {
        const { formData, strategy } = JSON.parse(event.body);

        // Build the prompt
        const prompt = buildPrompt(formData, strategy);

        // Determine max_tokens based on content type and length
        const maxTokens = getMaxTokens(formData.platform, formData.length);

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: getSystemPrompt()
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: maxTokens,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API error:', errorData);
            return {
                statusCode: response.status,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Failed to generate content', details: errorData })
            };
        }

        const data = await response.json();
        const generatedContent = data.choices[0]?.message?.content || '';

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: generatedContent })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error', message: error.message })
        };
    }
}

function getSystemPrompt() {
    return `Jsi expert na tvorbu obsahu pro sociální sítě. Vytváříš poutavý, autentický obsah v češtině.

Pravidla:
- Piš vždy v češtině
- Přizpůsob styl a délku dané platformě
- Používej vhodné emoji (ale nepřeháněj to)
- Respektuj zadaný tón a STDC fázi
- Pokud je zadána komunikační strategie značky, dodržuj ji
- Obsah musí být originální a engaging
- Zahrň výzvu k akci, pokud je specifikována`;
}

function buildPrompt(formData, strategy) {
    const platformDescriptions = {
        facebook: 'Facebook - delší příspěvky, komunitní charakter',
        instagram: 'Instagram - vizuální platforma, kratší popisky, hodně emoji a hashtagů',
        twitter: 'Twitter/X - max 280 znaků, stručné a výstižné',
        linkedin: 'LinkedIn - profesionální síť, formálnější obsah',
        tiktok: 'TikTok - mladé publikum, trendy, neformální',
        'blogovy-clanek': 'Blogový článek - Napiš strukturovaný blogový článek. Struktura: poutavý titulek, úvod s hookem (1 odstavec), 3-5 hlavních sekcí s podnadpisy (použij ##), závěr s CTA. Používej krátké odstavce, odrážky kde vhodné. Zahrň klíčová slova přirozeně.',
        'newsletter': 'Newsletter - Napiš newsletter email. Struktura: Předmět: [předmět emailu], Preheader: [1 věta], poté osobní oslovení, hlavní obsah rozdělený do 2-3 krátkých sekcí, jasné CTA, přátelský podpis. Buduj vztah se čtenářem.',
        'emailing': 'Emailing - Napiš prodejní email podle AIDA frameworku. Struktura: Předmět: [max 50 znaků], Preheader: [1 věta], Headline, krátký body copy, 3-4 bullet points s benefity, CTA tlačítko: [text tlačítka], P.S. s urgencí nebo bonusem. Zaměř se na konverze.'
    };

    const toneDescriptions = {
        professional: 'profesionální a expertní',
        casual: 'neformální a uvolněný',
        friendly: 'přátelský a vřelý',
        humorous: 'humorný a zábavný',
        inspirational: 'inspirativní a motivační'
    };

    // Length descriptions based on content type (using Czech values)
    const getDelkaInstructions = (platform, length) => {
        const lengthByPlatform = {
            'blogovy-clanek': {
                kratky: '400-500 slov',
                stredni: '600-800 slov',
                dlouhy: '900-1200 slov',
                'extra-dlouhy': '1500-2000 slov, více sekcí s podnadpisy'
            },
            'newsletter': {
                kratky: '150-250 slov',
                stredni: '300-450 slov',
                dlouhy: '500-700 slov'
            },
            'emailing': {
                kratky: '75-125 slov, stručný a úderný',
                stredni: '150-250 slov',
                dlouhy: '300-400 slov'
            }
        };

        const defaultLengths = {
            kratky: '50-100 slov',
            stredni: '100-200 slov',
            dlouhy: '200-300 slov'
        };

        return lengthByPlatform[platform]?.[length] || defaultLengths[length] || length;
    };

    const stdcDescriptions = {
        see: 'SEE (budování povědomí) - oslovit široké publikum, představit značku/produkt',
        think: 'THINK (zvažování) - poskytnout informace, pomoci s rozhodováním',
        do: 'DO (akce) - motivovat k okamžité akci, konverze',
        care: 'CARE (péče) - budovat loajalitu, vztah se stávajícími zákazníky'
    };

    const ctaDescriptions = {
        learn_more: 'Zjistit více',
        sign_up: 'Registrace / Přihlášení',
        buy_now: 'Koupit nyní',
        contact: 'Kontaktovat nás',
        share: 'Sdílet příspěvek',
        comment: 'Zanechat komentář',
        visit_website: 'Navštívit web',
        download: 'Stáhnout'
    };

    let prompt = `Vytvoř příspěvek pro sociální síť s těmito parametry:\n\n`;

    prompt += `**Téma:** ${formData.topic}\n`;
    prompt += `**Platforma:** ${platformDescriptions[formData.platform] || formData.platform}\n`;
    prompt += `**Tón:** ${toneDescriptions[formData.tone] || formData.tone}\n`;
    prompt += `**Délka:** ${getDelkaInstructions(formData.platform, formData.length)}\n`;
    prompt += `**STDC fáze:** ${stdcDescriptions[formData.stdcPhase] || formData.stdcPhase}\n`;

    if (formData.targetAudience) {
        prompt += `**Cílová skupina:** ${formData.targetAudience}\n`;
    }

    if (formData.callToAction && ctaDescriptions[formData.callToAction]) {
        prompt += `**Výzva k akci:** ${ctaDescriptions[formData.callToAction]}\n`;
    }

    if (formData.keywords) {
        prompt += `**Klíčová slova k zahrnutí:** ${formData.keywords}\n`;
    }

    if (formData.additionalInfo) {
        prompt += `**Další kontext:** ${formData.additionalInfo}\n`;
    }

    // Add strategy information if available
    if (strategy) {
        prompt += `\n**KOMUNIKAČNÍ STRATEGIE ZNAČKY:**\n`;

        if (strategy.brandName) {
            prompt += `- Název značky: ${strategy.brandName}\n`;
        }
        if (strategy.brandMission) {
            prompt += `- Mise: ${strategy.brandMission}\n`;
        }
        if (strategy.brandValues) {
            prompt += `- Hodnoty: ${strategy.brandValues}\n`;
        }
        if (strategy.usp) {
            prompt += `- USP: ${strategy.usp}\n`;
        }
        if (strategy.brandVoice) {
            const brandVoiceLabels = {
                expert: 'expertní a autoritativní',
                friendly: 'přátelský a přístupný',
                innovative: 'inovativní a progresivní',
                trustworthy: 'důvěryhodný a spolehlivý',
                playful: 'hravý a zábavný',
                luxurious: 'luxusní a exkluzivní'
            };
            prompt += `- Hlas značky: ${brandVoiceLabels[strategy.brandVoice] || strategy.brandVoice}\n`;
        }
        if (strategy.communicationPillars) {
            prompt += `- Komunikační pilíře: ${strategy.communicationPillars}\n`;
        }
        if (strategy.keyMessages) {
            prompt += `- Klíčová sdělení: ${strategy.keyMessages}\n`;
        }
        if (strategy.avoidTopics) {
            prompt += `- VYHNOUT SE: ${strategy.avoidTopics}\n`;
        }
    }

    prompt += `\nVygeneruj pouze samotný text příspěvku, bez dalšího komentáře.`;

    return prompt;
}

// Determine max_tokens based on platform and length
function getMaxTokens(platform, length) {
    // Blogový článek
    if (platform === 'blogovy-clanek') {
        if (length === 'kratky' || length === 'stredni') {
            return 1500;
        } else if (length === 'dlouhy') {
            return 2000;
        } else if (length === 'extra-dlouhy') {
            return 3000;
        }
    }

    // Newsletter
    if (platform === 'newsletter') {
        return 1000;
    }

    // Emailing
    if (platform === 'emailing') {
        return 600;
    }

    // Sociální sítě (default)
    return 500;
}
