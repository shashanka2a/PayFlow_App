"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { Shield, CheckCircle, AlertCircle, Upload, User } from "lucide-react";

interface KYCVerificationProps {
  onVerificationComplete?: (verified: boolean) => void;
}

export function KYCVerification({ onVerificationComplete }: KYCVerificationProps) {
  const [step, setStep] = useState<'info' | 'documents' | 'verification'>('info');
  const [formData, setFormData] = useState({
    ssn: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStep('documents');
    setIsLoading(false);
  };

  const handleDocumentUpload = async () => {
    setIsLoading(true);
    
    // Simulate document verification API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStep('verification');
    setIsLoading(false);
  };

  const handleKYCVerification = async () => {
    setIsLoading(true);
    
    // Simulate KYC verification API call (using mock ReqRes-like API)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock verification result (90% approval rate)
    const isApproved = Math.random() > 0.1;
    setVerificationStatus(isApproved ? 'approved' : 'rejected');
    
    if (isApproved) {
      toast.success("KYC verification completed successfully!");
      onVerificationComplete?.(true);
    } else {
      toast.error("KYC verification failed. Please contact support.");
      onVerificationComplete?.(false);
    }
    
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>
                Complete your identity verification to enable money transfers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 'info' ? 'bg-primary text-primary-foreground' : 
              step === 'documents' || step === 'verification' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step === 'documents' || step === 'verification' ? <CheckCircle className="w-4 h-4" /> : '1'}
            </div>
            <div className={`h-0.5 w-16 ${step === 'documents' || step === 'verification' ? 'bg-green-500' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 'documents' ? 'bg-primary text-primary-foreground' : 
              step === 'verification' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step === 'verification' ? <CheckCircle className="w-4 h-4" /> : '2'}
            </div>
            <div className={`h-0.5 w-16 ${step === 'verification' ? 'bg-green-500' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 'verification' ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {step === 'info' && (
            <form onSubmit={handleSubmitInfo} className="space-y-4">
              <h3 className="font-medium text-lg">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ssn">SSN (Last 4 digits)</Label>
                  <Input
                    id="ssn"
                    placeholder="1234"
                    value={formData.ssn}
                    onChange={(e) => setFormData(prev => ({ ...prev, ssn: e.target.value }))}
                    maxLength={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State, ZIP"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Validating..." : "Continue"}
              </Button>
            </form>
          )}

          {/* Step 2: Document Upload */}
          {step === 'documents' && (
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Document Upload</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium">Government ID</p>
                  <p className="text-xs text-muted-foreground">Driver's License or Passport</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload File
                  </Button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium">Proof of Address</p>
                  <p className="text-xs text-muted-foreground">Utility Bill or Bank Statement</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload File
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Document Requirements</h4>
                    <ul className="text-sm text-blue-700 mt-1 space-y-1">
                      <li>• Documents must be clear and readable</li>
                      <li>• All four corners must be visible</li>
                      <li>• Documents must be current and valid</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button onClick={handleDocumentUpload} disabled={isLoading} className="w-full">
                {isLoading ? "Processing Documents..." : "Continue to Verification"}
              </Button>
            </div>
          )}

          {/* Step 3: Verification */}
          {step === 'verification' && (
            <div className="space-y-4 text-center">
              <h3 className="font-medium text-lg">Identity Verification</h3>
              
              {verificationStatus === null && (
                <>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    We're verifying your identity with our secure KYC system. 
                    This usually takes a few moments.
                  </p>
                  <Button onClick={handleKYCVerification} disabled={isLoading} className="w-full">
                    {isLoading ? "Verifying Identity..." : "Start Verification"}
                  </Button>
                </>
              )}

              {verificationStatus === 'approved' && (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-medium text-green-900">Verification Successful!</h4>
                  <p className="text-muted-foreground">
                    Your identity has been verified. You can now send money transfers.
                  </p>
                  <Badge variant="default" className="bg-green-500">
                    KYC Approved
                  </Badge>
                </>
              )}

              {verificationStatus === 'rejected' && (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h4 className="font-medium text-red-900">Verification Failed</h4>
                  <p className="text-muted-foreground">
                    We couldn't verify your identity. Please contact our support team for assistance.
                  </p>
                  <Badge variant="destructive">
                    KYC Rejected
                  </Badge>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}