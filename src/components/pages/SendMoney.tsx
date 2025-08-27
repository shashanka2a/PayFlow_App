import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "../layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { ArrowLeft, TrendingUp, Shield, Clock, Check } from "lucide-react";
import type { Page, User, Beneficiary, Transaction } from "../AppRouter";

interface SendMoneyProps {
  navigate: (page: Page) => void;
  user: User;
  beneficiaries: Beneficiary[];
  transactions: Transaction[];
  onLogout: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function SendMoney({ navigate, user, beneficiaries, onLogout, onAddTransaction }: SendMoneyProps) {
  const [step, setStep] = useState<'amount' | 'quote' | 'confirm'>('amount');
  const [formData, setFormData] = useState({
    beneficiaryId: "",
    amount: "",
    purpose: ""
  });
  const [quote, setQuote] = useState<{
    exchangeRate: number;
    fee: number;
    totalCost: number;
    recipientReceives: number;
    estimatedDelivery: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedBeneficiary = beneficiaries.find(b => b.id === formData.beneficiaryId);

  const purposes = [
    "Family Support",
    "Education Expenses", 
    "Medical Treatment",
    "Property Purchase",
    "Investment",
    "Business Payment",
    "Gift to Relative",
    "Maintenance of Family",
    "Other"
  ];

  const handleGetQuote = async () => {
    if (!formData.beneficiaryId || !formData.amount) {
      toast.error("Please select a beneficiary and enter an amount");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call for live USD-INR exchange rate
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const amount = parseFloat(formData.amount);
    // Mock live USD to INR exchange rate (in real app, this would come from FX API)
    const exchangeRate = selectedBeneficiary?.currency === 'INR' ? 83.25 : 
                        selectedBeneficiary?.currency === 'USD' ? 1 : 
                        selectedBeneficiary?.currency === 'EUR' ? 0.85 :
                        selectedBeneficiary?.currency === 'GBP' ? 0.73 : 83.25;
    
    const fee = Math.max(5, amount * 0.005); // 0.5% fee, minimum $5
    const totalCost = amount + fee;
    const recipientReceives = amount * exchangeRate;
    
    setQuote({
      exchangeRate,
      fee,
      totalCost,
      recipientReceives,
      estimatedDelivery: "Within 1-2 business days"
    });
    
    setStep('quote');
    setIsLoading(false);
  };

  const handleConfirmTransfer = async () => {
    if (!selectedBeneficiary || !quote) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newTransaction: Omit<Transaction, 'id'> = {
      beneficiaryName: selectedBeneficiary.name,
      amount: parseFloat(formData.amount),
      currency: selectedBeneficiary.currency,
      exchangeRate: quote.exchangeRate,
      fee: quote.fee,
      status: 'processing',
      date: new Date().toISOString().split('T')[0],
      reference: `TXN-${Date.now().toString().slice(-6)}`
    };
    
    onAddTransaction(newTransaction);
    toast.success("Transfer initiated successfully!");
    
    setIsLoading(false);
    setStep('confirm');
  };

  const resetForm = () => {
    setFormData({ beneficiaryId: "", amount: "", purpose: "" });
    setQuote(null);
    setStep('amount');
  };

  return (
    <AppLayout user={user} currentPage="send-money" navigate={navigate} onLogout={onLogout}>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => step === 'amount' ? navigate('dashboard') : setStep('amount')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl">Send Money</h1>
            <p className="text-muted-foreground mt-2">
              {step === 'amount' && "Enter transfer details"}
              {step === 'quote' && "Review your transfer"}
              {step === 'confirm' && "Transfer confirmed"}
            </p>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center space-x-4"
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 'amount' ? 'bg-primary text-primary-foreground' : 'bg-green-500 text-white'
          }`}>
            {step === 'amount' ? '1' : <Check className="w-4 h-4" />}
          </div>
          <div className={`h-0.5 w-16 ${step !== 'amount' ? 'bg-green-500' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 'quote' ? 'bg-primary text-primary-foreground' : 
            step === 'confirm' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step === 'confirm' ? <Check className="w-4 h-4" /> : '2'}
          </div>
          <div className={`h-0.5 w-16 ${step === 'confirm' ? 'bg-green-500' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 'confirm' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step === 'confirm' ? <Check className="w-4 h-4" /> : '3'}
          </div>
        </motion.div>

        {/* Step 1: Amount */}
        {step === 'amount' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Transfer Details</CardTitle>
                <CardDescription>
                  Select recipient and enter amount to transfer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {beneficiaries.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No beneficiaries found</p>
                    <Button onClick={() => navigate('add-beneficiary')}>
                      Add Beneficiary First
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="beneficiary">Send to</Label>
                      <Select value={formData.beneficiaryId} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, beneficiaryId: value }))
                      }>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select beneficiary" />
                        </SelectTrigger>
                        <SelectContent>
                          {beneficiaries.map((beneficiary) => (
                            <SelectItem key={beneficiary.id} value={beneficiary.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{beneficiary.name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {beneficiary.currency}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        className="h-11 text-lg"
                        min="1"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose of transfer</Label>
                      <Select value={formData.purpose} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, purpose: value }))
                      }>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          {purposes.map((purpose) => (
                            <SelectItem key={purpose} value={purpose}>
                              {purpose}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={handleGetQuote}
                      disabled={!formData.beneficiaryId || !formData.amount || isLoading}
                      className="w-full h-11"
                    >
                      {isLoading ? "Getting Quote..." : "Get Quote"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Quote */}
        {step === 'quote' && quote && selectedBeneficiary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Review Transfer</CardTitle>
                <CardDescription>
                  Confirm the details before sending
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Transfer Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You send</span>
                    <span className="font-medium">${formData.amount} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transfer fee</span>
                    <span className="font-medium">${quote.fee.toFixed(2)} USD</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Total cost</span>
                    <span className="font-medium text-lg">${quote.totalCost.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Exchange Rate */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span>Exchange rate</span>
                  </div>
                  <span className="font-medium">1 USD = {quote.exchangeRate} {selectedBeneficiary.currency}</span>
                </div>

                {/* Recipient Details */}
                <div className="space-y-3">
                  <h3 className="font-medium">Recipient receives</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{selectedBeneficiary.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedBeneficiary.bankName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lg text-green-700">
                          {quote.recipientReceives.toFixed(2)} {selectedBeneficiary.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{quote.estimatedDelivery}</span>
                </div>

                {/* Security Notice */}
                <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Secure Transfer</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your transfer is protected by bank-level encryption and monitored for fraud.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep('amount')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirmTransfer}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Processing..." : "Confirm Transfer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {step === 'confirm' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-semibold mb-2">Transfer Initiated!</h2>
                <p className="text-muted-foreground mb-6">
                  Your transfer is being processed. You'll receive updates via email.
                </p>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('transactions')}
                    className="flex-1"
                  >
                    View Transactions
                  </Button>
                  <Button
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Send Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}