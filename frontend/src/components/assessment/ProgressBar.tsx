import React from 'react';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 border-purple-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Step Label */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center min-w-20">
                <div className={`text-xs font-medium ${index <= currentStep ? 'text-purple-600' : 'text-gray-400'}`}>
                  {step.title}
                </div>
              </div>
            </div>

            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                  index < currentStep ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Description */}
      <div className="text-center mt-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {steps[currentStep]?.title || 'Assessment'}
          </h3>
          <p className="text-sm text-gray-600">
            {steps[currentStep]?.description || 'Complete your health assessment'}
          </p>
          <div className="mt-3">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Step {currentStep + 1} of {steps.length} ({Math.round(((currentStep + 1) / steps.length) * 100)}% complete)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;