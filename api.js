// API module for communicating with Netlify serverless functions

const API = {
    /**
     * Generate social media content using the serverless function
     * @param {Object} formData - Form data with content parameters
     * @param {Object|null} strategy - Communication strategy data
     * @returns {Promise<string>} Generated content
     */
    async generateContent(formData, strategy) {
        const response = await fetch('/.netlify/functions/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ formData, strategy })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error ${response.status}`);
        }

        const data = await response.json();
        return data.content;
    }
};

// Make API available globally
window.API = API;
