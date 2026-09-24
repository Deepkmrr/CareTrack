import { useState } from 'react'
import { Form } from 'react-bootstrap'
import { FiActivity, FiArrowRight, FiShield } from 'react-icons/fi'
import { Brand, BrandMark } from '../../components/layout/Shell'
import { Eyebrow, Page, Primary } from '../../components/ui/Styled'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')

  return (
    <Page>
      <div className="login-wrap">
        <div className="login-aside">
          <Eyebrow>Internal care workspace</Eyebrow>
          <h1>Make every visit count.</h1>
          <p>One calm, shared record for the people caring for your patients.</p>
          <div className="aside-note">
            <FiShield /> Private by design. Built for clinical teams.
          </div>
        </div>
        <div className="login-card">
          <Brand to="/">
            <BrandMark>
              <FiActivity />
            </BrandMark>
            CareTrack
          </Brand>
          <h2>Welcome back</h2>
          <p>Sign in to your team's visit workspace.</p>
          <Form
            onSubmit={(event) => {
              event.preventDefault()
              onLogin()
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Work email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@clinic.org"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" defaultValue="caretrack" required />
            </Form.Group>
            <Primary type="submit" className="w-100">
              Enter workspace <FiArrowRight />
            </Primary>
          </Form>
          <small>Demo access is enabled for this local workspace.</small>
        </div>
      </div>
    </Page>
  )
}
