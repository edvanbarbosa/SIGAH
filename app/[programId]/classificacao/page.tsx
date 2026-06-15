// =============================================================================
// app/[programId]/classificacao/page.tsx
// Tela de listagem de classificação e hierarquização (Passo 6.4).
// =============================================================================

"use client";

import React from "react";
import { useProgram } from "@/lib/hooks/useProgram";

export default function ClassificacaoPage() {
  const config = useProgram();

  return (
    <div className="p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Resultados de {config.labels.classificacao}
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Pontuação e ordenação de prioridade dos {config.labels.beneficiario}s no programa {config.theme.shortName}.
        </p>
      </div>
    </div>
  );
}
