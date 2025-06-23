import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./components/properties/propertydetail";
import Aboutus from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./components/login";
import Signup from "./components/signup";
import ProfileDetails from "./components/ProfileDetails";
import ForgotPassword from "./components/forgetpassword";
import ResetPassword from "./components/resetpassword";
import Footer from "./components/footer";
import NotFoundPage from "./components/Notfound";
import { AuthProvider } from "./context/AuthContext";
import AIPropertyHub from "./pages/Aiagent";
import StructuredData from "./components/SEO/StructuredData";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import EditProfile from "./components/EditProfile";
import UpdateProferty from "./components/UpdateProperty";
import Questionnaire from "./components/Questionnaire";
import FavoritesPage from "./components/FavoritesPage";
import SupportPage from "./pages/SupportPage";
import FaqPage from "./pages/FaqPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";


export const Backendurl = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLoginEvent = (event) => {
      const user = event.detail;

      if (user?.role === "buyer" && user?.hasCompletedQuestionnaire === false) {
        setShowQuestionnaire(true);
      } else {
        setShowQuestionnaire(false);
      }
    };

    window.addEventListener("userLoggedIn", handleLoginEvent);

    return () => {
      window.removeEventListener("userLoggedIn", handleLoginEvent);
    };
  }, []);

  useEffect(() => {
    const handleLoginEvent = (event) => {
      const user = event.detail;
      if (user?.role === "buyer" && !user.hasCompletedQuestionnaire) {
        setShowQuestionnaire(true);
      } else {
        setShowQuestionnaire(false);
      }
    };

    const checkExistingLogin = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (userId && token) {
        setLoading(true);
        try {
          const res = await axios.get(
            `${Backendurl}/api/users/profile/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const user = res.data.user;
          if (user?.role === "buyer" && !user.hasCompletedQuestionnaire) {
            setShowQuestionnaire(true);
          } else {
            setShowQuestionnaire(false);
          }
        } catch (err) {
          console.error("Error checking user:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    window.addEventListener("userLoggedIn", handleLoginEvent);
    checkExistingLogin();

    return () => {
      window.removeEventListener("userLoggedIn", handleLoginEvent);
    };
  }, []);

  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);
    // Update user status in your backend and state management
  };

  const handleQuestionnaireSkip = () => {
    setShowQuestionnaire(false);
    // Optional: Trigger any skip-specific actions
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      {/* Keep your existing AuthProvider if you still need it for other contexts */}
      <AuthProvider>
        <Router>
          <StructuredData type="website" />
          <StructuredData type="organization" />

          <Navbar />
          <Routes>
            {/* Your existing routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<ProfileDetails />} />
            <Route path="/profile/:id/edit" element={<EditProfile />} />
            <Route path="/dashboard/:id" element={<Dashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset/:token" element={<ResetPassword />} />
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/update-property/:id" element={<UpdateProferty />} />
            <Route
              path="/properties/single/:id"
              element={<PropertyDetails />}
            />
            <Route path="/favorites-properties" element={<FavoritesPage />} />
            <Route path="/about" element={<Aboutus />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ai-property-hub" element={<AIPropertyHub />} />
            <Route path="/support-page" element={<SupportPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/TermsPage" element={<TermsPage />} />
            <Route path="/PrivacyPage" element={<PrivacyPage />} />


            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
          <ToastContainer />
          {showQuestionnaire && (
            <Questionnaire
              onComplete={handleQuestionnaireComplete}
              onCancel={handleQuestionnaireSkip}
              backendUrl={Backendurl}
            />
          )}
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
