// =============================================================================
// components/layout/Footer.tsx
// Componente de rodapé (Footer) reutilizável do SIGAH (Passo 10.3).
// Mantém as declarações legais, termos de privacidade e marcas do governo.
// =============================================================================

"use client";

import React from "react";
import { Gavel } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface-container-high dark:bg-primary text-on-surface dark:text-on-primary font-sans text-xs w-full mt-auto flex flex-col md:flex-row justify-between items-center px-6 md:px-8 py-6 gap-4 border-t border-outline-variant/20 select-none">
      <div className="flex items-center gap-2">
        <Gavel className="w-4 h-4 text-primary dark:text-primary-foreground" />
        <span className="opacity-80">
          © 2026 SIGAH - Sistema de Gestão Habitacional. Governo Federal.
        </span>
      </div>
      <div className="flex gap-6 font-semibold">
        <a 
          className="text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-foreground transition-colors duration-300" 
          href="#"
        >
          Acessibilidade
        </a>
        <a 
          className="text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-foreground transition-colors duration-300" 
          href="#"
        >
          Privacidade
        </a>
        <a 
          className="text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-foreground transition-colors duration-300" 
          href="#"
        >
          Transparência
        </a>
      </div>
    </footer>
  );
}

export default Footer;
