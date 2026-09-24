import { Button } from 'react-bootstrap'
import { FiTrash2 } from 'react-icons/fi'

export default function Person({ person, icon, onDelete }) {
  return (
    <div className="person">
      <span className="person-icon">{icon}</span>
      <div>
        <strong>{person.name}</strong>
        <small>{person.specialty || person.contact || 'Patient record'}</small>
      </div>
      <Button variant="link" onClick={onDelete}>
        <FiTrash2 />
      </Button>
    </div>
  )
}
