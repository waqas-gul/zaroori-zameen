import React, { useRef, useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Search, MapPin, ArrowRight, Home, Heart, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Import your slider images (replace with your actual images)
import sliderImage1 from "../assets/images/slider1.jpg";
import sliderImage2 from "../assets/images/slider2.jpg";
import sliderImage3 from "../assets/images/slider3.jpg";
import sliderImage4 from "../assets/images/slider4.jpg";

const popularLocations = [
  "Peshawar",
  "Islamabad",
  "Lahore",
  "Karachi",
  "Multan",
];

const sliderImages = [sliderImage1, sliderImage2, sliderImage3, sliderImage4];

const stats = [
  { value: "10K+", label: "Properties", icon: <Home className="w-5 h-5" /> },
  { value: "4.9", label: "Rating", icon: <Star className="w-5 h-5" /> },
  { value: "95%", label: "Satisfaction", icon: <Heart className="w-5 h-5" /> },
];

export const AnimatedContainer = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && ref.current) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const directions = {
    vertical: "Y",
    horizontal: "X",
  };

  const springProps = useSpring({
    from: {
      transform: `translate${directions[direction]}(${
        reverse ? `-${distance}px` : `${distance}px`
      })`,
    },
    to: inView ? { transform: `translate${directions[direction]}(0px)` } : {},
    config: { tension: 50, friction: 25 },
  });

  return (
    <animated.div ref={ref} style={springProps}>
      {children}
    </animated.div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const searchContainerRef = useRef(null);

  const handleSubmit = (location = searchQuery) => {
    navigate(`/properties?location=${encodeURIComponent(location)}`);
  };

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle manual slide navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <AnimatedContainer distance={50} direction="vertical">
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden mb-4">
        {/* Image Slider with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0"
            ref={sliderRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {sliderImages.map((image, index) => (
              <motion.div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000    ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url(${image})`,
                  zIndex: index === currentSlide ? 1 : 0,
                  boxShadow: "inset 0 400px 400px  rgba(0, 0, 0, 0.5)", // Inner shadow added here
                }}
                animate={{
                  opacity: index === currentSlide ? 1 : 0,
                }}
                transition={{ duration: 1 }}
              />
            ))}
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"></div>
        </div>

        {/* Content */}
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
            {/* Main heading with blur effect when suggestions are visible */}
            <motion.div
              className={`transition-all duration-300 ${
                showSuggestions ? "filter blur-sm" : ""
              }`}
            >
              <motion.h1
                className="text-4xl sm:text-5xl mt-2 md:text-6xl p-1 rounded-md lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
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
                Find Your <span className="text-blue-300">Dream Home</span>
                <br />
                With Confidence
              </motion.h1>

              {/* Subheading */}
              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-white/90 rounded-md p-1  font-light max-w-2xl mb-10 leading-relaxed"
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
                Discover properties that perfectly match your lifestyle and
                budget
              </motion.p>
            </motion.div>

            {/* Search Section */}
            <motion.div
              ref={searchContainerRef}
              className="relative w-full max-w-2xl"
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
              <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Enter location..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-0 bg-white/90 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubmit()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </motion.button>
              </div>

              {/* Location Suggestions with higher z-index */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl divide-y divide-gray-100 overflow-hidden z-50" // Added z-50 here
                  >
                    <div className="p-2">
                      <h3 className="text-xs font-medium text-gray-500 px-3 mb-2">
                        Popular Locations
                      </h3>
                      {popularLocations.map((location) => (
                        <motion.button
                          key={location}
                          whileHover={{ x: 5 }}
                          onClick={() => {
                            setSearchQuery(location);
                            handleSubmit(location);
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between text-gray-700 transition-colors"
                        >
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{location}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              className={`mt-16 bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 flex flex-wrap justify-center gap-6 sm:gap-12 w-full max-w-4xl transition-all duration-300 ${
                showSuggestions ? "filter blur-sm" : ""
              }`}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-blue-300">{stat.icon}</div>
                  <div className="text-left">
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm sm:text-base text-white/80">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-10">
          {sliderImages.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator - moved to right side */}
        <motion.div
          className="absolute bottom-8 right-8 z-10 hidden sm:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="flex gap-2 flex-col items-center">
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
              className="w-6 h-10 border-2  border-white rounded-full flex justify-center"
            >
              <div className="w-1 h-3 bg-white rounded-full mt-2" />
            </motion.div>
            <p className="  text-white text-sm  tracking-wider  transform origin-left whitespace-nowrap">
              EXPLORE MORE
            </p>
          </div>
        </motion.div>
      </section>
    </AnimatedContainer>
  );
};

export default Hero;
