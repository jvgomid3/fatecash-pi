"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface ILoginRequest {
    name: string
    email: string
    password: string
}

export interface ILoginResponse {
    id: string
    name: string
    email: string
    password: string
}

export const register = async (data: ILoginRequest): Promise<ILoginResponse> => {
    const response = await fetch('http://localhost:3001/users', {
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

export default function SignUpForm() {
    const router = useRouter()

    const [formData, setFormData] = useState<ILoginRequest>({
        name: "",
        email: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const user = await register(formData)
            console.log("Usuário cadastrado com sucesso:", user)
            router.push("/login") // redireciona após sucesso
        } catch (error) {
            console.error("Erro ao cadastrar:", error)
            // Aqui você pode exibir uma mensagem de erro para o usuário
        }
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className="text-center text-2xl text-green-600">Fatecash</CardTitle>
                <CardDescription>Preencha os campos abaixo para criar sua conta.</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}> {/* action={AuthActions.createAccount}*/}
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" value={formData.email} onChange={handleChange} type="email" required />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between mt-4">
                    <Button type="submit">Criar Conta</Button>
                    <Link href="/login" className={buttonVariants({ variant: 'link' })}>Já tenho conta</Link>
                </CardFooter>
            </form>
        </Card >
    )
}