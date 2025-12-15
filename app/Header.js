'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/_lib/authcontext'
import { useState, useEffect } from 'react'
import { db } from '@/app/_lib/firebase'
import { setDoc, doc, getDoc } from 'firebase/firestore'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'

export default function Header() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [showPanel, setShowPanel] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    street: '',
    city: '',
    zipCode: '',
    profilePhotoUrl: ''
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
    setIsClient(true)
  }, [])

  async function loadProfileData() {
    if (!user?.uid) return
    setProfileLoading(true)
    try {
      const snapshot = await getDoc(doc(db, 'users', user.uid))
      if (snapshot.exists()) {
        const data = snapshot.data()
        const address = data.address || {}
        setProfileData(prev => ({
          ...prev,
          displayName: data.displayName || prev.displayName || '',
          email: user.email || prev.email || '',
          street: address.street || '',
          city: address.city || '',
          zipCode: address.zipCode || '',
          profilePhotoUrl: data.profilePhotoUrl || ''
        }))
      } else {
        setProfileData(prev => ({
          ...prev,
          displayName: user?.displayName || prev.displayName || '',
          email: user?.email || prev.email || '',
          street: '',
          city: '',
          zipCode: '',
          profilePhotoUrl: ''
        }))
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    if (user?.email) {
      setProfileData(prev => ({ ...prev, email: user.email }))
    }
  }, [user?.email])

  useEffect(() => {
    if (user && showProfile) {
      loadProfileData()
    }
  }, [user, showProfile])

  useEffect(() => {
    if (user?.uid && !profileData.displayName) {
      loadProfileData()
    }
  }, [user?.uid])

  const handleProfileSave = async () => {
    if (!user?.uid) {
      alert('Blad: Nie znaleziono uzytkownika')
      return
    }
    setProfileLoading(true)
    try {
      await setDoc(doc(db, 'users', user.uid), {
        displayName: profileData.displayName,
        address: {
          street: profileData.street,
          city: profileData.city,
          zipCode: profileData.zipCode
        },
        profilePhotoUrl: profileData.profilePhotoUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true })
      alert('Profil zapisany pomyslnie!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Blad przy zapisywaniu profilu: ' + error.message)
    }
    setProfileLoading(false)
  }

  const handleFileSelect = async (file) => {
    if (!file) return
    setProfileLoading(true)
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      setProfileData(prev => ({ ...prev, profilePhotoUrl: base64 }))
    } catch (error) {
      console.error('Error converting file:', error)
      alert('Nie udalo sie wczytac zdjecia')
    }
    setProfileLoading(false)
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    setPasswordSuccess('')
    if (!passwordData.oldPassword) return setPasswordError('Wpisz stare haslo')
    if (!passwordData.newPassword) return setPasswordError('Wpisz nowe haslo')
    if (passwordData.newPassword !== passwordData.confirmPassword) return setPasswordError('Nowe hasla nie sa takie same')
    if (passwordData.newPassword.length < 6) return setPasswordError('Haslo musi miec co najmniej 6 znakow')
    setPasswordLoading(true)
    try {
      const credential = EmailAuthProvider.credential(user.email, passwordData.oldPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, passwordData.newPassword)
      setPasswordSuccess('Haslo zmienione pomyslnie!')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => { setShowChangePassword(false); setShowPanel(false) }, 1500)
    } catch (error) {
      setPasswordError('Blad przy zmianie hasla: ' + error.message)
      console.error('Error changing password:', error)
    }
    setPasswordLoading(false)
  }

  const statusText = loading
    ? 'Ladowanie...'
    : user
    ? `Zalogowano: ${user.email}`
    : 'Niezalogowany'

  if (!isClient) {
    return (
      <header style={{ borderBottom: '1px solid #e5e7eb', padding: '10px 16px' }}>
        <div style={{ fontWeight: 700 }}>Moja Aplikacja</div>
      </header>
    )
  }

  return (
    <header
      style={{
        borderBottom: '1px solid #e5e7eb',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0f172a',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <div style={{ fontWeight: 700 }}>Moja Aplikacja</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>{statusText}</div>
        {user && (
          <button
            onClick={() => setShowPanel(true)}
            style={{
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            Menu
          </button>
        )}
      </div>

      {showPanel && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            width: 'min(900px, 90vw)',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#e5e7eb',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #d1d5db'
                }}>
                  {profileData.profilePhotoUrl ? (
                    <img src={profileData.profilePhotoUrl} alt="Zdjecie profilowe" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '28px' }}>👤</span>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#111827' }}>{profileData.displayName || 'Uzytkownik'}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{profileData.email}</div>
                </div>
              </div>
              <button
                onClick={() => { setShowPanel(false); setShowProfile(false); setShowChangePassword(false) }}
                style={{ border: 'none', background: '#f3f4f6', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontWeight: 600 }}
              >
                Zamknij
              </button>
            </div>

            {!showProfile && !showChangePassword && (
              <div style={{ display: 'grid', gap: '10px' }}>
                <button onClick={() => { setShowProfile(true); setShowChangePassword(false) }} style={menuButton}>👤 Profil</button>
                <button onClick={() => { setShowProfile(false); setShowChangePassword(false); router.push('/'); setShowPanel(false) }} style={menuButton}>📅 Kalendarz</button>
                <button onClick={() => { setShowChangePassword(true); setShowProfile(false) }} style={menuButton}>🔒 Zmien haslo</button>
                <button onClick={() => { setShowPanel(false); router.push('/user/signout') }} style={menuButton}>🚪 Wyloguj</button>
              </div>
            )}

            {showProfile && (
              <div>
                <button onClick={() => setShowProfile(false)} style={backButton}>← Wroc</button>
                <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                  <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                    <div style={{
                      width: '100px', height: '100px', margin: '0 auto 10px', borderRadius: '50%', backgroundColor: '#e5e7eb', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #d1d5db'
                    }}>
                      {profileData.profilePhotoUrl ? (
                        <img src={profileData.profilePhotoUrl} alt="Zdjecie profilowe" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '32px' }}>📷</span>
                      )}
                    </div>
                    <label style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>
                      <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} style={{ display: 'none' }} />
                      Wybierz zdjecie
                    </label>
                  </div>

                  <ProfileField label="Nazwa" value={profileData.displayName} onChange={(v) => setProfileData({ ...profileData, displayName: v })} />
                  <ProfileField label="Email" value={profileData.email} disabled />
                  <ProfileField label="Ulica" value={profileData.street} onChange={(v) => setProfileData({ ...profileData, street: v })} />
                  <ProfileField label="Miasto" value={profileData.city} onChange={(v) => setProfileData({ ...profileData, city: v })} />
                  <ProfileField label="Kod pocztowy" value={profileData.zipCode} onChange={(v) => setProfileData({ ...profileData, zipCode: v })} />

                  <button onClick={handleProfileSave} disabled={profileLoading} style={primaryAction}>
                    {profileLoading ? 'Zapisywanie...' : 'Zapisz'}
                  </button>
                </div>
              </div>
            )}

            {showChangePassword && (
              <div>
                <button onClick={() => setShowChangePassword(false)} style={backButton}>← Wroc</button>

                {passwordError && (<div style={errorBox}>{passwordError}</div>)}
                {passwordSuccess && (<div style={successBox}>{passwordSuccess}</div>)}

                <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                  <ProfileField label="Stare haslo" type="password" value={passwordData.oldPassword} onChange={(v) => setPasswordData({ ...passwordData, oldPassword: v })} />
                  <ProfileField label="Nowe haslo" type="password" value={passwordData.newPassword} onChange={(v) => setPasswordData({ ...passwordData, newPassword: v })} />
                  <ProfileField label="Potwierdz nowe haslo" type="password" value={passwordData.confirmPassword} onChange={(v) => setPasswordData({ ...passwordData, confirmPassword: v })} />

                  <button onClick={handleChangePassword} disabled={passwordLoading} style={primaryAction}>
                    {passwordLoading ? 'Zmiana...' : 'Zmien haslo'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function ProfileField({ label, value, onChange, disabled, type = 'text' }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ fontSize: '12px', color: '#000', display: 'block', marginBottom: '4px' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          boxSizing: 'border-box',
          backgroundColor: disabled ? '#f9fafb' : 'white',
          color: '#111827'
        }}
      />
    </div>
  )
}

const menuButton = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '10px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  textAlign: 'left',
  cursor: 'pointer',
  fontWeight: 600,
  color: '#111827'
}

const primaryAction = {
  width: '100%',
  padding: '12px 14px',
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 700,
  marginTop: '6px'
}

const backButton = {
  padding: '8px 12px',
  backgroundColor: '#e5e7eb',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 600,
  marginBottom: '12px'
}

const errorBox = {
  backgroundColor: '#fee',
  border: '1px solid #fca5a5',
  borderRadius: '8px',
  padding: '10px 12px',
  marginBottom: '10px',
  color: '#b91c1c',
  fontSize: '13px'
}

const successBox = {
  backgroundColor: '#ecfdf3',
  border: '1px solid #34d399',
  borderRadius: '8px',
  padding: '10px 12px',
  marginBottom: '10px',
  color: '#065f46',
  fontSize: '13px'
}

