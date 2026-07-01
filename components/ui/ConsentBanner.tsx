// =============================================================================
// components/ui/ConsentBanner.tsx
// Banner ou termo de consentimento LGPD para coleta de aceite (RF040).
// =============================================================================

"use client";

import React, { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";

interface ConsentBannerProps {
  /** Callback executado ao registrar o consentimento */
  onAccept: (version: string) => void;
  /** Versão do termo em vigor */
  version?: string;
  /** Termo curto exibido no banner */
  shortText?: string;
}

export function ConsentBanner({
  onAccept,
  version = "1.0.0",
  shortText,
}: ConsentBannerProps) {
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    setDismissed(true);
    onAccept(version);
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  if (dismissed) return null;

  return (
    <div className="font-sans border border-slate-200 rounded-lg p-5 bg-white shadow-md max-w-2xl mx-auto">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            Termo de Consentimento para Uso de Dados (LGPD)
            <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1 rounded">v{version}</span>
          </h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {shortText ||
              "O SIGAH utiliza seus dados pessoais e de sua composição familiar exclusivamente para fins de triagem, validação de elegibilidade e ordenação nos programas habitacionais estaduais. Seus dados são protegidos por criptografia e acessados apenas por assistentes sociais e técnicos autorizados em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."}
          </p>
          
          {declined && (
            <p className="text-xs font-semibold text-red-500 mt-3">
              ⚠️ O consentimento é obrigatório para dar andamento no cadastro. Se optar por recusar, o formulário de inscrição será travado.
            </p>
          )}
 
          <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={handleDecline}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-2 transition"
            >
              Recusar
            </button>
            <button
              onClick={handleAccept}
              className="flex items-center space-x-1 px-4 py-2 bg-primary hover:opacity-90 text-white font-semibold rounded-lg text-xs transition shadow-sm"
            >
              <span>Aceitar e Prosseguir</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsentBanner;
