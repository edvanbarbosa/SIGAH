// =============================================================================
// app/page.tsx
// Landing page e tela de seleção de programa habitacional (Passo 6.1).
// Apresenta os programas disponíveis e direciona para seus respectivos dashboards.
// =============================================================================

import Link from "next/link";
import { fetchPrograms } from "@/lib/api/programs";
import { ProgramUIConfig } from "@/types/program";

// Configuração estática de fallback caso o backend esteja offline
const FALLBACK_PROGRAMS: Partial<ProgramUIConfig>[] = [
  {
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
  },
  {
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
  },
];

export default async function HomePage() {
  let programs: any[] = [];
  
  try {
    // Tenta obter os programas da API do backend
    programs = await fetchPrograms();
  } catch {
    // Caso o backend não esteja disponível, usa os fallbacks configurados localmente
    programs = FALLBACK_PROGRAMS;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-slate-900 p-6 md:p-12">
      <header className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 mb-4">
          SIGAH
        </h1>
        <p className="text-lg text-slate-600 font-medium">
          Sistema Integrado de Gestão de Apoio Habitacional
        </p>
        <div className="h-1 w-20 bg-blue-600 mx-auto mt-6 rounded-full"></div>
      </header>

      <main className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-700">
            Selecione o Programa Habitacional
          </h2>
          <p className="text-slate-500 mt-2 text-sm md:text-base">
            Selecione uma das opções abaixo para acessar o painel de controle e gestão das inscrições.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-xl shadow-md border border-slate-100 p-6 hover:shadow-lg hover:border-slate-200 transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-lg mb-4"
                  style={{ backgroundColor: program.theme.primaryColor }}
                >
                  {program.theme.shortName.substring(0, 2)}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {program.name}
                </h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                  Gestão integrada de inscrições, classificação de vulnerabilidades e sorteio do programa {program.theme.shortName}.
                </p>
              </div>

              <Link
                href={`/${program.slug}/dashboard`}
                className="w-full text-center py-3 px-4 rounded-lg font-semibold text-white transition hover:opacity-90 active:scale-[0.98] inline-block"
                style={{ backgroundColor: program.theme.primaryColor }}
              >
                Acessar Painel
              </Link>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-16 text-center text-xs text-slate-400">
        <p>© 2026 SIGAH — Secretaria de Estado da Assistência Social. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
