export interface User {
  id: string;
  firstName: string;
  lastName: string;
  suffix?: string;
  userType: 'Staff' | 'Admin' | 'Other';
  username: string;
  password: string;
  agencyEmployeeId: string;
  email: string;
  phone1: string;
  phone2?: string;
  employeeType: 'Staff';
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 