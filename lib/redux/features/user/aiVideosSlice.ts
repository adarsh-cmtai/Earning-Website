import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';
import { type AiVideo } from '@/lib/types';

interface AiVideosState {
    assignedVideo: AiVideo | null;
    availableVideos: AiVideo[];
    videoHistory: AiVideo[];
    channelName: string;
    canDownload: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AiVideosState = {
    assignedVideo: null,
    availableVideos: [],
    videoHistory: [],
    channelName: '',
    canDownload: false,
    status: 'idle',
    error: null,
};

export const fetchAiVideosData = createAsyncThunk('user/fetchAiVideosData', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/user/ai-videos'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const markVideoAsDownloaded = createAsyncThunk('user/markVideoAsDownloaded', async (videoId: string, { dispatch, rejectWithValue }) => {
    try { 
        const response = await axiosInstance.post('/user/ai-videos/mark-downloaded', { videoId });
        dispatch(fetchAiVideosData());
        return response.data.data; 
    } catch (error: any) { 
        return rejectWithValue(error.response?.data?.message); 
    }
});

const aiVideosSlice = createSlice({
    name: 'userAiVideos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAiVideosData.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchAiVideosData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.assignedVideo = action.payload.assignedVideo;
                state.availableVideos = action.payload.availableVideos;
                state.videoHistory = action.payload.videoHistory;
                state.channelName = action.payload.channelName;
                state.canDownload = action.payload.canDownload;
            })
            .addCase(fetchAiVideosData.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
    },
});

export default aiVideosSlice.reducer;