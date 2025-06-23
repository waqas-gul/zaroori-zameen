import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Heart } from "lucide-react";
import {
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
  LogOut,
  Home,
  Search,
  Users,
  MessageCircle,
  Sparkles,
  BotMessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";
import { Backendurl } from "../App";
import { getFavoriteProperties } from "../services/favoritesService";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const dropdownRef = useRef(null);
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    return avatarPath.startsWith("http")
      ? avatarPath
      : `${Backendurl}${avatarPath}`;
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Fetch favorites count when component mounts and when logged in status changes
  useEffect(() => {
    const fetchFavoritesCount = async () => {
      if (!isLoggedIn) {
        setFavoritesCount(0);
        return;
      }

      try {
        const response = await getFavoriteProperties();
        const favoritesData = response?.data?.data || [];
        setFavoritesCount(favoritesData.length);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setFavoritesCount(0); // fallback
      }
    };

    fetchFavoritesCount();
  }, [isLoggedIn, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const userId = localStorage.getItem("userId");

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-blue-100 shadow-md backdrop-blur-lg"
          : "bg-blue-50 backdrop-blur-md border-b border-blue-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="p-2 rounded-lg"
            >
              <img
                src="/zaroori-zameen-logo.png"
                alt="zaroori zameen logo"
                className="w-28 h-14"
              />
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {/* Fixed: Added isLoggedIn prop */}
            <NavLinks
              currentPath={location.pathname}
              favoritesCount={favoritesCount}
              isLoggedIn={isLoggedIn}
            />

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={toggleDropdown}
                    className="flex items-center space-x-3 focus:outline-none"
                    aria-label="User menu"
                    aria-expanded={isDropdownOpen}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium text-sm shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                        {user?.avatar ? (
                          <img
                            src={getAvatarUrl(user.avatar)}
                            alt={`${user?.name}'s avatar`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getInitials(user?.name || "")}
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 border border-gray-100 overflow-hidden"
                      >
                        <div className="px-4 py-4 border-b bg-gray-50 transition-colors flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="relative w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden">
                              {user?.avatar ? (
                                <img
                                  src={getAvatarUrl(user.avatar)}
                                  alt={`${user?.name}'s avatar`}
                                  className="absolute inset-0 w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <span className="relative z-10">
                                  {user?.name?.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        {user?.role === "seller" && (
                          <motion.button
                            whileHover={{ x: 5 }}
                            onClick={() => navigate(`/dashboard/${userId}`)}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center space-x-2 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                          </motion.button>
                        )}

                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={() => {
                            navigate(`/profile/${userId}`);
                            setIsDropdownOpen(false); // Add this line
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={() => {
                            navigate("/favorites-properties");
                            setIsDropdownOpen(false); // Add this line
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center space-x-2 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Favorites</span>
                          {favoritesCount > 0 && (
                            <span className="ml-auto px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              {favoritesCount}
                            </span>
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center space-x-2 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign out</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/signup"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                    >
                      Get started
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMobileMenu}
            className="md:hidden rounded-lg p-2 hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-2 pt-3 pb-4">
              <MobileNavLinks
                setMobileMenuOpen={setIsMobileMenuOpen}
                isLoggedIn={isLoggedIn}
                user={user}
                handleLogout={handleLogout}
                currentPath={location.pathname}
                getAvatarUrl={getAvatarUrl}
                getInitials={getInitials}
                favoritesCount={favoritesCount}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const NavLinks = ({ currentPath, favoritesCount, isLoggedIn }) => {
  // Base links that everyone sees
  const baseLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Properties", path: "/properties", icon: Search },
    { name: "About Us", path: "/about", icon: Users },
    { name: "Contact", path: "/contact", icon: MessageCircle },
  ];

  // Links only for logged in users
  const protectedLinks = [
    { name: "Favorites", path: "/favorites-properties", icon: Heart },
  ];

  // Combine links based on auth status
  const navLinks = isLoggedIn ? [...baseLinks, ...protectedLinks] : baseLinks;

  const isAIHubActive = currentPath.startsWith("/ai-property-hub");

  return (
    <div className="flex space-x-6 items-center">
      {navLinks.map(({ name, path, icon: Icon }) => {
        const isActive =
          path === "/" ? currentPath === path : currentPath.startsWith(path);

        return (
          <Link
            key={path}
            to={path}
            className={`relative font-medium transition-colors duration-200 flex items-center gap-1.5 px-2 py-1 rounded-md
              ${
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="flex-1">{name}</span>
            {path === "/favorites-properties" && favoritesCount > 0 && (
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {favoritesCount}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                initial={false}
              />
            )}
          </Link>
        );
      })}

      <Link
        to="/ai-property-hub"
        className={`relative font-medium transition-all duration-300 flex items-center gap-2 px-3 py-1.5 rounded-md ${
          isAIHubActive
            ? "text-white bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 shadow-md shadow-purple-500/30"
            : "text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-600 hover:via-purple-500 hover:to-pink-500 hover:text-white"
        }`}
      >
        <div className="relative">
          <BotMessageSquare
            className={`w-5 h-5 transition-colors duration-300 ${
              isAIHubActive ? "text-white " : "text-indigo-600 "
            }`}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-3 h-3 text-yellow-400" />
          </motion.div>
        </div>
        <span className="font-semibold">AI Property Hub</span>
        {isAIHubActive ? (
          <motion.div
            layoutId="aiActiveIndicator"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
            initial={false}
          />
        ) : (
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-full text-[10px] font-bold"
          >
            NEW
          </motion.span>
        )}
      </Link>
    </div>
  );
};

const MobileNavLinks = ({
  setMobileMenuOpen,
  isLoggedIn,
  user,
  handleLogout,
  currentPath,
  getAvatarUrl,
  getInitials,
  favoritesCount,
}) => {
  // Base links that everyone sees
  const baseLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Properties", path: "/properties", icon: Search },
    { name: "About Us", path: "/about", icon: Users },
    { name: "Contact", path: "/contact", icon: MessageCircle },
  ];

  // Links only for logged in users
  const protectedLinks = [
    { name: "Favorites", path: "/favorites-properties", icon: Heart },
  ];

  // Combine links based on auth status
  const navLinks = isLoggedIn ? [...baseLinks, ...protectedLinks] : baseLinks;

  const isAIHubActive = currentPath.startsWith("/ai-property-hub");

  return (
    <div className="flex flex-col space-y-1 pb-3">
      <div className="px-3 py-2">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/ai-property-hub"
            onClick={() => setMobileMenuOpen(false)}
            className={`relative flex items-center gap-3 px-4 py-3.5 rounded-lg shadow-sm transition-all ${
              isAIHubActive
                ? "bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20"
                : "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100"
            }`}
          >
            <div className="relative">
              <BotMessageSquare className="w-5 h-5" />
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </motion.div>
            </div>
            <div className="flex-1">
              <div className="font-medium text-base">AI Property Hub</div>
              <div
                className={`text-xs ${
                  isAIHubActive ? "text-indigo-100" : "text-indigo-500"
                }`}
              >
                Smart property recommendations
              </div>
            </div>
            {!isAIHubActive && (
              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-[10px] font-bold">
                NEW
              </span>
            )}
          </Link>
        </motion.div>
      </div>

      <div className="w-full px-3 py-1">
        <div className="border-t border-gray-100"></div>
      </div>

      {navLinks.map(({ name, path, icon: Icon }) => {
        const isActive =
          path === "/" ? currentPath === path : currentPath.startsWith(path);

        return (
          <motion.div key={path} whileTap={{ scale: 0.97 }}>
            <Link
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }
              `}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{name}</span>
              {path === "/favorites-properties" && favoritesCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {favoritesCount}
                </span>
              )}
            </Link>
          </motion.div>
        );
      })}

      <div className="pt-4 mt-2 border-t border-gray-100">
        {isLoggedIn ? (
          <div className="space-y-3 px-3">
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium text-sm shadow-sm overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={getAvatarUrl(user.avatar)}
                    alt={`${user?.name}'s avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span>{getInitials(user?.name || "")}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign out</span>
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col space-y-3 px-3">
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
              >
                Sign in
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md shadow-blue-500/20"
              >
                Create account
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

NavLinks.propTypes = {
  currentPath: PropTypes.string.isRequired,
  favoritesCount: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

MobileNavLinks.propTypes = {
  setMobileMenuOpen: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.object,
  handleLogout: PropTypes.func.isRequired,
  currentPath: PropTypes.string.isRequired,
  getAvatarUrl: PropTypes.func.isRequired,
  getInitials: PropTypes.func.isRequired,
  favoritesCount: PropTypes.number.isRequired,
};

export default Navbar;
