import { FiActivity } from 'react-icons/fi'
import Person from '../people/Person'

export default function ClinicianItem({ clinician, onDelete }) {
  return <Person person={clinician} icon={<FiActivity />} onDelete={onDelete} />
}
