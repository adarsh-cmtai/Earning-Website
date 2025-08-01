import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';
import { type AiVideo, type AssignmentBatch, type NonCompliantUser } from '@/lib/types';
import { AppDispatch } from '@/lib/redux/store';

interface TechnicianState {
    videos: AiVideo[];
    assignments: AssignmentBatch[];
    nonCompliantUsers: NonCompliantUser[] | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TechnicianState = {
    videos: [],
    assignments: [],
    nonCompliantUsers: null,
    status: 'idle',
    error: null,
};

interface LinkPayload {
    url: string;
    type: 'Short' | 'Long';
}

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

export const fetchAssignmentBatches = createAsyncThunk<AssignmentBatch[]>('admin/fetchAssignmentBatches', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/admin/technician/assignments'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const uploadAssignmentLinks = createAsyncThunk<AssignmentBatch, { date: string, links: LinkPayload[] }>('admin/uploadAssignmentLinks', async (payload, { rejectWithValue }) => {
    try { const response = await axiosInstance.post('/admin/technician/assignments/upload', payload); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
})
export const uploadAssignmentCsv = createAsyncThunk<AssignmentBatch, FormData>('admin/uploadAssignmentCsv', async (formData, { rejectWithValue }) => {
    try { const response = await axiosInstance.post('/admin/technician/assignments/upload-csv', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const distributeAssignments = createAsyncThunk<AssignmentBatch, string>('admin/distributeAssignments', async (batchId, { rejectWithValue }) => {
    try { const response = await axiosInstance.post(`/admin/technician/assignments/${batchId}/distribute`); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const fetchNonCompliantUsers = createAsyncThunk<NonCompliantUser[], string>('admin/fetchNonCompliantUsers', async (batchId, { rejectWithValue }) => {
    try { const response = await axiosInstance.get(`/admin/technician/assignments/${batchId}/non-compliant`); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
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
            .addCase(deleteAiVideo.fulfilled, (state, action) => { state.videos = state.videos.filter(video => video._id !== action.payload._id); })

            .addCase(fetchAssignmentBatches.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchAssignmentBatches.fulfilled, (state, action) => { state.status = 'succeeded'; state.assignments = action.payload; })
            .addCase(fetchAssignmentBatches.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            .addCase(uploadAssignmentLinks.fulfilled, (state, action) => { state.assignments.unshift(action.payload); })
            .addCase(uploadAssignmentCsv.fulfilled, (state, action) => { state.assignments.unshift(action.payload); })
            .addCase(distributeAssignments.fulfilled, (state, action) => {
                const index = state.assignments.findIndex(a => a._id === action.payload._id);
                if (index !== -1) { state.assignments[index] = action.payload; }
            })
            
            .addCase(fetchNonCompliantUsers.pending, (state) => { state.status = 'loading'; state.nonCompliantUsers = null; })
            .addCase(fetchNonCompliantUsers.fulfilled, (state, action) => { state.status = 'succeeded'; state.nonCompliantUsers = action.payload; })
            .addCase(fetchNonCompliantUsers.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
    },
});

export default technicianSlice.reducer;