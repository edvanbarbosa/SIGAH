// =============================================================================
// components/layout/Sidebar.tsx
// Componente de navegação lateral (Navigation Drawer) reutilizável (Passo 10.2).
// Exibe o perfil detalhado do operador e links de controle operacional.
// =============================================================================

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Landmark, 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Settings 
} from "lucide-react";

interface SidebarProps {
  /** Slug do programa habitacional ativo (ex: "mcmv-far") */
  programId: string;
  /** Nome curto ou rótulos do beneficiário (ex: "Candidato") */
  beneficiarioLabel?: string;
  /** Nome do usuário operador */
  userName?: string;
  /** Papel/Cargo do operador */
  userRole?: string;
  /** Região de atuação do operador */
  userRegion?: string;
  /** Imagem do avatar do operador */
  userAvatar?: string;
}

export function Sidebar({
  programId,
  beneficiarioLabel = "Beneficiários",
  userName = "Ana Silva",
  userRole = "Assistente Social",
  userRegion = "Região Leste",
  userAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDtPmbamYvNE6arXUN6VUCVWXZHn4IqHQ2GzgNaq1RVlF6MpedF8FMk4SSOA_a7nWrNk2iwWYvRWNA3eiEzNdT_Yc37uU0XaD9CIl8iFY1SvjbcQdKl99Stqbetq3GKo6A-mD50-PQjzTVdZm0uuQgvPtYFyEvN3oMgGlSkHdNImmlOwp-D4b8-6LKmvYL46cR0ucwCmIlbXmu1Jqk69GvBSpsNhIf-gpj-lWQo06koV8XZohaCisQ0965yTyiAbAhIjB4NGB5E8sk"
}: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Painel de Controle",
      href: `/${programId}/dashboard`,
      icon: LayoutDashboard,
      active: pathname.endsWith("/dashboard"),
    },
    {
      label: "Projetos Sociais",
      href: "#",
      icon: Briefcase,
      active: false,
    },
    {
      label: beneficiarioLabel,
      href: `/${programId}/cadastro`,
      icon: Users,
      active: pathname.includes("/cadastro"),
    },
    {
      label: "Relatórios PTS",
      href: `/${programId}/relatorios`,
      icon: FileText,
      active: pathname.includes("/relatorios"),
    },
    {
      label: "Configurações",
      href: "#",
      icon: Settings,
      active: false,
    },
  ];

  return (
    <aside className="hidden xl:flex flex-col h-screen w-72 fixed left-0 top-0 bg-surface-container/90 backdrop-blur-2xl py-8 z-[60] border-r border-outline-variant/15 select-none">
      {/* 1. Logotipo Oficial */}
      <div className="px-6 mb-10 flex items-center gap-3">
        <Landmark className="text-primary w-8 h-8" />
        <span className="font-heading font-black text-primary text-xl tracking-widest">
          SIGAH
        </span>
      </div>

      {/* 2. Card de Perfil do Operador (Bento Style) */}
      <div className="px-6 mb-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant/35 shadow-sm">
          <img 
            alt={`Avatar de ${userName}`} 
            className="w-full h-full object-cover" 
            src={userAvatar} 
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-bold text-primary text-sm truncate">{userName}</span>
          <span className="text-xs text-on-surface-variant truncate">{userRole}</span>
          <span className="text-[9px] text-outline font-extrabold uppercase tracking-wider mt-0.5">
            {userRegion}
          </span>
        </div>
      </div>

      {/* 3. Links do Menu */}
      <nav className="flex flex-col gap-1.5 flex-grow">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isLast = index === menuItems.length - 1;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`py-4 px-6 flex items-center gap-4 transition-all duration-300 ${isLast ? "mt-auto" : ""} ${
                item.active
                  ? "border-l-4 border-secondary bg-secondary-container/10 text-secondary font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-highest dark:hover:bg-primary/10 hover:text-primary font-medium"
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="font-sans text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
