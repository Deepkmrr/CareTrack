import { Link, useLocation } from 'react-router-dom'
import { Button, Container, Navbar } from 'react-bootstrap'
import styled from 'styled-components'
import { FiActivity, FiChevronDown, FiLogOut } from 'react-icons/fi'
import { Page } from '../ui/Styled'

const Header = styled(Navbar)`
  background: rgba(250, 248, 244, 0.92);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--line);
  padding: 18px 0;
`

export const Brand = styled(Link)`
  font:
    700 1.22rem 'DM Sans',
    sans-serif;
  letter-spacing: -0.04em;
  color: var(--ink);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
`

export const BrandMark = styled.span`
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  background: var(--teal);
  color: white;
  border-radius: 9px;
`

const NavLink = styled(Link)`
  color: var(--muted);
  text-decoration: none;
  font-size: 0.9rem;
  margin-left: 28px;

  &:hover,
  &.active {
    color: var(--teal);
  }
`

export default function Shell({ children, onLogout }) {
  const location = useLocation()

  return (
    <Page>
      <Header expand="md">
        <Container>
          <Brand to="/">
            <BrandMark>
              <FiActivity />
            </BrandMark>
            CareTrack
          </Brand>
          <Navbar.Toggle aria-controls="main-nav">
            <FiChevronDown />
          </Navbar.Toggle>
          <Navbar.Collapse id="main-nav">
            <div className="ms-auto d-flex align-items-center">
              <NavLink className={location.pathname === '/' ? 'active' : ''} to="/">
                Workspace
              </NavLink>
              <NavLink
                className={location.pathname === '/clinicians' ? 'active' : ''}
                to="/clinicians"
              >
                Clinicians
              </NavLink>
              <NavLink className={location.pathname === '/patients' ? 'active' : ''} to="/patients">
                Patients
              </NavLink>
              <NavLink className={location.pathname === '/about' ? 'active' : ''} to="/about">
                About us
              </NavLink>
              <Button variant="link" className="nav-logout" onClick={onLogout}>
                <FiLogOut /> Sign out
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Header>
      {children}
      <footer>
        <Container>
          <div className="footer-inner">
            <Brand to="/">
              <BrandMark>
                <FiActivity />
              </BrandMark>
              CareTrack
            </Brand>
            <span>Quietly better visit records.</span>
            <span>© 2026 CareTrack</span>
          </div>
        </Container>
      </footer>
    </Page>
  )
}
