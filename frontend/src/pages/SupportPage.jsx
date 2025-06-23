import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiMessageSquare,
} from "react-icons/fi";

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
    urgency: "normal",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
        urgency: "normal",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  const supportChannels = [
    {
      icon: <FiMail className="w-6 h-6 text-indigo-500" />,
      title: "Email Support",
      description: "For general inquiries and non-urgent matters",
      contact: "waqasgul369@gmail.com",
      responseTime: "Typically within 24 hours",
    },
    {
      icon: <FiPhone className="w-6 h-6 text-indigo-500" />,
      title: "Phone Support",
      description: "For urgent matters and immediate assistance",
      contact: "+92 3488486186",
      responseTime: "Monday-Friday, 9am-5pm EST",
    },
    {
      icon: <FiMapPin className="w-6 h-6 text-indigo-500" />,
      title: "Office Visit",
      description: "Schedule an in-person appointment",
      contact: "Chakdara, Zaroori Zameen Markit ,near medical hospital",
      responseTime: "By appointment only",
    },
  ];

  const commonIssues = [
    {
      title: "Account Access Problems",
      solutions: [
        "Use the password reset feature",
        "Clear your browser cache and cookies",
        "Ensure CAPS LOCK is off when entering password",
      ],
    },
    {
      title: "Listing Submission Issues",
      solutions: [
        "Check all required fields are completed",
        "Verify image formats (JPG/PNG)",
        "Ensure file sizes are under 10MB",
      ],
    },
    {
      title: "Payment Processing",
      solutions: [
        "Verify card details are correct",
        "Check with your bank for restrictions",
        "Try alternative payment method",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-4">
          How Can We Help You Today?
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our dedicated support team is available 24/7 to assist with any
          questions or issues you may encounter.
        </p>
      </div>

      {/* Support Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {supportChannels.map((channel, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-indigo-100 transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-indigo-50 mr-4">
                  {channel.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {channel.title}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">{channel.description}</p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="font-medium text-gray-700 mr-2">
                    Contact:
                  </span>
                  <span className="text-indigo-600">{channel.contact}</span>
                </div>
                <div className="flex items-start">
                  <FiClock className="w-4 h-4 text-gray-500 mt-0.5 mr-1.5" />
                  <span className="text-gray-500 text-sm">
                    {channel.responseTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <FiMessageSquare className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-blue-600">
                Send Us a Message
              </h2>
            </div>

            {submitSuccess && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-100 flex items-start">
                <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-green-600 text-sm mt-1">
                    Our support team will get back to you shortly. A
                    confirmation has been sent to your email.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing Question">Billing Question</option>
                    <option value="Account Issue">Account Issue</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="urgency"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Urgency
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="low">Low Priority</option>
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical (24/7 Support)</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Please describe your issue in detail..."
                ></textarea>
              </div>

              <div className="flex items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
                <p className="ml-4 text-sm text-gray-500">
                  Average response time:{" "}
                  <span className="font-medium">2 hours</span>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Common Solutions */}
        <div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-blue-600 mb-6">
                Quick Solutions
              </h2>
              <p className="text-gray-600 mb-6">
                Many common issues can be resolved immediately using these
                solutions:
              </p>

              <div className="space-y-5">
                {commonIssues.map((issue, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-indigo-200 pl-4 py-1"
                  >
                    <h3 className="font-medium text-gray-800 mb-2">
                      {issue.title}
                    </h3>
                    <ul className="space-y-2">
                      {issue.solutions.map((solution, i) => (
                        <li key={i} className="flex items-start">
                          <span className="flex-shrink-0 h-5 w-5 text-indigo-500 mr-2 mt-0.5">
                            •
                          </span>
                          <span className="text-gray-600">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                System Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">Application</p>
                    <p className="text-sm text-gray-500">
                      All systems operational
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">Just now</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">Database</p>
                    <p className="text-sm text-gray-500">No issues detected</p>
                  </div>
                  <span className="text-sm text-gray-500">5 min ago</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">
                      Payment Processing
                    </p>
                    <p className="text-sm text-gray-500">Fully operational</p>
                  </div>
                  <span className="text-sm text-gray-500">1 hour ago</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                >
                  View full status history
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
