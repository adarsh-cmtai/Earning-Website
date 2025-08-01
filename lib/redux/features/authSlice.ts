import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axios';

interface User {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: 'user' | 'admin';
  adminRole?: 'USER_MANAGER' | 'TECHNICIAN' | 'FINANCE' | 'CONTENT_MANAGER' | 'SUPER_ADMIN';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isOtpSent: boolean;
  isOtpVerified: boolean;
  isLoading: boolean;
  error: string | null;
}

interface SendOtpPayload {
  email: string;
  mobile: string;
}

interface VerifyOtpPayload {
  email: string;
  mobile: string;
  emailOtp: string;
  mobileOtp: string;
}

interface RegisterUserPayload {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  referralId: string;
  upiName?: string;
  upiId?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AdminRegistrationPayload {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  adminRole: 'USER_MANAGER' | 'TECHNICIAN' | 'FINANCE' | 'CONTENT_MANAGER' | 'SUPER_ADMIN';
}

interface VerifyAdminOtpPayload extends AdminRegistrationPayload {
  emailOtp: string;
  mobileOtp: string;
}

interface LoginSuccessPayload {
  user: User;
  accessToken: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isOtpSent: false,
  isOtpVerified: false,
  isLoading: true,
  error: null,
};

export const getCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/current-user');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Session expired.');
    }
  }
);

export const sendOtp = createAsyncThunk<any, SendOtpPayload, { rejectValue: string }>(
  'auth/sendOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/send-otp', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyOtp = createAsyncThunk<any, VerifyOtpPayload, { rejectValue: string }>(
  'auth/verifyOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/verify-otp', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const registerUser = createAsyncThunk<LoginSuccessPayload, RegisterUserPayload, { rejectValue: string }>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/register', userData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loginUser = createAsyncThunk<LoginSuccessPayload, LoginPayload, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/login', credentials);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const sendAdminOtp = createAsyncThunk<any, SendOtpPayload, { rejectValue: string }>(
  'auth/sendAdminOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admin-setup/send-otp', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyAndRegisterAdmin = createAsyncThunk<any, VerifyAdminOtpPayload, { rejectValue: string }>(
  'auth/verifyAndRegisterAdmin',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admin-setup/verify-and-register', payload);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/user/logout');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed.');
    }
  }
);

export const forgotPassword = createAsyncThunk<any, string, { rejectValue: string }>(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/user/forgot-password', { email });
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to send reset code.');
    }
  }
);

export const resetPassword = createAsyncThunk<any, { email: string; otp: string; newPassword: string }, { rejectValue: string }>(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/user/reset-password', data);
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to reset password.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.isOtpSent = false;
      state.isOtpVerified = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isOtpSent = false;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.isOtpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to send OTP.';
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.isOtpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'OTP verification failed.';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'User registration failed.';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Login failed.';
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(sendAdminOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendAdminOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendAdminOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to send admin OTP.';
      })
      .addCase(verifyAndRegisterAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyAndRegisterAdmin.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyAndRegisterAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Admin registration failed.';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to send reset code.';
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to reset password.';
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;