import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';
import { type AiVideo } from '@/lib/types';
import { AppDispatch } from '@/lib/redux/store';

interface TechnicianState {
    videos: AiVideo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TechnicianState = {
    videos: [],
    status: 'idle',
    error: null,
};

export const fetchAiVideos = createAsyncThunk<AiVideo[]>('admin/fetchAiVideos', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/admin/technician/ai-videos'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const uploadAiVideo = createAsyncThunk<AiVideo, FormData>('admin/uploadAiVideo', async (formData, { rejectWithValue }) => {
    try { const response = await axiosInstance.post('/admin/technician/ai-videos/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const deleteAiVideo = createAsyncThunk<{ _id: string }, string>('admin/deleteAiVideo', async (videoId, { rejectWithValue }) => {
    try { const response = await axiosInstance.delete(`/admin/technician/ai-videos/${videoId}`); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const allocateAiVideos = createAsyncThunk<any, void, { dispatch: AppDispatch }>('admin/allocateAiVideos', async (_, { dispatch, rejectWithValue }) => {
    try { 
        const response = await axiosInstance.post('/admin/technician/ai-videos/allocate'); 
        dispatch(fetchAiVideos());
        return response.data;
    } catch (error: any) { 
        return rejectWithValue(error.response?.data?.message); 
    }
});

export const assignLinks = createAsyncThunk<any, { userId: string, date: string, shortLinks: string[], longLinks: string[] }>('admin/assignLinks', async (payload, { rejectWithValue }) => {
    try { const response = await axiosInstance.post('/admin/technician/assignments/assign', payload); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const assignLinksCsv = createAsyncThunk<any, FormData>('admin/assignLinksCsv', async (payload, { rejectWithValue }) => {
    try { const response = await axiosInstance.post('/admin/technician/assignments/assign-csv', payload, { headers: { 'Content-Type': 'multipart/form-data' } }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const technicianSlice = createSlice({
    name: 'adminTechnician',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAiVideos.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchAiVideos.fulfilled, (state, action) => { state.status = 'succeeded'; state.videos = action.payload; })
            .addCase(fetchAiVideos.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            .addCase(uploadAiVideo.fulfilled, (state, action) => { state.videos.unshift(action.payload); })
            .addCase(deleteAiVideo.fulfilled, (state, action) => { state.videos = state.videos.filter(video => video._id !== action.payload._id); });
    },
});

export default technicianSlice.reducer;
