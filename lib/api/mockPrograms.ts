// =============================================================================
// lib/api/mockPrograms.ts
// Dados simulados (Mock) para as configurações visuais dos programas ativos.
// Usado como fallback quando a API do backend estiver indisponível.
// =============================================================================

import { ProgramUIConfig } from "@/types/program";

export const MOCK_PROGRAMS: Record<string, ProgramUIConfig> = {
  "mcmv-far": {
    id: "mcmv-far" as any,
    name: "Minha Casa Minha Vida — FAR",
    slug: "mcmv-far",
    theme: {
      primaryColor: "#003366",
      accentColor: "#eab308",
      sidebarColor: "#0f172a",
      logoUrl: "",
      shortName: "MCMV-FAR",
    },
    enabledSections: {
      cadastro: true,
      classificacao: true,
      sorteio: true,
      suplencia: true,
      convocacao: true,
      empreendimentos: true,
      unidades: true,
      auditoria: true,
      relatorios: true,
      integracaoCadUnico: true,
      cotasVagas: true,
      prazosProcessuais: true,
    },
    formType: "family",
    labels: {
      beneficiario: "Candidato",
      unidade: "Unidade",
      cadastro: "Inscrição",
      classificacao: "Classificação",
      empreendimento: "Empreendimento",
    },
  },
  "cdru": {
    id: "cdru" as any,
    name: "Concessão de Direito Real de Uso (CDRU)",
    slug: "cdru",
    theme: {
      primaryColor: "#0d5c3a",
      accentColor: "#84cc16",
      sidebarColor: "#0b2e1e",
      logoUrl: "",
      shortName: "CDRU",
    },
    enabledSections: {
      cadastro: true,
      classificacao: true,
      sorteio: false,
      suplencia: true,
      convocacao: true,
      empreendimentos: true,
      unidades: true,
      auditoria: true,
      relatorios: true,
      integracaoCadUnico: false,
      cotasVagas: false,
      prazosProcessuais: true,
    },
    formType: "property",
    labels: {
      beneficiario: "Beneficiário",
      unidade: "Lote",
      cadastro: "Cadastro",
      classificacao: "Hierarquização",
      empreendimento: "Área de Uso",
    },
  },
};
