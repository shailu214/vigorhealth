const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize AI clients
let openaiClient = null;
let geminiClient = null;

/**
 * Generate AI-powered health recommendations based on assessment data
 * @param {Object} assessment - Health assessment data
 * @returns {Object} AI analysis with recommendations
 */
async function generateAIRecommendations(assessment) {
  try {
    // Get AI configuration from database
    const configRoutes = require('../routes/config');
    const aiConfig = await configRoutes.getCurrentConfig();
    
    // Initialize AI clients with current configuration
    initializeAIClients(aiConfig);
    
    // Construct the prompt with assessment data
    const prompt = constructHealthPrompt(assessment);
    
    // Use configured AI provider if available
    if (aiConfig?.system?.defaultProvider && aiConfig[aiConfig.system.defaultProvider]?.enabled) {
      const defaultProvider = aiConfig.system.defaultProvider;
      const providerConfig = aiConfig[defaultProvider];
      
      if (defaultProvider === 'openai' && openaiClient) {
        // Use OpenAI
        const completion = await openaiClient.chat.completions.create({
          model: providerConfig.model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a qualified health and wellness expert AI assistant. Analyze the provided health assessment data and provide personalized recommendations. 

IMPORTANT DISCLAIMERS:
- You are NOT providing medical diagnosis or treatment advice
- Always recommend consulting healthcare professionals for medical concerns
- Your recommendations are for general wellness and lifestyle improvement only
- Do not make specific medical claims or suggest stopping medications

RESPONSE FORMAT:
Provide a structured JSON response with the following format:
{
  "summary": "Brief 2-3 sentence health overview",
  "recommendations": {
    "lifestyle": ["lifestyle recommendation 1", "lifestyle recommendation 2"],
    "diet": ["dietary recommendation 1", "dietary recommendation 2"],
    "supplements": ["supplement suggestion 1", "supplement suggestion 2"],
    "exercise": ["exercise recommendation 1", "exercise recommendation 2"],
    "mental_health": ["mental health suggestion 1", "mental health suggestion 2"],
    "medical": ["medical consultation recommendation 1", "medical consultation recommendation 2"]
  },
  "priority_areas": ["area 1", "area 2", "area 3"],
  "confidence": 0.85
}

Be specific, actionable, and supportive in your recommendations.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: providerConfig.maxTokens || 2000,
          temperature: providerConfig.temperature || 0.7,
        });

        const response = completion.choices[0].message.content;
        
        // Try to parse JSON response
        let aiAnalysis;
        try {
          aiAnalysis = JSON.parse(response);
        } catch (parseError) {
          console.warn('Failed to parse AI response as JSON, using fallback format');
          aiAnalysis = generateDefaultRecommendations(assessment);
        }

        // Add metadata
        aiAnalysis.model = providerConfig.model;
        aiAnalysis.provider = defaultProvider;
        aiAnalysis.analysisDate = new Date();
        
        return aiAnalysis;
      }
    }
    
    // Use default recommendations if no AI provider configured
    console.warn('No AI provider configured, using default recommendations');
    return generateDefaultRecommendations(assessment);

    const completion = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a qualified health and wellness expert AI assistant. Analyze the provided health assessment data and provide personalized recommendations. 

IMPORTANT DISCLAIMERS:
- You are NOT providing medical diagnosis or treatment advice
- Always recommend consulting healthcare professionals for medical concerns
- Your recommendations are for general wellness and lifestyle improvement only
- Do not make specific medical claims or suggest stopping medications

RESPONSE FORMAT:
Provide a structured JSON response with the following format:
{
  "summary": "Brief 2-3 sentence health overview",
  "recommendations": {
    "lifestyle": ["lifestyle recommendation 1", "lifestyle recommendation 2"],
    "diet": ["dietary recommendation 1", "dietary recommendation 2"],
    "supplements": ["supplement suggestion 1", "supplement suggestion 2"],
    "exercise": ["exercise recommendation 1", "exercise recommendation 2"],
    "mental_health": ["mental health suggestion 1", "mental health suggestion 2"],
    "medical": ["medical consultation recommendation 1", "medical consultation recommendation 2"]
  },
  "priority_areas": ["area 1", "area 2", "area 3"],
  "confidence": 0.85
}

Be specific, actionable, and supportive in your recommendations.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2000,
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
    });

    const response = completion.choices[0].message.content;
    
    // Try to parse JSON response
    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(response);
    } catch (parseError) {
      console.warn('Failed to parse AI response as JSON, using fallback format');
      aiAnalysis = {
        summary: "AI analysis completed. Please consult with healthcare professionals for medical advice.",
        recommendations: {
          lifestyle: ["Maintain a balanced lifestyle"],
          diet: ["Follow a nutritious diet"],
          supplements: ["Consult with healthcare provider before taking supplements"],
          exercise: ["Engage in regular physical activity"],
          mental_health: ["Practice stress management techniques"],
          medical: ["Regular check-ups with healthcare provider"]
        },
        priority_areas: ["General wellness"],
        confidence: 0.5
      };
    }

    // Add metadata
    aiAnalysis.model = process.env.OPENAI_MODEL || 'gpt-4';
    aiAnalysis.analysisDate = new Date();
    
    return aiAnalysis;

  } catch (error) {
    console.error('AI recommendation generation error:', error);
    
    // Fallback recommendations if AI service fails
    return {
      summary: "Assessment completed. We recommend consulting with healthcare professionals for personalized medical advice.",
      recommendations: {
        lifestyle: [
          "Maintain a regular sleep schedule",
          "Practice stress management techniques",
          "Stay socially connected"
        ],
        diet: [
          "Eat a balanced diet rich in fruits and vegetables",
          "Stay adequately hydrated",
          "Limit processed foods and added sugars"
        ],
        supplements: [
          "Consult with healthcare provider before starting any supplements",
          "Consider getting nutrient levels tested"
        ],
        exercise: [
          "Aim for 150 minutes of moderate exercise per week",
          "Include both cardio and strength training",
          "Start slowly and gradually increase intensity"
        ],
        mental_health: [
          "Practice mindfulness or meditation",
          "Seek professional support if experiencing persistent mental health concerns",
          "Maintain social connections"
        ],
        medical: [
          "Schedule regular check-ups with your healthcare provider",
          "Discuss any concerning symptoms with a medical professional",
          "Keep track of your health metrics over time"
        ]
      },
      priority_areas: ["General wellness", "Preventive care"],
      confidence: 0.3,
      model: 'fallback',
      analysisDate: new Date(),
      error: 'AI service unavailable, using fallback recommendations'
    };
  }
}

/**
 * Generate chatbot responses for health assessment conversations
 * @param {Array} conversationHistory - Previous messages in conversation
 * @param {String} currentStep - Current step in assessment
 * @param {Object} userInput - User's latest input
 * @returns {Object} Chatbot response
 */
/**
 * Initialize AI clients based on configuration
 * @param {Object} config - AI configuration object
 */
function initializeAIClients(config) {
  if (!config) return;

  // Initialize OpenAI
  if (config.openai?.enabled && config.openai?.apiKey) {
    try {
      openaiClient = new OpenAI({
        apiKey: config.openai.apiKey,
      });
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
    }
  }

  // Initialize Gemini
  if (config.gemini?.enabled && config.gemini?.apiKey) {
    try {
      geminiClient = new GoogleGenerativeAI(config.gemini.apiKey);
    } catch (error) {
      console.error('Failed to initialize Gemini client:', error);
    }
  }
}

/**
 * Generate response using OpenAI
 * @param {Array} messages - Conversation messages
 * @param {Object} providerConfig - Provider configuration
 * @returns {String} Response text
 */
async function generateOpenAIResponse(messages, providerConfig) {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized');
  }

  const completion = await openaiClient.chat.completions.create({
    model: providerConfig.model || 'gpt-3.5-turbo',
    messages: messages,
    max_tokens: providerConfig.maxTokens || 1000,
    temperature: providerConfig.temperature || 0.7,
  });

  return completion.choices[0].message.content;
}

/**
 * Generate response using Gemini
 * @param {Array} messages - Conversation messages
 * @param {Object} providerConfig - Provider configuration
 * @returns {String} Response text
 */
async function generateGeminiResponse(messages, providerConfig) {
  if (!geminiClient) {
    throw new Error('Gemini client not initialized');
  }

  const model = geminiClient.getGenerativeModel({ 
    model: providerConfig.model || 'gemini-pro' 
  });

  // Convert messages to Gemini format
  const prompt = messages
    .filter(msg => msg.role !== 'system')
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

/**
 * Generate response using fallback (default responses)
 * @param {String} userMessage - User's message
 * @returns {String} Fallback response
 */
function generateFallbackResponse(userMessage) {
  const healthKeywords = ['health', 'wellness', 'exercise', 'diet', 'nutrition', 'symptoms', 'pain', 'tired', 'stress', 'sleep'];
  const isHealthRelated = healthKeywords.some(keyword => 
    userMessage.toLowerCase().includes(keyword)
  );

  if (isHealthRelated) {
    return "I'm here to help with health and wellness questions! While I can provide general information, please remember that I'm not a substitute for professional medical advice. For specific health concerns, always consult with a qualified healthcare provider. How can I assist you with your wellness journey today?";
  }

  return "Hello! I'm your AI health assistant. I'm here to help answer questions about health, wellness, nutrition, and lifestyle. What would you like to know more about?";
}

async function generateChatbotResponse(conversationHistory, currentStep, userInput) {
  try {
    const { config } = userInput || {};
    let systemPrompt;

    if (currentStep === 'chat') {
      // Simple chat mode for ChatWidget
      systemPrompt = `You are a friendly and knowledgeable AI health assistant. You provide helpful, accurate information about health, wellness, nutrition, and lifestyle topics.

IMPORTANT GUIDELINES:
- Be supportive, encouraging, and professional
- Provide evidence-based health and wellness information
- Never diagnose medical conditions or prescribe treatments
- Always recommend consulting healthcare professionals for medical concerns
- Keep responses conversational and easy to understand
- Use a warm, approachable tone

Remember: You are not a replacement for professional medical advice, diagnosis, or treatment.`;
    } else {
      // Assessment flow mode
      systemPrompt = `You are a friendly and professional AI health assessment assistant. Your role is to guide users through a comprehensive health assessment by asking relevant questions and collecting their health information.

GUIDELINES:
- Be empathetic, encouraging, and professional
- Ask one clear question at a time
- Provide brief explanations when needed
- Use emojis appropriately to make the conversation friendly
- Never provide medical diagnosis or treatment advice
- Always remind users to consult healthcare professionals for medical concerns
- Keep responses concise and easy to understand

CURRENT STEP: ${currentStep}

CONVERSATION FLOW:
1. welcome - Welcome and explain the process
2. personal_info - Collect name, age, gender, height, weight
3. blood_work_choice - Ask if they want to upload lab report or enter manually
4. blood_work_data - Collect blood test parameters
5. lifestyle - Ask about diet, exercise, sleep, stress
6. mental_health - Assess mood, anxiety, energy levels
7. analysis - Explain that analysis is being performed
8. recommendations - Present results and recommendations

Respond naturally and guide the user to the next appropriate step.`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
    ];

    const userMessage = typeof userInput.message === 'string' ? userInput.message : JSON.stringify(userInput);

    // Initialize AI clients if config provided
    if (config) {
      initializeAIClients(config);
    }

    let response;
    let usedProvider = 'fallback';

    // Try configured providers in order
    if (config?.system?.defaultProvider && config[config.system.defaultProvider]?.enabled) {
      const defaultProvider = config.system.defaultProvider;
      
      try {
        if (defaultProvider === 'openai' && openaiClient) {
          response = await generateOpenAIResponse(
            [...messages, { role: 'user', content: userMessage }],
            config.openai
          );
          usedProvider = 'openai';
        } else if (defaultProvider === 'gemini' && geminiClient) {
          response = await generateGeminiResponse(
            [...messages, { role: 'user', content: userMessage }],
            config.gemini
          );
          usedProvider = 'gemini';
        }
      } catch (error) {
        console.error(`Error with ${defaultProvider}:`, error);
        
        // Try fallback providers if enabled
        if (config.system?.fallbackEnabled) {
          const fallbackProviders = ['openai', 'gemini'].filter(p => 
            p !== defaultProvider && config[p]?.enabled
          );
          
          for (const provider of fallbackProviders) {
            try {
              if (provider === 'openai' && openaiClient) {
                response = await generateOpenAIResponse(
                  [...messages, { role: 'user', content: userMessage }],
                  config.openai
                );
                usedProvider = 'openai';
                break;
              } else if (provider === 'gemini' && geminiClient) {
                response = await generateGeminiResponse(
                  [...messages, { role: 'user', content: userMessage }],
                  config.gemini
                );
                usedProvider = 'gemini';
                break;
              }
            } catch (fallbackError) {
              console.error(`Fallback error with ${provider}:`, fallbackError);
            }
          }
        }
      }
    }

    // Use fallback if no response generated
    if (!response) {
      response = generateFallbackResponse(userMessage);
    }

    return {
      message: response,
      timestamp: new Date(),
      model: usedProvider,
      provider: usedProvider
    };

  } catch (error) {
    console.error('Chatbot response generation error:', error);
    
    // Fallback responses based on current step
    const fallbackResponses = {
      welcome: "Welcome to your AI Health Assessment! 🌟 I'll guide you through a comprehensive evaluation to provide personalized health insights. Let's start with some basic information about you. What's your name?",
      personal_info: "Great! Now I need some basic health information. Could you please share your age, gender, height, and weight?",
      blood_work_choice: "Now let's look at your health markers. Do you have recent lab results you'd like to upload, or would you prefer to enter the values manually? 📋",
      blood_work_data: "Please share your latest blood test values. Include any parameters you have available such as cholesterol, blood sugar, etc.",
      lifestyle: "Let's discuss your lifestyle! Tell me about your diet, exercise routine, sleep habits, and stress levels. 🏃‍♀️💤",
      mental_health: "How have you been feeling mentally and emotionally? I'd like to understand your mood, energy levels, and any stress you might be experiencing. 🧠💭",
      analysis: "Thank you for all the information! I'm now analyzing your data to provide personalized recommendations. This will take just a moment... ⚡",
      recommendations: "Based on your assessment, I have some personalized recommendations for you! Remember, these are general wellness suggestions and not medical advice. 🎯"
    };

    return {
      message: fallbackResponses[currentStep] || "I'm here to help with your health assessment. Could you please provide more information?",
      timestamp: new Date(),
      model: 'fallback',
      error: 'AI service unavailable'
    };
  }
}

/**
 * Construct detailed health prompt for AI analysis
 * @param {Object} assessment - Health assessment data
 * @returns {String} Formatted prompt
 */
function constructHealthPrompt(assessment) {
  let prompt = "HEALTH ASSESSMENT DATA FOR ANALYSIS:\n\n";

  // Personal Information
  if (assessment.personalInfo) {
    prompt += "PERSONAL INFORMATION:\n";
    prompt += `- Age: ${assessment.personalInfo.age} years\n`;
    prompt += `- Gender: ${assessment.personalInfo.gender}\n`;
    prompt += `- Height: ${assessment.personalInfo.height} cm\n`;
    prompt += `- Weight: ${assessment.personalInfo.weight} kg\n`;
    prompt += `- BMI: ${assessment.personalInfo.bmi}\n`;
    prompt += `- BMI Category: ${assessment.bmiCategory}\n\n`;
  }

  // Blood Work
  if (assessment.bloodWork && Object.keys(assessment.bloodWork).length > 0) {
    prompt += "BLOOD WORK RESULTS:\n";
    Object.entries(assessment.bloodWork).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'dataSource' && key !== 'uploadedFile') {
        prompt += `- ${key}: ${value}\n`;
      }
    });
    prompt += "\n";
  }

  // Lifestyle
  if (assessment.lifestyle) {
    prompt += "LIFESTYLE INFORMATION:\n";
    
    if (assessment.lifestyle.diet) {
      prompt += `Diet Type: ${assessment.lifestyle.diet.type}\n`;
      prompt += `Diet Quality: ${assessment.lifestyle.diet.quality}\n`;
      prompt += `Fruits/Vegetables servings per day: ${assessment.lifestyle.diet.fruits_vegetables}\n`;
      prompt += `Processed foods frequency: ${assessment.lifestyle.diet.processed_foods}\n`;
    }
    
    if (assessment.lifestyle.exercise) {
      prompt += `Exercise frequency: ${assessment.lifestyle.exercise.frequency} times per week\n`;
      prompt += `Exercise intensity: ${assessment.lifestyle.exercise.intensity}\n`;
      prompt += `Exercise duration: ${assessment.lifestyle.exercise.duration} minutes\n`;
      prompt += `Exercise types: ${assessment.lifestyle.exercise.type.join(', ')}\n`;
    }
    
    if (assessment.lifestyle.sleep) {
      prompt += `Sleep hours per night: ${assessment.lifestyle.sleep.hoursPerNight}\n`;
      prompt += `Sleep quality: ${assessment.lifestyle.sleep.quality}\n`;
    }
    
    if (assessment.lifestyle.stress) {
      prompt += `Stress level: ${assessment.lifestyle.stress.level}\n`;
      prompt += `Stress sources: ${assessment.lifestyle.stress.sources.join(', ')}\n`;
      prompt += `Stress management: ${assessment.lifestyle.stress.management.join(', ')}\n`;
    }
    
    if (assessment.lifestyle.substances) {
      prompt += `Smoking status: ${assessment.lifestyle.substances.smoking.status}\n`;
      prompt += `Alcohol frequency: ${assessment.lifestyle.substances.alcohol.frequency}\n`;
    }
    
    if (assessment.lifestyle.hydration) {
      prompt += `Water intake: ${assessment.lifestyle.hydration.waterIntake} ${assessment.lifestyle.hydration.unit} per day\n`;
    }
    
    prompt += "\n";
  }

  // Mental Health
  if (assessment.mentalHealth) {
    prompt += "MENTAL HEALTH ASSESSMENT:\n";
    prompt += `Overall mood: ${assessment.mentalHealth.mood}\n`;
    prompt += `Anxiety level: ${assessment.mentalHealth.anxiety.level}\n`;
    prompt += `Depression symptoms: ${assessment.mentalHealth.depression.symptoms}\n`;
    prompt += `Fatigue level: ${assessment.mentalHealth.fatigue.level}\n`;
    prompt += `Energy level: ${assessment.mentalHealth.energy.level}\n`;
    
    if (assessment.mentalHealth.cognitiveFunction) {
      prompt += `Memory: ${assessment.mentalHealth.cognitiveFunction.memory}\n`;
      prompt += `Concentration: ${assessment.mentalHealth.cognitiveFunction.concentration}\n`;
      prompt += `Mental clarity: ${assessment.mentalHealth.cognitiveFunction.mentalClarity}\n`;
    }
    prompt += "\n";
  }

  prompt += "Please analyze this health data and provide personalized, actionable recommendations focusing on areas that need the most attention. Remember to include appropriate medical disclaimers.";

  return prompt;
}

/**
 * Generate supplement recommendations based on health markers
 * @param {Object} bloodWork - Blood work data
 * @param {Object} lifestyle - Lifestyle data
 * @returns {Array} Supplement recommendations
 */
function generateSupplementRecommendations(bloodWork, lifestyle) {
  const recommendations = [];

  // Vitamin D
  if (bloodWork.vitaminD && bloodWork.vitaminD < 30) {
    recommendations.push({
      supplement: "Vitamin D3",
      reason: "Low vitamin D levels detected",
      dosage: "Consult healthcare provider for appropriate dosage",
      category: "vitamin"
    });
  }

  // B12
  if (bloodWork.vitaminB12 && bloodWork.vitaminB12 < 300) {
    recommendations.push({
      supplement: "Vitamin B12",
      reason: "Low B12 levels may affect energy and cognitive function",
      dosage: "Consult healthcare provider for appropriate dosage",
      category: "vitamin"
    });
  }

  // Iron
  if (bloodWork.iron && bloodWork.iron < 60) {
    recommendations.push({
      supplement: "Iron",
      reason: "Low iron levels detected",
      dosage: "Consult healthcare provider before supplementing iron",
      category: "mineral"
    });
  }

  // Omega-3 for cardiovascular health
  if (bloodWork.triglycerides && bloodWork.triglycerides > 150) {
    recommendations.push({
      supplement: "Omega-3 fatty acids",
      reason: "May help support cardiovascular health",
      dosage: "1-2g daily with meals",
      category: "fatty_acid"
    });
  }

  // Magnesium for sleep and stress
  if (lifestyle.stress && lifestyle.stress.level === 'high' || 
      lifestyle.sleep && lifestyle.sleep.quality === 'poor') {
    recommendations.push({
      supplement: "Magnesium",
      reason: "May help with sleep quality and stress management",
      dosage: "200-400mg before bedtime",
      category: "mineral"
    });
  }

  return recommendations;
}

/**
 * Generate default recommendations when AI is not available
 * @param {Object} assessment - Health assessment data
 * @returns {Object} Default recommendations
 */
function generateDefaultRecommendations(assessment) {
  return {
    summary: "Based on your health assessment, we've prepared some general wellness recommendations. For personalized medical advice, please consult with a healthcare professional.",
    recommendations: {
      lifestyle: [
        "Maintain a consistent sleep schedule of 7-9 hours per night",
        "Practice stress management techniques like meditation or deep breathing",
        "Stay hydrated by drinking at least 8 glasses of water daily"
      ],
      diet: [
        "Include a variety of colorful fruits and vegetables in your diet",
        "Choose whole grains over processed foods",
        "Limit processed and high-sugar foods"
      ],
      supplements: [
        "Consider a high-quality multivitamin (consult your doctor first)",
        "Discuss vitamin D supplementation with your healthcare provider"
      ],
      exercise: [
        "Aim for at least 150 minutes of moderate exercise per week",
        "Include both cardiovascular and strength training activities",
        "Start slowly and gradually increase intensity"
      ],
      mental_health: [
        "Practice mindfulness or meditation regularly",
        "Maintain social connections with family and friends",
        "Consider speaking with a counselor if feeling overwhelmed"
      ],
      medical: [
        "Schedule regular check-ups with your healthcare provider",
        "Discuss your health assessment results with your doctor",
        "Stay up to date with recommended health screenings"
      ]
    },
    priority_areas: ["Sleep Quality", "Nutrition", "Regular Exercise"],
    confidence: 0.6
  };
}

module.exports = {
  generateAIRecommendations,
  generateChatbotResponse,
  generateSupplementRecommendations,
  generateDefaultRecommendations,
  initializeAIClients
};