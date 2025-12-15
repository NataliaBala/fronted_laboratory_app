'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from './_lib/authcontext'
import Calendar from './_components/Calendar'

function LandingPage() {
  const { user, loading } = useAuth()
  const [active, setActive] = useState(null)

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Ładowanie aplikacji...
      </div>
    );
  }

  if (user) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setActive('kalendarz')}
            style={primaryButton}
          >
            📅 Kalendarz
          </button>
        </div>

        {active === 'kalendarz' && (
          <div style={{ width: '100%', maxWidth: '1100px', minHeight: '70vh' }}>
            <Calendar />
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#1f2937'
      }}>
        Laboratorium App
      </h1>

      <p style={{
        fontSize: '1.25rem',
        color: '#6b7280',
        marginBottom: '2rem',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        Zarządzaj zadaniami w kalendarzu. Planuj eksperymenty, śledź wyniki i organizuj pracę naukową.
      </p>

      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link
          href="/user/signin"
          style={primaryLink}
        >
          Zaloguj się
        </Link>

        <Link
          href="/user/register"
          style={secondaryLink}
        >
          Zarejestruj się
        </Link>
      </div>
    </div>
  );
}

const primaryButton = {
  minWidth: '180px',
  padding: '16px 22px',
  fontSize: '16px',
  fontWeight: 600,
  color: 'white',
  background: '#3b82f6',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  boxShadow: '0 10px 30px rgba(59,130,246,0.25)'
}

const secondaryButton = primaryButton

const primaryLink = {
  backgroundColor: '#3b82f6',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '1.1rem',
  fontWeight: '500',
  transition: 'background-color 0.2s'
}

const secondaryLink = {
  backgroundColor: 'white',
  color: '#3b82f6',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '1.1rem',
  fontWeight: '500',
  border: '2px solid #3b82f6',
  transition: 'all 0.2s'
}

export default LandingPage
