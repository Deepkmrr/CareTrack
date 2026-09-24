import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const db = new Database(path.join(__dirname, 'caretrack.db'))
db.pragma('foreign_keys = ON')
db.exec(`
  CREATE TABLE IF NOT EXISTS clinicians (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    email TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date_of_birth TEXT DEFAULT '',
    contact TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clinician_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    visited_at TEXT NOT NULL,
    notes TEXT DEFAULT '',
    rating INTEGER DEFAULT 0,
    comment TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clinician_id) REFERENCES clinicians(id) ON DELETE RESTRICT,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT
  );
`)

const seed = db.transaction(() => {
  if (db.prepare('SELECT COUNT(*) AS count FROM clinicians').get().count === 0) {
    db.prepare('INSERT INTO clinicians (name, specialty, email) VALUES (?, ?, ?)').run(
      'Dr. Maya Patel',
      'Family Medicine',
      'maya.patel@caretrack.local'
    )
    db.prepare('INSERT INTO clinicians (name, specialty, email) VALUES (?, ?, ?)').run(
      'Dr. Julian Reed',
      'Cardiology',
      'julian.reed@caretrack.local'
    )
    db.prepare('INSERT INTO clinicians (name, specialty, email) VALUES (?, ?, ?)').run(
      'Dr. Lena Ortiz',
      'Pediatrics',
      'lena.ortiz@caretrack.local'
    )
  }
  if (db.prepare('SELECT COUNT(*) AS count FROM patients').get().count === 0) {
    db.prepare('INSERT INTO patients (name, date_of_birth, contact) VALUES (?, ?, ?)').run(
      'Amelia Carter',
      '1988-04-16',
      '(555) 014-2290'
    )
    db.prepare('INSERT INTO patients (name, date_of_birth, contact) VALUES (?, ?, ?)').run(
      'Marcus Green',
      '1975-11-02',
      '(555) 018-4901'
    )
    db.prepare('INSERT INTO patients (name, date_of_birth, contact) VALUES (?, ?, ?)').run(
      'Sofia Nguyen',
      '2001-08-27',
      '(555) 019-7734'
    )
  }
  if (db.prepare('SELECT COUNT(*) AS count FROM visits').get().count === 0) {
    db.prepare(
      'INSERT INTO visits (clinician_id, patient_id, visited_at, notes, rating, comment) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(
      1,
      1,
      new Date(Date.now() - 86400000).toISOString(),
      'Routine follow-up. Blood pressure is trending down.',
      5,
      'Clear care plan and reassuring follow-up.'
    )
    db.prepare(
      'INSERT INTO visits (clinician_id, patient_id, visited_at, notes, rating, comment) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(
      2,
      2,
      new Date(Date.now() - 172800000).toISOString(),
      'Reviewed ECG results and medication schedule.',
      4,
      'Patient felt heard and well prepared.'
    )
  }
})
seed()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/clinicians', (_req, res) =>
  res.json(db.prepare('SELECT * FROM clinicians ORDER BY name').all())
)
app.post('/api/clinicians', (req, res) => {
  const { name, specialty, email = '' } = req.body
  if (!name || !specialty)
    return res.status(400).json({ error: 'Name and specialty are required.' })
  const result = db
    .prepare('INSERT INTO clinicians (name, specialty, email) VALUES (?, ?, ?)')
    .run(name, specialty, email)
  res
    .status(201)
    .json(db.prepare('SELECT * FROM clinicians WHERE id = ?').get(result.lastInsertRowid))
})
app.put('/api/clinicians/:id', (req, res) => {
  const { name, specialty, email = '' } = req.body
  if (!name || !specialty)
    return res.status(400).json({ error: 'Name and specialty are required.' })
  db.prepare('UPDATE clinicians SET name = ?, specialty = ?, email = ? WHERE id = ?').run(
    name,
    specialty,
    email,
    req.params.id
  )
  res.json(db.prepare('SELECT * FROM clinicians WHERE id = ?').get(req.params.id))
})
app.delete('/api/clinicians/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM clinicians WHERE id = ?').run(req.params.id)
    res.status(204).end()
  } catch {
    res.status(409).json({ error: 'Clinician has recorded visits and cannot be removed.' })
  }
})

app.get('/api/patients', (_req, res) =>
  res.json(db.prepare('SELECT * FROM patients ORDER BY name').all())
)
app.post('/api/patients', (req, res) => {
  const { name, date_of_birth = '', contact = '' } = req.body
  if (!name) return res.status(400).json({ error: 'Patient name is required.' })
  const result = db
    .prepare('INSERT INTO patients (name, date_of_birth, contact) VALUES (?, ?, ?)')
    .run(name, date_of_birth, contact)
  res
    .status(201)
    .json(db.prepare('SELECT * FROM patients WHERE id = ?').get(result.lastInsertRowid))
})
app.put('/api/patients/:id', (req, res) => {
  const { name, date_of_birth = '', contact = '' } = req.body
  if (!name) return res.status(400).json({ error: 'Patient name is required.' })
  db.prepare('UPDATE patients SET name = ?, date_of_birth = ?, contact = ? WHERE id = ?').run(
    name,
    date_of_birth,
    contact,
    req.params.id
  )
  res.json(db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id))
})
app.delete('/api/patients/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM patients WHERE id = ?').run(req.params.id)
    res.status(204).end()
  } catch {
    res.status(409).json({ error: 'Patient has recorded visits and cannot be removed.' })
  }
})

app.get('/api/visits', (_req, res) =>
  res.json(
    db
      .prepare(
        `
  SELECT visits.*, clinicians.name AS clinician_name, clinicians.specialty, patients.name AS patient_name
  FROM visits JOIN clinicians ON clinicians.id = visits.clinician_id JOIN patients ON patients.id = visits.patient_id
  ORDER BY datetime(visits.visited_at) DESC
`
      )
      .all()
  )
)
app.post('/api/visits', (req, res) => {
  const { clinician_id, patient_id, visited_at, notes = '', rating = 0, comment = '' } = req.body
  if (!clinician_id || !patient_id || !visited_at)
    return res.status(400).json({ error: 'Clinician, patient, and visit time are required.' })
  const result = db
    .prepare(
      'INSERT INTO visits (clinician_id, patient_id, visited_at, notes, rating, comment) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(clinician_id, patient_id, visited_at, notes, rating, comment)
  res.status(201).json(db.prepare('SELECT * FROM visits WHERE id = ?').get(result.lastInsertRowid))
})
app.put('/api/visits/:id', (req, res) => {
  const { clinician_id, patient_id, visited_at, notes = '', rating = 0, comment = '' } = req.body
  if (!clinician_id || !patient_id || !visited_at) {
    return res.status(400).json({ error: 'Clinician, patient, and visit time are required.' })
  }
  db.prepare(
    'UPDATE visits SET clinician_id = ?, patient_id = ?, visited_at = ?, notes = ?, rating = ?, comment = ? WHERE id = ?'
  ).run(clinician_id, patient_id, visited_at, notes, rating, comment, req.params.id)
  res.json(db.prepare('SELECT * FROM visits WHERE id = ?').get(req.params.id))
})
app.delete('/api/visits/:id', (req, res) => {
  db.prepare('DELETE FROM visits WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

app.listen(3001, () => console.log('CareTrack API running on http://localhost:3001'))
