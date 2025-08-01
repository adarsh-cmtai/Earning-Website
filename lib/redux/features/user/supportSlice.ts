import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';
import { type SupportTicket } from '@/lib/types';

interface SupportState {
    tickets: SupportTicket[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface TicketPayload {
    subject: string;
    category: string;
    message: string;
}

const initialState: SupportState = {
    tickets: [],
    status: 'idle',
    error: null,
};

export const createSupportTicket = createAsyncThunk('user/createTicket', async (payload: TicketPayload, { rejectWithValue }) => {
    try { const response = await axiosInstance.post('/user/support/tickets', payload); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const fetchUserTickets = createAsyncThunk('user/fetchTickets', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/user/support/tickets'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const supportSlice = createSlice({
    name: 'userSupport',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createSupportTicket.pending, (state) => { state.status = 'loading'; })
            .addCase(createSupportTicket.fulfilled, (state, action) => { state.status = 'succeeded'; state.tickets.unshift(action.payload); })
            .addCase(createSupportTicket.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            .addCase(fetchUserTickets.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchUserTickets.fulfilled, (state, action) => { state.status = 'succeeded'; state.tickets = action.payload; })
            .addCase(fetchUserTickets.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
    },
});

export default supportSlice.reducer;