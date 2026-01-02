# Copilot Instructions for Social Media Content Generator

## Project Overview
This is a web application for generating social media content using ChatGPT. The application is designed to help users create engaging content for various social media platforms.

**Repository Name:** social-media-content-generator  
**Purpose:** Webová aplikace pro generování obsahu na sociální síti pomocí ChatGPT (Web application for generating social media content using ChatGPT)

## Technology Stack
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling:** Custom CSS with CSS Variables, Gradient backgrounds, Responsive design
- **No Build Tools:** Direct HTML/CSS/JS files - no bundler or package manager required
- **Target Platforms:** Facebook, Instagram, Twitter/X, LinkedIn, TikTok

## Project Structure
```
.
├── index.html          # Main HTML file with form for content generation
├── script.js           # JavaScript logic for form handling and content generation
├── styles.css          # CSS styling with modern design and responsive layout
├── README.md           # Project documentation in Czech
└── .github/
    ├── copilot-instructions.md
    └── workflows/
        └── blank.yml   # Basic CI workflow
```

## Key Components
- **Form Interface** (`index.html`): Collects user input for topic, platform, tone, length, keywords, and additional info
- **Content Generator** (`script.js`): Currently uses mock content generation; designed to integrate with ChatGPT API in production
- **Responsive UI** (`styles.css`): Modern gradient design with CSS variables for theming

## Development Guidelines

### Code Style and Conventions
- **Language:** Czech language for UI text and user-facing messages
- **JavaScript:**
  - Use ES6+ features (arrow functions, const/let, template literals, Promises)
  - Use `addEventListener` for event handling
  - Follow async/await or Promise patterns for asynchronous operations
  - Use `DOMContentLoaded` event to ensure DOM is ready before executing scripts
- **HTML:**
  - Use semantic HTML5 elements
  - Include proper labels with required indicators (`<span class="required">*</span>`)
  - Maintain accessibility with proper form labels and ARIA attributes where needed
- **CSS:**
  - Use CSS variables (custom properties) for theming (defined in `:root`)
  - Follow BEM or component-based naming for classes
  - Implement mobile-first responsive design
  - Use modern CSS features (flexbox, grid, gradients)
- Write clear, self-documenting code with meaningful variable and function names
- Add comments for complex logic or non-obvious implementations
- Keep functions small and focused on a single responsibility

### Git Workflow
- Create feature branches from `main` for new development
- Write clear, descriptive commit messages
- Ensure CI checks pass before merging pull requests

### Testing
- **Current State:** No automated testing framework is currently set up
- **Manual Testing:** Test in modern browsers (Chrome, Firefox, Safari, Edge)
- **Testing Checklist:**
  - Form validation works correctly
  - Copy to clipboard functionality works (including fallback for older browsers)
  - Responsive design works on mobile and desktop
  - All form fields accept and process input correctly
  - Generated content displays properly
- When adding tests in the future:
  - Consider using a lightweight testing framework suitable for vanilla JS
  - Write tests for form validation logic
  - Test clipboard functionality with mocking
  - Ensure existing tests pass before submitting changes

### Documentation
- Update README.md when adding new features or changing setup instructions
- Document API endpoints, configuration options, and environment variables
- Keep documentation in sync with code changes

### Security
- Never commit sensitive data (API keys, passwords, tokens) to the repository
- **API Integration:** When implementing ChatGPT API:
  - Use environment variables or secure configuration for API keys
  - Implement proper error handling to avoid exposing sensitive information
  - Never log or display API keys in the browser console
- **Input Validation:**
  - Validate and sanitize all user inputs before processing
  - Use built-in HTML5 form validation where appropriate
  - Implement additional client-side validation in JavaScript
- **XSS Prevention:** Use `textContent` instead of `innerHTML` when displaying user-generated content
- Follow OWASP security best practices
- Be cautious with `document.execCommand('copy')` fallback - it's deprecated but needed for older browser support

### AI/ChatGPT Integration
- Handle API errors gracefully
- Implement rate limiting and error handling for external API calls
- Consider caching strategies for frequently requested content
- Respect API usage limits and costs

## Build and Deployment
- **No Build Process Required:** This is a static web application with no build step
- **Development:** Simply open `index.html` in a web browser
- **Deployment:** Can be deployed to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)
- **CI Workflow:** Basic workflow is configured in `.github/workflows/blank.yml`
  - Runs on push and pull requests to the `main` branch
  - Currently runs basic checks; can be extended with linting or validation
- **No Dependencies:** No `package.json` or `node_modules` - pure HTML/CSS/JS

## Development Workflow
1. **Local Development:**
   ```bash
   # Simply open index.html in your browser
   # Or use a simple HTTP server:
   python -m http.server 8000
   # Then navigate to http://localhost:8000
   ```

2. **Making Changes:**
   - Edit HTML in `index.html`
   - Edit JavaScript in `script.js`
   - Edit styles in `styles.css`
   - Refresh browser to see changes

3. **Future API Integration:**
   - Replace `generateMockContent()` function with actual ChatGPT API calls
   - Add proper API key management
   - Implement error handling for API failures
   - Add rate limiting to respect API quotas

## Getting Started
1. Clone the repository
2. Open `index.html` in a web browser (or use a local server)
3. Start making changes to HTML/CSS/JS files
4. Refresh browser to see changes

For detailed feature documentation, refer to README.md

## Important Notes
- **Current State:** Application uses mock content generation
- **Internationalization:** All UI text is in Czech language
- **Browser Compatibility:** Targets modern browsers with fallbacks for older browsers (e.g., clipboard API)
- **Responsive Design:** Mobile-first approach with breakpoints for tablets and desktops
