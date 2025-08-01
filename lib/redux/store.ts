import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import userDashboardReducer from './features/user/dashboardSlice';
import adminDashboardReducer from './features/admin/dashboardSlice';
import adminUsersReducer from './features/admin/usersSlice';
import adminTechnicianReducer from './features/admin/technicianSlice';
import adminFinanceReducer from './features/admin/financeSlice';
import adminContentReducer from './features/admin/contentSlice';
import adminReportsReducer from './features/admin/reportsSlice';
import adminSecurityReducer from './features/admin/securitySlice';
import adminIncomeVerificationReducer from './features/admin/incomeVerificationSlice';
import userAssignmentsReducer from './features/user/assignmentsSlice';
import userAiVideosReducer from './features/user/aiVideosSlice';
import userDownlineReducer from './features/user/downlineSlice';
import userNotificationsReducer from './features/user/notificationsSlice';
import userIncomeReducer from './features/user/incomeSlice';
import userComplianceReducer from './features/user/complianceSlice';
import userProfileReducer from './features/user/profileSlice';
import userSupportReducer from './features/user/supportSlice';
import userProfileSetupReducer from './features/user/profileSetupSlice';
import topicsReducer from './features/topicsSlice';
import adminTopicsReducer from './features/admin/adminTopicsSlice';
import adminSupportReducer from './features/admin/supportSlice';
import adminBlogReducer from "./features/admin/blogSlice";
import userBlogReducer from "./features/user/blogSlice";
import publicContentReducer from './features/publicContentSlice';


export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      profileSetup: userProfileSetupReducer,
      userDashboard: userDashboardReducer,
      userAssignments: userAssignmentsReducer,
      userAiVideos: userAiVideosReducer,
      userDownline: userDownlineReducer,
      userNotifications: userNotificationsReducer,
      userIncome: userIncomeReducer,
      userCompliance: userComplianceReducer,
      userProfile: userProfileReducer,
      userSupport: userSupportReducer,
      userBlog: userBlogReducer,
      adminDashboard: adminDashboardReducer,
      adminUsers: adminUsersReducer,
      adminTechnician: adminTechnicianReducer,
      adminFinance: adminFinanceReducer,
      adminContent: adminContentReducer,
      adminReports: adminReportsReducer,
      adminSecurity: adminSecurityReducer,
      adminIncomeVerification: adminIncomeVerificationReducer,
      adminSupport:adminSupportReducer,
      topics: topicsReducer,
      adminTopics: adminTopicsReducer,
      adminBlog: adminBlogReducer,

      publicContent: publicContentReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];