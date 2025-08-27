import { motion } from "framer-motion";

export function Footer() {
  const footerSections = [
    {
      title: "Products",
      links: ["Business Payments", "Mass Payouts", "Currency Exchange", "API Access"]
    },
    {
      title: "Company", 
      links: ["About", "Security", "Compliance", "Careers"]
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "Developer Docs", "System Status"]
    }
  ];

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="grid md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Company */}
          <motion.div 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div 
              className="flex items-center mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="ml-2 text-xl font-medium text-primary">PayFlow</span>
            </motion.div>
            <p className="text-sm text-muted-foreground mb-4">
              Seamless cross-border payments for modern business.
            </p>
            <div className="flex space-x-4 text-xs text-muted-foreground">
              <motion.span
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                SOC 2 Compliant
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                PCI DSS Level 1
              </motion.span>
            </div>
          </motion.div>

          {/* Dynamic Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + (sectionIndex + 1) * 0.1 }}
            >
              <h4 className="font-medium mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + (sectionIndex + 1) * 0.1 + linkIndex * 0.05 }}
                  >
                    <motion.a 
                      href="#" 
                      className="hover:text-foreground transition-colors"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom */}
        <motion.div 
          className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-xs text-muted-foreground">
            © 2025 PayFlow. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-muted-foreground mt-4 md:mt-0">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((policy, index) => (
              <motion.a 
                key={policy}
                href="#" 
                className="hover:text-foreground transition-colors"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {policy}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}