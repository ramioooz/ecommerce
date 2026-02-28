# Agent Instructions for E-commerce Monorepo

## Project Structure
- Monorepo with Turborepo
- Two main services: `user-service` and `order-service` (in `apps/`)
- Shared packages may be in `packages/`

## Build Commands
```bash
# Build entire monorepo
npm run build

# Build specific service
npm run build --filter=@ecommerce/user-service
npm run build --filter=@ecommerce/order-service

# Development mode
npm run dev

# Clean build artifacts
npm run clean
```

## Lint Commands
```bash
# Lint entire monorepo
npm run lint

# Lint specific service
npm run lint --filter=@ecommerce/user-service
```

## Test Commands
```bash
# Run all tests
npm run test

# Run tests for specific service
npm run test --filter=@ecommerce/user-service
npm run test --filter=@ecommerce/order-service

# Run specific test file
npm run test -- --testPathPattern=src/users/users.service.spec.ts

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

Note: Currently no test files exist. Create `.spec.ts` files alongside implementation files.

## Code Style Guidelines

### Imports
1. External packages first (NestJS, TypeORM, etc.)
2. Internal modules second (relative paths)
3. Order imports alphabetically within each group
4. Use barrel exports when appropriate (`index.ts` files)
5. Prefer specific imports over namespace imports
6. Group Angular/NestJS decorators at top of class

### Formatting
1. TypeScript strict mode enabled
2. No implicit any (`noImplicitAny: true`)
3. Strict null checks (`strictNullChecks: true`)
4. Single quotes for strings
5. Semicolons required
6. 2-space indentation
7. Trailing commas in multiline objects/arrays
8. Maximum line length 100 characters

### Types
1. Define interfaces for request/response objects
2. Use enums for predefined constants
3. Explicitly type function return values
4. Leverage TypeORM entities for database types
5. Use DTOs for data transfer objects
6. Define generic interfaces for shared structures

### Naming Conventions
1. PascalCase for classes, interfaces, enums, decorators
2. camelCase for variables, functions, methods, properties
3. UPPER_CASE for constants
4. File names match exported class/interface name
5. Private members prefixed with underscore (_privateMethod)
6. Async functions suffixed with `Async` if needed for clarity

### Error Handling
1. Use NestJS built-in exceptions (NotFoundException, ConflictException, etc.)
2. Custom exception filters for global error handling
3. Validation using class-validator decorators
4. Proper HTTP status codes
5. Consistent error response structure
6. Log errors appropriately with context

### NestJS Patterns
1. Use dependency injection via constructor
2. Services annotated with `@Injectable()`
3. Controllers with appropriate `@Controller()` decorators
4. Entities with TypeORM decorators
5. DTOs for validation and data transfer
6. Guards for authentication/authorization
7. Swagger decorators for API documentation

### Database/TypeORM
1. Entities in `entities/` directory
2. Repositories injected via `@InjectRepository()`
3. Relations properly defined with cascades where appropriate
4. UUID primary keys for most entities
5. Timestamp columns with `@CreateDateColumn()` and `@UpdateDateColumn()`
6. Indexes for frequently queried fields

### Security Practices
1. Validate all input with class-validator
2. Hash passwords with bcrypt
3. Use JWT for authentication
4. Role-based access control with guards
5. Environment variables for secrets
6. Helmet middleware for HTTP headers

### Documentation
1. Swagger/OpenAPI decorators on all controllers
2. JSDoc comments for complex functions
3. README files for each service
4. Inline comments for non-obvious logic

## Folder Structure
```
apps/
  user-service/
    src/
      addresses/
      auth/
      common/
      users/
      app.module.ts
      main.ts
  order-service/
    src/
      orders/
      cart/
      app.module.ts
      main.ts
```

## Environment Setup
1. Node.js >=20.0.0
2. PostgreSQL for databases
3. Docker Compose provided for development
4. Environment variables in `.env` file (copy `.env.example`)

## Adding New Features
1. Follow existing module structure
2. Create entities, services, controllers as needed
3. Add appropriate DTOs for validation
4. Include Swagger decorators for API docs
5. Follow established error handling patterns
6. Add unit/integration tests when implementing

## Commit Message Convention
- feat: New feature
- fix: Bug fix
- chore: Maintenance
- docs: Documentation
- refactor: Code restructuring
- test: Adding tests
- style: Formatting, missing semicolons, etc.

Format: `<type>(<scope>): <subject>`
Example: `feat(users): add profile update endpoint`