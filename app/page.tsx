// =============================================================================
// app/page.tsx
// Landing page e portal institucional do SIGAH (Passo 6.1).
// Apresenta a plataforma e realiza a triagem dos programas habitacionais ativos.
// Alinhado com as diretrizes do DESIGN.md e o leiaute do Stitch.
// =============================================================================

import Link from "next/link";
import { LandingFooter } from "@/components/layout/LandingFooter";
import { fetchPrograms } from "@/lib/api/programs";
import { ProgramUIConfig } from "@/types/program";
import {
  ShieldCheck,
  UserCheck,
  CheckSquare,
  TrendingUp,
  MapPin,
  Building2,
  FileSpreadsheet,
  AlertTriangle,
  Map,
  ArrowRight,
  Building,
  Database,
  ArrowUpRight,
  MessageSquare,
  FileText
} from "lucide-react";

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
    labels: {
      beneficiario: "Candidato",
      unidade: "Unidade",
      cadastro: "Inscrição",
      classificacao: "Classificação",
      empreendimento: "Empreendimento",
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
    labels: {
      beneficiario: "Beneficiário",
      unidade: "Lote",
      cadastro: "Cadastro",
      classificacao: "Hierarquização",
      empreendimento: "Área de Uso",
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
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] font-sans selection:bg-[#0059bb]/10 selection:text-[#0059bb] scroll-smooth">

      {/* 1. Header / Navegação Principal */}
      <header className="fixed top-0 w-full z-50 bg-[#f8f9fa]/80 backdrop-blur-xl border-b border-[#c3c6d1]/15 h-18 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="h-9 w-9 bg-gradient-to-br from-[#001e40] to-[#003366] rounded-lg flex items-center justify-center text-white font-heading font-black text-lg shadow-sm">
                S
              </div>
              <span className="font-heading font-black text-2xl tracking-tight text-[#001e40]">
                SIGAH
              </span>
            </Link>
            <nav className="hidden md:flex gap-8 items-center">
              <a href="#programas" className="text-sm font-semibold text-[#43474f] hover:text-[#0059bb] transition-colors">
                Programas
              </a>
              <a href="#funcionalidades" className="text-sm font-semibold text-[#43474f] hover:text-[#0059bb] transition-colors">
                Funcionalidades
              </a>
              <a href="#fluxo" className="text-sm font-semibold text-[#43474f] hover:text-[#0059bb] transition-colors">
                Fluxo de Processo
              </a>
              <a href="#depoimentos" className="text-sm font-semibold text-[#43474f] hover:text-[#0059bb] transition-colors">
                Transparência
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-[#43474f] px-4 py-2 hover:text-[#001e40] transition-colors hidden sm:block">
              Suporte
            </button>
            <Link
              href="/acesso"
              className="bg-[#001e40] hover:bg-[#001e40]/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm"
            >
              Acessar Portal
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-36 pb-28 bg-[#f3f4f5] border-b border-[#c3c6d1]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Texto Hero */}
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#0059bb]/10 text-[#0059bb] rounded-full">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  Conformidade FAR / MCMV
                </span>
              </div>

              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-[#001e40] tracking-tight">
                Transforme a Gestão Habitacional com <span className="text-[#0059bb]">Inteligência</span> e Transparência
              </h1>

              <p className="text-[#43474f] text-base sm:text-lg leading-relaxed max-w-xl">
                Centralize o cadastro, seleção, hierarquização e acompanhamento de beneficiários em uma única plataforma, totalmente alinhada às normas do Minha Casa Minha Vida e FAR.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="/acesso"
                  className="bg-gradient-to-br from-[#001e40] to-[#003366] text-white px-8 py-4 rounded-xl font-bold text-center text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-300"
                >
                  Acessar Portal
                </a>
                <a
                  href="#funcionalidades"
                  className="border-2 border-[#0059bb]/30 text-[#0059bb] px-8 py-4 rounded-xl font-bold text-center text-sm hover:bg-[#0059bb]/5 transition-all"
                >
                  Conhecer Funcionalidades
                </a>
              </div>
            </div>

            {/* Imagem Mockup Hero */}
            <div className="lg:w-1/2 relative group w-full">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,30,64,0.08)] border border-[#c3c6d1]/15 transform group-hover:-translate-y-1 transition-transform duration-500 bg-white">
                <img
                  className="w-full h-auto object-cover"
                  alt="Interface gráfica do painel administrativo do SIGAH mostrando indicadores sociais e mapas"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwM8N3wXY-iCM0J_fOvyfPi-UBUeHOgwPFrY1ceW8ChYYqHYE3yoVzd4wbmbPnMxFxfiUI3VjUDNc23qAtb60beMKHC6oFAYeLno0dcOoyhZhXxumnFaYpFxWyTJYtn67SUegBJfY_ugQ1R1ufBOM-NwuwNsLFPtoP96bHKk2u2gkOjf4Z57zPGcVe5sp2BK8sfnrxR5BY16WDe6aufujwz25ZSN9SKr-wLSieFeZoNY4YPlAR0QdzwX3GZdwSh8MY6xLil-_0dYE"
                />
              </div>

              <div className="absolute -bottom-10 -left-10 z-20 w-52 h-52 rounded-2xl overflow-hidden shadow-[0_16px_32px_rgba(0,30,64,0.08)] border-4 border-[#f3f4f5] hidden xl:block transform group-hover:translate-x-1.5 transition-transform duration-700">
                <img
                  className="w-full h-full object-cover"
                  alt="Fotografia arquitetônica de complexo habitacional moderno e sustentável"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3KBe6Fp5o8C2Uz32tb0zH4i7_8gWSEiFMRjiImMj-i-DHz-2rOjywhcKWUBYr8IFY8t_YJqrUO7mLEKQDkaTYehGyIafSrivdPBy0nRPcoRsekcQXFIvkOwX5v2FZf4Fs3VcqF1TSN5LU1FYhn3SVrKZgUz3EV7Bn45H9dj3ockH71nCzccIMZ7WaPbqGPaEx0D1V-j30WQO7pU3-lQm2fz0umfj-K0vbjU37RxXJzic_Vm6qNZHe_pfHrQyRCbOPeol9QC0a5AM"
                />
              </div>
              <div className="absolute -top-16 -right-16 w-80 h-80 bg-[#0059bb]/5 rounded-full blur-3xl -z-10"></div>
            </div>

          </div>
        </div>
      </section>



      {/* 4. Features Section (Bento Grid) */}
      <section className="py-28 bg-[#f3f4f5] border-t border-b border-[#c3c6d1]/10" id="funcionalidades">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-[10px] font-black tracking-widest text-[#0059bb] uppercase">
              Recursos de Governança
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">
              Plataforma Completa para o Gestor Público
            </h2>
            <p className="text-[#43474f] text-sm leading-relaxed">
              Tecnologia de ponta para automatizar processos complexos e garantir lisura total na administração de programas habitacionais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-[#c3c6d1]/10 hover:shadow-[0_16px_32px_rgba(0,30,64,0.04)] transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#0059bb]/10 rounded-xl flex items-center justify-center mb-6 text-[#0059bb] group-hover:bg-[#0059bb] group-hover:text-white transition-colors duration-300">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#001e40] mb-2">
                Cadastro Habitacional Digital
              </h3>
              <p className="text-xs text-[#43474f] leading-relaxed">
                Coleta estruturada de dados socioeconômicos familiares com verificação e armazenamento em conformidade com a LGPD.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-[#c3c6d1]/10 hover:shadow-[0_16px_32px_rgba(0,30,64,0.04)] transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#0059bb]/10 rounded-xl flex items-center justify-center mb-6 text-[#0059bb] group-hover:bg-[#0059bb] group-hover:text-white transition-colors duration-300">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#001e40] mb-2">
                Seleção Automatizada
              </h3>
              <p className="text-xs text-[#43474f] leading-relaxed">
                Aplicação automatizada de critérios e regramentos baseados na legislação federal, estadual e municipal vigente.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-[#c3c6d1]/10 hover:shadow-[0_16px_32px_rgba(0,30,64,0.04)] transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#0059bb]/10 rounded-xl flex items-center justify-center mb-6 text-[#0059bb] group-hover:bg-[#0059bb] group-hover:text-white transition-colors duration-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#001e40] mb-2">
                Hierarquização Inteligente
              </h3>
              <p className="text-xs text-[#43474f] leading-relaxed">
                Algoritmos integrados para cálculo de pontuação social com base em indicadores de vulnerabilidade social do CadÚnico.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl border border-[#c3c6d1]/10 hover:shadow-[0_16px_32px_rgba(0,30,64,0.04)] transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#0059bb]/10 rounded-xl flex items-center justify-center mb-6 text-[#0059bb] group-hover:bg-[#0059bb] group-hover:text-white transition-colors duration-300">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#001e40] mb-2">
                Geolocalização de Demanda
              </h3>
              <p className="text-xs text-[#43474f] leading-relaxed">
                Visualização espacial dos dados habitacionais, facilitando o mapeamento de vulnerabilidade territorial.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl border border-[#c3c6d1]/10 hover:shadow-[0_16px_32px_rgba(0,30,64,0.04)] transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#0059bb]/10 rounded-xl flex items-center justify-center mb-6 text-[#0059bb] group-hover:bg-[#0059bb] group-hover:text-white transition-colors duration-300">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#001e40] mb-2">
                Gestão de Empreendimentos
              </h3>
              <p className="text-xs text-[#43474f] leading-relaxed">
                Controle do andamento físico-financeiro de obras, designação de unidades habitacionais e status de ocupação.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl border border-[#c3c6d1]/10 hover:shadow-[0_16px_32px_rgba(0,30,64,0.04)] transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#0059bb]/10 rounded-xl flex items-center justify-center mb-6 text-[#0059bb] group-hover:bg-[#0059bb] group-hover:text-white transition-colors duration-300">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#001e40] mb-2">
                Auditoria e Transparência
              </h3>
              <p className="text-xs text-[#43474f] leading-relaxed">
                Trilha de auditoria completa registrando dados do operador, IP e ações, conferindo total segurança jurídica.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Process Flow Section */}
      <section className="py-24 bg-[#001e40] text-white" id="fluxo">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-[10px] font-black tracking-widest text-[#0059bb] uppercase">
              Jornada de Inscrição
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
              Fluxo de Processo Eficiente
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Do cadastro inicial à entrega das chaves, tudo integrado em uma jornada transparente, rápida e auditável.
            </p>
          </div>

          {/* LAYOUT DESKTOP: Linha Horizontal Interligada */}
          <div className="hidden lg:grid lg:grid-cols-7 gap-6 text-center relative z-10">
            {[
              { num: 1, label: "Cadastro", desc: "Coleta estruturada de dados socioeconômicos familiares e aceite LGPD." },
              { num: 2, label: "Validação", desc: "Cruzamento automático com o Cadastro Único e bases externas." },
              { num: 3, label: "Georef.", desc: "Mapeamento espacial da demanda e análise de proximidade." },
              { num: 4, label: "Critérios", desc: "Cálculo de pontuação social com base em vulnerabilidades legais." },
              { num: 5, label: "Hierarquização", desc: "Classificação automática de acordo com as regras do programa." },
              { num: 6, label: "Análise", desc: "Validação documental física e jurídica dos pré-selecionados." },
              { num: 7, label: "Contemplação", desc: "Sorteio, designação de unidades habitacionais e entrega das chaves." }
            ].map((step, idx, arr) => (
              <div key={step.num} className="space-y-4 relative group">
                {/* Linha horizontal conectiva */}
                {idx < arr.length - 1 && (
                  <div className="absolute top-[22px] left-1/2 right-[-50%] h-[2px] bg-white/20 -z-10" />
                )}

                <div className="w-11 h-11 rounded-full border-2 border-[#0059bb] flex items-center justify-center mx-auto bg-[#001e40] text-white font-heading font-black text-xs relative z-10 shadow-sm group-hover:bg-[#0059bb] group-hover:scale-105 transition-all duration-300">
                  {step.num}
                </div>
                <h3 className="font-heading font-bold text-xs text-white/95 tracking-tight group-hover:text-[#0059bb] transition-colors">{step.label}</h3>
                <p className="text-[10px] text-white/60 leading-relaxed px-1">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* LAYOUT MOBILE/TABLET: Linha Vertical Conectiva (Timeline) */}
          <div className="lg:hidden relative ml-2 space-y-10">
            {/* Linha vertical conectiva */}
            <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-white/20 z-0" />

            {[
              { num: 1, label: "Cadastro", desc: "Coleta estruturada de dados socioeconômicos familiares e aceite LGPD." },
              { num: 2, label: "Validação", desc: "Cruzamento automático com o Cadastro Único e bases externas." },
              { num: 3, label: "Georef.", desc: "Mapeamento espacial da demanda e análise de proximidade." },
              { num: 4, label: "Critérios", desc: "Cálculo de pontuação social com base em vulnerabilidades legais." },
              { num: 5, label: "Hierarquização", desc: "Classificação automática de acordo com as regras do programa." },
              { num: 6, label: "Análise", desc: "Validação documental física e jurídica dos pré-selecionados." },
              { num: 7, label: "Contemplação", desc: "Sorteio, designação de unidades habitacionais e entrega das chaves." }
            ].map((step) => (
              <div key={step.num} className="relative flex items-start space-x-4 group z-10">
                <div className="w-8 h-8 rounded-full border-2 border-[#0059bb] flex items-center justify-center bg-[#001e40] text-white font-heading font-bold text-xs shadow-sm group-hover:bg-[#0059bb] transition-colors duration-300 shrink-0">
                  {step.num}
                </div>
                <div className="space-y-1 pt-1">
                  <h3 className="font-heading font-bold text-sm text-white group-hover:text-[#0059bb] transition-colors">{step.label}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Differentials Section */}
      <section className="py-28 bg-[#f3f4f5] border-b border-[#c3c6d1]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            <div className="lg:w-1/2">
              <img
                className="rounded-2xl shadow-[0_24px_48px_rgba(0,30,64,0.06)] border border-[#c3c6d1]/10"
                alt="Macro fotografia de tecnologia moderna e seguranca digital"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuADWOMmXF0g-PTa_tGwlnfIPT4mC-DyEZvkr4H8bvZ0EzwhlaPcMUu6kbwsiUqbEh34MimbUBAyB2ilcGMuaWRcUWgvOR3Jpkmn1csOaJDPJzDjy4h6TROvh7mtwv5kLpQVhhhWZrFFbcXm4LaSAOwuzKE5hrY7KhomDEciOhBBC5GLgB-IVyWPtuT7l0AtJB9yusUDC8I6DVgIEO0_QVpb5j5p5a1U_nbKVBDyKBHoVls98UcwyM7imyxRwt9UAQ0tIXpwHxgFvnc"
              />
            </div>

            <div className="lg:w-1/2 space-y-10">
              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-widest text-[#0059bb] uppercase">
                  Diferenciais Tecnológicos
                </span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">
                  Por que escolher o SIGAH?
                </h2>
              </div>

              <div className="space-y-6">

                {/* Diff 1 */}
                <div className="flex gap-4">
                  <div className="shrink-0 text-[#0059bb]">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#001e40] mb-1">
                      Conformidade FAR/MCMV
                    </h4>
                    <p className="text-xs text-[#43474f] leading-relaxed">
                      Parâmetros pré-configurados no backend para atender todas as exigências das portarias federais sem necessidade de ajustes manuais.
                    </p>
                  </div>
                </div>

                {/* Diff 2 */}
                <div className="flex gap-4">
                  <div className="shrink-0 text-[#0059bb]">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#001e40] mb-1">
                      Redução Drástica de Erros
                    </h4>
                    <p className="text-xs text-[#43474f] leading-relaxed">
                      Elimine duplicidades e fraudes cadastrais através de cruzamento inteligente de dados com o Cadastro Único e bases externas.
                    </p>
                  </div>
                </div>

                {/* Diff 3 */}
                <div className="flex gap-4">
                  <div className="shrink-0 text-[#0059bb]">
                    <Map className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#001e40] mb-1">
                      Georreferenciamento Nativo
                    </h4>
                    <p className="text-xs text-[#43474f] leading-relaxed">
                      Visualização espacial da demanda habitacional para subsidiar decisões políticas baseadas em dados territoriais reais.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section className="py-24 bg-white" id="depoimentos">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-heading font-black text-3xl text-[#001e40] tracking-tight">
              Confiança de Gestores Públicos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-[#c3c6d1]/10 flex flex-col justify-between relative">
              <p className="text-xs text-[#43474f] leading-relaxed mb-6 italic">
                "O SIGAH revolucionou nossa secretaria. O que levávamos meses para triar manualmente, agora fazemos em minutos com total segurança jurídica."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0059bb]/10 flex items-center justify-center text-[#0059bb] font-bold text-xs">
                  RM
                </div>
                <div>
                  <p className="font-bold text-xs text-[#001e40]">Ricardo M.</p>
                  <p className="text-[10px] text-[#43474f] uppercase tracking-wider">Sec. de Habitação - Capital</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border-2 border-[#0059bb]/20 shadow-md flex flex-col justify-between relative transform md:scale-105 z-10">
              <p className="text-xs text-[#43474f] leading-relaxed mb-6 italic">
                "A transparência do sistema nos deu tranquilidade perante os órgãos de controle. O portal do cidadão reduziu as filas presenciais em 80%."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0059bb]/10 flex items-center justify-center text-[#0059bb] font-bold text-xs">
                  AP
                </div>
                <div>
                  <p className="font-bold text-xs text-[#001e40]">Ana Paula S.</p>
                  <p className="text-[10px] text-[#43474f] uppercase tracking-wider">Gestora de Projetos Sociais</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-[#c3c6d1]/10 flex flex-col justify-between relative">
              <p className="text-xs text-[#43474f] leading-relaxed mb-6 italic">
                "A integração com mapas foi o grande diferencial. Conseguimos alocar as famílias próximas às suas redes de apoio social e de trabalho."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0059bb]/10 flex items-center justify-center text-[#0059bb] font-bold text-xs">
                  FG
                </div>
                <div>
                  <p className="font-bold text-xs text-[#001e40]">Felipe G.</p>
                  <p className="text-[10px] text-[#43474f] uppercase tracking-wider">Prefeito Municipal</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. Final CTA Section */}
      <section className="py-28 bg-[#f3f4f5] border-t border-[#c3c6d1]/10 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-heading font-black text-4xl text-[#001e40] mb-4 tracking-tight leading-none">
            Modernize a Gestão Habitacional do Seu Município
          </h2>

          <p className="text-[#43474f] text-sm max-w-xl mx-auto mb-10 leading-relaxed">
            Agende uma demonstração personalizada com nossos especialistas e veja como o SIGAH pode transformar o atendimento e a gestão urbana de moradia.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#0059bb] hover:bg-[#0059bb]/90 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] inline-flex items-center justify-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Falar com Especialista</span>
            </button>
            <button className="bg-white text-[#001e40] border border-[#c3c6d1] px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#f8f9fa] shadow-sm transition-all inline-flex items-center justify-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Baixar Whitepaper</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <LandingFooter />

    </div>
  );
}
