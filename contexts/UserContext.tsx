// =============================================================================
// contexts/UserContext.tsx
// Provedor para gerenciar o estado da sessão de usuário autenticado,
// perfis de acesso (gestor, assistente_social, agente_financeiro, auditor)
// e controle de permissões.
// =============================================================================

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserProfile = "gestor" | "assistente_social" | "agente_financeiro" | "auditor";

/** Estrutura do usuário logado. */
export interface User {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
}

interface UserContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

/**
 * Provider que envolve a aplicação para prover o estado de sessão do usuário.
 */
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook para obter dados e ações relacionadas à sessão do usuário.
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
}

/**
 * Hook utilitário para checagem contextual de permissões de auditoria e operações (RF076).
 */
export function usePermissions() {
  const { user } = useUser();

  /**
   * Verifica se o usuário autenticado possui permissão para realizar determinada ação.
   *
   * @param action - Código ou nome do recurso/ação a ser verificado.
   */
  const hasPermission = (action: string): boolean => {
    if (!user) return false;

    // Gestor público possui acesso total às operações
    if (user.profile === "gestor") return true;

    switch (user.profile) {
      case "assistente_social":
        return [
          "read",
          "cadastro_visualizar",
          "cadastro_criar",
          "cadastro_editar",
          "trabalho_social",
        ].includes(action);

      case "agente_financeiro":
        return [
          "read",
          "cadastro_visualizar",
          "validacao_documental",
          "contrato_gerar",
          "contrato_assinar",
          "pesquisa_enquadramento",
        ].includes(action);

      case "auditor":
        return [
          "read",
          "cadastro_visualizar",
          "logs_visualizar",
          "relatorios_gerar",
        ].includes(action);

      default:
        return false;
    }
  };

  return { hasPermission };
}

export default UserContext;
