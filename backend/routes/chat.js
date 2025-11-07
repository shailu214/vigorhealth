const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const { generateChatbotResponse } = require('../services/aiService');
const Config = require('../models/Config');

const router = express.Router();

// @route   POST /api/chat
// @desc    Simple chat endpoint for ChatWidget
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Get current API configuration
    let config;
    try {
      config = await Config.findOne({ type: 'ai_providers' });
    } catch (error) {
      // If no config found, use default response
      return res.json({
        success: true,
        response: "I'm a health assistant AI. How can I help you with your health and wellness questions today? Please note that my responses are for informational purposes only and should not replace professional medical advice."
      });
    }

    if (!config) {
      return res.json({
        success: true,
        response: "I'm a health assistant AI. How can I help you with your health and wellness questions today? Please note that my responses are for informational purposes only and should not replace professional medical advice."
      });
    }

    // Generate AI response using configured provider
    const botResponse = await generateChatbotResponse(
      [{ role: 'user', content: message }],
      'chat',
      { message, sessionId, config: config.config }
    );

    res.json({
      success: true,
      response: botResponse.message || botResponse,
      provider: config.config.system?.defaultProvider || 'default'
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.json({
      success: true,
      response: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment. If you have urgent health concerns, please consult with a healthcare professional."
    });
  }
});

// @route   POST /api/chat/message
// @desc    Send message to chatbot and get response (Assessment Flow)
// @access  Public
router.post('/message', optionalAuth, async (req, res) => {
  try {
    const { message, sessionId, currentStep, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Generate AI response
    const botResponse = await generateChatbotResponse(
      conversationHistory || [],
      currentStep || 'welcome',
      { message, sessionId }
    );

    res.json({
      success: true,
      message: 'Chatbot response generated',
      data: {
        response: botResponse.message,
        timestamp: botResponse.timestamp,
        model: botResponse.model,
        nextStep: determineNextStep(currentStep, message)
      }
    });

  } catch (error) {
    console.error('Chatbot message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating chatbot response'
    });
  }
});

// @route   GET /api/chat/conversation/:sessionId
// @desc    Get conversation history
// @access  Public
router.get('/conversation/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;

    // In a real implementation, you'd fetch from database
    // For now, return empty conversation
    res.json({
      success: true,
      data: {
        sessionId,
        messages: [],
        currentStep: 'welcome'
      }
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving conversation'
    });
  }
});

/**
 * Determine the next step in the conversation flow
 * @param {string} currentStep - Current conversation step
 * @param {string} message - User's message
 * @returns {string} - Next step
 */
function determineNextStep(currentStep, message) {
  const stepFlow = {
    welcome: 'personal_info',
    personal_info: 'blood_work_choice',
    blood_work_choice: 'blood_work_data',
    blood_work_data: 'lifestyle',
    lifestyle: 'mental_health',
    mental_health: 'analysis',
    analysis: 'recommendations',
    recommendations: 'complete'
  };

  return stepFlow[currentStep] || currentStep;
}

module.exports = router;