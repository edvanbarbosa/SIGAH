// =============================================================================
// app/[programId]/empreendimentos/page.tsx
// Tela de listagem e parâmetros de empreendimentos habitacionais (Passo 6.4).
// =============================================================================

"use client";

import React from "react";
import { useProgram } from "@/lib/hooks/useProgram";

export default function EmpreendimentosPage() {
  const config = useProgram();

  return (
    <div className="p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Gestão de {config.labels.empreendimento}s
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Painel de parametrização e acompanhamento de obras e residenciais vinculados ao {config.theme.shortName}.
        </p>
      </div>
    </div>
  );
}
