import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';

interface ProfileState {
    data: any;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProfileState = {
    data: {
        notificationPreferences: {}
    },
    status: 'idle',
    error: null,
};

export const fetchProfileData = createAsyncThunk('user/fetchProfile', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/user/profile'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const updatePersonalDetails = createAsyncThunk('user/updatePersonal', async (data: { fullName: string, mobile: string }, { rejectWithValue }) => {
    try { const response = await axiosInstance.patch('/user/profile/personal', data); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const updatePaymentDetails = createAsyncThunk('user/updatePayment', async (data: { upiName: string, upiId: string }, { rejectWithValue }) => {
    try { const response = await axiosInstance.patch('/user/profile/payment', data); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const changePassword = createAsyncThunk('user/changePassword', async (data: any, { rejectWithValue }) => {
    try { await axiosInstance.post('/user/profile/change-password', data); } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const updateNotificationPreferences = createAsyncThunk('user/updateNotifications', async (data: any, { rejectWithValue }) => {
    try { const response = await axiosInstance.patch('/user/profile/notifications', data); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const logoutAllDevices = createAsyncThunk('user/logoutAll', async (_, { rejectWithValue }) => {
    try { await axiosInstance.post('/user/profile/logout-all'); } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const profileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfileData.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchProfileData.fulfilled, (state, action) => { state.status = 'succeeded'; state.data = action.payload; })
            .addCase(fetchProfileData.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            .addCase(updatePersonalDetails.fulfilled, (state, action) => {
                if(state.data) {
                    state.data.fullName = action.payload.fullName;
                    state.data.mobile = action.payload.mobile;
                }
            })
            .addCase(updatePaymentDetails.fulfilled, (state, action) => {
                if(state.data) {
                    state.data.upiName = action.payload.upiName;
                    state.data.upiId = action.payload.upiId;
                }
            })
            .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
                if (state.data) {
                    state.data.notificationPreferences = action.payload.notificationPreferences;
                }
            });
    },
});

export default profileSlice.reducer;