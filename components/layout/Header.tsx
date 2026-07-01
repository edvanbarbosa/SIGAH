// =============================================================================
// components/layout/Header.tsx
// Componente de cabeçalho (TopAppBar) reutilizável do SIGAH (Passo 10.1).
// Provê a identidade visual, navegação principal e foto do usuário logado.
// =============================================================================

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  /** Nome do usuário ativo */
  userName?: string;
  /** URL da imagem do avatar */
  userAvatar?: string;
  /** Rota base do programa (se houver, ex: "/mcmv-far") */
  programId?: string;
}

export function Header({ 
  userName = "Ana Silva", 
  userAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCfj7T5csT17P6a6NfrPGws6APhsvzMq9v7bQuR5Xmi5tQ2L61UfUwRemL8HNuTkXaqAPBVnGropq1sDYg8haFpYrSgjsEGV2o6x4Lki-hjL8SXsB0JTzZs63Bxe7qGQ-qIIl9c2RBrtSu6oxKcU37DlOT_8UyRcUtN0sBWRlyrO8IxJy0uWVbxTNvdH3NlVqmk8wbhplHj3IucUTuZStFKQlkK05f9oBJbkxZe9NxQMng5_v_ul6cBxNC_T0F-xr9cVY3dUu6euu0",
  programId 
}: HeaderProps) {
  const pathname = usePathname();

  // Função para verificar se a rota atual corresponde ao link da navbar
  const isActive = (path: string) => {
    if (path === "#" || path === "") return false;
    return pathname.includes(path);
  };

  const dashboardPath = programId ? `/${programId}/dashboard` : "/";
  const cadastroPath = programId ? `/${programId}/cadastro` : "#";
  const vistoriasPath = programId ? `/${programId}/vistorias` : "#";
  const entregasPath = programId ? `/${programId}/entregas` : "#";

  return (
    <header className="bg-surface/80 backdrop-blur-xl text-primary border-b border-outline-variant/30 flex justify-between items-center px-6 md:px-8 h-20 w-full sticky top-0 z-50 shadow-[0px_16px_32px_rgba(0,30,64,0.06)]">
      {/* Lado Esquerdo: Marca oficial */}
      <Link href="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
        <div className="h-9 w-9 bg-gradient-to-br from-[#001e40] to-[#003366] rounded-lg flex items-center justify-center text-white font-heading font-black text-lg shadow-sm">
          S
        </div>
        <span className="font-heading font-black text-2xl tracking-tight text-[#001e40]">
          SIGAH
        </span>
      </Link>

      {/* Lado Direito: Links e Perfil */}
      <div className="flex items-center gap-6">
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

        {/* Avatar do Usuário */}
        <div 
          title={userName}
          className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border-2 border-primary/10 cursor-pointer shadow-sm hover:border-primary/30 transition-all"
        >
          <img 
            alt={`Avatar de ${userName}`} 
            className="w-full h-full object-cover" 
            src={userAvatar} 
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
