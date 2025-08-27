import { Shield, Zap, Globe, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      icon: Globe,
      title: "Add Beneficiary",
      description: "Add your family or friends in India with their bank details and IFSC code"
    },
    {
      icon: Shield,
      title: "Send Money Securely",
      description: "Enter amount in USD, get live INR rates, and confirm your transfer"
    },
    {
      icon: Zap,
      title: "Track & Receive",
      description: "Money reaches India within 1-2 business days with real-time tracking"
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl mb-6">
            How to send money to India
          </h2>
          <p className="text-xl text-muted-foreground">
            Three simple steps to send USD to INR with the best rates 
            and fastest delivery times.
          </p>
        </motion.div>

        {/* Steps Flow */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div 
                key={step.title} 
                className="text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  ease: "easeOut" 
                }}
              >
                <div className="relative mb-6">
                  <motion.div 
                    className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (index * 0.2) + 0.3 }}
                    >
                      <ArrowRight className="hidden md:block absolute top-8 left-full transform -translate-y-1/2 translate-x-8 w-6 h-6 text-muted-foreground" />
                    </motion.div>
                  )}
                </div>
                <h3 className="text-xl mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div 
              className="aspect-video rounded-2xl overflow-hidden bg-gray-100"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU2Mjg2NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Financial analytics and payment dashboard interface"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <h3 className="text-2xl md:text-3xl">
              Trusted by thousands of Indians in America
            </h3>
            <p className="text-lg text-muted-foreground">
              PayFlow is fully compliant with RBI regulations and partnered with 
              major Indian banks. Your money transfers are secure, tracked, and 
              delivered on time, every time.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">Regulated & Compliant</h4>
                <p className="text-sm text-muted-foreground">Licensed in major markets</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-2">Always Available</h4>
                <p className="text-sm text-muted-foreground">Support when you need it</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}