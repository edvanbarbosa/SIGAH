// =============================================================================
// app/[programId]/sorteio/page.tsx
// Tela de sorteio de unidades habitacionais (Passo 6.4).
// =============================================================================

"use client";

import React from "react";
import { useProgram } from "@/lib/hooks/useProgram";

export default function SorteioPage() {
  const config = useProgram();

  return (
    <div className="p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Sorteio de {config.labels.unidade}s
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Gerenciamento do processo de sorteio para o programa {config.theme.shortName}.
        </p>
      </div>
    </div>
  );
}
