import { useEffect, useState } from 'react'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import { FiCheck } from 'react-icons/fi'
import { Primary, SoftButton } from '../../components/ui/Styled'
import { request } from '../../services/api'

const initialForm = {
  clinician_id: '',
  patient_id: '',
  visited_at: new Date().toISOString().slice(0, 16),
  notes: '',
  rating: 5,
  comment: ''
}

export default function VisitModal({ show, close, clinicians, patients, visit, onSaved }) {
  const [form, setForm] = useState(initialForm)
  const set = (key, value) => setForm({ ...form, [key]: value })
  useEffect(() => {
    if (visit) {
      setForm({
        clinician_id: visit.clinician_id,
        patient_id: visit.patient_id,
        visited_at: visit.visited_at.slice(0, 16),
        notes: visit.notes || '',
        rating: visit.rating || 5,
        comment: visit.comment || ''
      })
    } else if (show) {
      setForm({ ...initialForm, visited_at: new Date().toISOString().slice(0, 16) })
    }
  }, [visit, show])
  const save = async (event) => {
    event.preventDefault()
    await request(visit ? `/visits/${visit.id}` : '/visits', {
      method: visit ? 'PUT' : 'POST',
      body: JSON.stringify(form)
    })
    close()
    onSaved()
    setForm({ ...initialForm, visited_at: new Date().toISOString().slice(0, 16) })
  }

  return (
    <Modal show={show} onHide={close} centered>
      <Modal.Header closeButton>
        <Modal.Title>{visit ? 'Edit visit' : 'Record a visit'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={save}>
        <Modal.Body>
          <Row className="g-3">
            <Col sm={6}>
              <Form.Label>Clinician</Form.Label>
              <Form.Select
                required
                value={form.clinician_id}
                onChange={(event) => set('clinician_id', event.target.value)}
              >
                <option value="">Choose clinician</option>
                {clinicians.map((clinician) => (
                  <option key={clinician.id} value={clinician.id}>
                    {clinician.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col sm={6}>
              <Form.Label>Patient</Form.Label>
              <Form.Select
                required
                value={form.patient_id}
                onChange={(event) => set('patient_id', event.target.value)}
              >
                <option value="">Choose patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col sm={6}>
              <Form.Label>Date and time</Form.Label>
              <Form.Control
                type="datetime-local"
                required
                value={form.visited_at}
                onChange={(event) => set('visited_at', event.target.value)}
              />
            </Col>
            <Col sm={6}>
              <Form.Label>Rating</Form.Label>
              <Form.Select
                value={form.rating}
                onChange={(event) => set('rating', event.target.value)}
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} stars
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={12}>
              <Form.Label>Clinical notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.notes}
                onChange={(event) => set('notes', event.target.value)}
                placeholder="What should the team remember?"
              />
            </Col>
            <Col xs={12}>
              <Form.Label>Patient comment</Form.Label>
              <Form.Control
                value={form.comment}
                onChange={(event) => set('comment', event.target.value)}
                placeholder="Optional feedback or follow-up note"
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <SoftButton onClick={close}>Cancel</SoftButton>
          <Primary type="submit">
            {visit ? 'Save changes' : 'Save visit'} <FiCheck />
          </Primary>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
