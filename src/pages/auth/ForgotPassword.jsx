import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Paper, Typography } from '@mui/material'

export default function ForgotPassword() {
  const navigate = useNavigate()
  return <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid', placeItems: 'center', p: 2 }}>
    <Paper elevation={0} sx={{ width: '100%', maxWidth: 480, p: 4, borderRadius: 4 }}>
      <Typography variant="h5" fontWeight={800} gutterBottom>Password recovery</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>Password and OTP recovery will be provided by the institution identity service. It is not configured in this frontend prototype.</Alert>
      <Button variant="contained" onClick={() => navigate('/select-role')}>Back to role selection</Button>
    </Paper>
  </Box>
}
