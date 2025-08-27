import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "../layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { ArrowLeft, Check } from "lucide-react";
import type { Page, User, Beneficiary } from "../AppRouter";

interface AddBeneficiaryProps {
  navigate: (page: Page) => void;
  user: User;
  beneficiaries: Beneficiary[];
  transactions: any[];
  onLogout: () => void;
  onAddBeneficiary: (beneficiary: Omit<Beneficiary, 'id'>) => void;
}

export function AddBeneficiary({ navigate, user, onLogout, onAddBeneficiary }: AddBeneficiaryProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    country: "IN",
    currency: "INR",
    mobileNumber: "",
    address: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const countries = [
    { code: "IN", name: "India", currency: "INR" },
    { code: "US", name: "United States", currency: "USD" },
    { code: "GB", name: "United Kingdom", currency: "GBP" },
    { code: "EU", name: "European Union", currency: "EUR" },
    { code: "CA", name: "Canada", currency: "CAD" },
    { code: "AU", name: "Australia", currency: "AUD" }
  ];

  const indianBanks = [
    "State Bank of India (SBI)",
    "HDFC Bank",
    "ICICI Bank", 
    "Axis Bank",
    "Punjab National Bank (PNB)",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "Bank of India",
    "Indian Bank",
    "Central Bank of India",
    "Indian Overseas Bank",
    "UCO Bank",
    "Bank of Maharashtra",
    "Punjab & Sind Bank",
    "Other Bank"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Map form data to Beneficiary interface
    const beneficiaryData = {
      name: formData.name,
      email: formData.email,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      routingNumber: formData.ifscCode, // IFSC code maps to routingNumber
      country: formData.country,
      currency: formData.currency
    };

    onAddBeneficiary(beneficiaryData);
    toast.success("Beneficiary added successfully!");
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      country: "IN",
      currency: "INR",
      mobileNumber: "",
      address: ""
    });
    
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleCountryChange = (country: string) => {
    const selectedCountry = countries.find(c => c.code === country);
    setFormData(prev => ({ 
      ...prev, 
      country,
      currency: selectedCountry?.currency || ""
    }));
  };

  return (
    <AppLayout user={user} currentPage="add-beneficiary" navigate={navigate} onLogout={onLogout}>
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
            onClick={() => navigate('dashboard')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl">Add New Beneficiary</h1>
            <p className="text-muted-foreground mt-2">
              Add a new recipient to send money to
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Beneficiary Information</CardTitle>
              <CardDescription>
                Please provide the recipient's details and banking information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        required
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Location</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Select value={formData.country} onValueChange={handleCountryChange}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        id="currency"
                        value={formData.currency}
                        readOnly
                        className="h-11 bg-muted"
                        placeholder="Select country first"
                      />
                    </div>
                  </div>
                </div>

                {/* Banking Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Banking Information</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Select value={formData.bankName} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, bankName: value }))
                      }>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianBanks.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number *</Label>
                        <Input
                          id="accountNumber"
                          placeholder="1234567890123456"
                          value={formData.accountNumber}
                          onChange={handleInputChange('accountNumber')}
                          required
                          className="h-11"
                          maxLength={20}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ifscCode">IFSC Code *</Label>
                        <Input
                          id="ifscCode"
                          placeholder="SBIN0001234"
                          value={formData.ifscCode}
                          onChange={handleInputChange('ifscCode')}
                          required
                          className="h-11"
                          maxLength={11}
                          style={{ textTransform: 'uppercase' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Mobile Number</Label>
                        <Input
                          id="mobileNumber"
                          placeholder="+91 9876543210"
                          value={formData.mobileNumber}
                          onChange={handleInputChange('mobileNumber')}
                          className="h-11"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="City, State"
                          value={formData.address}
                          onChange={handleInputChange('address')}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">Secure & Encrypted</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        All banking information is encrypted and stored securely. 
                        We comply with international banking security standards.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('dashboard')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.name || !formData.country || !formData.bankName || !formData.accountNumber || !formData.ifscCode}
                    className="flex-1"
                  >
                    {isLoading ? "Adding Beneficiary..." : "Add Beneficiary"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}