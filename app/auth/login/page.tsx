// =============================================================================
// app/auth/login/page.tsx
// Tela de login e autenticação (Passo 6.2).
// Permite ao usuário logar no sistema selecionando o perfil correspondente.
// =============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { UserProfile } from "@/contexts/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<UserProfile>("gestor");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validação simples
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    // Simulando autenticação e obtendo informações de sessão do perfil
    setTimeout(() => {
      try {
        login({
          id: `usr_${Math.random().toString(36).substr(2, 9)}`,
          name: email.split("@")[0].toUpperCase(),
          email,
          profile,
        });

        // Simula a gravação do token JWT
        localStorage.setItem("sigah_token", "dummy_jwt_token");

        // Redireciona para a home
        router.push("/");
      } catch (err) {
        setError("Erro ao autenticar. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-white">SIGAH</h2>
        <p className="mt-2 text-sm text-slate-400">
          Acesse a plataforma de Gestão de Apoio Habitacional
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="exemplo@sigah.gov.br"
              />
            </div>

            <div>
              <label htmlFor="profile" className="block text-sm font-medium text-slate-300">
                Perfil de Acesso
              </label>
              <select
                id="profile"
                value={profile}
                onChange={(e) => setProfile(e.target.value as UserProfile)}
                className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="gestor">Gestor Público</option>
                <option value="assistente_social">Assistente Social</option>
                <option value="agente_financeiro">Agente Financeiro</option>
                <option value="auditor">Auditor (Controle Externo)</option>
              </select>
            </div>

            <div>
              <label htmlFor="pass" className="block text-sm font-medium text-slate-300">
                Senha
              </label>
              <input
                id="pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-400">
                Dificuldade de acesso?
              </div>
              <Link href="/auth/recuperar" className="font-medium text-blue-400 hover:text-blue-300">
                Recuperar Acesso
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Autenticando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
