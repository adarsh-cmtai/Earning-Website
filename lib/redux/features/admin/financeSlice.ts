import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';
import { type UserIncomeProfile } from '@/lib/types';

interface FinanceState {
    profiles: UserIncomeProfile[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface FetchProfilesPayload {
    search?: string;
    contributionStatus?: string;
}

const initialState: FinanceState = { profiles: [], status: 'idle', error: null };

export const fetchIncomeProfiles = createAsyncThunk<UserIncomeProfile[], FetchProfilesPayload | void>('admin/fetchIncomeProfiles', async (filters, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/admin/finance/profiles', { params: filters || {} }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const updateIncomeStatus = createAsyncThunk<UserIncomeProfile, { userId: string; status: 'Active' | 'Suspended'; reason?: string }>('admin/updateIncomeStatus', async (payload, { rejectWithValue }) => {
    const { userId, ...data } = payload;
    try { const response = await axiosInstance.patch(`/admin/finance/update-status/${userId}`, data); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const processBulkPayout = createAsyncThunk<void, { userIds: string[], totalAmount: number }>('admin/processBulkPayout', async (payload, { rejectWithValue }) => {
    try { await axiosInstance.post('/admin/finance/bulk-payout', payload); } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const markAsPaid = createAsyncThunk<UserIncomeProfile, string>('admin/markAsPaid', async (userId, { rejectWithValue }) => {
    try { const response = await axiosInstance.post(`/admin/finance/contribution-paid/${userId}`); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const setContributionPercentage = createAsyncThunk<UserIncomeProfile, { userId: string; percentage: number }>('admin/setContributionPercentage', async (payload, { rejectWithValue }) => {
    const { userId, percentage } = payload;
    try { const response = await axiosInstance.post(`/admin/finance/set-contribution/${userId}`, { percentage }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const sendContributionAlert = createAsyncThunk<void, { userId: string; title: string; description: string }>('admin/sendContributionAlert', async (payload, { rejectWithValue }) => {
    const { userId, ...data } = payload;
    try { await axiosInstance.post(`/admin/alerts/send-user/${userId}`, data); } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const sendBulkContributionAlerts = createAsyncThunk<{ count: number }>('admin/sendBulkDueAlerts', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.post('/admin/finance/send-bulk-due-alerts'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const financeSlice = createSlice({
    name: 'adminFinance',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const updateProfileInState = (state: FinanceState, action: { payload: UserIncomeProfile }) => {
            const index = state.profiles.findIndex(p => p._id === action.payload._id);
            if (index !== -1) {
                state.profiles[index] = { ...state.profiles[index], ...action.payload };
            }
        };

        builder
            .addCase(fetchIncomeProfiles.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchIncomeProfiles.fulfilled, (state, action) => { state.status = 'succeeded'; state.profiles = action.payload; })
            .addCase(fetchIncomeProfiles.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            .addCase(updateIncomeStatus.fulfilled, updateProfileInState)
            .addCase(markAsPaid.fulfilled, updateProfileInState)
            .addCase(setContributionPercentage.fulfilled, updateProfileInState)
            .addCase(processBulkPayout.fulfilled, (state, action) => {
                const paidUserIds = action.meta.arg.userIds;
                state.profiles.forEach(profile => {
                    if (paidUserIds.includes(profile._id)) { profile.pendingPayout = 0; }
                });
            });
    },
});

export default financeSlice.reducer;
