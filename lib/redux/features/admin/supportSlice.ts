import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';
import { type SupportTicket } from '@/lib/types';

interface AdminSupportState {
    tickets: SupportTicket[];
    selectedTicket: SupportTicket | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AdminSupportState = {
    tickets: [],
    selectedTicket: null,
    status: 'idle',
    error: null,
};

export const fetchTickets = createAsyncThunk('admin/fetchTickets', async (status: string, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/admin/support', { params: { status } }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const fetchTicketById = createAsyncThunk('admin/fetchTicketById', async (ticketId: string, { rejectWithValue }) => {
    try { const response = await axiosInstance.get(`/admin/support/${ticketId}`); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const addTicketResponse = createAsyncThunk('admin/addResponse', async ({ ticketId, message }: { ticketId: string; message: string }, { rejectWithValue }) => {
    try { const response = await axiosInstance.post(`/admin/support/${ticketId}/respond`, { message }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const adminSupportSlice = createSlice({
    name: 'adminSupport',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchTickets.fulfilled, (state, action) => { state.status = 'succeeded'; state.tickets = action.payload; })
            .addCase(fetchTickets.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            .addCase(fetchTicketById.fulfilled, (state, action) => { state.selectedTicket = action.payload; })
            .addCase(addTicketResponse.fulfilled, (state, action) => {
                state.selectedTicket = action.payload;
                const index = state.tickets.findIndex(t => t._id === action.payload._id);
                if (index !== -1) { state.tickets[index].status = action.payload.status; }
            });
    },
});

export default adminSupportSlice.reducer;