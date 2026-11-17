import { useNavigate } from 'react-router-dom'
import { Box, Typography, Paper, IconButton, Stack, Avatar } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import SchoolIcon from '@mui/icons-material/School'
import PersonIcon from '@mui/icons-material/Person'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import PaymentsIcon from '@mui/icons-material/Payments'
import { motion } from 'framer-motion'

const roles = [
  { role: 'admin', label: 'Administrator', icon: <AccountBalanceIcon />, color: '#1e40af', desc: 'Institution setup, people, approvals and reports' },
  { role: 'teacher', label: 'Teacher', icon: <SchoolIcon />, color: '#7c3aed', desc: 'Attendance, homework and class notices' },
  { role: 'staff', label: 'Staff', icon: <PersonIcon />, color: '#0f766e', desc: 'Learner records, notices and pickup handover' },
  { role: 'finance', label: 'Finance', icon: <PaymentsIcon />, color: '#b45309', desc: 'Fee charges, collections and receipts' },
  { role: 'preschool', label: 'Preschool Educator', icon: <ChildCareIcon />, color: '#be185d', desc: 'Daily care logs and authorised pickup' },
  { role: 'parent', label: 'Parent / Guardian', icon: <FamilyRestroomIcon />, color: '#0369a1', desc: 'Verified child attendance, tasks and notices' },
]

export default function SelectRole() {
  const navigate = useNavigate()
  return <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
    <Paper elevation={0} sx={{ px: 2.5, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <IconButton onClick={() => navigate('/')} size="small"><ArrowBackIcon /></IconButton><Typography fontWeight={700}>MiTRAA Edu · V1 pilot</Typography>
    </Paper>
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
      <Box sx={{ width: '100%', maxWidth: 560 }}>
        <Typography variant="h4" textAlign="center" fontWeight={800} gutterBottom>Choose a pilot workspace</Typography>
        <Typography textAlign="center" color="text.secondary" sx={{ mb: 3 }}>Role previews are for this frontend prototype. Institution invitations and permissions are enforced by the connected service.</Typography>
        <Stack spacing={1.25}>{roles.map(r => <Paper component={motion.div} whileHover={{ y: -2 }} key={r.role} onClick={() => navigate(`/login?role=${r.role}`)} elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', borderLeft: `4px solid ${r.color}`, borderRadius: 2.5 }}>
          <Avatar sx={{ bgcolor: `${r.color}18`, color: r.color }}>{r.icon}</Avatar><Box sx={{ flex: 1 }}><Typography fontWeight={700}>{r.label}</Typography><Typography variant="caption" color="text.secondary">{r.desc}</Typography></Box><ArrowForwardIosIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
        </Paper>)}</Stack>
      </Box>
    </Box>
  </Box>
}
