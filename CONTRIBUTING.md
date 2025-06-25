# Contributing to LingoBot 🤝

Thank you for your interest in contributing to LingoBot! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/lingobot.git
   cd lingobot
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key
   ```
5. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use descriptive names for variables, functions, and components
- **Comments**: Add comments for complex logic

### File Structure

```
LingoBot/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Express backend
│   ├── lib/               # Backend utilities
│   ├── routes.ts          # API route definitions
│   ├── auth.ts            # Authentication logic
│   └── storage.ts         # Data storage layer
├── shared/                # Shared types and schemas
└── scripts/               # Build and deployment scripts
```

### Component Guidelines

- **Functional Components**: Use functional components with hooks
- **Props Interface**: Define TypeScript interfaces for component props
- **Error Boundaries**: Wrap components that might fail
- **Loading States**: Handle loading and error states gracefully

### API Guidelines

- **Validation**: Use Zod schemas for request/response validation
- **Error Handling**: Provide meaningful error messages
- **Status Codes**: Use appropriate HTTP status codes
- **Rate Limiting**: Respect rate limits and implement proper throttling

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment**: OS, Node.js version, npm version
2. **Steps to Reproduce**: Clear, step-by-step instructions
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Screenshots**: If applicable, include screenshots or GIFs
6. **Console Logs**: Any error messages or console output

## 💡 Feature Requests

When requesting features, please:

1. **Describe the Problem**: What problem does this feature solve?
2. **Propose a Solution**: How would you like to see this implemented?
3. **Use Cases**: Provide specific examples of how this would be used
4. **Mockups**: If possible, include mockups or wireframes

## 🔧 Pull Request Process

1. **Create a Branch**: Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**: Implement your changes following the guidelines above

3. **Test Your Changes**:
   ```bash
   npm run check        # TypeScript checking
   npm run dev          # Test locally
   ```

4. **Commit Your Changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**: 
   - Use the PR template
   - Describe your changes clearly
   - Link any related issues

### Commit Message Format

Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(chat): add message reactions
fix(auth): resolve session timeout issue
docs(readme): update installation instructions
```

## 🧪 Testing

### Running Tests
```bash
npm run check        # TypeScript type checking
npm run build        # Build verification
```

### Manual Testing Checklist
- [ ] Authentication flows work correctly
- [ ] Chat functionality operates as expected
- [ ] Avatar customization works
- [ ] Responsive design on different screen sizes
- [ ] Error handling displays appropriate messages
- [ ] Rate limiting works correctly

## 📚 Documentation

When adding new features, please:

1. **Update README.md** if the feature affects setup or usage
2. **Add JSDoc comments** for new functions and components
3. **Update API documentation** if adding new endpoints
4. **Include examples** of how to use new features

## 🔒 Security

- **Never commit sensitive data** (API keys, passwords, etc.)
- **Validate all inputs** on both client and server
- **Use HTTPS** in production
- **Implement proper authentication** for new features
- **Follow OWASP guidelines** for security best practices

## 🎨 UI/UX Guidelines

- **Consistency**: Follow existing design patterns
- **Accessibility**: Ensure features are accessible to all users
- **Responsive**: Test on different screen sizes
- **Performance**: Optimize for fast loading and smooth interactions
- **User Feedback**: Provide clear feedback for user actions

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Docker Deployment
```bash
docker-compose up -d
```

## 📞 Getting Help

- **Issues**: Use GitHub issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code Review**: Request reviews from maintainers for complex changes

## 🙏 Recognition

Contributors will be recognized in:
- The project README
- Release notes
- GitHub contributors page

## 📄 License

By contributing to LingoBot, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to LingoBot! 🎉 