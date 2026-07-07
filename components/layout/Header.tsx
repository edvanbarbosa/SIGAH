// =============================================================================
// components/layout/Header.tsx
// Componente de cabeçalho (TopAppBar) reutilizável do SIGAH (Passo 10.1).
// Provê a identidade visual, navegação principal e foto do usuário logado.
// Suporta modo Programa (com programId) e modo Global/Hub (sem programId).
// =============================================================================

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Bell, LogOut } from "lucide-react";

interface HeaderProps {
  /** Nome do usuário ativo */
  userName?: string;
  /** URL da imagem do avatar */
  userAvatar?: string;
  /** Rota base do programa (se houver, ex: "/mcmv-far") */
  programId?: string;
  /** Quantidade de notificações não lidas (exclusivo para o modo global/hub) */
  unreadNotificationsCount?: number;
  /** Callback ao clicar no sino de notificações */
  onNotificationsClick?: () => void;
}

export function Header({ 
  userName, 
  userAvatar, 
  programId,
  unreadNotificationsCount = 0,
  onNotificationsClick
}: HeaderProps) {
  const pathname = usePathname();
  const { user, logout } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCfj7T5csT17P6a6NfrPGws6APhsvzMq9v7bQuR5Xmi5tQ2L61UfUwRemL8HNuTkXaqAPBVnGropq1sDYg8haFpYrSgjsEGV2o6x4Lki-hjL8SXsB0JTzZs63Bxe7qGQ-qIIl9c2RBrtSu6oxKcU37DlOT_8UyRcUtN0sBWRlyrO8IxJy0uWVbxTNvdH3NlVqmk8wbhplHj3IucUTuZStFKQlkK05f9oBJbkxZe9NxQMng5_v_ul6cBxNC_T0F-xr9cVY3dUu6euu0";

  const activeUserName = userName || (mounted && user?.name) || "Ana Silva";
  const activeUserAvatar = userAvatar || (mounted && user?.avatar) || defaultAvatar;

  const profileLabels: Record<string, string> = {
    gestor: "Gestor Público",
    assistente_social: "Assistente Social",
    agente_financeiro: "Agente Financeiro",
    auditor: "Auditor (Controle)",
    cidadao: "Cidadão"
  };
  
  const activeProfileLabel = mounted && user ? profileLabels[user.profile] : "Cidadão";

  const dashboardPath = programId ? `/${programId}/dashboard` : "/";
  const cadastroPath = programId ? `/${programId}/cadastro` : "#";
  const vistoriasPath = programId ? `/${programId}/vistorias` : "#";
  const entregasPath = programId ? `/${programId}/entregas` : "#";

  const isProgramMode = !!programId;

  return (
    <header className="bg-surface/80 backdrop-blur-xl text-primary border-b border-outline-variant/30 flex justify-between items-center px-6 md:px-8 h-20 w-full sticky top-0 z-50 shadow-[0px_16px_32px_rgba(0,30,64,0.06)]">
      {/* Lado Esquerdo: Marca oficial */}
      <Link href="/home" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
        <div className="h-9 w-9 bg-gradient-to-br from-[#001e40] to-[#003366] rounded-lg flex items-center justify-center text-white font-heading font-black text-lg shadow-sm">
          S
        </div>
        <span className="font-heading font-black text-2xl tracking-tight text-[#001e40]">
          SIGAH
        </span>
      </Link>

      {/* Lado Direito: Links e Perfil */}
      <div className="flex items-center gap-6">
        {isProgramMode ? (
          <>
            {/* 1. Modo de Programa Habitacional */}
            <nav className="hidden md:flex gap-8">
              <Link 
                href={dashboardPath}
                className={`font-semibold text-sm transition-colors duration-300 ${
                  pathname === "/" || pathname.endsWith("/dashboard")
                    ? "text-secondary" 
                    : "text-on-surface-variant hover:text-secondary"
                }`}
              >
                Início
              </Link>
              <Link 
                href={cadastroPath}
                className={`font-semibold text-sm transition-colors duration-300 ${
                  pathname.includes("/cadastro")
                    ? "text-secondary" 
                    : "text-on-surface-variant hover:text-secondary"
                }`}
              >
                Cadastro
              </Link>
              <Link 
                href={vistoriasPath}
                className={`font-semibold text-sm transition-colors duration-300 ${
                  pathname.includes("/vistorias")
                    ? "text-secondary" 
                    : "text-on-surface-variant hover:text-secondary"
                  }`}
              >
                Vistorias
              </Link>
              <Link 
                href={entregasPath}
                className={`font-semibold text-sm transition-colors duration-300 ${
                  pathname.includes("/entregas")
                    ? "text-secondary" 
                    : "text-on-surface-variant hover:text-secondary"
                }`}
              >
                Entregas
              </Link>
            </nav>

            {/* Avatar Simples Circular */}
            <Link 
              href="/perfil"
              title={`Editar Perfil: ${activeUserName}`}
              className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border-2 border-primary/10 cursor-pointer shadow-sm hover:border-primary/40 hover:scale-105 transition-all"
            >
              <img 
                alt={`Avatar de ${activeUserName}`} 
                className="w-full h-full object-cover" 
                src={activeUserAvatar} 
              />
            </Link>
          </>
        ) : (
          <>
            {/* 2. Modo Global/Hub (Literalmente o mesmo header da Home) */}
            <div className="flex items-center gap-4">
              
              {/* Sino de Notificações */}
              <button
                onClick={onNotificationsClick}
                className="relative p-2 rounded-xl text-[#43474f] hover:bg-[#0059bb]/5 hover:text-[#0059bb] transition-all cursor-pointer"
                title="Notificações"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Bento-Card do Perfil do Usuário */}
              <Link 
                href="/perfil"
                title={`Editar Perfil: ${activeUserName}`}
                className="hidden sm:flex items-center gap-3 hover:opacity-80 active:scale-[0.98] transition-all group cursor-pointer"
              >
                <div className="text-right">
                  <p className="text-sm font-bold text-[#001e40] leading-tight group-hover:text-[#0059bb] transition-colors duration-300">
                    {activeUserName}
                  </p>
                  <p className="text-[10px] text-[#43474f] uppercase tracking-wider font-semibold">
                    {activeProfileLabel}
                  </p>
                </div>
                {mounted && user?.avatar ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10 shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <img 
                      alt={`Avatar de ${activeUserName}`} 
                      className="w-full h-full object-cover" 
                      src={activeUserAvatar} 
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#001e40] to-[#003366] flex items-center justify-center text-white font-heading font-black text-sm shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
                    {activeUserName.charAt(0)}
                  </div>
                )}
              </Link>

              {/* Botão Sair */}
              <Link
                href="/"
                onClick={() => logout()}
                className="text-sm font-bold text-[#43474f] px-3 py-2 hover:text-red-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Link>

            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
