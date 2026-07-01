// =============================================================================
// components/layout/FeatureGate.tsx
// Componente Wrapper para renderização condicional baseada em feature flags.
// Controla a visibilidade de seções funcionais conforme as regras do programa.
// =============================================================================

"use client";

import React from "react";
import { useProgram } from "@/lib/hooks/useProgram";
import { ProgramEnabledSections } from "@/types/program";

interface FeatureGateProps {
  /** A feature flag a ser verificada no programa habitacional ativo. */
  feature: keyof ProgramEnabledSections;
  /** Componente alternativo exibido caso a feature esteja desabilitada. */
  fallback?: React.ReactNode;
  /** Elementos exibidos se a feature estiver habilitada. */
  children: React.ReactNode;
}

/**
 * Componente Wrapper para renderização condicional de elementos com base
 * nas feature flags de UI do programa habitacional ativo (Nível 2 de Flexibilidade).
 *
 * ⚠️ ATENÇÃO: FeatureGate serve apenas para conveniência visual na interface.
 * Não substitui as validações de segurança e regras de negócio no backend.
 */
export function FeatureGate({ feature, fallback = null, children }: FeatureGateProps) {
  const config = useProgram();

  // Verifica se a seção correspondente está habilitada para o programa atual
  const isEnabled = !!config.enabledSections[feature];

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default FeatureGate;
