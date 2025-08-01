export type User = {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  status: 'Approved' | 'Suspended';
  youtubeStatus: 'Verified' | 'Pending' | 'Declined' | 'Not Linked';
  upiName?: string;
  upiId?: string;
  totalEarnings?: number;
  pendingPayout?: number;
  currentBalance?: number;
};

export type UserIncomeProfile = {
  _id: string;
  fullName: string;
  email: string;
  totalEarnings: number;
  pendingPayout: number;
  contributionStatus: 'Paid' | 'Pending' | 'Overdue';
  incomeStatus: 'Active' | 'Suspended';
  platformContributionDue: number;
  suggestedContributionPercentage: number;
};

export type AiVideo = {
  _id: string;
  title: string;
  description: string;
  topic: string;
  type: 'Short' | 'Long';
  status: 'Available' | 'Assigned' | 'Downloaded';
  fileUrl: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AssignmentBatch = {
  _id: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  totalLinks: number;
  completionRate: number;
  nonCompliantUsers: number;
};

export type NonCompliantUser = {
  _id: string;
  email: string;
  tasksAssigned: number;
  tasksCompleted: number;
};

export type FaqItem = {
  _id: string;
  question: string;
  answer: string;
  category: string;
};

export type TutorialItem = {
  _id: string;
  title: string;
  url: string;
};

export type AuditLog = {
  _id: string;
  createdAt: string;
  adminEmail: string;
  actionType: string;
  targetUser?: string;
  details: string;
  status: 'success' | 'warning' | 'error';
  rawData?: any;
};

export type ErrorLog = {
  _id: string;
  createdAt: string;
  errorCode: number;
  errorMessage: string;
  stackTrace: string;
};

export type Contribution = {
    _id: string;
    amount: number;
    status: 'Success' | 'Failed';
    createdAt: string;
    paymentId: string;
    period: string;
};

export type ManualIncomeSubmission = {
    _id: string;
    user: { _id: string; fullName: string; email: string };
    month: string;
    year: number;
    amount: number;
    screenshotUrl: string;
    status: 'Pending' | 'Approved' | 'Declined';
    createdAt: string;
};

export type SupportTicketResponse = {
    _id: string;
    responder: { fullName: string; role: 'admin' | 'user' };
    message: string;
    createdAt: string;
};

export type SupportTicket = {
    _id: string;
    user: { fullName: string; email: string; };
    subject: string;
    category: string;
    message: string;
    status: 'Open' | 'Answered' | 'Closed';
    responses: SupportTicketResponse[];
    createdAt: string;
};

export type AlertInfo = {
  icon: React.ElementType;
  title: string;
  description: string;
  variant: "destructive" | "default";
};