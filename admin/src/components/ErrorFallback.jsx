import { AlertCircle } from "lucide-react";
import Proptypes from "prop-types";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-500 mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
            transition-colors duration-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

ErrorFallback.propTypes = {
    error: Proptypes.object.isRequired,
    resetErrorBoundary: Proptypes.func.isRequired
    };
    

export default ErrorFallback;