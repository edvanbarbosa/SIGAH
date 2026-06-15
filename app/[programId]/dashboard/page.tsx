// =============================================================================
// app/[programId]/dashboard/page.tsx
// Painel principal do programa habitacional (Passo 6.4).
// =============================================================================

"use client";

import React from "react";
import { useProgram } from "@/lib/hooks/useProgram";

export default function DashboardPage() {
  const config = useProgram();

  return (
    <div className="p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Painel de Controle — {config.name}
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Seja bem-vindo ao painel operacional do programa habitacional {config.theme.shortName}.
        </p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
            <h3 className="font-semibold text-slate-700">Rótulos Customizados</h3>
            <ul className="text-sm text-slate-500 mt-2 space-y-1">
              <li><strong>Beneficiário:</strong> {config.labels.beneficiario}</li>
              <li><strong>Unidade:</strong> {config.labels.unidade}</li>
              <li><strong>Cadastro:</strong> {config.labels.cadastro}</li>
              <li><strong>Classificação:</strong> {config.labels.classificacao}</li>
              <li><strong>Empreendimento:</strong> {config.labels.empreendimento}</li>
            </ul>
          </div>
          
          <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
            <h3 className="font-semibold text-slate-700">Configuração de UI</h3>
            <ul className="text-sm text-slate-500 mt-2 space-y-1">
              <li><strong>Tipo de Formulário:</strong> {config.formType}</li>
              <li><strong>Cadastro Habilitado:</strong> {config.enabledSections.cadastro ? "Sim" : "Não"}</li>
              <li><strong>Sorteio Habilitado:</strong> {config.enabledSections.sorteio ? "Sim" : "Não"}</li>
              <li><strong>Cotas Habilitadas:</strong> {config.enabledSections.cotasVagas ? "Sim" : "Não"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
