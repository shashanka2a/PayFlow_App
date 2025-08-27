"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

interface FXRate {
  currency: string;
  rate: number;
  change: number;
  lastUpdated: string;
}

export function FXRates() {
  const [rates, setRates] = useState<FXRate[]>([
    {
      currency: "INR",
      rate: 83.25,
      change: 0.15,
      lastUpdated: new Date().toLocaleTimeString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate live rate updates every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prev => prev.map(rate => ({
        ...rate,
        rate: rate.rate + (Math.random() - 0.5) * 0.5, // Small random fluctuation
        change: (Math.random() - 0.5) * 0.3,
        lastUpdated: new Date().toLocaleTimeString()
      })));
    }, 900000); // 15 minutes

    return () => clearInterval(interval);
  }, []);

  const refreshRates = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRates(prev => prev.map(rate => ({
      ...rate,
      rate: 83.25 + (Math.random() - 0.5) * 0.5,
      change: (Math.random() - 0.5) * 0.3,
      lastUpdated: new Date().toLocaleTimeString()
    })));
    
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg">Live Exchange Rates</CardTitle>
            <CardDescription>
              Real-time USD to INR rates
            </CardDescription>
          </div>
          <motion.button
            onClick={refreshRates}
            disabled={isLoading}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
        </CardHeader>
        <CardContent>
          {rates.map((rate) => (
            <div key={rate.currency} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">₹</span>
                </div>
                <div>
                  <p className="font-medium">1 USD = {rate.rate.toFixed(2)} INR</p>
                  <p className="text-sm text-muted-foreground">
                    Updated: {rate.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={rate.change >= 0 ? "default" : "destructive"} className="flex items-center space-x-1">
                  {rate.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(rate.change).toFixed(2)}</span>
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}