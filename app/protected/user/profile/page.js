'use client'

import { useAuth } from '@/app/_lib/authcontext'
import { updateProfile } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { db } from '@/app/_lib/firebase'
import { setDoc, doc, getDoc } from 'firebase/firestore'

export default function ProfilePage() {
  const { user } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || '',
      bio: '',
      phone: '',
      street: '',
      city: '',
      zipCode: '',
    },
  })

  useEffect(() => {
    const loadUserData = async () => {
      if (user?.uid) {
        try {
          const snapshot = await getDoc(doc(db, "users", user?.uid));
          if (snapshot.exists()) {
            const userData = snapshot.data();
            const address = userData.address || {};

            setValue("displayName", userData.displayName || user?.displayName || '');
            setValue("photoURL", userData.photoURL || user?.photoURL || '');
            setValue("bio", userData.bio || '');
            setValue("phone", userData.phone || '');
            setValue("street", address.street || '');
            setValue("city", address.city || '');
            setValue("zipCode", address.zipCode || '');
          }
        } catch (error) {
          console.warn('Could not load user data from Firestore (database may not be set up yet):', error)
        }
      }
      setLoading(false)
    }

    loadUserData()
  }, [user, setValue])

  if (!user) {
    return <div>Ładowanie...</div>
  }

  if (loading) {
    return <div>Ładowanie danych użytkownika...</div>
  }

  const onSubmit = async (data) => {
    setError('')

    try {
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      })

      try {
        await setDoc(doc(db, "users", user?.uid), {
          bio: data.bio,
          phone: data.phone,
          displayName: data.displayName,
          photoURL: data.photoURL,
          address: {
            street: data.street,
            city: data.city,
            zipCode: data.zipCode
          }
        });
        console.log("Document written with ID: ", user?.uid);
      } catch (firestoreError) {
        console.error("Error adding document: ", firestoreError);
        setError("Brak uprawnień do zapisu danych w bazie danych. Sprawdź konfigurację Firestore.");
        return;
      }

      console.log("Profile updated")
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Profil użytkownika</h1>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <strong>Błąd:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nazwa wyświetlana:
          </label>
          <input
            type="text"
            {...register("displayName")}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: loading ? '#f5f5f5' : 'white',
              color: '#000'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Adres email:
          </label>
          <input
            type="email"
            value={user.email}
            readOnly
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: '#f5f5f5',
              color: '#000'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Adres zdjęcia profilowego:
          </label>
          <input
            type="url"
            {...register("photoURL")}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: loading ? '#f5f5f5' : 'white',
              color: '#000'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Biografia:
          </label>
          <textarea
            {...register("bio")}
            disabled={loading}
            rows="4"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              resize: 'vertical',
              backgroundColor: loading ? '#f5f5f5' : 'white',
              color: '#000'
            }}
            placeholder="Opisz siebie..."
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Numer telefonu:
          </label>
          <input
            type="tel"
            {...register("phone")}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: loading ? '#f5f5f5' : 'white',
              color: '#000'
            }}
            placeholder="+48 123 456 789"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Ulica:
          </label>
          <input
            type="text"
            {...register("street")}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: loading ? '#f5f5f5' : 'white',
              color: '#000'
            }}
            placeholder="np. ul. Główna 123"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Miasto:
          </label>
          <input
            type="text"
            {...register("city")}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: loading ? '#f5f5f5' : 'white',
              color: '#000'
            }}
            placeholder="np. Warszawa"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Kod pocztowy:
          </label>
          <input
            type="text"
            {...register("zipCode")}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: loading ? '#f5f5f5' : 'white',
              color: '#000'
            }}
            placeholder="np. 00-001"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Ładowanie...' : 'Zaktualizuj profil'}
        </button>
      </form>

      <div style={{ marginTop: '30px' }}>
        <h2>Dodatkowe informacje:</h2>
        <p><strong>ID użytkownika:</strong> {user.uid}</p>
        <p><strong>Data utworzenia:</strong> {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('pl-PL') : 'Nieznana'}</p>
        <p><strong>Ostatnie logowanie:</strong> {user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('pl-PL') : 'Nieznana'}</p>
      </div>
    </div>
  )
}