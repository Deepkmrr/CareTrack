import { Col, Container, Row } from 'react-bootstrap'
import { FiCheck, FiShield, FiUsers } from 'react-icons/fi'
import Shell from '../../components/layout/Shell'
import { Eyebrow, Lead, Main, Panel } from '../../components/ui/Styled'

export default function About() {
  return (
    <Shell
      onLogout={() => {
        localStorage.removeItem('caretrack-auth')
        window.location.reload()
      }}
    >
      <Main>
        <Container className="about-page">
          <Eyebrow>Why CareTrack</Eyebrow>
          <h1>Less hunting. More caring.</h1>
          <Lead>
            CareTrack gives small clinical teams one clear view of who was seen, by whom, and what
            matters next.
          </Lead>
          <Row className="g-4 mt-4">
            <Col md={4}>
              <Panel>
                <FiUsers className="feature-icon" />
                <h3>Shared context</h3>
                <p>
                  Clinicians and patient records live alongside visit notes, ratings, and follow-up
                  comments.
                </p>
              </Panel>
            </Col>
            <Col md={4}>
              <Panel>
                <FiShield className="feature-icon" />
                <h3>Local first</h3>
                <p>
                  Your demo workspace persists to a local SQLite database through a focused Node
                  API.
                </p>
              </Panel>
            </Col>
            <Col md={4}>
              <Panel>
                <FiCheck className="feature-icon" />
                <h3>Ready for routine</h3>
                <p>
                  Fast filters and a chronological feed make daily review feel simple and
                  dependable.
                </p>
              </Panel>
            </Col>
          </Row>
        </Container>
      </Main>
    </Shell>
  )
}
