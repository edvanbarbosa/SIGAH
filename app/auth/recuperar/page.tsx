// =============================================================================
// app/auth/recuperar/page.tsx
// Tela de solicitação de recuperação de credenciais (Passo 6.2).
// Permite ao usuário informar seu e-mail corporativo para receber link de reset.
// =============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-white">Recuperar Acesso</h2>
        <p className="mt-2 text-sm text-slate-400">
          Informe seu e-mail corporativo para resetar sua credencial.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-700">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-green-400 font-medium">
                E-mail enviado!
              </div>
              <p className="text-sm text-slate-300">
                Se o e-mail informado estiver cadastrado, você receberá um link com as instruções para redefinição.
              </p>
              <Link
                href="/auth/login"
                className="mt-4 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                Voltar para o Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  E-mail corporativo
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Processando..." : "Enviar Instruções"}
              </button>

              <div className="text-center mt-4">
                <Link
                  href="/auth/login"
                  className="text-sm text-slate-400 hover:text-slate-300"
                >
                  Voltar para o Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
