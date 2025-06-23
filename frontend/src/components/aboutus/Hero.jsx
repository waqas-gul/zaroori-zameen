import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/about-bg.avif')",
          }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
        />

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
      </div>

      {/* Content container */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="flex flex-col items-center text-center px-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.4,
              },
            },
          }}
        >
          {/* Main heading */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
            variants={{
              hidden: { y: 40, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.8,
                  ease: [0.33, 1, 0.68, 1],
                },
              },
            }}
          >
            Find Your <span className="text-blue-300"> Perfect</span>
            <br />
            Living Space
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white/90 font-light max-w-2xl mb-10 leading-relaxed"
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.8,
                  ease: [0.33, 1, 0.68, 1],
                },
              },
            }}
          >
            We connect you with the perfect properties that match your lifestyle
            and budget
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.8,
                  ease: [0.33, 1, 0.68, 1],
                },
              },
            }}
          >
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/properties")}
              className="px-8 py-4 bg-blue-600 border border-blue-600 hover:text-blue-600 hover:bg-transparent text-white font-medium rounded-lg shadow-lg transition-all duration-300 flex-1"
            >
              Browse Properties
            </motion.button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            className="mt-16 bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 flex flex-wrap justify-center gap-6 sm:gap-12 w-full max-w-4xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {[
              { value: "10K+", label: "Properties" },
              { value: "95%", label: "Satisfaction" },
              { value: "24/7", label: "Support" },
              { value: "15+", label: "Cities" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-white/80">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-9 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="flex flex-col items-center">
          <p className="text-white/80 text-sm mb-3 tracking-wider">
            EXPLORE MORE
          </p>
          <motion.div
            animate={{
              y: [0, 10, 0],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
