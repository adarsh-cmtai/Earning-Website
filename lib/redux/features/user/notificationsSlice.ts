import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';

interface Notification {
    _id: string;
    type: string;
    title: string;
    description: string;
    createdAt: string;
    read: boolean;
}

interface NotificationsState {
    list: Notification[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: NotificationsState = {
    list: [],
    status: 'idle',
    error: null,
};

export const fetchNotifications = createAsyncThunk('user/fetchNotifications', async (_, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/user/notifications'); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const markNotificationAsRead = createAsyncThunk('user/markAsRead', async (notificationId: string, { rejectWithValue }) => {
    try { const response = await axiosInstance.post(`/user/notifications/${notificationId}/read`); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

export const markAllNotificationsAsRead = createAsyncThunk('user/markAllAsRead', async (_, { rejectWithValue }) => {
    try { await axiosInstance.post('/user/notifications/read-all'); return true; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const notificationsSlice = createSlice({
    name: 'userNotifications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchNotifications.fulfilled, (state, action) => { state.status = 'succeeded'; state.list = action.payload; })
            .addCase(fetchNotifications.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.list.findIndex(n => n._id === action.payload._id);
                if (index !== -1) { state.list[index].read = true; }
            })
            
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.list.forEach(n => { n.read = true; });
            });
    },
});

export default notificationsSlice.reducer;