import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';

interface Topic {
    _id: string;
    name: string;
}

interface TopicsState {
    list: Topic[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TopicsState = {
    list: [],
    status: 'idle',
    error: null,
};

export const fetchTopics = createAsyncThunk('topics/fetchTopics', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/user/topics');
        return response.data.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const topicsSlice = createSlice({
    name: 'topics',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopics.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchTopics.fulfilled, (state, action) => { state.status = 'succeeded'; state.list = action.payload; })
            .addCase(fetchTopics.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
    },
});

export default topicsSlice.reducer;