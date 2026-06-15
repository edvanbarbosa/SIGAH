// =============================================================================
// contexts/ProgramContext.tsx
// Contexto para prover e gerenciar as configurações visuais e seções habilitadas
// do programa habitacional ativo (ProgramUIConfig).
// =============================================================================

"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { ProgramUIConfig } from "@/types/program";

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
 * Lança erro se utilizado fora do ProgramProvider correspondente.
 */
export function useProgram(): ProgramUIConfig {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error("useProgram deve ser usado dentro de um ProgramProvider");
  }
  return context.config;
}

export default ProgramContext;
