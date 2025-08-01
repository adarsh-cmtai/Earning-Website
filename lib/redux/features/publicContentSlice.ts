import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axios';
import { type FaqItem } from '@/lib/types';

interface PublicContentState {
    faq: FaqItem[];
    terms: string;
    privacy: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PublicContentState = {
    faq: [],
    terms: '',
    privacy: '',
    status: 'idle',
    error: null,
};

export const fetchPublicContent = createAsyncThunk('public/fetchContent', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/user/public-content'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const publicContentSlice = createSlice({
    name: 'publicContent',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicContent.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchPublicContent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.faq = action.payload.faq;
                state.terms = action.payload.terms;
                state.privacy = action.payload.privacy;
            })
            .addCase(fetchPublicContent.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
    },
});

export default publicContentSlice.reducer;