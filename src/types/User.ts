export type DisciplineType = 
  | 'Chaplain'
  | 'COTA'
  | 'HHA'
  | 'LPN/LVN'
  | 'MSW'
  | 'OT'
  | 'Other'
  | 'PT'
  | 'PTA'
  | 'RN'
  | 'ST';

export type EmployeeType = 
  | 'Staff'
  | 'Contract'
  | 'Pay Per Visit'
  | 'Per Diem'
  | 'Other';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  suffix?: string;
  discipline: DisciplineType;
  username: string;
  password: string;
  agencyEmployeeId: string;
  email: string;
  phone1: string;
  phone2?: string;
  employeeType: EmployeeType;
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

export const DISCIPLINE_OPTIONS = [
  { id: 14, value: 'Chaplain', label: 'Chaplain' },
  { id: 2, value: 'COTA', label: 'COTA' },
  { id: 4, value: 'HHA', label: 'HHA' },
  { id: 5, value: 'LPN/LVN', label: 'LPN/LVN' },
  { id: 6, value: 'MSW', label: 'MSW' },
  { id: 7, value: 'OT', label: 'OT' },
  { id: 17, value: 'Other', label: 'Other' },
  { id: 9, value: 'PT', label: 'PT' },
  { id: 16, value: 'PTA', label: 'PTA' },
  { id: 10, value: 'RN', label: 'RN' },
  { id: 11, value: 'ST', label: 'ST' }
];

export const EMPLOYEE_TYPE_OPTIONS = [
  { id: 1, value: 'Staff', label: 'Staff' },
  { id: 2, value: 'Contract', label: 'Contract' },
  { id: 3, value: 'Pay Per Visit', label: 'Pay Per Visit' },
  { id: 4, value: 'Per Diem', label: 'Per Diem' },
  { id: 5, value: 'Other', label: 'Other' }
]; 