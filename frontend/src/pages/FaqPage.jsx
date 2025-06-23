import { useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiExternalLink,
  FiMessageSquare,
} from "react-icons/fi";

const FaqPage = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openQuestions, setOpenQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      id: "general",
      name: "General Questions",
      icon: "🌐",
      questions: [
        {
          question: "What is RealEstate Pro and how does it work?",
          answer:
            "RealEstate Pro is a comprehensive real estate platform that leverages advanced technology to connect buyers, sellers, and renters with ideal properties. Our platform uses AI-driven matching algorithms to suggest properties based on your preferences, browsing history, and market trends. For sellers and agents, we provide powerful tools to showcase properties with virtual tours, high-resolution images, and detailed analytics.",
          links: [
            { text: "How our matching works", url: "#" },
            { text: "Platform features", url: "#" },
          ],
        },
        {
          question: "Is there a cost to use RealEstate Pro?",
          answer:
            "For buyers and renters, our platform is completely free to use with full access to all property listings and search features. For sellers and real estate professionals, we offer tiered subscription plans: 1) Basic (free with limited listings), 2) Professional ($29/month with enhanced visibility), and 3) Enterprise (custom pricing for brokerages). Premium features include advanced analytics, priority placement in search results, and dedicated support.",
          links: [
            { text: "View pricing plans", url: "#" },
            { text: "Compare features", url: "#" },
          ],
        },
      ],
    },
    {
      id: "buying",
      name: "Buying & Renting",
      icon: "🏠",
      questions: [
        {
          question: "How do I schedule a property viewing?",
          answer:
            "To schedule a viewing: 1) Find the property you're interested in, 2) Click the \"Schedule Viewing\" button, 3) Select from available time slots (you'll see the agent's calendar in real-time), 4) Provide your contact details and any special requests. You'll receive immediate confirmation and reminders as the appointment approaches. For last-minute requests (within 24 hours), please call the listing agent directly.",
          links: [
            { text: "Viewing etiquette tips", url: "#" },
            { text: "How to prepare", url: "#" },
          ],
        },
        {
          question: "What verification is required to make an offer?",
          answer:
            "To submit an offer on a property, you'll need to complete our verification process which includes: 1) Government-issued ID, 2) Proof of funds or mortgage pre-approval, 3) Completed buyer profile. This helps ensure serious inquiries and protects all parties. Your documents are securely stored using bank-level encryption and only shared with relevant parties when necessary.",
          links: [
            { text: "Document requirements", url: "#" },
            { text: "Security measures", url: "#" },
          ],
        },
      ],
    },
    {
      id: "selling",
      name: "Selling & Listing",
      icon: "💰",
      questions: [
        {
          question: "What should I include in my property listing?",
          answer:
            "For optimal results, include: 1) High-quality professional photos (minimum 15, including all rooms and exterior), 2) Detailed description highlighting unique features, 3) Accurate square footage and room dimensions, 4) Neighborhood amenities and walkability score, 5) Recent upgrades with dates and costs, 6) Virtual tour or 3D walkthrough, 7) Utility cost averages. Our data shows listings with these elements receive 3x more views and sell 30% faster.",
          links: [
            { text: "Photography guidelines", url: "#" },
            { text: "Listing optimization tips", url: "#" },
          ],
        },
        {
          question: "How does your commission structure work?",
          answer:
            "We offer flexible commission options: 1) Traditional (2.5-3% to buyer's agent + 2.5-3% to listing agent), 2) Flat fee ($3,000 for full service), 3) Hybrid (1% + $1,000). Our platform reduces average commission costs by 40% compared to traditional brokerages while providing superior marketing and exposure. All fees are clearly outlined before you sign the listing agreement with no hidden costs.",
          links: [
            { text: "Commission calculator", url: "#" },
            { text: "Service comparison", url: "#" },
          ],
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

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-4">
          Knowledge Base
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find instant answers to common questions about our platform and
          services.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Categories Sidebar */}
        <div className="lg:w-1/4">
          <div className="sticky top-4">
            <h2 className="text-lg font-medium text-blue-600 mb-4 px-2">
              Categories
            </h2>
            <nav className="space-y-1">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeCategory === category.id
                      ? "bg-indigo-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl mr-3">{category.icon}</span>
                  <span>{category.name}</span>
                  <span className="ml-auto bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {category.questions.length}
                  </span>
                </button>
              ))}
            </nav>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 px-2">
                Need more help?
              </h3>
              <a
                href="/support-page"
                className="flex items-center px-4 py-3 rounded-lg bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100 transition-colors duration-200"
              >
                <FiMessageSquare className="w-5 h-5 mr-3" />
                Contact Support Team
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="lg:w-3/4">
          {filteredCategories.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No results found for "{searchQuery}"
              </h3>
              <p className="text-gray-500">
                Try different search terms or contact our support team for
                assistance.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-600">
                  {faqCategories.find((cat) => cat.id === activeCategory)?.name}
                </h2>
                <span className="ml-3 bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {
                    filteredCategories.find((cat) => cat.id === activeCategory)
                      ?.questions.length
                  }{" "}
                  articles
                </span>
              </div>

              <div className="space-y-4">
                {filteredCategories
                  .find((cat) => cat.id === activeCategory)
                  ?.questions.map((item, index) => {
                    const questionId = `${activeCategory}-${index}`;
                    return (
                      <div
                        key={questionId}
                        className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all duration-200 ${
                          openQuestions.includes(questionId)
                            ? "border-indigo-200"
                            : ""
                        }`}
                      >
                        <button
                          onClick={() => toggleQuestion(questionId)}
                          className="w-full px-6 py-5 text-left focus:outline-none"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.question}
                            </h3>
                            <FiChevronDown
                              className={`h-5 w-5 text-indigo-500 transform transition-transform duration-200 ${
                                openQuestions.includes(questionId)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </div>
                        </button>
                        {openQuestions.includes(questionId) && (
                          <div className="px-6 pb-6">
                            <div className="prose prose-indigo max-w-none text-gray-600">
                              <p>{item.answer}</p>
                              {item.links && item.links.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Related resources:
                                  </h4>
                                  <ul className="space-y-2">
                                    {item.links.map((link, i) => (
                                      <li key={i}>
                                        <a
                                          href={link.url}
                                          className="text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {link.text}
                                          <FiExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </>
          )}

          {/* Popular Articles */}
          <div className="mt-12">
            <h3 className="text-lg font-medium text-blue-600 mb-4">
              Popular articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "How to verify my account?",
                "Understanding closing costs",
                "Preparing your home for sale",
                "Negotiation strategies for buyers",
              ].map((article, index) => (
                <a
                  key={index}
                  href="#"
                  className="group bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:border-indigo-300 transition-colors duration-200"
                >
                  <h4 className="font-medium text-gray-800 group-hover:text-indigo-600 mb-1">
                    {article}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {Math.floor(Math.random() * 5) + 1} min read
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
