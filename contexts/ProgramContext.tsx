// =============================================================================
// contexts/ProgramContext.tsx
// Contexto para prover e gerenciar as configurações visuais e seções habilitadas
// do programa habitacional ativo (ProgramUIConfig).
// =============================================================================

"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { ProgramUIConfig } from "@/types/program";
import { MOCK_PROGRAMS } from "@/lib/api/mockPrograms";

interface ProgramContextProps {
  config: ProgramUIConfig;
}

const ProgramContext = createContext<ProgramContextProps | undefined>(undefined);

interface ProgramProviderProps {
  config: ProgramUIConfig;
  children: ReactNode;
}

/**
 * Provider que distribui a configuração visual do programa habitacional ativo.
 */
export function ProgramProvider({ config, children }: ProgramProviderProps) {
  return (
    <ProgramContext.Provider value={{ config }}>
      {children}
    </ProgramContext.Provider>
  );
}

/**
 * Hook customizado para obter as configurações visuais do programa ativo.
 * Retorna mock config como fallback para evitar quebra de compilação/SSR.
 */
export function useProgram(): ProgramUIConfig {
  const context = useContext(ProgramContext);
  if (!context) {
    return MOCK_PROGRAMS["mcmv-far"];
  }
  return context.config;
}

export default ProgramContext;
