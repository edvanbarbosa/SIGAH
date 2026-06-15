// =============================================================================
// components/display/DeadlineStatus.tsx
// Componente de monitoramento e indicação de prazos processuais na interface.
// =============================================================================

"use client";

import React from "react";
import { useProgram } from "@/lib/hooks/useProgram";
import { Clock, AlertTriangle } from "lucide-react";

interface DeadlineStatusProps {
  /** Dias restantes */
  daysRemaining: number;
  /** Limite máximo de dias (ex: 60 ou 120) */
  maxDays: number;
  /** Nome da etapa do prazo (ex: "Assinatura de Contrato", "Envio de Documentos") */
  stageName: string;
}

export function DeadlineStatus({
  daysRemaining,
  maxDays,
  stageName,
}: DeadlineStatusProps) {
  const config = useProgram();

  const progress = (daysRemaining / maxDays) * 100;
  const isCritical = daysRemaining <= 15;
  const isExpired = daysRemaining <= 0;

  return (
    <div className="font-sans border border-slate-100 rounded-xl bg-white shadow-sm p-5 max-w-sm mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-lg ${
            isExpired ? "bg-red-50 text-red-600" : isCritical ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">{stageName}</h4>
            <p className="text-[10px] text-slate-400">Prazo máximo de {maxDays} dias</p>
          </div>
        </div>
        <div className="text-right">
          {isExpired ? (
            <span className="text-xs font-bold text-red-600">Expirado</span>
          ) : (
            <span className={`text-xs font-extrabold ${isCritical ? "text-amber-600" : "text-slate-700"}`}>
              {daysRemaining} dias restam
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isExpired ? "bg-red-500" : isCritical ? "bg-amber-500" : "bg-blue-600"
            }`}
            style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
          ></div>
        </div>
      </div>

      {isCritical && (
        <div className={`flex items-start space-x-1.5 text-[10px] mt-3 p-2 rounded ${
          isExpired ? "bg-red-50/50 text-red-700" : "bg-amber-50/50 text-amber-700"
        }`}>
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>
            {isExpired
              ? "Atenção: O prazo processual expirou! Ações de suplência podem ser aplicadas."
              : "Atenção: Prazo crítico! O encerramento da etapa se aproxima."}
          </span>
        </div>
      )}
    </div>
  );
}

export default DeadlineStatus;
