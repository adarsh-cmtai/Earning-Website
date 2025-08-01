import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';
import { type FaqItem, type TutorialItem } from '@/lib/types';

interface ContentState {
    terms: string;
    privacy: string;
    faq: FaqItem[];
    tutorials: TutorialItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ContentState = {
    terms: '',
    privacy: '',
    faq: [],
    tutorials: [],
    status: 'idle',
    error: null,
};

export const fetchAllContent = createAsyncThunk('admin/fetchAllContent', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/admin/content'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const updateStaticContent = createAsyncThunk('admin/updateStaticContent', async ({ contentType, content }: { contentType: 'terms' | 'privacy', content: string }, { rejectWithValue }) => {
    try { const response = await axiosInstance.post('/admin/content/update', { contentType, content }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const addFaq = createAsyncThunk('admin/addFaq', async (faq: Omit<FaqItem, '_id'>, { rejectWithValue }) => {
    try { const response = await axiosInstance.post('/admin/content/faq/add', faq); return response.data.data.content; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const updateFaq = createAsyncThunk('admin/updateFaq', async (faq: FaqItem, { rejectWithValue }) => {
    try { const response = await axiosInstance.patch(`/admin/content/faq/${faq._id}`, faq); return response.data.data.content; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const deleteFaq = createAsyncThunk('admin/deleteFaq', async (faqId: string, { rejectWithValue }) => {
    try { await axiosInstance.delete(`/admin/content/faq/${faqId}`); return faqId; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const addTutorial = createAsyncThunk('admin/addTutorial', async (tutorial: Omit<TutorialItem, '_id'>, { rejectWithValue }) => {
    try { const response = await axiosInstance.post('/admin/content/tutorial/add', tutorial); return response.data.data.content; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const updateTutorial = createAsyncThunk('admin/updateTutorial', async (tutorial: TutorialItem, { rejectWithValue }) => {
    try { const response = await axiosInstance.patch(`/admin/content/tutorial/${tutorial._id}`, tutorial); return response.data.data.content; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const deleteTutorial = createAsyncThunk('admin/deleteTutorial', async (tutorialId: string, { rejectWithValue }) => {
    try { await axiosInstance.delete(`/admin/content/tutorial/${tutorialId}`); return tutorialId; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const contentSlice = createSlice({
    name: 'adminContent',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllContent.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchAllContent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.terms = action.payload.terms;
                state.privacy = action.payload.privacy;
                state.faq = action.payload.faq;
                state.tutorials = action.payload.tutorial;
            })
            .addCase(fetchAllContent.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            
            .addCase(updateStaticContent.fulfilled, (state, action) => {
                const { contentType, content } = action.payload;
                if (contentType === 'terms') state.terms = content;
                if (contentType === 'privacy') state.privacy = content;
            })
            
            .addCase(addFaq.fulfilled, (state, action) => { state.faq = action.payload; })
            .addCase(updateFaq.fulfilled, (state, action) => { state.faq = action.payload; })
            .addCase(deleteFaq.fulfilled, (state, action) => { state.faq = state.faq.filter(f => f._id !== action.payload); })

            .addCase(addTutorial.fulfilled, (state, action) => { state.tutorials = action.payload; })
            .addCase(updateTutorial.fulfilled, (state, action) => { state.tutorials = action.payload; })
            .addCase(deleteTutorial.fulfilled, (state, action) => { state.tutorials = state.tutorials.filter(t => t._id !== action.payload); });
    },
});

export default contentSlice.reducer;