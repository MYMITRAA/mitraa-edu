import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { ROLE_DASHBOARD_PATH } from '../../data/mockData'

const labels = { admin: 'Administrator', teacher: 'Teacher', staff: 'Staff', finance: 'Finance', preschool: 'Preschool Educator', parent: 'Parent / Guardian' }

export default function Login() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const role = params.get('role')
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true)
    const result = await login(email, '', role)
    setLoading(false)
    if (!result.success) { setError(result.message); return }
    navigate(ROLE_DASHBOARD_PATH[role], { replace: true })
  }
  return <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid', placeItems: 'center', p: 2 }}>
    <Paper elevation={0} sx={{ width: '100%', maxWidth: 460, p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
      <Button onClick={() => navigate('/select-role')} sx={{ mb: 1 }}>← Change role</Button>
      <Typography variant="h4" fontWeight={800} gutterBottom>Open {labels[role] || 'pilot'} workspace</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>Enter a display name or email to preview the V1 journey.</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>Prototype session only. No credentials are collected or verified here. Use the institution’s invited sign-in once the identity API is connected.</Alert>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={submit}>
        <TextField fullWidth required label="Your name or email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="name" sx={{ mb: 2 }} />
        <Button fullWidth type="submit" variant="contained" size="large" disabled={loading || !ROLE_DASHBOARD_PATH[role]}>{loading ? 'Opening…' : 'Open prototype workspace'}</Button>
      </Box>
    </Paper>
  </Box>
}
