# Copilot Instructions for Social Media Content Generator

## Project Overview
This is a web application for generating social media content using ChatGPT. The application is designed to help users create engaging content for various social media platforms.

**Repository Name:** social-media-content-generator  
**Purpose:** Webová aplikace pro generování obsahu na sociální síti pomocí ChatGPT (Web application for generating social media content using ChatGPT)

## Technology Stack
- **Frontend:** Pure HTML5, CSS3, and Vanilla JavaScript (no frameworks)
- **Testing:** Playwright for end-to-end browser testing
- **CI/CD:** GitHub Actions
- **Server:** Python's built-in HTTP server for local development (python3 -m http.server)
- **Language:** Czech language UI and documentation

## Development Guidelines

### Code Style and Conventions
- Follow language-specific best practices and style guides
- Write clear, self-documenting code with meaningful variable and function names
- Add comments for complex logic or non-obvious implementations
- Keep functions small and focused on a single responsibility

### Git Workflow
- Create feature branches from `main` for new development
- Write clear, descriptive commit messages
- Ensure CI checks pass before merging pull requests

### Testing
- Write tests for new features and bug fixes
- Ensure existing tests pass before submitting changes
- Aim for meaningful test coverage of critical functionality

### Documentation
- Update README.md when adding new features or changing setup instructions
- Document API endpoints, configuration options, and environment variables
- Keep documentation in sync with code changes

### Security
- Never commit sensitive data (API keys, passwords, tokens) to the repository
- Use environment variables for configuration and secrets
- Validate and sanitize user inputs
- Follow OWASP security best practices

### AI/ChatGPT Integration
- Handle API errors gracefully
- Implement rate limiting and error handling for external API calls
- Consider caching strategies for frequently requested content
- Respect API usage limits and costs

## File Structure
```
.
├── index.html           # Main HTML file with form and UI
├── script.js            # JavaScript logic for form handling and content generation
├── styles.css           # CSS styling with gradient backgrounds and responsive design
├── app.test.js          # Playwright end-to-end tests
├── verify-app.js        # Node.js script to verify application files exist
├── playwright.config.js # Playwright test configuration
└── .github/
    └── workflows/
        └── blank.yml    # CI workflow configuration
```

## Build and Test Commands

### Running Tests Locally
```bash
# Install dependencies (first time only)
npm init -y
npm install --save-dev playwright
npx playwright install chromium

# Run tests
npx playwright test

# Run tests with UI
npx playwright test --ui
```

### Local Development
```bash
# Start local server on port 8000
python3 -m http.server 8000

# Access the application
# Open http://localhost:8000/index.html in browser
```

### Verification
```bash
# Verify application files
node verify-app.js
```

## Build and Deployment
- CI workflow is configured in `.github/workflows/blank.yml`
- Workflow runs on push and pull requests to the `main` branch
- CI performs:
  1. File verification using `verify-app.js`
  2. Playwright browser tests
- Ensure all CI checks pass before merging

## Project-Specific Conventions

### JavaScript
- Use vanilla JavaScript (no frameworks or libraries)
- Use `addEventListener` for event handling
- Use `document.getElementById` and `document.querySelector` for DOM manipulation
- Keep functions small and focused
- Mock API responses for now (actual ChatGPT integration to be added later)

### HTML/CSS
- Single-page application design
- Semantic HTML5 elements
- CSS custom properties for theming (gradient backgrounds)
- Responsive design with mobile-first approach
- All text should be in Czech language

### Testing
- Playwright tests in `app.test.js`
- Test application launch, form presence, validation, and end-to-end content generation
- Tests run against Python HTTP server on port 8000
- Use role-based selectors for better test maintainability

## Important Notes
- This is a **static web application** - no backend server required
- Current version uses **mock content generation** - ChatGPT API integration is planned for future
- All user-facing text is in **Czech language**
- The application is self-contained and can be opened directly in a browser

## Getting Started
1. Open `index.html` directly in a browser, or
2. Start a local server: `python3 -m http.server 8000`
3. For development with tests, install Playwright: `npm install --save-dev playwright`
