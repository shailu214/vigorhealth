import React from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { setGdprConsent } from '../../store/slices/uiSlice';

interface GDPRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GDPRModal: React.FC<GDPRModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const handleAccept = () => {
    dispatch(setGdprConsent(true));
    localStorage.setItem('gdprConsent', 'true');
    onClose();
  };

  const handleDecline = () => {
    dispatch(setGdprConsent(false));
    localStorage.setItem('gdprConsent', 'false');
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleDecline}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        >
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                Privacy & Data Consent
              </h3>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              We care about your privacy. This health assessment platform collects and processes personal health information to provide you with personalized insights.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">What we collect:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Health metrics and lifestyle information</li>
                <li>• Assessment responses and preferences</li>
                <li>• Usage data for improving our services</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Your rights:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Access, update, or delete your data</li>
                <li>• Withdraw consent at any time</li>
                <li>• Data portability and transparency</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleDecline}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Accept & Continue
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By continuing, you agree to our{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default GDPRModal;