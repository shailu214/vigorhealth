import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Modal {
  id: string;
  type: 'gdpr' | 'upload' | 'report' | 'confirmation';
  title: string;
  content?: string;
  isOpen: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  modals: Modal[];
  notifications: Notification[];
  isLoading: boolean;
  loadingMessage: string;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  gdprConsent: boolean;
}

const initialState: UIState = {
  modals: [],
  notifications: [],
  isLoading: false,
  loadingMessage: '',
  sidebarOpen: false,
  theme: 'light',
  gdprConsent: localStorage.getItem('gdprConsent') === 'true',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<Omit<Modal, 'id' | 'isOpen'>>) => {
      const modal: Modal = {
        ...action.payload,
        id: Date.now().toString(),
        isOpen: true,
      };
      state.modals.push(modal);
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter(modal => modal.id !== action.payload);
    },
    closeAllModals: (state) => {
      state.modals = [];
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLoadingMessage: (state, action: PayloadAction<string>) => {
      state.loadingMessage = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setGdprConsent: (state, action: PayloadAction<boolean>) => {
      state.gdprConsent = action.payload;
      localStorage.setItem('gdprConsent', action.payload.toString());
    },
  },
});

export const {
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  setLoading,
  setLoadingMessage,
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setGdprConsent,
} = uiSlice.actions;

export default uiSlice.reducer;