"use client";

import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { Dashboard } from "./pages/Dashboard";
import { AddBeneficiary } from "./pages/AddBeneficiary";
import { SendMoney } from "./pages/SendMoney";
import { TransactionsHistory } from "./pages/TransactionsHistory";
import { AdminPanel } from "./pages/AdminPanel";

export type Page = 'landing' | 'login' | 'signup' | 'dashboard' | 'add-beneficiary' | 'send-money' | 'transactions' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Beneficiary {
  id: string;
  name: string;
  email: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string; // This will be IFSC code for Indian banks
  country: string;
  currency: string;
}

export interface Transaction {
  id: string;
  beneficiaryName: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  fee: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  date: string;
  reference: string;
}

export function AppRouter() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      bankName: 'State Bank of India (SBI)',
      accountNumber: '12345678901234567890',
      routingNumber: 'SBIN0001234',
      country: 'IN',
      currency: 'INR'
    },
    {
      id: '2', 
      name: 'Priya Sharma',
      email: 'priya@example.com',
      bankName: 'HDFC Bank',
      accountNumber: '98765432109876543210',
      routingNumber: 'HDFC0001234',
      country: 'IN',
      currency: 'INR'
    }
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      beneficiaryName: 'Rajesh Kumar',
      amount: 1000,
      currency: 'INR',
      exchangeRate: 83.25,
      fee: 5,
      status: 'completed',
      date: '2024-01-15',
      reference: 'TXN-001'
    },
    {
      id: '2',
      beneficiaryName: 'Priya Sharma',
      amount: 500,
      currency: 'INR',
      exchangeRate: 83.18,
      fee: 5,
      status: 'processing',
      date: '2024-01-14',
      reference: 'TXN-002'
    },
    {
      id: '3',
      beneficiaryName: 'Rajesh Kumar',
      amount: 2000,
      currency: 'INR',
      exchangeRate: 83.30,
      fee: 10,
      status: 'completed',
      date: '2024-01-10',
      reference: 'TXN-003'
    }
  ]);

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLogin = (email: string, password: string) => {
    // Mock login
    const mockUser: User = {
      id: '1',
      name: email === 'admin@payflow.com' ? 'Admin User' : 'John Doe',
      email,
      role: email === 'admin@payflow.com' ? 'admin' : 'user'
    };
    setUser(mockUser);
    navigate('dashboard');
  };

  const handleSignup = (name: string, email: string, password: string) => {
    // Mock signup
    const newUser: User = {
      id: '1',
      name,
      email,
      role: 'user'
    };
    setUser(newUser);
    navigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('landing');
  };

  const addBeneficiary = (beneficiary: Omit<Beneficiary, 'id'>) => {
    const newBeneficiary: Beneficiary = {
      ...beneficiary,
      id: Date.now().toString()
    };
    setBeneficiaries([...beneficiaries, newBeneficiary]);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const commonProps = {
    navigate,
    user,
    beneficiaries,
    transactions,
    onLogout: handleLogout
  };

  // Redirect to landing if not authenticated for protected routes
  const protectedRoutes: Page[] = ['dashboard', 'add-beneficiary', 'send-money', 'transactions', 'admin'];
  if (protectedRoutes.includes(currentPage) && !user) {
    return <LandingPage navigate={navigate} />;
  }

  switch (currentPage) {
    case 'landing':
      return <LandingPage navigate={navigate} />;
    case 'login':
      return <LoginPage navigate={navigate} onLogin={handleLogin} />;
    case 'signup':
      return <SignupPage navigate={navigate} onSignup={handleSignup} />;
    case 'dashboard':
      return user ? <Dashboard {...commonProps} user={user} /> : <LandingPage navigate={navigate} />;
    case 'add-beneficiary':
      return user ? <AddBeneficiary {...commonProps} user={user} onAddBeneficiary={addBeneficiary} /> : <LandingPage navigate={navigate} />;
    case 'send-money':
      return user ? <SendMoney {...commonProps} user={user} onAddTransaction={addTransaction} /> : <LandingPage navigate={navigate} />;
    case 'transactions':
      return user ? <TransactionsHistory {...commonProps} user={user} /> : <LandingPage navigate={navigate} />;
    case 'admin':
      return user ? <AdminPanel {...commonProps} user={user} /> : <LandingPage navigate={navigate} />;
    default:
      return <LandingPage navigate={navigate} />;
  }
}