import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';
import { type Contribution } from '@/lib/types';

interface Transaction {
    _id: string;
    createdAt: string;
    type: 'Credit' | 'Withdrawal';
    category: 'Assignment' | 'Referral' | 'YouTube' | 'Payout' | 'Bonus';
    amount: number;
    status: 'Completed' | 'Pending' | 'Failed';
    description: string;
}

interface IncomeState {
    summary: any;
    transactions: Transaction[];
    contributions: Contribution[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IncomeState = {
    summary: {
        alerts: []
    },
    transactions: [],
    contributions: [],
    status: 'idle',
    error: null,
};

export const fetchIncomeData = createAsyncThunk('user/fetchIncomeData', async (_, { rejectWithValue }) => {
    try {
        const summaryPromise = axiosInstance.get('/user/income/summary');
        const transactionsPromise = axiosInstance.get('/user/income/transactions');
        const contributionsPromise = axiosInstance.get('/user/income/contributions');
        
        const [summaryRes, transactionsRes, contributionsRes] = await Promise.all([summaryPromise, transactionsPromise, contributionsPromise]);
        
        return {
            summary: summaryRes.data.data,
            transactions: transactionsRes.data.data,
            contributions: contributionsRes.data.data
        };
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const createContributionOrder = createAsyncThunk('user/createContributionOrder', async (percentage: number, { rejectWithValue }) => {
    try { const response = await axiosInstance.post('/user/income/contributions/create-order', { percentage }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const verifyContributionPayment = createAsyncThunk('user/verifyContributionPayment', async (paymentData: any, { dispatch, rejectWithValue }) => {
    try { 
        const response = await axiosInstance.post('/user/income/contributions/verify-payment', paymentData); 
        dispatch(fetchIncomeData());
        return response.data.data; 
    } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const incomeSlice = createSlice({
    name: 'userIncome',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchIncomeData.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchIncomeData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.summary = action.payload.summary;
                state.transactions = action.payload.transactions;
                state.contributions = action.payload.contributions;
            })
            .addCase(fetchIncomeData.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
    },
});

export default incomeSlice.reducer;