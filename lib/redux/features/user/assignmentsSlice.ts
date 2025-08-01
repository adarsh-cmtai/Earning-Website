import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';
import { type AiVideo } from '@/lib/types';
import { AppDispatch } from '@/lib/redux/store';

interface Assignment {
    id: string;
    title: string;
    youtubeUrl: string;
    type: 'Short' | 'Long';
    status: 'completed' | 'pending' | 'in-progress';
    isCarryOver?: boolean;
}
interface CompletionReward { aiVideoUnlocked: boolean; assignedVideo: AiVideo | null; }

interface AssignmentsState {
    list: Assignment[];
    completedCount: number;
    totalCount: number;
    dailyReward: CompletionReward | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AssignmentsState = { list: [], completedCount: 0, totalCount: 0, dailyReward: null, status: 'idle', error: null };

export const fetchAssignments = createAsyncThunk('user/fetchAssignments', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/user/assignments'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const completeTask = createAsyncThunk('user/completeTask', async ({ link, isCarryOver }: { link: string, isCarryOver?: boolean }, { dispatch, rejectWithValue }) => {
    try { const response = await axiosInstance.post('/user/assignments/complete', { link, isCarryOver }); dispatch(fetchAssignments()); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const assignmentsSlice = createSlice({
    name: 'userAssignments',
    initialState,
    reducers: { clearDailyReward: (state) => { state.dailyReward = null; } },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssignments.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchAssignments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload.assignments;
                state.completedCount = action.payload.completedCount;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchAssignments.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            .addCase(completeTask.fulfilled, (state, action) => {
                const { reward } = action.payload;
                if (reward) { state.dailyReward = reward; }
            });
    },
});

export const { clearDailyReward } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;