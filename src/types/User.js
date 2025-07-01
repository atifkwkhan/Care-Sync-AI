export const User = {
  id: 'string',
  firstName: 'string',
  lastName: 'string',
  suffix: 'string',
  discipline: 'string',
  username: 'string',
  email: 'string',
  phone1: 'string',
  phone2: 'string',
  agencyEmployeeId: 'string',
  employeeType: 'string',
  organizationId: 'string',
  role: 'string', // 'admin' or 'user'
  createdAt: 'string',
  updatedAt: 'string'
};

export const UserFormData = {
  firstName: '',
  lastName: '',
  suffix: '',
  discipline: '',
  username: '',
  password: '',
  email: '',
  phone1: '',
  phone2: '',
  agencyEmployeeId: '',
  employeeType: 'Staff',
  organizationId: '',
  role: 'user'
};

export const DISCIPLINE_OPTIONS = [
  { id: 1, value: 'RN', label: 'RN' },
  { id: 2, value: 'LPN/LVN', label: 'LPN/LVN' },
  { id: 3, value: 'PT', label: 'PT' },
  { id: 4, value: 'PTA', label: 'PTA' },
  { id: 5, value: 'OT', label: 'OT' },
  { id: 6, value: 'COTA', label: 'COTA' },
  { id: 7, value: 'ST', label: 'ST' },
  { id: 8, value: 'MSW', label: 'MSW' },
  { id: 9, value: 'HHA', label: 'HHA' },
  { id: 10, value: 'Chaplain', label: 'Chaplain' },
  { id: 11, value: 'Other', label: 'Other' }
];

export const EMPLOYEE_TYPE_OPTIONS = [
  { id: 1, value: 'Staff', label: 'Staff' },
  { id: 2, value: 'Contract', label: 'Contract' },
  { id: 3, value: 'Pay Per Visit', label: 'Pay Per Visit' },
  { id: 4, value: 'Per Diem', label: 'Per Diem' },
  { id: 5, value: 'Other', label: 'Other' }
];

export const USER_ROLE_OPTIONS = [
  { id: 1, value: 'admin', label: 'Administrator' },
  { id: 2, value: 'user', label: 'Regular User' }
]; 