// =============================================================================
// lib/api/programs.ts
// Chamadas à API referentes às configurações visuais de programas habitacionais.
// Implementa cache stale-while-revalidate para otimizar tempo de carregamento.
// =============================================================================

import { apiClient } from "./client";
import { ProgramUIConfig } from "@/types/program";

/**
 * Busca a configuração de UI de um programa habitacional ativo a partir do seu ID/slug.
 * Aplica revalidação em segundo plano (stale-while-revalidate) para reduzir a latência
 * e mitigar possíveis gargalos de renderização (Risco 1).
 *
 * @param programId - Identificador ou slug do programa (ex: "mcmv-far")
 */
export async function fetchProgramConfig(programId: string): Promise<ProgramUIConfig> {
  return apiClient.get<ProgramUIConfig>(`/programs/${programId}`, {
    next: {
      // Revalida no background a cada 1 hora
      revalidate: 3600,
      tags: [`program-${programId}`],
    },
  });
}

/**
 * Busca a listagem resumida de todos os programas habitacionais cadastrados no sistema.
 */
export async function fetchPrograms(): Promise<ProgramUIConfig[]> {
  return apiClient.get<ProgramUIConfig[]>("/programs", {
    next: {
      // Revalida a cada 1 hora
      revalidate: 3600,
      tags: ["programs"],
    },
  });
}
