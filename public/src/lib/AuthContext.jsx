import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(undefined)

const MOCK_USERS = [
    {
        id: "1",
        email: "paciente",
        password: "1",
        name: "María González",
        role: "paciente",
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        email: "medico",
        password: "1",
        name: "Carlos Rodríguez",
        role: "medico",
        createdAt: new Date().toISOString(),
    },
    {
        id: "3",
        email: "laboratorio",
        password: "1",
        name: "Ana Martínez",
        role: "laboratorio",
        createdAt: new Date().toISOString(),
    },
    {
        id: "4",
        email: "director",
        password: "1",
        name: "Ana Martínez",
        role: "director",
        createdAt: new Date().toISOString(),
    },
]

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem("clinic_user")
        if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser)
            console.log("Usuario encontrado en localStorage:", parsedUser)
            if (parsedUser && 
                parsedUser.id && 
                parsedUser.role && 
                typeof parsedUser.role === 'string' &&
                parsedUser.email) {
            // Crear objeto limpio con campos específicos
            const cleanUser = {
                id: String(parsedUser.id),
                email: String(parsedUser.email),
                name: String(parsedUser.name || ''),
                role: String(parsedUser.role),
                createdAt: parsedUser.createdAt || new Date().toISOString()
            }
            setUser(cleanUser)
            console.log("Usuario cargado desde localStorage:", cleanUser)
            } else {
            console.warn("Usuario almacenado con estructura inválida:", parsedUser)
            localStorage.removeItem("clinic_user")
            }
        } catch (error) {
            console.error("Error parsing stored user:", error)
            localStorage.removeItem("clinic_user")
        }
        }
        setIsLoading(false)
    }, [])

    const login = async (email, password) => {
        const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

        if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        // Crear objeto limpio y serializable
        const userToStore = {
            id: String(userWithoutPassword.id),
            email: String(userWithoutPassword.email),
            name: String(userWithoutPassword.name),
            role: String(userWithoutPassword.role), // Garantizar que sea string
            createdAt: new Date().toISOString() // Usar ISO string en vez de Date object
        }
        
        console.log("Usuario guardando en login:", userToStore)
        setUser(userToStore)
        localStorage.setItem("clinic_user", JSON.stringify(userToStore))
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
