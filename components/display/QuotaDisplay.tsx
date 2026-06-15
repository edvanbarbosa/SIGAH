// =============================================================================
// components/display/QuotaDisplay.tsx
// Componente para exibir a distribuição de cotas de vagas (ex: PCD, Idoso, etc.).
// =============================================================================

"use client";

import React from "react";
import { useProgram } from "@/lib/hooks/useProgram";
import { Users, AlertCircle } from "lucide-react";

interface QuotaItem {
  name: string;
  reservedPercent: number;
  totalVagas: number;
  vagasPreenchidas: number;
}

interface QuotaDisplayProps {
  /** Lista de cotas de vagas */
  quotas: QuotaItem[];
}

export function QuotaDisplay({ quotas }: QuotaDisplayProps) {
  const config = useProgram();

  return (
    <div className="font-sans border border-slate-100 rounded-xl bg-white shadow-sm p-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-4 mb-4">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Distribuição de Cotas</h3>
          <p className="text-slate-500 text-xs mt-0.5">Acompanhamento e reserva legal de vagas no programa habitacional.</p>
        </div>
      </div>

      <div className="space-y-4">
        {quotas.map((quota, index) => {
          const progress = (quota.vagasPreenchidas / quota.totalVagas) * 100;
          const isOverlimit = progress > 100;

          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>{quota.name} ({quota.reservedPercent}%)</span>
                <span>
                  {quota.vagasPreenchidas}/{quota.totalVagas} vagas
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverlimit ? "bg-red-500" : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              {isOverlimit && (
                <div className="flex items-center space-x-1.5 text-[10px] text-red-500 font-semibold mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Alerta: Limite reservado excedido!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuotaDisplay;
