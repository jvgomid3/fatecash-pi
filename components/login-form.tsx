"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface ILoginRequest {
  email: string
  password: string
}

export interface ILoginResponse {
  access_token: string
}

export const login = async (data: ILoginRequest): Promise<ILoginResponse> => {
  const response = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Erro ao cadastrar usuário')
  }

  return await response.json()
}

export default function LoginForm() {
  const router = useRouter()

  const [formData, setFormData] = useState<ILoginRequest>({
    email: "",
    password: ""
  })

  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const user = await login(formData)

      if (user && user.access_token) {
        console.log("Login bem-sucedido:", user)
        localStorage.setItem("token", user.access_token)
        router.push("/dashboard")
      } else {
        console.error("Token de acesso não retornado")
        setErrorMessage("Email ou senha inválidos.")
        //alert("Falha no login: token não recebido.")
      }
    } catch (error) {
      console.error("Erro ao logar:", error)
      alert("Erro ao fazer login. Verifique suas credenciais.")
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-green-600">Fatecash</CardTitle>
        <CardDescription>Faça login para acessar sua conta.</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between mt-4">
          <Button type="submit">Entrar</Button>
          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>
          )}
          <Link href="/signup" className={buttonVariants({ variant: 'link' })}>Criar Conta</Link>
        </CardFooter>
      </form>
    </Card>
  )
}