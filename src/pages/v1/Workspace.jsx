import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Box, Button, Checkbox, Chip, FormControlLabel, Grid, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'

const STORAGE = 'mitraa_v1_pilot_records'
const MODULES = {
  overview: { title: 'Pilot overview', intro: 'A single workspace for the school and preschool V1 journeys.', fields: [] },
  institution: { title: 'Institution setup', intro: 'Configure the pilot campus, academic year and learner groups.', fields: [['campus','Campus name'],['year','Academic year'],['group','Class or preschool group']] },
  learners: { title: 'Student & guardian register', intro: 'Add a learner and guardian or preview CSV rows before importing.', fields: [['name','Learner full name'],['group','Class or group'],['guardian','Guardian name'],['contact','Guardian email or phone']] },
  attendance: { title: 'Daily attendance', intro: 'Select a class and date, review each mark, then submit the register once.', fields: [['group','Class or group'],['learner','Learner name'],['date','Attendance date','date'],['status','Attendance status','select']] },
  notices: { title: 'Notices & communication', intro: 'Choose an audience, preview recipients and confirm before publishing.', fields: [['title','Notice title'],['audience','Class or school audience'],['message','Message']] },
  homework: { title: 'Homework & learning', intro: 'Publish a class task, record a learner submission and provide private feedback.', fields: [['title','Task title'],['group','Class or group'],['due','Due date','date'],['details','Instructions or learning link']] },
  fees: { title: 'Fees & receipts', intro: 'Record charges and verified collections. A receipt is generated for each collection.', fields: [['learner','Learner name'],['amount','Amount (₹)','number'],['description','Charge or collection note']] },
  care: { title: 'Daily care log', intro: 'Keep a short text care summary for authorised staff and guardians.', fields: [['learner','Learner name'],['date','Care date','date'],['summary','Care summary']] },
  pickup: { title: 'Authorised pickup & handover', intro: 'Check the authorised list and record identity check, handover time and responsible staff.', fields: [['learner','Learner name'],['collector','Authorised collector'],['checkedBy','Staff member'],['status','Handover status','pickup']] },
  transport: { title: 'Transport · manual fallback', intro: 'Live tracking is not enabled in this pilot. It can be considered only after the existing GPS provider feed and device-to-vehicle mapping pass the Day 3 proof.', fields: [] },
  requests: { title: 'Absence & correction requests', intro: 'Review parent absence requests and preserve attendance history when corrections are approved.', fields: [['learner','Learner name'],['date','Date','date'],['reason','Reason or correction detail']] },
  reports: { title: 'Basic reports', intro: 'Review pilot attendance, learner and fee activity summaries.', fields: [] },
  audit: { title: 'Audit history', intro: 'Important prototype actions are listed with actor and timestamp.', fields: [] },
}

const ACCESS = {
  admin: ['overview','institution','learners','attendance','notices','homework','fees','care','pickup','transport','requests','reports','audit'],
  teacher: ['overview','learners','attendance','notices','homework','requests','reports'],
  staff: ['overview','institution','learners','attendance','notices','pickup','transport','requests','reports','audit'],
  finance: ['overview','learners','fees','reports','audit'],
  preschool: ['overview','learners','attendance','notices','homework','care','pickup','requests'],
  parent: ['overview','attendance','notices','homework','fees','care','requests'],
}
const LABELS = { overview: 'Overview', institution: 'Institution setup', learners: 'Learners & guardians', attendance: 'Attendance', notices: 'Notices', homework: 'Homework', fees: 'Fees & receipts', care: 'Care log', pickup: 'Pickup & handover', transport: 'Transport fallback', requests: 'Requests', reports: 'Reports', audit: 'Audit history' }

function readStore() { try { return JSON.parse(localStorage.getItem(STORAGE) || '{}') } catch { return {} } }
function fieldProps(field) {
  const [key, label, type] = field
  if (type === 'select') return { select: true, children: ['Present','Absent','Late','Excused'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>) }
  if (type === 'pickup') return { select: true, children: ['Handed over','Stopped — identity mismatch','Escalated'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>) }
  return { type: type || 'text', ...(key === 'amount' ? { inputProps: { min: 0, step: '0.01' } } : {}) }
}

export default function Workspace() {
  const { module = 'overview' } = useParams()
  const { user } = useAuth()
  const allowed = ACCESS[user?.role] || []
  const current = allowed.includes(module) ? module : 'overview'
  const config = MODULES[current]
  const [records, setRecords] = useState(readStore)
  const [values, setValues] = useState({})
  const [notice, setNotice] = useState('')
  const [csvRows, setCsvRows] = useState([])
  const list = records[current] || []
  const all = useMemo(() => Object.values(records).flat(), [records])
  const ownChild = (entry) => user?.role !== 'parent' || !entry.learner || entry.learner.toLowerCase().includes('aarav')
  const visible = list.filter(ownChild)

  const save = (entry, message) => {
    const next = { ...records, [current]: [...(records[current] || []), entry] }
    localStorage.setItem(STORAGE, JSON.stringify(next)); setRecords(next)
    const auditEntry = { title: `${LABELS[current]}: ${message}`, actor: user?.name || 'Pilot user', createdAt: new Date().toLocaleString() }
    if (current !== 'audit') {
      const audited = { ...next, audit: [...(next.audit || []), auditEntry] }
      localStorage.setItem(STORAGE, JSON.stringify(audited)); setRecords(audited)
    }
    setValues({}); setNotice(message)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (current === 'attendance' && list.some(item => item.date === values.date && item.group === values.group)) { setNotice('An attendance register is already recorded for this class and date.'); return }
    if (current === 'attendance' && values._confirm !== 'yes') { setNotice(`Review register: ${values.learner} · ${values.group} · ${values.date} · ${values.status}. Submit this register once?`); setValues({ ...values, _confirm: 'yes' }); return }
    if (current === 'notices') {
      const audience = values.audience || 'School-wide'
      setNotice(`Recipient preview: ${audience} · ${all.filter(item => item.type === 'learner').length || 2} recipients. Confirm publish below.`)
      setValues({ ...values, _confirm: 'yes' }); return
    }
    if (current === 'pickup' && values.status !== 'Handed over') { save({ ...values, createdAt: new Date().toLocaleString(), type: 'pickup-exception' }, 'Handover stopped and escalation recorded'); return }
    const entry = { ...values, createdAt: new Date().toLocaleString(), actor: user?.name, institutionId: user?.institutionId, type: current === 'learners' ? 'learner' : current }
    if (current === 'pickup' && values.status === 'Handed over') entry.handoverAt = new Date().toLocaleTimeString()
    if (current === 'fees') entry.receipt = `RCPT-${Date.now().toString().slice(-7)}`
    save(entry, current === 'attendance' ? 'Attendance register submitted' : current === 'fees' ? `Fee record saved${entry.receipt ? ` · receipt ${entry.receipt}` : ''}` : `${LABELS[current]} saved`)
  }

  const importCsv = async (file) => {
    if (!file) return
    const text = await file.text()
    const rows = text.split(/\r?\n/).filter(Boolean).map(line => line.split(',').map(part => part.trim()))
    const headers = rows.shift() || []
    const priorNames = new Set((records.learners || []).map(item => item.name?.trim().toLowerCase()))
    const seenNames = new Set()
    setCsvRows(rows.map((row, index) => {
      const name = row[0] || ''
      const normalized = name.trim().toLowerCase()
      const duplicate = !!normalized && (priorNames.has(normalized) || seenNames.has(normalized))
      if (normalized) seenNames.add(normalized)
      return { name, group: row[1] || '', guardian: row[2] || '', valid: !!name && !!row[1] && !duplicate, error: duplicate ? 'Duplicate learner' : (!name || !row[1] ? 'Missing required fields' : ''), line: index + 2, headers }
    }))
    setNotice(`CSV preview ready. ${rows.length} rows found; check validation before importing.`)
  }

  if (!allowed.includes(module) && module !== 'overview') return <Alert severity="warning">This workspace is not available for the current role.</Alert>
  return <Stack spacing={2.5}>
    <Box><Typography variant="h4" fontWeight={800}>{config.title}</Typography><Typography color="text.secondary">{config.intro}</Typography><Chip size="small" label={`${user?.institution || 'Pilot institution'} · Prototype data on this browser`} sx={{ mt: 1 }} /></Box>
    {current === 'transport' && <Alert severity="info">Manual fallback: prepare and reconcile passenger manifests with staff at trip closure, and physically confirm each child. Use the pickup and handover register to record responsible staff and exceptions. Do not use live family tracking until provider access and device mapping are approved.</Alert>}
    {current === 'overview' && <Grid container spacing={2}>{[
      ['Learners', all.filter(item => item.type === 'learner').length], ['Attendance records', (records.attendance || []).length], ['Open requests', (records.requests || []).length], ['Fee activity', (records.fees || []).length],
    ].map(([label, value]) => <Grid item xs={6} md={3} key={label}><Paper elevation={0} sx={{ p: 2.5, borderRadius: 3 }}><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h4" fontWeight={800}>{value}</Typography></Paper></Grid>)}</Grid>}
    {['reports','audit'].includes(current) && <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}><Typography fontWeight={700} gutterBottom>{current === 'audit' ? 'Recent actions' : 'Pilot summary'}</Typography><Typography color="text.secondary">{current === 'reports' ? `${(records.learners || []).length} learners · ${(records.attendance || []).length} attendance entries · ${(records.fees || []).length} fee records` : `${(records.audit || []).length} actions recorded`}</Typography>{current === 'audit' && (records.audit || []).slice().reverse().map((item, i) => <Typography key={i} sx={{ mt: 1 }}>{item.createdAt} · {item.actor}: {item.title}</Typography>)}</Paper>}
    {config.fields.length > 0 && <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
      {current === 'pickup' && <Alert severity="warning" sx={{ mb: 2 }}>Physically check the collector’s identity against the authorised pickup list. Stop and escalate if the match is uncertain or expired.</Alert>}
      {current === 'learners' && <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center', flexWrap: 'wrap' }}><Button component="label" variant="outlined">Choose CSV<input hidden type="file" accept=".csv,text/csv" onChange={e => importCsv(e.target.files?.[0])} /></Button><Typography variant="caption" color="text.secondary">CSV columns: learner name, class/group, guardian name, guardian contact</Typography></Stack>}
      <Box component="form" onSubmit={handleSubmit}><Grid container spacing={1.5}>{config.fields.map(field => {
        const [key, label] = field
        return <Grid item xs={12} sm={key === 'message' || key === 'summary' || key === 'details' || key === 'reason' ? 12 : 6} key={key}><TextField fullWidth multiline={['message','summary','details','reason'].includes(key)} minRows={key === 'message' || key === 'summary' || key === 'details' || key === 'reason' ? 3 : undefined} required label={label} value={values[key] || ''} onChange={e => setValues({ ...values, [key]: e.target.value })} {...fieldProps(field)} /></Grid>
      })}</Grid>
        {current === 'pickup' && <FormControlLabel sx={{ mt: 1 }} control={<Checkbox required={values.status === 'Handed over'} checked={!!values.identityChecked} onChange={e => setValues({ ...values, identityChecked: e.target.checked })} />} label="I physically checked the collector against the authorised pickup list" />}
        {notice && <Alert severity={notice.includes('already') || notice.includes('stopped') ? 'warning' : 'success'} sx={{ mt: 2 }}>{notice}</Alert>}
        {['notices','attendance'].includes(current) && values._confirm === 'yes' ? <Button sx={{ mt: 2 }} variant="contained" onClick={() => {
          const entry = { ...values, createdAt: new Date().toLocaleString(), actor: user?.name, institutionId: user?.institutionId, type: current }
          save(entry, current === 'notices' ? 'Notice published after recipient confirmation' : 'Attendance register submitted after review')
        }}>{current === 'notices' ? 'Confirm & publish notice' : 'Confirm & submit register'}</Button> : <Button sx={{ mt: 2 }} variant="contained" type="submit">{current === 'attendance' ? 'Review register' : current === 'pickup' ? 'Record identity check & handover' : current === 'learners' ? 'Add learner' : current === 'notices' ? 'Preview recipients' : 'Save record'}</Button>}
      </Box>
      {current === 'learners' && csvRows.length > 0 && <Box sx={{ mt: 3 }}><Typography fontWeight={700}>Import preview · {csvRows.filter(row => row.valid).length} valid / {csvRows.filter(row => !row.valid).length} invalid</Typography><Table size="small"><TableHead><TableRow><TableCell>Row</TableCell><TableCell>Learner</TableCell><TableCell>Group</TableCell><TableCell>Guardian</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>{csvRows.map(row => <TableRow key={row.line}><TableCell>{row.line}</TableCell><TableCell>{row.name || '—'}</TableCell><TableCell>{row.group || '—'}</TableCell><TableCell>{row.guardian || '—'}</TableCell><TableCell>{row.valid ? 'Ready' : row.error}</TableCell></TableRow>)}</TableBody></Table><Button variant="outlined" sx={{ mt: 1 }} disabled={!csvRows.some(row => row.valid)} onClick={() => { const imported = csvRows.filter(row => row.valid).map(row => ({ ...row, type: 'learner', actor: user?.name, createdAt: new Date().toLocaleString() })); const next = { ...records, learners: [...(records.learners || []), ...imported], audit: [...(records.audit || []), { title: `Imported ${imported.length} learners from CSV`, actor: user?.name, createdAt: new Date().toLocaleString() }] }; localStorage.setItem(STORAGE, JSON.stringify(next)); setRecords(next); setCsvRows([]); setNotice('Valid learners imported. Invalid and duplicate rows were left out with their errors shown.') }}>Import valid rows</Button></Box>}
    </Paper>}
    {['requests','attendance','notices','homework','fees','care','pickup','learners','institution'].includes(current) && <Paper elevation={0} sx={{ p: 2, borderRadius: 3, overflowX: 'auto' }}><Typography fontWeight={700} gutterBottom>Recent {LABELS[current].toLowerCase()}</Typography>{visible.length ? <Table size="small"><TableHead><TableRow><TableCell>Record</TableCell><TableCell>Details</TableCell><TableCell>Status / Receipt</TableCell><TableCell>Created</TableCell></TableRow></TableHead><TableBody>{visible.slice().reverse().map((item, i) => <TableRow key={i}><TableCell>{item.title || item.name || item.learner || item.campus || 'Record'}{item.receipt && <Typography variant="caption" display="block">{item.receipt}</Typography>}</TableCell><TableCell>{item.status || item.summary || item.message || item.description || item.group || item.year || item.details || '—'}</TableCell><TableCell>{item.status || (current === 'notices' ? 'Published' : 'Saved')}</TableCell><TableCell>{item.createdAt}</TableCell></TableRow>)}</TableBody></Table> : <Typography variant="body2" color="text.secondary">No records yet. New entries will appear here.</Typography>}</Paper>}
    <Alert severity="info">Prototype boundary: this browser stores sample workflow data locally. Production sign-in, institution isolation, verified guardian links, email delivery, file storage, audit guarantees and backups require server APIs.</Alert>
  </Stack>
}
