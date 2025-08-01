import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';

interface Topic {
    _id: string;
    name: string;
}

interface AdminTopicsState {
    list: Topic[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AdminTopicsState = {
    list: [],
    status: 'idle',
    error: null,
};

export const fetchAdminTopics = createAsyncThunk('admin/fetchTopics', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/admin/topics'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const addAdminTopic = createAsyncThunk<Topic, string>('admin/addTopic', async (name, { rejectWithValue }) => {
    try { const response = await axiosInstance.post('/admin/topics', { name }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const deleteAdminTopic = createAsyncThunk<{ _id: string }, string>('admin/deleteTopic', async (topicId, { rejectWithValue }) => {
    try { const response = await axiosInstance.delete(`/admin/topics/${topicId}`); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const adminTopicsSlice = createSlice({
    name: 'adminTopics',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminTopics.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchAdminTopics.fulfilled, (state, action) => { state.status = 'succeeded'; state.list = action.payload; })
            .addCase(fetchAdminTopics.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            .addCase(addAdminTopic.fulfilled, (state, action) => { state.list.push(action.payload); })
            .addCase(deleteAdminTopic.fulfilled, (state, action) => { state.list = state.list.filter(topic => topic._id !== action.payload._id); });
    },
});

export default adminTopicsSlice.reducer;