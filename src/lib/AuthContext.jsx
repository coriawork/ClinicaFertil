import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(undefined)

// Mock users for testing
const MOCK_USERS = [
    {
        id: "1",
        email: "paciente@clinic.com",
        password: "1",
        name: "María González",
        role: "paciente",
        createdAt: new Date(),
    },
    {
        id: "2",
        email: "medico@clinic.com",
        password: "1",
        name: "Dr. Carlos Rodríguez",
        role: "medico",
        createdAt: new Date(),
    },
    {
        id: "3",
        email: "laboratorio@clinic.com",
        password: "1",
        name: "Ana Martínez",
        role: "operador_laboratorio",
        createdAt: new Date(),
    },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("clinic_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock authentication
    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("clinic_user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("clinic_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
