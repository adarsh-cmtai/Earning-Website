import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';
import { type AuditLog, type ErrorLog } from '@/lib/types';

interface SecurityState {
    auditLogs: AuditLog[];
    errorLogs: ErrorLog[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SecurityState = {
    auditLogs: [],
    errorLogs: [],
    status: 'idle',
    error: null,
};

export const fetchAuditLogs = createAsyncThunk<AuditLog[]>('admin/fetchAuditLogs', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/admin/security/audit-logs'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const fetchErrorLogs = createAsyncThunk<ErrorLog[]>('admin/fetchErrorLogs', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/admin/security/error-logs'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});


const securitySlice = createSlice({
    name: 'adminSecurity',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuditLogs.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchAuditLogs.fulfilled, (state, action) => { state.status = 'succeeded'; state.auditLogs = action.payload; })
            .addCase(fetchAuditLogs.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })

            .addCase(fetchErrorLogs.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchErrorLogs.fulfilled, (state, action) => { state.status = 'succeeded'; state.errorLogs = action.payload; })
            .addCase(fetchErrorLogs.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
    },
});

export default securitySlice.reducer;