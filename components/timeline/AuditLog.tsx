// =============================================================================
// components/timeline/AuditLog.tsx
// Componente para listagem e exibição do histórico de logs de auditoria (RF019).
// =============================================================================

"use client";

import React from "react";
import { AuditLogEntry } from "@/types/api";
import { ClipboardList, ArrowRight } from "lucide-react";

interface AuditLogProps {
  /** Registros de logs de auditoria */
  logs: AuditLogEntry[];
}

export function AuditLog({ logs }: AuditLogProps) {
  return (
    <div className="font-sans border border-slate-100 rounded-xl bg-white shadow-sm p-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-4 mb-4">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Trilha de Auditoria</h3>
          <p className="text-slate-500 text-xs mt-0.5">Rastreamento de ações e histórico operacional auditável (LGPD).</p>
        </div>
      </div>

      {logs.length === 0 ? (
        <p className="text-xs text-slate-400 italic text-center py-6">
          Nenhuma ação registrada no histórico até o momento.
        </p>
      ) : (
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
          {logs.map((log) => (
            <div key={log.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 flex items-start justify-between text-xs gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-700">{log.userName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({log.ipAddress})</span>
                </div>
                <p className="text-slate-600 mt-1 leading-relaxed">{log.description}</p>
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <div className="mt-2 bg-slate-50 p-2 rounded border border-slate-100 text-[10px] text-slate-500 font-mono max-h-20 overflow-y-auto">
                    {JSON.stringify(log.metadata)}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="block font-semibold text-slate-500 text-[10px]">
                  {new Date(log.timestamp).toLocaleDateString("pt-BR")}
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5 block">
                  {new Date(log.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AuditLog;
