export const ASSIGNMENTS = [
  { id: 'A1', title: 'Quadratic Equations Worksheet', subject: 'Mathematics', dueDate: '2026-10-12', status: 'pending', maxMarks: 20, teacher: 'Priya Verma', class: '10-A' },
  { id: 'A2', title: 'Chemical Reactions Lab Report', subject: 'Science', dueDate: '2026-10-10', status: 'submitted', maxMarks: 25, teacher: 'Anita Desai', class: '10-A' },
  { id: 'A3', title: 'Essay: Climate Change', subject: 'English', dueDate: '2026-10-08', status: 'graded', marks: 18, maxMarks: 20, teacher: 'Ravi Kumar', class: '10-A' },
  { id: 'A4', title: 'History Timeline Project', subject: 'History', dueDate: '2026-10-05', status: 'overdue', maxMarks: 30, teacher: 'Sunita Rao', class: '10-A' },
]

export const EXAMS = [
  { id: 'E1', name: 'Unit Test 2 - Mathematics', subject: 'Mathematics', date: '2026-10-15', duration: '90 min', status: 'upcoming', maxMarks: 40 },
  { id: 'E2', name: 'Mid-Term Science', subject: 'Science', date: '2026-10-20', duration: '120 min', status: 'upcoming', maxMarks: 80 },
  { id: 'E3', name: 'Unit Test 1 - English', subject: 'English', date: '2026-09-28', duration: '60 min', status: 'result-published', maxMarks: 40, obtainedMarks: 34 },
]

export const ATTENDANCE = [
  { date: '2026-10-07', status: 'present' },
  { date: '2026-10-06', status: 'present' },
  { date: '2026-10-05', status: 'late' },
  { date: '2026-10-04', status: 'present' },
  { date: '2026-10-03', status: 'absent' },
  { date: '2026-10-02', status: 'present' },
  { date: '2026-10-01', status: 'present' },
]

export const NOTICES = [
  { id: 'N1', title: 'Diwali Holiday Schedule', content: 'School will remain closed from 20th to 25th October for Diwali celebrations.', date: '2026-10-06', priority: 'high', from: 'Principal Office' },
  { id: 'N2', title: 'Parent-Teacher Meeting', content: 'PTM scheduled for 12th October, 10 AM - 1 PM. Please book slots via portal.', date: '2026-10-05', priority: 'medium', from: 'Admin' },
  { id: 'N3', title: 'Science Fair Registration Open', content: 'Students of classes 8-12 can register for the Annual Science Fair by 15th October.', date: '2026-10-04', priority: 'low', from: 'Science Dept' },
]

export const MESSAGES = [
  { id: 'M1', from: 'Priya Verma', to: 'Aarav Sharma', subject: 'Regarding Assignment Feedback', body: 'Good attempt on the worksheet. Please revise quadratic formula applications.', date: '2026-10-07', read: false },
  { id: 'M2', from: 'Admin', to: 'Aarav Sharma', subject: 'Library Book Overdue', body: 'Please return "NCERT Physics Class 10" by tomorrow.', date: '2026-10-06', read: true },
]

export const PRACTICE_PAPERS = [
  { id: 'PP1', title: 'Algebra Basics', subject: 'Mathematics', questions: 20, difficulty: 'easy', attempts: 2, bestScore: 85 },
  { id: 'PP2', title: 'Organic Chemistry Intro', subject: 'Science', questions: 15, difficulty: 'medium', attempts: 0 },
  { id: 'PP3', title: 'Grammar & Composition', subject: 'English', questions: 25, difficulty: 'easy', attempts: 1, bestScore: 72 },
  { id: 'PP4', title: 'Trigonometry Advanced', subject: 'Mathematics', questions: 30, difficulty: 'hard', attempts: 0 },
]

export const ROLE_DASHBOARD_PATH = {
  admin: '/admin',
  teacher: '/teacher',
  staff: '/staff',
  finance: '/finance',
  preschool: '/preschool',
  parent: '/parent',
}
