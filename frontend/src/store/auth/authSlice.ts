import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { EventBus, Events } from '../../Events';
import IamRepository from '../../infra/repositories/iam';
import IamService from '../../infra/services/IamService';
import type { AuthMessage } from '../../models/Auth';
import type { User } from '../../models/User';
import { AUTH_MESSAGE_DURATION } from '../../constants';

const iamService = new IamService();
const iamRepository = new IamRepository(iamService);

interface AuthState {
  user: User | null;
  authMessage: AuthMessage | null;
  isProcessing: boolean;
  isInitialising: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  authMessage: null,
  isProcessing: false,
  isInitialising: true,
  isAuthenticated: false,
};

export const initialiseAuthentication = createAsyncThunk<User | null>(
  'auth/initialise',
  () => iamRepository.getUser(),
);

export const login = createAsyncThunk<void>('auth/login', () => iamRepository.login());

export const register = createAsyncThunk<void>('auth/register', () =>
  iamRepository.register(),
);

export const completeLogin = createAsyncThunk<User>('auth/completeLogin', () =>
  iamRepository.completeLogin(),
);

export const logout = createAsyncThunk<void>('auth/logout', () => iamRepository.logout());

export const completeLogout = createAsyncThunk<void>('auth/completeLogout', () =>
  iamRepository.completeLogout(),
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticationChanged(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
      state.isInitialising = false;
      state.isProcessing = false;
    },
    clearAuthMessage(state) {
      state.authMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initialiseAuthentication.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = action.payload !== null;
        state.isInitialising = false;
      })
      .addCase(initialiseAuthentication.rejected, (state, action) => {
        state.isInitialising = false;
        state.authMessage = errorMessage(action.error.message);
      })
      .addCase(login.pending, processing)
      .addCase(register.pending, processing)
      .addCase(completeLogin.pending, processing)
      .addCase(logout.pending, processing)
      .addCase(completeLogout.pending, processing)
      .addCase(completeLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isProcessing = false;
        state.authMessage = null;
      })
      .addCase(completeLogout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isProcessing = false;
        state.authMessage = null;
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action: { error?: { message?: string } }) => {
          state.isProcessing = false;
          state.isInitialising = false;
          state.authMessage = errorMessage(action.error?.message);
        },
      );
  },
});

function processing(state: AuthState): void {
  state.isProcessing = true;
  state.authMessage = null;
}

function errorMessage(message?: string): AuthMessage {
  return {
    type: 'error',
    message: message || 'Authentication failed',
    startAt: Date.now(),
    duration: AUTH_MESSAGE_DURATION,
  };
}

export const { authenticationChanged, clearAuthMessage } = authSlice.actions;

export const observeAuthentication = (
  listener: (user: User | null) => void,
): (() => void) => {
  EventBus.subscribe(Events.AUTH_CHANGED, listener);
  return () => EventBus.unsubscribe(Events.AUTH_CHANGED, listener);
};

export default authSlice.reducer;
