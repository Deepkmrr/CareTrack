import { useEffect, useState } from 'react'
import { Alert, Button, Container, Form, Modal, Table } from 'react-bootstrap'
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import Shell from '../../components/layout/Shell'
import { Eyebrow, Main, Panel, Primary, SectionTitle, SoftButton } from '../../components/ui/Styled'
import { request } from '../../services/api'

const emptyPerson = {
  name: '',
  specialty: 'Family Medicine',
  email: '',
  date_of_birth: '',
  contact: ''
}

export default function PeoplePage({ type }) {
  const isClinician = type === 'clinician'
  const [people, setPeople] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyPerson)
  const [error, setError] = useState('')
  const endpoint = isClinician ? '/clinicians' : '/patients'
  const title = isClinician ? 'Clinicians' : 'Patients'

  const loadPeople = () =>
    request(endpoint)
      .then(setPeople)
      .catch((loadError) => setError(loadError.message))
  useEffect(() => {
    loadPeople()
  }, [endpoint])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyPerson)
    setShowForm(true)
  }

  const openEdit = (person) => {
    setEditing(person)
    setForm({ ...emptyPerson, ...person })
    setShowForm(true)
  }

  const save = async (event) => {
    event.preventDefault()
    try {
      await request(editing ? `${endpoint}/${editing.id}` : endpoint, {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify(form)
      })
      setShowForm(false)
      loadPeople()
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  const remove = async (id) => {
    if (!window.confirm(`Remove this ${isClinician ? 'clinician' : 'patient'}?`)) return
    try {
      await request(`${endpoint}/${id}`, { method: 'DELETE' })
      loadPeople()
    } catch (removeError) {
      setError(removeError.message)
    }
  }

  return (
    <Shell
      onLogout={() => {
        localStorage.removeItem('caretrack-auth')
        window.location.reload()
      }}
    >
      <Main>
        <Container className="management-page">
          <div className="page-heading">
            <div>
              <Eyebrow>Directory management</Eyebrow>
              <h1>{title}</h1>
              <p>
                Keep your {isClinician ? 'care team' : 'patient roster'} current and easy to find.
              </p>
            </div>
            <Primary onClick={openCreate}>
              <FiPlus /> Add {isClinician ? 'clinician' : 'patient'}
            </Primary>
          </div>
          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}
          <Panel>
            <div className="panel-heading">
              <div>
                <Eyebrow>{isClinician ? 'Care team' : 'Patient roster'}</Eyebrow>
                <SectionTitle>All {title.toLowerCase()}</SectionTitle>
              </div>
              <span className="record-count">{people.length} records</span>
            </div>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  {isClinician ? (
                    <>
                      <th>Specialty</th>
                      <th>Email</th>
                    </>
                  ) : (
                    <>
                      <th>Date of birth</th>
                      <th>Contact</th>
                    </>
                  )}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {people.map((person) => (
                  <tr key={person.id}>
                    <td>
                      <strong>{person.name}</strong>
                    </td>
                    {isClinician ? (
                      <>
                        <td>{person.specialty}</td>
                        <td>{person.email || 'Not provided'}</td>
                      </>
                    ) : (
                      <>
                        <td>{person.date_of_birth || 'Not provided'}</td>
                        <td>{person.contact || 'Not provided'}</td>
                      </>
                    )}
                    <td>
                      <Button
                        variant="light"
                        className="icon-button"
                        onClick={() => openEdit(person)}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </Button>
                      <Button
                        variant="light"
                        className="icon-button"
                        onClick={() => remove(person.id)}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {!people.length && (
              <div className="empty">
                <h3>No {title.toLowerCase()} yet</h3>
                <p>Add the first record to begin building this directory.</p>
              </div>
            )}
          </Panel>
        </Container>
      </Main>
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editing ? 'Edit' : 'Add'} {isClinician ? 'clinician' : 'patient'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={save}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </Form.Group>
            {isClinician ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Specialty</Form.Label>
                  <Form.Control
                    required
                    value={form.specialty}
                    onChange={(event) => setForm({ ...form, specialty: event.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
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
                    onChange={(event) => setForm({ ...form, date_of_birth: event.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    value={form.contact}
                    onChange={(event) => setForm({ ...form, contact: event.target.value })}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <SoftButton onClick={() => setShowForm(false)}>Cancel</SoftButton>
            <Primary type="submit">Save changes</Primary>
          </Modal.Footer>
        </Form>
      </Modal>
    </Shell>
  )
}
