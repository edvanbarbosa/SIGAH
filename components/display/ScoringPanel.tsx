// =============================================================================
// components/display/ScoringPanel.tsx
// Componente para exibir a pontuação social (calculada pelo backend) e seus
// critérios justificativos de forma transparente e modular.
// =============================================================================

"use client";

import React from "react";
import { useProgram } from "@/lib/hooks/useProgram";
import { Award, CheckCircle2, XCircle } from "lucide-react";

export interface ScoringPanelDetail {
  /** Nome amigável do critério de priorização */
  criterionName: string;
  /** Pontuação atribuída se correspondido */
  score: number;
  /** Justificativa técnica ou amparo legal */
  description: string;
  /** Indica se a inscrição se enquadrou neste critério */
  matched: boolean;
}

interface ScoringPanelProps {
  /** Pontuação final total calculada pelo backend */
  totalScore: number;
  /** Detalhes de cada critério avaliado */
  details: ScoringPanelDetail[];
  /** Indica se o cálculo está desatualizado ou em processamento */
  isCalculating?: boolean;
}

export function ScoringPanel({
  totalScore,
  details,
  isCalculating = false,
}: ScoringPanelProps) {
  const config = useProgram();

  return (
    <div className="font-sans border border-slate-100 rounded-xl bg-white shadow-sm p-6 max-w-2xl mx-auto">
      {/* CABEÇALHO DA PONTUAÇÃO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Pontuação Social do {config.labels.beneficiario}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Critérios de priorização e hierarquização avaliados em conformidade com as leis.
            </p>
          </div>
        </div>
        <div className="text-center sm:text-right shrink-0">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pontuação Total</span>
          <span className="text-3xl font-extrabold text-primary">
            {isCalculating ? "..." : totalScore} <span className="text-sm font-semibold text-slate-500">pts</span>
          </span>
        </div>
      </div>

      {/* LISTAGEM DE DETALHES */}
      <div className="mt-5 space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detalhamento dos Critérios</h4>
        
        {details.map((detail, index) => (
          <div
            key={index}
            className={`border rounded-lg p-3 flex items-start justify-between transition ${
              detail.matched
                ? "border-green-200 bg-green-50/20"
                : "border-slate-100 bg-slate-50/20 opacity-75"
            }`}
          >
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  {detail.criterionName}
                </span>
                {detail.matched ? (
                  <span className="text-[9px] font-extrabold text-green-700 bg-green-100 px-1.5 py-0.5 rounded uppercase tracking-wide">
                    Enquadrado
                  </span>
                ) : (
                  <span className="text-[9px] font-extrabold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wide">
                    Não Enquadrado
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                {detail.description}
              </p>
            </div>
            <div className="text-right shrink-0 flex flex-col items-end justify-between h-full">
              <span className={`text-xs font-extrabold ${detail.matched ? "text-green-700" : "text-slate-400"}`}>
                {detail.matched ? `+${detail.score}` : "0"} pts
              </span>
              <div className="mt-2 text-slate-300">
                {detail.matched ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-300" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScoringPanel;
