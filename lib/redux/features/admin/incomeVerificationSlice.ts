import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';
import { type ManualIncomeSubmission } from '@/lib/types';

interface IncomeVerificationState {
    submissions: ManualIncomeSubmission[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IncomeVerificationState = {
    submissions: [],
    status: 'idle',
    error: null,
};

export const fetchSubmissions = createAsyncThunk('admin/fetchIncomeSubmissions', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/admin/income-verification/submissions'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const reviewSubmission = createAsyncThunk<ManualIncomeSubmission, { submissionId: string; status: 'Approved' | 'Declined'; comment?: string }>('admin/reviewIncomeSubmission', async (payload, { rejectWithValue }) => {
    const { submissionId, ...data } = payload;
    try { const response = await axiosInstance.post(`/admin/income-verification/submissions/${submissionId}/review`, data); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const incomeVerificationSlice = createSlice({
    name: 'adminIncomeVerification',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubmissions.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchSubmissions.fulfilled, (state, action) => { state.status = 'succeeded'; state.submissions = action.payload; })
            .addCase(fetchSubmissions.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            .addCase(reviewSubmission.fulfilled, (state, action) => {
                state.submissions = state.submissions.filter(s => s._id !== action.payload._id);
            });
    },
});

export default incomeVerificationSlice.reducer;