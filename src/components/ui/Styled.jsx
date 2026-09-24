import styled, { keyframes } from 'styled-components'
import { Button } from 'react-bootstrap'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

export const Page = styled.div`
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
`

export const Main = styled.main`
  animation: ${fadeUp} 0.45s ease both;
`

export const Eyebrow = styled.div`
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 700;
  color: var(--coral);
  margin-bottom: 12px;
`

export const Lead = styled.p`
  font:
    400 1.05rem/1.65 'Source Sans 3',
    sans-serif;
  color: var(--muted);
  max-width: 585px;
`

export const Panel = styled.section`
  background: white;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 28px rgba(15, 76, 92, 0.045);
`

export const SectionTitle = styled.h2`
  font: 700 1.35rem 'DM Sans';
  letter-spacing: -0.045em;
  margin: 0;
`

export const Primary = styled(Button)`
  background: var(--teal);
  border: 0;
  border-radius: 8px;
  padding: 11px 16px;
  font-weight: 700;

  &:hover {
    background: #0a3946;
  }
`

export const SoftButton = styled(Button)`
  border: 1px solid var(--line);
  background: white;
  color: var(--ink);
  border-radius: 8px;
  padding: 10px 15px;

  &:hover {
    background: var(--mint);
    color: var(--teal);
    border-color: #bddbd4;
  }
`
