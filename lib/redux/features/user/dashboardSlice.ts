import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';

interface UserDashboardState {
    data: any;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserDashboardState = {
    data: {
        stats: {},
        userProfile: {},
        todaysAssignment: {},
        aiVideoForUpload: null,
    },
    status: 'idle',
    error: null,
};

export const fetchUserDashboardData = createAsyncThunk('user/fetchDashboardData', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/user/dashboard');
        return response.data.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const dashboardSlice = createSlice({
    name: 'userDashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDashboardData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserDashboardData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchUserDashboardData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default dashboardSlice.reducer;