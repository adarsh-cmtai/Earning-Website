import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';

interface DownlineState {
    data: any;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DownlineState = {
    data: {
        levels: []
    },
    status: 'idle',
    error: null,
};

export const fetchDownlineData = createAsyncThunk('user/fetchDownlineData', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/user/downline'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const uploadAnalyticsScreenshot = createAsyncThunk('user/uploadAnalyticsScreenshot', async (file: File, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('screenshot', file);
    try { const response = await axiosInstance.post('/user/downline/upload-analytics', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const submitManualIncome = createAsyncThunk('user/submitManualIncome', async (payload: FormData, { rejectWithValue }) => {
    try { const response = await axiosInstance.post('/user/downline/submit-manual-income', payload, { headers: { 'Content-Type': 'multipart/form-data' } }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const downlineSlice = createSlice({
    name: 'userDownline',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDownlineData.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchDownlineData.fulfilled, (state, action) => { state.status = 'succeeded'; state.data = action.payload; })
            .addCase(fetchDownlineData.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
    },
});

export default downlineSlice.reducer;