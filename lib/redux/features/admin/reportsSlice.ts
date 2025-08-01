import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';
import { DateRange } from 'react-day-picker';

interface ReportData {
    revenueData: any[];
    engagementData: any[];
    incomeDistributionData: any[];
    complianceData: any[];
}

interface ReportsState {
    data: ReportData;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface ExportPayload {
    reportName: string;
    formatType: string;
    dateRange?: DateRange;
}

const initialState: ReportsState = {
    data: { revenueData: [], engagementData: [], incomeDistributionData: [], complianceData: [], },
    status: 'idle',
    error: null,
};

export const fetchReportsData = createAsyncThunk<ReportData>('admin/fetchReportsData', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/admin/reports'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const exportReport = createAsyncThunk<{ downloadUrl: string }, ExportPayload>('admin/exportReport', async (payload, { rejectWithValue }) => {
    const { reportName, formatType, dateRange } = payload;
    try { 
        const response = await axiosInstance.post('/admin/reports/export', {
            reportName,
            formatType,
            from: dateRange?.from,
            to: dateRange?.to,
        });
        return response.data.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const reportsSlice = createSlice({
    name: 'adminReports',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReportsData.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchReportsData.fulfilled, (state, action) => { state.status = 'succeeded'; state.data = action.payload; })
            .addCase(fetchReportsData.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
    },
});

export default reportsSlice.reducer;