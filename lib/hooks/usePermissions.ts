// =============================================================================
// lib/hooks/usePermissions.ts
// Hook para checagem contextual de permissões.
// Combina a sessão do usuário (UserContext) com o programa ativo (ProgramContext)
// para determinar acessos funcionais de forma consistente.
// =============================================================================

import { useUser, usePermissions as useBasePermissions } from "@/contexts/UserContext";
import { useProgram } from "@/contexts/ProgramContext";
import { ProgramEnabledSections } from "@/types/program";

/**
 * Hook utilitário que combina a permissão do perfil do usuário com as
 * seções habilitadas no programa habitacional ativo (permissões contextuais).
 */
export function usePermissions() {
  const { user } = useUser();
  const program = useProgram();
  const { hasPermission: hasBasePermission } = useBasePermissions();

  /**
   * Verifica se o usuário tem permissão para a ação e se a feature relacionada
   * está habilitada no programa atual.
   *
   * @param action - A ação do usuário a ser validada (ex: "trabalho_social", "validacao_documental")
   * @param feature - A feature de UI relacionada (ex: "sorteio", "cadastro", "auditoria")
   */
  const hasPermission = (
    action: string,
    feature?: keyof ProgramEnabledSections
  ): boolean => {
    // 1. Verifica permissão de perfil básica do usuário
    if (!hasBasePermission(action)) {
      return false;
    }

    // 2. Se a ação depender de uma feature de UI específica, valida se está ativa no programa
    if (feature && !program.enabledSections[feature]) {
      return false;
    }

    return true;
  };

  return {
    user,
    program,
    hasPermission,
  };
}

export default usePermissions;
