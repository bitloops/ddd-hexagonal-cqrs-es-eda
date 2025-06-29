import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthMessage } from '../../models/Auth';
import type { User } from '../../models/User';
import IamRepository from '../../infra/repositories/iam';
import IamService from '../../infra/services/IamService';
import { AUTH_MESSAGE_DURATION } from '../../constants';
import { EventBus, Events } from '../../Events';

const iamService = new IamService();
const iamRepository = new IamRepository(iamService);

interface AuthState {
    user: User | null;
    email: string;
    password: string;
    authMessage: AuthMessage | null;
    isProcessing: boolean;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    email: '',
    password: '',
    authMessage: null,
    isProcessing: false,
    isAuthenticated: false
};


(() => console.log(initialState))()

export const registerWithEmailPassword = createAsyncThunk<
    void, // return type
    { email: string; password: string; onSuccessCallback: () => void }>(
        'auth/registerWithEmailPassword',
        async ({ email, password, onSuccessCallback }, { rejectWithValue, dispatch }) => {
            dispatch(setIsProcessing(true));
            try {
                await iamRepository.registerWithEmailPassword(email, password);
                dispatch(setAuthMessage({
                    type: 'success',
                    message: 'Registered successfully!',
                    startAt: Date.now(),
                    duration: AUTH_MESSAGE_DURATION,
                }));
                onSuccessCallback();
            } catch (error) {
                dispatch(setAuthMessage({
                    type: 'error',
                    message: (error as Error).message,
                    startAt: Date.now(),
                    duration: AUTH_MESSAGE_DURATION,
                }));
                return rejectWithValue((error as Error).message);
            } finally {
                dispatch(setIsProcessing(false));
            }
        }
    );

export const loginWithEmailPassword = createAsyncThunk<
    void,
    { email: string; password: string; onSuccessCallback: () => void }
>(
    'auth/loginWithEmailPassword',
    async ({ email, password, onSuccessCallback }, { dispatch, rejectWithValue }) => {
        dispatch(setIsProcessing(true));
        try {
            const user = await iamRepository.loginWithEmailPassword(email, password);
            dispatch(setUser(user));
            dispatch(setIsAuthenticated(true));
            dispatch(setAuthMessage({
                type: 'success',
                message: 'Login successful!',
                startAt: Date.now(),
                duration: AUTH_MESSAGE_DURATION,
            }));
            onSuccessCallback();
        } catch (error) {
            dispatch(setAuthMessage({
                type: 'error',
                message: (error as Error).message,
                startAt: Date.now(),
                duration: AUTH_MESSAGE_DURATION,
            }));
            return rejectWithValue((error as Error).message);
        } finally {
            dispatch(setIsProcessing(false));
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthMessage(state, action: PayloadAction<AuthMessage | null>) {
            state.authMessage = action.payload;
        },
        setIsProcessing(state, action: PayloadAction<boolean>) {
            state.isProcessing = action.payload;
        },
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },

        setEmail(state, action: PayloadAction<string>) {
            state.email = action.payload;
        },
        setPassword(state, action: PayloadAction<string>) {
            state.password = action.payload;
        },
        setIsAuthenticated(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
        },
        logout(state) {
            iamRepository.logout();
            state.user = null;
            state.email = '';
            state.password = '';
            state.authMessage = null;
            state.isProcessing = false;
            state.isAuthenticated = false;
        },
        init(state) {
            const user = iamRepository.getUser();
            state.user = user;
            state.isAuthenticated = iamRepository.getUser() ? true : false;
            EventBus.emit(Events.AUTH_CHANGED, user);
            if (user) {
                iamRepository.setUser(user);
            } else iamRepository.logout();
        }
    }
});

export const {
    setAuthMessage,
    setIsProcessing,
    setUser,
    setEmail,
    setPassword,
    setIsAuthenticated,
    logout,
    init
} = authSlice.actions;

export default authSlice.reducer;