# PayFlow API - USD to INR Remittance Backend

A comprehensive TypeScript Express API for USD to INR remittance services with Prisma ORM and PostgreSQL.

## 🚀 Features

### Core API Features
- **User Authentication**: JWT-based auth with bcrypt password hashing
- **Beneficiary Management**: CRUD operations for Indian bank beneficiaries
- **Transaction Processing**: USD to INR transfer workflow with risk assessment
- **KYC Verification**: Document upload and verification system
- **Admin Panel**: Comprehensive admin dashboard with user and transaction management
- **Live FX Rates**: Real-time USD to INR exchange rate integration
- **Audit Logging**: Complete audit trail for all operations

### Security Features
- **Rate Limiting**: Configurable rate limits for different endpoints
- **CORS Protection**: Secure cross-origin resource sharing
- **Helmet Security**: Security headers and XSS protection
- **Input Validation**: Zod schema validation for all inputs
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **JWT Security**: Secure token-based authentication

### Technical Features
- **TypeScript**: Full type safety with strict TypeScript configuration
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Error Handling**: Comprehensive error handling with custom error classes
- **Logging**: Structured logging with Pino
- **Testing**: Jest test framework with Supertest for API testing
- **Code Quality**: ESLint + Prettier for code formatting and linting

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Logging**: Pino
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `POST /api/v1/auth/change-password` - Change password

### Beneficiaries
- `GET /api/v1/beneficiaries` - Get all beneficiaries
- `POST /api/v1/beneficiaries` - Create beneficiary
- `GET /api/v1/beneficiaries/:id` - Get beneficiary by ID
- `PUT /api/v1/beneficiaries/:id` - Update beneficiary
- `DELETE /api/v1/beneficiaries/:id` - Delete beneficiary

### Transactions
- `GET /api/v1/transactions` - Get transactions with filters
- `POST /api/v1/transactions` - Create new transaction
- `GET /api/v1/transactions/:id` - Get transaction by ID
- `GET /api/v1/transactions/stats` - Get transaction statistics
- `PATCH /api/v1/transactions/:id/status` - Update transaction status (Admin)

### KYC Verification
- `GET /api/v1/kyc/status` - Get KYC status
- `POST /api/v1/kyc/verify` - Submit KYC verification
- `POST /api/v1/kyc/process` - Process KYC verification
- `POST /api/v1/kyc/documents` - Upload KYC document
- `GET /api/v1/kyc/documents` - Get KYC documents

### Admin Panel
- `GET /api/v1/admin/stats` - Dashboard statistics
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/transactions` - Get all transactions
- `GET /api/v1/admin/kyc/pending` - Get pending KYC reviews
- `PATCH /api/v1/admin/kyc/:userId/status` - Update KYC status
- `GET /api/v1/admin/audit-logs` - Get audit logs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and navigate to API directory**:
```bash
cd api
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/payflow_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV="development"
```

4. **Set up database**:
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with sample data
npm run db:seed
```

5. **Start development server**:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 📊 Database Schema

### Users
- Authentication and profile information
- KYC status and data
- Role-based access control

### Beneficiaries
- Indian bank account details
- IFSC code validation
- User relationship

### Transactions
- USD to INR transfer records
- Risk assessment and flagging
- Status tracking and audit trail

### Exchange Rates
- Live USD to INR rates
- Rate caching and history

### Audit Logs
- Complete operation audit trail
- User action tracking

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (USER/ADMIN)
- Password hashing with bcrypt
- Secure cookie handling

### Input Validation
- Zod schema validation
- IFSC code format validation
- Indian mobile number validation
- Transfer amount limits

### Rate Limiting
- General API rate limiting (100 requests/15 minutes)
- Auth endpoint rate limiting (5 attempts/15 minutes)
- Transaction rate limiting (10 transactions/hour)

### Security Headers
- Helmet.js security headers
- CORS configuration
- XSS protection
- Content Security Policy

## 🌐 API Integration

### FX Rates Integration
Ready for integration with live FX APIs:
- ExchangeRate API
- Open Exchange Rates
- Fixer.io
- CurrencyLayer

### KYC Integration
Mock KYC system ready for real services:
- ReqRes (testing)
- Jumio
- Onfido
- Trulioo

## 📈 Monitoring & Logging

### Structured Logging
- Pino logger with structured JSON output
- Request/response logging
- Error tracking and stack traces
- Performance monitoring

### Health Checks
- Database connectivity checks
- API health endpoint
- System status monitoring

## 🚀 Deployment

### Environment Setup
```env
# Production environment variables
NODE_ENV=production
DATABASE_URL="postgresql://prod-user:password@prod-host:5432/payflow_prod"
JWT_SECRET="production-secret-key"
FRONTEND_URL="https://payflow.com"
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Deploy to production
npx prisma migrate deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- API Documentation: `GET /api/v1/health`
- Issues: [GitHub Issues](https://github.com/payflow/api/issues)
- Email: api-support@payflow.com

---

**PayFlow API** - Secure, scalable USD to INR remittance backend.