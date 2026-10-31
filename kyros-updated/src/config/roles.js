// Single source of truth for roles. `value` is what the backend receives.
export const ROLES = [
  { value: 'student', label: 'Student', home: '/app/student' },
  { value: 'teacher', label: 'Teacher', home: '/app/teacher' },
  { value: 'institute', label: 'Coaching Institute', home: '/app/institute' },
];
export const roleHome = (r) => ROLES.find((x) => x.value === r)?.home || '/auth';
