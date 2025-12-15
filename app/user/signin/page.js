'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from 'firebase/auth'
import { auth } from '@/app/_lib/firebase'
import { useState, Suspense } from 'react'

function SignInForm() {
  const router = useRouter()
  const params = useSearchParams()
  const returnUrl = params?.get('returnUrl') || '/'
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    const email = e.target['email'].value
    const password = e.target['password'].value
    setErrorMessage('')

    try {
      await setPersistence(auth, browserSessionPersistence)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      router.push(returnUrl)
    } catch (err) {
      setErrorMessage(err.message || err.code)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Logowanie</h1>

      {errorMessage && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          <strong>Błąd logowania:</strong> {errorMessage}
        </div>
      )}

      <label>Email</label>
      <input type="email" name="email" required style={{ width: '100%', marginBottom: '10px' }} />

      <label>Hasło</label>
      <input type="password" name="password" required style={{ width: '100%', marginBottom: '10px' }} />

      <button type="submit">Zaloguj</button>
    </form>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <SignInForm />
    </Suspense>
  )
}
