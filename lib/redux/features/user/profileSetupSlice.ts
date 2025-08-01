import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';

interface ProfileSetupState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProfileSetupState = {
    status: 'idle',
    error: null,
};

export const saveSelectedTopic = createAsyncThunk('user/saveTopic', async (topic: string, { rejectWithValue }) => {
    try { await axiosInstance.post('/user/profile-setup/topic', { topic }); } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const saveChannelName = createAsyncThunk('user/saveChannelName', async (channelName: string, { rejectWithValue }) => {
    try { await axiosInstance.post('/user/profile-setup/channel-name', { channelName }); } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const profileSetupSlice = createSlice({
    name: 'profileSetup',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveSelectedTopic.pending, (state) => { state.status = 'loading'; })
            .addCase(saveSelectedTopic.fulfilled, (state) => { state.status = 'succeeded'; })
            .addCase(saveSelectedTopic.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            .addCase(saveChannelName.pending, (state) => { state.status = 'loading'; })
            .addCase(saveChannelName.fulfilled, (state) => { state.status = 'succeeded'; })
            .addCase(saveChannelName.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
    },
});

export default profileSetupSlice.reducer;