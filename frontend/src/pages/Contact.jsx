import React from "react";
import { motion } from "framer-motion";
import ContactHero from "../components/contact/ContactHero";
import ContactForm from "../components/contact/contactForm";
import ContactInfo from "../components/contact/ContactInfo";

const Contact = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-16"
      >
        <ContactHero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
