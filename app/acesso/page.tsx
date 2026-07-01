// =============================================================================
// app/inicio/page.tsx
// Tela de início / portal do cidadão (Passo 9.1).
// Apresenta o ponto de entrada do cidadão no SIGAH com layout responsivo:
// - Desktop: Split-screen (Opção B) com imagem flutuante à direita e conteúdo à esquerda.
// - Mobile: Imagem no topo com card flutuante branco para legibilidade absoluta.
// Alinhado com as diretrizes do DESIGN.md e o leiaute do Stitch.
// =============================================================================

import Link from "next/link";
import { LogIn, ShieldCheck } from "lucide-react";
import { LandingFooter } from "@/components/layout/LandingFooter";

export default function InicioPage() {
  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-secondary/10 selection:text-secondary">
      
      {/* 1. Header (Navegação Superior) */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 bg-gradient-to-br from-[#001e40] to-[#003366] rounded-lg flex items-center justify-center text-white font-heading font-black text-lg shadow-sm">
              S
            </div>
            <span className="font-heading font-black text-2xl tracking-tight text-[#001e40]">
              SIGAH
            </span>
          </div>
          <div>
            <button className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              Ajuda
            </button>
          </div>
        </div>
      </header>

      {/* 2. Conteúdo Principal */}
      <main className="flex-grow pt-16 flex flex-col justify-center">
        
        {/* LAYOUT MOBILE (lg:hidden) */}
        <div className="lg:hidden flex flex-col">
          {/* Imagem Hero */}
          <section className="w-full aspect-[4/3] relative overflow-hidden">
            <img 
              alt="Edifício residencial moderno de interesse social" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuASV-EUbhhqWALDEUjw9sU9aUT7llMauaHKsxoGn6d3WMOtgvtOZtWrkx-72Vun2RO0x98zhPnE0LTLwc_6YY1l046CrOKMjvx63QSw9a4fhOE1a3_8_nLCkrmpi6bljzUOYnu47mGKzW4BREaArXLLGTl11azAzDwdcwNoPJCiwkL7Vck0maHJLKpVlTpbLl7EBgeDL0rnwWyHGfxVfaSfxeXM2ookbkIZ6-4Ril0WUq4cSJBnZlLW4DIP20sWEq2A_wFy32H70S0"
            />
            {/* Gradiente de escurecimento/fade no fundo */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
          </section>

          {/* Card Flutuante de Conteúdo */}
          <div className="w-full -mt-16 relative z-10 pb-12">
            <div className="bg-white rounded-t-2xl p-6 space-y-6 shadow-[0_-8px_32px_rgba(0,30,64,0.08)] border-t border-outline-variant/10">
              {/* Título e Texto */}
              <div className="space-y-3">
                <h1 className="font-heading font-extrabold text-3xl text-primary leading-tight tracking-tight">
                  Conquiste sua casa própria com transparência.
                </h1>
                <p className="text-on-surface-variant text-base leading-relaxed">
                  Acompanhe programas habitacionais, realize seu cadastro e planeje o futuro da sua família com segurança e agilidade institucional.
                </p>
              </div>

              {/* Botões CTA */}
              <div className="flex flex-col gap-3">
                <Link 
                  href="/auth/login"
                  className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-xl font-bold text-center text-base shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Entrar</span>
                  <LogIn className="w-4 h-4" />
                </Link>
                
                <Link 
                  href="/auth/cadastro"
                  className="w-full border-2 border-primary text-primary py-4 rounded-xl font-bold text-center text-base bg-white hover:bg-surface-container-low active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
                >
                  Criar Conta
                </Link>
              </div>

              {/* Banner de Segurança */}
              <div className="bg-secondary-fixed/40 border border-secondary-container/10 p-4 rounded-2xl flex gap-3.5 items-center shadow-sm">
                <div className="bg-primary text-white p-2.5 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-on-surface text-sm leading-tight">
                    O cadastro é <span className="font-bold text-primary">100% GRATUITO</span>. Não aceite cobranças de terceiros ou intermediários.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LAYOUT DESKTOP (hidden lg:block) */}
        <div className="hidden lg:block max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
          <div className="grid grid-cols-12 gap-16 items-center">
            
            {/* Esquerda: Conteúdo Editorial */}
            <div className="col-span-6 space-y-8">
              
              {/* Headlines */}
              <div className="space-y-4 max-w-xl">
                <h1 className="font-heading font-black text-4xl xl:text-5xl text-primary leading-tight tracking-tight">
                  Conquiste sua casa própria com transparência.
                </h1>
                <p className="text-on-surface-variant text-lg xl:text-xl leading-relaxed">
                  Acompanhe programas habitacionais, realize seu cadastro e planeje o futuro da sua família com segurança e agilidade institucional.
                </p>
              </div>

              {/* Botões CTA */}
              <div className="flex gap-4 max-w-md">
                <Link 
                  href="/auth/login"
                  className="flex-1 bg-gradient-to-br from-primary to-primary-container text-white py-4 px-8 rounded-xl font-bold text-center text-sm shadow-md hover:shadow-[0_16px_32px_rgba(0,30,64,0.12)] hover:opacity-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  <span>Entrar</span>
                  <LogIn className="w-4 h-4" />
                </Link>
                
                <Link 
                  href="/auth/cadastro"
                  className="flex-1 border-2 border-primary text-primary py-4 px-8 rounded-xl font-bold text-center text-sm bg-white hover:bg-surface-container-low transition-all duration-300 flex items-center justify-center cursor-pointer select-none"
                >
                  Criar Conta
                </Link>
              </div>

              {/* Banner de Segurança */}
              <div className="bg-secondary-fixed/40 border border-secondary-container/10 p-5 rounded-2xl flex gap-4 items-center shadow-sm max-w-lg">
                <div className="bg-primary text-white p-2.5 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-on-surface text-base leading-tight">
                    O cadastro é <span className="font-extrabold text-primary">100% GRATUITO</span>. Não aceite cobranças de terceiros ou intermediários.
                  </p>
                </div>
              </div>

            </div>

            {/* Direita: Imagem como Floating Card (de acordo com DESIGN.md) */}
            <div className="col-span-6">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_24px_48px_rgba(0,30,64,0.08)] border border-outline-variant/15">
                <img 
                  alt="Edifício residencial moderno de interesse social" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuASV-EUbhhqWALDEUjw9sU9aUT7llMauaHKsxoGn6d3WMOtgvtOZtWrkx-72Vun2RO0x98zhPnE0LTLwc_6YY1l046CrOKMjvx63QSw9a4fhOE1a3_8_nLCkrmpi6bljzUOYnu47mGKzW4BREaArXLLGTl11azAzDwdcwNoPJCiwkL7Vck0maHJLKpVlTpbLl7EBgeDL0rnwWyHGfxVfaSfxeXM2ookbkIZ6-4Ril0WUq4cSJBnZlLW4DIP20sWEq2A_wFy32H70S0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/10 to-transparent"></div>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* 3. Rodapé */}
      <LandingFooter />

    </div>
  );
}
