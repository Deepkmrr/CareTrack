import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { FiCalendar, FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import Shell from '../../components/layout/Shell'
import { Eyebrow, Lead, Main, Panel, Primary, SectionTitle } from '../../components/ui/Styled'
import { request } from '../../services/api'
import VisitModal from '../visits/VisitModal'

export default function Dashboard() {
  const [clinicians, setClinicians] = useState([])
  const [patients, setPatients] = useState([])
  const [visits, setVisits] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showVisit, setShowVisit] = useState(false)
  const [editingVisit, setEditingVisit] = useState(null)
  const [error, setError] = useState('')

  const refresh = () =>
    Promise.all([request('/clinicians'), request('/patients'), request('/visits')])
      .then(([clinicianData, patientData, visitData]) => {
        setClinicians(clinicianData)
        setPatients(patientData)
        setVisits(visitData)
      })
      .catch((error) => setError(error.message))

  useEffect(() => {
    refresh()
  }, [])

  const shown = useMemo(
    () =>
      visits.filter((visit) => {
        const matchesFilter =
          filter === 'all' ||
          String(visit.clinician_id) === filter ||
          String(visit.patient_id) === filter
        const searchable =
          `${visit.patient_name} ${visit.clinician_name} ${visit.notes}`.toLowerCase()
        return matchesFilter && searchable.includes(search.toLowerCase())
      }),
    [visits, filter, search]
  )

  return (
    <Shell
      onLogout={() => {
        localStorage.removeItem('caretrack-auth')
        window.location.reload()
      }}
    >
      <Main>
        <Container className="dashboard">
          <div className="hero-row">
            <div>
              <Eyebrow>Thursday, September 24, 2026</Eyebrow>
              <h1 className="hero-title">Good care starts with a clear picture.</h1>
              <Lead>
                Track the rhythm of your practice, keep patient context close, and make each handoff
                feel intentional.
              </Lead>
            </div>
            <div className="hero-stamp">
              <FiCalendar />
              <strong>{visits.length}</strong>
              <span>visits recorded</span>
            </div>
          </div>
          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}
          <Row className="g-4">
            <Col lg={12}>
              <Panel>
                <div className="panel-heading">
                  <div>
                    <Eyebrow>Activity log</Eyebrow>
                    <SectionTitle>Recent visits</SectionTitle>
                  </div>
                  <Primary
                    onClick={() => {
                      setEditingVisit(null)
                      setShowVisit(true)
                    }}
                  >
                    <FiPlus /> Record visit
                  </Primary>
                </div>
                <div className="filters">
                  <div className="search-box">
                    <FiSearch />
                    <Form.Control
                      placeholder="Search patients, clinicians, notes"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </div>
                  <Form.Select value={filter} onChange={(event) => setFilter(event.target.value)}>
                    <option value="all">All people</option>
                    {clinicians.map((clinician) => (
                      <option key={`c${clinician.id}`} value={clinician.id}>
                        {clinician.name}
                      </option>
                    ))}
                    {patients.map((patient) => (
                      <option key={`p${patient.id}`} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                {shown.length ? (
                  <div className="table-wrap">
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Clinician</th>
                          <th>When</th>
                          <th>Feedback</th>
                          <th>Notes</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {shown.map((visit) => (
                          <tr key={visit.id}>
                            <td>
                              <strong>{visit.patient_name}</strong>
                            </td>
                            <td>
                              <span>{visit.clinician_name}</span>
                              <small>{visit.specialty}</small>
                            </td>
                            <td>
                              {new Date(visit.visited_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                              <small>
                                {new Date(visit.visited_at).toLocaleTimeString(undefined, {
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </small>
                            </td>
                            <td>
                              <span className="stars">
                                {'★'.repeat(visit.rating || 0)}
                                <i>{'★'.repeat(5 - (visit.rating || 0))}</i>
                              </span>
                              {visit.comment && <small>{visit.comment}</small>}
                            </td>
                            <td className="notes">{visit.notes || 'No notes added.'}</td>
                            <td>
                              <Button
                                className="icon-button"
                                variant="light"
                                title="Edit visit"
                                onClick={() => {
                                  setEditingVisit(visit)
                                  setShowVisit(true)
                                }}
                              >
                                <FiEdit2 />
                              </Button>
                              <Button
                                className="icon-button"
                                variant="light"
                                title="Delete visit"
                                onClick={() =>
                                  request(`/visits/${visit.id}`, { method: 'DELETE' }).then(refresh)
                                }
                              >
                                <FiTrash2 />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="empty">
                    <FiCalendar />
                    <h3>No matching visits</h3>
                    <p>Try another filter or record the team's next visit.</p>
                  </div>
                )}
              </Panel>
            </Col>
          </Row>
        </Container>
      </Main>
      <VisitModal
        show={showVisit}
        close={() => {
          setShowVisit(false)
          setEditingVisit(null)
        }}
        clinicians={clinicians}
        patients={patients}
        visit={editingVisit}
        onSaved={refresh}
      />
    </Shell>
  )
}
