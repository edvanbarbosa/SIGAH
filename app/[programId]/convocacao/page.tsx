// =============================================================================
// app/[programId]/convocacao/page.tsx
// Tela de convocação dos candidatos habilitados (Passo 6.4).
// =============================================================================

"use client";

import React from "react";
import { useProgram } from "@/lib/hooks/useProgram";

export default function ConvocacaoPage() {
  const config = useProgram();

  return (
    <div className="p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Convocações do Programa
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Acompanhamento das convocações de {config.labels.beneficiario}s no programa {config.theme.shortName}.
        </p>
      </div>
    </div>
  );
}
