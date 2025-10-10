import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const ClientAuthContext = createContext()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext)
  if (!context) {
    throw new Error('useClientAuth must be used within ClientAuthProvider')
  }
  return context
}

export const ClientAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('clientToken'))

  // Configure axios with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Load user on mount
  useEffect(() => {
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const loadUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/unified-auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data.user)
    } catch (error) {
      console.error('Error loading user:', error)
      // Si le token est invalide, le supprimer
      if (error.response?.status === 401) {
        logout()
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/client-auth/register`, userData)
      
      const { token: newToken, user: newUser } = response.data
      
      localStorage.setItem('clientToken', newToken)
      setToken(newToken)
      setUser(newUser)
      
      toast.success('Compte créé avec succès!')
      return { success: true, user: newUser }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la création du compte'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/client-auth/login`, {
        email,
        password
      })
      
      const { token: newToken, user: newUser } = response.data
      
      localStorage.setItem('clientToken', newToken)
      setToken(newToken)
      setUser(newUser)
      
      toast.success('Connexion réussie!')
      return { success: true, user: newUser }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la connexion'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('clientToken')
    setToken(null)
    setUser(null)
    toast.success('Déconnexion réussie')
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/client-auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setUser(response.data.user)
      toast.success('Profil mis à jour avec succès!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put(`${API_URL}/client-auth/change-password`, {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      toast.success('Mot de passe modifié avec succès!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors du changement de mot de passe'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    refreshUser: loadUser,
    setToken,
    setUser
  }

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  )
}

