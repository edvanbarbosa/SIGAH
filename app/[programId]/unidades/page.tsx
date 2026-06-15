// =============================================================================
// app/[programId]/unidades/page.tsx
// Tela de gestão de unidades habitacionais e designação (Passo 6.4).
// =============================================================================

"use client";

import React from "react";
import { useProgram } from "@/lib/hooks/useProgram";

export default function UnidadesPage() {
  const config = useProgram();

  return (
    <div className="p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Gestão de {config.labels.unidade}s
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Acompanhamento físico e designação de {config.labels.unidade}s para candidatos no programa {config.theme.shortName}.
        </p>
      </div>
    </div>
  );
}
