import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';

interface ComplianceRecord {
    _id: string;
    createdAt: string;
    type: string;
    status: 'Pass' | 'Warning' | 'Fail';
    severity: 'info' | 'warning' | 'error';
    details: string;
    actionTaken: string;
}

interface ComplianceState {
    records: ComplianceRecord[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ComplianceState = {
    records: [],
    status: 'idle',
    error: null,
};

export const fetchComplianceHistory = createAsyncThunk('user/fetchComplianceHistory', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/user/compliance');
        return response.data.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const complianceSlice = createSlice({
    name: 'userCompliance',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComplianceHistory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchComplianceHistory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.records = action.payload;
            })
            .addCase(fetchComplianceHistory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default complianceSlice.reducer;