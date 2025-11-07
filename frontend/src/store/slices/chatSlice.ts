import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  currentStep: string;
  userProfile: {
    name?: string;
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
  };
  bloodWork: Record<string, any>;
  lifestyle: Record<string, any>;
  mentalHealth: Record<string, any>;
  recommendations: {
    summary?: string;
    lifestyle?: string[];
    supplements?: string[];
    products?: any[];
  };
  isAssessmentComplete: boolean;
}

const initialState: ChatState = {
  messages: [],
  isTyping: false,
  currentStep: 'welcome',
  userProfile: {},
  bloodWork: {},
  lifestyle: {},
  mentalHealth: {},
  recommendations: {},
  isAssessmentComplete: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Omit<Message, 'id' | 'timestamp'>>) => {
      const message: Message = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      state.messages.push(message);
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<string>) => {
      state.currentStep = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<ChatState['userProfile']>>) => {
      state.userProfile = { ...state.userProfile, ...action.payload };
    },
    updateBloodWork: (state, action: PayloadAction<Record<string, any>>) => {
      state.bloodWork = { ...state.bloodWork, ...action.payload };
    },
    updateLifestyle: (state, action: PayloadAction<Record<string, any>>) => {
      state.lifestyle = { ...state.lifestyle, ...action.payload };
    },
    updateMentalHealth: (state, action: PayloadAction<Record<string, any>>) => {
      state.mentalHealth = { ...state.mentalHealth, ...action.payload };
    },
    setRecommendations: (state, action: PayloadAction<ChatState['recommendations']>) => {
      state.recommendations = action.payload;
    },
    setAssessmentComplete: (state, action: PayloadAction<boolean>) => {
      state.isAssessmentComplete = action.payload;
    },
    resetChat: (state) => {
      return initialState;
    },
  },
});

export const {
  addMessage,
  setTyping,
  setCurrentStep,
  updateUserProfile,
  updateBloodWork,
  updateLifestyle,
  updateMentalHealth,
  setRecommendations,
  setAssessmentComplete,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;