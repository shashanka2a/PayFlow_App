"use client";

import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";

import type { Page } from "./AppRouter";

interface HeroProps {
  navigate?: (page: Page) => void;
}

export function Hero({ navigate }: HeroProps = {}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-32">
          {/* Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight">
                Send money from <span className="text-primary">USA to India</span> instantly
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Fast, secure USD to INR transfers with live exchange rates, 
                transparent fees, and real-time tracking. Send money to family 
                and friends in India with confidence.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <Button 
                size="lg" 
                className="px-8 transition-transform hover:scale-105"
                onClick={() => navigate?.('signup')}
              >
                Start Sending Money
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 transition-transform hover:scale-105"
                onClick={() => navigate?.('login')}
              >
                Sign In
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-6 text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Bank-grade security</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Real-time tracking</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div 
              className="aspect-square rounded-2xl overflow-hidden bg-gray-100"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1725886297109-360eb6f9d768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwcGF5bWVudCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU2Mjg2MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Digital payment technology interface"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}