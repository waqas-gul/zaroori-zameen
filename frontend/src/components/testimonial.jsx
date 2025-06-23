import React, { useState, useEffect } from "react";
import { Star, ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "../assets/testimonialdata";

const TestimonialCard = ({ testimonial, index, activeIndex, direction }) => {
  return (
    <motion.div
      key={testimonial.id}
      initial={{ opacity: 0, x: direction === "right" ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction === "right" ? -50 : 50 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative"
    >
      {/* Quote icon */}
      <div className="absolute top-4 right-4 opacity-10">
        <Quote className="w-12 h-12 text-blue-500" />
      </div>

      {/* Testimonial content */}
      <p className="text-gray-700 italic mb-6 text-lg leading-relaxed relative z-10">
        "{testimonial.text}"
      </p>

      <div className="mt-8 flex items-center">
        {/* Profile image */}
        <div className="relative">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
            loading="lazy"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md"
          >
            <Quote className="w-3 h-3" />
          </motion.div>
        </div>

        <div className="ml-4">
          {/* Client info */}
          <h3 className="font-bold text-gray-900 text-lg">
            {testimonial.name}
          </h3>
          <p className="text-sm text-gray-600 flex items-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>
            {testimonial.location}
          </p>

          {/* Star rating */}
          <div className="flex mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < testimonial.rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Position indicator */}
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {testimonials.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === index
                ? "bg-blue-600 w-6 transition-all duration-300"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [autoplay, setAutoplay] = useState(true);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setDirection("right");
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const handlePrev = () => {
    setDirection("left");
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setAutoplay(false);
  };

  const handleNext = () => {
    setDirection("right");
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setAutoplay(false);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">
            Testimonials
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
            What Our Clients Say
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover why homeowners trust Zaroori Zameen to find their perfect
            property
          </p>
        </motion.div>

        {/* Desktop Testimonials */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: testimonial.id * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative"
              >
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-12 h-12 text-blue-500" />
                </div>

                <p className="text-gray-700 italic mb-6 text-lg leading-relaxed relative z-10">
                  "{testimonial.text}"
                </p>

                <div className="mt-8 flex items-center">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md">
                      <Quote className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>
                      {testimonial.location}
                    </p>

                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Testimonial Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden px-4">
            <AnimatePresence mode="wait" initial={false}>
              <TestimonialCard
                testimonial={testimonials[activeIndex]}
                index={activeIndex}
                activeIndex={activeIndex}
                direction={direction}
                key={activeIndex}
              />
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-10 space-x-4">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white shadow-md border border-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white shadow-md border border-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <a
            href="/contact"
            className="inline-flex items-center bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            Share Your Experience
            <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
