# PayFlow - USD to INR Remittance Portal

A comprehensive cross-border remittance portal specifically designed for USD to INR transfers, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Remittance Features
- **User Onboarding & Authentication**: Complete signup/login flow with JWT-based authentication
- **Beneficiary Management**: Add, edit, and manage recipients in India with bank details and IFSC codes
- **Money Transfer Workflow**: Step-by-step transfer process with live FX rates and fee calculation
- **Live FX Rates Integration**: Real-time USD to INR exchange rates (cached for 15 minutes)
- **Transaction History Dashboard**: Comprehensive transaction tracking with filters and search
- **Role-based Admin Panel**: Admin view for monitoring all users and transactions

### Advanced Features
- **KYC Verification**: Mock KYC verification system with document upload
- **High-Risk Transaction Flagging**: Automatic flagging of transactions above $10,000 equivalent
- **Transaction Receipts**: Downloadable PDF receipts with complete transaction details
- **Indian Bank Integration**: Pre-configured list of major Indian banks with IFSC code validation
- **Real-time Notifications**: Toast notifications for all user actions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Technical Features
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Performance Optimized**: Next.js 14 with static export capability
- **Accessible**: WCAG compliant components using Radix UI
- **SEO Optimized**: Meta tags optimized for USD-INR transfer keywords
- **Smooth Animations**: Framer Motion for enhanced user experience

## 🛠 Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React useState/useEffect
- **Notifications**: Sonner

## 📋 Core Functionality

### 1. User Authentication
- Signup with name, email, password, and auto-generated account UUID
- Login with email/password
- JWT-based session management
- Admin role support (admin@payflow.com)

### 2. Beneficiary Management
- Add beneficiaries with Indian bank details
- Support for major Indian banks (SBI, HDFC, ICICI, Axis, etc.)
- IFSC code validation
- Mobile number and address fields
- Edit and delete beneficiaries

### 3. Money Transfer Process
- **Step 1**: Select beneficiary and enter USD amount
- **Step 2**: Review live exchange rates and fees
- **Step 3**: Confirm transfer with security verification
- Real-time USD to INR conversion
- Transparent fee structure (0.5% minimum $5)
- Estimated delivery time (1-2 business days)

### 4. Live FX Rates
- Real-time USD to INR exchange rates
- 15-minute caching mechanism
- Rate change indicators (trending up/down)
- Manual refresh capability
- Historical rate tracking

### 5. Transaction Management
- Complete transaction history with filters
- Search by beneficiary name or reference
- Status tracking (pending, processing, completed, failed)
- Export functionality
- Transaction receipts

### 6. Admin Panel
- System overview with key metrics
- User management with status tracking
- Transaction monitoring with risk assessment
- High-risk transaction flagging (>$10,000 USD equivalent)
- Activity logs and system analytics

### 7. KYC Verification
- Three-step verification process
- Personal information collection
- Document upload (Government ID, Proof of Address)
- Mock verification API integration
- Compliance with regulatory requirements

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd cross-border-payments-nextjs
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

### Test Accounts

**Regular User**:
- Email: Any email except admin@payflow.com
- Password: Any password

**Admin User**:
- Email: admin@payflow.com
- Password: Any password

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Base UI components (Radix UI)
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # User dashboard
│   │   ├── SendMoney.tsx   # Money transfer flow
│   │   ├── AddBeneficiary.tsx # Beneficiary management
│   │   ├── TransactionsHistory.tsx # Transaction history
│   │   ├── AdminPanel.tsx  # Admin dashboard
│   │   ├── LoginPage.tsx   # Authentication
│   │   └── SignupPage.tsx  # User registration
│   ├── layout/
│   │   └── AppLayout.tsx   # Main app layout
│   ├── FXRates.tsx         # Live exchange rates
│   ├── KYCVerification.tsx # KYC verification flow
│   ├── TransactionReceipt.tsx # Receipt generation
│   ├── Hero.tsx            # Landing page hero
│   ├── Features.tsx        # Feature showcase
│   ├── HowItWorks.tsx      # Process explanation
│   └── AppRouter.tsx       # Main routing logic
├── styles/
│   └── globals.css         # Global styles and Tailwind
└── pages/
    ├── _app.tsx           # Next.js app wrapper
    ├── _document.tsx      # HTML document structure
    └── index.tsx          # Home page
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## 🌐 API Integration Points

### FX Rates API
The application is designed to integrate with live FX rate APIs such as:
- ExchangeRate API
- Open Exchange Rates
- Fixer.io
- CurrencyLayer

### KYC Verification API
Mock KYC integration ready for services like:
- ReqRes (for testing)
- Jumio
- Onfido
- Trulioo

### Banking APIs
Ready for integration with:
- Indian banking APIs
- NPCI (National Payments Corporation of India)
- RBI-approved payment gateways

## 🔒 Security Features

- Input validation and sanitization
- IFSC code format validation
- Transaction amount limits
- High-risk transaction flagging
- Secure form handling
- XSS protection
- CSRF protection ready

## 📱 Mobile Responsiveness

- Fully responsive design
- Touch-friendly interface
- Mobile-optimized forms
- Swipe gestures support
- Progressive Web App ready

## 🚀 Deployment

### Static Export
```bash
npm run build
```

The application builds to static files and can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

### Environment Variables
Create a `.env.local` file for production:
```env
NEXT_PUBLIC_API_URL=your-api-url
NEXT_PUBLIC_FX_API_KEY=your-fx-api-key
```

## 🧪 Testing

The application includes:
- TypeScript type checking
- ESLint configuration
- Component prop validation
- Form validation
- Error boundary handling

## 📈 Performance

- Next.js 14 optimizations
- Static generation
- Image optimization
- Code splitting
- Lazy loading
- Bundle size optimization (~183KB first load)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@payflow.com
- Documentation: [PayFlow Docs](https://docs.payflow.com)
- Issues: [GitHub Issues](https://github.com/payflow/issues)

---

**PayFlow** - Making USD to INR transfers simple, secure, and transparent.