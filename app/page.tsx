"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-600">{isLogin ? "Bem-vindo de volta" : "Crie sua conta"}</h1>
            <p className="text-gray-600 mt-2">
              {isLogin
                ? "Entre com suas credenciais para acessar sua conta"
                : "Preencha os dados abaixo para criar sua conta"}
            </p>
          </div>

          <div className="transition-all duration-300">
            {isLogin ? <LoginForm toggleForm={toggleForm} /> : <RegisterForm toggleForm={toggleForm} />}
          </div>
        </div>
        <div className="hidden md:block md:w-1/2 bg-blue-600 p-8 text-white flex flex-col justify-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">{isLogin ? "Novo por aqui?" : "Já tem uma conta?"}</h2>
            <p className="text-blue-100">
              {isLogin
                ? "Crie uma conta e comece a usar nossa plataforma hoje mesmo!"
                : "Entre com suas credenciais para acessar sua conta."}
            </p>
            <button
              onClick={toggleForm}
              className="px-6 py-2 border-2 border-white rounded-md hover:bg-white hover:text-blue-600 transition-colors"
            >
              {isLogin ? "Criar conta" : "Fazer login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
