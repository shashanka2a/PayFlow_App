import { Button } from "./ui/button";
import { motion } from "framer-motion";

import type { Page } from "./AppRouter";

interface HeaderProps {
  navigate?: (page: Page) => void;
}

export function Header({ navigate }: HeaderProps = {}) {
  return (
    <motion.header 
      className="w-full border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div 
              className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-white font-bold">P</span>
            </motion.div>
            <span className="ml-2 text-xl font-medium text-primary">PayFlow</span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.a 
              href="#" 
              className="text-foreground hover:text-primary transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Solutions
            </motion.a>
            <motion.a 
              href="#" 
              className="text-foreground hover:text-primary transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Security
            </motion.a>
            <motion.a 
              href="#" 
              className="text-foreground hover:text-primary transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              About
            </motion.a>
            <motion.a 
              href="#" 
              className="text-foreground hover:text-primary transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Support
            </motion.a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="hidden sm:flex transition-transform hover:scale-105"
              onClick={() => navigate?.('login')}
            >
              Sign In
            </Button>
            <Button 
              className="transition-transform hover:scale-105"
              onClick={() => navigate?.('signup')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}