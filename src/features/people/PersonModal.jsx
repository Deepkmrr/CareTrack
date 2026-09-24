import { useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import { FiCheck } from 'react-icons/fi'
import { Primary, SoftButton } from '../../components/ui/Styled'

const initialForm = {
  name: '',
  specialty: 'Family Medicine',
  email: '',
  date_of_birth: '',
  contact: ''
}

export default function PersonModal({ show, close, onSave }) {
  const [form, setForm] = useState(initialForm)
  const set = (key, value) => setForm({ ...form, [key]: value })
  const submit = (event) => {
    event.preventDefault()
    onSave(form)
    setForm(initialForm)
  }

  return (
    <Modal show={!!show} onHide={close} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add {show}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              value={form.name}
              onChange={(event) => set('name', event.target.value)}
              placeholder="Full name"
            />
          </Form.Group>
          {show === 'clinician' ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Specialty</Form.Label>
                <Form.Control
                  required
                  value={form.specialty}
                  onChange={(event) => set('specialty', event.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={form.email}
                  onChange={(event) => set('email', event.target.value)}
                />
              </Form.Group>
            </>
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Date of birth</Form.Label>
                <Form.Control
                  type="date"
                  value={form.date_of_birth}
                  onChange={(event) => set('date_of_birth', event.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  value={form.contact}
                  onChange={(event) => set('contact', event.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <SoftButton onClick={close}>Cancel</SoftButton>
          <Primary type="submit">
            Add record <FiCheck />
          </Primary>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
