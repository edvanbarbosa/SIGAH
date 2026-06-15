// =============================================================================
// components/timeline/ProcessTimeline.tsx
// Componente de linha do tempo para representar o fluxo do candidato.
// Exibe as etapas cumpridas e a fase atual no processo.
// =============================================================================

"use client";

import React from "react";
import { ProcessStage } from "@/types/api";
import { Check, Dot } from "lucide-react";

interface TimelineStep {
  stage: ProcessStage;
  label: string;
  description: string;
  dateCompleted?: string | null;
}

interface ProcessTimelineProps {
  /** A etapa corrente em que o processo se encontra */
  currentStage: ProcessStage;
  /** Histórico e descrição de cada etapa */
  steps: TimelineStep[];
}

export function ProcessTimeline({ currentStage, steps }: ProcessTimelineProps) {
  // Encontra o index da etapa atual para determinar quais foram cumpridas
  const currentIdx = steps.findIndex((step) => step.stage === currentStage);

  return (
    <div className="font-sans max-w-xl mx-auto p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6">
        Histórico e Etapas do Processo
      </h3>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isActive = idx === currentIdx;
          const isPending = idx > currentIdx;

          return (
            <div key={idx} className="relative pl-6">
              {/* Círculo indicador de status */}
              <div
                className={`absolute -left-[13px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition ${
                  isCompleted
                    ? "bg-green-600 border-green-600 text-white"
                    : isActive
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-white border-slate-300 text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isActive ? (
                  <Dot className="w-5 h-5 stroke-[4]" />
                ) : (
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                )}
              </div>
 
              {/* Informações da etapa */}
              <div className="flex flex-col">
                <span className={`text-xs font-bold ${isActive ? "text-primary" : "text-slate-800"}`}>
                  {step.label}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                  {step.description}
                </p>
                {isCompleted && step.dateCompleted && (
                  <span className="text-[8px] font-mono text-slate-400 mt-1">
                    Concluído em {new Date(step.dateCompleted).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProcessTimeline;
