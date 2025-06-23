import { useState } from "react";
import {
  FiChevronDown,
  FiHome,
  FiDollarSign,
  FiKey,
  FiFileText,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const HomeFAQ = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openQuestions, setOpenQuestions] = useState([]);
  const navigate = useNavigate();

  const faqData = [
    {
      id: "general",
      name: "General",
      icon: <FiHome className="w-5 h-5" />,
      questions: [
        {
          question: "How do I search for properties?",
          answer:
            "Use our advanced search filters to narrow down properties by location, price range, bedrooms, and amenities. Save your searches to get notified when new matching listings appear.",
        },
        {
          question: "Is there a mobile app?",
          answer:
            "Yes! Download our iOS or Android app for on-the-go property searches, instant notifications, and virtual tours.",
        },
        {
          question: "How do I save favorite properties?",
          answer:
            "Click the heart icon on any listing to save it to your favorites. You can access all saved properties from your account dashboard.",
        },
      ],
    },
    {
      id: "buying",
      name: "Buying",
      icon: <FiDollarSign className="w-5 h-5" />,
      questions: [
        {
          question: "How do I schedule a viewing?",
          answer:
            "Click \"Schedule Viewing\" on any listing to see available time slots. You'll receive a confirmation email with the agent's contact details.",
        },
        {
          question: "What financing options are available?",
          answer:
            "We partner with trusted lenders offering conventional, FHA, VA, and jumbo loans. Use our mortgage calculator to estimate payments.",
        },
        {
          question: "What are the closing costs?",
          answer:
            "Closing costs typically range from 2% to 5% of the purchase price and include lender fees, title insurance, and escrow charges.",
        },
      ],
    },
    {
      id: "renting",
      name: "Renting",
      icon: <FiKey className="w-5 h-5" />,
      questions: [
        {
          question: "How do I apply for a rental?",
          answer:
            "Submit an online application with your ID, proof of income, and rental history. Most approvals take 24-48 hours.",
        },
        {
          question: "What's included in the rent?",
          answer:
            "This varies by property. Check the listing details for utilities, parking, or amenities included in the monthly price.",
        },
        {
          question: "What is the security deposit?",
          answer:
            "Security deposits typically equal one month's rent but may vary based on credit history and local regulations.",
        },
      ],
    },
    {
      id: "agents",
      name: "For Agents",
      icon: <FiFileText className="w-5 h-5" />,
      questions: [
        {
          question: "How do I list a property?",
          answer:
            "Agents can create listings through our dashboard. Upload photos, descriptions, and set open house times. All listings are reviewed within 24 hours.",
        },
        {
          question: "What are the fees?",
          answer:
            "We offer competitive commission structures. Contact our broker team for details.",
        },
        {
          question: "How do I get featured listings?",
          answer:
            "Upgrade to our Premium agent plan for priority placement in search results and marketing promotions.",
        },
      ],
    },
  ];

  const toggleQuestion = (questionId) => {
    setOpenQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleViewAllFAQs = () => {
    navigate("/faq");
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-lg font-extrabold text-blue-600 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Quick answers to common questions about buying, renting, and
            selling.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {faqData.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-100 border border-blue-200"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Questions */}
          <div className="space-y-4 mb-8">
            {faqData
              .find((cat) => cat.id === activeCategory)
              ?.questions.map((item, index) => {
                const questionId = `${activeCategory}-${index}`;
                return (
                  <div
                    key={questionId}
                    className={`bg-white overflow-hidden rounded-xl shadow-sm border border-gray-200 transition-all duration-200 ${
                      openQuestions.includes(questionId)
                        ? "border-indigo-300"
                        : ""
                    }`}
                  >
                    <button
                      onClick={() => toggleQuestion(questionId)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.question}
                      </h3>
                      <FiChevronDown
                        className={`w-5 h-5 text-indigo-500 transform transition-transform duration-200 ${
                          openQuestions.includes(questionId) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openQuestions.includes(questionId) && (
                      <div className="px-6 pb-5">
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Dual CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <a
              href="/support-page"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Contact Support
            </a>
            <button
              onClick={handleViewAllFAQs}
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-300 text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50"
            >
              View All FAQs
              <FiArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
