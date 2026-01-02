# Copilot Instructions for Social Media Content Generator

## Project Overview
This is a web application for generating social media content using ChatGPT. The application is designed to help users create engaging content for various social media platforms.

**Repository Name:** social-media-content-generator  
**Purpose:** Webová aplikace pro generování obsahu na sociální síti pomocí ChatGPT (Web application for generating social media content using ChatGPT)

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

## Build and Deployment
- CI workflow is configured in `.github/workflows/blank.yml`
- Workflow runs on push and pull requests to the `main` branch
- Ensure all CI checks pass before merging

## Getting Started
Refer to the README.md for initial setup and running instructions.
