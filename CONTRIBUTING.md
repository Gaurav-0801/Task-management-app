# Contributing to Task Management App

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Git

### Local Development Setup

1. **Fork and clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/task-management-app.git
   cd task-management-app
   \`\`\`

2. **Run setup script**
   \`\`\`bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   \`\`\`

3. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

4. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

5. **Test your changes**
   \`\`\`bash
   npm run type-check
   npm run lint
   npm test
   \`\`\`

6. **Commit and push**
   \`\`\`bash
   git commit -m "feat: add your feature"
   git push origin feature/your-feature-name
   \`\`\`

7. **Create a Pull Request**

## Commit Message Guidelines

Use conventional commits format:
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that don't affect code meaning (formatting, etc.)
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Code change that improves performance
- `test:` Adding missing tests
- `chore:` Changes to build process, dependencies, etc.

Examples:
\`\`\`
feat: add task filtering by priority
fix: resolve database connection timeout issue
docs: update API documentation
test: add integration tests for task deletion
\`\`\`

## Pull Request Process

1. **Before submitting:**
   - Ensure all tests pass: `npm test`
   - Run type checks: `npm run type-check`
   - Run linter: `npm run lint`
   - Update README if needed

2. **PR Description:**
   - Clear title describing the change
   - Detailed description of what and why
   - Link related issues with `Closes #123`
   - Add screenshots for UI changes

3. **Code Review:**
   - Address reviewer comments promptly
   - Keep commits clean and organized
   - Update code based on feedback

## Development Workflow

### Frontend Development
- Components live in `/components`
- Pages in `/app`
- Utilities in `/lib`
- Styles: Tailwind CSS classes

### Backend Development
- Routes in `/server/routes`
- Database config in `/server/config`
- Types in `/server/types`
- Tests in `/server/tests`

### Database Changes
1. Create new SQL migration in `/scripts`
2. Document the schema changes
3. Update `README.md` if needed

## Testing

### Running Tests
\`\`\`bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
\`\`\`

### Writing Tests
- Use Jest for unit/integration tests
- Test both happy path and error cases
- Aim for 80%+ code coverage

Example test:
\`\`\`typescript
describe('Task API', () => {
  it('should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task' })
    
    expect(response.status).toBe(201)
    expect(response.body.title).toBe('Test Task')
  })
})
\`\`\`

## Code Style

- **Naming:** camelCase for variables/functions, PascalCase for components/classes
- **Formatting:** Use Prettier (configured in project)
- **Comments:** Comment "why," not "what"
- **Imports:** Group by: react, external libs, internal imports

\`\`\`typescript
// ✅ Good
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { fetchTasks } from '@/lib/api'

// ❌ Avoid
import React from 'react'
import fetchTasks from '../../lib/api'
import Button from '../../components/ui/button'
\`\`\`

## Reporting Issues

### Bug Reports
- Clear title describing the bug
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots/error logs if applicable

### Feature Requests
- Clear description of the feature
- Use case and benefit
- Potential implementation approach (optional)

## Documentation

- Keep README.md updated
- Add comments for complex logic
- Document API endpoints
- Include examples for new features
- Update CONTRIBUTING.md if process changes

## Questions?

- Check existing issues and discussions
- Review the README thoroughly
- Ask questions in issues using clear language
- Be patient and kind

---

**Thank you for contributing!** 🙌
