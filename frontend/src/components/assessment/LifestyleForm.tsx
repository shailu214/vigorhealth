import React, { useState } from 'react';

interface LifestyleFormProps {
  onSubmit: (data: any) => void;
}

const LifestyleForm: React.FC<LifestyleFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<any>({
    diet: {},
    exercise: {},
    habits: {},
    medicalHistory: {}
  });

  const handleInputChange = (category: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Diet Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
          Diet & Nutrition
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preference</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.diet.preference || ''}
              onChange={(e) => handleInputChange('diet', 'preference', e.target.value)}
              required
            >
              <option value="">Select dietary preference</option>
              <option value="omnivore">Omnivore</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="pescatarian">Pescatarian</option>
              <option value="keto">Ketogenic</option>
              <option value="paleo">Paleo</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meals per Day</label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Number of meals"
                value={formData.diet.mealsPerDay || ''}
                onChange={(e) => handleInputChange('diet', 'mealsPerDay', parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Water Intake (glasses/day)</label>
              <input
                type="number"
                min="0"
                max="20"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Glasses of water"
                value={formData.diet.waterIntake || ''}
                onChange={(e) => handleInputChange('diet', 'waterIntake', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Food Allergies/Intolerances</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="List any food allergies or intolerances (leave blank if none)"
              value={formData.diet.allergies || ''}
              onChange={(e) => handleInputChange('diet', 'allergies', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Exercise Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Exercise & Physical Activity
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Frequency</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.exercise.frequency || ''}
              onChange={(e) => handleInputChange('exercise', 'frequency', e.target.value)}
              required
            >
              <option value="">Select exercise frequency</option>
              <option value="daily">Daily</option>
              <option value="5-6_times">5-6 times per week</option>
              <option value="3-4_times">3-4 times per week</option>
              <option value="1-2_times">1-2 times per week</option>
              <option value="rarely">Rarely</option>
              <option value="never">Never</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Duration (minutes)</label>
              <input
                type="number"
                min="0"
                max="300"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Minutes per session"
                value={formData.exercise.duration || ''}
                onChange={(e) => handleInputChange('exercise', 'duration', parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Intensity</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.exercise.intensity || ''}
                onChange={(e) => handleInputChange('exercise', 'intensity', e.target.value)}
                required
              >
                <option value="">Select intensity</option>
                <option value="low">Low (Light walking, yoga)</option>
                <option value="moderate">Moderate (Brisk walking, cycling)</option>
                <option value="high">High (Running, HIIT)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Types of Exercise</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Cardio', 'Strength Training', 'Yoga', 'Swimming', 'Cycling', 'Running', 'Sports', 'Other'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    checked={formData.exercise.types?.includes(type) || false}
                    onChange={(e) => {
                      const currentTypes = formData.exercise.types || [];
                      const newTypes = e.target.checked
                        ? [...currentTypes, type]
                        : currentTypes.filter((t: string) => t !== type);
                      handleInputChange('exercise', 'types', newTypes);
                    }}
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Habits Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
          Lifestyle Habits
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Smoking Status</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.habits.smoking || ''}
                onChange={(e) => handleInputChange('habits', 'smoking', e.target.value)}
                required
              >
                <option value="">Select smoking status</option>
                <option value="never">Never smoked</option>
                <option value="former">Former smoker</option>
                <option value="current">Current smoker</option>
                <option value="occasional">Occasional smoker</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alcohol Consumption</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.habits.alcohol || ''}
                onChange={(e) => handleInputChange('habits', 'alcohol', e.target.value)}
                required
              >
                <option value="">Select alcohol consumption</option>
                <option value="none">Never</option>
                <option value="rare">Rarely (1-2 times/year)</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Caffeine Intake (cups/day)</label>
            <input
              type="number"
              min="0"
              max="20"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Number of caffeinated drinks per day"
              value={formData.habits.caffeine || ''}
              onChange={(e) => handleInputChange('habits', 'caffeine', parseInt(e.target.value))}
              required
            />
          </div>
        </div>
      </div>

      {/* Medical History Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          Medical History
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="List current medications and dosages (leave blank if none)"
              value={formData.medicalHistory.medications || ''}
              onChange={(e) => handleInputChange('medicalHistory', 'medications', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis', 'Depression', 'Anxiety', 'Other'].map((condition) => (
                <label key={condition} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    checked={formData.medicalHistory.conditions?.includes(condition) || false}
                    onChange={(e) => {
                      const currentConditions = formData.medicalHistory.conditions || [];
                      const newConditions = e.target.checked
                        ? [...currentConditions, condition]
                        : currentConditions.filter((c: string) => c !== condition);
                      handleInputChange('medicalHistory', 'conditions', newConditions);
                    }}
                  />
                  <span className="text-sm text-gray-700">{condition}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Family Medical History</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="Describe relevant family medical history (leave blank if none)"
              value={formData.medicalHistory.familyHistory || ''}
              onChange={(e) => handleInputChange('medicalHistory', 'familyHistory', e.target.value)}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium"
      >
        Continue to Mental Health Assessment
      </button>
    </form>
  );
};

export default LifestyleForm;