"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Download, Printer, Share2, CheckCircle } from "lucide-react";
import type { Transaction, Beneficiary } from "./AppRouter";

interface TransactionReceiptProps {
  transaction: Transaction;
  beneficiary?: Beneficiary;
  onClose?: () => void;
}

export function TransactionReceipt({ transaction, beneficiary, onClose }: TransactionReceiptProps) {
  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading PDF receipt for transaction:", transaction.reference);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `PayFlow Receipt - ${transaction.reference}`,
        text: `Transaction receipt for ${transaction.reference}`,
        url: window.location.href
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const usdEquivalent = transaction.currency === 'INR' 
    ? transaction.amount / transaction.exchangeRate 
    : transaction.amount;

  const inrAmount = transaction.currency === 'INR' 
    ? transaction.amount 
    : transaction.amount * transaction.exchangeRate;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="print:shadow-none">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-xl font-medium text-primary">PayFlow</span>
          </div>
          <CardTitle className="text-2xl">Transaction Receipt</CardTitle>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <Badge variant="default" className="bg-green-500">
              {transaction.status === 'completed' ? 'Completed' : 'Processing'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Transaction Details</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Reference Number</p>
                <p className="font-mono font-medium">{transaction.reference}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date & Time</p>
                <p className="font-medium">{formatDate(transaction.date)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{transaction.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Exchange Rate</p>
                <p className="font-medium">1 USD = {transaction.exchangeRate.toFixed(2)} INR</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Amount Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Amount Details</h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">You sent</span>
                <span className="font-medium">${usdEquivalent.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transfer fee</span>
                <span className="font-medium">${transaction.fee.toFixed(2)} USD</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Total cost</span>
                <span className="font-medium text-lg">${(usdEquivalent + transaction.fee).toFixed(2)} USD</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-900">Recipient receives</span>
                <span className="font-bold text-lg text-green-700">
                  ₹{inrAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} INR
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Recipient Details */}
          {beneficiary && (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Recipient Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{beneficiary.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bank</p>
                    <p className="font-medium">{beneficiary.bankName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Account Number</p>
                    <p className="font-mono">****{beneficiary.accountNumber.slice(-4)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Country</p>
                    <p className="font-medium">India</p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>This is an official receipt from PayFlow</p>
            <p>For support, contact us at support@payflow.com</p>
            <p className="text-xs">
              PayFlow is regulated by FinCEN and compliant with RBI guidelines
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 print:hidden">
            <Button onClick={handleDownloadPDF} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex-1">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {onClose && (
            <Button onClick={onClose} className="w-full print:hidden">
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}