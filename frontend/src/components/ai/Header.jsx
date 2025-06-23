import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowLeft, Menu, X } from 'lucide-react';

const Header = ({ title = "AI Property Assistant" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-4 sm:px-6 shadow-lg relative z-50"
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <Link to="/ai-property-hub" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Brain className="w-6 h-6 sm:w-7 sm:h-7" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden sm:block"
          >
            <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              {title}
            </h1>
          </motion.div>
        </Link>

        {/* Mobile Title (centered) */}
        <div className="sm:hidden absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-lg font-bold text-white">
            {title.split(' ').slice(0, 2).join(' ')}
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back Home</span>
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="sm:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden bg-indigo-700 shadow-lg overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleBack}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors w-full"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </motion.button>
              
              <Link 
                to="/properties" 
                onClick={() => setIsMenuOpen(false)}
                className="text-center px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                Browse Properties
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
};

export default Header;