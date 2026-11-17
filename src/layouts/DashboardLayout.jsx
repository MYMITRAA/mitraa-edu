import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import AnimatedPage from '../components/common/AnimatedPage'
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Avatar, Badge, Divider, Tooltip, useMediaQuery, useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import HomeIcon from '@mui/icons-material/Home'
import AssignmentIcon from '@mui/icons-material/Assignment'
import QuizIcon from '@mui/icons-material/Quiz'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import InsightsIcon from '@mui/icons-material/Insights'
import CampaignIcon from '@mui/icons-material/Campaign'
import ChatIcon from '@mui/icons-material/Chat'
import GroupsIcon from '@mui/icons-material/Groups'
import DownloadIcon from '@mui/icons-material/Download'
import SettingsIcon from '@mui/icons-material/Settings'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import HelpIcon from '@mui/icons-material/Help'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PaymentIcon from '@mui/icons-material/Payment'
import RequestPageIcon from '@mui/icons-material/RequestPage'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import PeopleIcon from '@mui/icons-material/People'
import ReportIcon from '@mui/icons-material/Report'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BusinessIcon from '@mui/icons-material/Business'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PolicyIcon from '@mui/icons-material/Policy'
import SecurityIcon from '@mui/icons-material/Security'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DescriptionIcon from '@mui/icons-material/Description'
import DomainIcon from '@mui/icons-material/Domain'
import BoltIcon from '@mui/icons-material/Bolt'
import RateReviewIcon from '@mui/icons-material/RateReview'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import HistoryIcon from '@mui/icons-material/History'
import SchoolIcon from '@mui/icons-material/School'
import { motion } from 'framer-motion'
import { navItem } from '../components/common/motionVariants'

const DRAWER_WIDTH = 268

const MENUS = {
  student: [
    { id: 'home', label: 'Home', icon: <HomeIcon />, path: '/student' },
    { id: 'assignments', label: 'Assignments', icon: <AssignmentIcon />, path: '/student/assignments' },
    { id: 'exams', label: 'Examinations', icon: <QuizIcon />, path: '/student/exams' },
    { id: 'practice', label: 'PracticePod', icon: <FitnessCenterIcon />, path: '/student/practicepod' },
    { id: 'performance', label: 'My Performance', icon: <InsightsIcon />, path: '/student/performance' },
    { id: 'notices', label: 'Notices', icon: <CampaignIcon />, path: '/student/notices' },
    { id: 'messages', label: 'Messages', icon: <ChatIcon />, path: '/student/messages' },
    { id: 'ptm', label: 'PTM / Meetings', icon: <GroupsIcon />, path: '/student/ptm' },
    { id: 'downloads', label: 'Downloads', icon: <DownloadIcon />, path: '/student/downloads' },
    { id: 'profile', label: 'Profile & Settings', icon: <SettingsIcon />, path: '/student/profile' },
  ],
  teacher: [
    { id: 'home', label: 'Home', icon: <HomeIcon />, path: '/teacher' },
    { id: 'attendance', label: 'Attendance', icon: <EventAvailableIcon />, path: '/teacher/attendance' },
    { id: 'assignments', label: 'Assignment Engine', icon: <AssignmentIcon />, path: '/teacher/assignments' },
    { id: 'qbank', label: 'Question Bank', icon: <HelpIcon />, path: '/teacher/question-bank' },
    { id: 'exams', label: 'Examinations', icon: <QuizIcon />, path: '/teacher/exams' },
    { id: 'support', label: 'Student Support', icon: <HelpIcon />, path: '/teacher/student-support' },
    { id: 'parent', label: 'Parent Communication', icon: <FamilyRestroomIcon />, path: '/teacher/parent-comm' },
    { id: 'notices', label: 'Notices', icon: <CampaignIcon />, path: '/teacher/notices' },
    { id: 'reports', label: 'Reports & Analytics', icon: <AssessmentIcon />, path: '/teacher/reports' },
    { id: 'profile', label: 'Profile & Settings', icon: <SettingsIcon />, path: '/teacher/profile' },
  ],
  parent: [
    { id: 'home', label: 'Home', icon: <HomeIcon />, path: '/parent' },
    { id: 'attendance', label: 'Attendance', icon: <EventAvailableIcon />, path: '/parent/attendance' },
    { id: 'assignments', label: 'Assignments', icon: <AssignmentIcon />, path: '/parent/assignments' },
    { id: 'exams', label: 'Examinations', icon: <QuizIcon />, path: '/parent/exams' },
    { id: 'practice', label: 'PracticePod', icon: <FitnessCenterIcon />, path: '/parent/practicepod' },
    { id: 'progress', label: 'Progress & Reports', icon: <InsightsIcon />, path: '/parent/progress' },
    { id: 'comm', label: 'Communication', icon: <ChatIcon />, path: '/parent/communication' },
    { id: 'ptm', label: 'PTM / Meetings', icon: <GroupsIcon />, path: '/parent/ptm' },
    { id: 'notices', label: 'Notices', icon: <CampaignIcon />, path: '/parent/notices' },
    { id: 'fees', label: 'Fees & Payments', icon: <PaymentIcon />, path: '/parent/fees' },
    { id: 'requests', label: 'Requests', icon: <RequestPageIcon />, path: '/parent/requests' },
    { id: 'profile', label: 'Profile & Settings', icon: <SettingsIcon />, path: '/parent/profile' },
  ],
  principal: [
    { id: 'home', label: 'Home', icon: <HomeIcon />, path: '/principal' },
    { id: 'academic', label: 'Academic Coverage', icon: <MenuBookIcon />, path: '/principal/academic' },
    { id: 'staff', label: 'Staff Management', icon: <PeopleIcon />, path: '/principal/staff' },
    { id: 'attendance', label: 'Attendance Overview', icon: <EventAvailableIcon />, path: '/principal/attendance' },
    { id: 'exams', label: 'Examinations', icon: <QuizIcon />, path: '/principal/exams' },
    { id: 'performance', label: 'Student Performance', icon: <InsightsIcon />, path: '/principal/performance' },
    { id: 'parent', label: 'Parent Engagement', icon: <FamilyRestroomIcon />, path: '/principal/parent-engagement' },
    { id: 'grievances', label: 'Grievances', icon: <ReportIcon />, path: '/principal/grievances' },
    { id: 'notices', label: 'Notices', icon: <CampaignIcon />, path: '/principal/notices' },
    { id: 'approvals', label: 'Approvals', icon: <CheckCircleIcon />, path: '/principal/approvals' },
    { id: 'reports', label: 'Reports', icon: <AssessmentIcon />, path: '/principal/reports' },
    { id: 'profile', label: 'Profile & Settings', icon: <SettingsIcon />, path: '/principal/profile' },
  ],
  management: [
    { id: 'home', label: 'Home', icon: <HomeIcon />, path: '/management' },
    { id: 'campus', label: 'Multi-Campus View', icon: <BusinessIcon />, path: '/management/campus' },
    { id: 'academic', label: 'Academic Reports', icon: <MenuBookIcon />, path: '/management/academic' },
    { id: 'operational', label: 'Operational Reports', icon: <AssessmentIcon />, path: '/management/operational' },
    { id: 'financial', label: 'Financial Management', icon: <AccountBalanceIcon />, path: '/management/financial' },
    { id: 'policy', label: 'Policy & Approvals', icon: <PolicyIcon />, path: '/management/policy' },
    { id: 'grievance', label: 'Grievance Overview', icon: <ReportIcon />, path: '/management/grievance' },
    { id: 'audit', label: 'Audit & Compliance', icon: <SecurityIcon />, path: '/management/audit' },
    { id: 'notices', label: 'Notices', icon: <CampaignIcon />, path: '/management/notices' },
    { id: 'reports', label: 'Reports & Analytics', icon: <AssessmentIcon />, path: '/management/reports' },
    { id: 'profile', label: 'Profile & Settings', icon: <SettingsIcon />, path: '/management/profile' },
  ],
  examcontroller: [
    { id: 'home', label: 'Home', icon: <HomeIcon />, path: '/examcontroller' },
    { id: 'programme', label: 'Exam Programme', icon: <CalendarMonthIcon />, path: '/examcontroller/programme' },
    { id: 'qbank', label: 'Question Bank', icon: <HelpIcon />, path: '/examcontroller/question-bank' },
    { id: 'paper', label: 'Paper Assembly', icon: <DescriptionIcon />, path: '/examcontroller/paper-assembly' },
    { id: 'centre', label: 'Centre Management', icon: <DomainIcon />, path: '/examcontroller/centre' },
    { id: 'dayops', label: 'Exam Day Operations', icon: <BoltIcon />, path: '/examcontroller/day-ops' },
    { id: 'eval', label: 'Evaluation & Moderation', icon: <RateReviewIcon />, path: '/examcontroller/evaluation' },
    { id: 'results', label: 'Results', icon: <EmojiEventsIcon />, path: '/examcontroller/results' },
    { id: 'audit', label: 'Audit Logs', icon: <HistoryIcon />, path: '/examcontroller/audit' },
    { id: 'reports', label: 'Reports', icon: <AssessmentIcon />, path: '/examcontroller/reports' },
    { id: 'profile', label: 'Profile & Settings', icon: <SettingsIcon />, path: '/examcontroller/profile' },
  ],
}

const ROLE_COLORS = {
  student: '#10b981', teacher: '#8b5cf6', parent: '#ec4899',
  principal: '#f59e0b', management: '#eab308', examcontroller: '#ef4444',
}

const ROLE_LABELS = {
  admin: 'Administrator Workspace', teacher: 'Teacher Workspace', staff: 'Staff Workspace',
  finance: 'Finance Workspace', preschool: 'Preschool Workspace', parent: 'Parent Workspace',
}

const V1_MODULES = {
  admin: ['overview','institution','learners','attendance','notices','homework','fees','care','pickup','transport','requests','reports','audit'],
  teacher: ['overview','learners','attendance','notices','homework','requests','reports'],
  staff: ['overview','institution','learners','attendance','notices','pickup','transport','requests','reports','audit'],
  finance: ['overview','learners','fees','reports','audit'],
  preschool: ['overview','learners','attendance','notices','homework','care','pickup','requests'],
  parent: ['overview','attendance','notices','homework','fees','care','requests'],
}
const V1_LABELS = { overview:'Overview', institution:'Institution setup', learners:'Learners & guardians', attendance:'Attendance', notices:'Notices', homework:'Homework', fees:'Fees & receipts', care:'Daily care log', pickup:'Pickup & handover', transport:'Transport fallback', requests:'Requests', reports:'Basic reports', audit:'Audit history' }
const V1_ICONS = { overview:<HomeIcon />, institution:<BusinessIcon />, learners:<PeopleIcon />, attendance:<EventAvailableIcon />, notices:<CampaignIcon />, homework:<AssignmentIcon />, fees:<PaymentIcon />, care:<FamilyRestroomIcon />, pickup:<CheckCircleIcon />, transport:<DomainIcon />, requests:<RequestPageIcon />, reports:<AssessmentIcon />, audit:<HistoryIcon /> }

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [open, setOpen] = useState(!isMobile)
  const role = user?.role || 'student'
  const menu = V1_MODULES[role]
    ? V1_MODULES[role].map(id => ({ id, label: V1_LABELS[id], icon: V1_ICONS[id], path: `/${role}${id === 'overview' ? '' : `/${id}`}` }))
    : MENUS[role] || []
  const color = ROLE_COLORS[role] || '#1e40af'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
          <SchoolIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography fontWeight={800} fontSize={15}>MiTRAA-Edu</Typography>
          <Typography variant="caption" color="text.secondary">Connected Education</Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ flex: 1, overflow: 'auto', px: 1, py: 1.5 }}>
        {menu.map((item, i) => (
          <motion.div key={item.id} custom={i} variants={navItem} initial="initial" animate="animate">
            <ListItemButton
              component={NavLink}
              to={item.path}
              end={item.path === `/${role}`}
              sx={{
                borderRadius: 2, mb: 0.5, py: 1,
                '&.active': {
                  bgcolor: `${color}14`,
                  color: color,
                  '& .MuiListItemIcon-root': { color },
                  fontWeight: 700,
                  borderLeft: `3px solid ${color}`,
                },
                '&:hover': { bgcolor: `${color}0a` },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: 13.5, fontWeight: 500 }}
              />
            </ListItemButton>
          </motion.div>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 1.5 }}>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
          <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: 13.5 }} />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          width: { md: open ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          ml: { md: open ? `${DRAWER_WIDTH}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={() => setOpen(!open)} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography fontWeight={700} sx={{ color, flexGrow: 1 }} fontSize={15}>
            {ROLE_LABELS[role]}
          </Typography>
          <Box className="dashboard-robot" aria-hidden="true">
            <span className="dashboard-robot__halo" />
            <span className="dashboard-robot__head">
              <span className="dashboard-robot__eye" />
              <span className="dashboard-robot__eye" />
            </span>
          </Box>
          <Tooltip title="Search">
            <IconButton><SearchIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, ml: 1.5 }}>
            <Avatar
              sx={{
                width: 36, height: 36, bgcolor: color, fontWeight: 700, fontSize: 14,
                boxShadow: `0 2px 10px ${color}55`,
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography fontSize={13} fontWeight={600} lineHeight={1.2}>{user?.name}</Typography>
              <Typography fontSize={11} color="text.secondary" lineHeight={1.2}>{user?.email}</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: open ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          ml: { md: open ? 0 : 0 },
          mt: 8,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <AnimatedPage>
          <Outlet />
        </AnimatedPage>
      </Box>
    </Box>
  )
}
