// =============================================================================
// app/[programId]/layout.tsx
// Layout dinâmico por programa habitacional (Passo 6.3).
// Injeta os provedores de contexto do programa ativo (ProgramProvider) e usuário.
// =============================================================================

import React from "react";
import { notFound } from "next/navigation";
import { fetchProgramConfig } from "@/lib/api/programs";
import { MOCK_PROGRAMS } from "@/lib/api/mockPrograms";
import { ProgramProvider } from "@/contexts/ProgramContext";

interface ProgramLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    programId: string;
  }>;
}

export default async function ProgramLayout({ children, params }: ProgramLayoutProps) {
  const { programId } = await params;
  
  let config = null;

  try {
    // Busca a configuração de UI do backend
    config = await fetchProgramConfig(programId);
  } catch {
    // Caso falhe (servidor offline), busca no mock local
    config = MOCK_PROGRAMS[programId] || null;
  }

  // Se o programa não for encontrado no mock e falhar na API, retorna 404
  if (!config) {
    notFound();
  }

  return (
    <ProgramProvider config={config}>
      {/*
        Estrutura principal da tela do programa.
        O theme do programa (primaryColor, sidebarColor) pode ser injetado
        ou aplicado dinamicamente usando inline styles ou variáveis CSS.
      */}
      <div 
        className="min-h-screen flex flex-col"
        style={{
          // Disponibiliza as cores do tema como variáveis locais para CSS
          "--program-primary": config.theme.primaryColor,
          "--program-accent": config.theme.accentColor,
          "--program-sidebar": config.theme.sidebarColor,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ProgramProvider>
  );
}
