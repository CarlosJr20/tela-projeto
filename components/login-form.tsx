"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { login, setAuthToken } from "@/services/auth-service"
import axios from "axios"

interface LoginFormProps {
  toggleForm: () => void
}

export function LoginForm({ toggleForm }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido"
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Credenciais de teste
      if (email === "teste@teste.com" && password === "123456") {
        setAuthToken("fake-token", rememberMe)

        toast({
          title: "Login realizado com sucesso",
          description: "Você será redirecionado para a página inicial",
        })

        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
        return
      }

      const response = await login(email, password)

      // Armazenar o token de autenticação
      setAuthToken(response.data.token, rememberMe)

      toast({
        title: "Login realizado com sucesso",
        description: "Você será redirecionado para a página inicial",
      })

      // Redirecionar para a página inicial após login
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      let errorMessage = "Verifique suas credenciais e tente novamente"

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage
      }

      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Senha</Label>
          <Link href="/reset-password" className="text-sm text-blue-600 hover:underline">
            Esqueci minha senha
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "border-red-500 pr-10" : "pr-10"}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked === true)} />
        <Label htmlFor="remember" className="text-sm font-normal">
          Lembrar-me
        </Label>
      </div>

      <Button type="submit" className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>

      <div className="text-center text-sm mt-4 md:hidden">
        <span className="text-gray-600">Não tem uma conta? </span>
        <button type="button" onClick={toggleForm} className="text-blue-600 hover:underline font-medium">
          Cadastre-se
        </button>
      </div>
    </form>
  )
}
