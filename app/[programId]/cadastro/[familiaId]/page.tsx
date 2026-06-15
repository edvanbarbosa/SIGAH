// =============================================================================
// app/[programId]/cadastro/[familiaId]/page.tsx
// Tela de detalhes e edição de um cadastro familiar específico (Passo 6.4).
// =============================================================================

"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";

export default function FamiliaDetailPage() {
  const config = useProgram();
  const params = useParams();
  const { familiaId } = params;

  return (
    <div className="p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Detalhes do {config.labels.beneficiario}
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          ID da Família: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-red-500 font-mono">{familiaId}</code>
        </p>
      </div>
    </div>
  );
}
