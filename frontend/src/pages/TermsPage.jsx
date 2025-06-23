import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState("acceptance");

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: (
        <>
          <p className="mb-4">
            By accessing or using the RealEstate Pro platform ("Service"), you
            agree to be bound by these Terms of Service ("Terms"). If you
            disagree with any part of the terms, you may not access the Service.
            These Terms apply to all visitors, users, and others who access or
            use the Service.
          </p>
          <p>
            We may modify these Terms at any time without prior notice. Your
            continued use of the Service following any changes constitutes your
            acceptance of the new Terms. It is your responsibility to review
            these Terms periodically for updates.
          </p>
        </>
      ),
    },
    {
      id: "accounts",
      title: "2. User Accounts",
      content: (
        <>
          <p className="mb-4">
            When you create an account with us, you must provide accurate,
            complete, and current information at all times. Failure to do so
            constitutes a breach of the Terms, which may result in immediate
            termination of your account.
          </p>
          <p className="mb-4">
            You are responsible for safeguarding the password that you use to
            access the Service and for any activities or actions under your
            password, whether your password is with our Service or a third-party
            service.
          </p>
          <p>
            You agree not to disclose your password to any third party. You must
            notify us immediately upon becoming aware of any breach of security
            or unauthorized use of your account.
          </p>
        </>
      ),
    },
    {
      id: "listings",
      title: "3. Property Listings",
      content: (
        <>
          <p className="mb-4">
            All property listings on RealEstate Pro are provided by third
            parties. While we strive to ensure the accuracy of listing
            information, we do not guarantee the completeness, reliability, or
            timeliness of any listing. Users are encouraged to independently
            verify all information before making decisions based on such
            information.
          </p>
          <p className="mb-4">
            Listing agents and property owners are solely responsible for their
            listing content, including text, photographs, videos, virtual tours,
            and other materials. RealEstate Pro reserves the right to remove any
            listing that violates our policies or these Terms without notice.
          </p>
          <p>
            Our platform may display estimated property values, market trends,
            or other analytical data. These are computer-generated
            approximations and should not be considered professional appraisals
            or substitutes for professional advice.
          </p>
        </>
      ),
    },
    {
      id: "transactions",
      title: "4. Real Estate Transactions",
      content: (
        <>
          <p className="mb-4">
            RealEstate Pro is a technology platform, not a licensed real estate
            broker. We do not participate in negotiations, prepare contracts, or
            provide legal advice. All real estate transactions are conducted
            between buyers, sellers, and their respective agents or attorneys.
          </p>
          <p className="mb-4">
            While our platform may facilitate connections between parties, we
            are not responsible for the outcome of any transaction. Users are
            solely responsible for conducting due diligence and complying with
            all local, state, and federal laws regarding real estate
            transactions.
          </p>
          <p>
            Any financial transactions conducted through our platform (such as
            earnest money deposits) are processed by licensed third-party escrow
            services. RealEstate Pro does not hold funds or act as an escrow
            agent.
          </p>
        </>
      ),
    },
    {
      id: "payments",
      title: "5. Payments and Fees",
      content: (
        <>
          <p className="mb-4">
            Certain features of the Service may require payment of fees. You
            agree to pay all applicable fees as described on the Service in
            connection with such features. All fees are non-refundable unless
            otherwise stated in writing.
          </p>
          <p className="mb-4">
            We use third-party payment processors to bill you through a payment
            account linked to your account. The processing of payments will be
            subject to the terms, conditions, and privacy policies of the
            payment processor in addition to these Terms.
          </p>
          <p>
            We may change our fees at any time by posting the changes on the
            Service with advance notice. Your continued use of paid features
            after the fee change becomes effective constitutes your agreement to
            pay the modified amount.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-4">
          Terms & Conditions
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Table of Contents */}
        <div className="lg:w-1/4">
          <div className="sticky top-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-medium text-blue-600 mb-4">
                Table of Contents
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                      activeSection === section.id
                        ? "bg-indigo-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/support"
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Contact Legal Department
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Download PDF Version
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-6 sm:p-8">
              <div className="prose prose-indigo max-w-none">
                {
                  sections.find((section) => section.id === activeSection)
                    ?.content
                }
              </div>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="mt-8 space-y-6">
            {sections
              .filter((section) => section.id !== activeSection)
              .map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                >
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className="w-full px-6 py-4 text-left focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {section.title}
                      </h3>
                      <FiChevronDown className="h-5 w-5 text-indigo-500" />
                    </div>
                  </button>
                </div>
              ))}
          </div>

          {/* Acceptance Section */}
          <div className="mt-12 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="text-lg font-medium text-indigo-800 mb-3">
              Acknowledgement
            </h3>
            <p className="text-indigo-700 mb-4">
              By using our Service, you acknowledge that you have read and
              understood these Terms and agree to be bound by them. If you do
              not agree, you may not access or use our Service.
            </p>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-indigo-800">
                  Last accepted:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
