# Copilot Instructions for Social Media Content Generator

## Project Overview
This is a web application for generating social media content using ChatGPT. The application is designed to help users create engaging content for various social media platforms.

**Repository Name:** social-media-content-generator  
**Purpose:** Webová aplikace pro generování obsahu na sociální síti pomocí ChatGPT (Web application for generating social media content using ChatGPT)

**Technology Stack:**
- Pure HTML5, CSS3, and Vanilla JavaScript (no frameworks or build tools)
- Playwright for end-to-end browser testing
- Node.js for verification scripts and test runner
- Python HTTP server for local development

**Current Status:**
- The application uses mock content generation (actual ChatGPT API integration is planned for future)
- Fully functional UI with form validation, content display, and copy-to-clipboard features
- Responsive design supporting mobile and desktop viewports

## Project Structure

```
/
├── index.html           # Main application HTML file with form and UI
├── script.js            # Application logic and event handlers
├── styles.css           # Styling and responsive design
├── app.test.js          # Playwright end-to-end tests
├── playwright.config.js # Playwright test configuration
├── verify-app.js        # Node.js script to verify app files are valid
├── README.md            # User-facing documentation (in Czech)
├── LAUNCH_GUIDE.md      # Detailed guide for launching the app
└── .github/
    ├── copilot-instructions.md  # This file
    └── workflows/
        └── blank.yml    # CI workflow for testing
```

**Key Files:**
- `index.html`: Contains the entire UI structure including form fields for topic, platform, tone, length, keywords, and additional info
- `script.js`: Handles form submission, validation, mock content generation, copy-to-clipboard functionality, and DOM manipulation
- `styles.css`: Provides modern gradient design, responsive layout, and animation effects
- `app.test.js`: Playwright tests covering form validation, content generation, copy functionality, and responsive design

## Development Guidelines

### Code Style and Conventions
- **JavaScript**: Use ES6+ features, `const`/`let` instead of `var`, arrow functions where appropriate
- **HTML**: Use semantic HTML5 elements, include proper accessibility attributes (labels, ARIA where needed)
- **CSS**: Use modern CSS features (Grid, Flexbox), maintain mobile-first responsive design
- Write clear, self-documenting code with meaningful variable and function names
- Add comments for complex logic or non-obvious implementations
- Keep functions small and focused on a single responsibility
- The application is in Czech language - maintain consistency in UI text

### Git Workflow
- Create feature branches from `main` for new development
- Write clear, descriptive commit messages
- Ensure CI checks pass before merging pull requests
- CI runs verification script and Playwright tests on every push/PR

### Testing
- **Test Framework**: Playwright for browser-based E2E testing
- **Test Location**: All tests in `app.test.js`
- **Running Tests**: `npx playwright test` (Playwright auto-starts Python HTTP server on port 8000)
- Write tests for new features and bug fixes
- Ensure existing tests pass before submitting changes
- Test coverage includes: form validation, content generation flow, copy functionality, responsive design
- Tests use Czech language selectors matching the UI text

### Documentation
- Update README.md when adding new features or changing setup instructions
- Update LAUNCH_GUIDE.md if changing how the app is served or deployed
- Document API endpoints, configuration options, and environment variables
- Keep documentation in sync with code changes
- Maintain both Czech (user-facing) and English (developer-facing) documentation

### Security
- Never commit sensitive data (API keys, passwords, tokens) to the repository
- Use environment variables for configuration and secrets
- Validate and sanitize user inputs (especially important when real ChatGPT API is integrated)
- Follow OWASP security best practices
- When ChatGPT API is added, ensure API keys are stored securely and never exposed client-side

### AI/ChatGPT Integration (Future)
- Handle API errors gracefully
- Implement rate limiting and error handling for external API calls
- Consider caching strategies for frequently requested content
- Respect API usage limits and costs
- Mock generation is currently used for development and testing

## Build and Test Instructions

### No Build Step Required
This project uses vanilla HTML, CSS, and JavaScript with no build tools, bundlers, or transpilers. Files can be directly opened in a browser or served via any HTTP server.

### Local Development Setup

**Method 1: Python HTTP Server (Recommended for testing)**
```bash
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser
```

**Method 2: Direct File Opening**
```bash
# Simply open index.html in your browser
# Note: Some features (clipboard API) may require localhost or HTTPS
```

**Method 3: Node.js HTTP Server**
```bash
npm install -g http-server
http-server -p 8000
```

### Verification

**Verify Application Files:**
```bash
node verify-app.js
```
This script checks:
- All required files exist (index.html, script.js, styles.css)
- HTML structure is valid
- JavaScript syntax is correct
- CSS is properly formatted
- Files are correctly linked

### Running Tests

**Install Playwright (first time only):**
```bash
npm init -y  # Creates package.json if not present
npm install --save-dev playwright
npx playwright install chromium
```

**Run Tests:**
```bash
npx playwright test
```

Playwright automatically:
- Starts Python HTTP server on port 8000
- Runs all tests in `app.test.js`
- Shuts down the server after tests complete

**Run Tests with UI:**
```bash
npx playwright test --ui
```

**Run Specific Test:**
```bash
npx playwright test -g "content generation"
```

### CI/CD

**CI Workflow:** `.github/workflows/blank.yml`
- Runs on: push and pull requests to `main` branch
- Steps:
  1. Checkout code
  2. Run `node verify-app.js` to verify application files
  3. Setup Node.js 18
  4. Install Playwright
  5. Run Playwright tests

**Ensure CI passes before merging:**
```bash
# Locally verify what CI will check:
node verify-app.js && npx playwright test
```

## Architecture and Design Patterns

### Application Flow
1. **Page Load**: DOMContentLoaded event initializes form listeners and sets current year
2. **Form Submission**: 
   - Prevents default submission
   - Validates all required fields
   - Shows loading state
   - Calls `generateContent()` with form data
   - Displays result or error
3. **Content Display**: Shows generated content with copy and new content buttons
4. **Copy Function**: Uses Clipboard API to copy content and shows success message
5. **Reset**: Clears form and hides result

### Key Functions in script.js
- `validateForm(formData)`: Validates required fields and data format
- `generateContent(formData)`: Currently returns mock content; will be replaced with ChatGPT API call
- `displayResult(content)`: Shows generated content in result container
- `copyToClipboard()`: Handles clipboard copying with fallback support

### CSS Architecture
- Mobile-first responsive design
- CSS Grid and Flexbox for layouts
- CSS custom properties could be added for theming
- Gradient backgrounds with modern aesthetics
- Smooth transitions and hover effects

### Form Fields
- **Topic** (required): Main subject for content generation
- **Platform** (required): facebook, instagram, twitter, linkedin, tiktok
- **Tone** (required): professional, casual, friendly, humorous, inspirational
- **Length** (required): short, medium, long
- **Keywords** (optional): Comma-separated keywords
- **Additional Info** (optional): Extra context for generation

## Getting Started

1. **Clone the repository**
2. **Verify the app**: Run `node verify-app.js`
3. **Start local server**: Run `python3 -m http.server 8000`
4. **Open in browser**: Navigate to `http://localhost:8000`
5. **Run tests**: Install Playwright and run `npx playwright test`

For detailed launch instructions, see `LAUNCH_GUIDE.md`.
