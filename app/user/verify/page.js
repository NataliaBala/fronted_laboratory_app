'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { signOut, getAuth, sendEmailVerification } from 'firebase/auth'

export default function VerifyEmail() {
    const searchParams = useSearchParams()
    const email = searchParams?.get('email')
    const fromLogin = searchParams?.get('fromLogin') === 'true'
    const resent = searchParams?.get('resent') === 'true'
    const [resendStatus, setResendStatus] = useState('')

    useEffect(() => {
        const auth = getAuth()
        signOut(auth).catch((error) => {
            console.error("Error signing out:", error)
        })
    }, [])

    const handleResendVerification = async () => {
        window.location.href = `/user/signin?resendVerification=true&email=${encodeURIComponent(email || '')}`
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <h1>Email nie został zweryfikowany</h1>

            {resent && (
                <div style={{
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    padding: '15px',
                    borderRadius: '5px',
                    marginBottom: '20px',
                    border: '1px solid #a7f3d0'
                }}>
                    ✅ Email weryfikacyjny został wysłany ponownie! Sprawdź swoją skrzynkę odbiorczą.
                </div>
            )}

            {fromLogin ? (
                <div>
                    <p>
                        Twoje konto nie zostało jeszcze zweryfikowane. Sprawdź swoją skrzynkę odbiorczą i kliknij w link weryfikacyjny wysłany na adres: <strong>{email}</strong>
                    </p>
                    <p style={{ color: '#dc2626', fontWeight: 'bold' }}>
                        Zostałeś automatycznie wylogowany. Zaloguj się ponownie po weryfikacji email.
                    </p>
                </div>
            ) : (
                <div>
                    <p>
                        Weryfikuj swój adres email klikając w link wysłany na adres: <strong>{email}</strong>
                    </p>
                    <p>
                        Sprawdź swoją skrzynkę odbiorczą i folder spam. Po weryfikacji email będziesz mógł się zalogować.
                    </p>
                </div>
            )}

            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                <h3>Jak zweryfikować email?</h3>
                <ol style={{ textAlign: 'left', display: 'inline-block' }}>
                    <li>Otwórz swoją skrzynkę email ({email})</li>
                    <li>Znajdź email od Firebase z tematem zawierającym &quot;Verify your email&quot;</li>
                    <li>Kliknij w link weryfikacyjny w emailu</li>
                    <li>Po weryfikacji wróć tutaj i kliknij &quot;Przejdź do logowania&quot;</li>
                </ol>
            </div>

            <div style={{ margin: '20px 0' }}>
                <button
                    onClick={handleResendVerification}
                    style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        marginRight: '10px'
                    }}
                >
                    Wyślij ponownie email weryfikacyjny
                </button>
            </div>

            {resendStatus && (
                <div style={{
                    margin: '10px 0',
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: resendStatus.includes('Błąd') ? '#fee2e2' : '#d1fae5',
                    color: resendStatus.includes('Błąd') ? '#dc2626' : '#065f46'
                }}>
                    {resendStatus}
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <a
                    href="/user/signin"
                    style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '10px 20px',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        display: 'inline-block'
                    }}
                >
                    Przejdź do logowania
                </a>
            </div>
        </div>
    )
}