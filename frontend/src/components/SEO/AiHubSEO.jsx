import { Helmet } from "react-helmet-async";

const AiHubSEO = () => {
  return (
    <Helmet>
      <title>
        AI Property Hub | Zaroori Zameen - Market Trends & Property Analysis
      </title>
      <meta
        name="description"
        content="Use Zaroori Zameen AI Property Hub to analyze real estate trends, compare property values, and get location-specific investment insights powered by advanced AI."
      />
      <meta
        name="keywords"
        content="AI property analysis, real estate trends, property investment, rental yield, location trends, property appreciation, Mumbai real estate data, Delhi property market, Bangalore housing trends"
      />

      {/* Enhanced social sharing */}
      <meta property="og:title" content="AI Property Hub | Zaroori Zameen" />
      <meta
        property="og:description"
        content="AI-powered property analysis and location trends for smarter real estate decisions."
      />
      <meta property="og:type" content="website" />

      {/* Local availability note for crawlers */}
      <meta name="robots" content="index, follow" />
      <meta
        name="availability"
        content="Demo features available in local environment. Download repository for full functionality."
      />
    </Helmet>
  );
};

export default AiHubSEO;
