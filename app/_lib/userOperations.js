import { doc, setDoc, getDoc, updateDoc, collection } from 'firebase/firestore'
import { db } from './firebase'

export const createUserDocument = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid)
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    console.log('User document created successfully')
  } catch (error) {
    console.error('Error creating user document:', error)
    throw error
  }
}

export const getUserDocument = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data()
    } else {
      console.log('No user document found')
      return null
    }
  } catch (error) {
    console.error('Error getting user document:', error)
    throw error
  }
}

export const updateUserDocument = async (uid, updates) => {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    })
    console.log('User document updated successfully')
  } catch (error) {
    console.error('Error updating user document:', error)
    throw error
  }
}

export const getUsersCollection = () => {
  return collection(db, 'users')
}