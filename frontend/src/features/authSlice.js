import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = {
                ...action.payload,
                hasCompletedQuestionnaire: action.payload.hasCompletedQuestionnaire || false
            };
            state.loading = false;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
        markQuestionnaireCompleted: (state) => {
            if (state.user) {
                state.user.hasCompletedQuestionnaire = true;
            }
        },
        updateUser: (state, action) => {
            if (state.user) {
                state.user = {
                    ...state.user,
                    ...action.payload
                };
            }
        }
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    markQuestionnaireCompleted,
    updateUser
} = authSlice.actions;

export default authSlice.reducer;