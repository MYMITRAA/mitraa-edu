import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Preloader from './components/common/Preloader'
import Landing from './pages/auth/Landing'
import SelectRole from './pages/auth/SelectRole'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import TwoFactor from './pages/auth/TwoFactor'
import DashboardLayout from './layouts/DashboardLayout'

// Student pages
import StudentHome from './pages/student/Home'
import StudentAssignments from './pages/student/Assignments'
import StudentExams from './pages/student/Exams'
import StudentPracticePod from './pages/student/PracticePod'
import StudentPerformance from './pages/student/Performance'
import StudentNotices from './pages/student/Notices'
import StudentMessages from './pages/student/Messages'
import StudentPTM from './pages/student/PTM'
import StudentDownloads from './pages/student/Downloads'
import StudentProfile from './pages/student/Profile'

// Teacher pages
import TeacherHome from './pages/teacher/Home'
import TeacherAttendance from './pages/teacher/Attendance'
import TeacherAssignments from './pages/teacher/Assignments'
import TeacherQuestionBank from './pages/teacher/QuestionBank'
import TeacherExams from './pages/teacher/Exams'
import TeacherStudentSupport from './pages/teacher/StudentSupport'
import TeacherParentComm from './pages/teacher/ParentComm'
import TeacherNotices from './pages/teacher/Notices'
import TeacherReports from './pages/teacher/Reports'
import TeacherProfile from './pages/teacher/Profile'

// Parent pages
import ParentHome from './pages/parent/Home'
import ParentAttendance from './pages/parent/Attendance'
import ParentAssignments from './pages/parent/Assignments'
import ParentExams from './pages/parent/Exams'
import ParentPracticePod from './pages/parent/PracticePod'
import ParentProgress from './pages/parent/Progress'
import ParentCommunication from './pages/parent/Communication'
import ParentPTM from './pages/parent/PTM'
import ParentNotices from './pages/parent/Notices'
import ParentFees from './pages/parent/Fees'
import ParentRequests from './pages/parent/Requests'
import ParentProfile from './pages/parent/Profile'

// Principal pages
import PrincipalHome from './pages/principal/Home'
import PrincipalAcademic from './pages/principal/Academic'
import PrincipalStaff from './pages/principal/Staff'
import PrincipalAttendance from './pages/principal/Attendance'
import PrincipalExams from './pages/principal/Exams'
import PrincipalPerformance from './pages/principal/Performance'
import PrincipalParentEngagement from './pages/principal/ParentEngagement'
import PrincipalGrievances from './pages/principal/Grievances'
import PrincipalNotices from './pages/principal/Notices'
import PrincipalApprovals from './pages/principal/Approvals'
import PrincipalReports from './pages/principal/Reports'
import PrincipalProfile from './pages/principal/Profile'

// Management pages
import ManagementHome from './pages/management/Home'
import ManagementCampus from './pages/management/Campus'
import ManagementAcademic from './pages/management/Academic'
import ManagementOperational from './pages/management/Operational'
import ManagementFinancial from './pages/management/Financial'
import ManagementPolicy from './pages/management/Policy'
import ManagementGrievance from './pages/management/Grievance'
import ManagementAudit from './pages/management/Audit'
import ManagementNotices from './pages/management/Notices'
import ManagementReports from './pages/management/Reports'
import ManagementProfile from './pages/management/Profile'

// Exam Controller pages
import ExamHome from './pages/examcontroller/Home'
import ExamProgramme from './pages/examcontroller/Programme'
import ExamQuestionBank from './pages/examcontroller/QuestionBank'
import ExamPaperAssembly from './pages/examcontroller/PaperAssembly'
import ExamCentre from './pages/examcontroller/Centre'
import ExamDayOps from './pages/examcontroller/DayOps'
import ExamEvaluation from './pages/examcontroller/Evaluation'
import ExamResults from './pages/examcontroller/Results'
import ExamAudit from './pages/examcontroller/Audit'
import ExamReports from './pages/examcontroller/Reports'
import ExamProfile from './pages/examcontroller/Profile'
import V1Workspace from './pages/v1/Workspace'

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && user && !roles.includes(user.role)) {
  return <Navigate to={`/${user.role}`} replace />
  }
  return <>{children}</>
}

export default function App() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), reduceMotion ? 450 : 1650)
    return () => window.clearTimeout(timer)
  }, [reduceMotion])

  return (
    <>
  <AnimatePresence>
    {isLoading && <Preloader key="preloader" />}
  </AnimatePresence>
  <AnimatePresence mode="wait" initial={false}>
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: reduceMotion ? 0 : -8, scale: reduceMotion ? 1 : 0.995 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.36, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '100%', minHeight: '100vh' }}
    >
  <Routes location={location}>
  <Route path="/" element={<Landing />} />
  <Route path="/select-role" element={<SelectRole />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Navigate to="/select-role" replace />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/2fa" element={<TwoFactor />} />

  {/* MiTRAA Edu V1 pilot workspaces */}
  {['admin', 'teacher', 'staff', 'finance', 'preschool', 'parent'].map(role => (
    <Route key={role} path={`/${role}`} element={<ProtectedRoute roles={[role]}><DashboardLayout /></ProtectedRoute>}>
      <Route index element={<V1Workspace />} />
      <Route path=":module" element={<V1Workspace />} />
    </Route>
  ))}

  {/* Student */}
  <Route path="/student" element={<ProtectedRoute roles={['student']}><DashboardLayout /></ProtectedRoute>}>
  <Route index element={<StudentHome />} />
  <Route path="assignments" element={<StudentAssignments />} />
  <Route path="exams" element={<StudentExams />} />
  <Route path="practicepod" element={<StudentPracticePod />} />
  <Route path="performance" element={<StudentPerformance />} />
  <Route path="notices" element={<StudentNotices />} />
  <Route path="messages" element={<StudentMessages />} />
  <Route path="ptm" element={<StudentPTM />} />
  <Route path="downloads" element={<StudentDownloads />} />
  <Route path="profile" element={<StudentProfile />} />
  </Route>

  {/* Teacher */}
  <Route path="/teacher" element={<ProtectedRoute roles={['teacher']}><DashboardLayout /></ProtectedRoute>}>
  <Route index element={<TeacherHome />} />
  <Route path="attendance" element={<TeacherAttendance />} />
  <Route path="assignments" element={<TeacherAssignments />} />
  <Route path="question-bank" element={<TeacherQuestionBank />} />
  <Route path="exams" element={<TeacherExams />} />
  <Route path="student-support" element={<TeacherStudentSupport />} />
  <Route path="parent-comm" element={<TeacherParentComm />} />
  <Route path="notices" element={<TeacherNotices />} />
  <Route path="reports" element={<TeacherReports />} />
  <Route path="profile" element={<TeacherProfile />} />
  </Route>

  {/* Parent */}
  <Route path="/parent" element={<ProtectedRoute roles={['parent']}><DashboardLayout /></ProtectedRoute>}>
  <Route index element={<ParentHome />} />
  <Route path="attendance" element={<ParentAttendance />} />
  <Route path="assignments" element={<ParentAssignments />} />
  <Route path="exams" element={<ParentExams />} />
  <Route path="practicepod" element={<ParentPracticePod />} />
  <Route path="progress" element={<ParentProgress />} />
  <Route path="communication" element={<ParentCommunication />} />
  <Route path="ptm" element={<ParentPTM />} />
  <Route path="notices" element={<ParentNotices />} />
  <Route path="fees" element={<ParentFees />} />
  <Route path="requests" element={<ParentRequests />} />
  <Route path="profile" element={<ParentProfile />} />
  </Route>

  {/* Principal */}
  <Route path="/principal" element={<ProtectedRoute roles={['principal']}><DashboardLayout /></ProtectedRoute>}>
  <Route index element={<PrincipalHome />} />
  <Route path="academic" element={<PrincipalAcademic />} />
  <Route path="staff" element={<PrincipalStaff />} />
  <Route path="attendance" element={<PrincipalAttendance />} />
  <Route path="exams" element={<PrincipalExams />} />
  <Route path="performance" element={<PrincipalPerformance />} />
  <Route path="parent-engagement" element={<PrincipalParentEngagement />} />
  <Route path="grievances" element={<PrincipalGrievances />} />
  <Route path="notices" element={<PrincipalNotices />} />
  <Route path="approvals" element={<PrincipalApprovals />} />
  <Route path="reports" element={<PrincipalReports />} />
  <Route path="profile" element={<PrincipalProfile />} />
  </Route>

  {/* Management */}
  <Route path="/management" element={<ProtectedRoute roles={['management']}><DashboardLayout /></ProtectedRoute>}>
  <Route index element={<ManagementHome />} />
  <Route path="campus" element={<ManagementCampus />} />
  <Route path="academic" element={<ManagementAcademic />} />
  <Route path="operational" element={<ManagementOperational />} />
  <Route path="financial" element={<ManagementFinancial />} />
  <Route path="policy" element={<ManagementPolicy />} />
  <Route path="grievance" element={<ManagementGrievance />} />
  <Route path="audit" element={<ManagementAudit />} />
  <Route path="notices" element={<ManagementNotices />} />
  <Route path="reports" element={<ManagementReports />} />
  <Route path="profile" element={<ManagementProfile />} />
  </Route>

  {/* Exam Controller */}
  <Route path="/examcontroller" element={<ProtectedRoute roles={['examcontroller']}><DashboardLayout /></ProtectedRoute>}>
  <Route index element={<ExamHome />} />
  <Route path="programme" element={<ExamProgramme />} />
  <Route path="question-bank" element={<ExamQuestionBank />} />
  <Route path="paper-assembly" element={<ExamPaperAssembly />} />
  <Route path="centre" element={<ExamCentre />} />
  <Route path="day-ops" element={<ExamDayOps />} />
  <Route path="evaluation" element={<ExamEvaluation />} />
  <Route path="results" element={<ExamResults />} />
  <Route path="audit" element={<ExamAudit />} />
  <Route path="reports" element={<ExamReports />} />
  <Route path="profile" element={<ExamProfile />} />
  </Route>

  <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
    </motion.div>
  </AnimatePresence>
    </>
  )
}
