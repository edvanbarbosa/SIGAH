// =============================================================================
// app/[programId]/relatorios/page.tsx
// Tela de geração de relatórios consolidados e estatísticas (Passo 6.4).
// =============================================================================

"use client";

import React from "react";
import { useProgram } from "@/lib/hooks/useProgram";

export default function RelatoriosPage() {
  const config = useProgram();

  return (
    <div className="p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Relatórios Gerenciais
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Geração de relatórios e exportação consolidada de dados do programa {config.theme.shortName}.
        </p>
      </div>
    </div>
  );
}
