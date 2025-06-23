import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PropTypes from 'prop-types';

const AnalysisDisplay = ({ analysis }) => {
  const [expanded, setExpanded] = useState(true);
  
  if (!analysis) {
    return null;
  }

  // Custom components for styling the markdown elements
  const components = {
    h1: ({node, ...props}) => (
      <motion.h1 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 mt-5 mb-3 pb-2 border-b border-gray-100 break-words"
        {...props}
      />
    ),
    h2: ({node, ...props}) => (
      <motion.h2 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-gray-800 mt-5 mb-3 pb-1 break-words"
        {...props}
      />
    ),
    h3: ({node, ...props}) => (
      <motion.h3 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-semibold text-gray-800 mt-4 mb-2 flex flex-wrap items-center"
        {...props}
      />
    ),
    p: ({node, ...props}) => (
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="my-2.5 text-gray-700 leading-relaxed break-words"
        {...props}
      />
    ),
    ul: ({node, ...props}) => (
      <motion.ul 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="my-2 ml-2 space-y-1"
        {...props}
      />
    ),
    ol: ({node, ...props}) => (
      <motion.ol 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="my-2 ml-2 list-decimal space-y-1 pl-3"
        {...props}
      />
    ),
    li: ({node, ordered, ...props}) => (
      <motion.li 
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        className="ml-3 mt-1 text-gray-700 flex items-start"
      >
        {!ordered && (
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-3 mr-2 flex-shrink-0"></span>
        )}
        <span className="break-words" {...props} />
      </motion.li>
    ),
    hr: () => (
      <motion.hr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="my-4 border-t border-gray-200"
      />
    ),
    strong: ({node, ...props}) => (
      <strong className="text-gray-900 font-semibold" {...props} />
    ),
    em: ({node, ...props}) => (
      <em className="text-gray-800 italic" {...props} />
    ),
    a: ({node, ...props}) => (
      <a className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    blockquote: ({node, ...props}) => (
      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-l-4 border-blue-200 pl-4 my-4 text-gray-600 italic"
        {...props}
      />
    ),
    code: ({node, inline, ...props}) => (
      inline ? 
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800" {...props} /> :
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm my-4">
          <code className="font-mono text-gray-800" {...props} />
        </pre>
    ),
    table: ({node, ...props}) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md" {...props} />
      </div>
    ),
    thead: ({node, ...props}) => <thead className="bg-gray-50" {...props} />,
    tbody: ({node, ...props}) => <tbody className="divide-y divide-gray-200" {...props} />,
    tr: ({node, ...props}) => <tr className="hover:bg-gray-50" {...props} />,
    th: ({node, ...props}) => <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase" {...props} />,
    td: ({node, ...props}) => <td className="px-3 py-2 text-sm text-gray-500" {...props} />
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-100 w-full overflow-hidden"
    >
      <div className="flex justify-between items-center mb-3 sm:mb-4 pb-2 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0 text-blue-600" />
          <span className="truncate">Expert Analysis</span>
        </h2>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
          aria-label={expanded ? "Collapse analysis" : "Expand analysis"}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="prose prose-sm max-w-none text-gray-700 overflow-hidden text-sm sm:text-base"
          >
            <div className="overflow-x-auto">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {analysis}
              </ReactMarkdown>
            </div>
            
            <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 flex items-center text-xs text-gray-500 italic">
              <Info className="w-3 h-3 mr-1.5 flex-shrink-0" />
              <span>Analysis generated by AI based on available data. For informational purposes only.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

AnalysisDisplay.propTypes = {
  analysis: PropTypes.string,
};

export default AnalysisDisplay;