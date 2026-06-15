// =============================================================================
// app/[programId]/auditoria/logs/page.tsx
// Tela de logs de auditoria e rastreabilidade de ações (Passo 6.4).
// =============================================================================

"use client";

import React from "react";
import { useProgram } from "@/lib/hooks/useProgram";

export default function AuditoriaLogsPage() {
  const config = useProgram();

  return (
    <div className="p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Logs de Auditoria
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Rastreabilidade completa de ações e alterações de dados do programa {config.theme.shortName} (RF019).
        </p>
      </div>
    </div>
  );
}
