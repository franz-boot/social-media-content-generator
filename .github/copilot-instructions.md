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
# Install dependencies (first time setup only)
# Note: This project has no package.json in the repo, it's created locally for testing
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
# Open http://localhost:8000 in browser (index.html served automatically)
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

## Dependencies and Package Management

### Current Dependencies
This project has **no external runtime dependencies** - it uses vanilla JavaScript, HTML, and CSS.

### Development Dependencies
- **Playwright** - Browser testing framework (installed locally, not committed to repo)
- **Node.js** - Required only for running tests and verification scripts

### Adding New Dependencies
- **AVOID** adding new dependencies unless absolutely necessary
- If a new dependency is required:
  1. Justify why it's needed and why vanilla JS won't suffice
  2. Check for security vulnerabilities before adding
  3. Document the dependency in this file
  4. Update the CI workflow if needed
- Keep the project lightweight and self-contained

## Linting and Code Quality

### No Automated Linters
This project does not use automated linters (ESLint, Prettier, etc.) to keep dependencies minimal.

### Manual Code Review Guidelines
When reviewing code, check for:
- **JavaScript**: Proper error handling, consistent naming, no console.log in production code
- **HTML**: Semantic elements, proper accessibility attributes (alt text, ARIA labels)
- **CSS**: Consistent naming, no unused rules, responsive design principles
- **Czech language**: All user-facing text must be in Czech

### Code Style Expectations
- Use 4-space indentation for consistency with existing code
- Use meaningful variable and function names
- Comment complex logic, but prefer self-documenting code
- Keep functions small and focused (< 50 lines ideally)

## Common Issues and Troubleshooting

### Issue: Tests fail with "Unable to start webServer"
**Solution**: Make sure Python 3 is installed and port 8000 is not in use
```bash
# Check if port is in use
lsof -i :8000
# Kill the process if needed
kill -9 <PID>
```

### Issue: Clipboard API doesn't work when testing
**Solution**: The application automatically falls back to older copy methods. Tests grant clipboard permissions explicitly.

### Issue: "ENOENT: no such file or directory" during tests
**Solution**: Ensure you're running commands from the repository root directory

### Issue: Changes not reflected in browser
**Solution**: Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R) to clear cache

### Issue: Form validation not working
**Solution**: Check browser console for JavaScript errors. Ensure script.js is loaded correctly.

## CI/CD Pipeline Details

### Workflow Triggers
- **Push** to `main` branch
- **Pull requests** targeting `main` branch
- **Manual** workflow dispatch

### CI Steps
1. **Checkout code** - Uses actions/checkout@v4
2. **Verify application files** - Runs `verify-app.js` to check file integrity
3. **Setup Node.js** - Installs Node.js 18 for testing
4. **Install Playwright** - Sets up browser testing environment
5. **Run tests** - Executes Playwright tests with Chromium

### Expected CI Duration
- Typical run time: 2-3 minutes
- If CI takes longer, check for network issues or test timeouts

### CI Failure Investigation
If CI fails:
1. Check the workflow logs in GitHub Actions
2. Look for specific error messages in each step
3. Run the same commands locally to reproduce
4. Check if any files were modified that could affect tests

## Security Considerations

### Current Security Measures
- No API keys or secrets in the codebase
- Input sanitization through HTML escaping
- CSP-friendly code (no inline scripts or styles beyond necessary)

### Future Security Requirements (Production)
When integrating ChatGPT API:
- **Never** commit API keys to the repository
- Use environment variables or secure secret management
- Implement backend proxy to hide API keys from frontend
- Add rate limiting to prevent abuse
- Validate and sanitize all user inputs before API calls
- Implement proper error handling to avoid exposing sensitive data

### Security Best Practices
- Keep dependencies up to date (though we have minimal dependencies)
- Review all user inputs for XSS vulnerabilities
- Use HTTPS in production to protect data in transit
- Implement Content Security Policy headers

## Performance Considerations

### Current Performance
- Lightweight: No external dependencies, minimal JavaScript
- Fast load time: All assets are small and load quickly
- Responsive: Mobile-first CSS design

### Optimization Tips
- Images should be optimized and use appropriate formats
- Consider lazy loading if adding more content sections
- Minify CSS/JS for production deployment
- Use browser caching headers when deploying

## Deployment Guidelines

### Static Hosting Options
This application can be deployed to any static hosting service:
- **GitHub Pages** - Free, easy setup from repository
- **Netlify** - Free tier, automatic deployments from Git
- **Vercel** - Free tier, optimized for frontend projects
- **Cloudflare Pages** - Free tier, global CDN

### Deployment Steps (GitHub Pages example)
1. Go to repository Settings > Pages
2. Select branch to deploy (usually `main`)
3. Select root folder or `/docs` folder
4. Save and wait for deployment

### Pre-deployment Checklist
- [ ] All tests pass locally and in CI
- [ ] Application verified with `verify-app.js`
- [ ] All user-facing text is in Czech
- [ ] No console.log statements in production code
- [ ] No hardcoded URLs or API keys
- [ ] README.md is up to date

## Testing Strategy

### Test Coverage
Current tests cover:
- Application loading and page title
- Form presence and visibility of all fields
- Form validation (empty form submission)
- End-to-end content generation flow
- Copy to clipboard functionality
- Form reset functionality
- Responsive design (mobile viewport)

### Running Tests Locally
```bash
# First time setup
npm init -y
npm install --save-dev playwright
npx playwright install chromium

# Run all tests
npx playwright test

# Run tests in UI mode (interactive)
npx playwright test --ui

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test app.test.js
```

### Writing New Tests
When adding new features:
1. Add tests to `app.test.js` following existing patterns
2. Use role-based selectors for better maintainability
3. Test both success and failure scenarios
4. Include mobile viewport tests if UI changes affect responsive design
5. Grant necessary permissions (like clipboard) in tests

### Test Maintenance
- Keep tests focused and independent
- Use descriptive test names that explain what is being tested
- Avoid hard-coded timeouts; use Playwright's auto-waiting features
- Update tests when UI text changes (especially Czech text)

## Code Review Checklist

Before submitting a pull request, ensure:
- [ ] Code follows project conventions (vanilla JS, no frameworks)
- [ ] All user-facing text is in Czech language
- [ ] Tests pass locally: `npx playwright test`
- [ ] Application verified: `node verify-app.js`
- [ ] No new dependencies added (unless absolutely necessary and justified)
- [ ] Code is properly commented where needed
- [ ] No console.log or debug statements left in code
- [ ] Changes are minimal and focused on the specific issue
- [ ] Documentation updated if needed (README.md, this file)
- [ ] No breaking changes to existing functionality

## Mock vs Production Implementation

### Current State (Mock)
The application currently uses **mock content generation**:
- No external API calls
- Content generated locally in `generateMockContent()` function
- 2-second simulated delay to mimic API calls
- Mock content includes platform-specific emojis and tone adjustments

### Production Implementation (Future)
When implementing ChatGPT API integration:
1. **Backend Required**: Create a backend service to securely call OpenAI API
2. **API Key Management**: Use environment variables, never commit keys
3. **Error Handling**: Handle API errors, rate limits, and timeouts gracefully
4. **Cost Management**: Implement request limits and monitoring
5. **Prompt Engineering**: Design effective prompts based on form inputs
6. **Response Parsing**: Handle and format API responses properly

### Transition Strategy
To move from mock to production:
1. Keep mock mode available for testing without API costs
2. Add environment variable to toggle between mock and production modes
3. Implement backend API endpoint (e.g., with Node.js/Express or Python/Flask)
4. Update `generateContent()` function to call backend API
5. Add proper error handling and user feedback
6. Test thoroughly with production API before full deployment

## Getting Started for New Contributors
1. Clone the repository
2. Read README.md for project overview
3. Read this file (copilot-instructions.md) for development guidelines
4. Run `node verify-app.js` to verify setup
5. Open `index.html` in browser to see the application
6. Install Playwright for testing: `npm install --save-dev playwright`
7. Run tests to ensure everything works: `npx playwright test`
8. Make changes following the guidelines in this document
9. Test your changes locally before submitting PR
