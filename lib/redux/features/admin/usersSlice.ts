import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios';
import { type User } from '@/lib/types';

interface ComplianceData {
    dailyCompletion: number;
    monthlyCompletion: number;
    overallStatus: 'Good Standing' | 'At Risk' | 'Non-Compliant';
}

interface UsersState {
    users: User[];
    selectedUserProfile: any | null;
    complianceData: ComplianceData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UsersState = {
    users: [],
    selectedUserProfile: null,
    complianceData: null,
    status: 'idle',
    error: null,
};

interface FetchUsersPayload {
    search?: string;
    status?: string;
}

export const fetchUsers = createAsyncThunk<User[], FetchUsersPayload | void>('admin/fetchUsers', async (filters, { rejectWithValue }) => {
    try { const response = await axiosInstance.get('/admin/users', { params: filters || {} }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const fetchUserById = createAsyncThunk<User, string>('admin/fetchUserById', async (userId, { rejectWithValue }) => {
    try { const response = await axiosInstance.get(`/admin/users/${userId}`); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const suspendUser = createAsyncThunk<User, { userId: string; reason: string; suspend: boolean }>('admin/suspendUser', async (payload, { rejectWithValue }) => {
    const { userId, ...data } = payload;
    try { const response = await axiosInstance.patch(`/admin/users/suspend/${userId}`, data); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const approveYoutube = createAsyncThunk<User, { userId: string; status: 'Verified' | 'Declined' }>('admin/approveYoutube', async (payload, { rejectWithValue }) => {
    const { userId, status } = payload;
    try { const response = await axiosInstance.patch(`/admin/users/youtube-status/${userId}`, { status }); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const updateUserDetails = createAsyncThunk<User, Partial<User> & { _id: string }>('admin/updateUserDetails', async (userData, { rejectWithValue }) => {
    const { _id, ...data } = userData;
    try { const response = await axiosInstance.patch(`/admin/users/${_id}`, data); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const resetUserPassword = createAsyncThunk<void, string>('admin/resetUserPassword', async (userId, { rejectWithValue }) => {
    try { await axiosInstance.post(`/admin/users/reset-password/${userId}`); } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const fetchUserCompliance = createAsyncThunk<ComplianceData, string>('admin/fetchUserCompliance', async (userId, { rejectWithValue }) => {
    try { const response = await axiosInstance.get(`/admin/users/${userId}/compliance`); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});
export const fetchUserDetailsForAdmin = createAsyncThunk<any, string>('admin/fetchUserDetails', async (userId, { rejectWithValue }) => {
    try { const response = await axiosInstance.get(`/admin/users/${userId}/details`); return response.data.data; } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
});

const usersSlice = createSlice({
    name: 'adminUsers',
    initialState,
    reducers: {
        clearSelectedUser: (state) => {
            state.selectedUserProfile = null;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        const updateUserInState = (state: UsersState, action: { payload: User }) => {
            const index = state.users.findIndex(user => user._id === action.payload._id);
            if (index !== -1) {
                state.users[index] = { ...state.users[index], ...action.payload };
            }
            if (state.selectedUserProfile?.profile?._id === action.payload._id) {
                state.selectedUserProfile.profile = { ...state.selectedUserProfile.profile, ...action.payload };
            }
        };
        builder
            .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchUsers.fulfilled, (state, action) => { state.status = 'succeeded'; state.users = action.payload; })
            .addCase(fetchUsers.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            
            .addCase(fetchUserCompliance.pending, (state) => { state.status = 'loading'; state.complianceData = null; })
            .addCase(fetchUserCompliance.fulfilled, (state, action) => { state.status = 'succeeded'; state.complianceData = action.payload; })
            
            .addCase(fetchUserDetailsForAdmin.pending, (state) => { state.status = 'loading'; state.selectedUserProfile = null; })
            .addCase(fetchUserDetailsForAdmin.fulfilled, (state, action) => { state.status = 'succeeded'; state.selectedUserProfile = action.payload; })
            .addCase(fetchUserDetailsForAdmin.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            
            .addCase(suspendUser.fulfilled, updateUserInState)
            .addCase(approveYoutube.fulfilled, updateUserInState)
            .addCase(updateUserDetails.fulfilled, updateUserInState);
    },
});

export const { clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;