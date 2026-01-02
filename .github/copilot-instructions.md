# Copilot Instructions for Social Media Content Generator

## Project Overview
This is a web application for generating social media content using ChatGPT. The application is designed to help users create engaging content for various social media platforms including Facebook, Instagram, Twitter/X, LinkedIn, and TikTok.

**Repository Name:** social-media-content-generator  
**Purpose:** Webová aplikace pro generování obsahu na sociální síti pomocí ChatGPT (Web application for generating social media content using ChatGPT)  
**Primary Language:** Czech (CS) - UI text and documentation are in Czech

## Technology Stack
- **Frontend:** Pure HTML5, CSS3, and Vanilla JavaScript (no frameworks)
- **Styling:** Modern CSS with gradient backgrounds and responsive design
- **Testing:** Playwright for end-to-end browser testing
- **Build/Deploy:** Static files served via simple HTTP server (Python, Node.js, or PHP)
- **CI/CD:** GitHub Actions workflow (`.github/workflows/blank.yml`)

## Project Structure
```
/
├── index.html           # Main HTML file with form and UI
├── script.js            # Application logic and event handlers
├── styles.css           # All CSS styles for the application
├── app.test.js          # Playwright browser tests
├── verify-app.js        # Application file verification script
├── playwright.config.js # Playwright test configuration
├── package.json         # Node.js dependencies (Playwright only)
├── README.md            # Project documentation (Czech)
├── LAUNCH_GUIDE.md      # Application launch instructions
└── .github/
    ├── copilot-instructions.md  # This file
    └── workflows/
        └── blank.yml    # CI workflow configuration
```

## Build and Test Commands

### Verification
```bash
# Verify application files exist and are valid
npm run verify
# or
node verify-app.js
```

### Testing
```bash
# Install dependencies (first time only)
npm install

# Install Playwright browsers (first time only)
npx playwright install chromium

# Run all Playwright tests
npm test
# or
npx playwright test
```

### Local Development
```bash
# Serve the application locally (choose one):
python -m http.server 8000
# or
npx http-server
# or
php -S localhost:8000

# Then open: http://localhost:8000/index.html
```

## Development Guidelines

### Code Style and Conventions
- **JavaScript:**
  - Use modern ES6+ syntax (const/let, arrow functions, template literals)
  - Follow event-driven programming patterns
  - Prefix DOM element variables with clear names (e.g., `form`, `submitBtn`)
  - Use DOMContentLoaded event to ensure DOM is ready
  - Keep functions pure and focused on single responsibilities
  - Use async/await for asynchronous operations
  
- **HTML:**
  - Semantic HTML5 elements (header, main, footer, form, section)
  - Proper form structure with labels and required field indicators
  - Czech language attributes (`lang="cs"`)
  - Accessibility: use proper ARIA labels and semantic elements
  
- **CSS:**
  - BEM-like naming convention (e.g., `.content-form`, `.form-group`)
  - Mobile-first responsive design
  - CSS custom properties for theming (consider adding in future)
  - Gradient backgrounds and modern visual effects
  - Focus on UX with loading states and transitions

### Git Workflow
- Create feature branches from `main` for new development
- Branch naming: `feature/description` or `fix/issue-description`
- Write clear, descriptive commit messages following conventional commits format
- Ensure CI checks pass before merging pull requests
- Keep commits focused and atomic

### Testing Guidelines
- **Test Framework:** Playwright with Chromium browser
- Write tests for:
  - UI element visibility and presence
  - Form validation and submission
  - User interaction flows (click, type, select)
  - Responsive design at different viewports
  - Copy/paste functionality
- Use descriptive test names that explain what is being tested
- Tests should be independent and not rely on execution order
- Mock external API calls (currently using mock content generator)

### Testing Best Practices
- Test files should be named `*.test.js`
- Group related tests using `test.describe()`
- Use Playwright's built-in assertions (`expect()`)
- Test positive and negative scenarios
- Verify loading states and error handling
- Check accessibility features

### Documentation
- README.md is in Czech - maintain Czech language for user-facing docs
- Code comments can be in English for technical clarity
- Update README.md when adding features or changing setup instructions
- Document any new form fields, platforms, or content generation options
- Keep LAUNCH_GUIDE.md in sync with deployment instructions

### Security Best Practices
- **Critical:** Never commit sensitive data (API keys, passwords, tokens)
- Use environment variables or secure configuration for API keys
- Validate and sanitize ALL user inputs before processing
- Escape output to prevent XSS attacks (especially generated content)
- Follow OWASP Top 10 security guidelines
- Content Security Policy (CSP) should be considered for production
- Implement rate limiting for API calls to prevent abuse

### AI/ChatGPT Integration Notes
- Current implementation uses mock content generation
- Production version will integrate ChatGPT API
- When implementing real API:
  - Handle API errors gracefully with user-friendly messages
  - Implement rate limiting and retry logic
  - Add loading indicators during API calls
  - Consider caching frequent requests
  - Respect API usage limits and costs
  - Implement proper error boundaries
  - Validate API responses before displaying

### UI/UX Patterns
- Show loading states with `.loading` class on buttons
- Disable form submission during content generation
- Provide clear feedback for user actions (copy confirmation)
- Use emoji icons (🚀, 📝, etc.) for visual appeal
- Maintain responsive design for mobile devices
- Form validation with visual indicators (red borders, required *)
- Clear "New Content" button to reset and try again

### Common Pitfalls to Avoid
- Don't modify the core HTML structure without updating tests
- Don't remove or change existing CSS class names (tests depend on them)
- Don't add build tools or bundlers - this is a vanilla JS project
- Don't add heavy JavaScript frameworks - keep it lightweight
- Don't forget to test on mobile viewport sizes
- Don't commit `node_modules/` or `package-lock.json` (already gitignored)
- Don't add package dependencies beyond Playwright for testing

### Code Patterns Used in This Project

**Form Handling:**
```javascript
form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Get form data, validate, then generate content
});
```

**Loading State Management:**
```javascript
submitBtn.classList.add('loading');
submitBtn.disabled = true;
// ... perform async operation ...
submitBtn.classList.remove('loading');
submitBtn.disabled = false;
```

**Error Handling:**
```javascript
generateContent(formData)
    .then(content => { /* success */ })
    .catch(error => {
        console.error('Error:', error);
        alert('User-friendly error message');
    });
```

## CI/CD Pipeline
- **Workflow File:** `.github/workflows/blank.yml`
- **Triggers:** Push and pull requests to `main` branch, plus manual dispatch
- **Steps:**
  1. Checkout repository
  2. Verify application files with `verify-app.js`
  3. Setup Node.js 18
  4. Install Playwright and dependencies
  5. Run Playwright tests
- **Requirements:** All tests must pass before merge

## Dependency Management
- This project intentionally has minimal dependencies
- Only development dependency: Playwright (for testing)
- No runtime dependencies - pure vanilla JavaScript
- `package.json` is only for test tooling
- When adding dependencies:
  - Justify the need (should be testing-related only)
  - Keep the application runtime dependency-free
  - Update `.gitignore` if new artifact directories are created

## Future Considerations
- Real ChatGPT API integration (replace mock generator)
- API key management and configuration
- Content history/saving feature
- Additional platform support
- Multi-language UI support
- Dark mode theme
- Advanced content customization options
- Analytics and usage tracking

## Getting Started for New Contributors
1. Clone the repository
2. Read the README.md (in Czech) for project overview
3. Open `index.html` in a browser or start local server
4. Install dependencies: `npm install`
5. Run tests to ensure everything works: `npm test`
6. Review existing code in `script.js` and `styles.css`
7. Make changes and test thoroughly
8. Run `npm run verify` before committing

## Useful Resources
- Playwright Documentation: https://playwright.dev
- OWASP Security Guidelines: https://owasp.org/www-project-top-ten/
- MDN Web Docs: https://developer.mozilla.org
