// =============================================================================
// components/display/IntegrationStatus.tsx
// Componente para exibir o status de integração externa com o Cadastro Único (CadÚnico)
// e validação contra cadastros federais.
// =============================================================================

"use client";

import React from "react";
import { useProgram } from "@/lib/hooks/useProgram";
import { Database, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { CadUnicoStatus } from "@/types/family";

interface IntegrationStatusProps {
  /** Status retornado pela integração */
  status: CadUnicoStatus;
  /** Código do Cadastro Único localizado */
  codigoFamiliar?: string | null;
  /** Data da última consulta realizada (ISO string) */
  dataConsulta?: string | null;
}

export function IntegrationStatus({
  status,
  codigoFamiliar,
  dataConsulta,
}: IntegrationStatusProps) {
  const config = useProgram();

  const getStatusConfig = () => {
    const configs: Record<CadUnicoStatus, { label: string; textClass: string; bgClass: string; icon: React.ReactNode }> = {
      nao_consultado: {
        label: "Não Consultado",
        textClass: "text-slate-600",
        bgClass: "bg-slate-50 border-slate-200",
        icon: <Database className="w-4 h-4 text-slate-400" />,
      },
      consultando: {
        label: "Consultando...",
        textClass: "text-blue-700",
        bgClass: "bg-blue-50/50 border-blue-200",
        icon: <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />,
      },
      localizado: {
        label: "Registro Localizado",
        textClass: "text-green-700",
        bgClass: "bg-green-50/30 border-green-200",
        icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
      },
      nao_localizado: {
        label: "Registro Não Localizado",
        textClass: "text-amber-700",
        bgClass: "bg-amber-50/50 border-amber-200",
        icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
      },
      divergente: {
        label: "Divergência Encontrada",
        textClass: "text-red-700",
        bgClass: "bg-red-50/30 border-red-200",
        icon: <AlertCircle className="w-4 h-4 text-red-500" />,
      },
      erro: {
        label: "Erro na Conexão",
        textClass: "text-red-800",
        bgClass: "bg-red-900/10 border-red-500",
        icon: <AlertCircle className="w-4 h-4 text-red-600" />,
      },
    };

    return configs[status] || configs.nao_consultado;
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`font-sans border rounded-xl p-5 ${statusConfig.bgClass} max-w-sm mx-auto`}>
      <div className="flex items-center space-x-3">
        <div className="shrink-0">{statusConfig.icon}</div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-slate-800">Sincronização CadÚnico</h4>
          <p className={`text-[10px] font-bold mt-0.5 ${statusConfig.textClass}`}>
            {statusConfig.label}
          </p>
        </div>
      </div>

      {status === "localizado" && codigoFamiliar && (
        <div className="mt-3 border-t border-slate-200/50 pt-2.5 space-y-1">
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>Código Familiar:</span>
            <span className="font-mono font-bold">{codigoFamiliar}</span>
          </div>
          {dataConsulta && (
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>Sincronizado em:</span>
              <span>
                {new Date(dataConsulta).toLocaleDateString("pt-BR")} às{" "}
                {new Date(dataConsulta).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IntegrationStatus;
