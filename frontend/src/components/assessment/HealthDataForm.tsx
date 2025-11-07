import React, { useState } from 'react';
import OCRUpload from '../upload/OCRUpload';

interface HealthDataFormProps {
  onSubmit: (data: any) => void;
  type: 'personal' | 'bloodwork' | 'mental';
}

const HealthDataForm: React.FC<HealthDataFormProps> = ({ onSubmit, type }) => {
  const [formData, setFormData] = useState<any>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderPersonalForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter your full name"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Age"
            value={formData.age || ''}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={formData.gender || ''}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Height in cm"
            value={formData.height || ''}
            onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Weight in kg"
            value={formData.weight || ''}
            onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderBloodworkForm = () => {
    const bloodworkSections = [
      {
        title: 'Complete Blood Count (CBC)',
        fields: [
          { key: 'hemoglobin', label: 'Hemoglobin (g/dL)', range: '12-17' },
          { key: 'hematocrit', label: 'Hematocrit (%)', range: '36-50' },
          { key: 'rbc', label: 'Red Blood Cells (M/μL)', range: '4.2-5.8' },
          { key: 'wbc', label: 'White Blood Cells (K/μL)', range: '4.0-11.0' },
          { key: 'platelets', label: 'Platelets (K/μL)', range: '150-450' }
        ]
      },
      {
        title: 'Lipid Panel',
        fields: [
          { key: 'totalCholesterol', label: 'Total Cholesterol (mg/dL)', range: '<200' },
          { key: 'hdlCholesterol', label: 'HDL Cholesterol (mg/dL)', range: '>40' },
          { key: 'ldlCholesterol', label: 'LDL Cholesterol (mg/dL)', range: '<100' },
          { key: 'triglycerides', label: 'Triglycerides (mg/dL)', range: '<150' }
        ]
      },
      {
        title: 'Metabolic Panel',
        fields: [
          { key: 'fastingGlucose', label: 'Fasting Glucose (mg/dL)', range: '70-100' },
          { key: 'hba1c', label: 'HbA1c (%)', range: '<5.7' },
          { key: 'creatinine', label: 'Creatinine (mg/dL)', range: '0.6-1.2' },
          { key: 'bun', label: 'BUN (mg/dL)', range: '7-20' }
        ]
      }
    ];

    const currentSectionData = bloodworkSections[currentSection];

    const handleFileProcessed = (extractedData: any) => {
      console.log('OCR extracted data:', extractedData);
      
      if (extractedData) {
        // Track which fields were auto-filled
        const newAutoFilledFields = Object.keys(extractedData);
        setAutoFilledFields(newAutoFilledFields);
        
        // Update form data with extracted values
        setFormData((prev: any) => ({
          ...prev,
          ...extractedData
        }));
        
        // Show success message
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }
      
      setShowUpload(false);
    };

    return (
      <div className="space-y-4">
        {/* Upload Toggle */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Upload Lab Reports</h4>
              <p className="text-sm text-blue-700">
                Upload your lab reports and we'll extract the data automatically
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowUpload(!showUpload)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {showUpload ? 'Hide Upload' : 'Upload Reports'}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-medium text-green-900">Lab Report Processed Successfully!</h4>
                <p className="text-sm text-green-700">
                  {autoFilledFields.length} field(s) automatically filled from your lab report.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Component */}
        {showUpload && (
          <div className="mb-6">
            <OCRUpload 
              onFileProcessed={handleFileProcessed}
              onUploadProgress={(progress) => console.log('Upload progress:', progress)}
            />
          </div>
        )}

        {/* Manual Entry Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Manual Entry</h4>
            <span className="text-sm text-gray-600">Or enter values manually</span>
          </div>

          {/* Section Navigation */}
          <div className="flex space-x-2 mb-6">
            {bloodworkSections.map((section, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSection(index)}
                className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                  index === currentSection
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          <h4 className="font-medium text-gray-800 mb-4">{currentSectionData.title}</h4>

          {currentSectionData.fields.map((field) => {
            const isAutoFilled = autoFilledFields.includes(field.key);
            const hasValue = formData[field.key] !== undefined && formData[field.key] !== '';
            
            return (
              <div key={field.key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  <span className="text-xs text-gray-500 ml-2">(Normal: {field.range})</span>
                  {isAutoFilled && (
                    <span className="inline-flex items-center ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Auto-filled
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      isAutoFilled
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300'
                    }`}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={formData[field.key] || ''}
                    onChange={(e) => {
                      handleInputChange(field.key, parseFloat(e.target.value));
                      // Remove from auto-filled list when manually edited
                      if (isAutoFilled) {
                        setAutoFilledFields(prev => prev.filter(f => f !== field.key));
                      }
                    }}
                  />
                  {isAutoFilled && hasValue && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrentSection(Math.min(bloodworkSections.length - 1, currentSection + 1))}
              disabled={currentSection === bloodworkSections.length - 1}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Section
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMentalHealthForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Overall Mood</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={formData.mood || ''}
          onChange={(e) => handleInputChange('mood', e.target.value)}
          required
        >
          <option value="">Select your mood</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
          <option value="very_poor">Very Poor</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Anxiety Level</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={formData.anxietyLevel || ''}
          onChange={(e) => handleInputChange('anxietyLevel', e.target.value)}
          required
        >
          <option value="">Select anxiety level</option>
          <option value="none">None</option>
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Stress Level</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={formData.stressLevel || ''}
          onChange={(e) => handleInputChange('stressLevel', e.target.value)}
          required
        >
          <option value="">Select stress level</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
          <option value="very_high">Very High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Energy Level</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={formData.energyLevel || ''}
          onChange={(e) => handleInputChange('energyLevel', e.target.value)}
          required
        >
          <option value="">Select energy level</option>
          <option value="very_high">Very High</option>
          <option value="high">High</option>
          <option value="moderate">Moderate</option>
          <option value="low">Low</option>
          <option value="very_low">Very Low</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Quality</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={formData.sleepQuality || ''}
          onChange={(e) => handleInputChange('sleepQuality', e.target.value)}
          required
        >
          <option value="">Select sleep quality</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hours of Sleep per Night</label>
        <input
          type="number"
          min="0"
          max="24"
          step="0.5"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Average hours of sleep"
          value={formData.hoursOfSleep || ''}
          onChange={(e) => handleInputChange('hoursOfSleep', parseFloat(e.target.value))}
          required
        />
      </div>
    </div>
  );

  const renderForm = () => {
    switch (type) {
      case 'personal':
        return renderPersonalForm();
      case 'bloodwork':
        return renderBloodworkForm();
      case 'mental':
        return renderMentalHealthForm();
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderForm()}
      
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium"
      >
        Continue to Next Step
      </button>
    </form>
  );
};

export default HealthDataForm;