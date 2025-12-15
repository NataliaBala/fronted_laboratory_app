'use client'

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/app/_lib/authcontext";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function RegisterForm(){
  const { user, loading } = useAuth();
  const router = useRouter();
  const [registerError, setRegisterError] = useState(""); //stan błędów rejestracji
  
  // Show loading while determining auth state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '18px'
      }}>
        Ładowanie...
      </div>
    );
  }
  
  if (user) {
    return null;
  }
  
  const auth = getAuth();
  
  const onSubmit = (data) => {
    // walidacja obu równości haseł
    if (data.password !== data.repeatPassword) {
      setRegisterError("Hasła nie są identyczne");
      return;
    }
    
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        console.log("User registered!");
        // User is now logged in, redirect to home page
        router.push("/");
      })
      .catch((error) => {
        setRegisterError(error.message);
        console.dir(error);
      });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
      repeatPassword: e.target.repeatPassword.value
    };
    onSubmit(formData);
  };
  
  return(
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Rejestracja</h1>
      
      {registerError && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          <strong>Błąd rejestracji:</strong> {registerError}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Adres email</label>
        <input 
          type="email" 
          name="email" 
          required 
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Hasło</label>
        <input 
          type="password" 
          name="password" 
          required 
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Powtórz hasło</label>
        <input 
          type="password" 
          name="repeatPassword" 
          required 
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
        />
      </div>

      <button 
        type="submit" 
        style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}
      >
        Zarejestruj
      </button>
    </form>
  );
}
