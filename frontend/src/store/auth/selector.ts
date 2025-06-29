import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';
import type { Email, Password } from '../../models/Auth';
import isEmailValid from '../../utils/isEmailValid';

export const selectPassword = (state: RootState) => state.auth.password;


export const selectPasswordValidation = createSelector(
    [selectPassword],
    (password): Password => {
        if (password === '') {
            return { value: password, isValid: false, message: null };
        }
        if (password.length < 8) {
            return {
                value: password,
                isValid: false,
                message: 'Password must be at least 8 characters long',
            };
        }
        return { value: password, isValid: true, message: null };
    }
);

export const selectEmail = (state: RootState) => state.auth.email;

export const selectEmailValidation = createSelector(
    [selectEmail],
    (email): Email => {
        if (email === '') {
            return { value: email, isValid: false, message: null };
        }
        if (isEmailValid(email)) {
            return { value: email, isValid: true, message: null };
        }
        return {
            value: email,
            isValid: false,
            message: 'Please enter a valid email address',
        };
    }
);
