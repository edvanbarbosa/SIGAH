// =============================================================================
// contexts/UserContext.tsx
// Provedor para gerenciar o estado da sessão de usuário autenticado,
// perfis de acesso (gestor, assistente_social, agente_financeiro, auditor)
// e controle de permissões.
// =============================================================================

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserProfile = "gestor" | "assistente_social" | "agente_financeiro" | "auditor" | "cidadao";

/** Estrutura do usuário logado. */
export interface User {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
  role?: string;
  region?: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

interface UserContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (name: string, email: string, phone?: string, address?: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
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

  // Carrega as informações do usuário da API no início da sessão
  const refreshUser = async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Erro ao sincronizar informações do usuário:", err);
    }
  };

  useEffect(() => {
    // Sincroniza o usuário se houver token ou se estivermos em ambiente simulado
    const token = typeof window !== "undefined" ? localStorage.getItem("sigah_token") : null;
    if (token) {
      refreshUser();
    }
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (name: string, email: string, phone?: string, address?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, address }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Erro desconhecido ao salvar." };
      }
    } catch (err) {
      console.error("Erro ao enviar atualização de perfil:", err);
      return { success: false, error: "Erro de conexão com o servidor." };
    }
  };

  const isAuthenticated = user !== null;

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout, updateProfile, refreshUser }}>
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

      case "cidadao":
        return [
          "read",
          "cadastro_familia",
          "dossie_habitacao",
          "acompanhar_solicitacao",
        ].includes(action);

      default:
        return false;
    }
  };

  return { hasPermission };
}

export default UserContext;
