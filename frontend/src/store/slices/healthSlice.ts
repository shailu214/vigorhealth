import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HealthData {
  personalInfo: {
    name: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    bmi?: number;
  };
  bloodWork: {
    hemoglobin?: number;
    rbc?: number;
    wbc?: number;
    platelets?: number;
    cholesterol?: number;
    hdl?: number;
    ldl?: number;
    triglycerides?: number;
    glucose?: number;
    hba1c?: number;
    [key: string]: any;
  };
  lifestyle: {
    diet: string;
    exercise: string;
    sleep: number;
    stress: string;
    smoking: boolean;
    alcohol: string;
    hydration: number;
  };
  mentalHealth: {
    mood: string;
    anxiety: string;
    depression: string;
    fatigue: string;
    energy: string;
  };
  healthScore?: number;
  riskFactors?: string[];
  recommendations?: {
    lifestyle: string[];
    diet: string[];
    supplements: string[];
    medical: string[];
  };
}

interface HealthState {
  currentAssessment: HealthData | null;
  previousAssessments: HealthData[];
  isLoading: boolean;
  error: string | null;
  reportUrl: string | null;
}

const initialState: HealthState = {
  currentAssessment: null,
  previousAssessments: [],
  isLoading: false,
  error: null,
  reportUrl: null,
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    setCurrentAssessment: (state, action: PayloadAction<HealthData>) => {
      state.currentAssessment = action.payload;
    },
    updateCurrentAssessment: (state, action: PayloadAction<Partial<HealthData>>) => {
      if (state.currentAssessment) {
        state.currentAssessment = { ...state.currentAssessment, ...action.payload };
      }
    },
    addPreviousAssessment: (state, action: PayloadAction<HealthData>) => {
      state.previousAssessments.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setReportUrl: (state, action: PayloadAction<string>) => {
      state.reportUrl = action.payload;
    },
    clearCurrentAssessment: (state) => {
      state.currentAssessment = null;
      state.reportUrl = null;
    },
  },
});

export const {
  setCurrentAssessment,
  updateCurrentAssessment,
  addPreviousAssessment,
  setLoading,
  setError,
  setReportUrl,
  clearCurrentAssessment,
} = healthSlice.actions;

export default healthSlice.reducer;