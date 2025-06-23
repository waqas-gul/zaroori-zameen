import { useState } from 'react';
import { FiChevronDown, FiExternalLink } from 'react-icons/fi';

const PrivacyPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedCookies, setExpandedCookies] = useState(false);

  const sections = [
    {
      id: 'overview',
      title: '1. Overview',
      content: (
        <>
          <p className="mb-4">
            RealEstate Pro ("us", "we", or "our") operates the RealEstate Pro platform (the "Service"). This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>
          <p className="mb-4">
            We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions.
          </p>
          <p>
            This Privacy Policy complies with the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and other applicable privacy laws.
          </p>
        </>
      )
    },
    {
      id: 'data-collection',
      title: '2. Data Collection',
      content: (
        <>
          <p className="mb-4">
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>
          <h4 className="font-medium text-gray-800 mb-2">Personal Data</h4>
          <p className="mb-4">
            While using our Service, we may ask you to provide certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Address, State, Province, ZIP/Postal code, City</li>
            <li>Cookies and Usage Data</li>
            <li>Financial information for transactions (processed by third-party payment processors)</li>
          </ul>
          <h4 className="font-medium text-gray-800 mb-2">Usage Data</h4>
          <p>
            We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
          </p>
        </>
      )
    },
    {
      id: 'data-use',
      title: '3. Use of Data',
      content: (
        <>
          <p className="mb-4">
            RealEstate Pro uses the collected data for various purposes:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To provide you with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless you have opted not to receive such information</li>
          </ul>
          <p>
            We may use your Personal Data to contact you with newsletters, marketing or promotional materials and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or instructions provided in any email we send.
          </p>
        </>
      )
    },
    {
      id: 'data-sharing',
      title: '4. Data Sharing & Disclosure',
      content: (
        <>
          <p className="mb-4">
            We may disclose your Personal Data in the good faith belief that such action is necessary to:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Comply with a legal obligation</li>
            <li>Protect and defend the rights or property of RealEstate Pro</li>
            <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
            <li>Protect the personal safety of users of the Service or the public</li>
            <li>Protect against legal liability</li>
          </ul>
          <h4 className="font-medium text-gray-800 mb-2">Service Providers</h4>
          <p className="mb-4">
            We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
          <h4 className="font-medium text-gray-800 mb-2">Business Transfers</h4>
          <p>
            If RealEstate Pro is involved in a merger, acquisition or asset sale, your Personal Data may be transferred. We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.
          </p>
        </>
      )
    }
  ];

  const cookieTypes = [
    {
      name: "Essential Cookies",
      purpose: "Necessary for the website to function and cannot be switched off",
      examples: ["Session management", "Authentication", "Security"]
    },
    {
      name: "Performance Cookies",
      purpose: "Help us understand how visitors interact with our website",
      examples: ["Google Analytics", "Heatmaps", "Error tracking"]
    },
    {
      name: "Functional Cookies",
      purpose: "Enable enhanced functionality and personalization",
      examples: ["Language preferences", "Region settings", "Chat support"]
    },
    {
      name: "Targeting Cookies",
      purpose: "Used to deliver relevant ads and measure ad performance",
      examples: ["Facebook Pixel", "Google Ads", "Retargeting"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-4">
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We are committed to protecting your personal information and your right to privacy.
        </p>
        <p className="text-gray-500 mt-3">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Table of Contents */}
        <div className="lg:w-1/4">
          <div className="sticky top-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-medium text-blue-600 mb-4">
                Contents
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
                <button
                  onClick={() => setExpandedCookies(!expandedCookies)}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                    expandedCookies
                      ? 'bg-indigo-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Cookie Policy
                </button>
              </nav>
            </div>

            <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Your Rights
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-sm text-gray-700">Right to access your data</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-sm text-gray-700">Right to rectification</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-sm text-gray-700">Right to erasure</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-sm text-gray-700">Right to restrict processing</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-sm text-gray-700">Right to data portability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Active Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-8">
            <div className="p-6 sm:p-8">
              <div className="prose prose-indigo max-w-none">
                {sections.find(section => section.id === activeSection)?.content}
              </div>
            </div>
          </div>

          {/* Cookie Policy */}
          {expandedCookies && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-blue-700 mb-4">Cookie Policy</h2>
                <p className="text-gray-600 mb-6">
                  We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
                </p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-blue-700 mb-3">Types of Cookies We Use</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cookieTypes.map((cookie, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-700 mb-2">{cookie.name}</h4>
                        <p className="text-gray-600 text-sm mb-2">{cookie.purpose}</p>
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Examples:</p>
                          <div className="flex flex-wrap gap-1">
                            {cookie.examples.map((example, i) => (
                              <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-medium text-blue-700 mb-3">Managing Cookies</h3>
                <p className="text-gray-600 mb-4">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">How to manage cookies in your browser:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className="flex items-start">
                      <FiExternalLink className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <a href="#" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Google Chrome cookie settings
                      </a>
                    </li>
                    <li className="flex items-start">
                      <FiExternalLink className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <a href="#" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Mozilla Firefox cookie settings
                      </a>
                    </li>
                    <li className="flex items-start">
                      <FiExternalLink className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <a href="#" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Safari cookie settings
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about this Privacy Policy, please contact our Data Protection Officer:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">By Email</h3>
                  <a
                    href="mailto:privacy@realestatepro.com"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    privacy@zaroorizameen.com
                  </a>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">By Mail</h3>
                  <address className="not-italic text-gray-600">
                    Zaroori Zameen<br />
                    Attn: Data Protection Officer<br />
                    chakdara Privacy Lane, Suite 100<br />
                    Chakdara, KPK <br />
                    Pakistan
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;