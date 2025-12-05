"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Bot, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const CHATBOT_API_URL = "/chatbot/v1/fertility-chat"
const BEARER_TOKEN = import.meta.env.VITE_CHATBOT_TOKEN || "your-bearer-token-here"

// Prompt inicial para que el bot sea más conciso
const INITIAL_SYSTEM_PROMPT = {
  role: "user",
  parts: [{
    text: "Por favor, responde de forma breve, concisa y directa. Mantén tus respuestas en máximo 2 párrafos cortos. Ve al punto principal sin rodeos innecesarios. Usa lenguaje claro y simple."
  }]
}

const INITIAL_MODEL_RESPONSE = {
  role: "model",
  parts: [{
    text: "Entendido. Responderé de forma breve y directa."
  }]
}

const formatMarkdownText = (text) => {
  const parts = []
  let currentIndex = 0
  const boldRegex = /\*\*(.*?)\*\*/g
  let match

  while ((match = boldRegex.exec(text)) !== null) {
    // Agregar texto antes del match
    if (match.index > currentIndex) {
      parts.push({
        type: 'text',
        content: text.slice(currentIndex, match.index)
      })
    }
    // Agregar texto en negrita
    parts.push({
      type: 'primary',
      content: match[1]
    })
    currentIndex = match.index + match[0].length
  }

  // Agregar el texto restante
  if (currentIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(currentIndex)
    })
  }

  return parts
}

export default function ChatbotPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content:
        "Hola, soy tu asistente virtual de FertilCare. Puedo ayudarte con preguntas sobre tu tratamiento, citas, medicación y más. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([
    INITIAL_SYSTEM_PROMPT,
    INITIAL_MODEL_RESPONSE
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "paciente")) {
      navigate("/")
    }
  }, [user, isLoading, navigate])

  if (isLoading || !user) {
    return null
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage ,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      // Preparar el historial de mensajes para la API
      const newConversationHistory = [
        ...conversationHistory,
        {
          role: "user",
          parts: [{ text: inputMessage }],
        },
      ]

      const requestBody = {
        patientId: user.id ||  "unknown",
        patientName: user.name || "Paciente",
        gender: "Female",
        birthDate: user.fecha_nacimiento || user.birthDate || "1990-01-01",
        messages: newConversationHistory,
      }

      const response = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer sb_secret_rruAhDEpIHJKrtf6i6Qu_A_noFtw_TS`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      // Extraer la respuesta del bot - el campo es "respuesta"
      const botResponse = data.respuesta || data.response || data.message || "Lo siento, no pude procesar tu pregunta."

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: botResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Actualizar el historial de conversación
      setConversationHistory([
        ...newConversationHistory,
        {
          role: "model",
          parts: [{ text: botResponse }],
        },
      ])
    } catch (error) {
      console.error("Error al comunicarse con el chatbot:", error)

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta nuevamente más tarde.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <DashboardLayout role="paciente">
      <div className="space-y-6">
        

        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Asistente Virtual</h2>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Chat de Consultas
            </CardTitle>
            <CardDescription>Respuestas instantáneas a tus preguntas</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-5 px-5 w-full overflow-y-auto max-h-96">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-10 w-10  shrink-0 items-center justify-center rounded-full bg-primary">
                        <Bot className="h-6 w-6 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-5 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {formatMarkdownText(message.content).map((part, index) => (
                          part.type === 'primary' ? (
                            <strong className="text-primary/80" key={index}>{part.content}</strong>
                          ) : (
                            <span key={index}>{part.content}</span>
                          )
                        ))}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <User className="h-6 w-6 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Bot className="h-6 w-6 animate-pulse text-primary-foreground" />
                    </div>
                    <div className="rounded-lg bg-muted px-4 py-2">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe tu pregunta..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isTyping}
                />
                <Button type="submit" size="icon" disabled={!inputMessage.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}