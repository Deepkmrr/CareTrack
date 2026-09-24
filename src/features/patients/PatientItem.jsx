import { FiUsers } from 'react-icons/fi'
import Person from '../people/Person'

export default function PatientItem({ patient, onDelete }) {
  return <Person person={patient} icon={<FiUsers />} onDelete={onDelete} />
}
