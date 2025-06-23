import React from 'react';
import { logos } from '../assets/logo';
import { motion } from 'framer-motion';

const Companies = () => {
  return (
    <div className="mt-16 my-3 mx-6">
      {/* Additional Trusted Companies Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-white rounded-lg shadow-xl pb-12"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-lg font-semibold text-gray-900">Trusted by 200+ companies</h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5"
          >
            <img className="col-span-2 max-h-12 w-full object-contain lg:col-span-1" src={logos.Googlelogo} alt="Google" width="158" height="48" />
            <img className="col-span-2 max-h-12 w-full object-contain lg:col-span-1" src={logos.Bookinglogo} alt="Booking" width="158" height="48" />
            <img className="col-span-2 max-h-12 w-full object-contain lg:col-span-1" src={logos.Airbnblogo} alt="airbnb" width="158" height="48" />
            <img className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1" src={logos.Microsoftlogo} alt="Microsoft" width="158" height="48" />
            <img className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1" src={logos.Amazonlogo} alt="Amazon" width="158" height="48" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Companies;
