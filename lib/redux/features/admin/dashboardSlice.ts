import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';

interface DashboardData {
    stats: any;
    alerts: any[];
    activities: any[];
    revenueData: any[];
}

interface DashboardState {
    data: Partial<DashboardData>;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DashboardState = {
    data: { stats: {}, alerts: [], activities: [], revenueData: [] },
    status: 'idle',
    error: null,
};

export const fetchDashboardData = createAsyncThunk<DashboardData>('admin/fetchDashboardData', async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data.data;
});

const dashboardSlice = createSlice({
    name: 'adminDashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchDashboardData.fulfilled, (state, action) => { state.status = 'succeeded'; state.data = action.payload; })
            .addCase(fetchDashboardData.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message ?? "Failed to fetch dashboard data."; });
    },
});

export default dashboardSlice.reducer;