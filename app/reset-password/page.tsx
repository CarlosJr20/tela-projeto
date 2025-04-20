"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/services/auth-service"
import axios from "axios"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateForm = () => {
    if (!email) {
      setError("Email é obrigatório")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email inválido")
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      await resetPassword(email)
      setIsSubmitted(true)
      toast({
        title: "Solicitação enviada",
        description: "Verifique seu email para redefinir sua senha",
      })
    } catch (error) {
      let errorMessage = "Verifique seu email e tente novamente"

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage
      }

      toast({
        variant: "destructive",
        title: "Erro ao solicitar redefinição",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:underline mb-6">
          <ArrowLeft size={16} className="mr-1" />
          Voltar para o login
        </Link>

        {isSubmitted ? (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-blue-600">Email enviado</h1>
            <p className="text-gray-600">
              Enviamos um link para redefinir sua senha para {email}. Por favor, verifique sua caixa de entrada.
            </p>
            <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
              <Link href="/">Voltar para o login</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-blue-600">Esqueceu sua senha?</h1>
              <p className="text-gray-600 mt-2">
                Digite seu email abaixo e enviaremos um link para redefinir sua senha.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={error ? "border-red-500" : ""}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar link de redefinição"
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
